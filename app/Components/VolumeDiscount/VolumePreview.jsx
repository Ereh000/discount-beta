// Components/VolumeDiscount/VolumePreview.jsx

import { Card } from "@shopify/polaris";

function VolumePreview({ allVolumeSettings }) {
  console.log("volume settings", allVolumeSettings);

  // Helper function to convert RGB object to CSS color
  const rgbToColor = (color) => {
    if (!color) return "transparent";
    return `rgba(${color.red}, ${color.green}, ${color.blue}, ${color.alpha || 1})`;
  };

  // Helper function to format price
  const formatPrice = (price) => {
    if (typeof price === "string" && price.includes("Rs")) {
      return price;
    }
    return `₹${parseFloat(price).toFixed(2)}`;
  };

  // Helper function to calculate discounted price
  const calculatePrice = (offer, basePrice = 100) => {
    if (!offer.priceAmount || offer.priceAmount === "") {
      return basePrice;
    }

    const discountValue = parseFloat(offer.priceAmount);

    if (offer.priceValue === "discount_percentage") {
      return basePrice - (basePrice * discountValue) / 100;
    } else if (offer.priceValue === "fixed_amount") {
      return Math.max(0, basePrice - discountValue);
    }

    return basePrice;
  };

  // Helper function to generate sample price based on quantity and discount
  const generateSamplePrice = (offer, index) => {
    const basePricePerItem = 749.95;
    const quantity = parseInt(offer.quantity) || 1;
    const totalBasePrice = basePricePerItem * quantity;

    if (offer.priceAmount && offer.priceAmount !== "") {
      const discountedPrice = calculatePrice(offer, totalBasePrice);
      return {
        price: discountedPrice,
        compareAtPrice:
          totalBasePrice > discountedPrice ? totalBasePrice : null,
      };
    }

    return { price: totalBasePrice, compareAtPrice: null };
  };

  // Extract settings from props
  const settings = allVolumeSettings || {};
  const bundleSettings = settings.bundleSettings || {};
  const offerSettings = settings.offerSettings || {
    offers: [],
    selectedOfferIndex: 0,
  };
  const designSettings = settings.designSettings || {};
  const advancedSettings = settings.advancedSettings || {};

  // Get colors from design settings
  const colors = {
    header: rgbToColor(designSettings?.textColors?.header),
    title: rgbToColor(designSettings?.textColors?.title),
    subtitle: rgbToColor(designSettings?.textColors?.subtitle),
    price: rgbToColor(designSettings?.pricingColors?.price),
    comparedPrice: rgbToColor(designSettings?.pricingColors?.comparedPrice),
    bundle: rgbToColor(designSettings?.backgroundColors?.bundle),
    selectedBundle: rgbToColor(
      designSettings?.backgroundColors?.selectedBundle,
    ),
    border: rgbToColor(designSettings?.backgroundColors?.border),
    borderSelected: rgbToColor(
      designSettings?.backgroundColors?.borderSelectedBundle,
    ),
    highlight: rgbToColor(designSettings?.backgroundColors?.highlight),
    highlightText: rgbToColor(designSettings?.textColors?.highlight),
    checkmark: rgbToColor(designSettings?.backgroundColors?.checkmark),
  };

  // Get typography settings
  const typography = designSettings?.typographySettings || {};

  // Get shape settings
  const shapeSettings = bundleSettings?.shapeSettings || {
    blockRadius: 12,
    blockThickness: 2,
  };

  // Get checkmark settings
  const checkmarkSettings = bundleSettings?.checkmarkSettings || {
    checkmarkVisibility: "show",
  };

  // Sample data for preview (if no offers are provided)
  const sampleOffers = [
    {
      id: "offer-1",
      title: "Single",
      subtitle: "Standard price",
      quantity: "1",
      priceType: "default",
      priceValue: "discount_percentage",
      priceAmount: "0",
      highlight: false,
      selectedByDefault: true,
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
      title: "Double Offer",
      subtitle: "10% OFF",
      quantity: "2",
      priceType: "default",
      priceValue: "discount_percentage",
      priceAmount: "10",
      highlight: false,
      selectedByDefault: false,
      highlightSettings: {
        type: "text",
        text: "SAVE MORE",
        blinking: false,
        style: "pill",
        shape: "rounded",
      },
    },
    {
      id: "offer-3",
      title: "Triple Offer",
      subtitle: "20% OFF",
      quantity: "3",
      priceType: "default",
      priceValue: "discount_percentage",
      priceAmount: "20",
      highlight: true,
      selectedByDefault: false,
      highlightSettings: {
        type: "text",
        text: "BEST VALUE",
        blinking: false,
        style: "pill",
        shape: "rounded",
      },
    },
  ];

  // Use offers from settings or sample offers
  const offers =
    offerSettings.offers?.length > 0 ? offerSettings.offers : sampleOffers;
  const selectedOfferIndex = offerSettings.selectedOfferIndex || 0;

  // Check if radio buttons should be shown
  const showRadioButtons =
    checkmarkSettings.checkmarkVisibility === "show" ||
    checkmarkSettings.checkmarkVisibility === "showRadio";

  return (
    <Card>
      <div className="preview-container" style={{ padding: "16px" }}>
        {/* Header with lines */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "10px",
            marginBottom: "16px",
          }}
        >
          <span
            style={{
              flex: 1,
              height: bundleSettings?.headerSettings?.headerLine
                ? `${bundleSettings?.headerSettings?.lineThickness || 1}px`
                : "0px",
              background: colors.border,
            }}
          />
          <div
            className="preview-header"
            style={{
              textAlign: bundleSettings?.headerSettings?.alignment || "center",
              color: colors.header,
              fontSize: `${typography?.header?.size || 16}px`,
              fontWeight:
                typography?.header?.fontStyle === "Bold" ? "bold" : "normal",
              whiteSpace: "nowrap",
              padding: "0 16px",
            }}
          >
            {bundleSettings?.headerSettings?.headerText || "Choose your offer"}
          </div>
          <span
            style={{
              flex: 1,
              height: bundleSettings?.headerSettings?.headerLine
                ? `${bundleSettings?.headerSettings?.lineThickness || 1}px`
                : "0px",
              background: colors.border,
            }}
          />
        </div>

        {/* Offers container */}
        <div className="offers-container">
          {offers.map((offer, index) => {
            const isSelected = index === selectedOfferIndex;
            const pricing = generateSamplePrice(offer, index);

            return (
              <div
                key={offer.id || index}
                className="offer-item"
                style={{
                  backgroundColor: isSelected
                    ? colors.selectedBundle
                    : colors.bundle,
                  borderRadius: `${shapeSettings.blockRadius}px`,
                  border: `${shapeSettings.blockThickness}px solid ${
                    isSelected ? colors.borderSelected : colors.border
                  }`,
                  padding: "16px",
                  marginBottom: "12px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  position: "relative",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                }}
              >
                {/* Radio button and title section */}
                <div style={{ display: "flex", alignItems: "center" }}>
                  {showRadioButtons && (
                    <div
                      style={{
                        width: "20px",
                        height: "20px",
                        borderRadius: "50%",
                        border: `2px solid ${colors.border}`,
                        marginRight: "12px",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        backgroundColor: isSelected
                          ? colors.checkmark
                          : "transparent",
                      }}
                    >
                      {isSelected && (
                        <div
                          style={{
                            width: "12px",
                            height: "12px",
                            borderRadius: "50%",
                            backgroundColor: colors.highlightText || "#5C3D99",
                          }}
                        />
                      )}
                    </div>
                  )}

                  <div>
                    <div
                      style={{
                        color: colors.title,
                        fontSize: `${typography?.titlePrice?.size || 16}px`,
                        fontWeight:
                          typography?.titlePrice?.fontStyle === "Bold"
                            ? "bold"
                            : "normal",
                        marginBottom: "4px",
                      }}
                    >
                      {offer.title}
                    </div>
                    <div
                      style={{
                        color: colors.subtitle,
                        fontSize: `${typography?.subtitleComparedPrice?.size || 14}px`,
                        fontWeight:
                          typography?.subtitleComparedPrice?.fontStyle ===
                          "Bold"
                            ? "bold"
                            : "normal",
                      }}
                    >
                      {offer.subtitle}
                    </div>
                  </div>
                </div>

                {/* Price section */}
                <div style={{ textAlign: "right" }}>
                  {advancedSettings?.pricing?.showPricesPerItem && (
                    <div
                      style={{
                        color: colors.subtitle,
                        fontSize: `${parseInt(typography?.subtitleComparedPrice?.size || 14) - 2}px`,
                        marginBottom: "2px",
                      }}
                    >
                      {formatPrice(pricing.price / parseInt(offer.quantity))}{" "}
                      each
                    </div>
                  )}

                  <div
                    style={{
                      color: colors.price,
                      fontSize: `${typography?.titlePrice?.size || 16}px`,
                      fontWeight:
                        typography?.titlePrice?.fontStyle === "Bold"
                          ? "bold"
                          : "normal",
                    }}
                  >
                    {formatPrice(pricing.price)}
                  </div>

                  {pricing.compareAtPrice &&
                    advancedSettings?.pricing?.showCompareAtPrice && (
                      <div
                        style={{
                          color: colors.comparedPrice,
                          fontSize: `${typography?.subtitleComparedPrice?.size || 14}px`,
                          fontWeight:
                            typography?.subtitleComparedPrice?.fontStyle ===
                            "Bold"
                              ? "bold"
                              : "normal",
                          textDecoration: "line-through",
                        }}
                      >
                        {formatPrice(pricing.compareAtPrice)}
                      </div>
                    )}
                </div>

                {/* Highlight tag */}
                {offer.highlight && offer.highlightSettings?.text && (
                  <div
                    style={{
                      position: "absolute",
                      top: "-10px",
                      right: "20px",
                      backgroundColor: colors.highlight,
                      color: colors.highlightText,
                      padding: "4px 8px",
                      borderRadius:
                        offer.highlightSettings?.style === "rectangle"
                          ? "4px"
                          : `${shapeSettings.blockRadius}px`,
                      fontSize: `${typography?.tagHighlight?.size || 12}px`,
                      fontWeight:
                        typography?.tagHighlight?.fontStyle === "Bold"
                          ? "bold"
                          : "normal",
                      animation: offer.highlightSettings?.blinking
                        ? "blink 1s linear infinite"
                        : "none",
                      zIndex: 1,
                    }}
                  >
                    {offer.highlightSettings.text}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Add to cart button */}
        <button
          style={{
            marginTop: "16px",
            backgroundColor: "#f0f0f0",
            color: "#999",
            border: "none",
            padding: "14px",
            borderRadius: "6px",
            cursor: "not-allowed",
            textAlign: "center",
            fontSize: "16px",
            fontWeight: "600",
            width: "100%",
            textTransform: "uppercase",
            letterSpacing: "0.5px",
          }}
        >
          ADD TO CART
        </button>
      </div>

      {/* CSS for blinking animation */}
      <style jsx>{`
        @keyframes blink {
          0%,
          50% {
            opacity: 1;
          }
          51%,
          100% {
            opacity: 0.5;
          }
        }
      `}</style>
    </Card>
  );
}

export default VolumePreview;
