import {
  Grid,
  Page,
  InlineStack,
  ButtonGroup,
  Button,
  Banner,
} from "@shopify/polaris";
import React, { useState, useCallback, useEffect } from "react";
import { useFetcher, useLoaderData, useParams, json } from "@remix-run/react";
import "./_index/style.css";
import BundleSettingsCard from "../Components/Productbundle/BundleSettings";
import BundleLivePreview from "../Components/Productbundle/BundleLivePreview";
import prisma from "../db.server";
import { fetchShop } from "../utils/getShop";

// ========== Remix Loader Function -----------
export async function loader({ request, params }) {
  const { id } = params;
  const shop = await fetchShop(request);

  // If id is "new", return empty data for creation
  if (id === "new") {
    return json({ 
      success: true, 
      isEdit: false, 
      data: null 
    });
  }

  // If id exists, fetch the bundle data for editing
  try {
    const bundle = await prisma.bundle.findFirst({
      where: {
        id: parseInt(id),
        shop: shop.id,
      },
      include: {
        products: true, // Include related products
      },
    });

    if (!bundle) {
      throw new Response("Bundle not found", { status: 404 });
    }

    return json({ 
      success: true, 
      isEdit: true, 
      data: bundle 
    });
  } catch (error) {
    console.error("Error loading bundle:", error);
    throw new Response("Error loading bundle", { status: 500 });
  }
}

