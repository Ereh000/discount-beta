import { BlockStack, Card, Text, Grid, ColorPicker, Button, Popover, InlineStack } from '@shopify/polaris'; // Import Popover
import React, { useState, useCallback } from 'react'; // Import useState and useCallback

// Helper component for a single color setting with swatch and popover
function ColorSettingItem({ label, color, onChange, settingKey, openColorPickerFor, onSwatchClick, onClosePicker }) {
    const swatchStyle = {
        backgroundColor: `hsla(${color.hue}, ${color.saturation * 100}%, ${color.brightness * 100}%, ${color.alpha})`,
        width: '40px',
        height: '24px',
        border: '1px solid #ccc',
        borderRadius: '4px',
        cursor: 'pointer',
        padding: 0,
        display: 'inline-block',
        verticalAlign: 'middle',
        position: 'relative', // Needed for absolute positioning of checkerboard
        overflow: 'hidden', // Hide checkerboard overflow
    };

    // Simple checkerboard pattern for transparency
    const checkerboardStyle = {
        backgroundImage: 'url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKAQMAAAC3/F3+AAAAA1BMVEWysrKz+9lRAAAACklEQVQI12MAAgAABAABINZymAAAAABJRU5ErkJggg==")',
        backgroundSize: '10px 10px',
        width: '100%',
        height: '100%',
        position: 'absolute',
        top: 0,
        left: 0,
        zIndex: -1,
        borderRadius: '4px',
    };

    return (
        <div style={{display: 'flex', alignItems:'center', gap: '7px', lineHeight: 1.3}}>
            {/* <InlineStack blockAlign="center" gap={200}> */}
                <Popover
                    active={openColorPickerFor === settingKey}
                    activator={
                        <div style={swatchStyle} onClick={() => onSwatchClick(settingKey)}>
                            {color.alpha < 1 && <div style={checkerboardStyle}></div>}
                        </div>
                    }
                    onClose={onClosePicker}
                    preferredAlignment="left"
                >
                    <div style={{ width: '220px', padding: '1.6rem' }}>
                        <ColorPicker
                            onChange={onChange}
                            color={color}
                            allowAlpha
                        />
                    </div>
                </Popover>
                <p style={{ wordBreak: "" }}>{label}</p>
            {/* </InlineStack> */}
        </div>
    );
}


