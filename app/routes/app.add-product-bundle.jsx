// add-product-bundle.jsx

import {
    Card,
    Grid,
    Page,
    // Tabs,
    // TextField,
    // Select,
    // RadioButton,
    Text,
    // BlockStack,
    InlineStack,
    ButtonGroup,
    Button,
    Banner
} from '@shopify/polaris'
import React, { useState, useCallback, useEffect } from 'react'
import "./_index/style.css";
// import {
//     DeleteIcon
// } from '@shopify/polaris-icons';
import './_index/styles.module.css'
import prisma from "../db.server";
import { json, useFetcher } from '@remix-run/react';
import { authenticate } from '../shopify.server'
import BundleSettingsCard from './Components/AddProductComps/BundleSettingsCard';
import BundleLivePreview from './Components/AddProductComps/BundleLivePreview';


export default function EditProductBundle() {
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
        { id: 1, name: '', quantity: 1, productId: null, image: null, productHandle: null },
        { id: 2, name: '', quantity: 1, productId: null, image: null, productHandle: null },
        { id: 3, name: '', quantity: 1, productId: null, image: null, productHandle: null }
    ]);
    // console.log("products", products)
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
            {
                id: prev.length > 0 ? Math.max(...prev.map(p => p.id)) + 1 : 1,
                name: '',
                quantity: 1,
                productId: null,
                image: null,
                handle: null
            }
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
        // Check if any products have been selected
        const hasSelectedProducts = products.some(product => product.name && product.name.trim() !== '');

        if (!hasSelectedProducts) {
            // Show error message if no products are selected
            setShowBanner(true);
            fetcher.data = {
                success: false,
                error: "Please select at least one product for your bundle before saving."
            };
            return;
        }

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
            // const timer = setTimeout(() => {
            //     setShowBanner(false);
            // }, 10000);
            // return () => clearTimeout(timer);
        }
    }, [fetcher.data]);

    return (
        <Page title={bundleName} backAction={{ url: '/app' }}>
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
                            <Button onClick={() => handleSave('draft')}
                                loading={fetcher.state === 'submitting'}
                            >
                                Save as draft
                            </Button>
                            <Button variant="primary" tone="critical">Delete</Button>
                            <Button
                                variant="primary"
                                onClick={() => handleSave('published')}
                                loading={fetcher.state === 'submitting'}
                            >
                                Publish
                            </Button>
                        </ButtonGroup>
                    </InlineStack>
                </Grid.Cell>
            </Grid>
            <br />
            <br />
        </Page>
    )
}

export async function action({ request }) {
    const formData = await request.formData();
    const bundleData = JSON.parse(formData.get("bundleData"));

    const { admin } = await authenticate.admin(request);

    const response = await admin.graphql(`
        query{
            shop {
                name
                id
            }
        }
    `);

    const shopData = await response.json();
    const shopId = shopData.data.shop.id;

    // console.log("shopId", shopId);

    try {

        // Check if a bundle with the same name already exists
        const existingBundle = await prisma.bundle.findFirst({
            where: {
                name: bundleData.bundleName,
                shop: shopId // Also filter by shop ID to allow same bundle names across different shops
            }
        });

        if (existingBundle) {
            return json({
                success: false,
                error: "A bundle with this name already exists. Please choose a different name."
            });
        }

        // Check if there's any published bundle
        const publishedBundle = await prisma.bundle.findFirst({
            where: {
                shop: shopId,
                status: 'published'
            }
        });

        if (publishedBundle) {
            return json({
                success: false,
                error: "Another bundle is already published. Please set the other bundle to draft first or save this bundle as draft."
            });
        }

        const savedBundle = await prisma.bundle.create({
            data: {
                shop: shopId, // Use the actual shop ID here
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
                    bundleId: parseInt(savedBundle.id),
                    productId: product.productId || "",
                    productHandle: product.productHandle || "",
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
