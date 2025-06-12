import { Card, Button } from "@shopify/polaris";
import React from "react";

function VolumePreview({ allVolumeSettings }) {
  // Helper function to convert RGB object to CSS color
  const rgbToColor = (color) => {
    if (!color) return "transparent";
    return `rgba(${color.red}, ${color.green}, ${color.blue}, ${color.alpha || 1})`;
  };

  // Helper function to format price
  const formatPrice = (price) => {
    return `₹${price}`;
  };

  // Extract settings from props
  const settings = allVolumeSettings || {};
  const bundleSettings = settings.bundleSettings || {};
  const offerSettings = settings.offerSettings || { offers: [], selectedOfferIndex: 0 };
  const designSettings = settings.designSettings || {};

  // Get colors from design settings
  const colors = {
    header: rgbToColor(designSettings?.textColors?.header),
    title: rgbToColor(designSettings?.textColors?.title),
    subtitle: rgbToColor(designSettings?.textColors?.subtitle),
    price: rgbToColor(designSettings?.pricingColors?.price),
    comparedPrice: rgbToColor(designSettings?.pricingColors?.comparedPrice),
    bundle: rgbToColor(designSettings?.backgroundColors?.bundle),
    selectedBundle: rgbToColor(designSettings?.backgroundColors?.selectedBundle),
    border: rgbToColor(designSettings?.backgroundColors?.border),
    borderSelected: rgbToColor(designSettings?.backgroundColors?.borderSelectedBundle),
    highlight: rgbToColor(designSettings?.backgroundColors?.highlight),
    highlightText: rgbToColor(designSettings?.textColors?.highlight),
  };

  // Get typography settings
  const typography = designSettings?.typographySettings || {};

  // Get shape settings
  const shapeSettings = bundleSettings?.shapeSettings || { blockRadius: 12, blockThickness: 2 };

  // Sample data for preview (if no offers are provided)
  const sampleOffers = [
    {
      id: "offer-1",
      title: "Single",
      subtitle: "Standard price",
      quantity: "1",
      priceType: "default",
      highlight: false,
      selectedByDefault: true,
      price: 749.95,
      highlightSettings: {
        type: "text",
        text: "MOST POPULAR",
        blinking: false,
        style: "pill",
        shape: "rounded",
      },
    },
    {
      id: "offer-2",
      title: "Duo",
      subtitle: "You save 10%",
      quantity: "2",
      priceType: "discount",
      highlight: false,
      highlightSettings: {
        type: "text",
        text: "MOST POPULAR",
        blinking: false,
        style: "pill",
        shape: "rounded",
      },
      selectedByDefault: false,
      price: 1349.91,
      compareAtPrice: 1499.90,
    },
    {
      id: "offer-3",
      title: "Trio",
      subtitle: "You save 20%",
      quantity: "3",
      priceType: "discount",
      highlight: true,
      highlightSettings: {
        type: "text",
        text: "MOST POPULAR",
        blinking: false,
        style: "pill",
        shape: "rounded",
      },
      selectedByDefault: false,
      price: 1799.88,
      compareAtPrice: 2249.85,
    },
  ];

  // Use offers from settings or sample offers
  const offers = offerSettings.offers?.length > 0 ? offerSettings.offers : sampleOffers;
  const selectedOfferIndex = offerSettings.selectedOfferIndex || 0;

  return (
    <Card>
      <div className="preview-container" style={{ padding: "16px" }}>
        {/* <div className="preview-header" style={{
          textAlign: bundleSettings?.headerSettings?.alignment || "center",
          marginBottom: "16px",
          color: colors.header,
          fontSize: `${typography?.header?.size || 16}px`,
          fontWeight: typography?.header?.fontStyle === "Bold" ? "bold" : "normal",
          borderBottom: bundleSettings?.headerSettings?.headerLine ? `${bundleSettings?.headerSettings?.lineThickness || 1}px solid ${colors.header}` : "none",
          paddingBottom: bundleSettings?.headerSettings?.headerLine ? "8px" : "0",
        }}>
          {bundleSettings?.headerSettings?.headerText || "Choose your offer"}
        </div> */}

        <div className="" style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '10px',
          marginBottom: '16px'
        }}>
          <span style={{
            flex: 1,
            height: bundleSettings?.headerSettings?.headerLine ? `${bundleSettings?.headerSettings?.lineThickness || 1}px` : '0px',
            background: colors?.border,
          }}></span>
          <div className="preview-header" style={{
            textAlign: bundleSettings?.headerSettings?.alignment || "center",
            // marginBottom: "16px",
            color: colors.header,
            fontSize: `${typography?.header?.size || 16}px`,
            fontWeight: typography?.header?.fontStyle === "Bold" ? "bold" : "normal",
            // borderBottom: bundleSettings?.headerSettings?.headerLine ? `${bund leSettings?.headerSettings?.lineThickness || 1}px solid ${colors.header}` : "none",
            // paddingBottom: bundleSettings?.headerSettings?.headerLine ? "8px" : "0",
          }}>
            {bundleSettings?.headerSettings?.headerText || "Choose your offer"}
          </div>
          <span style={{
            flex: 1,
            height: bundleSettings?.headerSettings?.headerLine ? `${bundleSettings?.headerSettings?.lineThickness || 1}px` : '0px',
            background: colors?.border,
          }}></span>
        </div>

        <div className="offers-container">
          {offers.map((offer, index) => (
            <div
              key={offer.id || index}
              className="offer-item"
              style={{
                backgroundColor: index === selectedOfferIndex ? colors.selectedBundle : colors.bundle,
                borderRadius: `${shapeSettings.blockRadius}px`,
                border: `${shapeSettings.blockThickness}px solid ${index === selectedOfferIndex ? colors.borderSelected : colors.border}`,
                padding: "16px",
                marginBottom: "12px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                position: "relative",
              }}
            >
              {/* Radio button and title section */}
              <div style={{ display: "flex", alignItems: "center" }}>
                <div style={{
                  width: "20px",
                  height: "20px",
                  borderRadius: "50%",
                  border: `2px solid ${colors.border}`,
                  marginRight: "12px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}>
                  {index === selectedOfferIndex && (
                    <div style={{
                      width: "12px",
                      height: "12px",
                      borderRadius: "50%",
                      backgroundColor: "#5C3D99",
                    }} />
                  )}
                </div>
                <div>
                  <div style={{
                    color: colors.title,
                    fontSize: `${typography?.titlePrice?.size || 16}px`,
                    fontWeight: typography?.titlePrice?.fontStyle === "Bold" ? "bold" : "normal",
                  }}>
                    {offer.title}
                  </div>
                  <div style={{
                    color: colors.subtitle,
                    fontSize: `${typography?.subtitleComparedPrice?.size || 14}px`,
                    fontWeight: typography?.subtitleComparedPrice?.fontStyle === "Bold" ? "bold" : "normal",
                  }}>
                    {offer.subtitle}
                  </div>
                </div>
              </div>

              {/* Price section */}
              <div style={{ textAlign: "right" }}>
                <div style={{
                  color: colors.price,
                  fontSize: `${typography?.titlePrice?.size || 16}px`,
                  fontWeight: typography?.titlePrice?.fontStyle === "Bold" ? "bold" : "normal",
                }}>
                  {formatPrice(offer.price || 0)}
                </div>
                {offer.compareAtPrice && (
                  <div style={{
                    color: colors.comparedPrice,
                    fontSize: `${typography?.subtitleComparedPrice?.size || 14}px`,
                    fontWeight: typography?.subtitleComparedPrice?.fontStyle === "Bold" ? "bold" : "normal",
                    textDecoration: "line-through",
                  }}>
                    {formatPrice(offer.compareAtPrice)}
                  </div>
                )}
              </div>

              {/* Highlight tag */}
              {offer.highlight && (
                <div style={{
                  position: "absolute",
                  top: "-10px",
                  right: "20px",
                  backgroundColor: colors.highlight, // Use dynamic highlight background color
                  color: colors.highlightText, // Use dynamic highlight text color
                  padding: "4px 8px",
                  borderRadius: `${shapeSettings.blockRadius}px`, // Use dynamic block radius for highlight tag                 
                  fontSize: `${typography?.tagHighlight?.size || 12}px`,
                  fontWeight: typography?.tagHighlight?.fontStyle === "Bold" ? "bold" : "normal",
                }}>
                  {offer.highlightSettings?.text}
                </div>  
              )} 
            </div>
          ))} 
        </div>

        {/* Add to cart button */}
        <button
          fullWidth
          // disabled
          style={{
            marginTop: "8px",
            backgroundColor: "#f0f0f0",
            color: "#999",
            border: "none",
            padding: "14px",
            borderRadius: "6px",
            cursor: "not-allowed",
            textAlign: "center",
            boxShadow: '2px 2px #ccc',
            fontSize: '16px',
            width: '100%',
          }}
        >
          ADD TO CART
        </button>
      </div>
    </Card >
  );
}

