// Components/Productbundle/BundleSettingsTabs/BlockTab.jsx

import {
  TextField,
  Select,
  RadioButton,
  Text,
  InlineStack,
  BlockStack,
} from "@shopify/polaris";

export default function BlockTab({
  basicSettings,
  updateBasicSetting,
  generalSettings,
  handleSettingChange,
}) {
  const alignmentOptions = [
    { label: "Left", value: "left" },
    { label: "Center", value: "center" },
    { label: "Right", value: "right" },
  ];

  const handlePositionChange = (_, value) =>
    updateBasicSetting("position", value);

  return (
    <BlockStack gap="400">
      <TextField
        label="Bundle name"
        value={basicSettings.bundleName}
        onChange={(value) => updateBasicSetting("bundleName", value)}
        autoComplete="off"
      />

      <InlineStack gap="400" align="space-between">
        <div style={{ flex: 1 }}>
          <TextField
            label="Header text"
            value={basicSettings.headerText}
            onChange={(value) => updateBasicSetting("headerText", value)}
            autoComplete="off"
            helpText="(optional)"
          />
        </div>
        <div style={{ flex: 1 }}>
          <Select
            label="Alignment"
            options={alignmentOptions}
            onChange={(value) => updateBasicSetting("alignment", value)}
            value={basicSettings.alignment}
          />
        </div>
      </InlineStack>

      <InlineStack gap="400" align="space-between">
        <div style={{ flex: 1 }}>
          <TextField
            label="Footer text"
            value={basicSettings.footerText}
            onChange={(value) => updateBasicSetting("footerText", value)}
            autoComplete="off"
          />
        </div>
        <div style={{ flex: 1 }}>
          <TextField
            label="Button text"
            value={basicSettings.buttonText}
            onChange={(value) => updateBasicSetting("buttonText", value)}
            autoComplete="off"
          />
        </div>
      </InlineStack>

      <BlockStack gap="100">
        <Text variant="headingMd" as="h3">
          Position
        </Text>
        <RadioButton
          label="All products"
          checked={basicSettings.position === "all"}
          id="all"
          name="position"
          onChange={handlePositionChange}
        />
        <RadioButton
          label="All products except selected"
          checked={basicSettings.position === "except"}
          id="except"
          name="position"
          onChange={handlePositionChange}
        />
        <RadioButton
          label="Specific products"
          checked={basicSettings.position === "specific"}
          id="specific"
          name="position"
          onChange={handlePositionChange}
        />
        <RadioButton
          label="Specific collections"
          checked={basicSettings.position === "collections"}
          id="collections"
          name="position"
          onChange={handlePositionChange}
        />
      </BlockStack>

      <BlockStack gap="300">
        <Text variant="headingMd" as="h3">
          Settings
        </Text>
        <InlineStack align="start">
          <input
            type="checkbox"
            id="variantChoice"
            checked={generalSettings.variantChoice}
            onChange={() => {
              try {
                if (typeof handleSettingChange === "function") {
                  handleSettingChange("variantChoice");
                }
              } catch (error) {
                console.warn("Error handling setting change:", error);
              }
            }}
            style={{ marginRight: "8px" }}
          />
          <label htmlFor="variantChoice">
            Let customers choose different variants for each item
          </label>
        </InlineStack>

        <InlineStack align="start">
          <input
            type="checkbox"
            id="showPrices"
            checked={generalSettings.showPrices}
            onChange={() => {
              try {
                if (typeof handleSettingChange === "function") {
                  handleSettingChange("showPrices");
                }
              } catch (error) {
                console.warn("Error handling setting change:", error);
              }
            }}
            style={{ marginRight: "8px" }}
          />
          <label htmlFor="showPrices">Show prices per item</label>
        </InlineStack>

        <InlineStack align="start">
          <input
            type="checkbox"
            id="showComparePrice"
            checked={generalSettings.showComparePrice}
            onChange={() => {
              try {
                if (typeof handleSettingChange === "function") {
                  handleSettingChange("showComparePrice");
                }
              } catch (error) {
                console.warn("Error handling setting change:", error);
              }
            }}
            style={{ marginRight: "8px" }}
          />
          <label htmlFor="showComparePrice">
            Show product compare-at price
          </label>
        </InlineStack>
      </BlockStack>
    </BlockStack>
  );
}
