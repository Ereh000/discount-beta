// Components/Productbundle/BundleSettings.jsx

import { useState, useCallback } from "react";
import { Tabs, LegacyCard } from "@shopify/polaris";

// Import tab subcomponents
import BlockTab from "./BundleSettingsTabs/BlockTab";
import OfferTab from "./BundleSettingsTabs/OfferTab";
import FontSizeTab from "./BundleSettingsTabs/FontSizeTab";
import ColorsTab from "./BundleSettingsTabs/ColorsTab";

// Default values to prevent undefined errors
const DEFAULT_BASIC_SETTINGS = {
  bundleName: '',
  headerText: '',
  alignment: 'left',
  footerText: '',
  buttonText: 'Add to Cart',
  position: 'specific',
  selectedColor: '#000000',
  productImageSize: 50,
  iconStyle: 'default'
};

const DEFAULT_PRICING_SETTINGS = {
  option: 'default',
  discountPercentage: '',
  fixedDiscount: '',
  fixedPrice: ''
};

const DEFAULT_HIGHLIGHT_SETTINGS = {
  option: 'text',
  title: '',
  timerTitle: '',
  isBlinking: false,
  style: 'solid',
  timerEndDate: '',
  timerFormat: 'dd:hh:mm:ss'
};

const DEFAULT_DESIGN_SETTINGS = {
  typography: {
    header: { size: '18', weight: 'Bold' },
    titlePrice: { size: '16', weight: 'Regular' }
  },
  spacing: {
    bundleTop: '0',
    bundleBottom: '0',
    footerTop: '0',
    footerBottom: '0'
  },
  shapes: {
    bundle: 'Squared',
    footer: 'Squared',
    addToCart: 'Squared'
  },
  borderThickness: {
    bundle: 0,
    footer: 0,
    addToCart: 0
  },
  colors: {
    background: '#ffffff',
    border: '#e1e5e9',
    footerBackground: '#f6f6f7',
    buttonBackground: '#000000',
    highlightBackground: '#ff6b35',
    quantityBackground: '#f6f6f7',
    headerText: '#000000',
    titleText: '#000000',
    price: '#000000',
    comparedPrice: '#999999',
    highlightText: '#ffffff',
    addToCartText: '#ffffff',
    quantityText: '#000000',
    footerText: '#000000'
  }
};

const DEFAULT_GENERAL_SETTINGS = {
  variantChoice: false,
  showPrices: false,
  showComparePrice: false
};

