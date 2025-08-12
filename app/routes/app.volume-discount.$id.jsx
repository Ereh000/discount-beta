import { Banner, BlockStack, Button, ButtonGroup, Grid, InlineStack, Page } from "@shopify/polaris";
import VolumeSettings from "../Components/VolumeDiscount/VolumeSettings";
import VolumePreview from "../Components/VolumeDiscount/VolumePreview";
import { useState, useEffect } from "react";
import { json, useFetcher, useLoaderData, useParams } from '@remix-run/react';
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

  // If id exists, fetch the volume discount data for editing
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

    return json({ 
      success: true, 
      isEdit: true, 
      data: volumeDiscount 
    });
  } catch (error) {
    console.error("Error loading volume discount:", error);
    throw new Response("Error loading volume discount", { status: 500 });
  }
}

function MainVolumeDiscount() {
  const { success, isEdit, data } = useLoaderData();
  const params = useParams();
  const { id } = params;

  // State for banner messages
  const [showBanner, setShowBanner] = useState(false);
  const [bannerMessage, setBannerMessage] = useState('');
  const [bannerTone, setBannerTone] = useState('info');

  // Initialize states with default values or loaded data
  const initializeState = (defaultValue, loadedPath) => {
    if (isEdit && data?.settings && loadedPath) {
      const keys = loadedPath.split('.');
      let value = data.settings;
      for (const key of keys) {
        value = value?.[key];
      }
      return value !== undefined ? value : defaultValue;
    }
    return defaultValue;
  };

  // Block Tab States
  const [bundleName, setBundleName] = useState(
    initializeState('Bundle 1', 'bundleSettings.bundleName')
  );

  const [visibilitySettings, setVisibilitySettings] = useState(
    initializeState({ visibility: 'all_products' }, 'bundleSettings.visibilitySettings')
  );

  const [headerSettings, setHeaderSettings] = useState(
    initializeState({
      headerText: 'Choose your offer',
      alignment: 'center',
      headerLine: true,
      lineThickness: 2,
    }, 'bundleSettings.headerSettings')
  );

  const [shapeSettings, setShapeSettings] = useState(
    initializeState({
      blockRadius: 12,
      blockThickness: 2,
    }, 'bundleSettings.shapeSettings')
  );

  const [spacingSettings, setSpacingSettings] = useState(
    initializeState({
      spacingTop: 10,
      spacingBottom: 10,
    }, 'bundleSettings.spacingSettings')
  );

  const [checkmarkSettings, setCheckmarkSettings] = useState(
    initializeState({ checkmarkVisibility: 'show' }, 'bundleSettings.checkmarkSettings')
  );

  // Offer Tab States
  const [offers, setOffers] = useState(
    initializeState([
      {
        id: 'offer-1',
        title: 'Single',
        subtitle: 'Standard price',
        quantity: '1',
        image: null,
        priceType: 'default',
        priceValue: 'default',
        priceAmount: '',
        buyQuantity: '1',
        getQuantity: '1',
        highlight: false,
        selectedByDefault: true,
        tag: '',
        highlightSettings: {
          type: 'text',
          text: 'MOST POPULAR',
          blinking: false,
          style: 'pill',
          shape: 'rounded',
        }
      }
    ], 'offerSettings.offers')
  );

  const [selectedOfferIndex, setSelectedOfferIndex] = useState(
    initializeState(0, 'offerSettings.selectedOfferIndex')
  );

  // Design Tab States
  const [backgroundColors, setBackgroundColors] = useState(
    initializeState({
      bundle: { red: 230, green: 230, blue: 230, alpha: 0.5 },
      border: { red: 128, green: 128, blue: 128, alpha: 1 },
      checkmark: { red: 0, green: 0, blue: 0, alpha: 1 },
      highlight: { red: 0, green: 0, blue: 0, alpha: 1 },
      selectedBundle: { red: 255, green: 255, blue: 255, alpha: 1 },
      borderSelectedBundle: { red: 0, green: 0, blue: 0, alpha: 1 },
      tags: { red: 128, green: 128, blue: 128, alpha: 0.5 },
    }, 'designSettings.backgroundColors')
  );

  const [pricingColors, setPricingColors] = useState(
    initializeState({
      price: { red: 0, green: 0, blue: 0, alpha: 1 },
      comparedPrice: { red: 255, green: 0, blue: 0, alpha: 1 },
    }, 'designSettings.pricingColors')
  );

  const [textColors, setTextColors] = useState(
    initializeState({
      header: { red: 0, green: 0, blue: 0, alpha: 1 },
      title: { red: 0, green: 0, blue: 0, alpha: 1 },
      subtitle: { red: 128, green: 128, blue: 128, alpha: 1 },
      highlight: { red: 255, green: 255, blue: 255, alpha: 1 },
      tags: { red: 128, green: 128, blue: 128, alpha: 1 },
    }, 'designSettings.textColors')
  );

  const [typographySettings, setTypographySettings] = useState(
    initializeState({
      header: { size: '16', fontStyle: 'Bold' },
      titlePrice: { size: '16', fontStyle: 'Bold' },
      subtitleComparedPrice: { size: '14', fontStyle: 'Regular' },
      tagHighlight: { size: '12', fontStyle: 'Regular' },
    }, 'designSettings.typographySettings')
  );

  const [openColorPickerFor, setOpenColorPickerFor] = useState(null);

  // Advanced Tab States
  const [settings, setSettings] = useState(
    initializeState({
      variants: {
        allowCustomerChoice: true,
        hideThemeVariant: true,
        hideOutOfStock: false,
        hideThemePrice: true,
      },
      pricing: {
        showPricesPerItem: false,
        showCompareAtPrice: true,
      }
    }, 'advancedSettings')
  );

  // All Volume Settings
  const allVolumeSettings = {
    bundleSettings: {
      bundleName: bundleName,
      visibilitySettings: visibilitySettings,
      headerSettings: headerSettings,
      shapeSettings: shapeSettings,
      checkmarkSettings: checkmarkSettings,
    },
    offerSettings: {
      offers: offers,
      selectedOfferIndex: selectedOfferIndex,
    },
    designSettings: {
      backgroundColors: backgroundColors,
      pricingColors: pricingColors,
      textColors: textColors,
      typographySettings: typographySettings,
      openColorPickerFor: openColorPickerFor,
    },
    advancedSettings: settings,
  };

  // console.log('allVolumeSettings:', allVolumeSettings);

  // Save Settings to Database using separate API route
  const fetcher = useFetcher();

  const handleSave = (status) => {
    // Basic validation: Check if bundleName is not empty
    if (!bundleName || bundleName.trim() === '') {
      setShowBanner(true);
      setBannerMessage("Bundle name cannot be empty. Please provide a name for your bundle.");
      setBannerTone("critical");
      return;
    }

    // Validate offers
    const validOffers = offers.filter((offer) => {
      const isValidTitle = offer.title && offer.title.trim() !== '';
      const isValidQuantity = offer.quantity && !isNaN(parseInt(offer.quantity)) && parseInt(offer.quantity) > 0;
      return isValidTitle && isValidQuantity;
    });

    if (validOffers.length === 0) {
      setShowBanner(true);
      setBannerMessage("Please add at least one valid offer with a title and a positive quantity.");
      setBannerTone("critical");
      return;
    }

    // Check for unique offer quantities
    const quantities = validOffers.map((offer) => parseInt(offer.quantity));
    const uniqueQuantities = new Set(quantities);
    if (uniqueQuantities.size !== quantities.length) {
      setShowBanner(true);
      setBannerMessage("Each offer must have a unique quantity. Please ensure all quantities are distinct.");
      setBannerTone("critical");
      return;
    }

    // If all validations pass, proceed with submission to API route
    fetcher.submit(
      {
        volumeSettings: JSON.stringify(allVolumeSettings),
        status: status,
        volumeId: id, // Pass the ID to determine create vs update
        isEdit: isEdit.toString(), // Pass edit flag
      },
      { method: "post", action: "/api/volume-discount" }
    );
  };

  // Effect to handle fetcher responses and update banner
  useEffect(() => {
    if (fetcher.data) {
      setShowBanner(true);
      setBannerMessage(fetcher.data.message);
      setBannerTone(fetcher.data.success ? 'success' : 'critical');

      // Optionally, hide the banner after a few seconds for success messages
      if (fetcher.data.success) {
        const timer = setTimeout(() => {
          setShowBanner(false);
          setBannerMessage('');
        }, 5000);
        return () => clearTimeout(timer);
      }
    }
  }, [fetcher.data]);

  const pageTitle = isEdit ? `Edit ${bundleName}` : "Create Volume Discount";

  return (
    <Page 
      title={pageTitle}
      backAction={{ content: "Volume Discounts", url: "/app" }}
    >
      {showBanner && (
        <Banner
          title={bannerMessage}
          onDismiss={() => setShowBanner(false)}
          tone={bannerTone}
        />
      )}
      <br />

      <Grid>
        <Grid.Cell columnSpan={{ xs: 6, md: 6, lg: 6, xl: 6 }}>
          <VolumeSettings
            // Block Tab Props
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

            // Offer Tab Props
            offers={offers}
            setOffers={setOffers}
            selectedOfferIndex={selectedOfferIndex}
            setSelectedOfferIndex={setSelectedOfferIndex}

            // Design Tab Props
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

            // Advanced Tab Props
            advancedSettings={settings}
            setAdvancedSettings={setSettings}
          />
        </Grid.Cell>

        <Grid.Cell columnSpan={{ xs: 6, md: 6, lg: 6, xl: 6 }}>
          <BlockStack gap={200}>
            <VolumePreview allVolumeSettings={allVolumeSettings} />
            <InlineStack align="end">
              <ButtonGroup>
                <Button
                  onClick={() => handleSave("draft")}
                  loading={fetcher.state === "submitting"}
                >
                  Save as draft
                </Button>
                <Button
                  variant="primary"
                  onClick={() => handleSave("published")}
                  loading={fetcher.state === "submitting"}
                >
                  {isEdit ? "Update" : "Save"}
                </Button>
              </ButtonGroup>
            </InlineStack>
          </BlockStack>
        </Grid.Cell>
      </Grid>
      <br />
      <br />
    </Page>
  );
}

export default MainVolumeDiscount;
