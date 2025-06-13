import { BlockStack, Button, ButtonGroup, Grid, InlineStack, Page } from "@shopify/polaris";
import React from "react";
import VolumeSettings from "../Components/VolumeDiscount/VolumeSettings";
import VolumePreview from "../Components/VolumeDiscount/VolumePreview";
import { useState } from "react";

function MainVolumeDiscount() {

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
      pricingColors, pricingColors,
      textColors: textColors,
      typographySettings: typographySettings,
      openColorPickerFor: openColorPickerFor,
    },
    advancedSettings: settings,
  }

  // Save Settings to Database


  console.log('allVolumeSettings', allVolumeSettings)

  return (
    <Page title="Bundle 1">
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
                // onClick={() => handleSave("draft")}
                // loading={fetcher.state === "submitting"}
                >
                  Save as draft
                </Button>
                {/* <Button variant="primary" tone="critical">
                Delete
              </Button> */}
                <Button
                  variant="primary"
                // onClick={() => handleSave("published")}
                // loading={fetcher.state === "submitting"}
                >
                  Publish
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
