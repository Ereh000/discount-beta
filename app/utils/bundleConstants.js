export const DEFAULT_BUNDLE_VALUES = {
  // Basic settings
  bundleName: "Bundle 1",
  headerText: "Frequently bought together",
  alignment: "left",
  footerText: "Total :",
  buttonText: "Claim Offer",
  position: "all",

  selectedColor: "purple",
  productImageSize: "56",  
  iconStyle: "Plus 5",

  // Pricing settings
  pricing: {
    option: "default",
    discountPercentage: "10",
    fixedDiscount: "25",
    fixedPrice: "99"
  },

  // Highlight settings
  highlight: {
    option: "text",
    title: "Unlock Your Discount",
    timerTitle: "Offer ends in",
    isBlinking: false,
    style: "solid",
    timerEndDate: "",
    timerFormat: "dd:hh:mm:ss"
  },

  // Typography settings
  typography: {
    header: { size: "18", weight: "Bold" },
    titlePrice: { size: "16", weight: "Bold" },
    quantityPrice: { size: "13", fontStyle: "Regular" },
    highlight: { size: "10.5", fontStyle: "Bold" }
  },

  // Spacing settings
  spacing: {
    bundleTop: "10",
    bundleBottom: "6",
    footerTop: "20",
    footerBottom: "10"
  },

  // Shape settings
  shapes: {
    bundle: "Rounded",
    footer: "Rounded",
    addToCart: "Rounded"
  },

  // Border thickness
  borderThickness: {
    bundle: "1",
    footer: "0",
    addToCart: "2"
  },

  // Color settings
  colors: {
    background: "",
    border: "#E1E3E5",
    footerBackground: "#F6F6F7",
    buttonBackground: "",
    buttonBorder: "",
    highlightBackground: "",
    quantityBackground: "",
    price: "#000000",
    comparedPrice: "#FF0000",
    headerText: "#000000",
    titleText: "#000000",
    highlightText: "#FFFFFF",
    addToCartText: "#FFFFFF",
    quantityText: "#000000",
    footerText: ""
  },

  // General settings
  settings: {
    variantChoice: true,
    showPrices: true,
    showComparePrice: true
  },

  // Default products
  defaultProducts: [
    {
      id: 1,
      name: "",
      quantity: 1,
      productId: null,
      image: null,
      productHandle: null
    },
    {
      id: 2,
      name: "",
      quantity: 1,
      productId: null,
      image: null,
      productHandle: null
    },
    {
      id: 3,
      name: "",
      quantity: 1,
      productId: null,
      image: null,
      productHandle: null
    }
  ]
};

export const VALIDATION_MESSAGES = {
  NO_PRODUCTS_SELECTED: "Please select at least one product for your bundle before saving."
};

export const BANNER_MESSAGES = {
  SUCCESS: "Success!",
  ERROR: "Something went wrong"
};