// utils/saveOffersSettings.jsx

import prisma from '../db.server';
import { authenticate } from '../shopify.server';

export async function saveOfferSettings(request, shopId, offerSettings, bundleName) {
  const { admin } = await authenticate.admin(request);
  
  try {
    // Create unique metafield key based on bundle name
    const metafieldKey = `offer-settings-${bundleName.toLowerCase().replace(/[^a-z0-9]/g, '-')}`;
    
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
          namespace: "volume-discount",
          key: metafieldKey,
          type: "json",
          value: JSON.stringify({
            bundleName: bundleName,
            offers: offerSettings.offers,
            selectedOfferIndex: offerSettings.selectedOfferIndex,
            updatedAt: new Date().toISOString()
          }),
          ownerId: shopId
        }]
      }
    });

    const result = await response.json();
    
    if (result.data.metafieldsSet.userErrors.length > 0) {
      console.error("Metafield errors:", result.data.metafieldsSet.userErrors);
      return null;
    }

    return result.data.metafieldsSet.metafields[0];
  } catch (error) {
    console.error("Error saving offer settings:", error);
    return null;
  }
}

// Function to update all metafields when bundles change
export async function updateAllBundleMetafields(request, shopId) {
  const { admin } = await authenticate.admin(request);
  
  try {
    // Get all published volume discounts from database
    const publishedVolumes = await prisma.volumeDiscount.findMany({
      where: { 
        shop: shopId,
        status: "published"
      },
      orderBy: { createdAt: 'desc' }
    });

    // Create consolidated metafield with all published offers
    const allOffers = publishedVolumes.map(volume => ({
      bundleId: volume.id,
      bundleName: volume.bundleName,
      metafieldKey: `offer-settings-${volume.bundleName.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
      offers: volume.settings?.offerSettings?.offers || [],
      selectedOfferIndex: volume.settings?.offerSettings?.selectedOfferIndex || 0,
      updatedAt: volume.updatedAt
    }));

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
          namespace: "volume-discount",
          key: "all-offers",
          type: "json",
          value: JSON.stringify(allOffers),
          ownerId: shopId
        }]
      }
    });

    return response;
  } catch (error) {
    console.error("Error updating all bundle metafields:", error);
    return null;
  }
}
