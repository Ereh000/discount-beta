import { useState, useCallback } from 'react';
import { DEFAULT_BUNDLE_VALUES } from '../utils/bundleConstants';

export function useBundleState(isEdit, data) {
  // Helper function to initialize state from loaded data
  const initializeState = useCallback((defaultValue, settingsPath = null, directPath = null) => {
    if (isEdit && data) {
      if (directPath) {
        return data[directPath] !== undefined ? data[directPath] : defaultValue;
      }
      if (settingsPath && data.settings) {
        const keys = settingsPath.split('.');
        let value = data.settings;
        for (const key of keys) {
          value = value?.[key];
        }  
        return value !== undefined ? value : defaultValue;
      }
    }
    return defaultValue;
  }, [isEdit, data]);

  // Group related state into objects
  const [basicSettings, setBasicSettings] = useState({
    bundleName: initializeState(DEFAULT_BUNDLE_VALUES.bundleName, null, "name"),
    headerText: initializeState(DEFAULT_BUNDLE_VALUES.headerText, "header"),
    alignment: initializeState(DEFAULT_BUNDLE_VALUES.alignment, "alignment"),
    footerText: initializeState(DEFAULT_BUNDLE_VALUES.footerText, "footer"),
    buttonText: initializeState(DEFAULT_BUNDLE_VALUES.buttonText, "button"),
    position: initializeState(DEFAULT_BUNDLE_VALUES.position, "position"),
    selectedColor: initializeState(DEFAULT_BUNDLE_VALUES.selectedColor, "color"),
    productImageSize: initializeState(DEFAULT_BUNDLE_VALUES.productImageSize, "productImageSize"),
    iconStyle: initializeState(DEFAULT_BUNDLE_VALUES.iconStyle, "iconStyle")
  });

  const [pricingSettings, setPricingSettings] = useState({
    option: initializeState(DEFAULT_BUNDLE_VALUES.pricing.option, "pricing.option"),
    discountPercentage: initializeState(DEFAULT_BUNDLE_VALUES.pricing.discountPercentage, "pricing.discountPercentage"),
    fixedDiscount: initializeState(DEFAULT_BUNDLE_VALUES.pricing.fixedDiscount, "pricing.fixedDiscount"),
    fixedPrice: initializeState(DEFAULT_BUNDLE_VALUES.pricing.fixedPrice, "pricing.fixedPrice")
  });

  const [highlightSettings, setHighlightSettings] = useState({
    option: initializeState(DEFAULT_BUNDLE_VALUES.highlight.option, "highlight.option"),
    title: initializeState(DEFAULT_BUNDLE_VALUES.highlight.title, "highlight.title"),
    timerTitle: initializeState(DEFAULT_BUNDLE_VALUES.highlight.timerTitle, "highlight.timerTitle"),
    isBlinking: initializeState(DEFAULT_BUNDLE_VALUES.highlight.isBlinking, "highlight.isBlinking"),
    style: initializeState(DEFAULT_BUNDLE_VALUES.highlight.style, "highlight.style"),
    timerEndDate: initializeState(DEFAULT_BUNDLE_VALUES.highlight.timerEndDate, "highlight.timerEndDate"),
    timerFormat: initializeState(DEFAULT_BUNDLE_VALUES.highlight.timerFormat, "highlight.timerFormat")
  });

  const [designSettings, setDesignSettings] = useState({
    typography: initializeState(DEFAULT_BUNDLE_VALUES.typography, "typography"),
    spacing: initializeState(DEFAULT_BUNDLE_VALUES.spacing, "spacing"),
    shapes: initializeState(DEFAULT_BUNDLE_VALUES.shapes, "shapes"),
    borderThickness: initializeState(DEFAULT_BUNDLE_VALUES.borderThickness, "borderThickness"),
    colors: initializeState(DEFAULT_BUNDLE_VALUES.colors, "colors")
  });

  const [generalSettings, setGeneralSettings] = useState(
    initializeState(DEFAULT_BUNDLE_VALUES.settings, "general")
  );

  // Products state with initialization
  const [products, setProducts] = useState(() => {
    if (isEdit && data?.products && data.products.length > 0) {
      return data.products.map((product, index) => ({
        id: index + 1,
        name: product.name || "",
        quantity: product.quantity || 1,
        productId: product.productId || null,
        image: product.image || null,
        productHandle: product.productHandle || null
      }));
    }
    return DEFAULT_BUNDLE_VALUES.defaultProducts;
  });

  return {
    basicSettings,
    setBasicSettings,
    pricingSettings,
    setPricingSettings,
    highlightSettings,
    setHighlightSettings,
    designSettings,
    setDesignSettings,
    generalSettings,
    setGeneralSettings,
    products,
    setProducts
  };
}