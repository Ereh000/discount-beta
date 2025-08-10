import { authenticate } from "../shopify.server";

// Helper function to fetch Shopify shop details
export async function fetchShop(request) {
  // Authenticate and get the admin API client
  const { admin } = await authenticate.admin(request);

  // Make the GraphQL request
  const shopResponse = await admin.graphql(`
    query {
      shop {
        id
        name
        url
      }
    }
  `);

  const shopData = await shopResponse.json();

  // Optional: Check for errors in the response
  if (shopData.errors) {
    throw new Error(
      `Shopify GraphQL error: ${JSON.stringify(shopData.errors)}`,
    );
  }

  // Return the shop details
  return shopData?.data?.shop;
}
