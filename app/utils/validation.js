// utils/validation.js

/**
 * Validate discount settings
 */
export function validateDiscountSettings(bundleData) {
  const { pricingOption, discountPercentage, fixedDiscount, fixedPrice } = bundleData;
  
  if (pricingOption === "default") {
    return { isValid: true };
  }
  
  if (pricingOption === "percentage") {
    if (!discountPercentage || discountPercentage.trim() === "" || parseFloat(discountPercentage) <= 0) {
      return { 
        isValid: false, 
        message: "Please enter a valid discount percentage (greater than 0%)" 
      };
    }
    if (parseFloat(discountPercentage) > 100) {
      return { 
        isValid: false, 
        message: "Discount percentage cannot exceed 100%" 
      };
    }
  }
  
  if (pricingOption === "fixedDiscount") {
    if (!fixedDiscount || fixedDiscount.trim() === "" || parseFloat(fixedDiscount) <= 0) {
      return { 
        isValid: false, 
        message: "Please enter a valid fixed discount amount (greater than $0)" 
      };
    }
  }
  
  if (pricingOption === "fixedPrice") {
    if (!fixedPrice || fixedPrice.trim() === "" || parseFloat(fixedPrice) <= 0) {
      return { 
        isValid: false, 
        message: "Please enter a valid fixed bundle price (greater than $0)" 
      };
    }
  }
  
  return { isValid: true };
}
