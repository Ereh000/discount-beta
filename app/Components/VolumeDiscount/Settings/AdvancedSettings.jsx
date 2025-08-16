import {
  BlockStack,
  Card,
  Text,
  Checkbox,
  InlineStack,
  Icon,
  Tooltip,
} from "@shopify/polaris";
import { QuestionCircleIcon } from "@shopify/polaris-icons";

function AdvancedSettings({ settings, setSettings }) {
  const handleSettingChange = (section, setting) => {
    setSettings((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [setting]: !prev[section][setting],
      },
    }));
  };

  return (
    <BlockStack gap={400}>
      <Card>
        <BlockStack gap={400}>
          {/* Pricing Section */}
          <BlockStack gap={300}>
            <Text variant="headingMd" as="h2">
              Pricing
            </Text>
            <BlockStack gap={200}>
              <Checkbox
                label="Show prices per item"
                checked={settings.pricing.showPricesPerItem}
                onChange={() =>
                  handleSettingChange("pricing", "showPricesPerItem")
                }
              />
              <InlineStack gap={200} align="start" blockAlign="center">
                <Checkbox
                  label="Show product compare-at price"
                  checked={settings.pricing.showCompareAtPrice}
                  onChange={() =>
                    handleSettingChange("pricing", "showCompareAtPrice")
                  }
                />
                <Tooltip content="Display the original price of the product before any discounts">
                  <Icon source={QuestionCircleIcon} color="base" />
                </Tooltip>
              </InlineStack>
            </BlockStack>
          </BlockStack>
        </BlockStack>
      </Card>
    </BlockStack>
  );
}

export default AdvancedSettings;
