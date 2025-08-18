// app/routes/app.product-bundle.$id.jsx

import {
  Grid,
  Page,
  InlineStack,
  ButtonGroup,
  Button,
  Banner,
} from "@shopify/polaris";
import { useState, useCallback, useEffect } from "react";
import { useFetcher, useLoaderData, useParams, json } from "@remix-run/react";
import BundleSettingsCard from "../Components/Productbundle/BundleSettings";
import BundleLivePreview from "../Components/Productbundle/BundleLivePreview";
import prisma from "../db.server";
import { fetchShop } from "../utils/getShop";
import { useBundleState } from "../hooks/useBundleState";
import { useProductManagement } from "../hooks/useProductManagement";
import { VALIDATION_MESSAGES, BANNER_MESSAGES } from "../utils/productBundle/bundleConstants";

// ========== Remix Loader Function - UPDATED -----------
export async function loader({ request, params }) {
  const { id } = params;
  const shop = await fetchShop(request);

  if (id === "new") {
    try {
      // Check for existing bundles to validate position restrictions
      const existingBundles = await prisma.bundle.findMany({
        where: { shop: shop.id },
        select: { id: true, position: true, name: true },
      });

      // Check if there's already a bundle with position "all"
      const hasAllPositionBundle = existingBundles.some(bundle => 
        bundle.position === 'all'
      );

      return json({ 
        success: true, 
        isEdit: false, 
        data: null,
        hasAllPositionBundle, // Flag to indicate if "all" position bundle exists
        existingBundleNames: existingBundles
          .filter((bundle) => bundle.name)
          .map((bundle) => bundle.name.trim()),
      });
    } catch (error) {
      console.error("Error fetching existing bundles:", error);
      return json({ 
        success: true, 
        isEdit: false, 
        data: null,
        hasAllPositionBundle: false,
        existingBundleNames: [],
      });
    }
  }

  try {
    const bundle = await prisma.bundle.findFirst({
      where: {
        id: parseInt(id),
        shop: shop.id,
      },
      include: {
        products: true,
      },
    });

    if (!bundle) {
      throw new Response("Bundle not found", { status: 404 });
    }

    // Check for existing bundles excluding current one
    const existingBundles = await prisma.bundle.findMany({
      where: {
        shop: shop.id,
        id: { not: parseInt(id) }, // Exclude current bundle
      },
      select: { id: true, position: true, name: true },
    });

    // Check if there's already a bundle with position "all" (excluding current)
    const hasAllPositionBundle = existingBundles.some(bundle => 
      bundle.position === 'all'
    );

    return json({ 
      success: true, 
      isEdit: true, 
      data: bundle,
      hasAllPositionBundle, // Flag to indicate if "all" position bundle exists
      existingBundleNames: existingBundles
        .filter((bundle) => bundle.name)
        .map((bundle) => bundle.name.trim()),
    });
  } catch (error) {
    console.error("Error loading bundle:", error);
    throw new Response("Error loading bundle", { status: 500 });
  }
}

