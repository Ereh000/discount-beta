import { Banner, BlockStack, Button, ButtonGroup, Grid, InlineStack, Page } from "@shopify/polaris";
import React from "react";
import VolumeSettings from "../Components/VolumeDiscount/VolumeSettings";
import VolumePreview from "../Components/VolumeDiscount/VolumePreview";
import { useState } from "react";
import { json, useFetcher } from '@remix-run/react'; // Import useFetcher and json
// import { authenticate } from '../shopify.server'; // Import authenticate
// import prisma from "../db.server"; // Import prisma
import { useEffect } from "react";

function MainVolumeDiscount() {

  // State for banner messages
  const [showBanner, setShowBanner] = useState(false);
  const [bannerMessage, setBannerMessage] = useState('');
  const [bannerTone, setBannerTone] = useState('info'); // 'success', 'critical', 'warning', 'info'

  // Block Tab States ------------------ -------------- ----------------

  // Bundle Name
  const [bundleName, setBundleName] = useState('Bundle 1')

  // Refactored State Objects
  const [visibilitySettings, setVisibilitySettings] = useState({
    visibility: 'all_products',
  });

  const [headerSettings, setHeaderSettings] = useState({
    headerText: 'Choose your offer',
    alignment: 'center',
    headerLine: true,
    lineThickness: 2,
  });

  const [shapeSettings, setShapeSettings] = useState({
    blockRadius: 12,
    blockThickness: 2,
  });

  const [spacingSettings, setSpacingSettings] = useState({
    spacingTop: 10,
    spacingBottom: 10,
  });

  const [checkmarkSettings, setCheckmarkSettings] = useState({
    checkmarkVisibility: 'show',
  });

  // End of Block Tab States -------

  // --------

  // Offer Tab States ------------------ -------------- ----------------

  // State to manage the offers
  const [offers, setOffers] = useState([
    {
      id: 'offer-1',
      title: 'Single',
      subtitle: 'Standard price',
      quantity: '1',
      image: null, // Placeholder for image
      priceType: 'default', // 'default' or 'buy_get'
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
    },
    // Add more offers here if needed
    {
      id: 'offer-2',
      title: 'Double',
      subtitle: 'You save 10% off',
      quantity: '2',
      image: null, // Placeholder for image
      priceType: 'default', // 'default' or 'buy_get'
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
    },
    {
      id: 'offer-3',
      title: 'Triple',
      subtitle: 'You save 20% off',
      quantity: '3',
      image: null, // Placeholder for image
      priceType: 'default', // 'default' or 'buy_get'
      buyQuantity: '1',
      getQuantity: '1',
      highlight: true,
      selectedByDefault: true,
      tag: '',
      highlightSettings: {
        type: 'text',
        text: 'MOST POPULAR',
        blinking: false,
        style: 'pill',
        shape: 'rounded',
      }
    },
  ]);
  // State to manage the selected offer tab
  const [selectedOfferIndex, setSelectedOfferIndex] = useState(0);

  // End Offer Settings States ------------------------------------------------------------------------

  // -------- 

  // Design Tab States -------------------------------------------------------------------------

  // State for Background Colors - Initialized with RGBA values
  const [backgroundColors, setBackgroundColors] = useState({
    bundle: { red: 230, green: 230, blue: 230, alpha: 0.5 }, // Example initial transparent grey (converted from HSB)
    border: { red: 128, green: 128, blue: 128, alpha: 1 }, // Example initial grey (converted from HSB)
    checkmark: { red: 0, green: 0, blue: 0, alpha: 1 }, // Example initial black (converted from HSB)
    highlight: { red: 0, green: 0, blue: 0, alpha: 1 }, // Example initial black (converted from HSB)
    selectedBundle: { red: 255, green: 255, blue: 255, alpha: 1 }, // Example initial white (converted from HSB)
    borderSelectedBundle: { red: 0, green: 0, blue: 0, alpha: 1 }, // Example initial black (converted from HSB)
    tags: { red: 128, green: 128, blue: 128, alpha: 0.5 }, // Example initial transparent grey (converted from HSB)
  });
  // State for Pricing Colors - Initialized with RGBA values
  const [pricingColors, setPricingColors] = useState({
    price: { red: 0, green: 0, blue: 0, alpha: 1 }, // Example initial black (converted from HSB)
    comparedPrice: { red: 255, green: 0, blue: 0, alpha: 1 }, // Example initial red (converted from HSB)
  });
  // State for Text Colors - Initialized with RGBA values
  const [textColors, setTextColors] = useState({
    header: { red: 0, green: 0, blue: 0, alpha: 1 }, // Example initial black (converted from HSB)
    title: { red: 0, green: 0, blue: 0, alpha: 1 }, // Example initial black (converted from HSB)
    subtitle: { red: 128, green: 128, blue: 128, alpha: 1 }, // Example initial grey (converted from HSB)
    highlight: { red: 255, green: 255, blue: 255, alpha: 1 }, // Example initial white (converted from HSB)
    tags: { red: 128, green: 128, blue: 128, alpha: 1 }, // Example initial grey (converted from HSB)
  });
  // State for Typography Settings
  const [typographySettings, setTypographySettings] = useState({
    header: { size: '16', fontStyle: 'Bold' },
    titlePrice: { size: '16', fontStyle: 'Bold' },
    subtitleComparedPrice: { size: '14', fontStyle: 'Regular' },
    tagHighlight: { size: '12', fontStyle: 'Regular' },
  });
  // State to track which color picker is open
  const [openColorPickerFor, setOpenColorPickerFor] = useState(null);

  // End of Design Tab States --------------------------------------

  // -------- 

  // Advanced Tab States --------------------------------------

  const [settings, setSettings] = useState({
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
  });

  // End of Advanced Tab States ----------------------------------------

  // -------- 

  // All Volume Settings ------------------------------------------------------

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
  }

  // Save Settings to Database
  const fetcher = useFetcher(); // Initialize useFetcher

  const handleSave = (status) => {
    // 1. Basic validation: Check if bundleName is not empty
    if (!bundleName || bundleName.trim() === '') {
      setShowBanner(true);
      setBannerMessage("Bundle name cannot be empty. Please provide a name for your bundle.");
      setBannerTone("critical");
      return; // Stop the save process
    }

    // 2. Validate offers
    const validOffers = offers.filter((offer) => {
      const isValidTitle = offer.title && offer.title.trim() !== '';
      const isValidQuantity = offer.quantity && !isNaN(parseInt(offer.quantity)) && parseInt(offer.quantity) > 0;
      return isValidTitle && isValidQuantity;
    });

    // Helper function to validate RGBA color objects
    const isValidColor = (color) => {
      return (
        color &&
        typeof color.red === 'number' &&
        typeof color.green === 'number' &&
        typeof color.blue === 'number' &&
        typeof color.alpha === 'number' &&
        color.red >= 0 && color.red <= 255 &&
        color.green >= 0 && color.green <= 255 &&
        color.blue >= 0 && color.blue <= 255 &&
        color.alpha >= 0 && color.alpha <= 1
      );
    };

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

    // 3. Validate Visibility Settings
    if (!visibilitySettings || !['all_products', 'specific_products', 'specific_collections'].includes(visibilitySettings.visibility)) {
      setShowBanner(true);
      setBannerMessage("Visibility settings are invalid. Please select a valid visibility option.");
      setBannerTone("critical");
      return;
    }

    // 4. Validate Header Settings
    if (!headerSettings || !headerSettings.headerText || headerSettings.headerText.trim() === '' ||
      !['left', 'center', 'right'].includes(headerSettings.alignment) ||
      typeof headerSettings.headerLine !== 'boolean' ||
      typeof headerSettings.lineThickness !== 'number' || headerSettings.lineThickness < 0) {
      setShowBanner(true);
      setBannerMessage("Header settings are incomplete or invalid. Please check header text, alignment, line settings.");
      setBannerTone("critical");
      return;
    }

    // 5. Validate Shape Settings
    if (!shapeSettings || typeof shapeSettings.blockRadius !== 'number' || shapeSettings.blockRadius < 0 ||
      typeof shapeSettings.blockThickness !== 'number' || shapeSettings.blockThickness < 0) {
      setShowBanner(true);
      setBannerMessage("Shape settings are invalid. Please check block radius and thickness.");
      setBannerTone("critical");
      return;
    }

    // 6. Validate Spacing Settings
    if (!spacingSettings || typeof spacingSettings.spacingTop !== 'number' || spacingSettings.spacingTop < 0 ||
      typeof spacingSettings.spacingBottom !== 'number' || spacingSettings.spacingBottom < 0) {
      setShowBanner(true);
      setBannerMessage("Spacing settings are invalid. Please check top and bottom spacing.");
      setBannerTone("critical");
      return;
    }

    // 7. Validate Checkmark Settings
    if (!checkmarkSettings || !['show', 'hide'].includes(checkmarkSettings.checkmarkVisibility)) {
      setShowBanner(true);
      setBannerMessage("Checkmark settings are invalid. Please select a valid checkmark visibility option.");
      setBannerTone("critical");
      return;
    }

    // 8. Validate Background Colors
    if (!backgroundColors) {
      setShowBanner(true);
      setBannerMessage("Background color settings are incomplete or invalid. Please check all background colors.");
      setBannerTone("critical");
      return;
    }

    // 9. Validate Pricing Colors
    if (!pricingColors ||
      !isValidColor(pricingColors.price) ||
      !isValidColor(pricingColors.comparedPrice)) {
      setShowBanner(true);
      setBannerMessage("Pricing color settings are incomplete or invalid. Please check price and compared price colors.");
      setBannerTone("critical");
      return;
    }

    // 10. Validate Text Colors
    if (!textColors ||
      !isValidColor(textColors.header) ||
      !isValidColor(textColors.title) ||
      !isValidColor(textColors.subtitle) ||
      !isValidColor(textColors.highlight) ||
      !isValidColor(textColors.tags)) {
      setShowBanner(true);
      setBannerMessage("Text color settings are incomplete or invalid. Please check all text colors.");
      setBannerTone("critical");
      return;
    }

    // 11. Validate Typography Settings
    const isValidTypography = (typo) => typo && typeof typo.size === 'string' && typo.size.length > 0 && typeof typo.fontStyle === 'string' && typo.fontStyle.length > 0;
    if (!typographySettings ||
      !isValidTypography(typographySettings.header) ||
      !isValidTypography(typographySettings.titlePrice) ||
      !isValidTypography(typographySettings.subtitleComparedPrice) ||
      !isValidTypography(typographySettings.tagHighlight)) {
      setShowBanner(true);
      setBannerMessage("Typography settings are incomplete or invalid. Please check all font sizes and styles.");
      setBannerTone("critical");
      return;
    }

    // 12. Validate Advanced Settings
    if (!settings ||
      typeof settings.variants.allowCustomerChoice !== 'boolean' ||
      typeof settings.variants.hideThemeVariant !== 'boolean' ||
      typeof settings.variants.hideOutOfStock !== 'boolean' ||
      typeof settings.variants.hideThemePrice !== 'boolean' ||
      typeof settings.pricing.showPricesPerItem !== 'boolean' ||
      typeof settings.pricing.showCompareAtPrice !== 'boolean') {
      setShowBanner(true);
      setBannerMessage("Advanced settings are incomplete or invalid. Please check all advanced options.");
      setBannerTone("critical");
      return;
    }

    // If all validations pass, proceed with submission
    fetcher.submit(
      {
        volumeSettings: JSON.stringify(allVolumeSettings),
        status: status,
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
        }, 5000); // Hide after 5 seconds
        return () => clearTimeout(timer);
      }
    }
  }, [fetcher.data]);

  console.log('allVolumeSettings', allVolumeSettings)

  return (
    <Page title="Bundle 1">
      {showBanner && (
        <Banner
          title={bannerMessage}
          onDismiss={() => setShowBanner(false)}
          tone={bannerTone}
        >
          {/* You can add more detailed messages here if needed */}
        </Banner>
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
            // End of Block Tab Props

            // Offer Tab Props
            offers={offers}
            setOffers={setOffers}
            selectedOfferIndex={selectedOfferIndex}
            setSelectedOfferIndex={setSelectedOfferIndex}
            // End of Offer Tab Props

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
            // End of Design Tab Props

            // Advanced Tab Props
            advancedSettings={settings}
            setAdvancedSettings={setSettings}
          // End of Advanced Tab Props
          />
        </Grid.Cell>

        <Grid.Cell columnSpan={{ xs: 6, md: 6, lg: 6, xl: 6 }}>
          <BlockStack gap={200}>
            <VolumePreview allVolumeSettings={allVolumeSettings} />
            <InlineStack align="end">
              <ButtonGroup>
                <Button
                  onClick={() => handleSave("draft")} // Connect to handleSave
                  loading={fetcher.state === "submitting"}
                >
                  Save as draft
                </Button>
                {/* <Button variant="primary" tone="critical">
                Delete
              </Button> */}
                <Button
                  variant="primary"
                  onClick={() => handleSave("published")} // Connect to handleSave
                  loading={fetcher.state === "submitting"}
                >
                  Save
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