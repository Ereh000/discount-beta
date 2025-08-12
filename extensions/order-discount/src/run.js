// @ts-check
import { DiscountApplicationStrategy } from "../generated/api";

const EMPTY_DISCOUNT = {
  discountApplicationStrategy: DiscountApplicationStrategy.First,
  discounts: [],
};

export function run(input) {
  const metaValRaw = input.shop.metafield?.value;
  console.log("All Offers MetaValRaw:", metaValRaw);
  
  if (!metaValRaw) {
    console.log("No consolidated volume discount data found");
    return EMPTY_DISCOUNT;
  }

  let allBundleOffers;
  try {
    allBundleOffers = JSON.parse(metaValRaw);
    console.log("All Bundle Offers:", allBundleOffers);
  } catch (error) {
    console.log("Error parsing consolidated volume offers:", error);
    return EMPTY_DISCOUNT;
  }

  if (!Array.isArray(allBundleOffers) || allBundleOffers.length === 0) {
    console.log("No bundle offers found in consolidated metafield");
    return EMPTY_DISCOUNT;
  }

  const totalQty = input.cart.lines.reduce((sum, line) => sum + line.quantity, 0);
  const subtotal = input.cart.cost.subtotalAmount.amount;
  console.log("Total Qty:", totalQty, "Subtotal:", subtotal);

  let bestOffer = null;
  let bestDiscountAmount = 0;
  let bestBundleName = "";

  // Check all published bundle offers to find the best one
  for (const bundleOffer of allBundleOffers) {
    const offers = bundleOffer.offers || [];
    
    if (!Array.isArray(offers) || offers.length === 0) {
      continue;
    }

    // Find the best applicable offer from this bundle
    const applicableOffer = offers
      .filter(o => parseInt(o.quantity, 10) <= totalQty)
      .sort((a, b) => parseInt(b.quantity, 10) - parseInt(a.quantity, 10))[0];

    if (applicableOffer) {
      let discountAmount = 0;
      
      if (applicableOffer.priceValue === "discount_percentage") {
        discountAmount = (subtotal * parseFloat(applicableOffer.priceAmount)) / 100;
      } else if (applicableOffer.priceValue === "fixed_price") {
        discountAmount = parseFloat(applicableOffer.priceAmount) * totalQty;
      } else if (applicableOffer.priceValue === "discount_amount") {
        discountAmount = parseFloat(applicableOffer.priceAmount) * totalQty;
      }

      console.log(`${bundleOffer.bundleName} - Offer: ${applicableOffer.title}, Discount: ${discountAmount}`);

      // Keep track of the best offer (highest discount)
      if (discountAmount > bestDiscountAmount) {
        bestOffer = applicableOffer;
        bestDiscountAmount = discountAmount;
        bestBundleName = bundleOffer.bundleName;
      }
    }
  }

  if (!bestOffer || bestDiscountAmount <= 0) {
    console.log("No applicable offers found across all bundles");
    return EMPTY_DISCOUNT;
  }

  console.log(`Using best offer from ${bestBundleName}:`, bestOffer);

  const percentage = (bestDiscountAmount / subtotal) * 100;
  console.log("Final Discount Percentage:", percentage);

  return {
    discountApplicationStrategy: DiscountApplicationStrategy.First,
    discounts: [
      {
        message: `${bestOffer.subtitle || "Volume discount applied"} (${bestBundleName})`,
        value: {
          percentage: {
            value: Math.min(percentage, 100).toFixed(2)
          }
        },
        targets: [
          {
            orderSubtotal: {
              excludedVariantIds: []
            }
          }
        ]
      }
    ]
  };
}
