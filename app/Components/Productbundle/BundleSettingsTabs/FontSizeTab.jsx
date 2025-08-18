// Components/Productbundle/BundleSettingsTabs/FontSizeTab.jsx

import {
  TextField,
  Select,
  Text,
  InlineStack,
  BlockStack,
} from "@shopify/polaris";

export default function FontSizeTab({
  basicSettings,
  updateBasicSetting,
  designSettings,
  updateDesignSetting,
}) {
  return (
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
              value={designSettings.typography?.header?.size || "18"}
              onChange={(value) =>
                updateDesignSetting('typography', {
                  ...designSettings.typography,
                  header: { ...designSettings.typography?.header, size: value },
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
              value={designSettings.typography?.header?.weight || "Bold"}
              onChange={(value) =>
                updateDesignSetting('typography', {
                  ...designSettings.typography,
                  header: { ...designSettings.typography?.header, weight: value },
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
              value={designSettings.typography?.titlePrice?.size || "16"}
              onChange={(value) =>
                updateDesignSetting('typography', {
                  ...designSettings.typography,
                  titlePrice: { ...designSettings.typography?.titlePrice, size: value },
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
              value={designSettings.typography?.titlePrice?.weight || "Regular"}
              onChange={(value) =>
                updateDesignSetting('typography', {
                  ...designSettings.typography,
                  titlePrice: { ...designSettings.typography?.titlePrice, weight: value },
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
                value={designSettings.spacing?.bundleTop || '0'}
                suffix="px"
                onChange={(value) =>
                  updateDesignSetting('spacing', {
                    ...designSettings.spacing,
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
                value={designSettings.spacing?.bundleBottom || '0'}
                suffix="px"
                onChange={(value) =>
                  updateDesignSetting('spacing', {
                    ...designSettings.spacing,
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
                value={designSettings.spacing?.footerTop || '0'}
                suffix="px"
                onChange={(value) =>
                  updateDesignSetting('spacing', {
                    ...designSettings.spacing,
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
                value={designSettings.spacing?.footerBottom || '0'}
                suffix="px"
                onChange={(value) =>
                  updateDesignSetting('spacing', {
                    ...designSettings.spacing,
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
            value={designSettings.shapes?.bundle || 'Squared'}
            onChange={(value) =>
              updateDesignSetting('shapes', {
                ...designSettings.shapes,
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
            value={designSettings.shapes?.footer || 'Squared'}
            onChange={(value) =>
              updateDesignSetting('shapes', {
                ...designSettings.shapes,
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
            value={designSettings.shapes?.addToCart || 'Squared'}
            onChange={(value) =>
              updateDesignSetting('shapes', {
                ...designSettings.shapes,
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
              value={basicSettings.productImageSize}
              onChange={(e) => updateBasicSetting('productImageSize', e.target.value)}
              style={{ width: "100%" }}
            />
            <div style={{ textAlign: "right" }}>
              {basicSettings.productImageSize}px
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
              value={designSettings.borderThickness?.bundle || 0}
              onChange={(e) =>
                updateDesignSetting('borderThickness', {
                  ...designSettings.borderThickness,
                  bundle: e.target.value,
                })
              }
              style={{ width: "100%" }}
            />
            <div style={{ textAlign: "right" }}>
              {designSettings.borderThickness?.bundle || 0}px
            </div>
          </div>

          <div>
            <Text>Footer</Text>
            <input
              type="range"
              min="0"
              max="5"
              value={designSettings.borderThickness?.footer || 0}
              onChange={(e) =>
                updateDesignSetting('borderThickness', {
                  ...designSettings.borderThickness,
                  footer: e.target.value,
                })
              }
              style={{ width: "100%" }}
            />
            <div style={{ textAlign: "right" }}>
              {designSettings.borderThickness?.footer || 0}px
            </div>
          </div>

          <div>
            <Text>Add to Cart</Text>
            <input
              type="range"
              min="0"
              max="5"
              value={designSettings.borderThickness?.addToCart || 0}
              onChange={(e) =>
                updateDesignSetting('borderThickness', {
                  ...designSettings.borderThickness,
                  addToCart: e.target.value,
                })
              }
              style={{ width: "100%" }}
            />
            <div style={{ textAlign: "right" }}>
              {designSettings.borderThickness?.addToCart || 0}px
            </div>
          </div>
        </BlockStack>
      </BlockStack>
    </BlockStack>
  );
}
