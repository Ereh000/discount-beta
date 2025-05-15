// app-additional

import {
  Grid,
  Page,
  InlineStack,
  ButtonGroup,
  Button,
  Banner,
} from "@shopify/polaris";
import React, { useState, useCallback, useEffect } from "react";
import { json, useFetcher } from "@remix-run/react";
import "./_index/style.css";
import BundleSettingsCard from "../Components/Productbundle/BundleSettings";
import BundleLivePreview from "../Components/Productbundle/BundleLivePreview";

export default function EditProductBundle() {
  // Lift state up from BundleSettingsCard
  const [bundleName, setBundleName] = useState("Bundle 1");
  const [headerText, setHeaderText] = useState("Frequently bought together");
  const [alignment, setAlignment] = useState("left");
  const [footerText, setFooterText] = useState("Total :");
  const [buttonText, setButtonText] = useState("Claim Offer");
  const [position, setPosition] = useState("all");
  const [publishOption, setPublishOption] = useState("immediately");
  const [selectedTemplate, setSelectedTemplate] = useState("royal");
  const [selectedColor, setSelectedColor] = useState("purple");
  // Pricing options
  const [pricingOption, setPricingOption] = useState("default");
  const [discountPercentage, setDiscountPercentage] = useState("10");
  const [fixedDiscount, setFixedDiscount] = useState("25");
  const [fixedPrice, setFixedPrice] = useState("99");
  // Highlight options
  const [highlightOption, setHighlightOption] = useState("text");
  const [highlightTitle, setHighlightTitle] = useState("Unlock Your Discount");
  const [highlightTimerTitle, setHighlightTimerTitle] =
    useState("Offer ends in");
  const [isBlinking, setIsBlinking] = useState(false);
  const [highlightStyle, setHighlightStyle] = useState("solid");
  const [timerEndDate, setTimerEndDate] = useState("");
  const [timerFormat, setTimerFormat] = useState("dd:hh:mm:ss");
  // Products in bundle
  const [products, setProducts] = useState([
    {
      id: 1,
      name: "",
      quantity: 1,
      productId: null,
      image: null,
      productHandle: null,
    },
    {
      id: 2,
      name: "",
      quantity: 1,
      productId: null,
      image: null,
      productHandle: null,
    },
    {
      id: 3,
      name: "",
      quantity: 1,
      productId: null,
      image: null,
      productHandle: null,
    },
  ]);
  // console.log("products", products)
  // First, add these new state variables at the top of your EditProductBundle component
  const [typography, setTypography] = useState({
    header: { size: "18", weight: "Bold" },
    titlePrice: { size: "16", weight: "Bold" },
    quantityPrice: { size: "13", fontStyle: "Regular" },
    highlight: { size: "10.5", fontStyle: "Bold" },
  });
  const [spacing, setSpacing] = useState({
    bundleTop: "10",
    bundleBottom: "6",
    footerTop: "20",
    footerBottom: "10",
  });
  const [shapes, setShapes] = useState({
    bundle: "Rounded",
    footer: "Rounded",
    addToCart: "Rounded",
  });
  const [productImageSize, setProductImageSize] = useState("56");
  const [iconStyle, setIconStyle] = useState("Plus 5");
  const [borderThickness, setBorderThickness] = useState({
    bundle: "1",
    footer: "0",
    addToCart: "2",
  });

  // First, add these new state variables at the top of your component
  // color tab states
  const [colors, setColors] = useState({
    background: "",
    border: "#E1E3E5",
    footerBackground: "#F6F6F7",
    buttonBackground: "",
    buttonBorder: "",
    highlightBackground: "",
    quantityBackground: "",
    price: "#000000",
    comparedPrice: "#FF0000",
    headerText: "#000000",
    titleText: "#000000",
    highlightText: "#FFFFFF",
    addToCartText: "#FFFFFF",
    quantityText: "#000000",
    footerText: "",
  });
  // console.log("products", products)

  const [settings, setSettings] = useState({
    variantChoice: true,
    showPrices: true,
    showComparePrice: true,
    skipCart: false,
    redirectToProduct: true,
    redirectToNewTab: true,
  });

  // Handler to add a new product to the bundle
  const handleAddProduct = useCallback(() => {
    setProducts((prev) => [
      ...prev,
      {
        id: prev.length > 0 ? Math.max(...prev.map((p) => p.id)) + 1 : 1,
        name: "",
        quantity: 1,
        productId: null,
        image: null,
        handle: null,
      },
    ]);
  }, []);

  // Handler to remove a product from the bundle
  const handleRemoveProduct = useCallback((productId) => {
    setProducts((prev) => prev.filter((product) => product.id !== productId));
  }, []);

  // Handler for settings changes
  const handleSettingChange = useCallback((setting) => {
    setSettings((prev) => ({
      ...prev,
      [setting]: !prev[setting],
    }));
  }, []);

  // Handler for product name changes
  const handleProductNameChange = useCallback(
    (index, value) => {
      const updatedProducts = [...products];
      updatedProducts[index].name = value;
      setProducts(updatedProducts);
    },
    [products],
  );

  // Handler for product quantity changes
  const handleProductQuantityChange = useCallback(
    (index, value) => {
      const updatedProducts = [...products];
      updatedProducts[index].quantity = parseInt(value) || 1;
      setProducts(updatedProducts);
    },
    [products],
  );

  // In EditProductBundle component, add this before the return statement
  const fetcher = useFetcher();
  // console.log(fetcher.data?.bundleData, "success")
  const handleSave = async (status) => {
    // Check if any products have been selected
    const hasSelectedProducts = products.some(
      (product) => product.name && product.name.trim() !== "",
    );

    if (!hasSelectedProducts) {
      // Show error message if no products are selected
      setShowBanner(true);
      fetcher.data = {
        success: false,
        error:
          "Please select at least one product for your bundle before saving.",
      };
      return;
    }

    const bundleData = {
      status, // 'draft' or 'published'
      bundleName,
      headerText,
      alignment,
      footerText,
      buttonText,
      position,
      publishOption,
      selectedTemplate,
      selectedColor,
      settings,
      pricingOption,
      discountPercentage,
      fixedDiscount,
      fixedPrice,
      highlightOption,
      highlightTitle,
      highlightTimerTitle,
      isBlinking,
      highlightStyle,
      timerEndDate,
      timerFormat,
      products,
      typography,
      spacing,
      shapes,
      productImageSize,
      iconStyle,
      borderThickness,
      colors,
    };

    fetcher.submit(
      { bundleData: JSON.stringify(bundleData) },
      { method: "post", action: "/api/product-bundle-create" },
    );
  };

  // State for banner
  const [showBanner, setShowBanner] = useState(false);
  useEffect(() => {
    if (fetcher.data) {
      setShowBanner(true);
    }
  }, [fetcher.data]);

  return (
    <Page title={bundleName} backAction={{ url: "/app" }}>
      {showBanner && fetcher.data && (
        <div className="">
          <Banner
            title="Something went wrong"
            onDismiss={() => setShowBanner(false)}
            tone={fetcher.data?.success ? "success" : "critical"}
          >
            <p>{fetcher.data?.message || fetcher.data?.error}</p>
          </Banner>
          <br />
        </div>
      )}

      <Grid>
        <Grid.Cell columnSpan={{ xs: 6, sm: 3, md: 3, lg: 6, xl: 6 }}>
          <BundleSettingsCard
            bundleName={bundleName}
            setBundleName={setBundleName}
            headerText={headerText}
            setHeaderText={setHeaderText}
            alignment={alignment}
            setAlignment={setAlignment}
            footerText={footerText}
            setFooterText={setFooterText}
            buttonText={buttonText}
            setButtonText={setButtonText}
            position={position}
            setPosition={setPosition}
            publishOption={publishOption}
            setPublishOption={setPublishOption}
            selectedTemplate={selectedTemplate}
            setSelectedTemplate={setSelectedTemplate}
            selectedColor={selectedColor}
            setSelectedColor={setSelectedColor}
            settings={settings}
            handleSettingChange={handleSettingChange}
            pricingOption={pricingOption}
            setPricingOption={setPricingOption}
            discountPercentage={discountPercentage}
            setDiscountPercentage={setDiscountPercentage}
            fixedDiscount={fixedDiscount}
            setFixedDiscount={setFixedDiscount}
            fixedPrice={fixedPrice}
            setFixedPrice={setFixedPrice}
            highlightOption={highlightOption}
            setHighlightOption={setHighlightOption}
            highlightTitle={highlightTitle}
            setHighlightTitle={setHighlightTitle}
            highlightTimerTitle={highlightTimerTitle}
            setHighlightTimerTitle={setHighlightTimerTitle}
            isBlinking={isBlinking}
            setIsBlinking={setIsBlinking}
            highlightStyle={highlightStyle}
            setHighlightStyle={setHighlightStyle}
            timerEndDate={timerEndDate}
            setTimerEndDate={setTimerEndDate}
            timerFormat={timerFormat}
            setTimerFormat={setTimerFormat}
            products={products}
            handleAddProduct={handleAddProduct}
            handleRemoveProduct={handleRemoveProduct}
            handleProductNameChange={handleProductNameChange}
            handleProductQuantityChange={handleProductQuantityChange}
            setProducts={setProducts}
            typography={typography}
            setTypography={setTypography}
            spacing={spacing}
            setSpacing={setSpacing}
            shapes={shapes}
            setShapes={setShapes}
            productImageSize={productImageSize}
            setProductImageSize={setProductImageSize}
            iconStyle={iconStyle}
            setIconStyle={setIconStyle}
            borderThickness={borderThickness}
            setBorderThickness={setBorderThickness}
            colors={colors}
            setColors={setColors}
          />
        </Grid.Cell>
        <Grid.Cell columnSpan={{ xs: 6, sm: 3, md: 3, lg: 6, xl: 6 }}>
          <BundleLivePreview
            headerText={headerText}
            alignment={alignment}
            footerText={footerText}
            buttonText={buttonText}
            selectedTemplate={selectedTemplate}
            selectedColor={selectedColor}
            settings={settings}
            products={products} // Add this line
            // Add new props
            highlightOption={highlightOption}
            highlightTitle={highlightTitle}
            highlightTimerTitle={highlightTimerTitle}
            timerEndDate={timerEndDate}
            timerFormat={timerFormat}
            highlightStyle={highlightStyle}
            isBlinking={isBlinking}
            // ... existing props ...
            typography={typography}
            spacing={spacing}
            shapes={shapes}
            productImageSize={productImageSize}
            iconStyle={iconStyle}
            borderThickness={borderThickness}
            colors={colors}
          />
          <br />
          <InlineStack align="end">
            <ButtonGroup>
              <Button
                onClick={() => handleSave("draft")}
                loading={fetcher.state === "submitting"}
              >
                Save as draft
              </Button>
              <Button variant="primary" tone="critical">
                Delete
              </Button>
              <Button
                variant="primary"
                onClick={() => handleSave("published")}
                loading={fetcher.state === "submitting"}
              >
                Publish
              </Button>
            </ButtonGroup>
          </InlineStack>
        </Grid.Cell>
      </Grid>
      <br />
      <br />
    </Page>
  );
}
