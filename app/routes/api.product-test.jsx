// routes/app.proxy.js
// import { Page } from "@shopify/polaris";
import { authenticate } from "../shopify.server";
import { json } from "@remix-run/node";

export const action = async ({ request }) => {
  console.log("Proxy endpoint hit");

  const { session, admin } = await authenticate.public.appProxy(request);

  if (session) {
    console.log("Session:", session);
    const response = await admin.graphql(
      `
            mutation CreateProduct($input: ProductInput!) {
              productCreate(input: $input) {
                product {
                  id
                  title
                }
              }
            }
            `,
      {
        variables: {
          input: {
            title: "YouTube Test Product"
          }
        }
      }
    );
    const productData = await response.json();
    return json({ data: productData })
  }
  return null
};

// Export the component to render a page using Polaris:
// export default function Proxy() {
//   return <Page>Proxy</Page>
// }