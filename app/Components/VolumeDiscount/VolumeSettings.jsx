import { useState, useCallback } from "react";
import { BlockStack, LegacyCard, Tabs } from "@shopify/polaris";
import BlockSettings from "./Settings/BlockSettings";
import OfferSettings from "./Settings/OfferSettings";
import DesignSettings from "./Settings/DesignSettings";
import AdvancedSettings from "./Settings/AdvancedSettings";

export default function VolumeSettings({
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
  
  // Offer Tab Props
  offers,
  setOffers,
  selectedOfferIndex,
  setSelectedOfferIndex,
  
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
  
  // Advanced Tab Props
  advancedSettings,
  setAdvancedSettings,
}) {
  const [selected, setSelected] = useState(0);

  const handleTabChange = useCallback(
    (selectedTabIndex) => setSelected(selectedTabIndex),
    []
  );

  const tabs = [
    {
      id: "block-settings",
      content: "Block",
      panelID: "block-settings-content",
    },
    {
      id: "offers-settings",
      content: "Offers",
      panelID: "offers-settings-content",
    },
    {
      id: "design-settings",
      content: "Design",
      panelID: "design-settings-content",
    },
    {
      id: "advanced-settings",
      content: "Advanced settings",
      panelID: "advanced-settings-content",
    },
  ];

  const tabComponents = [
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
      checkmarkSettings={checkmarkSettings}
      setCheckmarkSettings={setCheckmarkSettings}
    />,
    <OfferSettings
      offers={offers}
      setOffers={setOffers}
      selectedOfferIndex={selectedOfferIndex}
      setSelectedOfferIndex={setSelectedOfferIndex}
    />,
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
    />,
    <AdvancedSettings
      settings={advancedSettings}
      setSettings={setAdvancedSettings}
    />
  ];

  return (
    <BlockStack gap={200}>
      <LegacyCard>
        <div style={{ padding: "10px 0" }}>
          <Tabs
            tabs={tabs}
            selected={selected}
            onSelect={handleTabChange}
          />
        </div>
      </LegacyCard>
      
      {tabComponents[selected]}
    </BlockStack>
  );
}
