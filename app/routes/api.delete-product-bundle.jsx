import { authenticate } from '../shopify.server';
import prisma from "../db.server";
import { json } from '@remix-run/node';
import { fetchShop } from '../utils/getShop';
import { updateAllBundleMetafields } from '../utils/saveOfferSettings';

export async function action({ request }) {
  const { admin } = await authenticate.admin(request);
  const formData = await request.formData();
  const bundleId = formData.get("bundleId");

  if (!bundleId) {
    return json({ success: false, message: "Product bundle ID is required." }, { status: 400 });
  }

  const shop = await fetchShop(request);
  const shopId = shop.id;

  try {
    // Get product bundle data before deletion
    const productBundle = await prisma.bundle.findFirst({
      where: {
        id: parseInt(bundleId),
        shop: shopId,
      },
      include: {
        products: true,
      },
    });

    if (!productBundle) {
      return json({ success: false, message: "Product bundle not found." }, { status: 404 });
    }

    const bundleName = productBundle.name;
    console.log(`Starting deletion process for product bundle: ${bundleName} (ID: ${bundleId})`);

    // 1. Delete bundle products first (due to foreign key constraints)
    await prisma.bundleProduct.deleteMany({
      where: {
        bundleId: parseInt(bundleId),
      },
    });
    console.log("✅ Deleted bundle products from database");

    // 2. Delete the product bundle from database
    await prisma.bundle.delete({
      where: {
        id: parseInt(bundleId),
      },
    });
    console.log("✅ Deleted product bundle from database");

    // 3. Delete the individual metafield
    const metafieldKey = `offer-settings-${bundleName.toLowerCase().replace(/[^a-z0-9]/g, '-')}`;
    try {
      // Delete the metafield using ownerId, namespace, and key
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
              namespace: "product-bundle",
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
      console.warn("⚠️ Could not delete product bundle metafield:", metafieldError);
    }

    // 4. Update consolidated metafield (remove this product bundle from all-offers)
    try {
      await updateAllBundleMetafields(request, shopId);
      console.log("✅ Updated consolidated metafield after product bundle deletion");
    } catch (consolidatedError) {
      console.warn("⚠️ Could not update consolidated metafield:", consolidatedError);
    }

    // 5. Delete the Shopify discount (if exists)
    try {
      const discountTitle = `Bundle Discount - ${bundleName}`;
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
      message: `Product bundle "${bundleName}" deleted successfully!`
    });

  } catch (error) {
    console.error("❌ Error deleting product bundle:", error);
    return json({ 
      success: false, 
      message: "Failed to delete product bundle." 
    }, { status: 500 });
  }
}