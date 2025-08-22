import { authenticate } from "../shopify.server";
import prisma from "../db.server";

export const action = async ({ request }) => {
  const { topic, shop, session, admin, payload } =
    await authenticate.webhook(request);

  if (!admin || topic !== "ORDERS_CREATE") {
    throw new Response();
  }

  try {
    const order = payload;

    // Process line items to find bundle products
    const bundleItems =
      order.line_items?.filter((item) =>
        item.properties?.some(
          (prop) =>
            prop.name === "_bundle_source" && prop.value === "volume_discount",
        ),
      ) || [];

    if (bundleItems.length === 0) {
      throw new Response();
    }

    // Group items by bundle_id
    const bundles = {};
    bundleItems.forEach((item) => {
      const bundleId = item.properties?.find(
        (prop) => prop.name === "_bundle_id",
      )?.value;
      const bundleName = item.properties?.find(
        (prop) => prop.name === "_bundle_name",
      )?.value;

      if (bundleId) {
        if (!bundles[bundleId]) {
          bundles[bundleId] = {
            bundleId,
            bundleName,
            revenue: 0,
            productIds: [],
          };
        }

        bundles[bundleId].revenue += parseFloat(item.price) * item.quantity;
        bundles[bundleId].productIds.push(item.product_id.toString());
      }
    });

    // Save analytics for each bundle
    for (const bundle of Object.values(bundles)) {
      await prisma.bundleAnalytics.create({
        data: {
          shopDomain: shop,
          type: "ORDER",
          bundleId: bundle.bundleId,
          bundleName: bundle.bundleName,
          orderId: order.id.toString(),
          orderNumber: order.order_number,
          customerId: order.customer?.id?.toString(),
          revenue: bundle.revenue,
          productIds: [...new Set(bundle.productIds)], // Remove duplicates
        },
      });
    }

    throw new Response();
  } catch (error) {
    console.error("Webhook processing error:", error);
    throw new Response();
  }
};
