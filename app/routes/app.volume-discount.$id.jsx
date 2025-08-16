// app.volume-discount.$id
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
import prisma from "../db.server";
import { fetchShop } from "../utils/getShop";

// Default values constants
const DEFAULT_VALUES = {
  bundleName: "Bundle 1",
  visibilitySettings: { visibility: "all_products" },
  headerSettings: {
    headerText: "Choose your offer",
    alignment: "center",
    headerLine: true,
    lineThickness: 2,
  },
  shapeSettings: {
    blockRadius: 12,
    blockThickness: 2,
  },
  spacingSettings: {
    spacingTop: 10,
    spacingBottom: 10,
  },
  checkmarkSettings: { checkmarkVisibility: "showRadio" },
  offers: [
    {
      id: "offer-1",
      title: "Single",
      subtitle: "Standard price",
      quantity: "1",
      image: null,
      priceType: "default",
      priceValue: "discount_percentage",
      priceAmount: "10",
      highlight: false,
      selectedByDefault: true,
      tag: "",
      highlightSettings: {
        type: "text",
        text: "MOST POPULAR",
        blinking: false,
        style: "pill",
        shape: "rounded",
      },
    },
  ],
  selectedOfferIndex: 0,
  backgroundColors: {
    bundle: { red: 230, green: 230, blue: 230, alpha: 0.5 },
    border: { red: 128, green: 128, blue: 128, alpha: 1 },
    checkmark: { red: 0, green: 0, blue: 0, alpha: 1 },
    highlight: { red: 0, green: 0, blue: 0, alpha: 1 },
    selectedBundle: { red: 255, green: 255, blue: 255, alpha: 1 },
    borderSelectedBundle: { red: 0, green: 0, blue: 0, alpha: 1 },
    tags: { red: 128, green: 128, blue: 128, alpha: 0.5 },
  },
  pricingColors: {
    price: { red: 0, green: 0, blue: 0, alpha: 1 },
    comparedPrice: { red: 255, green: 0, blue: 0, alpha: 1 },
  },
  textColors: {
    header: { red: 0, green: 0, blue: 0, alpha: 1 },
    title: { red: 0, green: 0, blue: 0, alpha: 1 },
    subtitle: { red: 128, green: 128, blue: 128, alpha: 1 },
    highlight: { red: 255, green: 255, blue: 255, alpha: 1 },
    tags: { red: 128, green: 128, blue: 128, alpha: 1 },
  },
  typographySettings: {
    header: { size: "16", fontStyle: "Bold" },
    titlePrice: { size: "16", fontStyle: "Bold" },
    subtitleComparedPrice: { size: "14", fontStyle: "Regular" },
    tagHighlight: { size: "12", fontStyle: "Regular" },
  },
  advancedSettings: {
    pricing: {
      showPricesPerItem: false,
      showCompareAtPrice: true,
    },
  },
};

// Validation messages
const VALIDATION_MESSAGES = {
  EMPTY_BUNDLE_NAME:
    "Bundle name cannot be empty. Please provide a name for your bundle.",
  NO_VALID_OFFERS:
    "Please add at least one valid offer with a title and a positive quantity.",
  DUPLICATE_QUANTITIES:
    "Each offer must have a unique quantity. Please ensure all quantities are distinct.",
  NO_DUPLICATE_BUNDLE_NAME:
    "Bundle name already exists. No duplicate bundleName allowed.",
  EMPTY_PRICE_AMOUNT:
    "Offer priceAmount cannot be empty. Please provide a valid price amount.",
};

// Custom hook for state initialization
function useInitializeState(isEdit, data) {
  const initializeState = useCallback(
    (defaultValue, loadedPath) => {
      if (isEdit && data?.settings && loadedPath) {
        const keys = loadedPath.split(".");
        let value = data.settings;
        for (const key of keys) {
          value = value?.[key];
        }
        return value !== undefined ? value : defaultValue;
      }
      return defaultValue;
    },
    [isEdit, data],
  );

  return initializeState;
}

// Custom hook for banner management
function useBanner() {
  const [showBanner, setShowBanner] = useState(false);
  const [bannerMessage, setBannerMessage] = useState("");
  const [bannerTone, setBannerTone] = useState("info");

  const showError = useCallback((message) => {
    setShowBanner(true);
    setBannerMessage(message);
    setBannerTone("critical");
  }, []);

  const showSuccess = useCallback((message) => {
    setShowBanner(true);
    setBannerMessage(message);
    setBannerTone("success");
  }, []);

  const hideBanner = useCallback(() => {
    setShowBanner(false);
    setBannerMessage("");
  }, []);

  return {
    showBanner,
    bannerMessage,
    bannerTone,
    showError,
    showSuccess,
    hideBanner,
  };
}

