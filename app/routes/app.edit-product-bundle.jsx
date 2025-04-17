// edit-product-bundle.jsx

import {
    Card,
    Grid,
    Layout,
    Page,
    Tabs,
    TextField,
    Select,
    RadioButton,
    Text,
    BlockStack,
    InlineStack,
    ButtonGroup,
    Button,
    Image,
    Banner
} from '@shopify/polaris'
import React, { useState, useCallback, useEffect } from 'react'
import {
    DeleteIcon
} from '@shopify/polaris-icons';
import './_index/styles.module.css'
import prisma from "../db.server";
import { json, useActionData, useFetcher } from '@remix-run/react';


export default function EditProductBundle() {
    // const {message} = useActionData();
    // const actionData = useActionData();
    // console.log("data", actionData)
    // Lift state up from BundleSettingsCard
    const [bundleName, setBundleName] = useState('Bundle 1');
    const [headerText, setHeaderText] = useState('Frequently bought together');
    const [alignment, setAlignment] = useState('center');
    const [footerText, setFooterText] = useState('Total :');
    const [buttonText, setButtonText] = useState('Claim Offer');
    const [position, setPosition] = useState('all');
    const [publishOption, setPublishOption] = useState('immediately');
    const [selectedTemplate, setSelectedTemplate] = useState('prestige');
    const [selectedColor, setSelectedColor] = useState('purple');
    // Pricing options
    const [pricingOption, setPricingOption] = useState('default');
    const [discountPercentage, setDiscountPercentage] = useState('10');
    const [fixedDiscount, setFixedDiscount] = useState('25');
    const [fixedPrice, setFixedPrice] = useState('99');
    // Highlight options
    const [highlightOption, setHighlightOption] = useState('text');
    const [highlightTitle, setHighlightTitle] = useState('Unlock Your Discount');
    const [highlightTimerTitle, setHighlightTimerTitle] = useState('Offer ends in');
    const [isBlinking, setIsBlinking] = useState(false);
    const [highlightStyle, setHighlightStyle] = useState('solid');
    const [timerEndDate, setTimerEndDate] = useState('');
    const [timerFormat, setTimerFormat] = useState('dd:hh:mm:ss');
    // Products in bundle
    const [products, setProducts] = useState([
        { id: 1, name: '', quantity: 1, productId: null, image: null },
        { id: 2, name: '', quantity: 1, productId: null, image: null },
        { id: 3, name: '', quantity: 1, productId: null, image: null }
    ]);
    // First, add these new state variables at the top of your EditProductBundle component
    const [typography, setTypography] = useState({
        header: { size: '16', weight: 'Lighter' },
        titlePrice: { size: '15', weight: 'Bold' },
        quantityPrice: { size: '13', fontStyle: 'Regular' },
        highlight: { size: '12', fontStyle: 'Regular' },
    });
    const [spacing, setSpacing] = useState({
        bundleTop: '18',
        bundleBottom: '6',
        footerTop: '15',
        footerBottom: '10'
    });
    const [shapes, setShapes] = useState({
        bundle: 'Rounded',
        footer: 'Rounded',
        addToCart: 'Rounded'
    });
    const [productImageSize, setProductImageSize] = useState('55');
    const [iconStyle, setIconStyle] = useState('Plus 5');
    const [borderThickness, setBorderThickness] = useState({
        bundle: '1',
        footer: '0',
        addToCart: '2'
    });

    // First, add these new state variables at the top of your component
    // color tab states
    const [colors, setColors] = useState({
        background: '',
        border: '#E1E3E5',
        footerBackground: '#F6F6F7',
        buttonBackground: '',
        buttonBorder: '',
        highlightBackground: '#FF6B6B',
        quantityBackground: '',
        price: '#000000',
        comparedPrice: '#FF0000',
        headerText: '#000000',
        titleText: '#000000',
        highlightText: '#FFFFFF',
        addToCartText: '#FFFFFF',
        quantityText: '#000000',
        footerText: '#000000',
    });
    // console.log("products", products)

    const [settings, setSettings] = useState({
        variantChoice: true,
        showPrices: false,
        showComparePrice: true,
        skipCart: false,
        redirectToProduct: true,
        redirectToNewTab: true
    });

    // Handler to add a new product to the bundle
    const handleAddProduct = useCallback(() => {
        setProducts(prev => [
            ...prev,
            { id: prev.length > 0 ? Math.max(...prev.map(p => p.id)) + 1 : 1, name: '', quantity: 1 }
        ]);
    }, []);

    // Handler to remove a product from the bundle
    const handleRemoveProduct = useCallback((productId) => {
        setProducts(prev => prev.filter(product => product.id !== productId));
    }, []);

    // Handler for settings changes
    const handleSettingChange = useCallback(
        (setting) => {
            setSettings(prev => ({
                ...prev,
                [setting]: !prev[setting]
            }));
        },
        [],
    );

    // Handler for product name changes
    const handleProductNameChange = useCallback(
        (index, value) => {
            const updatedProducts = [...products];
            updatedProducts[index].name = value;
            setProducts(updatedProducts);
        },
        [products],
    );

    // Handler for product quantity changes
    const handleProductQuantityChange = useCallback(
        (index, value) => {
            const updatedProducts = [...products];
            updatedProducts[index].quantity = parseInt(value) || 1;
            setProducts(updatedProducts);
        },
        [products],
    );

    // In EditProductBundle component, add this before the return statement
    const fetcher = useFetcher();
    // console.log(fetcher.data?.bundleData, "success")
    const handleSave = async (status) => {
        const bundleData = {
            status, // 'draft' or 'published'
            bundleName,
            headerText,
            alignment,
            footerText,
            buttonText,
            position,
            publishOption,
            selectedTemplate,
            selectedColor,
            settings,
            pricingOption,
            discountPercentage,
            fixedDiscount,
            fixedPrice,
            highlightOption,
            highlightTitle,
            highlightTimerTitle,
            isBlinking,
            highlightStyle,
            timerEndDate,
            timerFormat,
            products,
            typography,
            spacing,
            shapes,
            productImageSize,
            iconStyle,
            borderThickness,
            colors
        };

        fetcher.submit(
            { bundleData: JSON.stringify(bundleData) },
            { method: "post" }
        );
    };

    // State for banner
    const [showBanner, setShowBanner] = useState(false);
    useEffect(() => {
        if (fetcher.data) {
            setShowBanner(true);
            const timer = setTimeout(() => {
                setShowBanner(false);
            }, 10000);
            return () => clearTimeout(timer);
        }
    }, [fetcher.data]);

    return (
        <Page title={bundleName} backAction={() => { }}>
            {showBanner && fetcher.data && (
                <div className="">
                    <Banner
                        title={fetcher.data?.message || fetcher.data?.error}
                        onDismiss={() => setShowBanner(false)}
                        tone={fetcher.data?.success ? 'success' : 'critical'}
                    >
                    </Banner>
                    <br />
                </div>
            )}

            <Grid>
                <Grid.Cell columnSpan={{ xs: 6, sm: 3, md: 3, lg: 6, xl: 6 }}>
                    <BundleSettingsCard
                        bundleName={bundleName}
                        setBundleName={setBundleName}
                        headerText={headerText}
                        setHeaderText={setHeaderText}
                        alignment={alignment}
                        setAlignment={setAlignment}
                        footerText={footerText}
                        setFooterText={setFooterText}
                        buttonText={buttonText}
                        setButtonText={setButtonText}
                        position={position}
                        setPosition={setPosition}
                        publishOption={publishOption}
                        setPublishOption={setPublishOption}
                        selectedTemplate={selectedTemplate}
                        setSelectedTemplate={setSelectedTemplate}
                        selectedColor={selectedColor}
                        setSelectedColor={setSelectedColor}
                        settings={settings}
                        handleSettingChange={handleSettingChange}
                        pricingOption={pricingOption}
                        setPricingOption={setPricingOption}
                        discountPercentage={discountPercentage}
                        setDiscountPercentage={setDiscountPercentage}
                        fixedDiscount={fixedDiscount}
                        setFixedDiscount={setFixedDiscount}
                        fixedPrice={fixedPrice}
                        setFixedPrice={setFixedPrice}
                        highlightOption={highlightOption}
                        setHighlightOption={setHighlightOption}
                        highlightTitle={highlightTitle}
                        setHighlightTitle={setHighlightTitle}
                        highlightTimerTitle={highlightTimerTitle}
                        setHighlightTimerTitle={setHighlightTimerTitle}
                        isBlinking={isBlinking}
                        setIsBlinking={setIsBlinking}
                        highlightStyle={highlightStyle}
                        setHighlightStyle={setHighlightStyle}
                        timerEndDate={timerEndDate}
                        setTimerEndDate={setTimerEndDate}
                        timerFormat={timerFormat}
                        setTimerFormat={setTimerFormat}
                        products={products}
                        handleAddProduct={handleAddProduct}
                        handleRemoveProduct={handleRemoveProduct}
                        handleProductNameChange={handleProductNameChange}
                        handleProductQuantityChange={handleProductQuantityChange}
                        setProducts={setProducts}
                        typography={typography}
                        setTypography={setTypography}
                        spacing={spacing}
                        setSpacing={setSpacing}
                        shapes={shapes}
                        setShapes={setShapes}
                        productImageSize={productImageSize}
                        setProductImageSize={setProductImageSize}
                        iconStyle={iconStyle}
                        setIconStyle={setIconStyle}
                        borderThickness={borderThickness}
                        setBorderThickness={setBorderThickness}
                        colors={colors}
                        setColors={setColors}
                    />
                </Grid.Cell>
                <Grid.Cell columnSpan={{ xs: 6, sm: 3, md: 3, lg: 6, xl: 6 }}>
                    <BundleLivePreview
                        headerText={headerText}
                        alignment={alignment}
                        footerText={footerText}
                        buttonText={buttonText}
                        selectedColor={selectedColor}
                        settings={settings}
                        products={products}  // Add this line
                        // Add new props
                        highlightOption={highlightOption}
                        highlightTitle={highlightTitle}
                        highlightTimerTitle={highlightTimerTitle}
                        timerEndDate={timerEndDate}
                        timerFormat={timerFormat}
                        highlightStyle={highlightStyle}
                        isBlinking={isBlinking}
                        // ... existing props ...
                        typography={typography}
                        spacing={spacing}
                        shapes={shapes}
                        productImageSize={productImageSize}
                        iconStyle={iconStyle}
                        borderThickness={borderThickness}
                        colors={colors}
                    />
                    <br />
                    <InlineStack align="end">
                        <ButtonGroup>
                            <Button onClick={() => handleSave('draft')}>Save as draft</Button>
                            <Button variant="primary" tone="critical">Delete</Button>
                            <Button
                                variant="primary"
                                onClick={() => handleSave('published')}
                                loading={fetcher.state === 'submitting'}
                            >
                                Publish
                            </Button>
                        </ButtonGroup>
                        <div className="response-status">
                            {/* {fetcher.data && (
                                <p style={{ color: fetcher.data?.success ? 'green' : 'red' }}>
                                    {fetcher.data?.message || fetcher.data?.error}
                                </p>
                            )} */}
                        </div>
                    </InlineStack>
                </Grid.Cell>
            </Grid>
        </Page>
    )
}

