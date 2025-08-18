// hooks/useValidation.js
import { useCallback } from "react";
import { VALIDATION_MESSAGES } from "../utils/constants";

export function useValidation() {
  const validateBundleName = useCallback((bundleName) => {
    return bundleName && bundleName.trim() !== "";
  }, []);

  const validateVisibilitySettings = useCallback(
    (currentVisibility, hasAllProductsBundle, isEdit, originalVisibility) => {
      // If trying to set visibility to "all_products"
      if (currentVisibility === "all_products") {
        // If creating a new bundle and there's already an "all_products" bundle
        if (!isEdit && hasAllProductsBundle) {
          return {
            isValid: false,
            message: VALIDATION_MESSAGES.ALL_PRODUCTS_BUNDLE_EXISTS,
          };
        }

        // If editing and changing FROM another visibility TO "all_products"
        // and there's already an "all_products" bundle
        if (
          isEdit &&
          originalVisibility !== "all_products" &&
          hasAllProductsBundle
        ) {
          return {
            isValid: false,
            message: VALIDATION_MESSAGES.ALL_PRODUCTS_BUNDLE_EXISTS,
          };
        }
      }

      return { isValid: true };
    },
    [],
  );

  const validateOffers = useCallback(
    (offers, currentBundleName, existingBundleNames) => {
      // Check for empty priceAmount in any offer
      for (const offer of offers) {
        if (
          offer.priceAmount === "" ||
          offer.priceAmount === "0" ||
          !offer.priceAmount
        ) {
          return {
            isValid: false,
            message: VALIDATION_MESSAGES.EMPTY_PRICE_AMOUNT,
          };
        }
      }

      // Check for duplicate bundleName (exclude current bundle if editing)
      if (
        existingBundleNames &&
        existingBundleNames.includes(currentBundleName.trim())
      ) {
        return {
          isValid: false,
          message: VALIDATION_MESSAGES.NO_DUPLICATE_BUNDLE_NAME,
        };
      }

      const validOffers = offers.filter((offer) => {
        const isValidTitle = offer.title && offer.title.trim() !== "";
        const isValidQuantity =
          offer.quantity &&
          !isNaN(parseInt(offer.quantity)) &&
          parseInt(offer.quantity) > 0;
        return isValidTitle && isValidQuantity;
      });

      if (validOffers.length === 0) {
        return { isValid: false, message: VALIDATION_MESSAGES.NO_VALID_OFFERS };
      }

      // Check for unique quantities
      const quantities = validOffers.map((offer) => parseInt(offer.quantity));
      const uniqueQuantities = new Set(quantities);
      if (uniqueQuantities.size !== quantities.length) {
        return {
          isValid: false,
          message: VALIDATION_MESSAGES.DUPLICATE_QUANTITIES,
        };
      }

      return { isValid: true };
    },
    [],
  );

  return { validateBundleName, validateOffers, validateVisibilitySettings };
}
