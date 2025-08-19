// app/routes/api.product-bundle-create.jsx

import prisma from "../db.server";
import { json } from "@remix-run/node";
import { fetchShop } from "../utils/getShop";
import { authenticate } from "../shopify.server";

// Import utility functions
import { createOrUpdateAutomaticDiscount } from "../utils/discount";
import {
  saveDiscountToMetafield,
  updateAllBundleDiscountsMetafield,
} from "../utils/metafield";
import { validateDiscountSettings } from "../utils/validation";

export async function action({ request }) {
  try {
    const { admin } = await authenticate.admin(request);
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

    // Validate discount settings
    const discountValidation = validateDiscountSettings(bundleData);
    if (!discountValidation.isValid) {
      return json(
        {
          success: false,
          error: discountValidation.message,
        },
        { status: 400 },
      );
    }

    const shop = await fetchShop(request);
    const shopId = shop.id;

    const isEdit = bundleData.isEdit && bundleData.bundleId !== "new";
    console.log("Is edit mode:", isEdit);

    let savedBundle;
    let discountResult = null;

    if (isEdit) {
      console.log("Updating existing bundle with ID:", bundleData.bundleId);

      // Update the bundle
      savedBundle = await prisma.bundle.update({
        where: {
          id: parseInt(bundleData.bundleId),
          shop: shopId,
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
            selectedResources: bundleData.selectedResources || [],
            selectedResourceIds: bundleData.selectedResourceIds || [],
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

      // Create/Update discount if pricing option is not default and bundle is published
      if (
        bundleData.pricingOption !== "default" &&
        bundleData.status === "published"
      ) {
        try {
          const discountData = {
            bundleId: savedBundle.id,
            bundleName: bundleData.bundleName,
            pricingOption: bundleData.pricingOption,
            discountValue:
              bundleData.pricingOption === "percentage"
                ? bundleData.discountPercentage
                : bundleData.pricingOption === "fixedDiscount"
                  ? bundleData.fixedDiscount
                  : bundleData.fixedPrice,
            selectedResourceIds: bundleData.selectedResourceIds || [],
            position: bundleData.position,
            products: bundleData.products || [], // Add this line
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };

          // Create Shopify discount
          discountResult = await createOrUpdateAutomaticDiscount(
            admin,
            discountData,
            bundleData,
          );

          // Save to metafield
          if (discountResult) {
            discountData.shopifyDiscountId = discountResult.discountId;
            await saveDiscountToMetafield(admin, shopId, discountData);
            // Update consolidated metafield
            await updateAllBundleDiscountsMetafield(admin, shopId);
          }

          console.log("Discount updated successfully");
        } catch (discountError) {
          console.error("Error updating discount:", discountError);
          // Don't fail the bundle update if discount creation fails
        }
      }

      console.log("Bundle products updated successfully");

      let message = "Bundle updated successfully!";
      if (discountResult) {
        if (discountResult.wasExisting) {
          message += ` Updated existing discount "${discountResult.functionTitle}".`;
        } else {
          message += ` New discount "${discountResult.functionTitle}" was created.`;
        }
      }

      return json({
        success: true,
        message: message,
        bundleId: savedBundle.id,
        discountId: discountResult?.discountId || null,
        discountInfo: discountResult,
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
            selectedResources: bundleData.selectedResources || [],
            selectedResourceIds: bundleData.selectedResourceIds || [],
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

      // Create discount if pricing option is not default and bundle is published
      if (
        bundleData.pricingOption !== "default" &&
        bundleData.status === "published"
      ) {
        try {
          const discountData = {
            bundleId: savedBundle.id,
            bundleName: bundleData.bundleName,
            pricingOption: bundleData.pricingOption,
            discountValue:
              bundleData.pricingOption === "percentage"
                ? bundleData.discountPercentage
                : bundleData.pricingOption === "fixedDiscount"
                  ? bundleData.fixedDiscount
                  : bundleData.fixedPrice,
            selectedResourceIds: bundleData.selectedResourceIds || [],
            position: bundleData.position,
            products: bundleData.products || [], // Add this line
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };

          // Create Shopify discount
          discountResult = await createOrUpdateAutomaticDiscount(
            admin,
            discountData,
            bundleData,
          );

          // Save to metafield
          if (discountResult) {
            discountData.shopifyDiscountId = discountResult.discountId;
            await saveDiscountToMetafield(admin, shopId, discountData);
            // Update consolidated metafield
            await updateAllBundleDiscountsMetafield(admin, shopId);
          }

          console.log("Discount created successfully");
        } catch (discountError) {
          console.error("Error creating discount:", discountError);
          // Don't fail the bundle creation if discount creation fails
        }
      }

      console.log("Bundle products created successfully");

      let message = "Bundle created successfully!";
      if (discountResult) {
        if (discountResult.wasExisting) {
          message += ` Updated existing discount "${discountResult.functionTitle}".`;
        } else {
          message += ` New discount "${discountResult.functionTitle}" was created.`;
        }
      }

      return json({
        success: true,
        message: message,
        bundleId: savedBundle.id,
        discountId: discountResult?.discountId || null,
        discountInfo: discountResult,
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
