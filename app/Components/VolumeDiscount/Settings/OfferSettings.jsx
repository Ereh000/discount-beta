import {
  BlockStack,
  Card,
  Text,
  Tabs,
  Button,
  TextField,
  Grid,
  Select,
  RadioButton,
  Checkbox,
  Banner,
  Icon,
  Tooltip,
  Badge,
  InlineStack,
} from "@shopify/polaris"; // Import necessary components
import { DeleteIcon, ImageIcon, PlusCircleIcon } from "@shopify/polaris-icons"; // Import icons, added DynamicSourceIcon
import React, { useCallback } from "react"; // Import useState and useCallback

function OfferSettings({
  offers,
  setOffers,
  selectedOfferIndex,
  setSelectedOfferIndex,
}) {
  // Handler for changing offer tab
  const handleOfferTabChange = useCallback(
    (selectedTabIndex) => setSelectedOfferIndex(selectedTabIndex),
    [],
  );

  // Handler for adding a new offer (basic implementation)
  const handleAddOffer = useCallback(() => {
    const newOfferId = `offer-${offers.length + 1}`;
    const newOffer = {
      id: newOfferId,
      title: `Offer ${offers.length + 1}`,
      subtitle: "",
      quantity: "1",
      image: null,
      priceType: "default",
      priceValue: "discount_percentage",
      priceAmount: "",
      highlight: false,
      selectedByDefault: false,
      tag: "",
      // Add default highlight settings
      highlightSettings: {
        type: "text", // Default to 'text'
        text: "MOST POPULAR", // Default text
        blinking: false,
        style: "pill", // Default style
        shape: "rounded", // Default shape
      },
    };
    setOffers([...offers, newOffer]);
    setSelectedOfferIndex(offers.length); // Select the new offer
  }, [offers]);

  // Handler for deleting an offer (basic implementation)
  const handleDeleteOffer = useCallback(
    (indexToDelete) => {
      setOffers(offers.filter((_, index) => index !== indexToDelete));
      // Adjust selected index if the deleted offer was selected
      if (selectedOfferIndex === indexToDelete) {
        setSelectedOfferIndex(0); // Select the first offer
      } else if (selectedOfferIndex > indexToDelete) {
        setSelectedOfferIndex(selectedOfferIndex - 1);
      }
    },
    [offers, selectedOfferIndex],
  );

  // Handlers for updating the settings of the currently selected offer
  const handleOfferSettingChange = useCallback(
    (setting, value) => {
      setOffers(
        offers.map((offer, index) => {
          if (index === selectedOfferIndex) {
            // Handle nested highlight settings
            if (setting.startsWith("highlightSettings.")) {
              const [_, highlightSetting] = setting.split(".");
              return {
                ...offer,
                highlightSettings: {
                  ...offer.highlightSettings,
                  [highlightSetting]: value,
                },
              };
            }
            // Handle top-level settings
            return { ...offer, [setting]: value };
          }
          return offer;
        }),
      );
    },
    [offers, selectedOfferIndex],
  );

  // Options for Price Select
  const priceOptions = [
    {
      "label": "Default",
      "value": "default",
    },
    {
      label: "Discount value %",
      value: "discount_percentage",
      defaultChecked: true,
    },
    { label: "Discount value ₹", value: "discount_amount" },
    { label: "Fixed price ₹", value: "fixed_price" },
  ];

  // Options for Highlight Style Select
  const highlightStyleOptions = [
    { label: "Pill", value: "pill" },
    { label: "Rectangle", value: "rectangle" },
    // Add other styles if needed
  ];

  // Options for Highlight Shape Select
  const highlightShapeOptions = [
    { label: "Rounded", value: "rounded" },
    { label: "Square", value: "square" },
    // Add other shapes if needed
  ];

  // Get the currently selected offer
  const currentOffer = offers[selectedOfferIndex];

  // Map offers to tab structure
  const offerTabs = offers.map((offer, index) => ({
    id: offer.id,
    content: `Offer ${index + 1}`,
    panelID: `${offer.id}-content`,
    // You might add a delete action here if needed, but the image shows a delete button next to the offer title
  }));

  // Tabs for Highlight settings (Text/Timer)
  const highlightTabs = [
    {
      id: "highlight-text",
      content: "Text",
      panelID: "highlight-text-content",
    },
    {
      id: "highlight-timer",
      content: "Timer",
      panelID: "highlight-timer-content",
    },
  ];

  // Handler for changing highlight tab
  const handleHighlightTabChange = useCallback(
    (selectedTabIndex) => {
      const type = highlightTabs[selectedTabIndex].id.replace("highlight-", "");
      handleOfferSettingChange("highlightSettings.type", type);
    },
    [handleOfferSettingChange, highlightTabs],
  );

  return (
    <div>
      <Card>
        <BlockStack gap={400}>
          {/* Volume Discount Header and Tabs */}
          <BlockStack gap="200">
            <Text variant="headingMd" as="h2">
              Volume Discount
            </Text>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginLeft: "-13px",
                marginBottom: "",
              }}
            >
              <Tabs
                tabs={offerTabs}
                selected={selectedOfferIndex}
                onSelect={handleOfferTabChange}
              />
              <Button
                onClick={handleAddOffer}
                icon={<Icon source={PlusCircleIcon} />}
              >
                Add New Offer
              </Button>
            </div>
          </BlockStack>

          {/* Offer Settings Card */}
          <BlockStack gap={400}>
            <BlockStack gap={200}>
              {/* Offer Title and Delete Button */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Text variant="headingMd" as="h3">
                  Offer #{selectedOfferIndex + 1}
                </Text>
                {offers.length > 1 && ( // Only show delete button if there's more than one offer
                  <Button
                    variant="plain"
                    icon={<Icon source={DeleteIcon} color="critical" />}
                    onClick={() => handleDeleteOffer(selectedOfferIndex)}
                  />
                )}
              </div>

              {/* Title, Subtitle, Quantity */}
              <Grid>
                <Grid.Cell columnSpan={{ xs: 12, sm: 12, md: 4, lg: 4, xl: 4 }}>
                  <TextField
                    label="Title"
                    value={currentOffer.title}
                    onChange={(value) =>
                      handleOfferSettingChange("title", value)
                    }
                    // connectedRight={<Text as="span">{'{ }'}</Text>} // Placeholder for dynamic content icon
                  />
                </Grid.Cell>
                <Grid.Cell columnSpan={{ xs: 12, sm: 12, md: 4, lg: 4, xl: 4 }}>
                  <TextField
                    label="Subtitle"
                    value={currentOffer.subtitle}
                    onChange={(value) =>
                      handleOfferSettingChange("subtitle", value)
                    }
                    // connectedRight={<Text as="span">{'{ }'}</Text>} // Placeholder for dynamic content icon
                  />
                </Grid.Cell>
                <Grid.Cell columnSpan={{ xs: 12, sm: 12, md: 4, lg: 4, xl: 4 }}>
                  <TextField
                    label="Quantity"
                    value={currentOffer.quantity}
                    onChange={(value) =>
                      handleOfferSettingChange("quantity", value)
                    }
                    type="number"
                  />
                </Grid.Cell>
              </Grid>
            </BlockStack>

            {/* Image (Optional) */}
            <BlockStack gap={200}>
              <Text fontWeight="bold">Image (Optional)</Text>
              <Button icon={<Icon source={ImageIcon} />}>Add Image</Button>
            </BlockStack>

            {/* Price */}
            <BlockStack gap={200}>
              <Text fontWeight="bold">
                Price{" "}
                <Tooltip content="This order has shipping labels">
                  <Badge tone="warning">Important Note</Badge>
                </Tooltip>
              </Text>{" "}
              {/* Placeholder for Important Note */}
              <BlockStack gap={200}>
                <RadioButton
                  label="Default"
                  checked={currentOffer.priceType === "default"}
                  id="defaultPrice"
                  name={`priceType-${selectedOfferIndex}`} // Use offer index in name for uniqueness
                  onChange={() =>
                    handleOfferSettingChange("priceType", "default")
                  }
                />
                {currentOffer.priceType === "default" && (
                  <div style={{ paddingLeft: "" }}>
                    <Select
                      label=""
                      labelHidden
                      options={priceOptions}
                      onChange={(value) =>
                        handleOfferSettingChange("priceValue", value)
                      }
                      value={currentOffer.priceValue || "default"}
                    />
                    {currentOffer.priceValue &&
                      currentOffer.priceValue !== "default" && (
                        <TextField
                          label=""
                          type="number"
                          value={currentOffer.priceAmount || ""}
                          onChange={(value) =>
                            handleOfferSettingChange("priceAmount", value)
                          }
                          autoComplete="off"
                          suffix={
                            currentOffer.priceValue === "discount_percentage"
                              ? "%"
                              : "₹"
                          }
                          placeholder={`Enter ${currentOffer.priceValue === "discount_percentage" ? "percentage" : "amount"}`}
                        />
                      )}
                  </div>
                )}
              </BlockStack>
            </BlockStack>

            {/* Highlight */}
            <BlockStack gap={200}>
              <Text fontWeight="bold">Highlight</Text>
              <Checkbox
                label="Highlight this offer (Optional)"
                checked={currentOffer.highlight}
                onChange={(value) =>
                  handleOfferSettingChange("highlight", value)
                }
              />

              {/* Conditional rendering for highlight settings */}
              {currentOffer.highlight && (
                <BlockStack>
                  {/* Text/Timer Tabs */}
                  <Tabs
                    tabs={highlightTabs}
                    selected={highlightTabs.findIndex(
                      (tab) =>
                        tab.id ===
                        `highlight-${currentOffer.highlightSettings?.type || "text"}`,
                    )}
                    onSelect={handleHighlightTabChange}
                  >
                    <div className="" style={{ paddingLeft: "12px" }}>
                      {/* Highlight Text Settings */}
                      {currentOffer.highlightSettings?.type === "text" && (
                        <BlockStack>
                          <TextField
                            label="Title"
                            value={currentOffer.highlightSettings?.text || ""}
                            onChange={(value) =>
                              handleOfferSettingChange(
                                "highlightSettings.text",
                                value,
                              )
                            }
                            // connectedRight={<Icon source={DynamicSourceIcon} />} // Dynamic content icon
                          />
                          <Checkbox
                            label="Blinking"
                            checked={
                              currentOffer.highlightSettings?.blinking || false
                            }
                            onChange={(value) =>
                              handleOfferSettingChange(
                                "highlightSettings.blinking",
                                value,
                              )
                            }
                          />
                          <Grid>
                            <Grid.Cell
                              columnSpan={{ xs: 6, sm: 6, md: 6, lg: 6, xl: 6 }}
                            >
                              <Select
                                label="Style"
                                options={highlightStyleOptions}
                                onChange={(value) =>
                                  handleOfferSettingChange(
                                    "highlightSettings.style",
                                    value,
                                  )
                                }
                                value={
                                  currentOffer.highlightSettings?.style ||
                                  "pill"
                                }
                              />
                            </Grid.Cell>
                            <Grid.Cell
                              columnSpan={{ xs: 6, sm: 6, md: 6, lg: 6, xl: 6 }}
                            >
                              <Select
                                label="Shape"
                                options={highlightShapeOptions}
                                onChange={(value) =>
                                  handleOfferSettingChange(
                                    "highlightSettings.shape",
                                    value,
                                  )
                                }
                                value={
                                  currentOffer.highlightSettings?.shape ||
                                  "rounded"
                                }
                              />
                            </Grid.Cell>
                          </Grid>
                        </BlockStack>
                      )}

                      {/* Highlight Timer Settings (Placeholder) */}
                      {currentOffer.highlightSettings?.type === "timer" && (
                        <BlockStack gap={200}>
                          <Banner status="info">
                            Timer settings would go here.
                          </Banner>
                        </BlockStack>
                      )}
                    </div>
                  </Tabs>
                </BlockStack>
              )}
            </BlockStack>

            {/* Selected by default */}
            <BlockStack gap={200}>
              <Checkbox
                label="Selected by default"
                checked={currentOffer.selectedByDefault}
                onChange={(value) =>
                  handleOfferSettingChange("selectedByDefault", value)
                }
              />
            </BlockStack>

            {/* Tag (Optional) */}
            <BlockStack gap={200}>
              <TextField
                label="Tag(Optional)"
                value={currentOffer.tag}
                onChange={(value) => handleOfferSettingChange("tag", value)}
                // connectedRight={<Text as="span">{'{ }'}</Text>} // Placeholder for dynamic content icon
              />
            </BlockStack>
          </BlockStack>
        </BlockStack>
      </Card>
    </div>
  );
}

export default OfferSettings;
