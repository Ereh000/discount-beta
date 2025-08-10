import { authenticate } from '../shopify.server';
import prisma from "../db.server";
import { json } from '@remix-run/node';

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

  try {
    const volumeSettings = JSON.parse(volumeSettingsString);

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

      return json({ 
        success: true, 
        message: "Volume discount updated successfully!", 
        data: savedSettings 
      });
    } else {
      // Create new volume discount
      // If setting to published, first set all existing volumes to draft
      if (status === "published") {
        await prisma.volumeDiscount.updateMany({
          where: {
            shop: shopId,
            status: "published",
          },
          data: {
            status: "draft",
          },
        });
      }

      savedSettings = await prisma.volumeDiscount.create({
        data: {
          shop: shopId,
          settings: volumeSettings,
          status: status,
          bundleName: volumeSettings.bundleSettings.bundleName,
        },
      });

      return json({ 
        success: true, 
        message: "Volume discount created successfully!", 
        data: savedSettings 
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
