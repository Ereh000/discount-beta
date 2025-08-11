import { authenticate } from "../shopify.server";

export async function saveOfferSettings(request, shopId, offerSettings) {
    // Save offerSettings to app metafields

    const { admin } = await authenticate.admin(request);

    const offerSettingsString = JSON.stringify(offerSettings);

    const mutation = `
        mutation SaveOfferSettings($metafields: [MetafieldsSetInput!]!) {
            metafieldsSet(metafields: $metafields) {
                metafields {
                    id
                    namespace
                    key
                    value
                }
                userErrors {
                    field
                    message
                }
            }
        }
    `;

    const variables = {
        metafields: [
            {
                ownerId: shopId,
                namespace: "volume-discount",
                key: "offer-settings",
                type: "json",
                value: offerSettingsString
            }
        ]
    };

    const metafieldResponse = await admin.graphql(mutation, { variables });
    const metafieldData = await metafieldResponse.json();

    if (metafieldData?.data?.metafieldsSet?.userErrors?.length) {
        throw new Error(
            `Shopify GraphQL error: ${JSON.stringify(metafieldData?.data?.metafieldsSet?.userErrors)}`,
        );
    }

    return metafieldData?.data?.metafieldsSet?.metafields?.[0];
}