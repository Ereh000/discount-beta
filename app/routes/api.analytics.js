import { json } from "@remix-run/node";
import { authenticate } from "../shopify.server";
import prisma from "../db.server";

export const action = async ({ request }) => {
  console.log("analytics api hit successfully");
  const { session } = await authenticate.public.appProxy(request);
  const shop = session?.shop;

  if (!shop) {
    return json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const {
      type,
      bundleId,
      bundleName,
      orderId,
      orderNumber,
      customerId,
      revenue,
      productIds,
    } = body;

    if (!type || !bundleId) {
      return json(
        { error: "Missing required fields: type and bundleId" },
        { status: 400 },
      );
    }

    // Validate analytics type
    const validTypes = ["IMPRESSION", "ADD_TO_CART", "ORDER"];
    if (!validTypes.includes(type)) {
      return json({ error: "Invalid analytics type" }, { status: 400 });
    }

    await prisma.bundleAnalytics.create({
      data: {
        shopDomain: shop,
        type,
        bundleId,
        bundleName,
        orderId,
        orderNumber,
        customerId,
        revenue: revenue ? parseFloat(revenue) : null,
        productIds: productIds || [],
      },
    });

    return json({ success: true });
  } catch (error) {
    console.error("Analytics tracking error:", error);
    return json({ error: "Internal server error" }, { status: 500 });
  }
};
