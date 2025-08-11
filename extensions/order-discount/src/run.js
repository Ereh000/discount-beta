// @ts-check
import { DiscountApplicationStrategy } from "../generated/api";

/**
 * @typedef {import("../generated/api").RunInput} RunInput
 * @typedef {import("../generated/api").FunctionRunResult} FunctionRunResult
 */

const EMPTY_DISCOUNT = {
  discountApplicationStrategy: DiscountApplicationStrategy.First,
  discounts: [],
};

/**
 * @param {RunInput} input
 * @returns {FunctionRunResult}
 */
export function run(input) {
  const metaValRaw = input.shop.metafield?.value;
  console.log("MetaValRaw:", metaValRaw);
  let metaVal;
  try {
    metaVal = JSON.parse(metaValRaw);
    console.log("MetaVal:", metaVal);
  } catch (error) {
    console.log("Error parsing metaValRaw:", error);
    return EMPTY_DISCOUNT;
  }
  if (!metaVal || !metaVal.offers) {
    console.log("No offers found");
    return EMPTY_DISCOUNT;
  }

  const offers = metaVal.offers;
  console.log("Offers:", offers);

  const totalQty = input.cart.lines.reduce((sum, line) => sum + line.quantity, 0);
  console.log("Total Qty:", totalQty);


  const offer = offers
    .filter(o => parseInt(o.quantity, 10) <= totalQty)
    .sort((a, b) => parseInt(b.quantity, 10) - parseInt(a.quantity, 10))[0];

  if (!offer) return EMPTY_DISCOUNT;

  const subtotal = input.cart.cost.subtotalAmount.amount;
  console.log("Subtotal:", subtotal);
  let discountAmount = 0;

  if (offer.priceValue === "discount_percentage") {
    console.log("Discount Percentage:", offer.priceAmount);
    discountAmount = (subtotal * parseFloat(offer.priceAmount)) / 100;
  } else if (offer.priceValue === "fixed_price") {
    console.log("Fixed Price:", offer.priceAmount);
    // const newSubtotal = parseFloat(offer.priceAmount) * totalQty;
    // discountAmount = Math.max(subtotal - newSubtotal, 0);
    discountAmount = parseFloat(offer.priceAmount) * totalQty;
  } else if (offer.priceValue === "discount_amount") {
    console.log("Discount Amount:", offer.priceAmount);
    discountAmount = parseFloat(offer.priceAmount) * totalQty;
  }

  if (discountAmount <= 0) return EMPTY_DISCOUNT;

  const percentage = (discountAmount / subtotal) * 100;
  console.log("Discount Percentage:", percentage);

  return {
    discountApplicationStrategy: DiscountApplicationStrategy.First,
    discounts: [
      {
        message: offer.subtitle || "Volume order discount applied",
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