import { BlockStack, Card, Text, Checkbox, InlineStack, Icon, Tooltip } from '@shopify/polaris';
import { QuestionCircleIcon } from '@shopify/polaris-icons';
import React, { useState } from 'react';

function AdvancedSettings({ settings, setSettings }) {

    const handleSettingChange = (section, setting) => {
        setSettings(prev => ({
            ...prev,
            [section]: {
                ...prev[section],
                [setting]: !prev[section][setting]
            }
        }));
    }; 

    return (
        <BlockStack gap={400}>
            <Card>
                <BlockStack gap={400}>
                    {/* Variants Section */}
                    <BlockStack gap={300}>
                        <Text variant="headingMd" as="h2">Variants</Text>
                        <BlockStack gap={200}>
                            <Checkbox
                                label="Let customers choose different variants for each item"
                                checked={settings.variants.allowCustomerChoice}
                                onChange={() => handleSettingChange('variants', 'allowCustomerChoice')}
                            />
                            <Checkbox
                                label="Hide theme variant & quantity selector"
                                checked={settings.variants.hideThemeVariant}
                                onChange={() => handleSettingChange('variants', 'hideThemeVariant')}
                            />
                            <Checkbox
                                label="Hide variants when out of stock"
                                checked={settings.variants.hideOutOfStock}
                                onChange={() => handleSettingChange('variants', 'hideOutOfStock')}
                            />
                            <Checkbox
                                label="Hide theme price"
                                checked={settings.variants.hideThemePrice}
                                onChange={() => handleSettingChange('variants', 'hideThemePrice')}
                            />
                        </BlockStack>
                    </BlockStack>

                    {/* Pricing Section */}
                    <BlockStack gap={300}>
                        <Text variant="headingMd" as="h2">Pricing</Text>
                        <BlockStack gap={200}>
                            <Checkbox
                                label="Show prices per item"
                                checked={settings.pricing.showPricesPerItem}
                                onChange={() => handleSettingChange('pricing', 'showPricesPerItem')}
                            />
                            <InlineStack gap={200} align="start" blockAlign='center'>
                                <Checkbox
                                    label="Show product compare-at price"
                                    checked={settings.pricing.showCompareAtPrice}
                                    onChange={() => handleSettingChange('pricing', 'showCompareAtPrice')}
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