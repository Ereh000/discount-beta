import { BlockStack, Card, Text, Tabs, Button, TextField, Grid, Select, RadioButton, Checkbox, Banner, Icon, Tooltip, Badge, InlineStack } from '@shopify/polaris'; // Import necessary components
import { QuestionCircleIcon, DeleteIcon, ImageIcon, GiftCardIcon, PlusCircleIcon } from '@shopify/polaris-icons'; // Import icons
import React, { useState, useCallback } from 'react'; // Import useState and useCallback

function OfferSettings() {
    // State to manage the offers
    const [offers, setOffers] = useState([
        {
            id: 'offer-1',
            title: 'Single',
            subtitle: 'Standard price',
            quantity: '1',
            image: null, // Placeholder for image
            priceType: 'default', // 'default' or 'buy_get'
            buyQuantity: '1',
            getQuantity: '1',
            highlight: false,
            selectedByDefault: true,
            tag: '',
        },
        // Add more offers here if needed
    ]);

    // State to manage the selected offer tab
    const [selectedOfferIndex, setSelectedOfferIndex] = useState(0);

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
            subtitle: '',
            quantity: '1',
            image: null,
            priceType: 'default',
            buyQuantity: '1',
            getQuantity: '1',
            highlight: false,
            selectedByDefault: false,
            tag: '',
        };
        setOffers([...offers, newOffer]);
        setSelectedOfferIndex(offers.length); // Select the new offer
    }, [offers]);

    // Handler for deleting an offer (basic implementation)
    const handleDeleteOffer = useCallback((indexToDelete) => {
        setOffers(offers.filter((_, index) => index !== indexToDelete));
        // Adjust selected index if the deleted offer was selected
        if (selectedOfferIndex === indexToDelete) {
            setSelectedOfferIndex(0); // Select the first offer
        } else if (selectedOfferIndex > indexToDelete) {
            setSelectedOfferIndex(selectedOfferIndex - 1);
        }
    }, [offers, selectedOfferIndex]);


    // Handlers for updating the settings of the currently selected offer
    const handleOfferSettingChange = useCallback((setting, value) => {
        setOffers(offers.map((offer, index) => {
            if (index === selectedOfferIndex) {
                return { ...offer, [setting]: value };
            }
            return offer;
        }));
    }, [offers, selectedOfferIndex]);

    // Options for Price Select
    const priceOptions = [
        { label: 'Default', value: 'default' },
        // Add other price options if needed
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


    return (
        <div>
            <Card>
                <BlockStack gap={400}>

                    {/* Volume Discount Header and Tabs */}
                    <BlockStack gap="200">
                        <Text variant="headingMd" as="h2">Volume Discount</Text>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginLeft: '-13px', marginBottom: '' }}>
                            <Tabs tabs={offerTabs} selected={selectedOfferIndex} onSelect={handleOfferTabChange} />
                            <Button onClick={handleAddOffer} icon={<Icon source={PlusCircleIcon} />}>Add New Offer</Button>
                        </div>
                    </BlockStack>

                    {/* Offer Settings Card */}
                    <BlockStack gap={400}>
                        <BlockStack gap={200}>
                            {/* Offer Title and Delete Button */}
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Text variant="headingMd" as="h3">Offer #{selectedOfferIndex + 1}</Text>
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
                                        onChange={(value) => handleOfferSettingChange('title', value)}
                                    // connectedRight={<Text as="span">{'{ }'}</Text>} // Placeholder for dynamic content icon
                                    />
                                </Grid.Cell>
                                <Grid.Cell columnSpan={{ xs: 12, sm: 12, md: 4, lg: 4, xl: 4 }}>
                                    <TextField
                                        label="Subtitle"
                                        value={currentOffer.subtitle}
                                        onChange={(value) => handleOfferSettingChange('subtitle', value)}
                                    // connectedRight={<Text as="span">{'{ }'}</Text>} // Placeholder for dynamic content icon
                                    />
                                </Grid.Cell>
                                <Grid.Cell columnSpan={{ xs: 12, sm: 12, md: 4, lg: 4, xl: 4 }}>
                                    <TextField
                                        label="Quantity"
                                        value={currentOffer.quantity}
                                        onChange={(value) => handleOfferSettingChange('quantity', value)}
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
                            <Text fontWeight="bold">Price <Tooltip content="This order has shipping labels"><Badge tone="warning">Important Note</Badge></Tooltip></Text> {/* Placeholder for Important Note */}
                            <BlockStack gap={200}>
                                <RadioButton
                                    label="Default"
                                    checked={currentOffer.priceType === 'default'}
                                    id="defaultPrice"
                                    name={`priceType-${selectedOfferIndex}`} // Use offer index in name for uniqueness
                                    onChange={() => handleOfferSettingChange('priceType', 'default')}
                                />
                                {currentOffer.priceType === 'default' && (
                                    <div style={{ paddingLeft: '' }}> {/* Indent the select */}
                                        <Select
                                            label=""
                                            labelHidden
                                            options={priceOptions}
                                            onChange={(value) => { /* Handle default price type selection */ }}
                                            value="default" // Assuming 'default' is the only option for now
                                        />
                                    </div>
                                )}
                                <RadioButton
                                    label={
                                        <InlineStack align="center" blockAlign="center" gap={100} direction="">
                                            <span>Buy</span>
                                            <TextField
                                                label=""
                                                labelHidden
                                                value={currentOffer.buyQuantity}
                                                onChange={(value) => handleOfferSettingChange('buyQuantity', value)}
                                                type="number"
                                                disabled={currentOffer.priceType !== 'buy_get'}
                                                min={1}
                                                max={currentOffer.quantity} // Limit buy quantity to offer quantity
                                                autoComplete="off"
                                                alignment="center"
                                                style={{ width: '50px' }} // Adjust width as needed
                                            />
                                            <span>Get</span>
                                            <TextField
                                                size="slim"
                                                label=""
                                                labelHidden
                                                value={currentOffer.getQuantity}
                                                onChange={(value) => handleOfferSettingChange('getQuantity', value)}
                                                type="number"
                                                disabled={currentOffer.priceType !== 'buy_get'}
                                                // min={1}
                                                autoComplete="off"
                                                alignment="center"
                                            />
                                        </InlineStack >
                                    }
                                    checked={currentOffer.priceType === 'buy_get'}
                                    id="buyGetPrice"
                                    name={`priceType-${selectedOfferIndex}`} // Use offer index in name for uniqueness
                                    onChange={() => handleOfferSettingChange('priceType', 'buy_get')}
                                />
                            </BlockStack>
                        </BlockStack>

                        {/* Highlight */}
                        <BlockStack gap={200}>
                            <Text fontWeight="bold">Highlight</Text>
                            <Checkbox
                                label="Highlight this offer (Optional)"
                                checked={currentOffer.highlight}
                                onChange={(value) => handleOfferSettingChange('highlight', value)}
                            />
                        </BlockStack>

                        {/* Selected by default */}
                        <BlockStack gap={200}>
                            <Checkbox
                                label="Selected by default"
                                checked={currentOffer.selectedByDefault}
                                onChange={(value) => handleOfferSettingChange('selectedByDefault', value)}
                            />
                        </BlockStack>

                        {/* Tag (Optional) */}
                        <BlockStack gap={200}>
                            <TextField
                                label="Tag(Optional)"
                                value={currentOffer.tag}
                                onChange={(value) => handleOfferSettingChange('tag', value)}
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