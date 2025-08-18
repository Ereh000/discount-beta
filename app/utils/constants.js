// utils/constants.js

export const DEFAULT_VALUES = {
  bundleName: "Bundle 1",
  visibilitySettings: { visibility: "all_products" },
  headerSettings: {
    headerText: "Choose your offer",
    alignment: "center",
    headerLine: true,
    lineThickness: 2,
  },
  shapeSettings: {
    blockRadius: 12,
    blockThickness: 2,
  },
  spacingSettings: {
    spacingTop: 10,
    spacingBottom: 10,
  },
  checkmarkSettings: { checkmarkVisibility: "showRadio" },
  offers: [
    {
      id: "offer-1",
      title: "Single",
      subtitle: "Standard price",
      quantity: "1",
      image: null,
      priceType: "default",
      priceValue: "discount_percentage",
      priceAmount: "10",
      highlight: false,
      selectedByDefault: true,
      tag: "",
      highlightSettings: {
        type: "text",
        text: "MOST POPULAR",
        blinking: false,
        style: "pill",
        shape: "rounded",
      },
    },
  ],
  selectedOfferIndex: 0,
  backgroundColors: {
    bundle: { red: 230, green: 230, blue: 230, alpha: 0.5 },
    border: { red: 128, green: 128, blue: 128, alpha: 1 },
    checkmark: { red: 0, green: 0, blue: 0, alpha: 1 },
    highlight: { red: 0, green: 0, blue: 0, alpha: 1 },
    selectedBundle: { red: 255, green: 255, blue: 255, alpha: 1 },
    borderSelectedBundle: { red: 0, green: 0, blue: 0, alpha: 1 },
    tags: { red: 128, green: 128, blue: 128, alpha: 0.5 },
  },
  pricingColors: {
    price: { red: 0, green: 0, blue: 0, alpha: 1 },
    comparedPrice: { red: 255, green: 0, blue: 0, alpha: 1 },
  },
  textColors: {
    header: { red: 0, green: 0, blue: 0, alpha: 1 },
    title: { red: 0, green: 0, blue: 0, alpha: 1 },
    subtitle: { red: 128, green: 128, blue: 128, alpha: 1 },
    highlight: { red: 255, green: 255, blue: 255, alpha: 1 },
    tags: { red: 128, green: 128, blue: 128, alpha: 1 },
  },
  typographySettings: {
    header: { size: "16", fontStyle: "Bold" },
    titlePrice: { size: "16", fontStyle: "Bold" },
    subtitleComparedPrice: { size: "14", fontStyle: "Regular" },
    tagHighlight: { size: "12", fontStyle: "Regular" },
  },
  advancedSettings: {
    pricing: {
      showPricesPerItem: false,
      showCompareAtPrice: true,
    },
  },
};

export const VALIDATION_MESSAGES = {
  EMPTY_BUNDLE_NAME:
    "Bundle name cannot be empty. Please provide a name for your bundle.",
  NO_VALID_OFFERS:
    "Please add at least one valid offer with a title and a positive quantity.",
  DUPLICATE_QUANTITIES:
    "Each offer must have a unique quantity. Please ensure all quantities are distinct.",
  NO_DUPLICATE_BUNDLE_NAME:
    "Bundle name already exists. No duplicate bundleName allowed.",
  EMPTY_PRICE_AMOUNT:
    "Offer priceAmount cannot be empty. Please provide a valid price amount.",
  ALL_PRODUCTS_BUNDLE_EXISTS:
    "Only one 'All Products' bundle is allowed. There is already an existing bundle with 'All Products' visibility. Please choose a different visibility option or edit the existing 'All Products' bundle.",
};
