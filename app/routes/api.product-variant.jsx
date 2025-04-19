import { json } from "@remix-run/node";
import { authenticate } from "../shopify.server";

export async function loader({ request }) {
    console.log("proxy product variant hitted")
    const { session, admin } = await authenticate.public.appProxy(request);
    if (!session) {
        return json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get the productId from the URL query parameters
    const url = new URL(request.url);
    const productId = url.searchParams.get("productId");

    if (!productId) {
        return json({ error: "Product ID is required" }, { status: 400 });
    }

    try {
        // Query Shopify GraphQL API to get product variant information
        const response = await admin.graphql(`
      query GetProductVariants($id: ID!) {
        product(id: $id) {
          id
          title
          handle
          variants(first: 100) {
            nodes {
              id
              title
              sku
              price
              compareAtPrice
              selectedOptions {
                name
                value
              }
            }
          }
        }
      }
    `, {
            variables: {
                id: productId
            }
        });

        const responseJson = await response.json();

        // console.log("responseJson.data.product", responseJson.data.product);

        // Return the product data
        return json({
            product: responseJson.data.product
        });
    } catch (error) {
        console.error("Error fetching product variant data:", error);
        return json({
            error: "Error fetching product variant data",
            details: error.message
        }, { status: 500 });
    }
}