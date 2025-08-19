import prisma from "../db.server";
import { json } from "@remix-run/node";
import { fetchShop } from "../utils/getShop";
import { authenticate } from "../shopify.server";
import { createOrUpdateAutomaticDiscount } from "../utils/discount";
import {
  saveDiscountToMetafield,
  updateAllBundleDiscountsMetafield,
} from "../utils/metafield";
import { validateDiscountSettings } from "../utils/validation";

export async function action({ request }) {
  try {
    const { admin } = await authenticate.admin(request);
    const shop = await fetchShop(request);
    
    const bundleData = await parseBundleData(request);
    const validationResult = validateBundleData(bundleData);
    
    if (!validationResult.isValid) {
      return createErrorResponse(validationResult.message, 400);
    }

    const isEdit = bundleData.isEdit && bundleData.bundleId !== "new";
    console.log("Is edit mode:", isEdit);

    const result = isEdit 
      ? await handleBundleUpdate(admin, shop.id, bundleData)
      : await handleBundleCreate(admin, shop.id, bundleData);

    return json(result);

  } catch (error) {
    console.error("Error saving bundle:", error);
    console.error("Error stack:", error.stack);

    return createErrorResponse(
      `Server error: ${error.message}`,
      500,
      process.env.NODE_ENV === "development" ? error.stack : undefined
    );
  }
}

// Helper Functions

async function parseBundleData(request) {
  const formData = await request.formData();
  const bundleDataString = formData.get("bundleData");

  if (!bundleDataString) {
    throw new Error("No bundle data provided");
  }

  try {
    return JSON.parse(bundleDataString);
  } catch (parseError) {
    console.error("Error parsing bundle data:", parseError);
    throw new Error("Invalid bundle data format");
  }
}

function validateBundleData(bundleData) {
  const discountValidation = validateDiscountSettings(bundleData);
  if (!discountValidation.isValid) {
    return discountValidation;
  }

  return { isValid: true };
}

function createErrorResponse(message, status, details = undefined) {
  return json(
    {
      success: false,
      error: message,
      details,
    },
    { status }
  );
}

function prepareBundleSettings(bundleData) {
  return {
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
  };
}

async function handleBundleCreate(admin, shopId, bundleData) {
  console.log("Creating new bundle");

  // Check for existing bundle with same name
  await validateUniqueBundleName(shopId, bundleData.bundleName);

  // Create bundle
  const savedBundle = await createBundleRecord(shopId, bundleData);
  console.log("Bundle created successfully:", savedBundle.id);

  // Create bundle products
  await manageBundleProducts(savedBundle.id, bundleData.products, 'create');

  // Handle discount creation
  const discountResult = await handleDiscountOperation(admin, shopId, bundleData, savedBundle);

  const message = createSuccessMessage("created", discountResult);

  return {
    success: true,
    message,
    bundleId: savedBundle.id,
    discountId: discountResult?.discountId || null,
    discountInfo: discountResult,
  };
}

async function handleBundleUpdate(admin, shopId, bundleData) {
  console.log("Updating existing bundle with ID:", bundleData.bundleId);

  // Update bundle
  const savedBundle = await updateBundleRecord(shopId, bundleData);
  console.log("Bundle updated successfully:", savedBundle.id);

  // Update bundle products
  await manageBundleProducts(savedBundle.id, bundleData.products, 'update', bundleData.bundleId);

  // Handle discount update
  const discountResult = await handleDiscountOperation(admin, shopId, bundleData, savedBundle);

  const message = createSuccessMessage("updated", discountResult);

  return {
    success: true,
    message,
    bundleId: savedBundle.id,
    discountId: discountResult?.discountId || null,
    discountInfo: discountResult,
  };
}

async function validateUniqueBundleName(shopId, bundleName) {
  const existingBundle = await prisma.bundle.findFirst({
    where: {
      name: bundleName,
      shop: shopId,
    },
  });

  if (existingBundle) {
    console.log("Bundle with same name already exists:", existingBundle.id);
    throw new Error(
      "A bundle with this name already exists. Please choose a different name."
    );
  }
}

async function createBundleRecord(shopId, bundleData) {
  return await prisma.bundle.create({
    data: {
      shop: shopId,
      status: bundleData.status,
      name: bundleData.bundleName,
      position: bundleData.position,
      settings: prepareBundleSettings(bundleData),
    },
  });
}

async function updateBundleRecord(shopId, bundleData) {
  return await prisma.bundle.update({
    where: {
      id: parseInt(bundleData.bundleId),
      shop: shopId,
    },
    data: {
      status: bundleData.status,
      name: bundleData.bundleName,
      position: bundleData.position,
      settings: prepareBundleSettings(bundleData),
      updatedAt: new Date(),
    },
  });
}

async function manageBundleProducts(bundleId, products, operation, existingBundleId = null) {
  if (!products || products.length === 0) return;

  const validProducts = products.filter(
    (product) => product.name && product.name.trim() !== ""
  );

  if (validProducts.length === 0) return;

  // If updating, delete existing products first
  if (operation === 'update' && existingBundleId) {
    await prisma.bundleProduct.deleteMany({
      where: { bundleId: parseInt(existingBundleId) },
    });
  }

  // Create new products
  await prisma.bundleProduct.createMany({
    data: validProducts.map((product) => ({
      bundleId: parseInt(bundleId),
      productId: product.productId || "",
      productHandle: product.productHandle || "",
      name: product.name || "",
      quantity: product.quantity || 1,
      image: product.image || "",
    })),
  });

  console.log(`Bundle products ${operation}d successfully`);
}

async function handleDiscountOperation(admin, shopId, bundleData, savedBundle) {
  // Only create/update discount if pricing is not default and bundle is published
  if (bundleData.pricingOption === "default" || bundleData.status !== "published") {
    return null;
  }

  try {
    const discountData = prepareDiscountData(bundleData, savedBundle);

    // Create/Update Shopify discount
    const discountResult = await createOrUpdateAutomaticDiscount(
      admin,
      discountData,
      bundleData
    );

    // Save to metafield if discount was created/updated
    if (discountResult) {
      discountData.shopifyDiscountId = discountResult.discountId;
      await saveDiscountToMetafield(admin, shopId, discountData);
      await updateAllBundleDiscountsMetafield(admin, shopId);
    }

    console.log("Discount operation completed successfully");
    return discountResult;

  } catch (discountError) {
    console.error("Error in discount operation:", discountError);
    // Don't fail the bundle operation if discount creation fails
    return null;
  }
}

function prepareDiscountData(bundleData, savedBundle) {
  const discountValue = getDiscountValue(bundleData);

  return {
    bundleId: savedBundle.id,
    bundleName: bundleData.bundleName,
    pricingOption: bundleData.pricingOption,
    discountValue,
    selectedResourceIds: bundleData.selectedResourceIds || [],
    position: bundleData.position,
    products: bundleData.products || [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

function getDiscountValue(bundleData) {
  switch (bundleData.pricingOption) {
    case "percentage":
      return bundleData.discountPercentage;
    case "fixedDiscount":
      return bundleData.fixedDiscount;
    default:
      return bundleData.fixedPrice;
  }
}

function createSuccessMessage(operation, discountResult) {
  let message = `Bundle ${operation} successfully!`;
  
  if (discountResult) {
    const action = discountResult.wasExisting ? "Updated existing" : "New";
    const verb = discountResult.wasExisting ? "updated" : "created";
    message += ` ${action} discount "${discountResult.functionTitle}" was ${verb}.`;
  }
  
  return message;
}
