// app/routes/app.product-bundle.$id.jsx

import React, { useState, useCallback, useEffect } from "react";
import {
  Grid,
  Page,
  InlineStack,
  ButtonGroup,
  Button,
  Banner,
} from "@shopify/polaris";
import { useFetcher, useLoaderData, useParams, json } from "@remix-run/react";
import BundleSettingsCard from "../Components/Productbundle/BundleSettings";
import BundleLivePreview from "../Components/Productbundle/BundleLivePreview";
import prisma from "../db.server";
import { fetchShop } from "../utils/getShop";
import { useBundleState } from "../hooks/useBundleState";
import { useProductManagement } from "../hooks/useProductManagement";
import { VALIDATION_MESSAGES, BANNER_MESSAGES } from "../utils/productBundle/bundleConstants";

// ========== Remix Loader Function - UNCHANGED ===========
export async function loader({ request, params }) {
  const { id } = params;
  const shop = await fetchShop(request);

  if (id === "new") {
    try {
      const existingBundles = await prisma.bundle.findMany({
        where: { shop: shop.id },
        select: { id: true, position: true, name: true },
      });

      const hasAllPositionBundle = existingBundles.some(bundle => 
        bundle.position === 'all'
      );

      return json({ 
        success: true, 
        isEdit: false, 
        data: null,
        hasAllPositionBundle,
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

    const existingBundles = await prisma.bundle.findMany({
      where: {
        shop: shop.id,
        id: { not: parseInt(id) },
      },
      select: { id: true, position: true, name: true },
    });

    const hasAllPositionBundle = existingBundles.some(bundle => 
      bundle.position === 'all'
    );

    return json({ 
      success: true, 
      isEdit: true, 
      data: bundle,
      hasAllPositionBundle,
      existingBundleNames: existingBundles
        .filter((bundle) => bundle.name)
        .map((bundle) => bundle.name.trim()),
    });
  } catch (error) {
    console.error("Error loading bundle:", error);
    throw new Response("Error loading bundle", { status: 500 });
  }
}

// ========== Main Component ===========
export default function EditProductBundle() {
  const { isEdit, data, hasAllPositionBundle = false, existingBundleNames = [] } = useLoaderData();
  const { id } = useParams();
  const fetcher = useFetcher();

  // Custom hooks for state management
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

  // Local state
  const [originalPosition] = useState(() => 
    (isEdit && data?.position) || 'specific'
  );
  const [showBanner, setShowBanner] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [bannerTone, setBannerTone] = useState("critical");

  // Handlers
  const handleSettingChange = useCallback((setting) => {
    setGeneralSettings(prev => ({ ...prev, [setting]: !prev[setting] }));
  }, [setGeneralSettings]);

  // Validation
  const validatePositionSettings = useCallback((currentPosition, hasAllPos, edit, origPos) => {
    if (currentPosition === "all") {
      if (!edit && hasAllPos) {
        return { isValid: false, message: VALIDATION_MESSAGES.ALL_POSITION_BUNDLE_EXISTS };
      }
      if (edit && origPos !== "all" && hasAllPos) {
        return { isValid: false, message: VALIDATION_MESSAGES.ALL_POSITION_BUNDLE_EXISTS };
      }
    }
    return { isValid: true };
  }, []);

  // Banner utilities
  const showBannerMessage = useCallback((message, tone = "critical", duration = 10000) => {
    setErrorMessage(message);
    setBannerTone(tone);
    setShowBanner(true);
    setTimeout(() => {
      setShowBanner(false);
      setErrorMessage("");
    }, duration);
  }, []);

  const showErrorBanner = useCallback((msg) => showBannerMessage(msg, "critical", 10000), [showBannerMessage]);
  const showSuccessBanner = useCallback((msg) => showBannerMessage(msg, "success", 5000), [showBannerMessage]);

  const hideBanner = useCallback(() => {
    setShowBanner(false);
    setErrorMessage("");
  }, []);

  // Save functionality
  const validateBundle = useCallback(() => {
    const hasSelectedProducts = products.some(p => p.name?.trim() !== "");
    if (!hasSelectedProducts) {
      return { isValid: false, message: VALIDATION_MESSAGES.NO_PRODUCTS_SELECTED };
    }

    if (!basicSettings?.bundleName?.trim()) {
      return { isValid: false, message: "Bundle name cannot be empty. Please provide a name for your bundle." };
    }

    const positionValidation = validatePositionSettings(
      basicSettings.position, hasAllPositionBundle, isEdit, originalPosition
    );
    if (!positionValidation.isValid) {
      return positionValidation;
    }

    if (existingBundleNames.includes(basicSettings.bundleName.trim())) {
      return { isValid: false, message: VALIDATION_MESSAGES.DUPLICATE_BUNDLE_NAME };
    }

    return { isValid: true };
  }, [products, basicSettings, validatePositionSettings, hasAllPositionBundle, isEdit, originalPosition, existingBundleNames]);

  const prepareBundleData = useCallback((status) => ({
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
    isEdit
  }), [basicSettings, pricingSettings, highlightSettings, designSettings, generalSettings, products, id, isEdit]);

  const handleSave = useCallback(async (status) => {
    hideBanner();

    const validation = validateBundle();
    if (!validation.isValid) {
      showErrorBanner(validation.message);
      return;
    }

    try {
      const bundleData = prepareBundleData(status);
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
  }, [hideBanner, validateBundle, prepareBundleData, fetcher, showErrorBanner]);

  // Effects
  useEffect(() => {
    if (fetcher.data) {
      if (fetcher.data.success) {
        showSuccessBanner(fetcher.data.message);
      } else {
        showErrorBanner(fetcher.data.error || fetcher.data.message || "An error occurred");
      }
    }
  }, [fetcher.data, showSuccessBanner, showErrorBanner]);

  // Computed values
  const pageTitle = isEdit ? `Edit ${basicSettings?.bundleName || 'Bundle'}` : "Create Product Bundle";
  const isSubmitting = fetcher.state === "submitting";

  return (
    <Page title={pageTitle} backAction={{ content: "Bundles", url: "/app" }}>
      {showBanner && (
        <>
          <Banner
            title={bannerTone === "success" ? BANNER_MESSAGES.SUCCESS : BANNER_MESSAGES.ERROR}
            onDismiss={hideBanner}
            tone={bannerTone}
          >
            <p>{errorMessage}</p>
          </Banner>
          <br />
        </>
      )}

      <Grid>
        <Grid.Cell columnSpan={{ xs: 6, sm: 3, md: 3, lg: 6, xl: 6 }}>
          <BundleSettingsCard
            basicSettings={basicSettings}
            setBasicSettings={setBasicSettings}
            pricingSettings={pricingSettings}
            setPricingSettings={setPricingSettings}
            highlightSettings={highlightSettings}
            setHighlightSettings={setHighlightSettings}
            designSettings={designSettings}
            setDesignSettings={setDesignSettings}
            generalSettings={generalSettings}
            setGeneralSettings={setGeneralSettings}
            products={products}
            setProducts={setProducts}
            handleAddProduct={handleAddProduct}
            handleRemoveProduct={handleRemoveProduct}
            handleSettingChange={handleSettingChange}
            hasAllPositionBundle={hasAllPositionBundle}
            isEdit={isEdit}
            originalPosition={originalPosition}
          />
        </Grid.Cell>

        <Grid.Cell columnSpan={{ xs: 6, sm: 3, md: 3, lg: 6, xl: 6 }}>
          <BundleLivePreview
            headerText={basicSettings?.headerText}
            alignment={basicSettings?.alignment}
            footerText={basicSettings?.footerText}
            buttonText={basicSettings?.buttonText}
            selectedColor={basicSettings?.selectedColor}
            settings={generalSettings}
            products={products}
            highlightOption={highlightSettings?.option}
            highlightTitle={highlightSettings?.title}
            highlightTimerTitle={highlightSettings?.timerTitle}
            timerEndDate={highlightSettings?.timerEndDate}
            timerFormat={highlightSettings?.timerFormat}
            highlightStyle={highlightSettings?.style}
            isBlinking={highlightSettings?.isBlinking}
            typography={designSettings?.typography}
            spacing={designSettings?.spacing}
            shapes={designSettings?.shapes}
            productImageSize={basicSettings?.productImageSize}
            iconStyle={basicSettings?.iconStyle}
            borderThickness={designSettings?.borderThickness}
            colors={designSettings?.colors}
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
    </Page>
  );
}
