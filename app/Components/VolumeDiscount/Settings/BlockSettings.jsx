import { BlockStack, Card, Checkbox, Grid, RadioButton, RangeSlider, Select, Text, TextField } from '@shopify/polaris'
import React from 'react'
import { useCallback } from 'react';
import { useState } from 'react'

function BlockSettings({ onSendData }) {

    // Bundle Name

    const [bundleName, setBundleName] = useState('Bundle 1')

    // Visibility Settings

    const [visibility, setVisibility] = useState('all_products'); // State for visibility
    const handleVisibilityChange = useCallback((value) => setVisibility(value), []); // Handler for visibility change
    const visibilityOptions = [ // Options for visibility select
        { label: 'All products', value: 'all_products' },
        { label: 'Specific products', value: 'specific_products' },
        { label: 'Specific collections', value: 'specific_collections' },
    ];

    // Header Settings

    const [headerText, setHeaderText] = useState('Choose your offer'); // State for header text
    const handleHeaderTextChange = useCallback((value) => setHeaderText(value), []); // Handler for header text change

    const [alignment, setAlignment] = useState('center'); // State for alignment
    const handleAlignmentChange = useCallback((value) => setAlignment(value), []); // Handler for alignment change
    const alignmentOptions = [ // Options for alignment select
        { label: 'Left', value: 'left' },
        { label: 'Center', value: 'center' },
        { label: 'Right', value: 'right' },
    ];

    const [headerLine, setHeaderLine] = useState(true); // State for header line checkbox
    const handleHeaderLineChange = useCallback((value) => setHeaderLine(value), []); // Handler for header line change

    const [lineThickness, setLineThickness] = useState(2); // State for line thickness slider
    const handleLineThicknessChange = useCallback((value) => setLineThickness(value), []); // Handler for line thickness change


    // Shape Settings 

    const [blockRadius, setBlockRadius] = useState(12); // State for block radius
    const handleBlockRadiusChange = useCallback((value) => setBlockRadius(value), []); // Handler for block radius change

    const [blockThickness, setBlockThickness] = useState(2); // State for block thickness
    const handleBlockThicknessChange = useCallback((value) => setBlockThickness(value), []); // Handler for block thickness change

    const [spacingTop, setSpacingTop] = useState(10); // State for spacing top
    const handleSpacingTopChange = useCallback((value) => setSpacingTop(value), []); // Handler for spacing top change

    const [spacingBottom, setSpacingBottom] = useState(10); // State for spacing bottom
    const handleSpacingBottomChange = useCallback((value) => setSpacingBottom(value), []); // Handler for spacing bottom change

    const [checkmarkVisibility, setCheckmarkVisibility] = useState('show'); // State for checkmark visibility
    const handleCheckmarkVisibilityChange = useCallback((_checked, value) => setCheckmarkVisibility(value), []); // Handler for checkmark visibility change

    // All Settings in one object
    const allSettings = {
        bundleName,
        visibility,
        headerText,
        alignment,
        headerLine,
        lineThickness,
        blockRadius,
        blockThickness,
        spacingTop,
        spacingBottom,
        checkmarkVisibility,
    };

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
                        value={visibility}
                    />
                </Card>

                {/* Header Settings */}
                <Card>
                    <BlockStack gap={400}> {/* Use BlockStack for vertical spacing within the card */}
                        <Grid> {/* Use Grid for horizontal layout */}
                            <Grid.Cell columnSpan={{ xs: 6, sm: 6, md: 6, lg: 6, xl: 6 }}> {/* Adjust column span as needed */}
                                <TextField
                                    label="Header Text"
                                    value={headerText}
                                    onChange={handleHeaderTextChange}
                                />
                            </Grid.Cell>
                            <Grid.Cell columnSpan={{ xs: 6, sm: 6, md: 6, lg: 6, xl: 6 }}> {/* Adjust column span as needed */}
                                <Select
                                    label="Alignment"
                                    options={alignmentOptions}
                                    onChange={handleAlignmentChange}
                                    value={alignment}
                                />
                            </Grid.Cell>
                        </Grid>
                        <BlockStack gap={200}>
                            <Text fontWeight="bold">Header line</Text>
                            <Checkbox
                                label="Add a line to the header title"
                                checked={headerLine}
                                onChange={handleHeaderLineChange}
                            />
                        </BlockStack>
                        {headerLine && ( // Conditionally render line thickness if header line is checked
                            <RangeSlider
                                label="Line thickness"
                                value={lineThickness}
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
                                        value={blockRadius}
                                        onChange={handleBlockRadiusChange}
                                        min={0}
                                        max={20} // Adjust max value as needed
                                        output
                                    />
                                </Grid.Cell>
                                <Grid.Cell columnSpan={{ xs: 6, sm: 6, md: 6, lg: 6, xl: 6 }}>
                                    <RangeSlider
                                        label="Block Thickness"
                                        value={blockThickness}
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
                                        value={spacingTop}
                                        onChange={handleSpacingTopChange}
                                        min={0}
                                        max={30} // Adjust max value as needed
                                        output
                                    />
                                </Grid.Cell>
                                <Grid.Cell columnSpan={{ xs: 6, sm: 6, md: 6, lg: 6, xl: 6 }}>
                                    <RangeSlider
                                        label="Bottom"
                                        value={spacingBottom}
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
                                    checked={checkmarkVisibility === 'show'}
                                    id="showRadio"
                                    name="checkmarkVisibility"
                                    onChange={handleCheckmarkVisibilityChange}
                                    value="show"
                                />
                                <RadioButton
                                    label="Hide radio"
                                    checked={checkmarkVisibility === 'hide'}
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
