import prisma from "../db.server";
import { json } from "@remix-run/node";
import { authenticate } from "../shopify.server";

export async function action({ request }) {
  const formData = await request.formData();
  const bundleDataString = formData.get("bundleData");
  
  if (!bundleDataString) {
    return json({
      success: false,
      error: "No bundle data provided."
    }, { status: 400 });
  }

  const bundleData = JSON.parse(bundleDataString);
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

  try {
    const isEdit = bundleData.isEdit && bundleData.bundleId !== "new";
    let savedBundle;

    if (isEdit) {
      // Update existing bundle
      
      // First, check if trying to publish and another bundle is already published
      if (bundleData.status === "published") {
        const otherPublishedBundle = await prisma.bundle.findFirst({
          where: {
            shop: shopId,
            status: "published",
            id: { not: parseInt(bundleData.bundleId) }, // Exclude current bundle
          },
        });

        if (otherPublishedBundle) {
          return json({
            success: false,
            error: "Another bundle is already published. Please set the other bundle to draft first or save this bundle as draft.",
          });
        }
      }

      // Update the bundle
      savedBundle = await prisma.bundle.update({
        where: {
          id: parseInt(bundleData.bundleId),
        },
        data: {
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
          updatedAt: new Date(),
        },
      });

      // Delete existing bundle products and create new ones
      await prisma.bundleProduct.deleteMany({
        where: { bundleId: parseInt(bundleData.bundleId) },
      });

      if (bundleData.products && bundleData.products.length > 0) {
        await prisma.bundleProduct.createMany({
          data: bundleData.products
            .filter(product => product.name && product.name.trim() !== '')
            .map((product) => ({
              bundleId: parseInt(savedBundle.id),
              productId: product.productId || "",
              productHandle: product.productHandle || "",
              name: product.name || "",
              quantity: product.quantity || 1,
              image: product.image || "",
            })),
        });
      }

      return json({
        success: true,
        message: "Bundle updated successfully!",
        bundleData,
      });

    } else {
      // Create new bundle
      
      // Check if a bundle with the same name already exists
      const existingBundle = await prisma.bundle.findFirst({
        where: {
          name: bundleData.bundleName,
          shop: shopId,
        },
      });

      if (existingBundle) {
        return json({
          success: false,
          error: "A bundle with this name already exists. Please choose a different name.",
        });
      }

      // Check if there's any published bundle when trying to publish
      if (bundleData.status === "published") {
        const publishedBundle = await prisma.bundle.findFirst({
          where: {
            shop: shopId,
            status: "published",
          },
        });

        if (publishedBundle) {
          return json({
            success: false,
            error: "Another bundle is already published. Please set the other bundle to draft first or save this bundle as draft.",
          });
        }
      }

      // Create the bundle
      savedBundle = await prisma.bundle.create({
        data: {
          shop: shopId,
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

      // Create bundle products
      if (bundleData.products && bundleData.products.length > 0) {
        await prisma.bundleProduct.createMany({
          data: bundleData.products
            .filter(product => product.name && product.name.trim() !== '')
            .map((product) => ({
              bundleId: parseInt(savedBundle.id),
              productId: product.productId || "",
              productHandle: product.productHandle || "",
              name: product.name || "",
              quantity: product.quantity || 1,
              image: product.image || "",
            })),
        });
      }

      return json({
        success: true,
        message: "Bundle created successfully!",
        bundleData,
      });
    }

  } catch (error) {
    console.error("Error saving bundle:", error);
    return json({
      success: false,
      error: error.message,
    }, { status: 500 });
  }
}
