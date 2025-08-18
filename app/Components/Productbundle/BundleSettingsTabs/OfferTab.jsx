// Components/Productbundle/BundleSettingsTabs/OfferTab.jsx

import {
  Card,
  TextField,
  Select,
  RadioButton,
  Text,
  Button,
  InlineStack,
  BlockStack,
  Icon,
} from "@shopify/polaris";
import { DeleteIcon, ImageAddIcon } from "@shopify/polaris-icons";

export default function OfferTab({
  products,
  handleProductUpdate,
  handleAddProduct,
  handleRemoveProduct,
  pricingSettings,
  updatePricingSetting,
  highlightSettings,
  updateHighlightSetting,
}) {
  const handlePricingOptionChange = (_, value) => updatePricingSetting('option', value);
  const handleHighlightOptionChange = (_, value) => updateHighlightSetting('option', value);

  return (
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
          checked={pricingSettings.option === "default"}
          id="default"
          name="pricingOption"
          onChange={handlePricingOptionChange}
        />

        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <RadioButton
            label="Discount value in %"
            checked={pricingSettings.option === "percentage"}
            id="percentage"
            name="pricingOption"
            onChange={handlePricingOptionChange}
          />
          {pricingSettings.option === "percentage" && (
            <Text variant="bodyMd" as="span" tone="subdued">
              (example: 10% off)
            </Text>
          )}
        </div>
        {pricingSettings.option === "percentage" && (
          <div style={{ marginLeft: "28px", marginTop: "4px" }}>
            <TextField
              label="Discount percentage"
              labelHidden
              type="number"
              suffix="%"
              value={pricingSettings.discountPercentage}
              onChange={(value) => updatePricingSetting('discountPercentage', value)}
              autoComplete="off"
            />
          </div>
        )}

        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <RadioButton
            label="Fixed discount $ per item"
            checked={pricingSettings.option === "fixedDiscount"}
            id="fixedDiscount"
            name="pricingOption"
            onChange={handlePricingOptionChange}
          />
          {pricingSettings.option === "fixedDiscount" && (
            <Text variant="bodyMd" as="span" tone="subdued">
              (example: 25$ off)
            </Text>
          )}
        </div>
        {pricingSettings.option === "fixedDiscount" && (
          <div style={{ marginLeft: "28px", marginTop: "4px" }}>
            <TextField
              label="Fixed discount amount"
              labelHidden
              type="number"
              prefix="$"
              value={pricingSettings.fixedDiscount}
              onChange={(value) => updatePricingSetting('fixedDiscount', value)}
              autoComplete="off"
            />
          </div>
        )}

        <RadioButton
          label="Fixed price for the bundle"
          checked={pricingSettings.option === "fixedPrice"}
          id="fixedPrice"
          name="pricingOption"
          onChange={handlePricingOptionChange}
        />
        {pricingSettings.option === "fixedPrice" && (
          <div style={{ marginLeft: "28px", marginTop: "4px" }}>
            <TextField
              label="Fixed bundle price"
              labelHidden
              type="number"
              prefix="$"
              value={pricingSettings.fixedPrice}
              onChange={(value) => updatePricingSetting('fixedPrice', value)}
              autoComplete="off"
            />
          </div>
        )}
      </BlockStack>

      {/* Highlight Settings */}
      <BlockStack gap="300">
        <Text variant="headingMd" as="h3">
          Highlight
        </Text>

        <BlockStack>
          <RadioButton
            label="Text"
            checked={highlightSettings.option === "text"}
            id="text"
            name="highlightOption"
            onChange={handleHighlightOptionChange}
          />

          <RadioButton
            label="Timer"
            checked={highlightSettings.option === "timer"}
            id="timer"
            name="highlightOption"
            onChange={handleHighlightOptionChange}
          />

          {highlightSettings.option === "text" && (
            <div style={{ marginLeft: "28px", marginTop: "4px" }}>
              <TextField
                label="Title"
                value={highlightSettings.title}
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
                  checked={highlightSettings.isBlinking}
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
                  value={highlightSettings.style}
                />
              </div>
            </div>
          )}

          {highlightSettings.option === "timer" && (
            <div style={{ marginLeft: "28px", marginTop: "4px" }}>
              <TextField
                label="Title"
                value={highlightSettings.timerTitle}
                onChange={(value) => updateHighlightSetting('timerTitle', value)}
                autoComplete="off"
              />

              <TextField
                label="End date"
                type="datetime-local"
                value={highlightSettings.timerEndDate}
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
                  value={highlightSettings.timerFormat}
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
                  value={highlightSettings.style}
                />
              </div>
            </div>
          )}
        </BlockStack>
      </BlockStack>
    </BlockStack>
  );
}