export default VolumePreview;


// Volume Preview Settings Object Example
// volumePreviewSettings = {
//   {
//     "bundleSettings": {
//         "bundleName": "Bundle 1",
//         "visibilitySettings": {
//             "visibility": "all_products"
//         },
//         "headerSettings": {
//             "headerText": "Choose your offer",
//             "alignment": "center",
//             "headerLine": true,
//             "lineThickness": 2
//         },
//         "shapeSettings": {
//             "blockRadius": 12,
//             "blockThickness": 2
//         },
//         "checkmarkSettings": {
//             "checkmarkVisibility": "show"
//         }
//     },
//     "offerSettings": {
//         "offers": [
//             {
//                 "id": "offer-1",
//                 "title": "Single",
//                 "subtitle": "Standard price",
//                 "quantity": "1",
//                 "image": null,
//                 "priceType": "default",
//                 "buyQuantity": "1",
//                 "getQuantity": "1",
//                 "highlight": false,
//                 "selectedByDefault": true,
//                 "tag": ""
//                "highlightSettings": {
//                  "type": "text",
//                  "text": "MOST POPULARddd",
//                  "blinking": false,
//                  "style": "pill",
//                  "shape": "square"
//                }
//             }
//         ],
//         "selectedOfferIndex": 0
//     },
//     "designSettings": {
//         "backgroundColors": {
//             "bundle": {
//                 "red": 230,
//                 "green": 230,
//                 "blue": 230,
//                 "alpha": 0.5
//             },
//             "border": {
//                 "red": 128,
//                 "green": 128,
//                 "blue": 128,
//                 "alpha": 1
//             },
//             "checkmark": {
//                 "red": 0,
//                 "green": 0,
//                 "blue": 0,
//                 "alpha": 1
//             },
//             "highlight": {
//                 "red": 0,
//                 "green": 0,
//                 "blue": 0,
//                 "alpha": 1
//             },
//             "selectedBundle": {
//                 "red": 255,
//                 "green": 255,
//                 "blue": 255,
//                 "alpha": 1
//             },
//             "borderSelectedBundle": {
//                 "red": 0,
//                 "green": 0,
//                 "blue": 0,
//                 "alpha": 1
//             },
//             "tags": {
//                 "red": 128,
//                 "green": 128,
//                 "blue": 128,
//                 "alpha": 0.5
//             }
//         },
//         "pricingColors": {
//             "price": {
//                 "red": 0,
//                 "green": 0,
//                 "blue": 0,
//                 "alpha": 1
//             },
//             "comparedPrice": {
//                 "red": 255,
//                 "green": 0,
//                 "blue": 0,
//                 "alpha": 1
//             }
//         },
//         "textColors": {
//             "header": {
//                 "red": 0,
//                 "green": 0,
//                 "blue": 0,
//                 "alpha": 1
//             },
//             "title": {
//                 "red": 0,
//                 "green": 0,
//                 "blue": 0,
//                 "alpha": 1
//             },
//             "subtitle": {
//                 "red": 128,
//                 "green": 128,
//                 "blue": 128,
//                 "alpha": 1
//             },
//             "highlight": {
//                 "red": 255,
//                 "green": 255,
//                 "blue": 255,
//                 "alpha": 1
//             },
//             "tags": {
//                 "red": 128,
//                 "green": 128,
//                 "blue": 128,
//                 "alpha": 1
//             }
//         },
//         "typographySettings": {
//             "header": {
//                 "size": "16",
//                 "fontStyle": "Bold"
//             },
//             "titlePrice": {
//                 "size": "16",
//                 "fontStyle": "Bold"
//             },
//             "subtitleComparedPrice": {
//                 "size": "14",
//                 "fontStyle": "Regular"
//             },
//             "tagHighlight": {
//                 "size": "12",
//                 "fontStyle": "Regular"
//             }
//         },
//         "openColorPickerFor": null
//     },
//     "advancedSettings": {
//         "variants": {
//             "allowCustomerChoice": true,
//             "hideThemeVariant": true,
//             "hideOutOfStock": false,
//             "hideThemePrice": true
//         },
//         "pricing": {
//             "showPricesPerItem": false,
//             "showCompareAtPrice": true
//         }
//     }
//   }
// }