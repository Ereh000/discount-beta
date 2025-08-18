// app/routes/api.product-bundle-create.jsx

import prisma from "../db.server";
import { json } from "@remix-run/node";
import { fetchShop } from "../utils/getShop";

export async function action({ request }) {
  try {
    const formData = await request.formData();
    const bundleDataString = formData.get("bundleData");

    if (!bundleDataString) {
      console.error("No bundle data provided");
      return json(
        {
          success: false,
          error: "No bundle data provided.",
        },
        { status: 400 },
      );
    }

    let bundleData;
    try {
      bundleData = JSON.parse(bundleDataString);
    } catch (parseError) {
      console.error("Error parsing bundle data:", parseError);
      return json(
        {
          success: false,
          error: "Invalid bundle data format.",
        },
        { status: 400 },
      );
    }

    const shop = await fetchShop(request);
    const shopId = shop.id;

    const isEdit = bundleData.isEdit && bundleData.bundleId !== "new";
    console.log("Is edit mode:", isEdit);

    let savedBundle;

    if (isEdit) {
      console.log("Updating existing bundle with ID:", bundleData.bundleId);

      // Update the bundle
      savedBundle = await prisma.bundle.update({
        where: {
          id: parseInt(bundleData.bundleId),
          shop: shopId, // Added for security
        },
        data: {
          status: bundleData.status,
          name: bundleData.bundleName,
          position: bundleData.position,
          settings: {
            header: bundleData.headerText,
            alignment: bundleData.alignment,
            footer: bundleData.footerText,
            button: bundleData.buttonText,
            position: bundleData.position,
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

      console.log("Bundle updated successfully:", savedBundle.id);

      // Delete existing bundle products and create new ones
      await prisma.bundleProduct.deleteMany({
        where: { bundleId: parseInt(bundleData.bundleId) },
      });

      if (bundleData.products && bundleData.products.length > 0) {
        const validProducts = bundleData.products.filter(
          (product) => product.name && product.name.trim() !== "",
        );

        if (validProducts.length > 0) {
          await prisma.bundleProduct.createMany({
            data: validProducts.map((product) => ({
              bundleId: parseInt(savedBundle.id),
              productId: product.productId || "",
              productHandle: product.productHandle || "",
              name: product.name || "",
              quantity: product.quantity || 1,
              image: product.image || "",
            })),
          });
        }
      }

      console.log("Bundle products updated successfully");

      return json({
        success: true,
        message: "Bundle updated successfully!",
        bundleId: savedBundle.id,
      });
    } else {
      console.log("Creating new bundle");

      // Check if a bundle with the same name already exists
      const existingBundle = await prisma.bundle.findFirst({
        where: {
          name: bundleData.bundleName,
          shop: shopId,
        },
      });

      if (existingBundle) {
        console.log("Bundle with same name already exists:", existingBundle.id);
        return json({
          success: false,
          error:
            "A bundle with this name already exists. Please choose a different name.",
        });
      }

      // Create the bundle
      savedBundle = await prisma.bundle.create({
        data: {
          shop: shopId,
          status: bundleData.status,
          name: bundleData.bundleName,
          position: bundleData.position,
          settings: {
            header: bundleData.headerText,
            alignment: bundleData.alignment,
            footer: bundleData.footerText,
            button: bundleData.buttonText,
            position: bundleData.position,
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

      console.log("Bundle created successfully:", savedBundle.id);

      // Create bundle products
      if (bundleData.products && bundleData.products.length > 0) {
        const validProducts = bundleData.products.filter(
          (product) => product.name && product.name.trim() !== "",
        );

        if (validProducts.length > 0) {
          await prisma.bundleProduct.createMany({
            data: validProducts.map((product) => ({
              bundleId: parseInt(savedBundle.id),
              productId: product.productId || "",
              productHandle: product.productHandle || "",
              name: product.name || "",
              quantity: product.quantity || 1,
              image: product.image || "",
            })),
          });
        }
      }

      console.log("Bundle products created successfully");

      return json({
        success: true,
        message: "Bundle created successfully!",
        bundleId: savedBundle.id,
      });
    }
  } catch (error) {
    console.error("Error saving bundle:", error);
    console.error("Error stack:", error.stack);

    return json(
      {
        success: false,
        error: `Server error: ${error.message}`,
        details:
          process.env.NODE_ENV === "development" ? error.stack : undefined,
      },
      { status: 500 },
    );
  }
}
