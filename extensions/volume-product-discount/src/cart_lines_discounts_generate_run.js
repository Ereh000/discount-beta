import {
  DiscountApplicationStrategy,
  run,
} from "@shopify/discount-api";   // Provided by the JS runtime

/**
 * Helpers
 */
const toNumber = (str, fallback = 0) => {
  const n = parseFloat(str);
  return Number.isFinite(n) ? n : fallback;
};

const findOfferForQty = (qty, offers) => {
  // 1: perfect match
  const exact = offers.find((o) => parseInt(o.quantity, 10) === qty);
  if (exact) return exact;

  // 2: highest tier below current quantity
  return offers
    .filter((o) => parseInt(o.quantity, 10) <= qty)
    .sort((a, b) => parseInt(b.quantity, 10) - parseInt(a.quantity, 10))[0] || null;
};

const calcDiscountPerUnit = (offer, unitPrice) => {
  const amt = toNumber(offer.priceAmount);
  switch (offer.priceValue) {
    case "discount_percentage":
      return (unitPrice * amt) / 100;

    case "fixed_price":
      return Math.max(unitPrice - amt, 0);

    case "discount_amount":
      return amt;

    default:
      return 0;
  }
};

/**
 * Entry point
 */
export default run((input) => {
  const metaVal = input?.shop?.metafield?.value;
  if (!metaVal) {
    // No meta → no discount
    return {
      discountApplicationStrategy: DiscountApplicationStrategy.Maximum,
      discounts: [],
    };
  }

  let offersCfg;
  try {
    offersCfg = JSON.parse(metaVal);              // { offers: [], selectedOfferIndex }
  } catch {
    return {
      discountApplicationStrategy: DiscountApplicationStrategy.Maximum,
      discounts: [],
    };
  }

  const { offers = [] } = offersCfg;
  const discounts = [];

  input.cart.lines.forEach((line) => {
    const qty = line.quantity;
    const offer = findOfferForQty(qty, offers);
    if (!offer) return;

    const unit = line.cost.amountPerItem;
    const discountPerUnit = calcDiscountPerUnit(offer, unit.amount);

    if (discountPerUnit <= 0) return;

    const percentage = (discountPerUnit / unit.amount) * 100;

    discounts.push({
      message: offer.subtitle || "Volume discount",
      targets: [{ line: { id: line.id } }],
      value: { percentage: { value: percentage } },
    });
  });

  return {
    discountApplicationStrategy: DiscountApplicationStrategy.Maximum,
    discounts,
  };
});
