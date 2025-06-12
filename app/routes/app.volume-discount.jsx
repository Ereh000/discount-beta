import { Card, Grid, Page } from "@shopify/polaris";
import React from "react";
import VolumeSettings from "../Components/VolumeDiscount/VolumeSettings";
import VolumePreview from "../Components/VolumeDiscount/VolumePreview";
import { useState } from "react";
import { useCallback } from "react";

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
    },
    // Add more offers here if needed
  ]);
  // State to manage the selected offer tab
  const [selectedOfferIndex, setSelectedOfferIndex] = useState(0);

  // End Offer Settings States

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
    }
  }

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
          />
        </Grid.Cell>

        <Grid.Cell columnSpan={{ xs: 6, md: 6, lg: 6, xl: 6 }}>
          <Card>
            <VolumePreview />
          </Card>
        </Grid.Cell>
      </Grid>
      <br />
      <br />
    </Page>
  );
}

export default MainVolumeDiscount;
