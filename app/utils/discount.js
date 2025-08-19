// utils/discount.js

/**
 * Fetch the ID of the app's order discount function
 */
export async function getOrderDiscountFunctionId(admin) {
  const response = await admin.graphql(`
    query {
      shopifyFunctions(first: 50) {
        nodes {
          id
          title
          apiType
          app {
            title
          }
        }
      }
    }
  `);

  const json = await response.json();
  const functions = json.data?.shopifyFunctions?.nodes || [];

  const orderDiscountFunction = functions.find(
    (func) => func.title === "product-bundle-discount" && func.apiType === "order_discounts"
  );

  if (!orderDiscountFunction) {
    throw new Error("Order discount function 'order-discount' not found or not deployed");
  }

  return orderDiscountFunction.id;
}

/**
 * Check for existing discount with same title
 */
export async function findExistingDiscount(admin, discountTitle) {
  const response = await admin.graphql(`
    query {
      discountNodes(first: 50) {
        edges {
          node {
            id
            discount {
              ... on DiscountAutomaticApp {
                title
                status
                appDiscountType {
                  functionId
                }
              }
            }
          }
        }
      }
    }
  `);

  const json = await response.json();
  const discountNodes = json.data?.discountNodes?.edges || [];

  const existingDiscount = discountNodes.find(edge => {
    const discount = edge.node.discount;
    return discount && 
           discount.title === discountTitle && 
           discount.__typename === 'DiscountAutomaticApp';
  });

  return existingDiscount ? existingDiscount.node : null;
}

/**
 * Create or update automatic app discount
 */
export async function createOrUpdateAutomaticDiscount(admin, discountData, bundleData) {
  const functionId = await getOrderDiscountFunctionId(admin);
  const discountTitle = `Bundle Discount - ${bundleData.bundleName}`;
  
  // Check for existing discount
  const existingDiscount = await findExistingDiscount(admin, discountTitle);
  
  // Prepare metafield data
  const metafieldData = {
    bundleId: discountData.bundleId,
    bundleName: bundleData.bundleName,
    pricingOption: bundleData.pricingOption,
    discountValue: bundleData.pricingOption === "percentage" ? bundleData.discountPercentage :
                   bundleData.pricingOption === "fixedDiscount" ? bundleData.fixedDiscount :
                   bundleData.fixedPrice,
    targetResources: bundleData.selectedResourceIds || [],
    position: bundleData.position,
    updatedAt: new Date().toISOString()
  };

  let mutation, variables, operationType;

  if (existingDiscount) {
    // Update existing discount
    mutation = `
      mutation discountAutomaticAppUpdate($automaticAppDiscount: DiscountAutomaticAppInput!, $id: ID!) {
        discountAutomaticAppUpdate(automaticAppDiscount: $automaticAppDiscount, id: $id) {
          automaticAppDiscount {
            title
            status
            discountId
            appDiscountType {
              functionId
            }
          }
          userErrors {
            field
            message
          }
        }
      }
    `;

    variables = {
      id: existingDiscount.id,
      automaticAppDiscount: {
        title: discountTitle,
        functionId: functionId,
        combinesWith: {
          orderDiscounts: false,
          productDiscounts: true,
          shippingDiscounts: true
        },
        startsAt: new Date().toISOString(),
        metafields: [
          {
            namespace: "bundle_discount",
            key: "config",
            value: JSON.stringify(metafieldData),
            type: "json" // This was missing - causing the error!
          }
        ]
      }
    };
    operationType = 'update';
  } else {
    // Create new discount
    mutation = `
      mutation discountAutomaticAppCreate($automaticAppDiscount: DiscountAutomaticAppInput!) {
        discountAutomaticAppCreate(automaticAppDiscount: $automaticAppDiscount) {
          automaticAppDiscount {
            discountId
            title
            status
            appDiscountType {
              functionId
            }
          }
          userErrors {
            field
            message
            code
          }
        }
      }
    `;

    variables = {
      automaticAppDiscount: {
        title: discountTitle,
        functionId: functionId,
        combinesWith: {
          orderDiscounts: false,
          productDiscounts: true,
          shippingDiscounts: true
        },
        startsAt: new Date().toISOString(),
        metafields: [
          {
            namespace: "bundle_discount",
            key: "config",
            value: JSON.stringify(metafieldData),
            type: "json" // This was missing - causing the error!
          }
        ]
      }
    };
    operationType = 'create';
  }

  console.log(`Executing ${operationType} operation for '${discountTitle}'`);
  
  const response = await admin.graphql(mutation, { variables });
  const result = await response.json();
  
  console.log(`${operationType} result:`, JSON.stringify(result, null, 2));
  
  const mutationResult = operationType === 'update' 
    ? result.data?.discountAutomaticAppUpdate
    : result.data?.discountAutomaticAppCreate;

  if (mutationResult?.userErrors?.length > 0) {
    console.error(`Automatic Discount ${operationType} errors:`, mutationResult.userErrors);
    throw new Error(mutationResult.userErrors.map((e) => e.message).join(", "));
  }

  if (!mutationResult?.automaticAppDiscount) {
    console.error(`Failed to ${operationType} Automatic Discount:`, result);
    throw new Error(`Failed to ${operationType} the bundle discount function.`);
  }

  const discountInfo = mutationResult.automaticAppDiscount;
  console.log(`Successfully ${operationType}d Automatic Discount '${discountTitle}':`, discountInfo);
  
  return {
    title: discountInfo.title,
    status: discountInfo.status,
    discountId: operationType === 'create' ? discountInfo.discountId : existingDiscount.id,
    appDiscountType: discountInfo.appDiscountType,
    operation: operationType,
    functionTitle: discountTitle,
    wasExisting: !!existingDiscount
  };
}
