// utils/metafield.js

// utils/metafield.js

export async function saveDiscountToMetafield(admin, shopId, discountData) {
  try {
    // Create unique metafield key based on bundle name
    const metafieldKey = `bundle-discount-${discountData.bundleName.toLowerCase().replace(/[^a-z0-9]/g, '-')}`;
    
    const response = await admin.graphql(`
      mutation SetMetafield($metafields: [MetafieldsSetInput!]!) {
        metafieldsSet(metafields: $metafields) {
          metafields {
            id
            namespace
            key
            value
          }
          userErrors {
            field
            message
            code
          }
        }
      }
    `, {
      variables: {
        metafields: [{
          namespace: "bundle-discounts",
          key: metafieldKey,
          type: "json",
          value: JSON.stringify({
            bundleId: discountData.bundleId,
            bundleName: discountData.bundleName,
            pricingOption: discountData.pricingOption,
            discountValue: discountData.discountValue,
            selectedResourceIds: discountData.selectedResourceIds || [],
            position: discountData.position,
            shopifyDiscountId: discountData.shopifyDiscountId,
            products: discountData.products || [], // Ensure products are included
            createdAt: discountData.createdAt || new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }),
          ownerId: shopId
        }]
      }
    });

    const result = await response.json();
    
    if (result.data?.metafieldsSet?.userErrors?.length > 0) {
      console.error("Metafield errors:", result.data.metafieldsSet.userErrors);
      throw new Error(result.data.metafieldsSet.userErrors[0].message);
    }

    return result.data?.metafieldsSet?.metafields?.[0];

  } catch (error) {
    console.error("Error saving discount to metafield:", error);
    throw error;
  }
}


/**
 * Update consolidated metafield with all bundle discounts
 */
export async function updateAllBundleDiscountsMetafield(admin, shopId) {
  try {
    console.log("Updating consolidated bundle discounts metafield...");
    
    // Get all individual bundle discount metafields
    const response = await admin.graphql(`
      query getShopMetafields($namespace: String!) {
        shop {
          metafields(namespace: $namespace, first: 50) {
            edges {
              node {
                id
                key
                value
                namespace
              }
            }
          }
        }
      }
    `, {
      variables: {
        namespace: "bundle-discounts"
      }
    });

    const result = await response.json();
    const metafields = result.data?.shop?.metafields?.edges || [];
    
    // Parse all individual bundle discount metafields
    const allBundleDiscounts = [];
    
    metafields.forEach(edge => {
      const metafield = edge.node;
      
      // Skip the consolidated metafield itself
      if (metafield.key === "all-bundles") {
        return;
      }
      
      try {
        const bundleData = JSON.parse(metafield.value);
        if (bundleData.bundleId && bundleData.bundleName) {
          allBundleDiscounts.push(bundleData);
        }
      } catch (error) {
        console.error(`Error parsing metafield ${metafield.key}:`, error);
      }
    });

    console.log(`Found ${allBundleDiscounts.length} bundle discounts to consolidate`);

    // Create/update the consolidated metafield
    const consolidatedResponse = await admin.graphql(`
      mutation SetMetafield($metafields: [MetafieldsSetInput!]!) {
        metafieldsSet(metafields: $metafields) {
          metafields {
            id
            namespace
            key
            value
          }
          userErrors {
            field
            message
            code
          }
        }
      }
    `, {
      variables: {
        metafields: [{
          namespace: "bundle-discounts",
          key: "all-bundles",
          type: "json",
          value: JSON.stringify(allBundleDiscounts),
          ownerId: shopId
        }]
      }
    });

    const consolidatedResult = await consolidatedResponse.json();
    
    if (consolidatedResult.data?.metafieldsSet?.userErrors?.length > 0) {
      throw new Error(consolidatedResult.data.metafieldsSet.userErrors[0].message);
    }

    console.log("Consolidated metafield updated successfully");
    return consolidatedResult.data?.metafieldsSet?.metafields?.[0];

    
  } catch (error) {
    console.error("Error updating consolidated bundle discounts metafield:", error);
    throw error;
  }
}
