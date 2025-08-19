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
    throw new Error("Order discount function 'product-bundle-discount' not found or not deployed");
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

  console.log("All existing discounts:", discountNodes.map(edge => ({
    id: edge.node.id,
    title: edge.node.discount?.title,
    type: edge.node.discount?.__typename
  })));

  const existingDiscountNode = discountNodes.find(edge => {
    const discount = edge.node.discount;
    const isMatch = discount && 
                   discount.title === discountTitle && 
                   (discount.__typename === 'DiscountAutomaticApp' || !discount.__typename);
    
    if (isMatch) {
      console.log(`Found matching discount: ${discount.title} with ID: ${edge.node.id}`);
    }
    
    return isMatch;
  })?.node;

  return existingDiscountNode;
}

/**
 * Update existing discount metafield separately
 */
async function updateDiscountMetafield(admin, discountId, metafieldData) {
  try {
    // First, get existing metafields to find the one we need to update
    const getMetafieldsResponse = await admin.graphql(`
      query getDiscountMetafields($id: ID!) {
        discountNode(id: $id) {
          metafields(first: 10, namespace: "bundle_discount") {
            edges {
              node {
                id
                namespace
                key
                value
              }
            }
          }
        }
      }
    `, {
      variables: { id: discountId }
    });

    const metafieldsResult = await getMetafieldsResponse.json();
    const existingMetafields = metafieldsResult.data?.discountNode?.metafields?.edges || [];
    
    // Find the config metafield
    const configMetafield = existingMetafields.find(edge => 
      edge.node.key === "config" && edge.node.namespace === "bundle_discount"
    );

    if (configMetafield) {
      // Update existing metafield
      const updateResponse = await admin.graphql(`
        mutation metafieldUpdate($metafield: MetafieldInput!) {
          metafieldUpdate(metafield: $metafield) {
            metafield {
              id
              namespace
              key
              value
            }
            userErrors {
              field
              message
            }
          }
        }
      `, {
        variables: {
          metafield: {
            id: configMetafield.node.id,
            value: JSON.stringify(metafieldData)
          }
        }
      });

      const updateResult = await updateResponse.json();
      if (updateResult.data?.metafieldUpdate?.userErrors?.length > 0) {
        console.error("Metafield update errors:", updateResult.data.metafieldUpdate.userErrors);
      } else {
        console.log("Metafield updated successfully");
      }
    } else {
      console.log("No existing metafield found, will be created with new discount");
    }
  } catch (error) {
    console.error("Error updating discount metafield:", error);
    // Don't throw - this shouldn't fail the discount update
  }
}

/**
 * Create or update automatic app discount
 */
export async function createOrUpdateAutomaticDiscount(admin, discountData, bundleData) {
  const functionId = await getOrderDiscountFunctionId(admin);
  const discountTitle = `Bundle Discount - ${bundleData.bundleName}`;
  
  console.log(`Looking for existing discount with title: ${discountTitle}`);
  
  const existingDiscountNode = await findExistingDiscount(admin, discountTitle);
  
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

  if (existingDiscountNode) {
    // --- Update Existing Discount (WITHOUT metafields to avoid uniqueness error) ---
    console.log(`Updating existing discount '${discountTitle}' with ID: ${existingDiscountNode.id}`);
    
    mutation = `
      mutation discountAutomaticAppUpdate($automaticAppDiscount: DiscountAutomaticAppInput!, $id: ID!) {
        discountAutomaticAppUpdate(automaticAppDiscount: $automaticAppDiscount, id: $id) {
          automaticAppDiscount {
            title
            status
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
        // NO metafields here - we'll update them separately
      }
    };
    operationType = 'update';
  } else {
    // --- Create New Automatic Discount (WITH metafields) ---
    console.log(`No existing discount found. Creating new discount: '${discountTitle}'`);
    
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
            type: "json"
          }
        ]
      }
    };
    operationType = 'create';
  }

  // --- Execute Create or Update Mutation ---
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

  // If updating, update the metafield separately
  if (operationType === 'update') {
    await updateDiscountMetafield(admin, existingDiscountNode.id, metafieldData);
  }

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
}
