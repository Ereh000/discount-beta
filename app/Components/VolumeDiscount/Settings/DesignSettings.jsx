import { BlockStack, Card, Text, Grid, ColorPicker, Button, Popover, InlineStack, TextField, Select } from '@shopify/polaris'; // Import TextField and Select
import React, { useState, useCallback } from 'react'; // Import useState and useCallback
import { useRef } from 'react';
import { useEffect } from 'react';

// Helper function to convert HSB/HSV (Polaris format) to RGBA
function hsvToRgba(hsvColor) {
    const { hue, saturation, brightness, alpha } = hsvColor;
    let r, g, b;
    let i = Math.floor(hue * 6);
    let f = hue * 6 - i;
    let p = brightness * (1 - saturation);
    let q = brightness * (1 - f * saturation);
    let t = brightness * (1 - (1 - f) * saturation);

    switch (i % 6) {
        case 0: r = brightness, g = t, b = p; break;
        case 1: r = q, g = brightness, b = p; break;
        case 2: r = p, g = brightness, b = t; break;
        case 3: r = p, g = q, b = brightness; break;
        case 4: r = t, g = p, b = brightness; break;
        case 5: r = brightness, g = p, b = q; break;
    }

    return {
        red: Math.round(r * 255),
        green: Math.round(g * 255),
        blue: Math.round(b * 255),
        alpha: alpha
    };
}

// Helper function to convert RGBA to HSB/HSV (Polaris format)
function rgbaToHsv(rgbaColor) {
    const { red, green, blue, alpha } = rgbaColor;
    let r = red / 255;
    let g = green / 255;
    let b = blue / 255;

    let max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h, s, v = max;

    let d = max - min;
    s = max === 0 ? 0 : d / max;

    if (max === min) {
        h = 0; // achromatic
    } else {
        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }

    return {
        hue: h * 360,
        saturation: s, // HSV saturation (0-1)
        brightness: v, // HSV value/brightness (0-1)
        alpha: alpha
    };
}


// Helper component for a single color setting with swatch and popover
// This component now expects color prop in RGBA format
function ColorSettingItem({ label, color, onChange, settingKey, openColorPickerFor, onSwatchClick, onClosePicker }) {
    // Swatch style uses RGBA
    const swatchStyle = {
        backgroundColor: `rgba(${color.red}, ${color.green}, ${color.blue}, ${color.alpha})`,
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

    // Convert RGBA color state to HSB/HSV for the ColorPicker
    const hsvColor = rgbaToHsv(color);

    // Handler for ColorPicker change - converts HSB/HSV back to RGBA before calling parent onChange
    const handleColorPickerChange = useCallback((newHsvColor) => {
        const newRgbaColor = hsvToRgba(newHsvColor);
        onChange(newRgbaColor);
    }, [onChange]);


    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '7px', lineHeight: 1.3 }}>
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
                        onChange={handleColorPickerChange} // Use the new handler
                        color={hsvColor} // Pass HSB/HSV to ColorPicker
                        allowAlpha
                    />
                </div>
            </Popover>
            <p style={{ wordBreak: "" }}>{label}</p>
            {/* </InlineStack> */}
        </div>
    );
}


