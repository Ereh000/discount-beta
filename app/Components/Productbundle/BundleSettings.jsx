// Components/Productbundle/BundleSettings.jsx

import { useState, useCallback } from "react";
import {
  Card,
  TextField,
  Select,
  RadioButton,
  Text,
  Tabs,
  Button,
  InlineStack,
  BlockStack,
  Icon,
  LegacyCard,
} from "@shopify/polaris";
import { DeleteIcon, ImageAddIcon } from "@shopify/polaris-icons";

// Default values to prevent undefined errors
const DEFAULT_BASIC_SETTINGS = {
  bundleName: '',
  headerText: '',
  alignment: 'left',
  footerText: '',
  buttonText: 'Add to Cart',
  position: 'specific',
  selectedColor: '#000000',
  productImageSize: 50,
  iconStyle: 'default'
};

const DEFAULT_PRICING_SETTINGS = {
  option: 'default',
  discountPercentage: '',
  fixedDiscount: '',
  fixedPrice: ''
};

const DEFAULT_HIGHLIGHT_SETTINGS = {
  option: 'text',
  title: '',
  timerTitle: '',
  isBlinking: false,
  style: 'solid',
  timerEndDate: '',
  timerFormat: 'dd:hh:mm:ss'
};

const DEFAULT_DESIGN_SETTINGS = {
  typography: {
    header: { size: '18', weight: 'Bold' },
    titlePrice: { size: '16', weight: 'Regular' }
  },
  spacing: {
    bundleTop: '0',
    bundleBottom: '0',
    footerTop: '0',
    footerBottom: '0'
  },
  shapes: {
    bundle: 'Squared',
    footer: 'Squared',
    addToCart: 'Squared'
  },
  borderThickness: {
    bundle: 0,
    footer: 0,
    addToCart: 0
  },
  colors: {
    background: '#ffffff',
    border: '#e1e5e9',
    footerBackground: '#f6f6f7',
    buttonBackground: '#000000',
    highlightBackground: '#ff6b35',
    quantityBackground: '#f6f6f7',
    headerText: '#000000',
    titleText: '#000000',
    price: '#000000',
    comparedPrice: '#999999',
    highlightText: '#ffffff',
    addToCartText: '#ffffff',
    quantityText: '#000000',
    footerText: '#000000'
  }
};

const DEFAULT_GENERAL_SETTINGS = {
  variantChoice: false,
  showPrices: false,
  showComparePrice: false
};

