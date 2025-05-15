import prisma from "../db.server";
import { json } from "@remix-run/react";
import { authenticate } from "../shopify.server";

export async function action({ request }) {
  const formData = await request.formData();
  const bundleData = JSON.parse(formData.get("bundleData"));

  const { admin } = await authenticate.admin(request);

  const response = await admin.graphql(`
        query{
            shop {
                name
                id
            }
        }
    `);

  const shopData = await response.json();
  const shopId = shopData.data.shop.id;

  // console.log("shopId", shopId);

  try {
    // Check if a bundle with the same name already exists
    const existingBundle = await prisma.bundle.findFirst({
      where: {
        name: bundleData.bundleName,
        shop: shopId, // Also filter by shop ID to allow same bundle names across different shops
      },
    });

    if (existingBundle) {
      return json({
        success: false,
        error:
          "A bundle with this name already exists. Please choose a different name.",
      });
    }

    // Check if there's any published bundle
    const publishedBundle = await prisma.bundle.findFirst({
      where: {
        shop: shopId,
        status: "published",
      },
    });

    if (publishedBundle) {
      return json({
        success: false,
        error:
          "Another bundle is already published. Please set the other bundle to draft first or save this bundle as draft.",
      });
    }

    const savedBundle = await prisma.bundle.create({
      data: {
        shop: shopId, // Use the actual shop ID here
        status: bundleData.status,
        name: bundleData.bundleName,
        settings: {
          header: bundleData.headerText,
          alignment: bundleData.alignment,
          footer: bundleData.footerText,
          button: bundleData.buttonText,
          position: bundleData.position,
          publishOption: bundleData.publishOption,
          template: bundleData.selectedTemplate,
          color: bundleData.selectedColor,
          pricing: {
            option: bundleData.pricingOption,
            discountPercentage: bundleData.discountPercentage,
            fixedDiscount: bundleData.fixedDiscount,
            fixedPrice: bundleData.fixedPrice,
          },
          highlight: {
            option: bundleData.highlightOption,
            title: bundleData.highlightTitle,
            timerTitle: bundleData.highlightTimerTitle,
            isBlinking: bundleData.isBlinking,
            style: bundleData.highlightStyle,
            timerEndDate: bundleData.timerEndDate,
            timerFormat: bundleData.timerFormat,
          },
          typography: bundleData.typography,
          spacing: bundleData.spacing,
          shapes: bundleData.shapes,
          productImageSize: bundleData.productImageSize,
          iconStyle: bundleData.iconStyle,
          borderThickness: bundleData.borderThickness,
          colors: bundleData.colors,
          general: bundleData.settings,
        },
      },
    });

    // After creating the bundle, create the products
    if (bundleData.products && bundleData.products.length > 0) {
      await prisma.bundleProduct.createMany({
        data: bundleData.products.map((product) => ({
          bundleId: parseInt(savedBundle.id),
          productId: product.productId || "",
          productHandle: product.productHandle || "",
          name: product.name || "",
          quantity: product.quantity || 1,
          image: product.image || "",
        })),
      });
    }

    console.log("Bundle saved to Prisma:");
    return json({
      success: true,
      message: "Settings saved successfully",
      bundleData,
    });
  } catch (error) {
    console.error("Error saving bundle:", error);
    return json(
      {
        success: false,
        error: error.message,
      },
      {
        status: 500,
      },
    );
  }
}