function DesignSettings({ onSettingsChange }) {
    // State for Background Colors - Initialized with RGBA values
    const [backgroundColors, setBackgroundColors] = useState({
        bundle: { red: 230, green: 230, blue: 230, alpha: 0.5 }, // Example initial transparent grey (converted from HSB)
        border: { red: 128, green: 128, blue: 128, alpha: 1 }, // Example initial grey (converted from HSB)
        checkmark: { red: 0, green: 0, blue: 0, alpha: 1 }, // Example initial black (converted from HSB)
        highlight: { red: 0, green: 0, blue: 0, alpha: 1 }, // Example initial black (converted from HSB)
        selectedBundle: { red: 255, green: 255, blue: 255, alpha: 1 }, // Example initial white (converted from HSB)
        borderSelectedBundle: { red: 0, green: 0, blue: 0, alpha: 1 }, // Example initial black (converted from HSB)
        tags: { red: 128, green: 128, blue: 128, alpha: 0.5 }, // Example initial transparent grey (converted from HSB)
    });

    // State for Pricing Colors - Initialized with RGBA values
    const [pricingColors, setPricingColors] = useState({
        price: { red: 0, green: 0, blue: 0, alpha: 1 }, // Example initial black (converted from HSB)
        comparedPrice: { red: 255, green: 0, blue: 0, alpha: 1 }, // Example initial red (converted from HSB)
    });

    // State for Text Colors - Initialized with RGBA values
    const [textColors, setTextColors] = useState({
        header: { red: 0, green: 0, blue: 0, alpha: 1 }, // Example initial black (converted from HSB)
        title: { red: 0, green: 0, blue: 0, alpha: 1 }, // Example initial black (converted from HSB)
        subtitle: { red: 128, green: 128, blue: 128, alpha: 1 }, // Example initial grey (converted from HSB)
        highlight: { red: 255, green: 255, blue: 255, alpha: 1 }, // Example initial white (converted from HSB)
        tags: { red: 128, green: 128, blue: 128, alpha: 1 }, // Example initial grey (converted from HSB)
    });

    // State for Typography Settings
    const [typographySettings, setTypographySettings] = useState({
        header: { size: '16', fontStyle: 'Bold' },
        titlePrice: { size: '16', fontStyle: 'Bold' },
        subtitleComparedPrice: { size: '14', fontStyle: 'Regular' },
        tagHighlight: { size: '12', fontStyle: 'Regular' },
    });


    // State to track which color picker is open
    const [openColorPickerFor, setOpenColorPickerFor] = useState(null);

    // Handlers for opening/closing popovers
    const handleSwatchClick = useCallback((settingKey) => setOpenColorPickerFor(settingKey), []);
    const handleClosePicker = useCallback(() => setOpenColorPickerFor(null), []);


    // Handlers for updating colors - now expect RGBA values
    const handleBackgroundColorChange = useCallback((setting, color) => {
        setBackgroundColors(prevColors => ({ ...prevColors, [setting]: color }));
    }, []);

    const handlePricingColorChange = useCallback((setting, color) => {
        setPricingColors(prevColors => ({ ...prevColors, [setting]: color }));
    }, []);

    const handleTextColorChange = useCallback((setting, color) => {
        setTextColors(prevColors => ({ ...prevColors, [setting]: color }));
    }, []);

    // Handler for updating typography settings
    const handleTypographyChange = useCallback((section, setting, value) => {
        setTypographySettings(prevSettings => ({
            ...prevSettings,
            [section]: {
                ...prevSettings[section],
                [setting]: value,
            },
        }));
    }, []);


    // Options for Font Style Select
    const fontStyleOptions = [
        { label: 'Regular', value: 'Regular' },
        { label: 'Bold', value: 'Bold' },
        // Add other font styles if needed
    ];

    // Sending states to Parent
    // Use useEffect to call the parent callback whenever relevant settings change
    useEffect(() => {
        const combinedSettings = {
            backgroundColors, // These are now RGBA
            pricingColors,    // These are now RGBA
            textColors,       // These are now RGBA
            typographySettings,
        };

        // Call the parent callback with the combined settings
        if (onSettingsChange) {
            onSettingsChange(combinedSettings);
        }
    }, [backgroundColors, pricingColors, textColors, typographySettings, onSettingsChange]); // Depend on the relevant states and the callback

    return (
        <div>
            <BlockStack gap={400}>
                {/* Color Settings Card */}
                <Card>
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

                {/* Typography Settings Card */}
                <Card>
                    <BlockStack gap={200}>
                        {/* Typography Header */}
                        <Text variant="headingMd" as="h2">Typography</Text>

                        {/* Typography Settings Grid */}
                        <Grid columns={{ xs: 1, sm: 2, md: 2, lg: 2, xl: 2 }} gap={400}>
                            {/* Header Typography */}
                            <Grid.Cell>
                                <BlockStack gap={100}>
                                    <Text fontWeight="bold">Header</Text>
                                    <Grid columns={{ xs: 1, sm: 2, md: 2, lg: 2, xl: 2 }} gap={200}>
                                        <Grid.Cell>
                                            <TextField
                                                label="Size"
                                                labelHidden
                                                value={typographySettings.header.size}
                                                onChange={(value) => handleTypographyChange('header', 'size', value)}
                                                type="number"
                                                min={0}
                                                autoComplete="off"
                                            />
                                        </Grid.Cell>
                                        <Grid.Cell>
                                            <Select
                                                label="Font style"
                                                labelHidden
                                                options={fontStyleOptions}
                                                onChange={(value) => handleTypographyChange('header', 'fontStyle', value)}
                                                value={typographySettings.header.fontStyle}
                                            />
                                        </Grid.Cell>
                                    </Grid>
                                </BlockStack>
                            </Grid.Cell>

                            {/* Title & price Typography */}
                            <Grid.Cell>
                                <BlockStack gap={100}>
                                    <Text fontWeight="bold">Title & price</Text>
                                    <Grid columns={{ xs: 1, sm: 2, md: 2, lg: 2, xl: 2 }} gap={200}>
                                        <Grid.Cell>
                                            <TextField
                                                label="Size"
                                                labelHidden
                                                value={typographySettings.titlePrice.size}
                                                onChange={(value) => handleTypographyChange('titlePrice', 'size', value)}
                                                type="number"
                                                min={0}
                                                autoComplete="off"
                                            />
                                        </Grid.Cell>
                                        <Grid.Cell>
                                            <Select
                                                label="Font style"
                                                labelHidden
                                                options={fontStyleOptions}
                                                onChange={(value) => handleTypographyChange('titlePrice', 'fontStyle', value)}
                                                value={typographySettings.titlePrice.fontStyle}
                                            />
                                        </Grid.Cell>
                                    </Grid>
                                </BlockStack>
                            </Grid.Cell>

                            {/* Subtitle & compared price Typography */}
                            <Grid.Cell>
                                <BlockStack gap={100}>
                                    <Text fontWeight="bold">Subtitle & compared price</Text>
                                    <Grid columns={{ xs: 1, sm: 2, md: 2, lg: 2, xl: 2 }} gap={200}>
                                        <Grid.Cell>
                                            <TextField
                                                label="Size"
                                                labelHidden
                                                value={typographySettings.subtitleComparedPrice.size}
                                                onChange={(value) => handleTypographyChange('subtitleComparedPrice', 'size', value)}
                                                type="number"
                                                min={0}
                                                autoComplete="off"
                                            />
                                        </Grid.Cell>
                                        <Grid.Cell>
                                            <Select
                                                label="Font style"
                                                labelHidden
                                                options={fontStyleOptions}
                                                onChange={(value) => handleTypographyChange('subtitleComparedPrice', 'fontStyle', value)}
                                                value={typographySettings.subtitleComparedPrice.fontStyle}
                                            />
                                        </Grid.Cell>
                                    </Grid>
                                </BlockStack>
                            </Grid.Cell>

                            {/* Tag & Highlight Typography */}
                            <Grid.Cell>
                                <BlockStack gap={100}>
                                    <Text fontWeight="bold">Tag & Highlight</Text>
                                    <Grid columns={{ xs: 1, sm: 2, md: 2, lg: 2, xl: 2 }} gap={200}>
                                        <Grid.Cell>
                                            <TextField
                                                label="Size"
                                                labelHidden
                                                value={typographySettings.tagHighlight.size}
                                                onChange={(value) => handleTypographyChange('tagHighlight', 'size', value)}
                                                type="number"
                                                min={0}
                                                autoComplete="off"
                                            />
                                        </Grid.Cell>
                                        <Grid.Cell>
                                            <Select
                                                label="Font style"
                                                labelHidden
                                                options={fontStyleOptions}
                                                onChange={(value) => handleTypographyChange('tagHighlight', 'fontStyle', value)}
                                                value={typographySettings.tagHighlight.fontStyle}
                                            />
                                        </Grid.Cell>
                                    </Grid>
                                </BlockStack>
                            </Grid.Cell>
                        </Grid>
                    </BlockStack>
                </Card>

            </BlockStack>
        </div>
    );
}

export default DesignSettings;