export default function EditProductBundle() {
  const { success, isEdit, data } = useLoaderData();
  const params = useParams();
  const { id } = params;

  // Helper function to initialize state from loaded data
  const initializeState = (defaultValue, settingsPath = null, directPath = null) => {
    if (isEdit && data) {
      if (directPath) {
        return data[directPath] !== undefined ? data[directPath] : defaultValue;
      }
      if (settingsPath && data.settings) {
        const keys = settingsPath.split('.');
        let value = data.settings;
        for (const key of keys) {
          value = value?.[key];
        }
        return value !== undefined ? value : defaultValue;
      }
    }
    return defaultValue;
  };

  // Initialize all state variables
  const [bundleName, setBundleName] = useState(initializeState("Bundle 1", null, "name"));
  const [headerText, setHeaderText] = useState(initializeState("Frequently bought together", "header"));
  const [alignment, setAlignment] = useState(initializeState("left", "alignment"));
  const [footerText, setFooterText] = useState(initializeState("Total :", "footer"));
  const [buttonText, setButtonText] = useState(initializeState("Claim Offer", "button"));
  const [position, setPosition] = useState(initializeState("all", "position"));
  const [publishOption, setPublishOption] = useState(initializeState("immediately", "publishOption"));
  const [selectedTemplate, setSelectedTemplate] = useState(initializeState("royal", "template"));
  const [selectedColor, setSelectedColor] = useState(initializeState("purple", "color"));

  // Pricing options
  const [pricingOption, setPricingOption] = useState(initializeState("default", "pricing.option"));
  const [discountPercentage, setDiscountPercentage] = useState(initializeState("10", "pricing.discountPercentage"));
  const [fixedDiscount, setFixedDiscount] = useState(initializeState("25", "pricing.fixedDiscount"));
  const [fixedPrice, setFixedPrice] = useState(initializeState("99", "pricing.fixedPrice"));

  // Highlight options
  const [highlightOption, setHighlightOption] = useState(initializeState("text", "highlight.option"));
  const [highlightTitle, setHighlightTitle] = useState(initializeState("Unlock Your Discount", "highlight.title"));
  const [highlightTimerTitle, setHighlightTimerTitle] = useState(initializeState("Offer ends in", "highlight.timerTitle"));
  const [isBlinking, setIsBlinking] = useState(initializeState(false, "highlight.isBlinking"));
  const [highlightStyle, setHighlightStyle] = useState(initializeState("solid", "highlight.style"));
  const [timerEndDate, setTimerEndDate] = useState(initializeState("", "highlight.timerEndDate"));
  const [timerFormat, setTimerFormat] = useState(initializeState("dd:hh:mm:ss", "highlight.timerFormat"));

  // Products in bundle - Initialize from loaded data or defaults
  const [products, setProducts] = useState(() => {
    if (isEdit && data?.products && data.products.length > 0) {
      return data.products.map((product, index) => ({
        id: index + 1,
        name: product.name || "",
        quantity: product.quantity || 1,
        productId: product.productId || null,
        image: product.image || null,
        productHandle: product.productHandle || null,
      }));
    }
    return [
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
    ];
  });

  // Typography settings
  const [typography, setTypography] = useState(
    initializeState({
      header: { size: "18", weight: "Bold" },
      titlePrice: { size: "16", weight: "Bold" },
      quantityPrice: { size: "13", fontStyle: "Regular" },
      highlight: { size: "10.5", fontStyle: "Bold" },
    }, "typography")
  );

  // Spacing settings
  const [spacing, setSpacing] = useState(
    initializeState({
      bundleTop: "10",
      bundleBottom: "6",
      footerTop: "20",
      footerBottom: "10",
    }, "spacing")
  );

  // Shape settings
  const [shapes, setShapes] = useState(
    initializeState({
      bundle: "Rounded",
      footer: "Rounded",
      addToCart: "Rounded",
    }, "shapes")
  );

  const [productImageSize, setProductImageSize] = useState(initializeState("56", "productImageSize"));
  const [iconStyle, setIconStyle] = useState(initializeState("Plus 5", "iconStyle"));

  // Border thickness
  const [borderThickness, setBorderThickness] = useState(
    initializeState({
      bundle: "1",
      footer: "0",
      addToCart: "2",
    }, "borderThickness")
  );

  // Color settings
  const [colors, setColors] = useState(
    initializeState({
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
    }, "colors")
  );

  // General settings
  const [settings, setSettings] = useState(
    initializeState({
      variantChoice: true,
      showPrices: true,
      showComparePrice: true,
      skipCart: false,
      redirectToProduct: true,
      redirectToNewTab: true,
    }, "general")
  );

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

  // Save handler using separate API route
  const fetcher = useFetcher();
  const handleSave = async (status) => {
    // Check if any products have been selected
    const hasSelectedProducts = products.some(
      (product) => product.name && product.name.trim() !== "",
    );

    if (!hasSelectedProducts) {
      setShowBanner(true);
      setErrorMessage("Please select at least one product for your bundle before saving.");
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
      bundleId: id, // Pass the ID to determine create vs update
      isEdit: isEdit, // Pass edit flag
    };

    fetcher.submit(
      { bundleData: JSON.stringify(bundleData) },
      { method: "post", action: "/api/product-bundle-create" },
    );
  };

  // State for banner
  const [showBanner, setShowBanner] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (fetcher.data) {
      setShowBanner(true);
    }
  }, [fetcher.data]);

  const pageTitle = isEdit ? `Edit ${bundleName}` : "Create Product Bundle";

  return (
    <Page 
      title={pageTitle} 
      backAction={{ content: "Bundles", url: "/app" }}
    >
      {showBanner && (fetcher.data || errorMessage) && (
        <div className="">
          <Banner
            title={fetcher.data?.success ? "Success!" : "Something went wrong"}
            onDismiss={() => {
              setShowBanner(false);
              setErrorMessage("");
            }}
            tone={fetcher.data?.success ? "success" : "critical"}
          >
            <p>{fetcher.data?.message || fetcher.data?.error || errorMessage}</p>
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
            products={products}
            highlightOption={highlightOption}
            highlightTitle={highlightTitle}
            highlightTimerTitle={highlightTimerTitle}
            timerEndDate={timerEndDate}
            timerFormat={timerFormat}
            highlightStyle={highlightStyle}
            isBlinking={isBlinking}
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
                {isEdit ? "Update" : "Publish"}
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
