import { BlockStack, Card, Checkbox, Grid, RadioButton, RangeSlider, Select, Text, TextField } from '@shopify/polaris'
import React from 'react'
import { useCallback } from 'react';
import { useState } from 'react'

function BlockSettings() {

    // Bundle Name
    const [bundleName, setBundleName] = useState('Bundle 1')

    // Refactored State Objects
    const [visibilitySettings, setVisibilitySettings] = useState({
        visibility: 'all_products',
    });

    const [headerSettings, setHeaderSettings] = useState({
        headerText: 'Choose your offer',
        alignment: 'center',
        headerLine: true,
        lineThickness: 2,
    });

    const [shapeSettings, setShapeSettings] = useState({
        blockRadius: 12,
        blockThickness: 2,
    });

    const [spacingSettings, setSpacingSettings] = useState({
        spacingTop: 10,
        spacingBottom: 10,
    });

    const [checkmarkSettings, setCheckmarkSettings] = useState({
        checkmarkVisibility: 'show',
    });


    // Handlers updated to modify state objects
    const handleVisibilityChange = useCallback((value) => {
        setVisibilitySettings(prevSettings => ({ ...prevSettings, visibility: value }));
    }, []);

    const handleHeaderTextChange = useCallback((value) => {
        setHeaderSettings(prevSettings => ({ ...prevSettings, headerText: value })); 
    }, []);

    const handleAlignmentChange = useCallback((value) => {
        setHeaderSettings(prevSettings => ({ ...prevSettings, alignment: value }));
    }, []);

    const handleHeaderLineChange = useCallback((value) => {
        setHeaderSettings(prevSettings => ({ ...prevSettings, headerLine: value }));
    }, []);

    const handleLineThicknessChange = useCallback((value) => {
        setHeaderSettings(prevSettings => ({ ...prevSettings, lineThickness: value }));
    }, []);

    const handleBlockRadiusChange = useCallback((value) => {
        setShapeSettings(prevSettings => ({ ...prevSettings, blockRadius: value }));
    }, []);

    const handleBlockThicknessChange = useCallback((value) => {
        setShapeSettings(prevSettings => ({ ...prevSettings, blockThickness: value }));
    }, []);

    const handleSpacingTopChange = useCallback((value) => {
        setSpacingSettings(prevSettings => ({ ...prevSettings, spacingTop: value }));
    }, []);

    const handleSpacingBottomChange = useCallback((value) => {
        setSpacingSettings(prevSettings => ({ ...prevSettings, spacingBottom: value }));
    }, []);

    const handleCheckmarkVisibilityChange = useCallback((_checked, value) => {
        setCheckmarkSettings(prevSettings => ({ ...prevSettings, checkmarkVisibility: value }));
    }, []);


    // Options remain the same
    const visibilityOptions = [
        { label: 'All products', value: 'all_products' },
        { label: 'Specific products', value: 'specific_products' },
        { label: 'Specific collections', value: 'specific_collections' },
    ];

    const alignmentOptions = [
        { label: 'Left', value: 'left' },
        { label: 'Center', value: 'center' },
        { label: 'Right', value: 'right' },
    ];

    // All Settings in one object (combining the state objects)
    const allBlockSettings = {
        bundleName,
        ...visibilitySettings,
        ...headerSettings,
        ...shapeSettings,
        ...spacingSettings,
        ...checkmarkSettings,
    };
    // console.log("allBlockSettings:", allBlockSettings);

    return (
        <div>
            <BlockStack gap={200}>
                {/* Bundle Name */}
                <Card>
                    <TextField
                        label="Bundle Name" // Label is handled by the Text component above
                        value={bundleName}
                        onChange={(value) => setBundleName(value)}
                    />
                </Card>
                {/* Visiblity */}
                <Card>
                    <Select
                        label="Visibility" // Label is handled by the Text component above
                        options={visibilityOptions}
                        onChange={handleVisibilityChange}
                        value={visibilitySettings.visibility} // Read from state object
                    />
                </Card>

                {/* Header Settings */}
                <Card>
                    <BlockStack gap={400}> {/* Use BlockStack for vertical spacing within the card */}
                        <Grid> {/* Use Grid for horizontal layout */}
                            <Grid.Cell columnSpan={{ xs: 6, sm: 6, md: 6, lg: 6, xl: 6 }}> {/* Adjust column span as needed */}
                                <TextField
                                    label="Header Text"
                                    value={headerSettings.headerText} // Read from state object
                                    onChange={handleHeaderTextChange}
                                />
                            </Grid.Cell>
                            <Grid.Cell columnSpan={{ xs: 6, sm: 6, md: 6, lg: 6, xl: 6 }}> {/* Adjust column span as needed */}
                                <Select
                                    label="Alignment"
                                    options={alignmentOptions}
                                    onChange={handleAlignmentChange}
                                    value={headerSettings.alignment} // Read from state object
                                />
                            </Grid.Cell>
                        </Grid>
                        <BlockStack gap={200}>
                            <Text fontWeight="bold">Header line</Text>
                            <Checkbox
                                label="Add a line to the header title"
                                checked={headerSettings.headerLine} // Read from state object
                                onChange={handleHeaderLineChange}
                            />
                        </BlockStack>
                        {headerSettings.headerLine && ( // Conditionally render based on state object
                            <RangeSlider
                                label="Line thickness"
                                value={headerSettings.lineThickness} // Read from state object
                                onChange={handleLineThicknessChange}
                                min={0}
                                max={10} // Adjust max value as needed
                                output
                            />
                        )}
                    </BlockStack>
                </Card>

                {/* Shape, Spacing, and Checkmark Settings */}
                <Card>
                    <BlockStack gap={400}>
                        {/* Shape */}
                        <BlockStack gap={200}>
                            <Text fontWeight="bold">Shape</Text>
                            <Grid>
                                <Grid.Cell columnSpan={{ xs: 6, sm: 6, md: 6, lg: 6, xl: 6 }}>
                                    <RangeSlider
                                        label="Block radius"
                                        value={shapeSettings.blockRadius} // Read from state object
                                        onChange={handleBlockRadiusChange}
                                        min={0}
                                        max={20} // Adjust max value as needed
                                        output
                                    />
                                </Grid.Cell>
                                <Grid.Cell columnSpan={{ xs: 6, sm: 6, md: 6, lg: 6, xl: 6 }}>
                                    <RangeSlider
                                        label="Block Thickness"
                                        value={shapeSettings.blockThickness} // Read from state object
                                        onChange={handleBlockThicknessChange}
                                        min={0}
                                        max={10} // Adjust max value as needed
                                        output
                                    />
                                </Grid.Cell>
                            </Grid>
                        </BlockStack>

                        {/* Spacing */}
                        <BlockStack gap={200}>
                            <Text fontWeight="bold">Spacing</Text>
                            <Grid>
                                <Grid.Cell columnSpan={{ xs: 6, sm: 6, md: 6, lg: 6, xl: 6 }}>
                                    <RangeSlider
                                        label="Top"
                                        value={spacingSettings.spacingTop} // Read from state object
                                        onChange={handleSpacingTopChange}
                                        min={0}
                                        max={30} // Adjust max value as needed
                                        output
                                    />
                                </Grid.Cell>
                                <Grid.Cell columnSpan={{ xs: 6, sm: 6, md: 6, lg: 6, xl: 6 }}>
                                    <RangeSlider
                                        label="Bottom"
                                        value={spacingSettings.spacingBottom} // Read from state object
                                        onChange={handleSpacingBottomChange}
                                        min={0}
                                        max={30} // Adjust max value as needed
                                        output
                                    />
                                </Grid.Cell>
                            </Grid>
                        </BlockStack>

                        {/* Checkmark */}
                        <BlockStack gap={200}>
                            <Text fontWeight="bold">Checkmark</Text>
                            <BlockStack gap={200} direction="horizontal"> {/* Use horizontal BlockStack for radio buttons */}
                                <RadioButton
                                    label="Show radio"
                                    checked={checkmarkSettings.checkmarkVisibility === 'show'} // Read from state object
                                    id="showRadio"
                                    name="checkmarkVisibility"
                                    onChange={handleCheckmarkVisibilityChange}
                                    value="show"
                                />
                                <RadioButton
                                    label="Hide radio"
                                    checked={checkmarkSettings.checkmarkVisibility === 'hide'} // Read from state object
                                    id="hideRadio"
                                    name="checkmarkVisibility"
                                    onChange={handleCheckmarkVisibilityChange}
                                    value="hide"
                                />
                            </BlockStack>
                        </BlockStack>
                    </BlockStack>
                </Card>

            </BlockStack>
        </div>
    )
}

export default BlockSettings