import React, { useState, useCallback } from "react";
import {
  Card,
  TextField,
  Select,
  RadioButton,
  Text,
  Button,
  Checkbox,
  InlineStack,
  BlockStack,
  Icon,
  Tooltip,
  RangeSlider,
  ColorPicker,
  Popover,
  Tabs,
} from "@shopify/polaris";
import {
  QuestionCircleIcon,
  DeleteIcon,
  PlusIcon,
} from "@shopify/polaris-icons";

export default function VolumeSettings() {
  const [selected, setSelected] = useState(0);
  const [bundleName, setBundleName] = useState("Bundle 1");
  const [visibility, setVisibility] = useState("all");
  const [headerText, setHeaderText] = useState("Choose your offer");
  const [alignment, setAlignment] = useState("center");
  const [headerLine, setHeaderLine] = useState(true);
  const [lineThickness, setLineThickness] = useState(2);
  const [publishOption, setPublishOption] = useState("immediately");
  const [template, setTemplate] = useState("prestige");
  const [blockRadius, setBlockRadius] = useState(12);
  const [blockThickness, setBlockThickness] = useState(2);
  const [topSpacing, setTopSpacing] = useState(10);
  const [bottomSpacing, setBottomSpacing] = useState(10);
  const [radioDisplay, setRadioDisplay] = useState("show");
  const [enableSwatchColors, setEnableSwatchColors] = useState(true);
  const [swatchColors, setSwatchColors] = useState([
    { color: { hue: 300, brightness: 1, saturation: 0.7 } },
    { color: { hue: 50, brightness: 1, saturation: 0.7 } },
    { color: { hue: 120, brightness: 1, saturation: 0.7 } },
  ]);
  const [popoverActive, setPopoverActive] = useState(false);
  const [colorPickerIndex, setColorPickerIndex] = useState(0);

  const handleTabChange = (selectedTabIndex) => {
    setSelected(selectedTabIndex);
  };

  const handleSwatchColorChange = (color) => {
    const newSwatchColors = [...swatchColors];
    newSwatchColors[colorPickerIndex] = { color };
    setSwatchColors(newSwatchColors);
  };

  const togglePopoverActive = (index) => {
    setColorPickerIndex(index);
    setPopoverActive((popoverActive) => !popoverActive);
  };

  const handleAddSwatch = () => {
    setSwatchColors([
      ...swatchColors,
      { color: { hue: 0, brightness: 1, saturation: 0.7 } },
    ]);
  };

  const handleRemoveSwatch = (index) => {
    const newSwatchColors = [...swatchColors];
    newSwatchColors.splice(index, 1);
    setSwatchColors(newSwatchColors);
  };

  const tabs = [
    {
      id: "block",
      content: "Block",
      accessibilityLabel: "Block settings",
      panelID: "block-settings",
    },
    {
      id: "offers",
      content: "Offers",
      accessibilityLabel: "Offers settings",
      panelID: "offers-settings",
    },
    {
      id: "design",
      content: "Design",
      accessibilityLabel: "Design settings",
      panelID: "design-settings",
    },
    {
      id: "advanced-settings",
      content: "Advanced settings",
      accessibilityLabel: "Advanced settings",
      panelID: "advanced-settings",
    },
  ];

  const visibilityOptions = [
    { label: "All products", value: "all" },
    { label: "Specific products", value: "specific" },
    { label: "Specific collections", value: "collections" },
  ];

  const alignmentOptions = [
    { label: "Left", value: "left" },
    { label: "Center", value: "center" },
    { label: "Right", value: "right" },
  ];

  const renderTabContent = () => {
    switch (selected) {
      case 0: // Block tab
        return (
          <BlockStack gap="400">
            <BlockStack gap={"400"}>
              <BlockStack>
                <InlineStack gap="2" align="start">
                  <Text variant="headingMd">Bundle Name</Text>
                  <Tooltip content="Internal name for your reference">
                    <Icon source={QuestionCircleIcon} color="base" />
                  </Tooltip>
                </InlineStack>
                <TextField
                  value={bundleName}
                  onChange={setBundleName}
                  placeholder="Bundle 1"
                />
              </BlockStack>

              <BlockStack>
                <Text variant="headingMd">Visibility</Text>
                <Select
                  label=""
                  options={visibilityOptions}
                  value={visibility}
                  onChange={setVisibility}
                />
              </BlockStack>

              <BlockStack gap={"400"}>
                <div>
                  <Text variant="headingMd">Header Text</Text>
                  <TextField
                    value={headerText}
                    onChange={setHeaderText}
                    placeholder="Choose your offer"
                  />
                </div>

                <BlockStack align="space-between">
                  <div style={{ width: "" }}>
                    <Text variant="bodyMd" fontWeight="bold">
                      Alignment
                    </Text>
                    <Select
                      options={alignmentOptions}
                      value={alignment}
                      onChange={setAlignment}
                    />
                  </div>
                </BlockStack>

                <InlineStack align="space-between">
                  <div style={{ width: "50%" }}>
                    <Text variant="bodyMd">Header line</Text>
                    <Checkbox
                      label="Add a line to the header title"
                      checked={headerLine}
                      onChange={setHeaderLine}
                    />
                  </div>
                  <div style={{ width: "50%" }}>
                    <Text variant="bodyMd">Line thickness</Text>
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <RangeSlider
                        label=""
                        value={lineThickness}
                        onChange={setLineThickness}
                        min={1}
                        max={5}
                        output
                      />
                      <Text
                        variant="bodyMd"
                        as="span"
                        style={{ marginLeft: "8px" }}
                      >
                        {lineThickness} px
                      </Text>
                    </div>
                  </div>
                </InlineStack>
              </BlockStack>
            </BlockStack>

            <BlockStack gap={"00"}>
              <Text variant="headingMd">Publish Bundle</Text>
              <RadioButton
                label="Immediately"
                checked={publishOption === "immediately"}
                id="publish-immediately"
                name="publish"
                onChange={() => setPublishOption("immediately")}
              />
              <RadioButton
                label="Schedule"
                checked={publishOption === "schedule"}
                id="publish-schedule"
                name="publish"
                onChange={() => setPublishOption("schedule")}
              />
            </BlockStack>

            <BlockStack>
              <Text variant="headingMd">Template</Text>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr 1fr 1fr",
                  gap: "16px",
                }}
              >
                <div>
                  <div
                    style={{
                      border:
                        template === "royal"
                          ? "2px solid #5c6ac4"
                          : "1px solid #ddd",
                      borderRadius: "8px",
                      padding: "12px",
                      marginBottom: "8px",
                    }}
                  >
                    <div
                      style={{
                        height: "60px",
                        background: "#f6f6f7",
                        borderRadius: "4px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <div
                        style={{
                          width: "80%",
                          height: "8px",
                          background: "#e1e3e5",
                          borderRadius: "4px",
                        }}
                      ></div>
                    </div>
                  </div>
                  <RadioButton
                    label="Royal"
                    checked={template === "royal"}
                    id="template-royal"
                    name="template"
                    onChange={() => setTemplate("royal")}
                  />
                </div>

                <div>
                  <div
                    style={{
                      border:
                        template === "block"
                          ? "2px solid #5c6ac4"
                          : "1px solid #ddd",
                      borderRadius: "8px",
                      padding: "12px",
                      marginBottom: "8px",
                    }}
                  >
                    <div
                      style={{
                        height: "60px",
                        background: "#f6f6f7",
                        borderRadius: "4px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "0 10px",
                      }}
                    >
                      <div
                        style={{
                          width: "30%",
                          height: "8px",
                          background: "#e1e3e5",
                          borderRadius: "4px",
                        }}
                      ></div>
                      <div
                        style={{
                          width: "30%",
                          height: "8px",
                          background: "#e1e3e5",
                          borderRadius: "4px",
                        }}
                      ></div>
                      <div
                        style={{
                          width: "30%",
                          height: "8px",
                          background: "#e1e3e5",
                          borderRadius: "4px",
                        }}
                      ></div>
                    </div>
                  </div>
                  <RadioButton
                    label="Block"
                    checked={template === "block"}
                    id="template-block"
                    name="template"
                    onChange={() => setTemplate("block")}
                  />
                </div>

                <div>
                  <div
                    style={{
                      border:
                        template === "light"
                          ? "2px solid #5c6ac4"
                          : "1px solid #ddd",
                      borderRadius: "8px",
                      padding: "12px",
                      marginBottom: "8px",
                    }}
                  >
                    <div
                      style={{
                        height: "60px",
                        background: "#f6f6f7",
                        borderRadius: "4px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <div
                        style={{
                          width: "80%",
                          height: "8px",
                          background: "#e1e3e5",
                          borderRadius: "4px",
                        }}
                      ></div>
                    </div>
                  </div>
                  <RadioButton
                    label="Light"
                    checked={template === "light"}
                    id="template-light"
                    name="template"
                    onChange={() => setTemplate("light")}
                  />
                </div>

                <div>
                  <div
                    style={{
                      border:
                        template === "prestige"
                          ? "2px solid #5c6ac4"
                          : "1px solid #ddd",
                      borderRadius: "8px",
                      padding: "12px",
                      marginBottom: "8px",
                    }}
                  >
                    <div
                      style={{
                        height: "60px",
                        background: "#f6f6f7",
                        borderRadius: "4px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "0 10px",
                      }}
                    >
                      <div
                        style={{
                          width: "30%",
                          height: "8px",
                          background: "#e1e3e5",
                          borderRadius: "4px",
                        }}
                      ></div>
                      <div
                        style={{
                          width: "30%",
                          height: "8px",
                          background: "#e1e3e5",
                          borderRadius: "4px",
                        }}
                      ></div>
                      <div
                        style={{
                          width: "30%",
                          height: "8px",
                          background: "#e1e3e5",
                          borderRadius: "4px",
                        }}
                      ></div>
                    </div>
                  </div>
                  <RadioButton
                    label="Prestige"
                    checked={template === "prestige"}
                    id="template-prestige"
                    name="template"
                    onChange={() => setTemplate("prestige")}
                  />
                </div>
              </div>
              <Button fullWidth>See more templates</Button>
            </BlockStack>

            <BlockStack>
              <InlineStack align="space-between">
                <Text variant="headingMd">Shape</Text>
                <Button plain monochrome>
                  Show Less
                </Button>
              </InlineStack>

              <div>
                <Text variant="bodyMd">Block radius</Text>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <RangeSlider
                    label=""
                    value={blockRadius}
                    onChange={setBlockRadius}
                    min={0}
                    max={20}
                    output
                  />
                  <Text
                    variant="bodyMd"
                    as="span"
                    style={{ marginLeft: "8px" }}
                  >
                    {blockRadius} px
                  </Text>
                </div>
              </div>

              <div>
                <Text variant="bodyMd">Block Thickness</Text>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <RangeSlider
                    label=""
                    value={blockThickness}
                    onChange={setBlockThickness}
                    min={0}
                    max={5}
                    output
                  />
                  <Text
                    variant="bodyMd"
                    as="span"
                    style={{ marginLeft: "8px" }}
                  >
                    {blockThickness} px
                  </Text>
                </div>
              </div>

              <Text variant="bodyMd">Spacing</Text>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "16px",
                }}
              >
                <div>
                  <Text variant="bodyMd">Top</Text>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <RangeSlider
                      label=""
                      value={topSpacing}
                      onChange={setTopSpacing}
                      min={0}
                      max={30}
                      output
                    />
                    <Text
                      variant="bodyMd"
                      as="span"
                      style={{ marginLeft: "8px" }}
                    >
                      {topSpacing} px
                    </Text>
                  </div>
                </div>

                <div>
                  <Text variant="bodyMd">Bottom</Text>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <RangeSlider
                      label=""
                      value={bottomSpacing}
                      onChange={setBottomSpacing}
                      min={0}
                      max={30}
                      output
                    />
                    <Text
                      variant="bodyMd"
                      as="span"
                      style={{ marginLeft: "8px" }}
                    >
                      {bottomSpacing} px
                    </Text>
                  </div>
                </div>
              </div>
            </BlockStack>

            <BlockStack>
              <Text variant="headingMd">Checkmark</Text>
              <RadioButton
                label="Show radio"
                checked={radioDisplay === "show"}
                id="show-radio"
                name="radio-display"
                onChange={() => setRadioDisplay("show")}
              />
              <RadioButton
                label="Hide radio"
                checked={radioDisplay === "hide"}
                id="hide-radio"
                name="radio-display"
                onChange={() => setRadioDisplay("hide")}
              />
            </BlockStack>

            <BlockStack>
              <InlineStack gap="2" align="start">
                <Text variant="headingMd">Swatch Colors</Text>
                <Tooltip content="Colors for product variants">
                  <Icon source={QuestionCircleIcon} color="base" />
                </Tooltip>
              </InlineStack>

              <Checkbox
                label="Enable Swatch Colors"
                checked={enableSwatchColors}
                onChange={setEnableSwatchColors}
              />

              {enableSwatchColors && (
                <BlockStack>
                  <InlineStack gap="2" wrap={false}>
                    {swatchColors.map((swatch, index) => (
                      <div key={index} style={{ position: "relative" }}>
                        <div
                          onClick={() => togglePopoverActive(index)}
                          style={{
                            width: "30px",
                            height: "30px",
                            borderRadius: "50%",
                            background: `hsl(${swatch.color.hue}, ${swatch.color.saturation * 100}%, ${swatch.color.brightness * 50}%)`,
                            cursor: "pointer",
                            border: "1px solid #ddd",
                          }}
                        />
                        {index > 2 && (
                          <Button
                            plain
                            icon={DeleteIcon}
                            onClick={() => handleRemoveSwatch(index)}
                            accessibilityLabel="Remove color"
                            style={{
                              position: "absolute",
                              top: "-8px",
                              right: "-8px",
                              padding: "2px",
                              background: "white",
                              borderRadius: "50%",
                              boxShadow: "0 0 2px rgba(0,0,0,0.2)",
                            }}
                          />
                        )}
                      </div>
                    ))}
                    <Button icon={PlusIcon} onClick={handleAddSwatch}>
                      Add Swatch
                    </Button>
                  </InlineStack>

                  {popoverActive && (
                    <Popover
                      active={popoverActive}
                      activator={<div></div>}
                      onClose={() => setPopoverActive(false)}
                    >
                      <div style={{ padding: "12px" }}>
                        <ColorPicker
                          onChange={handleSwatchColorChange}
                          color={swatchColors[colorPickerIndex].color}
                        />
                      </div>
                    </Popover>
                  )}

                  <Button fullWidth>Add Swatches</Button>
                </BlockStack>
              )}
            </BlockStack>
          </BlockStack>
        );
      case 1: // Offers tab
        return (
          <BlockStack>
            <Text variant="headingMd">Offers settings content</Text>
            <Text>Configure your volume discount offers here</Text>
          </BlockStack>
        );
      case 2: // Design tab
        return (
          <BlockStack>
            <Text variant="headingMd">Design settings content</Text>
            <Text>Customize the appearance of your volume discount</Text>
          </BlockStack>
        );
      case 3: // Advanced settings tab
        return (
          <BlockStack>
            <Text variant="headingMd">Advanced settings content</Text>
            <Text>Configure advanced options for your volume discount</Text>
          </BlockStack>
        );
      default:
        return null;
    }
  };

  return (
    <Card>
      <Tabs tabs={tabs} selected={selected} onSelect={handleTabChange}>
        {renderTabContent()}
      </Tabs>
    </Card>
  );
}
