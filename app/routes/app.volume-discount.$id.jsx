// app/routes/app.volume-discount.$id.jsx
import {
  Banner,
  BlockStack,
  Button,
  ButtonGroup,
  Grid,
  InlineStack,
  Page,
} from "@shopify/polaris";
import VolumeSettings from "../Components/VolumeDiscount/VolumeSettings";
import VolumePreview from "../Components/VolumeDiscount/VolumePreview";
import { useState, useEffect, useCallback } from "react";
import { json, useFetcher, useLoaderData, useParams } from "@remix-run/react";

// Database and Utils
import prisma from "../db.server";
import { fetchShop } from "../utils/getShop";
import { DEFAULT_VALUES, VALIDATION_MESSAGES } from "../utils/constants";

// Custom Hooks
import { useInitializeState } from "../hooks/useInitializeState";
import { useBanner } from "../hooks/useBanner";
import { useValidation } from "../hooks/useValidation";

// Remix Loader Function
export async function loader({ request, params }) {
  const { id } = params;
  const shop = await fetchShop(request);

  if (id === "new") {
    try {
      const existingBundles = await prisma.volumeDiscount.findMany({
        where: { shop: shop.id },
        select: { bundleName: true, settings: true },
      });

      // Check if there's already an "all_products" bundle
      const hasAllProductsBundle = existingBundles.some((bundle) => {
        try {
          const settings =
            typeof bundle.settings === "string"
              ? JSON.parse(bundle.settings)
              : bundle.settings;
          return (
            settings?.bundleSettings?.visibilitySettings?.visibility ===
            "all_products"
          );
        } catch (error) {
          console.error("Error parsing bundle settings:", error);
          return false;
        }
      });

      return json({
        success: true,
        isEdit: false,
        data: null,
        existingBundleNames: existingBundles
          .filter((bundle) => bundle.bundleName)
          .map((bundle) => bundle.bundleName.trim()),
        hasAllProductsBundle,
      });
    } catch (error) {
      console.error("Error fetching existing bundles:", error);
      return json({
        success: true,
        isEdit: false,
        data: null,
        existingBundleNames: [],
        hasAllProductsBundle: false,
      });
    }
  }

  try {
    const volumeDiscount = await prisma.volumeDiscount.findFirst({
      where: {
        id: parseInt(id),
        shop: shop.id,
      },
    });

    if (!volumeDiscount) {
      throw new Response("Volume Discount not found", { status: 404 });
    }

    // Fetch existing bundle names and settings excluding current one
    const existingBundles = await prisma.volumeDiscount.findMany({
      where: {
        shop: shop.id,
        id: { not: parseInt(id) },
      },
      select: { bundleName: true, settings: true },
    });

    // Check if there's already an "all_products" bundle (excluding current)
    const hasAllProductsBundle = existingBundles.some((bundle) => {
      try {
        const settings =
          typeof bundle.settings === "string"
            ? JSON.parse(bundle.settings)
            : bundle.settings;
        return (
          settings?.bundleSettings?.visibilitySettings?.visibility ===
          "all_products"
        );
      } catch (error) {
        console.error("Error parsing bundle settings:", error);
        return false;
      }
    });

    return json({
      success: true,
      isEdit: true,
      data: volumeDiscount,
      existingBundleNames: existingBundles
        .filter((bundle) => bundle.bundleName)
        .map((bundle) => bundle.bundleName.trim()),
      hasAllProductsBundle,
    });
  } catch (error) {
    console.error("Error loading volume discount:", error);
    throw new Response("Error loading volume discount", { status: 500 });
  }
}

