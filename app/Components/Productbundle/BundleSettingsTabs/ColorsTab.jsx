// Components/Productbundle/BundleSettingsTabs/ColorsTab.jsx

import {
  Text,
  InlineStack,
  BlockStack,
} from "@shopify/polaris";

export default function ColorsTab({
  designSettings,
  updateDesignSetting,
}) {
  return (
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
              value={designSettings.colors?.background || "#ffffff"}
              onChange={(e) =>
                updateDesignSetting('colors', {
                  ...designSettings.colors,
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
              value={designSettings.colors?.border || "#e1e5e9"}
              onChange={(e) =>
                updateDesignSetting('colors', {
                  ...designSettings.colors,
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
              value={designSettings.colors?.footerBackground || "#f6f6f7"}
              onChange={(e) =>
                updateDesignSetting('colors', {
                  ...designSettings.colors,
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
              value={designSettings.colors?.buttonBackground || "#000000"}
              onChange={(e) =>
                updateDesignSetting('colors', {
                  ...designSettings.colors,
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
              value={designSettings.colors?.highlightBackground || "#ff6b35"}
              onChange={(e) =>
                updateDesignSetting('colors', {
                  ...designSettings.colors,
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
              value={designSettings.colors?.quantityBackground || "#f6f6f7"}
              onChange={(e) =>
                updateDesignSetting('colors', {
                  ...designSettings.colors,
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
              value={designSettings.colors?.headerText || "#000000"}
              onChange={(e) =>
                updateDesignSetting('colors', {
                  ...designSettings.colors,
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
              value={designSettings.colors?.titleText || "#000000"}
              onChange={(e) =>
                updateDesignSetting('colors', {
                  ...designSettings.colors,
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
              value={designSettings.colors?.price || "#000000"}
              onChange={(e) =>
                updateDesignSetting('colors', {
                  ...designSettings.colors,
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
              value={designSettings.colors?.comparedPrice || "#999999"}
              onChange={(e) =>
                updateDesignSetting('colors', {
                  ...designSettings.colors,
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
              value={designSettings.colors?.highlightText || "#ffffff"}
              onChange={(e) =>
                updateDesignSetting('colors', {
                  ...designSettings.colors,
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
              value={designSettings.colors?.addToCartText || "#ffffff"}
              onChange={(e) =>
                updateDesignSetting('colors', {
                  ...designSettings.colors,
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
              value={designSettings.colors?.quantityText || "#000000"}
              onChange={(e) =>
                updateDesignSetting('colors', {
                  ...designSettings.colors,
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
              value={designSettings.colors?.footerText || "#000000"}
              onChange={(e) =>
                updateDesignSetting('colors', {
                  ...designSettings.colors,
                  footerText: e.target.value,
                })
              }
              style={{ width: "100%", height: "36px" }}
            />
          </div>
        </InlineStack>
      </BlockStack>
    </BlockStack>
  );
}
