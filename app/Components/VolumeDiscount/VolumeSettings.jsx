import React, { useState, useCallback } from 'react'; // Import useState and useCallback
import { BlockStack, Card, LegacyCard, Tabs } from '@shopify/polaris'; // Import Tabs component
import BlockSettings from './Settings/BlockSettings';
import OfferSettings from './Settings/OfferSettings';
import DesignSettings from './Settings/DesignSettings';
import AdvancedSettings from './Settings/AdvancedSettings';

export default function VolumeSettings({
  onVolumeSettingsChange,
  // Block Tab Props
  bundleName,
  setBundleName,
  visibilitySettings,
  setVisibilitySettings,
  headerSettings,
  setHeaderSettings,
  shapeSettings,
  setShapeSettings,
  spacingSettings,
  setSpacingSettings,
  checkmarkSettings,
  setCheckmarkSettings,
  // End of Block Tab Props

  // Offer Tab Props
  offers,
  setOffers,
  selectedOfferIndex,
  setSelectedOfferIndex,
  // End of Offer Tab Props

  // Design Tab Props
  backgroundColors,
  setBackgroundColors,
  pricingColors,
  setPricingColors,
  textColors,
  setTextColors,
  typographySettings,
  setTypographySettings,
  openColorPickerFor,
  setOpenColorPickerFor,
  // End of Design Tab Props

  // Advanced Tab Props
  advancedSettings,
  setAdvancedSettings,
  // End of Advanced Tab Props
}) {
  // Define the tabs
  const tabs = [
    {
      id: 'block-settings',
      content: 'Block',
      panelID: 'block-settings-content',
    },
    {
      id: 'offers-settings',
      content: 'Offers',
      panelID: 'offers-settings-content',
    },
    {
      id: 'design-settings',
      content: 'Design',
      panelID: 'design-settings-content',
    },
    {
      id: 'advanced-settings',
      content: 'Advanced settings',
      panelID: 'advanced-settings-content',
    },
  ];

  // State to manage the selected tab
  const [selected, setSelected] = useState(0);

  // Handler for tab change
  const handleTabChange = useCallback(
    (selectedTabIndex) => setSelected(selectedTabIndex),
    [],
  );

  return (
    <>
      {/* Add the Tabs component */}
      < BlockStack gap={200} >
        <LegacyCard>
          <div className="" style={{ padding: '10px 0' }}>
            <Tabs tabs={tabs} selected={selected} onSelect={handleTabChange}>
            </Tabs>
          </div >
        </LegacyCard>

        {selected === 0 && <div>
          <BlockSettings
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
            checkmarkSettings={setCheckmarkSettings}
            setCheckmarkSettings={setCheckmarkSettings}
          />
        </div>}
        {
          selected === 1 && <div><OfferSettings
            offers={offers}
            setOffers={setOffers}
            selectedOfferIndex={selectedOfferIndex}
            setSelectedOfferIndex={setSelectedOfferIndex}
          /></div>
        }
        {selected === 2 && <div>
          <DesignSettings
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
          /></div>}
        {selected === 3 && <div>
          <AdvancedSettings
            settings={advancedSettings}
            setSettings={setAdvancedSettings}
          />
        </div>}
      </BlockStack >
    </>
  );
}