function MainVolumeDiscount() {
  const {
    isEdit,
    data,
    existingBundleNames = [],
    hasAllProductsBundle = false,
  } = useLoaderData();
  const { id } = useParams();
  const fetcher = useFetcher();

  // Custom Hooks
  const initializeState = useInitializeState(isEdit, data);
  const {
    showBanner,
    bannerMessage,
    bannerTone,
    showError,
    showSuccess,
    hideBanner,
  } = useBanner();
  const { validateBundleName, validateOffers, validateVisibilitySettings } =
    useValidation();

  // State declarations
  const [bundleName, setBundleName] = useState(() => {
    if (isEdit && data?.bundleName) {
      return data.bundleName;
    }
    return initializeState(
      DEFAULT_VALUES.bundleName,
      "bundleSettings.bundleName",
    );
  });

  const [visibilitySettings, setVisibilitySettings] = useState(
    initializeState(
      DEFAULT_VALUES.visibilitySettings,
      "bundleSettings.visibilitySettings",
    ),
  );

  // Store the original visibility setting for edit mode
  const [originalVisibility, setOriginalVisibility] = useState(() => {
    if (isEdit && data?.settings) {
      try {
        const settings =
          typeof data.settings === "string"
            ? JSON.parse(data.settings)
            : data.settings;
        return (
          settings?.bundleSettings?.visibilitySettings?.visibility ||
          "all_products"
        );
      } catch (error) {
        return "all_products";
      }
    }
    return "all_products";
  });

  const [headerSettings, setHeaderSettings] = useState(
    initializeState(
      DEFAULT_VALUES.headerSettings,
      "bundleSettings.headerSettings",
    ),
  );

  const [shapeSettings, setShapeSettings] = useState(
    initializeState(
      DEFAULT_VALUES.shapeSettings,
      "bundleSettings.shapeSettings",
    ),
  );

  const [spacingSettings, setSpacingSettings] = useState(
    initializeState(
      DEFAULT_VALUES.spacingSettings,
      "bundleSettings.spacingSettings",
    ),
  );

  const [checkmarkSettings, setCheckmarkSettings] = useState(
    initializeState(
      DEFAULT_VALUES.checkmarkSettings,
      "bundleSettings.checkmarkSettings",
    ),
  );

  const [offers, setOffers] = useState(
    initializeState(DEFAULT_VALUES.offers, "offerSettings.offers"),
  );

  const [selectedOfferIndex, setSelectedOfferIndex] = useState(
    initializeState(
      DEFAULT_VALUES.selectedOfferIndex,
      "offerSettings.selectedOfferIndex",
    ),
  );

  const [backgroundColors, setBackgroundColors] = useState(
    initializeState(
      DEFAULT_VALUES.backgroundColors,
      "designSettings.backgroundColors",
    ),
  );

  const [pricingColors, setPricingColors] = useState(
    initializeState(
      DEFAULT_VALUES.pricingColors,
      "designSettings.pricingColors",
    ),
  );

  const [textColors, setTextColors] = useState(
    initializeState(DEFAULT_VALUES.textColors, "designSettings.textColors"),
  );

  const [typographySettings, setTypographySettings] = useState(
    initializeState(
      DEFAULT_VALUES.typographySettings,
      "designSettings.typographySettings",
    ),
  );

  const [openColorPickerFor, setOpenColorPickerFor] = useState(null);

  const [settings, setSettings] = useState(
    initializeState(DEFAULT_VALUES.advancedSettings, "advancedSettings"),
  );

  // Computed values
  const allVolumeSettings = {
    bundleSettings: {
      bundleName,
      visibilitySettings,
      headerSettings,
      shapeSettings,
      spacingSettings,
      checkmarkSettings,
    },
    offerSettings: {
      offers,
      selectedOfferIndex,
    },
    designSettings: {
      backgroundColors,
      pricingColors,
      textColors,
      typographySettings,
      openColorPickerFor,
    },
    advancedSettings: settings,
  };

  // console.log("volume settings", allVolumeSettings);

  const pageTitle = isEdit ? `Edit ${bundleName}` : "Create Volume Discount";

  // Event handlers
  const handleSave = useCallback(
    (status) => {
      if (!validateBundleName(bundleName)) {
        showError(VALIDATION_MESSAGES.EMPTY_BUNDLE_NAME);
        return;
      }

      // Validate visibility settings
      const visibilityValidation = validateVisibilitySettings(
        visibilitySettings.visibility,
        hasAllProductsBundle,
        isEdit,
        originalVisibility,
      );
      if (!visibilityValidation.isValid) {
        showError(visibilityValidation.message);
        return;
      }

      // Validate offers
      const offerValidation = validateOffers(
        offers,
        bundleName,
        existingBundleNames,
      );
      if (!offerValidation.isValid) {
        showError(offerValidation.message);
        return;
      }

      fetcher.submit(
        {
          volumeSettings: JSON.stringify(allVolumeSettings),
          bundleName: bundleName,
          status,
          volumeId: id,
          isEdit: isEdit.toString(),
        },
        { method: "post", action: "/api/volume-discount" },
      );
    },
    [
      bundleName,
      offers,
      existingBundleNames,
      allVolumeSettings,
      id,
      isEdit,
      validateBundleName,
      validateOffers,
      validateVisibilitySettings,
      visibilitySettings.visibility,
      hasAllProductsBundle,
      originalVisibility,
      showError,
      fetcher,
    ],
  );

  // Effects
  useEffect(() => {
    if (fetcher.data) {
      if (fetcher.data.success) {
        showSuccess(fetcher.data.message);
        setTimeout(hideBanner, 5000);
      } else {
        showError(fetcher.data.message);
      }
    }
  }, [fetcher.data, showSuccess, showError, hideBanner]);

  const isLoading = fetcher.state === "submitting";

  return (
    <Page
      title={pageTitle}
      backAction={{ content: "Volume Discounts", url: "/app" }}
    >
      {showBanner && (
        <>
          <Banner
            title={bannerMessage}
            onDismiss={hideBanner}
            tone={bannerTone}
          />
          <br />
        </>
      )}

      <Grid>
        <Grid.Cell columnSpan={{ xs: 6, md: 6, lg: 6, xl: 6 }}>
          <VolumeSettings
            bundleName={bundleName}
            setBundleName={setBundleName}
            visibilitySettings={visibilitySettings}
            setVisibilitySettings={setVisibilitySettings}
            headerSettings={headerSettings}
            setHeaderSettings={setHeaderSettings}
            shapeSettings={shapeSettings}
            setShapeSettings={setShapeSettings}
            spacingSettings={spacingSettings}
            setSpacingSettings={setSpacingSettings}
            checkmarkSettings={checkmarkSettings}
            setCheckmarkSettings={setCheckmarkSettings}
            offers={offers}
            setOffers={setOffers}
            selectedOfferIndex={selectedOfferIndex}
            setSelectedOfferIndex={setSelectedOfferIndex}
            backgroundColors={backgroundColors}
            setBackgroundColors={setBackgroundColors}
            pricingColors={pricingColors}
            setPricingColors={setPricingColors}
            textColors={textColors}
            setTextColors={setTextColors}
            typographySettings={typographySettings}
            setTypographySettings={setTypographySettings}
            openColorPickerFor={openColorPickerFor}
            setOpenColorPickerFor={setOpenColorPickerFor}
            advancedSettings={settings}
            setAdvancedSettings={setSettings}
            hasAllProductsBundle={hasAllProductsBundle}
            isEdit={isEdit}
            originalVisibility={originalVisibility}
          />
        </Grid.Cell>

        <Grid.Cell columnSpan={{ xs: 6, md: 6, lg: 6, xl: 6 }}>
          <BlockStack gap={200}>
            <VolumePreview allVolumeSettings={allVolumeSettings} />

            <InlineStack align="end">
              <ButtonGroup>
                <Button onClick={() => handleSave("draft")} loading={isLoading}>
                  Save as draft
                </Button>
                <Button
                  variant="primary"
                  onClick={() => handleSave("published")}
                  loading={isLoading}
                >
                  {isEdit ? "Update" : "Save"}
                </Button>
              </ButtonGroup>
            </InlineStack>
          </BlockStack>
        </Grid.Cell>
      </Grid>
      <div className="bottom__spacing">
        <br />
        <br />
      </div>
    </Page>
  );
}

export default MainVolumeDiscount;