// Bundle Settings Card Component
export default function BundleSettingsCard({
  // Grouped state objects with comprehensive defaults
  basicSettings = DEFAULT_BASIC_SETTINGS,
  setBasicSettings = () => {},
  pricingSettings = DEFAULT_PRICING_SETTINGS,
  setPricingSettings = () => {},
  highlightSettings = DEFAULT_HIGHLIGHT_SETTINGS,
  setHighlightSettings = () => {},
  designSettings = DEFAULT_DESIGN_SETTINGS,
  setDesignSettings = () => {},
  generalSettings = DEFAULT_GENERAL_SETTINGS,
  setGeneralSettings = () => {},
  products = [],
  setProducts = () => {},
  // Product management handlers
  handleAddProduct = () => {},
  handleRemoveProduct = () => {},
  handleSettingChange = () => {},
  // Validation props (optional)
  hasAllPositionBundle = false,
  isEdit = false,
  originalPosition = 'specific',
}) {
  const [selected, setSelected] = useState(0);

  // Merge props with defaults to ensure all properties exist
  const safeBasicSettings = { ...DEFAULT_BASIC_SETTINGS, ...basicSettings };
  const safePricingSettings = { ...DEFAULT_PRICING_SETTINGS, ...pricingSettings };
  const safeHighlightSettings = { ...DEFAULT_HIGHLIGHT_SETTINGS, ...highlightSettings };
  const safeDesignSettings = {
    ...DEFAULT_DESIGN_SETTINGS,
    ...designSettings,
    typography: { ...DEFAULT_DESIGN_SETTINGS.typography, ...designSettings?.typography },
    spacing: { ...DEFAULT_DESIGN_SETTINGS.spacing, ...designSettings?.spacing },
    shapes: { ...DEFAULT_DESIGN_SETTINGS.shapes, ...designSettings?.shapes },
    borderThickness: { ...DEFAULT_DESIGN_SETTINGS.borderThickness, ...designSettings?.borderThickness },
    colors: { ...DEFAULT_DESIGN_SETTINGS.colors, ...designSettings?.colors }
  };
  const safeGeneralSettings = { ...DEFAULT_GENERAL_SETTINGS, ...generalSettings };

  // Tab change handler
  const handleTabChange = useCallback(
    (selectedTabIndex) => setSelected(selectedTabIndex),
    [],
  );

  // Safe update helpers with error handling
  const updateBasicSetting = useCallback((key, value) => {
    try {
      if (typeof setBasicSettings === 'function') {
        setBasicSettings(prev => ({ ...prev, [key]: value }));
      }
    } catch (error) {
      console.warn('Error updating basic setting:', error);
    }
  }, [setBasicSettings]);

  const updatePricingSetting = useCallback((key, value) => {
    try {
      if (typeof setPricingSettings === 'function') {
        setPricingSettings(prev => ({ ...prev, [key]: value }));
      }
    } catch (error) {
      console.warn('Error updating pricing setting:', error);
    }
  }, [setPricingSettings]);

  const updateHighlightSetting = useCallback((key, value) => {
    try {
      if (typeof setHighlightSettings === 'function') {
        setHighlightSettings(prev => ({ ...prev, [key]: value }));
      }
    } catch (error) {
      console.warn('Error updating highlight setting:', error);
    }
  }, [setHighlightSettings]);

  const updateDesignSetting = useCallback((key, value) => {
    try {
      if (typeof setDesignSettings === 'function') {
        setDesignSettings(prev => ({ ...prev, [key]: value }));
      }
    } catch (error) {
      console.warn('Error updating design setting:', error);
    }
  }, [setDesignSettings]);

  // Handler for pricing option changes
  const handlePricingOptionChange = useCallback(
    (_, value) => updatePricingSetting('option', value),
    [updatePricingSetting],
  );

  // Handler for highlight option changes
  const handleHighlightOptionChange = useCallback(
    (_, value) => updateHighlightSetting('option', value),
    [updateHighlightSetting],
  );

  // Handler for position changes
  const handlePositionChange = useCallback(
    (_, value) => updateBasicSetting('position', value),
    [updateBasicSetting],
  );

  // Safe product update handler
  const handleProductUpdate = useCallback((updatedProducts) => {
    try {
      if (typeof setProducts === 'function') {
        setProducts(updatedProducts);
      }
    } catch (error) {
      console.warn('Error updating products:', error);
    }
  }, [setProducts]);

  const tabs = [
    { id: "block", content: "Block" },
    { id: "offer", content: "Offer" },
    { id: "font-size", content: "Font & size" },
    { id: "colors", content: "Colors" },
  ];

  const alignmentOptions = [
    { label: "Left", value: "left" },
    { label: "Center", value: "center" },
    { label: "Right", value: "right" },
  ];

  return (
    <>
      <LegacyCard>
        <div className="tab" style={{ padding: "7px 0" }}>
          <Tabs tabs={tabs} selected={selected} onSelect={handleTabChange} />
        </div>
      </LegacyCard>

      <LegacyCard>
        <div style={{ padding: "16px" }}>
          {selected === 0 && (
            <BlockStack gap="400">
              <TextField
                label="Bundle name"
                value={safeBasicSettings.bundleName}
                onChange={(value) => updateBasicSetting('bundleName', value)}
                autoComplete="off"
              />

              <InlineStack gap="400" align="space-between">
                <div style={{ flex: 1 }}>
                  <TextField
                    label="Header text"
                    value={safeBasicSettings.headerText}
                    onChange={(value) => updateBasicSetting('headerText', value)}
                    autoComplete="off"
                    helpText="(optional)"
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <Select
                    label="Alignment"
                    options={alignmentOptions}
                    onChange={(value) => updateBasicSetting('alignment', value)}
                    value={safeBasicSettings.alignment}
                  />
                </div>
              </InlineStack>

              <InlineStack gap="400" align="space-between">
                <div style={{ flex: 1 }}>
                  <TextField
                    label="Footer text"
                    value={safeBasicSettings.footerText}
                    onChange={(value) => updateBasicSetting('footerText', value)}
                    autoComplete="off"
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <TextField
                    label="Button text"
                    value={safeBasicSettings.buttonText}
                    onChange={(value) => updateBasicSetting('buttonText', value)}
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
                  checked={safeBasicSettings.position === "all"}
                  id="all"
                  name="position"
                  onChange={handlePositionChange}
                />
                <RadioButton
                  label="All products except selected"
                  checked={safeBasicSettings.position === "except"}
                  id="except"
                  name="position"
                  onChange={handlePositionChange}
                />
                <RadioButton
                  label="Specific products"
                  checked={safeBasicSettings.position === "specific"}
                  id="specific"
                  name="position"
                  onChange={handlePositionChange}
                />
                <RadioButton
                  label="Specific collections"
                  checked={safeBasicSettings.position === "collections"}
                  id="collections"
                  name="position"
                  onChange={handlePositionChange}
                />
              </BlockStack>

              {/* Additional settings */}
              <BlockStack gap="300">
                <Text variant="headingMd" as="h3">
                  Settings
                </Text>
                <InlineStack align="start">
                  <input
                    type="checkbox"
                    id="variantChoice"
                    checked={safeGeneralSettings.variantChoice}
                    onChange={() => {
                      try {
                        if (typeof handleSettingChange === 'function') {
                          handleSettingChange("variantChoice");
                        }
                      } catch (error) {
                        console.warn('Error handling setting change:', error);
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
                    checked={safeGeneralSettings.showPrices}
                    onChange={() => {
                      try {
                        if (typeof handleSettingChange === 'function') {
                          handleSettingChange("showPrices");
                        }
                      } catch (error) {
                        console.warn('Error handling setting change:', error);
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
                    checked={safeGeneralSettings.showComparePrice}
                    onChange={() => {
                      try {
                        if (typeof handleSettingChange === 'function') {
                          handleSettingChange("showComparePrice");
                        }
                      } catch (error) {
                        console.warn('Error handling setting change:', error);
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
          )}

          {selected === 1 && (
            <BlockStack gap="400">
              {/* Bundle Product Selection */}
              <BlockStack gap="300">
                <Text variant="headingMd" as="h3">
                  Bundle
                </Text>
                
                {/* Dynamic Product Cards */}
                {Array.isArray(products) && products.map((product, index) => (
                  <Card key={product?.id || index} padding="0">
                    <div
                      style={{
                        padding: "12px",
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                      }}
                    >
                      <div style={{ cursor: "grab" }}>
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 20 20"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M7 5H13M7 10H13M7 15H13"
                            stroke="#5C5F62"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>
                      <div
                        style={{
                          width: "32px",
                          height: "32px",
                          backgroundColor: "#F6F6F7",
                          border: "1px solid #ccc",
                          borderRadius: "4px",
                          overflow: "hidden",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        {product?.image ? (
                          <img
                            style={{ width: "100%", height: "100%" }}
                            src={product.image}
                            alt=""
                          />
                        ) : (
                          <Icon source={ImageAddIcon} />
                        )}
                      </div>
                      <div style={{ flex: 1 }}>
                        <Button
                          fullWidth
                          onClick={() => {
                            try {
                              if (typeof window !== 'undefined' && window.shopify) {
                                window.shopify
                                  .resourcePicker({
                                    type: "product",
                                    action: "select",
                                    multiple: false,
                                    filter: {
                                      hidden: false,
                                      variants: false,
                                      draft: false,
                                      archived: false,
                                      query: "total_inventory:>0",
                                    },
                                  })
                                  .then(({ selection }) => {
                                    if (selection && selection.length > 0) {
                                      const selectedProduct = selection[0];
                                      const updatedProducts = [...products];
                                      updatedProducts[index] = {
                                        ...updatedProducts[index],
                                        name: selectedProduct.title,
                                        productId: selectedProduct.id,
                                        image: selectedProduct.images?.[0]?.originalSrc,
                                        productHandle: selectedProduct.handle,
                                      };
                                      handleProductUpdate(updatedProducts);
                                    }
                                  })
                                  .catch(error => {
                                    console.warn('Error selecting product:', error);
                                  });
                              }
                            } catch (error) {
                              console.warn('Error opening product selector:', error);
                            }
                          }}
                        >
                          {product?.name || `Select product ${index + 1}`}
                        </Button>
                      </div>
                      <div style={{ width: "100px" }}>
                        <TextField
                          label="Quantity"
                          labelHidden
                          type="number"
                          prefix="Qty"
                          value={String(product?.quantity || 1)}
                          onChange={(value) => {
                            try {
                              const updatedProducts = [...products];
                              updatedProducts[index] = {
                                ...updatedProducts[index],
                                quantity: parseInt(value) || 1
                              };
                              handleProductUpdate(updatedProducts);
                            } catch (error) {
                              console.warn('Error updating quantity:', error);
                            }
                          }}
                          autoComplete="off"
                        />
                      </div>
                      <Button
                        icon={DeleteIcon}
                        onClick={() => {
                          try {
                            if (typeof handleRemoveProduct === 'function') {
                              handleRemoveProduct(product?.id || index);
                            }
                          } catch (error) {
                            console.warn('Error removing product:', error);
                          }
                        }}
                      />
                    </div>
                  </Card>
                ))}

                {/* Add new product button */}
                <Button 
                  fullWidth 
                  onClick={() => {
                    try {
                      if (typeof handleAddProduct === 'function') {
                        handleAddProduct();
                      }
                    } catch (error) {
                      console.warn('Error adding product:', error);
                    }
                  }}
                >
                  Add a new product
                </Button>
              </BlockStack>

              {/* Price Settings */}
              <BlockStack gap="300">
                <InlineStack align="space-between">
                  <Text variant="headingMd" as="h3">
                    Price
                  </Text>
                  <Text variant="bodyMd" tone="critical">
                    <span style={{ display: "flex", alignItems: "center" }}>
                      <span style={{ color: "#D82C0D", marginRight: "4px" }}>
                        ⚠
                      </span>
                      Important Note
                    </span>
                  </Text>
                </InlineStack>

                <RadioButton
                  label="Default"
                  checked={safePricingSettings.option === "default"}
                  id="default"
                  name="pricingOption"
                  onChange={handlePricingOptionChange}
                />

                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <RadioButton
                    label="Discount value in %"
                    checked={safePricingSettings.option === "percentage"}
                    id="percentage"
                    name="pricingOption"
                    onChange={handlePricingOptionChange}
                  />
                  {safePricingSettings.option === "percentage" && (
                    <Text variant="bodyMd" as="span" tone="subdued">
                      (example: 10% off)
                    </Text>
                  )}
                </div>
                {safePricingSettings.option === "percentage" && (
                  <div style={{ marginLeft: "28px", marginTop: "4px" }}>
                    <TextField
                      label="Discount percentage"
                      labelHidden
                      type="number"
                      suffix="%"
                      value={safePricingSettings.discountPercentage}
                      onChange={(value) => updatePricingSetting('discountPercentage', value)}
                      autoComplete="off"
                    />
                  </div>
                )}

                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <RadioButton
                    label="Fixed discount $ per item"
                    checked={safePricingSettings.option === "fixedDiscount"}
                    id="fixedDiscount"
                    name="pricingOption"
                    onChange={handlePricingOptionChange}
                  />
                  {safePricingSettings.option === "fixedDiscount" && (
                    <Text variant="bodyMd" as="span" tone="subdued">
                      (example: 25$ off)
                    </Text>
                  )}
                </div>
                {safePricingSettings.option === "fixedDiscount" && (
                  <div style={{ marginLeft: "28px", marginTop: "4px" }}>
                    <TextField
                      label="Fixed discount amount"
                      labelHidden
                      type="number"
                      prefix="$"
                      value={safePricingSettings.fixedDiscount}
                      onChange={(value) => updatePricingSetting('fixedDiscount', value)}
                      autoComplete="off"
                    />
                  </div>
                )}

                <RadioButton
                  label="Fixed price for the bundle"
                  checked={safePricingSettings.option === "fixedPrice"}
                  id="fixedPrice"
                  name="pricingOption"
                  onChange={handlePricingOptionChange}
                />
                {safePricingSettings.option === "fixedPrice" && (
                  <div style={{ marginLeft: "28px", marginTop: "4px" }}>
                    <TextField
                      label="Fixed bundle price"
                      labelHidden
                      type="number"
                      prefix="$"
                      value={safePricingSettings.fixedPrice}
                      onChange={(value) => updatePricingSetting('fixedPrice', value)}
                      autoComplete="off"
                    />
                  </div>
                )}
              </BlockStack>

              <BlockStack gap="300">
                <Text variant="headingMd" as="h3">
                  Highlight
                </Text>

                <BlockStack>
                  <RadioButton
                    label="Text"
                    checked={safeHighlightSettings.option === "text"}
                    id="text"
                    name="highlightOption"
                    onChange={handleHighlightOptionChange}
                  />

                  <RadioButton
                    label="Timer"
                    checked={safeHighlightSettings.option === "timer"}
                    id="timer"
                    name="highlightOption"
                    onChange={handleHighlightOptionChange}
                  />

                  {safeHighlightSettings.option === "text" && (
                    <div style={{ marginLeft: "28px", marginTop: "4px" }}>
                      <TextField
                        label="Title"
                        value={safeHighlightSettings.title}
                        onChange={(value) => updateHighlightSetting('title', value)}
                        autoComplete="off"
                      />

                      <InlineStack
                        align="start"
                        gap="00"
                        blockAlign="center"
                        style={{ marginTop: "12px" }}
                      >
                        <input
                          type="checkbox"
                          id="blinking"
                          checked={safeHighlightSettings.isBlinking}
                          onChange={(e) => updateHighlightSetting('isBlinking', e.target.checked)}
                          style={{ marginRight: "8px" }}
                        />
                        <label htmlFor="blinking">Blinking</label>
                      </InlineStack>

                      <div style={{ marginTop: "12px" }}>
                        <Select
                          label="Style"
                          options={[
                            { label: "Solid", value: "solid" },
                            { label: "Outline", value: "outline" },
                            { label: "Soft", value: "soft" },
                          ]}
                          onChange={(value) => updateHighlightSetting('style', value)}
                          value={safeHighlightSettings.style}
                        />
                      </div>
                    </div>
                  )}

                  {safeHighlightSettings.option === "timer" && (
                    <div style={{ marginLeft: "28px", marginTop: "4px" }}>
                      <TextField
                        label="Title"
                        value={safeHighlightSettings.timerTitle}
                        onChange={(value) => updateHighlightSetting('timerTitle', value)}
                        autoComplete="off"
                      />

                      <TextField
                        label="End date"
                        type="datetime-local"
                        value={safeHighlightSettings.timerEndDate}
                        onChange={(value) => updateHighlightSetting('timerEndDate', value)}
                        autoComplete="off"
                      />

                      <div style={{ marginTop: "12px" }}>
                        <Select
                          label="Format"
                          options={[
                            { label: "DD:HH:MM:SS", value: "dd:hh:mm:ss" },
                            { label: "HH:MM:SS", value: "hh:mm:ss" },
                            { label: "MM:SS", value: "mm:ss" },
                          ]}
                          onChange={(value) => updateHighlightSetting('timerFormat', value)}
                          value={safeHighlightSettings.timerFormat}
                        />
                      </div>

                      <div style={{ marginTop: "12px" }}>
                        <Select
                          label="Style"
                          options={[
                            { label: "Solid", value: "solid" },
                            { label: "Outline", value: "outline" },
                            { label: "Soft", value: "soft" },
                          ]}
                          onChange={(value) => updateHighlightSetting('style', value)}
                          value={safeHighlightSettings.style}
                        />
                      </div>
                    </div>
                  )}
                </BlockStack>
              </BlockStack>
            </BlockStack>
          )}

          {selected === 2 && (
            <BlockStack gap="400">
              <BlockStack gap="300">
                <Text variant="headingMd" as="h3">
                  Typography
                </Text>

                {/* Header Typography */}
                <InlineStack gap="400" align="space-between">
                  <div style={{ flex: 1 }}>
                    <TextField
                      label="Header Size"
                      type="number"
                      value={safeDesignSettings.typography?.header?.size || "18"}
                      onChange={(value) =>
                        updateDesignSetting('typography', {
                          ...safeDesignSettings.typography,
                          header: { ...safeDesignSettings.typography?.header, size: value },
                        })
                      }
                      autoComplete="off"
                    />
                  </div>
                  <div style={{ flex: 1 }}>
                    <Select
                      label="Weight"
                      options={[
                        { label: "Lighter", value: "Lighter" },
                        { label: "Regular", value: "Regular" },
                        { label: "Bold", value: "Bold" },
                      ]}
                      value={safeDesignSettings.typography?.header?.weight || "Bold"}
                      onChange={(value) =>
                        updateDesignSetting('typography', {
                          ...safeDesignSettings.typography,
                          header: { ...safeDesignSettings.typography?.header, weight: value },
                        })
                      }
                    />
                  </div>
                </InlineStack>

                {/* Title & Price Typography */}
                <InlineStack gap="400" align="space-between">
                  <div style={{ flex: 1 }}>
                    <TextField
                      label="Title & price Size"
                      type="number"
                      value={safeDesignSettings.typography?.titlePrice?.size || "16"}
                      onChange={(value) =>
                        updateDesignSetting('typography', {
                          ...safeDesignSettings.typography,
                          titlePrice: { ...safeDesignSettings.typography?.titlePrice, size: value },
                        })
                      }
                      autoComplete="off"
                    />
                  </div>
                  <div style={{ flex: 1 }}>
                    <Select
                      label="Weight"
                      options={[
                        { label: "Regular", value: "Regular" },
                        { label: "Bold", value: "Bold" },
                      ]}
                      value={safeDesignSettings.typography?.titlePrice?.weight || "Regular"}
                      onChange={(value) =>
                        updateDesignSetting('typography', {
                          ...safeDesignSettings.typography,
                          titlePrice: { ...safeDesignSettings.typography?.titlePrice, weight: value },
                        })
                      }
                    />
                  </div>
                </InlineStack>

                {/* Spacing Section */}
                <Text variant="headingMd" as="h3">
                  Spacing
                </Text>
                <BlockStack gap="300">
                  <InlineStack gap="400" align="space-between">
                    <div style={{ flex: 1 }}>
                      <TextField
                        label="Bundle top"
                        type="number"
                        value={safeDesignSettings.spacing?.bundleTop || '0'}
                        suffix="px"
                        onChange={(value) =>
                          updateDesignSetting('spacing', {
                            ...safeDesignSettings.spacing,
                            bundleTop: value
                          })
                        }
                        autoComplete="off"
                      />
                    </div>
                    <div style={{ flex: 1 }}>
                      <TextField
                        label="Bundle bottom"
                        type="number"
                        value={safeDesignSettings.spacing?.bundleBottom || '0'}
                        suffix="px"
                        onChange={(value) =>
                          updateDesignSetting('spacing', {
                            ...safeDesignSettings.spacing,
                            bundleBottom: value
                          })
                        }
                        autoComplete="off"
                      />
                    </div>
                  </InlineStack>

                  <InlineStack gap="400" align="space-between">
                    <div style={{ flex: 1 }}>
                      <TextField
                        label="Footer top"
                        type="number"
                        value={safeDesignSettings.spacing?.footerTop || '0'}
                        suffix="px"
                        onChange={(value) =>
                          updateDesignSetting('spacing', {
                            ...safeDesignSettings.spacing,
                            footerTop: value
                          })
                        }
                        autoComplete="off"
                      />
                    </div>
                    <div style={{ flex: 1 }}>
                      <TextField
                        label="Footer bottom"
                        type="number"
                        value={safeDesignSettings.spacing?.footerBottom || '0'}
                        suffix="px"
                        onChange={(value) =>
                          updateDesignSetting('spacing', {
                            ...safeDesignSettings.spacing,
                            footerBottom: value
                          })
                        }
                        autoComplete="off"
                      />
                    </div>
                  </InlineStack>
                </BlockStack>

                {/* Shape & Size Section */}
                <Text variant="headingMd" as="h3">
                  Shape & Size
                </Text>
                <BlockStack gap="300">
                  <Select
                    label="Bundle"
                    options={[
                      { label: "Squared", value: "Squared" },
                      { label: "Rounded", value: "Rounded" },
                    ]}
                    value={safeDesignSettings.shapes?.bundle || 'Squared'}
                    onChange={(value) =>
                      updateDesignSetting('shapes', {
                        ...safeDesignSettings.shapes,
                        bundle: value
                      })
                    }
                  />

                  <Select
                    label="Footer"
                    options={[
                      { label: "Squared", value: "Squared" },
                      { label: "Rounded", value: "Rounded" },
                    ]}
                    value={safeDesignSettings.shapes?.footer || 'Squared'}
                    onChange={(value) =>
                      updateDesignSetting('shapes', {
                        ...safeDesignSettings.shapes,
                        footer: value
                      })
                    }
                  />

                  <Select
                    label="Add to Cart"
                    options={[
                      { label: "Squared", value: "Squared" },
                      { label: "Rounded", value: "Rounded" },
                    ]}
                    value={safeDesignSettings.shapes?.addToCart || 'Squared'}
                    onChange={(value) =>
                      updateDesignSetting('shapes', {
                        ...safeDesignSettings.shapes,
                        addToCart: value
                      })
                    }
                  />

                  {/* Product Image Size Slider */}
                  <div style={{ marginTop: "12px" }}>
                    <Text>Product image size</Text>
                    <input
                      type="range"
                      min="30"
                      max="80"
                      value={safeBasicSettings.productImageSize}
                      onChange={(e) => updateBasicSetting('productImageSize', e.target.value)}
                      style={{ width: "100%" }}
                    />
                    <div style={{ textAlign: "right" }}>
                      {safeBasicSettings.productImageSize}px
                    </div>
                  </div>
                </BlockStack>

                {/* Border Thickness Section */}
                <Text variant="headingMd" as="h3">
                  Border Thickness
                </Text>
                <BlockStack gap="300">
                  <div style={{ marginTop: "12px" }}>
                    <Text>Bundle</Text>
                    <input
                      type="range"
                      min="0"
                      max="5"
                      value={safeDesignSettings.borderThickness?.bundle || 0}
                      onChange={(e) =>
                        updateDesignSetting('borderThickness', {
                          ...safeDesignSettings.borderThickness,
                          bundle: e.target.value,
                        })
                      }
                      style={{ width: "100%" }}
                    />
                    <div style={{ textAlign: "right" }}>
                      {safeDesignSettings.borderThickness?.bundle || 0}px
                    </div>
                  </div>

                  <div>
                    <Text>Footer</Text>
                    <input
                      type="range"
                      min="0"
                      max="5"
                      value={safeDesignSettings.borderThickness?.footer || 0}
                      onChange={(e) =>
                        updateDesignSetting('borderThickness', {
                          ...safeDesignSettings.borderThickness,
                          footer: e.target.value,
                        })
                      }
                      style={{ width: "100%" }}
                    />
                    <div style={{ textAlign: "right" }}>
                      {safeDesignSettings.borderThickness?.footer || 0}px
                    </div>
                  </div>

                  <div>
                    <Text>Add to Cart</Text>
                    <input
                      type="range"
                      min="0"
                      max="5"
                      value={safeDesignSettings.borderThickness?.addToCart || 0}
                      onChange={(e) =>
                        updateDesignSetting('borderThickness', {
                          ...safeDesignSettings.borderThickness,
                          addToCart: e.target.value,
                        })
                      }
                      style={{ width: "100%" }}
                    />
                    <div style={{ textAlign: "right" }}>
                      {safeDesignSettings.borderThickness?.addToCart || 0}px
                    </div>
                  </div>
                </BlockStack>
              </BlockStack>
            </BlockStack>
          )}

          {selected === 3 && (
            <BlockStack gap="400">
              <BlockStack gap="300">
                <Text variant="headingMd" as="h3">
                  Structure
                </Text>

                {/* Background Colors */}
                <InlineStack gap="400" align="space-between">
                  <div style={{ flex: 1 }}>
                    <Text>Background</Text>
                    <input
                      type="color"
                      value={safeDesignSettings.colors?.background || "#ffffff"}
                      onChange={(e) =>
                        updateDesignSetting('colors', {
                          ...safeDesignSettings.colors,
                          background: e.target.value,
                        })
                      }
                      style={{ width: "100%", height: "36px" }}
                    />
                  </div>
                  <div style={{ flex: 1 }}>
                    <Text>Border</Text>
                    <input
                      type="color"
                      value={safeDesignSettings.colors?.border || "#e1e5e9"}
                      onChange={(e) =>
                        updateDesignSetting('colors', {
                          ...safeDesignSettings.colors,
                          border: e.target.value,
                        })
                      }
                      style={{ width: "100%", height: "36px" }}
                    />
                  </div>
                </InlineStack>

                <InlineStack gap="400" align="space-between">
                  <div style={{ flex: 1 }}>
                    <Text>Footer background</Text>
                    <input
                      type="color"
                      value={safeDesignSettings.colors?.footerBackground || "#f6f6f7"}
                      onChange={(e) =>
                        updateDesignSetting('colors', {
                          ...safeDesignSettings.colors,
                          footerBackground: e.target.value,
                        })
                      }
                      style={{ width: "100%", height: "36px" }}
                    />
                  </div>
                  <div style={{ flex: 1 }}>
                    <Text>Button background</Text>
                    <input
                      type="color"
                      value={safeDesignSettings.colors?.buttonBackground || "#000000"}
                      onChange={(e) =>
                        updateDesignSetting('colors', {
                          ...safeDesignSettings.colors,
                          buttonBackground: e.target.value,
                        })
                      }
                      style={{ width: "100%", height: "36px" }}
                    />
                  </div>
                </InlineStack>

                <InlineStack gap="400" align="space-between">
                  <div style={{ flex: 1 }}>
                    <Text>Highlight background</Text>
                    <input
                      type="color"
                      value={safeDesignSettings.colors?.highlightBackground || "#ff6b35"}
                      onChange={(e) =>
                        updateDesignSetting('colors', {
                          ...safeDesignSettings.colors,
                          highlightBackground: e.target.value,
                        })
                      }
                      style={{ width: "100%", height: "36px" }}
                    />
                  </div>
                  <div style={{ flex: 1 }}>
                    <Text>Quantity background</Text>
                    <input
                      type="color"
                      value={safeDesignSettings.colors?.quantityBackground || "#f6f6f7"}
                      onChange={(e) =>
                        updateDesignSetting('colors', {
                          ...safeDesignSettings.colors,
                          quantityBackground: e.target.value,
                        })
                      }
                      style={{ width: "100%", height: "36px" }}
                    />
                  </div>
                </InlineStack>

                {/* Text Colors */}
                <Text variant="headingMd" as="h3" style={{ marginTop: "16px" }}>
                  Text
                </Text>

                <InlineStack gap="400" align="space-between">
                  <div style={{ flex: 1 }}>
                    <Text>Header</Text>
                    <input
                      type="color"
                      value={safeDesignSettings.colors?.headerText || "#000000"}
                      onChange={(e) =>
                        updateDesignSetting('colors', {
                          ...safeDesignSettings.colors,
                          headerText: e.target.value,
                        })
                      }
                      style={{ width: "100%", height: "36px" }}
                    />
                  </div>
                  <div style={{ flex: 1 }}>
                    <Text>Title</Text>
                    <input
                      type="color"
                      value={safeDesignSettings.colors?.titleText || "#000000"}
                      onChange={(e) =>
                        updateDesignSetting('colors', {
                          ...safeDesignSettings.colors,
                          titleText: e.target.value,
                        })
                      }
                      style={{ width: "100%", height: "36px" }}
                    />
                  </div>
                </InlineStack>

                <InlineStack gap="400" align="space-between">
                  <div style={{ flex: 1 }}>
                    <Text>Price</Text>
                    <input
                      type="color"
                      value={safeDesignSettings.colors?.price || "#000000"}
                      onChange={(e) =>
                        updateDesignSetting('colors', {
                          ...safeDesignSettings.colors,
                          price: e.target.value,
                        })
                      }
                      style={{ width: "100%", height: "36px" }}
                    />
                  </div>
                  <div style={{ flex: 1 }}>
                    <Text>Compared Price</Text>
                    <input
                      type="color"
                      value={safeDesignSettings.colors?.comparedPrice || "#999999"}
                      onChange={(e) =>
                        updateDesignSetting('colors', {
                          ...safeDesignSettings.colors,
                          comparedPrice: e.target.value,
                        })
                      }
                      style={{ width: "100%", height: "36px" }}
                    />
                  </div>
                </InlineStack>

                <InlineStack gap="400" align="space-between">
                  <div style={{ flex: 1 }}>
                    <Text>Highlight text</Text>
                    <input
                      type="color"
                      value={safeDesignSettings.colors?.highlightText || "#ffffff"}
                      onChange={(e) =>
                        updateDesignSetting('colors', {
                          ...safeDesignSettings.colors,
                          highlightText: e.target.value,
                        })
                      }
                      style={{ width: "100%", height: "36px" }}
                    />
                  </div>
                  <div style={{ flex: 1 }}>
                    <Text>Add to cart text</Text>
                    <input
                      type="color"
                      value={safeDesignSettings.colors?.addToCartText || "#ffffff"}
                      onChange={(e) =>
                        updateDesignSetting('colors', {
                          ...safeDesignSettings.colors,
                          addToCartText: e.target.value,
                        })
                      }
                      style={{ width: "100%", height: "36px" }}
                    />
                  </div>
                </InlineStack>

                <InlineStack gap="400" align="space-between">
                  <div style={{ flex: 1 }}>
                    <Text>Quantity text</Text>
                    <input
                      type="color"
                      value={safeDesignSettings.colors?.quantityText || "#000000"}
                      onChange={(e) =>
                        updateDesignSetting('colors', {
                          ...safeDesignSettings.colors,
                          quantityText: e.target.value,
                        })
                      }
                      style={{ width: "100%", height: "36px" }}
                    />
                  </div>
                  <div style={{ flex: 1 }}>
                    <Text>Footer text</Text>
                    <input
                      type="color"
                      value={safeDesignSettings.colors?.footerText || "#000000"}
                      onChange={(e) =>
                        updateDesignSetting('colors', {
                          ...safeDesignSettings.colors,
                          footerText: e.target.value,
                        })
                      }
                      style={{ width: "100%", height: "36px" }}
                    />
                  </div>
                </InlineStack>
              </BlockStack>
            </BlockStack>
          )}
        </div>  
      </LegacyCard>
    </>
  );
}