// Custom hook for validation
function useValidation() {
  const validateBundleName = useCallback((bundleName) => {
    return bundleName && bundleName.trim() !== "";
  }, []);

  const validateOffers = useCallback(
    (offers, currentBundleName, existingBundleNames) => {
      // Check for empty priceAmount in any offer
      for (const offer of offers) {
        if (
          offer.priceAmount === "" ||
          offer.priceAmount === "0" ||
          !offer.priceAmount
        ) {
          return {
            isValid: false,
            message: VALIDATION_MESSAGES.EMPTY_PRICE_AMOUNT,
          };
        }
      }

      // Check for duplicate bundleName (exclude current bundle if editing)
      if (
        existingBundleNames &&
        existingBundleNames.includes(currentBundleName.trim())
      ) {
        return {
          isValid: false,
          message: VALIDATION_MESSAGES.NO_DUPLICATE_BUNDLE_NAME,
        };
      }

      const validOffers = offers.filter((offer) => {
        const isValidTitle = offer.title && offer.title.trim() !== "";
        const isValidQuantity =
          offer.quantity &&
          !isNaN(parseInt(offer.quantity)) &&
          parseInt(offer.quantity) > 0;
        return isValidTitle && isValidQuantity;
      });

      if (validOffers.length === 0) {
        return { isValid: false, message: VALIDATION_MESSAGES.NO_VALID_OFFERS };
      }

      // Check for unique quantities
      const quantities = validOffers.map((offer) => parseInt(offer.quantity));
      const uniqueQuantities = new Set(quantities);
      if (uniqueQuantities.size !== quantities.length) {
        return {
          isValid: false,
          message: VALIDATION_MESSAGES.DUPLICATE_QUANTITIES,
        };
      }

      return { isValid: true };
    },
    [],
  );

  return { validateBundleName, validateOffers };
}

// Remix Loader Function
export async function loader({ request, params }) {
  const { id } = params;
  const shop = await fetchShop(request);

  if (id === "new") {
    // Fetch existing bundle names for duplicate validation
    try {
      const existingBundles = await prisma.volumeDiscount.findMany({
        where: { shop: shop.id },
        select: { bundleName: true },
      });

      return json({
        success: true,
        isEdit: false,
        data: null,
        existingBundleNames: existingBundles
          .filter((bundle) => bundle.bundleName) // Filter out null bundleNames
          .map((bundle) => bundle.bundleName.trim()),
      });
    } catch (error) {
      console.error("Error fetching existing bundles:", error);
      return json({
        success: true,
        isEdit: false,
        data: null,
        existingBundleNames: [],
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

    // Fetch existing bundle names excluding current one
    const existingBundles = await prisma.volumeDiscount.findMany({
      where: {
        shop: shop.id,
        id: { not: parseInt(id) }, // Exclude current bundle
      },
      select: { bundleName: true },
    });

    return json({
      success: true,
      isEdit: true,
      data: volumeDiscount,
      existingBundleNames: existingBundles
        .filter((bundle) => bundle.bundleName) // Filter out null bundleNames
        .map((bundle) => bundle.bundleName.trim()),
    });
  } catch (error) {
    console.error("Error loading volume discount:", error);
    throw new Response("Error loading volume discount", { status: 500 });
  }
}

function MainVolumeDiscount() {
  const { success, isEdit, data, existingBundleNames = [] } = useLoaderData();
  const { id } = useParams();
  const fetcher = useFetcher();

  const initializeState = useInitializeState(isEdit, data);
  const {
    showBanner,
    bannerMessage,
    bannerTone,
    showError,
    showSuccess,
    hideBanner,
  } = useBanner();
  const { validateBundleName, validateOffers } = useValidation();

  // State declarations - Initialize bundleName from data.bundleName if editing
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

  // console.log("allVolumeSettings", allVolumeSettings);

  const pageTitle = isEdit ? `Edit ${bundleName}` : "Create Volume Discount";

  // Event handlers
  const handleSave = useCallback(
    (status) => {
      if (!validateBundleName(bundleName)) {
        showError(VALIDATION_MESSAGES.EMPTY_BUNDLE_NAME);
        return;
      }

      // Pass existing bundle names for validation
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
          bundleName: bundleName, // Send bundleName separately for easier database storage
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
        <Banner
          title={bannerMessage}
          onDismiss={hideBanner}
          tone={bannerTone}
        />
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
