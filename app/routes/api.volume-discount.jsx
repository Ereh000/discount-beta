import { authenticate } from '../shopify.server'; // Import authenticate
import prisma from "../db.server"; // Import prisma
import { json } from '@remix-run/react'; // Import useFetcher and json


// ========== Remix Action Function -----------
export async function action({ request }) {
  const { admin } = await authenticate.admin(request);
  const formData = await request.formData();
  const volumeSettingsString = formData.get("volumeSettings");
  const status = formData.get("status");

  if (!volumeSettingsString) {
    return json({ success: false, message: "No volume settings data provided." }, { status: 400 });
  }

  const response = await admin.graphql(
    `
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
    const volumeSettings = JSON.parse(volumeSettingsString);
    // const shop = admin.session.shop;  

    // Save or update the settings in the database
    const savedSettings = await prisma.volumeDiscount.upsert({
      where: { shop: shopId },
      update: {
        settings: volumeSettings,
        status: status,
        bundleName: volumeSettings.bundleSettings.bundleName, // Assuming you want to save bundleName directly
      },
      create: {
        shop: shopId,
        settings: volumeSettings,
        status: status,
        bundleName: volumeSettings.bundleSettings.bundleName, // Assuming you want to save bundleName directly
      },
    });

    return json({ success: true, message: "Volume discount settings saved successfully!", data: savedSettings });
  } catch (error) {
    console.error("Error saving volume discount settings:", error);
    return json({ success: false, message: "Failed to save volume discount settings." }, { status: 500 });
  }
}


// ========== Remix Loader Function -----------
export async function loader({ request }) {
  console.log("proxy hitted")
  const { session, admin } = await authenticate.public.appProxy(request);
  // const { admin } = await authenticate.admin(request);
  const response = await admin.graphql(
    `
      query{
          shop {
              name  
              id
          }
      }
    `
  );

  const shopData = await response.json();
  const shopId = shopData.data.shop.id;

  if (session) {

    try {
      const savedSettings = await prisma.volumeDiscount.findUnique({
        where: { shop: shopId },
      });

      if (savedSettings) {
        console.log("Volume discount settings loaded successfully.")
        return json({ success: true, message: "Volume discount settings loaded successfully.", data: savedSettings });
      } else {
        return json({ success: false, message: "No volume discount settings found." }, { status: 404 });
      }
    } catch (error) {
      console.log("Error loading volume discount settings:");
      console.error("Error loading volume discount settings:", error);
      return json({ success: false, message: "Failed to load volume discount settings." }, { status: 500 });
    }
  } else {
    return json({ success: false, message: "No session found." }, { status: 401 });
  }
}