export default function BundleSettingsCard({
  // Grouped state objects with comprehensive defaults
  basicSettings = DEFAULT_BASIC_SETTINGS,
  setBasicSettings = () => {},
  pricingSettings = DEFAULT_PRICING_SETTINGS,
  setPricingSettings = () => {},
  highlightSettings = DEFAULT_HIGHLIGHT_SETTINGS,
  setHighlightSettings = () => {},
  designSettings = DEFAULT_DESIGN_SETTINGS,
  setDesignSettings = () => {},
  generalSettings = DEFAULT_GENERAL_SETTINGS,
  setGeneralSettings = () => {},
  products = [],
  setProducts = () => {},
  // Product management handlers
  handleAddProduct = () => {},
  handleRemoveProduct = () => {},
  handleSettingChange = () => {},
  // Validation props (optional)
  hasAllPositionBundle = false,
  isEdit = false,
  originalPosition = 'specific',
}) {
  const [selected, setSelected] = useState(0);

  // Merge props with defaults to ensure all properties exist
  const safeBasicSettings = { ...DEFAULT_BASIC_SETTINGS, ...basicSettings };
  const safePricingSettings = { ...DEFAULT_PRICING_SETTINGS, ...pricingSettings };
  const safeHighlightSettings = { ...DEFAULT_HIGHLIGHT_SETTINGS, ...highlightSettings };
  const safeDesignSettings = {
    ...DEFAULT_DESIGN_SETTINGS,
    ...designSettings,
    typography: { ...DEFAULT_DESIGN_SETTINGS.typography, ...designSettings?.typography },
    spacing: { ...DEFAULT_DESIGN_SETTINGS.spacing, ...designSettings?.spacing },
    shapes: { ...DEFAULT_DESIGN_SETTINGS.shapes, ...designSettings?.shapes },
    borderThickness: { ...DEFAULT_DESIGN_SETTINGS.borderThickness, ...designSettings?.borderThickness },
    colors: { ...DEFAULT_DESIGN_SETTINGS.colors, ...designSettings?.colors }
  };
  const safeGeneralSettings = { ...DEFAULT_GENERAL_SETTINGS, ...generalSettings };

  // Tab change handler
  const handleTabChange = useCallback(
    (selectedTabIndex) => setSelected(selectedTabIndex),
    [],
  );

  // Safe update helpers with error handling
  const updateBasicSetting = useCallback((key, value) => {
    try {
      if (typeof setBasicSettings === 'function') {
        setBasicSettings(prev => ({ ...prev, [key]: value }));
      }
    } catch (error) {
      console.warn('Error updating basic setting:', error);
    }
  }, [setBasicSettings]);

  const updatePricingSetting = useCallback((key, value) => {
    try {
      if (typeof setPricingSettings === 'function') {
        setPricingSettings(prev => ({ ...prev, [key]: value }));
      }
    } catch (error) {
      console.warn('Error updating pricing setting:', error);
    }
  }, [setPricingSettings]);

  const updateHighlightSetting = useCallback((key, value) => {
    try {
      if (typeof setHighlightSettings === 'function') {
        setHighlightSettings(prev => ({ ...prev, [key]: value }));
      }
    } catch (error) {
      console.warn('Error updating highlight setting:', error);
    }
  }, [setHighlightSettings]);

  const updateDesignSetting = useCallback((key, value) => {
    try {
      if (typeof setDesignSettings === 'function') {
        setDesignSettings(prev => ({ ...prev, [key]: value }));
      }
    } catch (error) {
      console.warn('Error updating design setting:', error);
    }
  }, [setDesignSettings]);

  // Safe product update handler
  const handleProductUpdate = useCallback((updatedProducts) => {
    try {
      if (typeof setProducts === 'function') {
        setProducts(updatedProducts);
      }
    } catch (error) {
      console.warn('Error updating products:', error);
    }
  }, [setProducts]);

  const tabs = [
    { id: "block", content: "Block" },
    { id: "offer", content: "Offer" },
    { id: "font-size", content: "Font & size" },
    { id: "colors", content: "Colors" },
  ];

  // Common props for all tabs
  const commonProps = {
    basicSettings: safeBasicSettings,
    updateBasicSetting,
    pricingSettings: safePricingSettings,
    updatePricingSetting,
    highlightSettings: safeHighlightSettings,
    updateHighlightSetting,
    designSettings: safeDesignSettings,
    updateDesignSetting,
    generalSettings: safeGeneralSettings,
    handleSettingChange,
    products,
    handleProductUpdate,
    handleAddProduct,
    handleRemoveProduct,
    hasAllPositionBundle,
    isEdit,
    originalPosition,
  };

  const renderTabContent = () => {
    switch (selected) {
      case 0:
        return <BlockTab {...commonProps} />;
      case 1:
        return <OfferTab {...commonProps} />;
      case 2:
        return <FontSizeTab {...commonProps} />;
      case 3:
        return <ColorsTab {...commonProps} />;
      default:
        return <BlockTab {...commonProps} />;
    }
  };

  return (
    <>
      <LegacyCard>
        <div className="tab" style={{ padding: "7px 0" }}>
          <Tabs tabs={tabs} selected={selected} onSelect={handleTabChange} />
        </div>
      </LegacyCard>

      <LegacyCard>
        <div style={{ padding: "16px" }}>
          {renderTabContent()}
        </div>
      </LegacyCard>
    </>
  );
}  
