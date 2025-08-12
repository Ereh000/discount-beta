import { authenticate } from '../shopify.server';
import prisma from "../db.server";
import { json } from '@remix-run/node';
import { fetchShop } from '../utils/getShop';
import { saveOfferSettings, updateAllBundleMetafields } from '../utils/saveOfferSettings';
import { applyOrderDiscountFunction } from '../utils/applyOrderDiscountFunction';

// ========== Remix Action Function -----------
export async function action({ request }) {
  const { admin } = await authenticate.admin(request);
  const formData = await request.formData();
  const volumeSettingsString = formData.get("volumeSettings");
  const status = formData.get("status");
  const volumeId = formData.get("volumeId");
  const isEdit = formData.get("isEdit") === "true";

  if (!volumeSettingsString) {
    return json({ success: false, message: "No volume settings data provided." }, { status: 400 });
  }

  const shop = await fetchShop(request);
  const shopId = shop.id;

  try {
    const volumeSettings = JSON.parse(volumeSettingsString);

    // Save individual bundle offer settings with unique metafield key
    const metafield = await saveOfferSettings(
      request, 
      shopId, 
      volumeSettings?.offerSettings,
      volumeSettings.bundleSettings.bundleName
    );
    
    if (!metafield) {
      return json({ success: false, message: "Failed to save offer settings." }, { status: 500 });
    }

    let savedSettings;

    if (isEdit && volumeId !== "new") {
      // Update existing volume discount
      savedSettings = await prisma.volumeDiscount.update({
        where: {
          id: parseInt(volumeId),
        },
        data: {
          settings: volumeSettings,
          status: status,
          bundleName: volumeSettings.bundleSettings.bundleName,
          updatedAt: new Date(),
        },
      });

      // Apply/Update discount for this bundle
      let discountResult = null;
      if (status === "published") {
        try {
          discountResult = await applyOrderDiscountFunction(
            admin, 
            volumeSettings.bundleSettings.bundleName, 
            isEdit
          );
          if (discountResult) {
            console.log("Order discount function processed successfully:", discountResult);
          }
        } catch (discountError) {
          console.error("Failed to process order discount function:", discountError);
        }
      }

      // Update consolidated metafield with all published offers
      await updateAllBundleMetafields(request, shopId);

      let message = "Volume discount updated successfully!";
      if (discountResult) {
        if (discountResult.wasExisting) {
          message += ` Existing discount "${discountResult.functionTitle}" was updated.`;
        } else {
          message += ` New discount "${discountResult.functionTitle}" was created.`;
        }
      }

      return json({ 
        success: true, 
        message: message,
        data: savedSettings,
        discountInfo: discountResult
      });
    } else {
      // Create new volume discount
      savedSettings = await prisma.volumeDiscount.create({
        data: {
          shop: shopId,
          settings: volumeSettings,
          status: status,
          bundleName: volumeSettings.bundleSettings.bundleName,
        },
      });

      // Apply/Update discount for this bundle (will update if name matches existing)
      let discountResult = null;
      if (status === "published") {
        try {
          discountResult = await applyOrderDiscountFunction(
            admin, 
            volumeSettings.bundleSettings.bundleName, 
            isEdit
          );
          if (discountResult) {
            console.log("Order discount function processed successfully:", discountResult);
          }
        } catch (discountError) {
          console.error("Failed to process order discount function:", discountError);
        }
      }

      // Update consolidated metafield with all published offers
      await updateAllBundleMetafields(request, shopId);

      let message = "Volume discount created successfully!";
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
        data: savedSettings,
        discountInfo: discountResult
      });
    }
  } catch (error) {
    console.error("Error saving volume discount settings:", error);
    return json({ 
      success: false, 
      message: `Failed to ${isEdit ? "update" : "create"} volume discount settings.` 
    }, { status: 500 });
  }
}

// ... rest of the loader function remains the same


// ========== Remix Loader Function -----------
export async function loader({ request }) {
  console.log("Volume discount API loader hit");
  const { session, admin } = await authenticate.public.appProxy(request);
  
  const response = await admin.graphql(
    `query{
      shop {
        name  
        id
      }
    }`
  );

  const shopData = await response.json();
  const shopId = shopData.data.shop.id;

  if (session) {
    try {
      const savedSettings = await prisma.volumeDiscount.findMany({
        where: { shop: shopId },
        orderBy: { createdAt: 'desc' }
      });

      if (savedSettings && savedSettings.length > 0) {
        console.log("Volume discount settings loaded successfully.");
        return json({ 
          success: true, 
          message: "Volume discount settings loaded successfully.", 
          data: savedSettings 
        });
      } else {
        return json({ 
          success: false, 
          message: "No volume discount settings found." 
        }, { status: 404 });
      }
    } catch (error) {
      console.log("Error loading volume discount settings:");
      console.error("Error loading volume discount settings:", error);
      return json({ 
        success: false, 
        message: "Failed to load volume discount settings." 
      }, { status: 500 });
    }
  } else {
    return json({ 
      success: false, 
      message: "No session found." 
    }, { status: 401 });
  }
}
