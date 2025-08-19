// Components/Productbundle/BundleSettingsTabs/BlockTab.jsx

import { useState, useCallback } from "react";
import {
  TextField,
  Select,
  RadioButton,
  Text,
  InlineStack,
  BlockStack,
  Button,
  Card,
} from "@shopify/polaris";
import { DeleteIcon } from "@shopify/polaris-icons";

export default function BlockTab({
  basicSettings,
  updateBasicSetting,
  generalSettings,
  handleSettingChange,
  selectedResources = [],
  setSelectedResources = () => {},
}) {
  const alignmentOptions = [
    { label: "Left", value: "left" },
    { label: "Center", value: "center" },
    { label: "Right", value: "right" },
  ];

  const handlePositionChange = useCallback((_, value) => {
    updateBasicSetting("position", value);
    
    // Clear previous selections when switching positions
    setSelectedResources([]);
    updateBasicSetting("selectedResourceIds", []);
    
    // Don't auto-open picker - let user click button instead
  }, [updateBasicSetting, setSelectedResources]);

  const openResourcePicker = useCallback(async () => {
    try {
      if (typeof window !== 'undefined' && window.shopify) {
        const resourceType = basicSettings.position === "collections" ? "collection" : "product";
        
        const selection = await window.shopify.resourcePicker({
          type: resourceType,
          action: "select",
          multiple: true,
          filter: resourceType === "product" ? {
            hidden: false,
            variants: false,
            draft: false,
            archived: false,
          } : {},
        });

        if (selection && selection.length > 0) {
          setSelectedResources(selection);
          // Update basic settings with selected resource IDs
          const resourceIds = selection.map(resource => resource.id);
          updateBasicSetting("selectedResourceIds", resourceIds);
        }
      }
    } catch (error) {
      console.warn("Error opening resource picker:", error);
    }
  }, [basicSettings.position, setSelectedResources, updateBasicSetting]);

  const removeResource = useCallback((resourceId) => {
    const updatedResources = selectedResources.filter(resource => resource.id !== resourceId);
    setSelectedResources(updatedResources);
    
    // Update basic settings
    const resourceIds = updatedResources.map(resource => resource.id);
    updateBasicSetting("selectedResourceIds", resourceIds);
  }, [selectedResources, setSelectedResources, updateBasicSetting]);

  const getPositionLabel = (position) => {
    switch (position) {
      case "all":
        return "All products";
      case "except":
        return "All products except selected";
      case "specific":
        return "Specific products";
      case "collections":
        return "Specific collections";
      default:
        return position;
    }
  };

  const getResourceTypeLabel = () => {
    return basicSettings.position === "collections" ? "Collection" : "Product";
  };

  const shouldShowResourcePicker = () => {
    return ["except", "specific", "collections"].includes(basicSettings.position);
  };

  // Handle button click to open picker
  const handleOpenPicker = useCallback(() => {
    openResourcePicker();
  }, [openResourcePicker]);

  return (
    <BlockStack gap="400">
      <TextField
        label="Bundle name"
        value={basicSettings.bundleName || ''}
        onChange={(value) => updateBasicSetting("bundleName", value)}
        autoComplete="off"
      />

      <InlineStack gap="400" align="space-between">
        <div style={{ flex: 1 }}>
          <TextField
            label="Header text"
            value={basicSettings.headerText || ''}
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
            value={basicSettings.alignment || 'left'}
          />
        </div>
      </InlineStack>

      <InlineStack gap="400" align="space-between">
        <div style={{ flex: 1 }}>
          <TextField
            label="Footer text"
            value={basicSettings.footerText || ''}
            onChange={(value) => updateBasicSetting("footerText", value)}
            autoComplete="off"
          />
        </div>
        <div style={{ flex: 1 }}>
          <TextField
            label="Button text"
            value={basicSettings.buttonText || ''}
            onChange={(value) => updateBasicSetting("buttonText", value)}
            autoComplete="off"
          />
        </div>
      </InlineStack>

      <BlockStack gap="100">
        <Text variant="headingMd" as="h3">
          Position
        </Text>
        {["all", "except", "specific", "collections"].map((position) => (
          <RadioButton
            key={position}
            label={getPositionLabel(position)}
            checked={basicSettings.position === position}
            id={position}
            name="position"
            onChange={handlePositionChange}
          />
        ))}
      </BlockStack>

      {/* Resource Selection Section */}
      {shouldShowResourcePicker() && (
        <BlockStack gap="300">
          <InlineStack align="space-between" blockAlign="center">
            <Text variant="headingMd" as="h3">
              Selected {getResourceTypeLabel()}s
            </Text>
            <Button
              onClick={handleOpenPicker}
              size="micro"
            >
              {selectedResources.length > 0 ? "Change Selection" : `Select ${getResourceTypeLabel()}s`}
            </Button>
          </InlineStack>

          {selectedResources.length > 0 ? (
            <BlockStack gap="200">
              {selectedResources.map((resource) => (
                <Card key={resource.id} padding="200">
                  <InlineStack align="space-between" blockAlign="center">
                    <div>
                      <Text variant="bodyMd" fontWeight="medium">
                        {resource.title}
                      </Text>
                      {resource.handle && (
                        <Text variant="bodySm" color="subdued">
                          Handle: {resource.handle}
                        </Text>
                      )}
                    </div>
                    <Button
                      icon={DeleteIcon}
                      size="micro"
                      onClick={() => removeResource(resource.id)}
                      accessibilityLabel={`Remove ${resource.title}`}
                    />
                  </InlineStack>
                </Card>
              ))}
              
              <Text variant="bodySm" color="subdued">
                {selectedResources.length} {getResourceTypeLabel().toLowerCase()}
                {selectedResources.length !== 1 ? 's' : ''} selected
              </Text>
            </BlockStack>
          ) : (
            <Card padding="400">
              <BlockStack align="center" inlineAlign="center">
                <Text variant="bodyMd" color="subdued" alignment="center">
                  No {getResourceTypeLabel().toLowerCase()}s selected yet
                </Text>
                <Button
                  onClick={handleOpenPicker}
                  // size="small"
                >
                  Select {getResourceTypeLabel()}s
                </Button>
              </BlockStack>
            </Card>
          )}
        </BlockStack>
      )}

      <BlockStack gap="300">
        <Text variant="headingMd" as="h3">
          Settings
        </Text>
        <InlineStack align="start">
          <input
            type="checkbox"
            id="variantChoice"
            checked={generalSettings?.variantChoice || false}
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
            checked={generalSettings?.showPrices || false}
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
            checked={generalSettings?.showComparePrice || false}
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
