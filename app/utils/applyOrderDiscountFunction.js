// utils/applyOrderDiscountFunction.js

export async function applyOrderDiscountFunction(admin, bundleName, isEdit = false) {
  try {
    // --- Fetch Shopify Functions ---
    const functionResponse = await admin.graphql(
      `query {  
        shopifyFunctions(first: 25) {
          nodes {
            id
            title
            apiType
            app {
              title
            }
          }
        }
      }`
    );

    const shopifyFunctionsData = await functionResponse.json();
    const functions = shopifyFunctionsData.data?.shopifyFunctions?.nodes;

    if (!functions) {
      console.error("Could not fetch Shopify Functions.");
      throw new Error("Could not fetch required Shopify functions.");
    }

    // Find the specific order-discount function by title
    const orderDiscountFunction = functions.find(
      (func) => func.title === "order-discount" && func.apiType === "order_discounts"
    );

    if (!orderDiscountFunction) {
      console.error("Function 'order-discount' not found.");
      throw new Error("The required Shopify function 'order-discount' was not found or is not deployed.");
    }

    const functionId = orderDiscountFunction.id;
    console.log(`Found function 'order-discount' with ID: ${functionId}`);

    // Create unique discount title based on bundle name
    const discountTitle = `Volume Discount - ${bundleName}`;
    console.log(`Looking for existing discount with title: ${discountTitle}`);

    // --- Check for Existing Discount ---
    const existingDiscountResponse = await admin.graphql(
      `query {
        discountNodes(first: 50) {
          edges {
            node {
              id
              discount {
                ... on DiscountAutomaticApp {
                  title
                  status
                  createdAt
                  endsAt
                  startsAt
                  appDiscountType {
                    functionId
                  }
                }
              }
            }
          }
        }
      }`
    );

    const existingDiscountData = await existingDiscountResponse.json();
    
    // Log all discounts for debugging
    console.log("All existing discounts:", existingDiscountData.data?.discountNodes?.edges.map(edge => ({
      id: edge.node.id,
      title: edge.node.discount?.title,
      type: edge.node.discount?.__typename
    })));

    // Find discount with exact title match
    const existingDiscountNode = existingDiscountData.data?.discountNodes?.edges
      .find(edge => {
        const discount = edge.node.discount;
        const isMatch = discount && 
                       discount.title === discountTitle && 
                       (discount.__typename === 'DiscountAutomaticApp' || !discount.__typename);
        
        if (isMatch) {
          console.log(`Found matching discount: ${discount.title} with ID: ${edge.node.id}`);
        }
        
        return isMatch;
      })?.node;

    let discountMutation;
    let discountVariables;
    let operationType;

    if (existingDiscountNode) {
      // --- Update Existing Discount (whether edit mode or create mode) ---
      console.log(`Updating existing discount '${discountTitle}' with ID: ${existingDiscountNode.id}`);
      
      discountMutation = `mutation discountAutomaticAppUpdate($automaticAppDiscount: DiscountAutomaticAppInput!, $id: ID!) {
        discountAutomaticAppUpdate(automaticAppDiscount: $automaticAppDiscount, id: $id) {
          automaticAppDiscount {
            title
            status
            appDiscountType {
              appKey
              functionId
            }
          }
          userErrors {
            field
            message
          }
        }
      }`;

      discountVariables = {
        id: existingDiscountNode.id,
        automaticAppDiscount: {
          title: discountTitle,
          functionId: functionId,
          combinesWith: {
            orderDiscounts: false,
            productDiscounts: true,
            shippingDiscounts: true
          },
          startsAt: new Date().toISOString()
        }
      };
      operationType = 'update';
    } else {
      // --- Create New Automatic Discount (only if none exists) ---
      console.log(`No existing discount found. Creating new discount: '${discountTitle}'`);
      
      discountMutation = `mutation discountAutomaticAppCreate($automaticAppDiscount: DiscountAutomaticAppInput!) {
        discountAutomaticAppCreate(automaticAppDiscount: $automaticAppDiscount) {
          automaticAppDiscount {
            discountId
            title
            status
          }
          userErrors {
            field
            message
            code
          }
        }
      }`;

      discountVariables = {
        automaticAppDiscount: {
          title: discountTitle,
          functionId: functionId,
          combinesWith: {
            orderDiscounts: false,
            productDiscounts: true,
            shippingDiscounts: true
          },
          startsAt: new Date().toISOString()
        }
      };
      operationType = 'create';
    }

    // --- Execute Create or Update Mutation ---
    console.log(`Executing ${operationType} operation for '${discountTitle}'`);
    
    const automaticDiscountResponse = await admin.graphql(
      discountMutation,
      { variables: discountVariables }
    );

    const discountResult = await automaticDiscountResponse.json();
    console.log(`${operationType} result:`, JSON.stringify(discountResult, null, 2));
    
    const mutationResult = operationType === 'update' 
      ? discountResult.data?.discountAutomaticAppUpdate
      : discountResult.data?.discountAutomaticAppCreate;

    if (mutationResult?.userErrors?.length > 0) {
      console.error(`Automatic Discount ${operationType} errors:`, mutationResult.userErrors);
      throw new Error(mutationResult.userErrors.map((e) => e.message).join(", "));
    } else if (mutationResult?.automaticAppDiscount) {
      const discountInfo = mutationResult.automaticAppDiscount;
      console.log(`Successfully ${operationType}d Automatic Discount '${discountTitle}':`, discountInfo);
      
      return {
        title: discountInfo.title,
        status: discountInfo.status,
        discountId: operationType === 'create' ? discountInfo.discountId : existingDiscountNode.id,
        appDiscountType: discountInfo.appDiscountType,
        operation: operationType,
        functionTitle: discountTitle,
        wasExisting: !!existingDiscountNode
      };
    } else {
      console.error(`Failed to ${operationType} Automatic Discount:`, discountResult);
      throw new Error(`Failed to ${operationType} the order discount function.`);
    }

  } catch (error) {
    console.error("Error applying order discount function:", error);
    throw error;
  }
}
