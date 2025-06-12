import React, { useState, useCallback } from 'react'; // Import useState and useCallback
import { BlockStack, Card, LegacyCard, Tabs } from '@shopify/polaris'; // Import Tabs component
import BlockSettings from './Settings/BlockSettings';
import OfferSettings from './Settings/OfferSettings';
import DesignSettings from './Settings/DesignSettings';
import AdvancedSettings from './Settings/AdvancedSettings';
import { useEffect } from 'react';

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

  // State for All Component Settings ----------- ------------- ------------------------

  // State & Handler for All Design Settings

  const [allBlockSettings, setAllBlockSettings] = useState([]);
  const handleOnBlockSettingsChange = useCallback((settingsData) => {
    setAllBlockSettings(settingsData);
    console.log("Received All Block Settings:", settingsData); // Optional: log to verify
  }, []);

  const [offerSettings, setOfferSettings] = useState({});
  const handleOfferSettingsOnChange = useCallback((settingsData) => {
    setOfferSettings(settingsData);
    console.log("Received Offer Settings:", settingsData); // Optional: log to verify
  }, []);

  const [designSettings, setDesignSettings] = useState({});
  const handleDesignSettingsChange = useCallback((settingsData) => {
    setDesignSettings(settingsData);
    console.log("Received Design Settings:", settingsData); // Optional: log to verify
  }, []);

  // State & Handler for Advanced settings
  const [advancedSettings, setAdvancedSettings] = useState({});
  const handleAdvancedSettingsChange = useCallback((settingsData) => {
    setAdvancedSettings(settingsData);
    console.log("Received Advanced Settings:", settingsData); // Optional: log to verify
  }, []);

  // console.log("allBlockSettings", allBlockSettings)
  // console.log("offerSettings", offerSettings)
  // console.log("designSettings", designSettings)
  // console.log("advancedSettings", advancedSettings)

  const allVolumeSettings = {
    allBlockSettings,
    offerSettings,
    designSettings,
    advancedSettings
  }
  // console.log("allVolumeSettings", allVolumeSettings)

  // useEffect(() => {
  // if (onVolumeSettingsChange) {
  //   onVolumeSettingsChange(allVolumeSettings);
  // }
  // }, [allVolumeSettings, onVolumeSettingsChange]);

  return (
    <>
      {/* Add the Tabs component */}
      <BlockStack gap={200}>
        <LegacyCard>
          <div className="" style={{ padding: '10px 0' }}>
            <Tabs tabs={tabs} selected={selected} onSelect={handleTabChange}>
            </Tabs>
          </div >
        </LegacyCard>

        {selected === 0 && <div>
          <BlockSettings
            onBlockSettingsChange={handleOnBlockSettingsChange}
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
        {selected === 1 && <div><OfferSettings
          offerSettingsOnChange={handleOfferSettingsOnChange}
          offers={offers}
          setOffers={setOffers}
          selectedOfferIndex={selectedOfferIndex}
          setSelectedOfferIndex={setSelectedOfferIndex}
        /></div>}
        {selected === 2 && <div><DesignSettings onSettingsChange={handleDesignSettingsChange} /></div>}
        {selected === 3 && <div><AdvancedSettings onSettingsChange={handleAdvancedSettingsChange} /></div>}
      </BlockStack>
    </>
  );
}