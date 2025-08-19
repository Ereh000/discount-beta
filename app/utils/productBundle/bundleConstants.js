// utils/bundleConstants.js

export const VALIDATION_MESSAGES = {
  NO_PRODUCTS_SELECTED: "Please select at least one product for the bundle.",
  DUPLICATE_BUNDLE_NAME: "Bundle name already exists. Please choose a different name.",
  ALL_POSITION_BUNDLE_EXISTS: "Only one bundle with 'All Products' position is allowed. There is already an existing bundle with 'All Products' position. Please choose a different position or edit the existing 'All Products' bundle.",
  EMPTY_BUNDLE_NAME: "Bundle name cannot be empty. Please provide a name for your bundle.",
  INVALID_PRICING: "Please provide valid pricing information.",
  NO_PRODUCTS_SELECTED_FOR_EXCEPT: "Please select products to exclude when using 'All products except selected' option.",
  NO_PRODUCTS_SELECTED_FOR_SPECIFIC: "Please select specific products when using 'Specific products' option.",
  NO_COLLECTIONS_SELECTED: "Please select collections when using 'Specific collections' option.",
};

export const BANNER_MESSAGES = {
  SUCCESS: "Success!",
  ERROR: "Validation Error",
  BUNDLE_SAVED: "Bundle saved successfully",
  BUNDLE_UPDATED: "Bundle updated successfully",
  BUNDLE_DELETED: "Bundle deleted successfully",
};
