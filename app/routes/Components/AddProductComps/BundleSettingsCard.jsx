// bundle-setting-card.jsx

import {
    Card,
    Tabs,
    TextField,
    Select,
    RadioButton,
    Text,
    BlockStack,
    InlineStack,
    Button,
} from '@shopify/polaris'
import React, { useState, useCallback, useEffect } from 'react'
import {
    DeleteIcon
} from '@shopify/polaris-icons';

// Bundle Settings Card Component
export default function BundleSettingsCard({
    bundleName, setBundleName,
    headerText, setHeaderText,
    alignment, setAlignment,
    footerText, setFooterText,
    buttonText, setButtonText,
    position, setPosition,
    publishOption, setPublishOption,
    selectedTemplate, setSelectedTemplate,
    selectedColor, setSelectedColor,
    settings, handleSettingChange,
    // Pricing options
    pricingOption, setPricingOption,
    discountPercentage, setDiscountPercentage,
    fixedDiscount, setFixedDiscount,
    fixedPrice, setFixedPrice,
    // Highlight options
    highlightOption, setHighlightOption,
    highlightTitle, setHighlightTitle,
    highlightTimerTitle, setHighlightTimerTitle,
    isBlinking, setIsBlinking,
    highlightStyle, setHighlightStyle,
    timerEndDate, setTimerEndDate,
    timerFormat, setTimerFormat,
    // Products
    products, setProducts, handleAddProduct, handleRemoveProduct, handleProductNameChange, handleProductQuantityChange,
    // Fonts and sizes
    typography, setTypography,
    spacing, setSpacing,
    shapes, setShapes,
    productImageSize, setProductImageSize,
    iconStyle, setIconStyle,
    borderThickness, setBorderThickness,
    // Colors
    colors, setColors,
}) {
    const [selected, setSelected] = useState(0);

    // Existing handlers
    const handleTabChange = useCallback(
        (selectedTabIndex) => setSelected(selectedTabIndex),
        [],
    );

    // Handler for pricing option changes
    const handlePricingOptionChange = useCallback(
        (_, value) => setPricingOption(value),
        [setPricingOption],
    );

    // Handler for highlight option changes
    const handleHighlightOptionChange = useCallback(
        (_, value) => setHighlightOption(value),
        [setHighlightOption],
    );

    // Handler for template changes
    const handleTemplateChange = useCallback(
        (value) => setSelectedTemplate(value),
        [setSelectedTemplate],
    );

    const tabs = [
        {
            id: 'block',
            content: 'Block',
        },
        {
            id: 'offer',
            content: 'Offer',
        },
        {
            id: 'font-size',
            content: 'Font & size',
        },
        {
            id: 'colors',
            content: 'Colors',
        },
    ];

    const alignmentOptions = [
        { label: 'Left', value: 'left' },
        { label: 'Center', value: 'center' },
        { label: 'Right', value: 'right' },
    ];

    const handlePositionChange = useCallback(
        (_, value) => setPosition(value),
        [],
    );

    const handlePublishChange = useCallback(
        (_, value) => setPublishOption(value),
        [],
    );

    return (
        <Card>
            <Tabs tabs={tabs} selected={selected} onSelect={handleTabChange} />

            <div style={{ padding: '16px' }}>
                {selected === 0 && (
                    <BlockStack gap="400">
                        <TextField
                            label="Bundle name"
                            value={bundleName}
                            onChange={setBundleName}
                            autoComplete="off"
                        />

                        <InlineStack gap="400" align="space-between">
                            <div style={{ flex: 1 }}>
                                <TextField
                                    label="Header text"
                                    value={headerText}
                                    onChange={setHeaderText}
                                    autoComplete="off"
                                    helpText="(optional)"
                                />
                            </div>
                            <div style={{ flex: 1 }}>
                                <Select
                                    label="Alignment"
                                    options={alignmentOptions}
                                    onChange={setAlignment}
                                    value={alignment}
                                />
                            </div>
                        </InlineStack>

                        <InlineStack gap="400" align="space-between">
                            <div style={{ flex: 1 }}>
                                <TextField
                                    label="Footer text"
                                    value={footerText}
                                    onChange={setFooterText}
                                    autoComplete="off"
                                />
                            </div>
                            <div style={{ flex: 1 }}>
                                <TextField
                                    label="Button text"
                                    value={buttonText}
                                    onChange={setButtonText}
                                    autoComplete="off"
                                />
                            </div>
                        </InlineStack>

                        <BlockStack gap="100">
                            <Text variant="headingMd" as="h3">Position</Text>
                            <RadioButton
                                label="All products"
                                checked={position === 'all'}
                                id="all"
                                name="position"
                                onChange={handlePositionChange}
                            />
                            <RadioButton
                                label="All products except selected"
                                checked={position === 'except'}
                                id="except"
                                name="position"
                                onChange={handlePositionChange}
                            />
                            <RadioButton
                                label="Specific products"
                                checked={position === 'specific'}
                                id="specific"
                                name="position"
                                onChange={handlePositionChange}
                            />
                            <RadioButton
                                label="Specific collections"
                                checked={position === 'collections'}
                                id="collections"
                                name="position"
                                onChange={handlePositionChange}
                            />
                        </BlockStack>

                        <BlockStack gap="300">
                            <Text variant="headingMd" as="h3">Publish Bundle</Text>
                            <RadioButton
                                label="Immediately"
                                checked={publishOption === 'immediately'}
                                id="immediately"
                                name="publish"
                                onChange={handlePublishChange}
                            />
                            <RadioButton
                                label="Schedule"
                                checked={publishOption === 'schedule'}
                                id="schedule"
                                name="publish"
                                onChange={handlePublishChange}
                            />
                        </BlockStack>

                        {/* Template selection section */}
                        <BlockStack gap="300">
                            <Text variant="headingMd" as="h3">Template</Text>

                            {/* Color selector with color swatches */}
                            <div className='color__selector' style={{
                                background: 'white',
                                zIndex: '10'
                            }}>
                                <Select
                                    label="Color"
                                    labelHidden
                                    options={[
                                        {
                                            label: <span style={{ display: 'flex', alignItems: 'center' }}>
                                                <span style={{
                                                    display: 'inline-block',
                                                    width: '16px',
                                                    height: '16px',
                                                    backgroundColor: 'black',
                                                    borderRadius: '50%',
                                                    marginRight: '8px'
                                                }}></span>
                                                Black
                                            </span>,
                                            value: 'black'
                                        },
                                        {
                                            label: <span style={{ display: 'flex', alignItems: 'center' }}>
                                                <span style={{
                                                    display: 'inline-block',
                                                    width: '16px',
                                                    height: '16px',
                                                    backgroundColor: 'purple',
                                                    borderRadius: '50%',
                                                    marginRight: '8px'
                                                }}></span>
                                                Purple
                                            </span>,
                                            value: 'purple'
                                        },
                                        {
                                            label: <span style={{ display: 'flex', alignItems: 'center' }}>
                                                <span style={{
                                                    display: 'inline-block',
                                                    width: '16px',
                                                    height: '16px',
                                                    backgroundColor: 'blue',
                                                    borderRadius: '50%',
                                                    marginRight: '8px'
                                                }}></span>
                                                Blue
                                            </span>,
                                            value: 'blue'
                                        },
                                        {
                                            label: <span style={{ display: 'flex', alignItems: 'center' }}>
                                                <span style={{
                                                    display: 'inline-block',
                                                    width: '16px',
                                                    height: '16px',
                                                    backgroundColor: 'teal',
                                                    borderRadius: '50%',
                                                    marginRight: '8px'
                                                }}></span>
                                                Teal
                                            </span>,
                                            value: 'teal'
                                        },
                                        {
                                            label: <span style={{ display: 'flex', alignItems: 'center' }}>
                                                <span style={{
                                                    display: 'inline-block',
                                                    width: '16px',
                                                    height: '16px',
                                                    backgroundColor: 'green',
                                                    borderRadius: '50%',
                                                    marginRight: '8px'
                                                }}></span>
                                                Green
                                            </span>,
                                            value: 'green'
                                        },
                                        {
                                            label: <span style={{ display: 'flex', alignItems: 'center' }}>
                                                <span style={{
                                                    display: 'inline-block',
                                                    width: '16px',
                                                    height: '16px',
                                                    backgroundColor: 'pink',
                                                    borderRadius: '50%',
                                                    marginRight: '8px'
                                                }}></span>
                                                Pink
                                            </span>,
                                            value: 'pink'
                                        },
                                        {
                                            label: <span style={{ display: 'flex', alignItems: 'center' }}>
                                                <span style={{
                                                    display: 'inline-block',
                                                    width: '16px',
                                                    height: '16px',
                                                    backgroundColor: 'red',
                                                    borderRadius: '50%',
                                                    marginRight: '8px'
                                                }}></span>
                                                Red
                                            </span>,
                                            value: 'red'
                                        },
                                        {
                                            label: <span style={{ display: 'flex', alignItems: 'center' }}>
                                                <span style={{
                                                    display: 'inline-block',
                                                    width: '16px',
                                                    height: '16px',
                                                    backgroundColor: 'orange',
                                                    borderRadius: '50%',
                                                    marginRight: '8px'
                                                }}></span>
                                                Orange
                                            </span>,
                                            value: 'orange'
                                        },
                                        {
                                            label: <span style={{ display: 'flex', alignItems: 'center' }}>
                                                <span style={{
                                                    display: 'inline-block',
                                                    width: '16px',
                                                    height: '16px',
                                                    backgroundColor: 'yellow',
                                                    borderRadius: '50%',
                                                    marginRight: '8px'
                                                }}></span>
                                                Yellow
                                            </span>,
                                            value: 'yellow'
                                        },
                                        {
                                            label: <span style={{ display: 'flex', alignItems: 'center' }}>
                                                <span style={{
                                                    display: 'inline-block',
                                                    width: '16px',
                                                    height: '16px',
                                                    backgroundColor: '#98FB98',
                                                    borderRadius: '50%',
                                                    marginRight: '8px'
                                                }}></span>
                                                Mint
                                            </span>,
                                            value: 'mint'
                                        }
                                    ]}
                                    onChange={setSelectedColor}
                                    value={selectedColor}
                                />
                            </div>

                            <div style={{ position: 'relative' }}>
                                <div style={{
                                    display: 'grid',
                                    gridTemplateColumns: 'repeat(2, 1fr)',
                                    gap: '16px',
                                    marginBottom: '16px'
                                }}>
                                    <div style={{
                                        border: '1px solid #e1e3e5',
                                        borderRadius: '8px',
                                        padding: '16px',
                                        position: 'relative'
                                    }}>
                                        <div style={{
                                            borderRadius: '4px',
                                            height: '120px',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            gap: '8px',
                                        }}>
                                            <img
                                                alt=""
                                                width="100%"
                                                height="100%"
                                                style={{
                                                    // objectFit: 'cover',
                                                    objectPosition: 'center',
                                                }}
                                                src="https://app.rapibundle.com/images/templates/original.webp"
                                            />
                                        </div>
                                        <RadioButton
                                            label="Royal"
                                            checked={selectedTemplate === 'royal'}
                                            id="royal"
                                            name="template"
                                            onChange={() => handleTemplateChange('royal')}
                                        />
                                    </div>

                                    <div style={{
                                        border: '1px solid #e1e3e5',
                                        borderRadius: '8px',
                                        padding: '16px',
                                        position: 'relative'
                                    }}>
                                        <div style={{
                                            borderRadius: '4px',
                                            height: '120px',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            gap: '8px',
                                        }}>
                                            <img
                                                alt=""
                                                width="100%"
                                                height="100%"
                                                style={{
                                                    // objectFit: 'cover',
                                                    objectPosition: 'center',
                                                }}
                                                src="https://app.rapibundle.com/images/templates/heavy.webp"
                                            />
                                        </div>

                                        <RadioButton
                                            label="Block"
                                            checked={selectedTemplate === 'block'}
                                            id="block"
                                            name="template"
                                            onChange={() => handleTemplateChange('block')}
                                        />
                                    </div>

                                    <div style={{
                                        border: '1px solid #e1e3e5',
                                        borderRadius: '8px',
                                        padding: '16px',
                                        position: 'relative'
                                    }}>
                                        <div style={{
                                            borderRadius: '4px',
                                            height: '120px',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            gap: '8px',
                                        }}>
                                            <img
                                                alt=""
                                                width="100%"
                                                height="100%"
                                                style={{
                                                    // objectFit: 'cover',
                                                    objectPosition: 'center',
                                                }}
                                                src="https://app.rapibundle.com/images/templates/prestige.webp"
                                            />
                                        </div>
                                        <RadioButton
                                            label="Light"
                                            checked={selectedTemplate === 'light'}
                                            id="light"
                                            name="template"
                                            onChange={() => handleTemplateChange('light')}
                                        />
                                    </div>

                                    <div style={{
                                        border: '1px solid #e1e3e5',
                                        borderRadius: '8px',
                                        padding: '16px',
                                        position: 'relative'
                                    }}>
                                        <div style={{
                                            background: '#f6f6f7',
                                            borderRadius: '4px',
                                            height: '120px',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            gap: '8px',
                                            padding: '8px'
                                        }}>
                                            <div style={{
                                                background: '#e1e3e5',
                                                height: '8px',
                                                width: '90%',
                                                borderRadius: '2px'
                                            }}></div>
                                            <div style={{
                                                background: '#e1e3e5',
                                                height: '8px',
                                                width: '80%',
                                                borderRadius: '2px'
                                            }}></div>
                                        </div>
                                        <RadioButton
                                            label="Prestige"
                                            checked={selectedTemplate === 'prestige'}
                                            id="prestige"
                                            name="template"
                                            onChange={() => handleTemplateChange('prestige')}
                                        />
                                    </div>
                                </div>


                            </div>
                        </BlockStack>

                        {/* Additional settings */}
                        <BlockStack gap="300">
                            <Text variant="headingMd" as="h3">Settings</Text>
                            <InlineStack align="start">
                                <input
                                    type="checkbox"
                                    id="variantChoice"
                                    checked={settings.variantChoice}
                                    onChange={() => handleSettingChange('variantChoice')}
                                    style={{ marginRight: '8px' }}
                                />
                                <label htmlFor="variantChoice">Let customers choose different variants for each item</label>
                            </InlineStack>

                            <InlineStack align="start">
                                <input
                                    type="checkbox"
                                    id="showPrices"
                                    checked={settings.showPrices}
                                    onChange={() => handleSettingChange('showPrices')}
                                    style={{ marginRight: '8px' }}
                                />
                                <label htmlFor="showPrices">Show prices per item</label>
                            </InlineStack>

                            <InlineStack align="start">
                                <input
                                    type="checkbox"
                                    id="showComparePrice"
                                    checked={settings.showComparePrice}
                                    onChange={() => handleSettingChange('showComparePrice')}
                                    style={{ marginRight: '8px' }}
                                />
                                <label htmlFor="showComparePrice">Show product compare-at price</label>
                            </InlineStack>

                            <InlineStack align="start">
                                <input
                                    type="checkbox"
                                    id="skipCart"
                                    checked={settings.skipCart}
                                    onChange={() => handleSettingChange('skipCart')}
                                    style={{ marginRight: '8px' }}
                                />
                                <label htmlFor="skipCart">Skip cart and go to checkout option</label>
                            </InlineStack>

                            <InlineStack align="start">
                                <input
                                    type="checkbox"
                                    id="redirectToProduct"
                                    checked={settings.redirectToProduct}
                                    onChange={() => handleSettingChange('redirectToProduct')}
                                    style={{ marginRight: '8px' }}
                                />
                                <label htmlFor="redirectToProduct">Redirect to the Product Page</label>
                            </InlineStack>

                            <InlineStack align="start">
                                <input
                                    type="checkbox"
                                    id="redirectToNewTab"
                                    checked={settings.redirectToNewTab}
                                    onChange={() => handleSettingChange('redirectToNewTab')}
                                    style={{ marginRight: '8px' }}
                                />
                                <label htmlFor="redirectToNewTab">Redirect to a new Tab</label>
                            </InlineStack>
                        </BlockStack>

                        {/* Custom placement code */}
                        <BlockStack gap="300">
                            <Text variant="headingMd" as="h3">Use this code for custom placement or page builders (Optional)</Text>
                            <div style={{
                                border: '1px solid #e1e3e5',
                                borderRadius: '4px',
                                padding: '8px',
                                background: '#f9fafb',
                                position: 'relative'
                            }}>
                                <code style={{ color: '#bf0711' }}>&lt;div data-rapi-id="rapi_632ed6a3e996fc"&gt;&lt;/div&gt;</code>
                                <button
                                    style={{
                                        position: 'absolute',
                                        right: '8px',
                                        top: '8px',
                                        background: 'transparent',
                                        border: 'none',
                                        cursor: 'pointer'
                                    }}
                                    onClick={() => {
                                        navigator.clipboard.writeText('<div data-rapi-id="rapi_632ed6a3e996fc"></div>');
                                    }}
                                >
                                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M8 2H16V10" stroke="#5C5F62" strokeWidth="2" />
                                        <path d="M16 2L8 10" stroke="#5C5F62" strokeWidth="2" />
                                        <path d="M12 12V18H2V8H8" stroke="#5C5F62" strokeWidth="2" />
                                    </svg>
                                </button>
                            </div>
                        </BlockStack>

                        {/* Existing position and publish sections */}
                        <BlockStack gap="300">
                            <Text variant="headingMd" as="h3">Position</Text>
                            {/* Position radio buttons */}
                        </BlockStack>

                        <BlockStack gap="300">
                            <Text variant="headingMd" as="h3">Publish Bundle</Text>
                            {/* Publish radio buttons */}
                        </BlockStack>
                    </BlockStack>
                )}

                {selected === 1 && (
                    <BlockStack gap="400">
                        {/* Bundle Product Selection */}
                        <BlockStack gap="300">
                            <Text variant="headingMd" as="h3">Bundle</Text>

                            {/* Dynamic Product Cards */}
                            {products.map((product, index) => (
                                <Card key={product.id} padding="0">
                                    <div style={{ padding: '12px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <div style={{ cursor: 'grab' }}>
                                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M7 5H13M7 10H13M7 15H13" stroke="#5C5F62" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        </div>
                                        <div style={{ width: '32px', height: '32px', backgroundColor: '#F6F6F7', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            {/* ... existing icon code ... */}
                                        </div>
                                        <div style={{ flex: 1 }}>
                                            <Button
                                                fullWidth
                                                onClick={() => {
                                                    // Open the product selector modal
                                                    window.shopify.resourcePicker({
                                                        type: 'product',
                                                        action: 'select',
                                                        multiple: false
                                                    }).then(({ selection }) => {
                                                        if (selection && selection.length > 0) {
                                                            const selectedProduct = selection[0];
                                                            const updatedProducts = [...products];
                                                            updatedProducts[index] = {
                                                                ...updatedProducts[index],
                                                                name: selectedProduct.title,
                                                                productId: selectedProduct.id,
                                                                image: selectedProduct.images[0]?.originalSrc,
                                                                productHandle: selectedProduct.handle
                                                            };
                                                            setProducts(updatedProducts);
                                                        }
                                                    });
                                                }}
                                            >
                                                {product.name || `Select product ${index + 1}`}
                                            </Button>
                                        </div>
                                        <div style={{ width: '100px' }}>
                                            <TextField
                                                label="Quantity"
                                                labelHidden
                                                type="number"
                                                prefix="Qty"
                                                value={product.quantity.toString()}
                                                onChange={(value) => {
                                                    const updatedProducts = [...products];
                                                    updatedProducts[index].quantity = parseInt(value) || 1;
                                                    setProducts(updatedProducts);
                                                }}
                                                autoComplete="off"
                                            />
                                        </div>
                                        <Button
                                            icon={DeleteIcon}
                                            onClick={() => handleRemoveProduct(product.id)}
                                        />
                                    </div>
                                </Card>
                            ))}

                            {/* Add new product button */}
                            <Button fullWidth onClick={handleAddProduct}>Add a new product</Button>
                        </BlockStack>

                        {/* Price Settings */}
                        <BlockStack gap="300">
                            <InlineStack align="space-between">
                                <Text variant="headingMd" as="h3">Price</Text>
                                <Text variant="bodyMd" tone="critical">
                                    <span style={{ display: 'flex', alignItems: 'center' }}>
                                        <span style={{ color: '#D82C0D', marginRight: '4px' }}>⚠</span>
                                        Important Note
                                    </span>
                                </Text>
                            </InlineStack>

                            <RadioButton
                                label="Default"
                                checked={pricingOption === 'default'}
                                id="default"
                                name="pricingOption"
                                onChange={handlePricingOptionChange}
                            />

                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <RadioButton
                                    label="Discount value in %"
                                    checked={pricingOption === 'percentage'}
                                    id="percentage"
                                    name="pricingOption"
                                    onChange={handlePricingOptionChange}
                                />
                                {pricingOption === 'percentage' && (
                                    <Text variant="bodyMd" as="span" tone="subdued">
                                        (example: 10% off)
                                    </Text>
                                )}
                            </div>
                            {pricingOption === 'percentage' && (
                                <div style={{ marginLeft: '28px', marginTop: '4px' }}>
                                    <TextField
                                        label="Discount percentage"
                                        labelHidden
                                        type="number"
                                        suffix="%"
                                        value={discountPercentage}
                                        onChange={setDiscountPercentage}
                                        autoComplete="off"
                                    />
                                </div>
                            )}

                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <RadioButton
                                    label="Fixed discount $ per item"
                                    checked={pricingOption === 'fixedDiscount'}
                                    id="fixedDiscount"
                                    name="pricingOption"
                                    onChange={handlePricingOptionChange}
                                />
                                {pricingOption === 'fixedDiscount' && (
                                    <Text variant="bodyMd" as="span" tone="subdued">
                                        (example: 25$ off)
                                    </Text>
                                )}
                            </div>
                            {pricingOption === 'fixedDiscount' && (
                                <div style={{ marginLeft: '28px', marginTop: '4px' }}>
                                    <TextField
                                        label="Fixed discount amount"
                                        labelHidden
                                        type="number"
                                        prefix="$"
                                        value={fixedDiscount}
                                        onChange={setFixedDiscount}
                                        autoComplete="off"
                                    />
                                </div>
                            )}

                            <RadioButton
                                label="Fixed price for the bundle"
                                checked={pricingOption === 'fixedPrice'}
                                id="fixedPrice"
                                name="pricingOption"
                                onChange={handlePricingOptionChange}
                            />
                            {pricingOption === 'fixedPrice' && (
                                <div style={{ marginLeft: '28px', marginTop: '4px' }}>
                                    <TextField
                                        label="Fixed bundle price"
                                        labelHidden
                                        type="number"
                                        prefix="$"
                                        value={fixedPrice}
                                        onChange={setFixedPrice}
                                        autoComplete="off"
                                    />
                                </div>
                            )}
                        </BlockStack>

                        <BlockStack gap="300">
                            <Text variant="headingMd" as="h3">Highlight</Text>

                            <BlockStack gap="200">
                                <RadioButton
                                    label="Text"
                                    checked={highlightOption === 'text'}
                                    id="text"
                                    name="highlightOption"
                                    onChange={handleHighlightOptionChange}
                                />

                                <RadioButton
                                    label="Timer"
                                    checked={highlightOption === 'timer'}
                                    id="timer"
                                    name="highlightOption"
                                    onChange={handleHighlightOptionChange}
                                />

                                {highlightOption === 'text' && (
                                    <div style={{ marginLeft: '28px', marginTop: '4px' }}>
                                        <TextField
                                            label="Title"
                                            value={highlightTitle}
                                            onChange={setHighlightTitle}
                                            autoComplete="off"
                                        />

                                        <InlineStack align="start" gap="200" blockAlign="center" style={{ marginTop: '12px' }}>
                                            <input
                                                type="checkbox"
                                                id="blinking"
                                                checked={isBlinking}
                                                onChange={() => setIsBlinking(!isBlinking)}
                                                style={{ marginRight: '8px' }}
                                            />
                                            <label htmlFor="blinking">Blinking</label>
                                        </InlineStack>

                                        <div style={{ marginTop: '12px' }}>
                                            <Select
                                                label="Style"
                                                options={[
                                                    { label: 'Solid', value: 'solid' },
                                                    { label: 'Outline', value: 'outline' },
                                                    { label: 'Soft', value: 'soft' }
                                                ]}
                                                onChange={setHighlightStyle}
                                                value={highlightStyle}
                                            />
                                        </div>
                                    </div>
                                )}

                                {highlightOption === 'timer' && (
                                    <div style={{ marginLeft: '28px', marginTop: '4px' }}>
                                        <TextField
                                            label="Title"
                                            value={highlightTimerTitle}
                                            onChange={setHighlightTimerTitle}
                                            autoComplete="off"
                                        />

                                        <TextField
                                            label="End date"
                                            type="datetime-local"
                                            value={timerEndDate}
                                            onChange={setTimerEndDate}
                                            autoComplete="off"
                                        />

                                        <div style={{ marginTop: '12px' }}>
                                            <Select
                                                label="Format"
                                                options={[
                                                    { label: 'DD:HH:MM:SS', value: 'dd:hh:mm:ss' },
                                                    { label: 'HH:MM:SS', value: 'hh:mm:ss' },
                                                    { label: 'MM:SS', value: 'mm:ss' }
                                                ]}
                                                onChange={setTimerFormat}
                                                value={timerFormat}
                                            />
                                        </div>

                                        <div style={{ marginTop: '12px' }}>
                                            <Select
                                                label="Style"
                                                options={[
                                                    { label: 'Solid', value: 'solid' },
                                                    { label: 'Outline', value: 'outline' },
                                                    { label: 'Soft', value: 'soft' }
                                                ]}
                                                onChange={setHighlightStyle}
                                                value={highlightStyle}
                                            />
                                        </div>
                                    </div>
                                )}
                            </BlockStack>
                        </BlockStack>
                    </BlockStack>
                )}

                {selected === 2 && (
                    <BlockStack gap="400">
                        <BlockStack gap="300">
                            <Text variant="headingMd" as="h3">Typography</Text>

                            {/* Header Typography */}
                            <InlineStack gap="400" align="space-between">
                                <div style={{ flex: 1 }}>
                                    <TextField
                                        label="Header Size"
                                        type="number"
                                        value={typography.header.size}
                                        onChange={(value) => setTypography(prev => ({
                                            ...prev,
                                            header: { ...prev.header, size: value }
                                        }))}
                                        autoComplete="off"
                                    />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <Select
                                        label="Weight"
                                        options={[
                                            { label: 'Lighter', value: 'Lighter' },
                                            { label: 'Regular', value: 'Regular' },
                                            { label: 'Bold', value: 'Bold' }
                                        ]}
                                        value={typography.header.weight}
                                        onChange={(value) => setTypography(prev => ({
                                            ...prev,
                                            header: { ...prev.header, weight: value }
                                        }))}
                                    />
                                </div>
                            </InlineStack>

                            {/* Title & Price Typography */}
                            <InlineStack gap="400" align="space-between">
                                <div style={{ flex: 1 }}>
                                    <TextField
                                        label="Title & price Size"
                                        type="number"
                                        value={typography.titlePrice.size}
                                        onChange={(value) => setTypography(prev => ({
                                            ...prev,
                                            titlePrice: { ...prev.titlePrice, size: value }
                                        }))}
                                        autoComplete="off"
                                    />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <Select
                                        label="Weight"
                                        options={[
                                            { label: 'Regular', value: 'Regular' },
                                            { label: 'Bold', value: 'Bold' }
                                        ]}
                                        value={typography.titlePrice.weight}
                                        onChange={(value) => setTypography(prev => ({
                                            ...prev,
                                            titlePrice: { ...prev.titlePrice, weight: value }
                                        }))}
                                    />
                                </div>
                            </InlineStack>

                            {/* Spacing Section */}
                            <Text variant="headingMd" as="h3">Spacing</Text>
                            <BlockStack gap="300">
                                <InlineStack gap="400" align="space-between">
                                    <div style={{ flex: 1 }}>
                                        <TextField
                                            label="Bundle top"
                                            type="number"
                                            value={spacing.bundleTop}
                                            suffix="px"
                                            onChange={(value) => setSpacing(prev => ({ ...prev, bundleTop: value }))}
                                            autoComplete="off"
                                        />
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <TextField
                                            label="Bundle bottom"
                                            type="number"
                                            value={spacing.bundleBottom}
                                            suffix="px"
                                            onChange={(value) => setSpacing(prev => ({ ...prev, bundleBottom: value }))}
                                            autoComplete="off"
                                        />
                                    </div>
                                </InlineStack>

                                <InlineStack gap="400" align="space-between">
                                    <div style={{ flex: 1 }}>
                                        <TextField
                                            label="Footer top"
                                            type="number"
                                            value={spacing.footerTop}
                                            suffix="px"
                                            onChange={(value) => setSpacing(prev => ({ ...prev, footerTop: value }))}
                                            autoComplete="off"
                                        />
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <TextField
                                            label="Footer bottom"
                                            type="number"
                                            value={spacing.footerBottom}
                                            suffix="px"
                                            onChange={(value) => setSpacing(prev => ({ ...prev, footerBottom: value }))}
                                            autoComplete="off"
                                        />
                                    </div>
                                </InlineStack>
                            </BlockStack>

                            {/* Shape & Size Section */}
                            <Text variant="headingMd" as="h3">Shape & Size</Text>
                            <BlockStack gap="300">
                                <Select
                                    label="Bundle"
                                    options={[
                                        { label: 'Squared', value: 'Squared' },
                                        { label: 'Rounded', value: 'Rounded' }
                                    ]}
                                    value={shapes.bundle}
                                    onChange={(value) => setShapes(prev => ({ ...prev, bundle: value }))}
                                />

                                <Select
                                    label="Footer"
                                    options={[
                                        { label: 'Squared', value: 'Squared' },
                                        { label: 'Rounded', value: 'Rounded' }
                                    ]}
                                    value={shapes.footer}
                                    onChange={(value) => setShapes(prev => ({ ...prev, footer: value }))}
                                />

                                <Select
                                    label="Add to Cart"
                                    options={[
                                        { label: 'Squared', value: 'Squared' },
                                        { label: 'Rounded', value: 'Rounded' }
                                    ]}
                                    value={shapes.addToCart}
                                    onChange={(value) => setShapes(prev => ({ ...prev, addToCart: value }))}
                                />

                                {/* Product Image Size Slider */}
                                <div style={{ marginTop: '12px' }}>
                                    <Text>Product image size</Text>
                                    <input
                                        type="range"
                                        min="30"
                                        max="80"
                                        value={productImageSize}
                                        onChange={(e) => setProductImageSize(e.target.value)}
                                        style={{ width: '100%' }}
                                    />
                                    <div style={{ textAlign: 'right' }}>{productImageSize}px</div>
                                </div>
                            </BlockStack>

                            {/* Border Thickness Section */}
                            <Text variant="headingMd" as="h3">Border Thickness</Text>
                            <BlockStack gap="300">
                                <div style={{ marginTop: '12px' }}>
                                    <Text>Bundle</Text>
                                    <input
                                        type="range"
                                        min="0"
                                        max="5"
                                        value={borderThickness.bundle}
                                        onChange={(e) => setBorderThickness(prev => ({ ...prev, bundle: e.target.value }))}
                                        style={{ width: '100%' }}
                                    />
                                    <div style={{ textAlign: 'right' }}>{borderThickness.bundle}px</div>
                                </div>

                                <div>
                                    <Text>Footer</Text>
                                    <input
                                        type="range"
                                        min="0"
                                        max="5"
                                        value={borderThickness.footer}
                                        onChange={(e) => setBorderThickness(prev => ({ ...prev, footer: e.target.value }))}
                                        style={{ width: '100%' }}
                                    />
                                    <div style={{ textAlign: 'right' }}>{borderThickness.footer}px</div>
                                </div>

                                <div>
                                    <Text>Add to Cart</Text>
                                    <input
                                        type="range"
                                        min="0"
                                        max="5"
                                        value={borderThickness.addToCart}
                                        onChange={(e) => setBorderThickness(prev => ({ ...prev, addToCart: e.target.value }))}
                                        style={{ width: '100%' }}
                                    />
                                    <div style={{ textAlign: 'right' }}>{borderThickness.addToCart}px</div>
                                </div>
                            </BlockStack>
                        </BlockStack>
                    </BlockStack>
                )}

                {selected === 3 && (
                    <BlockStack gap="400">
                        <BlockStack gap="300">
                            <Text variant="headingMd" as="h3">Structure</Text>

                            {/* Background Colors */}
                            <InlineStack gap="400" align="space-between">
                                <div style={{ flex: 1 }}>
                                    <Text>Background</Text>
                                    <input
                                        type="color"
                                        value={colors.background}
                                        onChange={(e) => setColors(prev => ({ ...prev, background: e.target.value }))}
                                        style={{ width: '100%', height: '36px' }}
                                    />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <Text>Border</Text>
                                    <input
                                        type="color"
                                        value={colors.border}
                                        onChange={(e) => setColors(prev => ({ ...prev, border: e.target.value }))}
                                        style={{ width: '100%', height: '36px' }}
                                    />
                                </div>
                            </InlineStack>

                            <InlineStack gap="400" align="space-between">
                                <div style={{ flex: 1 }}>
                                    <Text>Footer background</Text>
                                    <input
                                        type="color"
                                        value={colors.footerBackground}
                                        onChange={(e) => setColors(prev => ({ ...prev, footerBackground: e.target.value }))}
                                        style={{ width: '100%', height: '36px' }}
                                    />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <Text>Button background</Text>
                                    <input
                                        type="color"
                                        value={colors.buttonBackground}
                                        onChange={(e) => setColors(prev => ({ ...prev, buttonBackground: e.target.value }))}
                                        style={{ width: '100%', height: '36px' }}
                                    />
                                </div>
                            </InlineStack>

                            <InlineStack gap="400" align="space-between">
                                <div style={{ flex: 1 }}>
                                    <Text>Highlight background</Text>
                                    <input
                                        type="color"
                                        value={colors.highlightBackground}
                                        onChange={(e) => setColors(prev => ({ ...prev, highlightBackground: e.target.value }))}
                                        style={{ width: '100%', height: '36px' }}
                                    />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <Text>Quantity background</Text>
                                    <input
                                        type="color"
                                        value={colors.quantityBackground}
                                        onChange={(e) => setColors(prev => ({ ...prev, quantityBackground: e.target.value }))}
                                        style={{ width: '100%', height: '36px' }}
                                    />
                                </div>
                            </InlineStack>

                            {/* Text Colors */}
                            <Text variant="headingMd" as="h3" style={{ marginTop: '16px' }}>Text</Text>

                            <InlineStack gap="400" align="space-between">
                                <div style={{ flex: 1 }}>
                                    <Text>Header</Text>
                                    <input
                                        type="color"
                                        value={colors.headerText}
                                        onChange={(e) => setColors(prev => ({ ...prev, headerText: e.target.value }))}
                                        style={{ width: '100%', height: '36px' }}
                                    />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <Text>Title</Text>
                                    <input
                                        type="color"
                                        value={colors.titleText}
                                        onChange={(e) => setColors(prev => ({ ...prev, titleText: e.target.value }))}
                                        style={{ width: '100%', height: '36px' }}
                                    />
                                </div>
                            </InlineStack>

                            <InlineStack gap="400" align="space-between">
                                <div style={{ flex: 1 }}>
                                    <Text>Price</Text>
                                    <input
                                        type="color"
                                        value={colors.price}
                                        onChange={(e) => setColors(prev => ({ ...prev, price: e.target.value }))}
                                        style={{ width: '100%', height: '36px' }}
                                    />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <Text>Compared Price</Text>
                                    <input
                                        type="color"
                                        value={colors.comparedPrice}
                                        onChange={(e) => setColors(prev => ({ ...prev, comparedPrice: e.target.value }))}
                                        style={{ width: '100%', height: '36px' }}
                                    />
                                </div>
                            </InlineStack>

                            <InlineStack gap="400" align="space-between">
                                <div style={{ flex: 1 }}>
                                    <Text>Highlight text</Text>
                                    <input
                                        type="color"
                                        value={colors.highlightText}
                                        onChange={(e) => setColors(prev => ({ ...prev, highlightText: e.target.value }))}
                                        style={{ width: '100%', height: '36px' }}
                                    />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <Text>Add to cart text</Text>
                                    <input
                                        type="color"
                                        value={colors.addToCartText}
                                        onChange={(e) => setColors(prev => ({ ...prev, addToCartText: e.target.value }))}
                                        style={{ width: '100%', height: '36px' }}
                                    />
                                </div>
                            </InlineStack>

                            <InlineStack gap="400" align="space-between">
                                <div style={{ flex: 1 }}>
                                    <Text>Quantity text</Text>
                                    <input
                                        type="color"
                                        value={colors.quantityText}
                                        onChange={(e) => setColors(prev => ({ ...prev, quantityText: e.target.value }))}
                                        style={{ width: '100%', height: '36px' }}
                                    />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <Text>Footer text</Text>
                                    <input
                                        type="color"
                                        value={colors.footerText}
                                        onChange={(e) => setColors(prev => ({ ...prev, footerText: e.target.value }))}
                                        style={{ width: '100%', height: '36px' }}
                                    />
                                </div>
                            </InlineStack>
                        </BlockStack>
                    </BlockStack>
                )}

                {/* Other tabs content */}
            </div>
        </Card>
    );
}