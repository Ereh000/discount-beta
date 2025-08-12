import { authenticate } from '../shopify.server';
import prisma from "../db.server";
import { json } from '@remix-run/node';
import { fetchShop } from '../utils/getShop';
import { updateAllBundleMetafields } from '../utils/saveOfferSettings';

export async function action({ request }) {
  const { admin } = await authenticate.admin(request);
  const formData = await request.formData();
  const volumeId = formData.get("volumeId");

  if (!volumeId) {
    return json({ success: false, message: "Volume discount ID is required." }, { status: 400 });
  }

  const shop = await fetchShop(request);
  const shopId = shop.id;

  try {
    // Get volume discount data before deletion
    const volumeDiscount = await prisma.volumeDiscount.findFirst({
      where: {
        id: parseInt(volumeId),
        shop: shopId,
      },
    });

    if (!volumeDiscount) {
      return json({ success: false, message: "Volume discount not found." }, { status: 404 });
    }

    const bundleName = volumeDiscount.bundleName;
    console.log(`Starting deletion process for volume discount: ${bundleName} (ID: ${volumeId})`);

    // 1. Delete the volume discount from database
    await prisma.volumeDiscount.delete({
      where: {
        id: parseInt(volumeId),
      },
    });
    console.log("✅ Deleted volume discount from database");

    // 2. Delete the individual metafield
    const metafieldKey = `offer-settings-${bundleName.toLowerCase().replace(/[^a-z0-9]/g, '-')}`;
    try {
      // Delete the metafield using ownerId, namespace, and key (no need to fetch ID first)
      const deleteMetafieldResponse = await admin.graphql(`
        mutation MetafieldsDelete($metafields: [MetafieldIdentifierInput!]!) {
          metafieldsDelete(metafields: $metafields) {
            deletedMetafields {
              key
              namespace
              ownerId
            }
            userErrors {
              field
              message
            }
          }
        }
      `, {
        variables: {
          metafields: [
            {
              ownerId: shopId,
              namespace: "volume-discount",
              key: metafieldKey
            }
          ]
        }
      });

      const deleteResult = await deleteMetafieldResponse.json();
      
      if (deleteResult.data?.metafieldsDelete?.userErrors?.length > 0) {
        console.warn("Metafield deletion errors:", deleteResult.data.metafieldsDelete.userErrors);
      } else if (deleteResult.data?.metafieldsDelete?.deletedMetafields?.length > 0) {
        console.log(`✅ Deleted metafield: ${metafieldKey}`);
      } else {
        console.log(`⚠️ Metafield not found or already deleted: ${metafieldKey}`);
      }
    } catch (metafieldError) {
      console.warn("⚠️ Could not delete volume discount metafield:", metafieldError);
    }

    // 3. Update consolidated metafield (remove this volume discount from all-offers)
    try {
      await updateAllBundleMetafields(request, shopId);
      console.log("✅ Updated consolidated metafield after volume discount deletion");
    } catch (consolidatedError) {
      console.warn("⚠️ Could not update consolidated metafield:", consolidatedError);
    }

    // 4. Delete the Shopify discount (if exists)
    try {
      const discountTitle = `Volume Discount - ${bundleName}`;
      const existingDiscountResponse = await admin.graphql(`
        query {
          discountNodes(first: 50) {
            edges {
              node {
                id
                discount {
                  ... on DiscountAutomaticApp {
                    title
                  }
                }
              }
            }
          }
        }
      `);

      const existingDiscountData = await existingDiscountResponse.json();
      const existingDiscountNode = existingDiscountData.data?.discountNodes?.edges
        .find(edge => edge.node.discount?.title === discountTitle)?.node;

      if (existingDiscountNode) {
        await admin.graphql(`
          mutation discountAutomaticDelete($id: ID!) {
            discountAutomaticDelete(id: $id) {
              deletedAutomaticDiscountId
              userErrors {
                field
                message
              }
            }
          }
        `, {
          variables: {
            id: existingDiscountNode.id
          }
        });
        console.log(`✅ Deleted Shopify discount: ${discountTitle}`);
      } else {
        console.log(`⚠️ Shopify discount not found: ${discountTitle}`);
      }
    } catch (discountError) {
      console.log("⚠️ Could not delete Shopify discount:", discountError);
    }

    return json({ 
      success: true, 
      message: `Volume discount "${bundleName}" deleted successfully!`
    });

  } catch (error) {
    console.error("❌ Error deleting volume discount:", error);
    return json({ 
      success: false, 
      message: "Failed to delete volume discount." 
    }, { status: 500 });
  }
}
