import {
    Card,
    Text,
} from '@shopify/polaris'
import React, { useState, useEffect } from 'react'
import "../../_index/style.css";

export default function BundleLivePreview({
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
            <div>
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
                                            backgroundColor: colors.quantityBackground ? `${colors.quantityBackground}30` : `${themeColor}10`,
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