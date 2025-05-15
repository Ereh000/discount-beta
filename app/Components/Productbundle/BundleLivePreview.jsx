import { Card } from "@shopify/polaris";

export default function BundleLivePreview({
  headerText,
  alignment,
  footerText,
  buttonText,
  selectedTemplate,
  selectedColor,
  settings,
  products,
  highlightOption,
  highlightTitle,
  highlightTimerTitle,
  timerEndDate,
  timerFormat,
  highlightStyle,
  isBlinking,
  typography,
  spacing,
  shapes,
  productImageSize,
  iconStyle,
  borderThickness,
  colors,
}) {
  // Helper function to get border radius based on shape type
  const getBorderRadius = (shapeType) => {
    switch (shapeType) {
      case "Rounded":
        return "10px";
      case "Pill":
        return "50px";
      case "Squared":
        return "0px";
      default:
        return "8px";
    }
  };

  // Get the color for the preview based on the selected color
  const getColorValue = (color) => {
    const colorMap = {
      black: "#000000",
      purple: "#6F42C1",
      blue: "#4285F4",
      teal: "#20B2AA",
      green: "#4CAF50",
      pink: "#FF69B4",
      red: "#FF0000",
      orange: "#FFA500",
      yellow: "#FFFF00",
      mint: "#98FB98",
    };
    return colorMap[color] || "#FF6B6B";
  };

  const themeColor = getColorValue(selectedColor);
  // console.log("themeColor: ", themeColor);
  // console.log("colors", colors);

  // Calculate dynamic styles based on props
  const bundleStyles = {
    container: {
      // backgroundColor: colors.background || "#FFFFFF",
      marginTop: `${spacing.bundleTop}px`,
      marginBottom: `${spacing.bundleBottom}px`,
    },
    header: {
      fontSize: `${typography.header.size}px`,
      fontWeight:
        typography.header.weight === "Bold"
          ? "bold"
          : typography.header.weight === "Lighter"
            ? "300"
            : "normal",
      color: colors.headerText || "#000000",
      marginBottom: "20px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
    },
    headerTitle: {
      textAlign: alignment,
      flex: 1,
    },
    productContainer: {
      display: "flex",
      alignItems: "center",
      justifyContent:
        alignment === "center"
          ? "center"
          : alignment === "right"
            ? "flex-end"
            : "flex-start",
      gap: "10px",
      flexWrap: "wrap",
      flexDirection: "column",
    },
    productItem: {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      gap: "12px",
      width: "100%",
      // backgroundColor: colors.background || "#FFFFFF",
      background: colors.background
        ? `${colors.background}10`
        : `${themeColor}10`,
      padding: "10px 14px",
      border: `${borderThickness.bundle}px solid ${colors.border || "#E1E3E5"}`,
      borderRadius: getBorderRadius(shapes.bundle),
      // borderRadius: "5px",
      // width: `${parseInt(productImageSize) + 30}px`,
    },
    productImage: {
      width: `${productImageSize}px`,
      // height: `${productImageSize}px`,
      height: "auto",
      objectFit: "cover",
      borderRadius: "5px",
      overflow: "hidden",
      // border: "1px solid #E1E3E5",
    },
    productTitle: {
      fontSize: `${typography.titlePrice.size}px`,
      fontWeight: typography.titlePrice.weight === "Bold" ? "bold" : "normal",
      color: colors.titleText || "#000000",
      textAlign: "left",
      // marginTop: "8px",
    },
    productPrice: {
      fontSize: `${typography.titlePrice.size}px`,
      fontWeight: typography.titlePrice.weight === "Bold" ? "bold" : "normal",
      color: colors.price || "#000000",
      textAlign: "left",
      display: "flex",
      flexDirection: "row-reverse",
      gap: "8px",
    },
    comparePrice: {
      fontSize: `${typography.titlePrice.size - 4}px`,
      textDecoration: "line-through",
      color: colors.comparedPrice || "#FF0000",
      marginLeft: "5px",
    },
    quantityContainer: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: colors.quantityBackground
        ? `${colors.quantityBackground}40`
        : `${themeColor}40`,
      borderRadius: "4px",
      padding: "4px 0px",
      marginTop: "4px",
      width: "25px",
    },
    quantityText: {
      fontSize: `${typography.quantityPrice.size}px`,
      fontWeight:
        typography.quantityPrice.fontStyle === "Bold" ? "bold" : "normal",
      color: colors.quantityText || "#000000",
      lineHeight: "1",
    },
    plusIcon: {
      margin: "0 10px",
      fontSize: "30px",
      color: colors.titleText || "#000000",
    },
    footer: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      backgroundColor: colors.footerBackground || "#F6F6F7",
      padding: "15px",
      borderRadius: getBorderRadius(shapes.footer),
      border: `${borderThickness.footer}px solid ${colors.border || "#E1E3E5"}`,
      marginTop: `${spacing.footerTop}px`,
      marginBottom: `${spacing.footerBottom}px`,
      position: "relative",
    },
    footerText: {
      fontSize: `${typography.titlePrice.size}px`,
      fontWeight: "bold",
      color: colors.footerText ? colors.footerText : themeColor,
      flex: 1,
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
    },
    button: {
      backgroundColor: colors.buttonBackground
        ? colors.buttonBackground
        : themeColor,
      color: colors.addToCartText || "#FFFFFF",
      border: `${borderThickness.addToCart}px solid ${colors.buttonBorder ? colors.buttonBorder : themeColor}`,
      borderRadius: getBorderRadius(shapes.addToCart),
      padding: "12px 20px",
      cursor: "pointer",
      fontSize: `${typography.titlePrice.size}px`,
      fontWeight: "bold",
      width: "100%",
    },
    highlight: {
      backgroundColor: colors.highlightBackground
        ? colors.highlightBackground
        : themeColor,
      color: colors.highlightText || "#FFFFFF",
      padding: "2px 10px",
      borderRadius: "4px",
      fontSize: `${typography.highlight.size}px`,
      fontWeight: typography.highlight.fontStyle === "Bold" ? "bold" : "normal",
      textAlign: "center",
      marginBottom: "15px",
      animation: isBlinking ? "blink 1s infinite" : "none",
      border: highlightStyle === "outline" ? "1px solid #000" : "none",
      display: highlightOption !== "none" ? "block" : "none",
      position: "absolute",
      top: "-9px",
      right: "30px",
    },
    timer: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      marginTop: "5px",
    },
    timerTitle: {
      fontSize: `${typography.highlight.size}px`,
      color: colors.highlightText || "#FFFFFF",
      marginBottom: "5px",
    },
    timerDigits: {
      fontSize: `${parseInt(typography.highlight.size) + 2}px`,
      fontWeight: "bold",
      color: colors.highlightText || "#FFFFFF",
    },
  };

  // Function to render the highlight section based on highlightOption
  const renderHighlight = () => {
    if (highlightOption === "none") return null;

    return (
      <div className="">
        <div className="badge_content_wrapper" style={bundleStyles.highlight}>
          {highlightOption === "text" && <div>{highlightTitle}</div>}
          {highlightOption === "timer" && (
            <div className="bundle-timer" style={bundleStyles.timer}>
              <div className="timer-title" style={bundleStyles.timerTitle}>
                {highlightTimerTitle}
              </div>
              <div className="timer-digits" style={bundleStyles.timerDigits}>
                {timerFormat === "dd:hh:mm:ss" ? "01:23:45:67" : "23:45:67"}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  console.log("bundleStyles", bundleStyles);

  // Function to render product items with plus icons between them
  const renderProductsWithIcons = () => {
    const items = [];
    products.forEach((product, index) => {
      items.push(
        <div
          key={`product-${product.id}`}
          className="bundle-product-item"
          style={bundleStyles.productItem}
        >
          <div className="product-image" style={bundleStyles.productImage}>
            {product.image ? (
              <img
                src={product.image}
                alt={product.name}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  borderRadius: bundleStyles.productImage.borderRadius,
                }}
              />
            ) : (
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  // backgroundColor: "#E1E3E5",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {/* {product.name ? product.name.charAt(0) : "P"} */}
                <img
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  src="https://app.rapibundle.com/images/shirt.png"
                  alt=""
                />
              </div>
            )}
          </div>
          <div className="product-contents" style={{ flex: 1 }}>
            <div
              className="title_price_container"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <div className="product-title" style={bundleStyles.productTitle}>
                {product.name || `Product ${index + 1}`}
              </div>
              {settings.showPrices && (
                <div
                  className="product-price"
                  style={bundleStyles.productPrice}
                >
                  $19.99
                  {settings.showComparePrice && (
                    <span
                      className="compare-price"
                      style={bundleStyles.comparePrice}
                    >
                      $29.99
                    </span>
                  )}
                </div>
              )}
            </div>
            <div
              className="quantity-container"
              style={bundleStyles.quantityContainer}
            >
              <span className="quantity-text" style={bundleStyles.quantityText}>
                x{product.quantity}
              </span>
            </div>
          </div>
        </div>,
      );

      // Add plus icon between products
      if (index < products.length - 1) {
        items.push(
          <div
            key={`plus-${index}`}
            className="plus-icon"
            style={bundleStyles.plusIcon}
          >
            +
          </div>,
        );
      }
    });

    return items;
  };

  return (
    <Card title="Live Preview">
      <div className="bundle-preview-container">
        <div
          className={`bundle-container template-${selectedTemplate} color-${selectedColor}`}
          style={bundleStyles.container}
        >
          <div className="header-wrapper" style={bundleStyles.header}>
            {headerText && (
              <div className="bundle-header" style={bundleStyles.headerTitle}>
                {headerText}
              </div>
            )}
            <span>🛒</span>
          </div>

          <div
            className="bundle-product-container"
            style={bundleStyles.productContainer}
          >
            {renderProductsWithIcons()}
          </div>

          <div className="footer_wrapper">
            <div className="bundle-footer" style={bundleStyles.footer}>
              {renderHighlight()}

              <div className="footer-text" style={bundleStyles.footerText}>
                {footerText}
                <span style={{ color: "#000" }}>$59.97</span>
              </div>
            </div>
            <button className="bundle-button" style={bundleStyles.button}>
              {buttonText}
            </button>
          </div>
        </div>
      </div>
    </Card>
  );
}