function DesignSettings() {
    // State for Background Colors
    const [backgroundColors, setBackgroundColors] = useState({
        bundle: { hue: 0, brightness: 0.9, saturation: 0, alpha: 0.5 }, // Example initial transparent grey
        border: { hue: 0, brightness: 0.5, saturation: 0, alpha: 1 }, // Example initial grey
        checkmark: { hue: 0, brightness: 0, saturation: 0, alpha: 1 }, // Example initial black
        highlight: { hue: 0, brightness: 0, saturation: 0, alpha: 1 }, // Example initial black
        selectedBundle: { hue: 0, brightness: 1, saturation: 0, alpha: 1 }, // Example initial white
        borderSelectedBundle: { hue: 0, brightness: 0, saturation: 0, alpha: 1 }, // Example initial black
        tags: { hue: 0, brightness: 0.5, saturation: 0, alpha: 0.5 }, // Example initial transparent grey
    });

    // State for Pricing Colors
    const [pricingColors, setPricingColors] = useState({
        price: { hue: 0, brightness: 0, saturation: 0, alpha: 1 }, // Example initial black
        comparedPrice: { hue: 0, brightness: 1, saturation: 1, alpha: 1 }, // Example initial red
    });

    // State for Text Colors
    const [textColors, setTextColors] = useState({
        header: { hue: 0, brightness: 0, saturation: 0, alpha: 1 }, // Example initial black
        title: { hue: 0, brightness: 0, saturation: 0, alpha: 1 }, // Example initial black
        subtitle: { hue: 0, brightness: 0.5, saturation: 0, alpha: 1 }, // Example initial grey
        highlight: { hue: 0, brightness: 1, saturation: 0, alpha: 1 }, // Example initial white
        tags: { hue: 0, brightness: 0.5, saturation: 0, alpha: 1 }, // Example initial grey
    });

    // State to track which color picker is open
    const [openColorPickerFor, setOpenColorPickerFor] = useState(null);

    // Handlers for opening/closing popovers
    const handleSwatchClick = useCallback((settingKey) => setOpenColorPickerFor(settingKey), []);
    const handleClosePicker = useCallback(() => setOpenColorPickerFor(null), []);


    // Handlers for updating colors (remain the same)
    const handleBackgroundColorChange = useCallback((setting, color) => {
        setBackgroundColors(prevColors => ({ ...prevColors, [setting]: color }));
    }, []);

    const handlePricingColorChange = useCallback((setting, color) => {
        setPricingColors(prevColors => ({ ...prevColors, [setting]: color }));
    }, []);

    const handleTextColorChange = useCallback((setting, color) => {
        setTextColors(prevColors => ({ ...prevColors, [setting]: color }));
    }, []);


    return (
        <div>
            <BlockStack gap={400}>
                <Card>


                    {/* Color Settings Card */}
                    <BlockStack gap={400}>
                        {/* Volume Discount Colors Header */}
                        <Text variant="headingMd" as="h2">Volume discount colors</Text>

                        {/* Background Colors */}
                        <BlockStack gap={200}>
                            <Text fontWeight="bold">Background</Text>
                            <Grid columns={{ xs: 1, sm: 2, md: 2, lg: 2, xl: 2 }} gap={400}>
                                <Grid.Cell>
                                    <ColorSettingItem
                                        label="Bundle"
                                        color={backgroundColors.bundle}
                                        onChange={(color) => handleBackgroundColorChange('bundle', color)}
                                        settingKey="bundleBackground"
                                        openColorPickerFor={openColorPickerFor}
                                        onSwatchClick={handleSwatchClick}
                                        onClosePicker={handleClosePicker}
                                    />
                                </Grid.Cell>
                                <Grid.Cell>
                                    <ColorSettingItem
                                        label="Border"
                                        color={backgroundColors.border}
                                        onChange={(color) => handleBackgroundColorChange('border', color)}
                                        settingKey="borderBackground"
                                        openColorPickerFor={openColorPickerFor}
                                        onSwatchClick={handleSwatchClick}
                                        onClosePicker={handleClosePicker}
                                    />
                                </Grid.Cell>
                                <Grid.Cell>
                                    <ColorSettingItem
                                        label="Checkmark"
                                        color={backgroundColors.checkmark}
                                        onChange={(color) => handleBackgroundColorChange('checkmark', color)}
                                        settingKey="checkmarkBackground"
                                        openColorPickerFor={openColorPickerFor}
                                        onSwatchClick={handleSwatchClick}
                                        onClosePicker={handleClosePicker}
                                    />
                                </Grid.Cell>
                                <Grid.Cell>
                                    <ColorSettingItem
                                        label="Highlight"
                                        color={backgroundColors.highlight}
                                        onChange={(color) => handleBackgroundColorChange('highlight', color)}
                                        settingKey="highlightBackground"
                                        openColorPickerFor={openColorPickerFor}
                                        onSwatchClick={handleSwatchClick}
                                        onClosePicker={handleClosePicker}
                                    />
                                </Grid.Cell>
                                <Grid.Cell>
                                    <ColorSettingItem
                                        label="Selected bundle"
                                        color={backgroundColors.selectedBundle}
                                        onChange={(color) => handleBackgroundColorChange('selectedBundle', color)}
                                        settingKey="selectedBundleBackground"
                                        openColorPickerFor={openColorPickerFor}
                                        onSwatchClick={handleSwatchClick}
                                        onClosePicker={handleClosePicker}
                                    />
                                </Grid.Cell>
                                <Grid.Cell>
                                    <ColorSettingItem
                                        label="Border of the selected bundle"
                                        color={backgroundColors.borderSelectedBundle}
                                        onChange={(color) => handleBackgroundColorChange('borderSelectedBundle', color)}
                                        settingKey="borderSelectedBundleBackground"
                                        openColorPickerFor={openColorPickerFor}
                                        onSwatchClick={handleSwatchClick}
                                        onClosePicker={handleClosePicker}
                                    />
                                </Grid.Cell>
                                <Grid.Cell>
                                    <ColorSettingItem
                                        label="Tags"
                                        color={backgroundColors.tags}
                                        onChange={(color) => handleBackgroundColorChange('tags', color)}
                                        settingKey="tagsBackground"
                                        openColorPickerFor={openColorPickerFor}
                                        onSwatchClick={handleSwatchClick}
                                        onClosePicker={handleClosePicker}
                                    />
                                </Grid.Cell>
                            </Grid>
                        </BlockStack>

                        {/* Pricing Colors */}
                        <BlockStack gap={200}>
                            <Text fontWeight="bold">Pricing</Text>
                            <Grid columns={{ xs: 1, sm: 2, md: 2, lg: 2, xl: 2 }} gap={400}>
                                <Grid.Cell>
                                    <ColorSettingItem
                                        label="Price"
                                        color={pricingColors.price}
                                        onChange={(color) => handlePricingColorChange('price', color)}
                                        settingKey="pricePricing"
                                        openColorPickerFor={openColorPickerFor}
                                        onSwatchClick={handleSwatchClick}
                                        onClosePicker={handleClosePicker}
                                    />
                                </Grid.Cell>
                                <Grid.Cell>
                                    <ColorSettingItem
                                        label="Compared Price"
                                        color={pricingColors.comparedPrice}
                                        onChange={(color) => handlePricingColorChange('comparedPrice', color)}
                                        settingKey="comparedPricePricing"
                                        openColorPickerFor={openColorPickerFor}
                                        onSwatchClick={handleSwatchClick}
                                        onClosePicker={handleClosePicker}
                                    />
                                </Grid.Cell>
                            </Grid>
                        </BlockStack>

                        {/* Text Colors */}
                        <BlockStack gap={200}>
                            <Text fontWeight="bold">Text</Text>
                            <Grid columns={{ xs: 1, sm: 2, md: 2, lg: 2, xl: 2 }} gap={400}>
                                <Grid.Cell>
                                    <ColorSettingItem
                                        label="Header"
                                        color={textColors.header}
                                        onChange={(color) => handleTextColorChange('header', color)}
                                        settingKey="headerText"
                                        openColorPickerFor={openColorPickerFor}
                                        onSwatchClick={handleSwatchClick}
                                        onClosePicker={handleClosePicker}
                                    />
                                </Grid.Cell>
                                <Grid.Cell>
                                    <ColorSettingItem
                                        label="Title"
                                        color={textColors.title}
                                        onChange={(color) => handleTextColorChange('title', color)}
                                        settingKey="titleText"
                                        openColorPickerFor={openColorPickerFor}
                                        onSwatchClick={handleSwatchClick}
                                        onClosePicker={handleClosePicker}
                                    />
                                </Grid.Cell>
                                <Grid.Cell>
                                    <ColorSettingItem
                                        label="Subtitle"
                                        color={textColors.subtitle}
                                        onChange={(color) => handleTextColorChange('subtitle', color)}
                                        settingKey="subtitleText"
                                        openColorPickerFor={openColorPickerFor}
                                        onSwatchClick={handleSwatchClick}
                                        onClosePicker={handleClosePicker}
                                    />
                                </Grid.Cell>
                                <Grid.Cell>
                                    <ColorSettingItem
                                        label="Highlight"
                                        color={textColors.highlight}
                                        onChange={(color) => handleTextColorChange('highlight', color)}
                                        settingKey="highlightText"
                                        openColorPickerFor={openColorPickerFor}
                                        onSwatchClick={handleSwatchClick}
                                        onClosePicker={handleClosePicker}
                                    />
                                </Grid.Cell>
                                <Grid.Cell>
                                    <ColorSettingItem
                                        label="Tags"
                                        color={textColors.tags}
                                        onChange={(color) => handleTextColorChange('tags', color)}
                                        settingKey="tagsText"
                                        openColorPickerFor={openColorPickerFor}
                                        onSwatchClick={handleSwatchClick}
                                        onClosePicker={handleClosePicker}
                                    />
                                </Grid.Cell>
                            </Grid>
                        </BlockStack>
                    </BlockStack>
                </Card>
            </BlockStack>
        </div>
    );
}

export default DesignSettings;