// Bundle Settings Card Component
function BundleSettingsCard({
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
                                                                image: selectedProduct.images[0]?.originalSrc
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

function BundleLivePreview({
    headerText,
    alignment,
    footerText,
    buttonText,
    selectedColor,
    settings,
    products,  // Add products prop
    // Add highlight props
    highlightOption,
    highlightTitle,
    highlightTimerTitle,
    timerEndDate,
    timerFormat,
    highlightStyle,
    isBlinking,
    typography,
    spacing,
    shapes,
    productImageSize,
    borderThickness,
    colors,
}) {
    // Get the color for the preview based on the selected color
    const getColorValue = (color) => {
        const colorMap = {
            'black': '#000000',
            'purple': '#6F42C1',
            'blue': '#4285F4',
            'teal': '#20B2AA',
            'green': '#4CAF50',
            'pink': '#FF69B4',
            'red': '#FF0000',
            'orange': '#FFA500',
            'yellow': '#FFFF00',
            'mint': '#98FB98'
        };
        return colorMap[color] || '#FF6B6B';
    };

    const themeColor = getColorValue(selectedColor);

    // Add timer state and effect
    const [timeLeft, setTimeLeft] = useState('');
    useEffect(() => {
        if (highlightOption === 'timer' && timerEndDate) {
            const timer = setInterval(() => {
                const end = new Date(timerEndDate).getTime();
                const now = new Date().getTime();
                const distance = end - now;

                if (distance < 0) {
                    setTimeLeft('EXPIRED');
                    clearInterval(timer);
                } else {
                    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
                    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
                    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

                    let timeString = '';
                    switch (timerFormat) {
                        case 'dd:hh:mm:ss':
                            timeString = `${days}d ${hours}h ${minutes}m ${seconds}s`;
                            break;
                        case 'hh:mm:ss':
                            timeString = `${hours + days * 24}h ${minutes}m ${seconds}s`;
                            break;
                        case 'mm:ss':
                            timeString = `${minutes + (hours + days * 24) * 60}m ${seconds}s`;
                            break;
                        default:
                            timeString = `${days}d ${hours}h ${minutes}m ${seconds}s`;
                    }
                    setTimeLeft(timeString);
                }
            }, 1000);

            return () => clearInterval(timer);
        }
    }, [highlightOption, timerEndDate, timerFormat]);

    // Replace the existing discount tag with dynamic highlight
    const getHighlightStyles = () => {
        const baseStyles = {
            // backgroundColor: highlightStyle === 'soft' ? `${themeColor}10` : 'transparent',
            color: highlightStyle === 'outline' ? themeColor : 'white',
            padding: '4px 8px',
            borderRadius: '4px',
            fontSize: '12px',
            border: highlightStyle === 'outline' ? `1px solid ${themeColor}` : 'none',
            animation: isBlinking ? 'blink 1s infinite' : 'none',
            backgroundColor: highlightStyle === 'solid' ? themeColor :
                highlightStyle === 'soft' ? `${themeColor}10` : 'transparent',
        };

        return baseStyles;
    };

    return (
        <Card>
            <div style={{ padding: '16px' }}>
                <Text variant="headingMd" as="h2">Live Preview</Text>

                <div style={{
                    border: `${borderThickness.bundle}px solid #e1e3e5`,
                    // backgroundColor: colors.background,
                    borderRadius: shapes.bundle === 'Rounded' ? '8px' : '0px',
                    padding: '16px',
                    marginTop: `${spacing.bundleTop}px`,
                    marginBottom: `${spacing.bundleBottom}px`,
                    maxWidth: '400px',
                    margin: '16px auto'
                }}>
                    <div className='bundle-block-title' style={{
                        display: 'flex',
                        justifyContent: alignment === 'center' ? 'space-between' :
                            alignment === 'left' ? 'flex-start' : 'flex-end',
                        alignItems: 'center',
                        marginBottom: '16px',
                        fontSize: `${typography.header.size}px`,
                        fontWeight: typography.header.weight === 'Bold' ? 'bold' :
                            typography.header.weight === 'Lighter' ? '300' : 'normal',
                        color: colors.headerText,
                    }}>
                        <Text variant="headingMd" as="h3">{headerText}</Text>
                        <span style={{ fontSize: '18px', marginLeft: alignment === 'left' ? '12px' : '0' }}>🛒</span>
                    </div>

                    {/* Dynamic Products */}
                    {products.map((product, index) => (
                        <React.Fragment key={product.id}>
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                padding: '12px',
                                backgroundColor: colors.background ? `${colors.background}10` : `${themeColor}10`,
                                borderRadius: '8px',
                                marginBottom: '8px'
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <div style={{
                                        // width: '40px',
                                        // height: '40px',
                                        width: `${productImageSize}px`,
                                        height: `${productImageSize}px`,
                                        backgroundColor: '#fff',
                                        borderRadius: '4px',
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        marginRight: '12px',
                                        border: '1px solid #e1e3e5',
                                        overflow: 'hidden'
                                    }}>
                                        {product.image ? (
                                            <img
                                                src={product.image}
                                                alt={product.name}
                                                style={{
                                                    width: '100%',
                                                    height: '100%',
                                                    objectFit: 'cover'
                                                }}
                                            />
                                        ) : (
                                            <svg width="24" style={{
                                                width: `100%`,
                                                height: `100%`,
                                            }} height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M16 4H8C6.89543 4 6 4.89543 6 6V20C6 21.1046 6.89543 22 8 22H16C17.1046 22 18 21.1046 18 20V6C18 4.89543 17.1046 4 16 4Z" stroke="#000" strokeWidth="1.5" />
                                                <path d="M12 4V2" stroke="#000" strokeWidth="1.5" />
                                                <path d="M10 4H14" stroke="#000" strokeWidth="1.5" />
                                            </svg>
                                        )}
                                    </div>
                                    <div>
                                        <div
                                            style={{
                                                fontSize: `${typography.titlePrice.size}px`,
                                                fontWeight: typography.titlePrice.weight === 'Bold' ? 'bold' : 'normal',
                                                color: colors.titleText,
                                            }}>{product.name || 'Select product'}</div>
                                        <div style={{
                                            // backgroundColor: themeColor,
                                            // color: 'white',
                                            padding: '2px 6px',
                                            borderRadius: '4px',
                                            // fontSize: '12px',
                                            display: 'inline-block',
                                            fontSize: `${typography.quantityPrice?.size || 13}px`,
                                            fontWeight: typography.quantityPrice?.weight === 'Bold' ? 'bold' : 'normal',
                                            backgroundColor: colors.quantityBackground ? colors.quantityBackground : themeColor,
                                            color: colors.quantityText,
                                        }}>x{product.quantity}</div>
                                    </div>
                                </div>
                                {settings.showPrices && <div style={{
                                    fontWeight: 'bold',
                                    fontSize: `${typography.titlePrice.size}px`,
                                    color: colors.price,
                                }}>$0.00</div>}
                            </div>

                            {/* Plus sign between products */}
                            {
                                index < products.length - 1 && (
                                    <div style={{
                                        display: 'flex',
                                        justifyContent: 'center',
                                        margin: '8px 0',
                                        fontSize: '20px',
                                        color: '#5c5f62'
                                    }}>+</div>
                                )
                            }
                        </React.Fragment>
                    ))}

                    {/* Dynamic Highlight */}
                    <div style={{
                        display: 'flex',
                        justifyContent: 'flex-end',
                        margin: '8px 0'
                    }}>
                        <div style={getHighlightStyles()}>
                            {highlightOption === 'timer'
                                ? `${highlightTimerTitle} ${timeLeft}`
                                : highlightTitle || 'Unlock Your Discount'
                            }
                        </div>
                    </div>

                    {/* Footer section */}
                    <div style={{
                        marginTop: `${spacing.footerTop}px`,
                        marginBottom: `${spacing.footerBottom}px`,
                        border: `${borderThickness.footer}px solid #e1e3e5`,
                        borderRadius: shapes.footer === 'Rounded' ? '8px' : '0px',
                        padding: '16px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        backgroundColor: colors.footerBackground,
                        color: colors.footerText,
                    }}>
                        <div style={{ color: themeColor, fontWeight: 'bold' }}>{footerText}</div>
                        <div style={{ fontWeight: 'bold' }}>$0.00</div>
                    </div>

                    {/* Claim button */}
                    <button style={{
                        width: '100%',
                        // backgroundColor: themeColor,
                        // color: 'white',
                        // border: 'none',
                        // borderRadius: '4px',
                        padding: '12px',
                        fontSize: '16px',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        borderRadius: shapes.addToCart === 'Rounded' ? '8px' : '0px',
                        // border: `${borderThickness.addToCart}px solid ${themeColor}`,
                        backgroundColor: colors.buttonBackground ? colors.buttonBackground : themeColor,
                        color: colors.addToCartText,
                        border: `${borderThickness.addToCart}px solid`,
                        borderColor: colors.buttonBorder ? colors.buttonBorder : themeColor,
                    }}>
                        {buttonText}
                    </button>
                </div>
            </div>
        </Card >
    ); s
}

// Action Function --------- //
// Add this export at the bottom of the file
// At the top of the file, add this import

// ... rest of your imports and code ...

// Prisma response object
// Bundle saved: {
// id: '3fb3bc9a-15ff-48bc-a801-dd238f45398b',
// createdAt: 2025-04-17T14:30:44.751Z,
// updatedAt: 2025-04-17T14:30:44.751Z,
// shop: 'test-shop',
// status: 'published',
// name: 'Bundle 1',
// settings: {
//   header: 'Frequently bought together',
//   alignment: 'center',
//   footer: 'Total :',
//   button: 'Claim Offer',
//   position: 'all',
//   publishOption: 'immediately',
//   template: 'prestige',
//   color: 'purple',
//   pricing: {
//     option: 'default',
//     discountPercentage: '10',
//     fixedDiscount: '25',
//     fixedPrice: '99'
//   },
//   highlight: {
//     option: 'text',
//     title: 'Unlock Your Discount',
//     timerTitle: 'Offer ends in',
//     isBlinking: false,
//     style: 'solid',
//     timerEndDate: '',
//     timerFormat: 'dd:hh:mm:ss'
//   },
//   typography: {
//     header: [Object],
//     titlePrice: [Object],
//     quantityPrice: [Object],
//     highlight: [Object]
//   },
//   spacing: {
//     bundleTop: '18',
//     bundleBottom: '6',
//     footerTop: '15',
//     footerBottom: '10'
//   },
//   shapes: { bundle: 'Rounded', footer: 'Rounded', addToCart: 'Rounded' },
//   productImageSize: '55',
//   iconStyle: 'Plus 5',
//   borderThickness: { bundle: '1', footer: '0', addToCart: '2' },
//   colors: {
//     background: '',
//     border: '#E1E3E5',
//     footerBackground: '#F6F6F7',
//     buttonBackground: '',
//     buttonBorder: '',
//     highlightBackground: '#FF6B6B',
//     quantityBackground: '',
//     price: '#000000',
//     comparedPrice: '#FF0000',
//     headerText: '#000000',
//     titleText: '#000000',
//     highlightText: '#FFFFFF',
//     addToCartText: '#FFFFFF',
//     quantityText: '#000000',
//     footerText: '#000000'
//   },
//   general: {
//     variantChoice: true,
//     showPrices: false,
//     showComparePrice: true,
//     skipCart: false,
//     redirectToProduct: true,
//     redirectToNewTab: true
//   }
// }


export async function action({ request }) {
    const formData = await request.formData();
    const bundleData = JSON.parse(formData.get("bundleData"));

    try {
        const savedBundle = await prisma.bundle.create({
            data: {
                shop: "test-shop",
                status: bundleData.status,
                name: bundleData.bundleName,
                settings: {
                    header: bundleData.headerText,
                    alignment: bundleData.alignment,
                    footer: bundleData.footerText,
                    button: bundleData.buttonText,
                    position: bundleData.position,
                    publishOption: bundleData.publishOption,
                    template: bundleData.selectedTemplate,
                    color: bundleData.selectedColor,
                    pricing: {
                        option: bundleData.pricingOption,
                        discountPercentage: bundleData.discountPercentage,
                        fixedDiscount: bundleData.fixedDiscount,
                        fixedPrice: bundleData.fixedPrice
                    },
                    highlight: {
                        option: bundleData.highlightOption,
                        title: bundleData.highlightTitle,
                        timerTitle: bundleData.highlightTimerTitle,
                        isBlinking: bundleData.isBlinking,
                        style: bundleData.highlightStyle,
                        timerEndDate: bundleData.timerEndDate,
                        timerFormat: bundleData.timerFormat
                    },
                    typography: bundleData.typography,
                    spacing: bundleData.spacing,
                    shapes: bundleData.shapes,
                    productImageSize: bundleData.productImageSize,
                    iconStyle: bundleData.iconStyle,
                    borderThickness: bundleData.borderThickness,
                    colors: bundleData.colors,
                    general: bundleData.settings
                }
            }
        });

        // After creating the bundle, create the products
        if (bundleData.products && bundleData.products.length > 0) {
            await prisma.bundleProduct.createMany({
                data: bundleData.products.map(product => ({
                    bundleId: savedBundle.id,
                    productId: product.productId || "",
                    name: product.name || "",
                    quantity: product.quantity || 1,
                    image: product.image || ""
                }))
            });
        }

        console.log('Bundle saved to Prisma:');
        return json({ success: true, message: "Settings saved successfully", bundleData });
    } catch (error) {
        console.error('Error saving bundle:', error);
        return json({
            success: false,
            error: error.message
        }, {
            status: 500
        });
    }
}