export default function EditProductBundle() {
  const { isEdit, data, hasAllPositionBundle = false, existingBundleNames = [] } = useLoaderData();
  const params = useParams();
  const { id } = params;
  const fetcher = useFetcher();

  // Use custom hooks for state management
  const {
    basicSettings,
    setBasicSettings,
    pricingSettings,
    setPricingSettings,
    highlightSettings,
    setHighlightSettings,
    designSettings,
    setDesignSettings,
    generalSettings,
    setGeneralSettings,
    products,
    setProducts
  } = useBundleState(isEdit, data);

  const {
    handleAddProduct,
    handleRemoveProduct,
    handleProductNameChange,
    handleProductQuantityChange
  } = useProductManagement(products, setProducts);

  // Store original position for edit mode validation
  const [originalPosition, setOriginalPosition] = useState(() => {
    if (isEdit && data?.position) {
      return data.position;
    }
    return 'specific'; // Default position
  });

  // Banner state - Enhanced
  const [showBanner, setShowBanner] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [bannerTone, setBannerTone] = useState("critical");

  // Settings handler
  const handleSettingChange = useCallback((setting) => {
    setGeneralSettings((prev) => ({
      ...prev,
      [setting]: !prev[setting],
    }));
  }, [setGeneralSettings]);

  // Enhanced: Position validation function
  const validatePositionSettings = useCallback(
    (currentPosition, hasAllPositionBundle, isEdit, originalPosition) => {
      // If trying to set position to "all"
      if (currentPosition === "all") {
        // If creating a new bundle and there's already an "all" position bundle
        if (!isEdit && hasAllPositionBundle) {
          return {
            isValid: false,
            message: VALIDATION_MESSAGES.ALL_POSITION_BUNDLE_EXISTS,
          };
        }
        
        // If editing and changing FROM another position TO "all"
        // and there's already an "all" position bundle
        if (isEdit && originalPosition !== "all" && hasAllPositionBundle) {
          return {
            isValid: false,
            message: VALIDATION_MESSAGES.ALL_POSITION_BUNDLE_EXISTS,
          };
        }
      }
      
      return { isValid: true };
    },
    [],
  );

  // Enhanced: Show error helper function
  const showErrorBanner = useCallback((message) => {
    setErrorMessage(message);
    setBannerTone("critical");
    setShowBanner(true);
    
    // Auto-hide banner after 10 seconds for validation errors
    setTimeout(() => {
      setShowBanner(false);
      setErrorMessage("");
    }, 10000);
  }, []);

  // Enhanced: Show success helper function
  const showSuccessBanner = useCallback((message) => {
    setErrorMessage(message);
    setBannerTone("success");
    setShowBanner(true);
    
    // Auto-hide banner after 5 seconds for success messages
    setTimeout(() => {
      setShowBanner(false);
      setErrorMessage("");
    }, 5000);
  }, []);

  // Enhanced: Save handler with Banner error messages
  const handleSave = useCallback(async (status) => {
    // Clear any existing banner first
    setShowBanner(false);
    setErrorMessage("");

    console.log("Validating bundle save for status:", status);

    // Validate: Check if products are selected
    const hasSelectedProducts = products.some(
      (product) => product.name && product.name.trim() !== ""
    );

    if (!hasSelectedProducts) {
      showErrorBanner(VALIDATION_MESSAGES.NO_PRODUCTS_SELECTED);
      return;
    }

    // Validate: Check bundle name is not empty
    if (!basicSettings.bundleName || basicSettings.bundleName.trim() === "") {
      showErrorBanner("Bundle name cannot be empty. Please provide a name for your bundle.");
      return;
    }

    // Validate: Position settings - Show error in Banner
    const positionValidation = validatePositionSettings(
      basicSettings.position,
      hasAllPositionBundle,
      isEdit,
      originalPosition
    );
    
    if (!positionValidation.isValid) {
      showErrorBanner(positionValidation.message);
      return;
    }

    // Validate: Check for duplicate bundle names
    if (existingBundleNames.includes(basicSettings.bundleName?.trim())) {
      showErrorBanner(VALIDATION_MESSAGES.DUPLICATE_BUNDLE_NAME);
      return;
    }

    // All validations passed, prepare data for submission
    const bundleData = {
      status,
      bundleName: basicSettings.bundleName,
      headerText: basicSettings.headerText,
      alignment: basicSettings.alignment,
      footerText: basicSettings.footerText,
      buttonText: basicSettings.buttonText,
      position: basicSettings.position,
      selectedColor: basicSettings.selectedColor,
      productImageSize: basicSettings.productImageSize,
      iconStyle: basicSettings.iconStyle,
      pricingOption: pricingSettings.option,
      discountPercentage: pricingSettings.discountPercentage,
      fixedDiscount: pricingSettings.fixedDiscount,
      fixedPrice: pricingSettings.fixedPrice,
      highlightOption: highlightSettings.option,
      highlightTitle: highlightSettings.title,
      highlightTimerTitle: highlightSettings.timerTitle,
      isBlinking: highlightSettings.isBlinking,
      highlightStyle: highlightSettings.style,
      timerEndDate: highlightSettings.timerEndDate,
      timerFormat: highlightSettings.timerFormat,
      typography: designSettings.typography,
      spacing: designSettings.spacing,
      shapes: designSettings.shapes,
      borderThickness: designSettings.borderThickness,
      colors: designSettings.colors,
      settings: generalSettings,
      products,
      bundleId: id,
      isEdit: isEdit,
    };

    console.log("Submitting bundle data:", bundleData);

    try {
      const formData = new FormData();
      formData.append("bundleData", JSON.stringify(bundleData));

      fetcher.submit(formData, { 
        method: "post", 
        action: "/api/product-bundle-create" 
      });
    } catch (error) {
      console.error("Error submitting form:", error);
      showErrorBanner("Error submitting form: " + error.message);
    }
  }, [
    products, 
    basicSettings, 
    pricingSettings, 
    highlightSettings, 
    designSettings, 
    generalSettings, 
    id, 
    isEdit, 
    fetcher,
    validatePositionSettings,
    hasAllPositionBundle,
    originalPosition,
    existingBundleNames,
    showErrorBanner
  ]);

  // Enhanced: Handle fetcher response
  useEffect(() => {
    if (fetcher.data) {
      if (fetcher.data.success) {
        showSuccessBanner(fetcher.data.message);
      } else {
        showErrorBanner(fetcher.data.error || fetcher.data.message || "An error occurred");
      }
    }
  }, [fetcher.data, showSuccessBanner, showErrorBanner]);

  const pageTitle = isEdit ? `Edit ${basicSettings.bundleName}` : "Create Product Bundle";
  const isSubmitting = fetcher.state === "submitting";

  return (
    <Page 
      title={pageTitle} 
      backAction={{ content: "Bundles", url: "/app" }}
    >
      {/* Enhanced Banner - Shows all validation and API errors */}
      {showBanner && (
        <div className="">
          <Banner
            title={bannerTone === "success" ? BANNER_MESSAGES.SUCCESS : BANNER_MESSAGES.ERROR}
            onDismiss={() => {
              setShowBanner(false);
              setErrorMessage("");
            }}
            tone={bannerTone}
          >
            <p>{errorMessage}</p>
          </Banner>
          <br />
        </div>
      )}

      <Grid>
        <Grid.Cell columnSpan={{ xs: 6, sm: 3, md: 3, lg: 6, xl: 6 }}>
          <BundleSettingsCard
            bundleName={basicSettings.bundleName}
            setBundleName={(value) => setBasicSettings(prev => ({...prev, bundleName: value}))}
            headerText={basicSettings.headerText}
            setHeaderText={(value) => setBasicSettings(prev => ({...prev, headerText: value}))}
            alignment={basicSettings.alignment}
            setAlignment={(value) => setBasicSettings(prev => ({...prev, alignment: value}))}
            footerText={basicSettings.footerText}
            setFooterText={(value) => setBasicSettings(prev => ({...prev, footerText: value}))}
            buttonText={basicSettings.buttonText}
            setButtonText={(value) => setBasicSettings(prev => ({...prev, buttonText: value}))}
            position={basicSettings.position}
            setPosition={(value) => setBasicSettings(prev => ({...prev, position: value}))}
            selectedColor={basicSettings.selectedColor}
            setSelectedColor={(value) => setBasicSettings(prev => ({...prev, selectedColor: value}))}
            settings={generalSettings}
            handleSettingChange={handleSettingChange} 
            pricingOption={pricingSettings.option}
            setPricingOption={(value) => setPricingSettings(prev => ({...prev, option: value}))}
            discountPercentage={pricingSettings.discountPercentage}
            setDiscountPercentage={(value) => setPricingSettings(prev => ({...prev, discountPercentage: value}))}
            fixedDiscount={pricingSettings.fixedDiscount}
            setFixedDiscount={(value) => setPricingSettings(prev => ({...prev, fixedDiscount: value}))}
            fixedPrice={pricingSettings.fixedPrice}
            setFixedPrice={(value) => setPricingSettings(prev => ({...prev, fixedPrice: value}))}
            highlightOption={highlightSettings.option}
            setHighlightOption={(value) => setHighlightSettings(prev => ({...prev, option: value}))}
            highlightTitle={highlightSettings.title}
            setHighlightTitle={(value) => setHighlightSettings(prev => ({...prev, title: value}))}
            highlightTimerTitle={highlightSettings.timerTitle}
            setHighlightTimerTitle={(value) => setHighlightSettings(prev => ({...prev, timerTitle: value}))}
            isBlinking={highlightSettings.isBlinking}
            setIsBlinking={(value) => setHighlightSettings(prev => ({...prev, isBlinking: value}))}
            highlightStyle={highlightSettings.style}
            setHighlightStyle={(value) => setHighlightSettings(prev => ({...prev, style: value}))}
            timerEndDate={highlightSettings.timerEndDate}
            setTimerEndDate={(value) => setHighlightSettings(prev => ({...prev, timerEndDate: value}))}
            timerFormat={highlightSettings.timerFormat}
            setTimerFormat={(value) => setHighlightSettings(prev => ({...prev, timerFormat: value}))}
            products={products}
            handleAddProduct={handleAddProduct}
            handleRemoveProduct={handleRemoveProduct}
            handleProductNameChange={handleProductNameChange}
            handleProductQuantityChange={handleProductQuantityChange}
            setProducts={setProducts}
            typography={designSettings.typography}
            setTypography={(value) => setDesignSettings(prev => ({...prev, typography: value}))}
            spacing={designSettings.spacing}
            setSpacing={(value) => setDesignSettings(prev => ({...prev, spacing: value}))}
            shapes={designSettings.shapes}
            setShapes={(value) => setDesignSettings(prev => ({...prev, shapes: value}))}
            productImageSize={basicSettings.productImageSize}
            setProductImageSize={(value) => setBasicSettings(prev => ({...prev, productImageSize: value}))}
            iconStyle={basicSettings.iconStyle}
            setIconStyle={(value) => setBasicSettings(prev => ({...prev, iconStyle: value}))}
            borderThickness={designSettings.borderThickness}
            setBorderThickness={(value) => setDesignSettings(prev => ({...prev, borderThickness: value}))}
            colors={designSettings.colors}
            setColors={(value) => setDesignSettings(prev => ({...prev, colors: value}))}
            // Pass validation props (no longer needed for disabling, but can be used for other UI hints)
            hasAllPositionBundle={hasAllPositionBundle}
            isEdit={isEdit}
            originalPosition={originalPosition}
          />
        </Grid.Cell>
        <Grid.Cell columnSpan={{ xs: 6, sm: 3, md: 3, lg: 6, xl: 6 }}>
          <BundleLivePreview
            headerText={basicSettings.headerText}
            alignment={basicSettings.alignment}
            footerText={basicSettings.footerText}
            buttonText={basicSettings.buttonText}
            selectedColor={basicSettings.selectedColor}
            settings={generalSettings}  
            products={products}
            highlightOption={highlightSettings.option}
            highlightTitle={highlightSettings.title}
            highlightTimerTitle={highlightSettings.timerTitle}
            timerEndDate={highlightSettings.timerEndDate}
            timerFormat={highlightSettings.timerFormat}
            highlightStyle={highlightSettings.style}
            isBlinking={highlightSettings.isBlinking}
            typography={designSettings.typography}
            spacing={designSettings.spacing}
            shapes={designSettings.shapes}
            productImageSize={basicSettings.productImageSize}
            iconStyle={basicSettings.iconStyle}
            borderThickness={designSettings.borderThickness}
            colors={designSettings.colors}
          />
          <br />
          <InlineStack align="end">
            <ButtonGroup>
              <Button
                type="button"
                onClick={() => handleSave("draft")}
                loading={isSubmitting}
                disabled={isSubmitting}
              >
                Save as draft
              </Button>
              <Button 
                variant="primary" 
                tone="critical"
                type="button"
                disabled={isSubmitting}
              >
                Delete
              </Button>
              <Button
                variant="primary"
                type="button"
                onClick={() => handleSave("published")}
                loading={isSubmitting}
                disabled={isSubmitting}
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
