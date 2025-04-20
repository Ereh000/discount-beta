import { json } from "@remix-run/node";
import { authenticate } from "../shopify.server";
import prisma from "../db.server";

export const loader = async ({ request }) => {
    console.log("proxy hitted")
    const { session, admin } = await authenticate.public.appProxy(request);
    if (session) {
        try {
            const url = new URL(request.url);
            const bundleId = url.searchParams.get("bundleId");

            if (bundleId) {
                console.log("bundleId", bundleId);
                const bundle = await prisma.bundle.findUnique({
                    where: { id: parseInt(bundleId) },
                    include: {
                        products: true
                    }
                });

                if (!bundle) {
                    return json({ error: "Bundle not found" }, { status: 404 });
                }

                // Get product IDs from bundle
                const productIds = bundle.products.map(product => product.productId);

                // console.log("productIds", productIds);

                // Fetch products from Shopify
                const response = await admin.graphql(
                    `query getProducts($ids: [ID!]!) {
                        nodes(ids: $ids) {
                          ... on Product {
                            id
                            title
                            handle
                            descriptionHtml
                            productType
                            vendor
                            tags
                            publishedAt
                            createdAt
                            updatedAt
                            priceRangeV2 {
                              minVariantPrice {
                                amount
                                currencyCode
                              }
                              maxVariantPrice {
                                amount
                                currencyCode
                              }
                            }
                            compareAtPriceRange {
                              minVariantCompareAtPrice {
                                amount
                                currencyCode
                              }
                              maxVariantCompareAtPrice {
                                amount
                                currencyCode
                              }
                            }
                            options {
                              name
                              values
                            }
                            variants(first: 10) {
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
                            featuredImage{
                                url
                            }
                          }
                        }
                      }`,
                    {
                        variables: {
                            ids: productIds,
                        },
                    }
                );

                const responseJson = await response.json();

                // Merge Shopify data with bundle products
                const enrichedProducts = bundle.products.map(bundleProduct => {
                    const shopifyProduct = responseJson.data.nodes.find(
                        node => node?.id === bundleProduct.productId
                    );
                    return {
                        // ...bundleProduct,
                        shopifyProduct
                    };
                });

                // console.log("enrichedProducts", enrichedProducts);
                // console.log("bundle", bundle.settings);
                // console.log("responseJson.data.nodes", responseJson);
                console.log("Bundle fetched successfully!")

                return json({
                    success: true,
                    message: "Bundle fetched successfully!",
                    bundle: {
                        ...bundle,
                        enrichedProducts: enrichedProducts
                    },
                    bundlee: bundle,
                    productIds,
                    fetchedProducts: responseJson.data.nodes
                });
            }


            // console.log("admin", admin);

            //     const queryy = await admin.graphql(`
            // query {
            //     products(first: 10) {
            //         edges {
            //             node {   
            //                 id
            //                 title   
            //             }
            //         } 
            //     }
            // }
            // `);

            //     const data = await queryy.json();

            //     // Now access the data correctly
            //     // console.log("queryy data:", data);


            //     // Access the first product's title (if it exists)
            //     if (data?.data?.products?.edges?.length > 0) {
            //         console.log("First product title:", data.data.products.edges[0].node.title);
            //     }

            const bundles = await prisma.bundle.findMany({ include: { products: true } });
            return json({ success: true, bundles });
        } catch (error) {
            console.error("Error fetching bundles:", error);
            return json({ error: error.message }, { status: 500 });
        }
    } else {
        return json({ error: "Unauthorized" }, { status: 401 });
    }
};