// extensions/product-bundle-discount/src/run.js

// @ts-check
import { DiscountApplicationStrategy } from "../generated/api";

const EMPTY_DISCOUNT = {
  discountApplicationStrategy: DiscountApplicationStrategy.First,
  discounts: [],
};

export function run(input) {
  console.log("=== Product Bundle Discount Function Started ===");
  
  const metaValRaw = input.shop.metafield?.value;
  console.log("MetaValRaw exists:", !!metaValRaw);
  
  if (!metaValRaw) {
    console.log("No consolidated bundle discount data found");
    return EMPTY_DISCOUNT;
  }

  let allBundleDiscounts;
  try {
    allBundleDiscounts = JSON.parse(metaValRaw);
    console.log("Parsed bundle discounts count:", allBundleDiscounts?.length || 0);
    
    // Debug each bundle configuration
    if (Array.isArray(allBundleDiscounts)) {
      allBundleDiscounts.forEach((bundle, index) => {
        console.log(`Bundle ${index} (${bundle.bundleName}):`, {
          hasProducts: !!bundle.products,
          productsLength: bundle.products ? bundle.products.length : 0,
          pricingOption: bundle.pricingOption
        });
      });
    }
  } catch (error) {
    console.log("Error parsing consolidated bundle discounts:", error);
    return EMPTY_DISCOUNT;
  }

  if (!Array.isArray(allBundleDiscounts) || allBundleDiscounts.length === 0) {
    console.log("No bundle discounts found in consolidated metafield");
    return EMPTY_DISCOUNT;
  }

  // Get cart information
  const cartInfo = getCartInformation(input.cart.lines);
  const subtotal = parseFloat(input.cart.cost.subtotalAmount.amount);
  
  console.log("Cart summary:", {
    totalQuantity: cartInfo.totalQuantity,
    uniqueProducts: cartInfo.productIds.length,
    subtotal: subtotal
  });

  let bestDiscount = null;
  let bestBundleName = "";

  // Check all published bundle discounts to find applicable ones
  for (const bundleDiscount of allBundleDiscounts) {
    console.log(`\n--- Processing Bundle: ${bundleDiscount.bundleName} ---`);
    
    // Skip if pricing option is default (no discount)
    if (bundleDiscount.pricingOption === "default") {
      console.log("Pricing option is 'default' - skipping");
      continue;
    }
    
    // Check if bundle products are present in cart
    const meetsConditions = checkBundleProductsInCart(bundleDiscount, cartInfo);
    if (!meetsConditions) {
      console.log("Bundle requirements not met - skipping");
      continue;
    }
    
    // Calculate discount for this bundle
    const discount = calculateBundleDiscount(bundleDiscount, cartInfo, input.cart.lines, subtotal);
    if (discount && (!bestDiscount || discount.discountAmount > bestDiscount.discountAmount)) {
      bestDiscount = discount;
      bestBundleName = bundleDiscount.bundleName;
      console.log(`✅ New best discount found: $${discount.discountAmount.toFixed(2)} from ${bundleDiscount.bundleName}`);
    }
  }

  if (!bestDiscount || bestDiscount.discountAmount <= 0) {
    console.log("No applicable bundle discounts found");
    return EMPTY_DISCOUNT;
  }

  console.log(`Using best discount from ${bestBundleName}: $${bestDiscount.discountAmount.toFixed(2)}`);
  
  const result = {
    discountApplicationStrategy: DiscountApplicationStrategy.First,
    discounts: [
      {
        message: bestDiscount.message,
        value: bestDiscount.value,
        targets: bestDiscount.targets
      }
    ]
  };

  console.log("Final discount applied:", {
    message: bestDiscount.message,
    targetsCount: bestDiscount.targets.length
  });
  console.log("=== Product Bundle Discount Function Completed ===");
  
  return result;
}

/**
 * Extract cart information for easier processing
 */
function getCartInformation(cartLines) {
  const productIds = [];
  const variantQuantities = {};
  const productQuantities = {};
  
  cartLines.forEach((line, index) => {
    if (line.merchandise.__typename === "ProductVariant") {
      const productId = line.merchandise.product.id;
      const variantId = line.merchandise.id;
      
      productIds.push(productId);
      variantQuantities[variantId] = line.quantity;
      
      // Track product quantities (sum all variants of same product)
      if (productQuantities[productId]) {
        productQuantities[productId] += line.quantity;
      } else {
        productQuantities[productId] = line.quantity;
      }
      
      console.log(`Cart line ${index}:`, {
        productId: productId.split('/').pop(), // Show just the ID part
        variantId: variantId.split('/').pop(),
        quantity: line.quantity
      });
    }
  });
  
  const totalQuantity = cartLines.reduce((sum, line) => sum + line.quantity, 0);
  
  return {
    productIds: [...new Set(productIds)], // Remove duplicates
    variantQuantities,
    productQuantities,
    totalQuantity,
    totalLines: cartLines.length
  };
}

/**
 * Check if all bundle products are present in cart with required quantities
 */
function checkBundleProductsInCart(bundleDiscount, cartInfo) {
  const { products, bundleName } = bundleDiscount;
  
  console.log(`Checking bundle products for: ${bundleName}`);
  
  if (!products || !Array.isArray(products) || products.length === 0) {
    console.log("❌ No products defined in bundle");
    return false;
  }
  
  console.log(`Bundle has ${products.length} required products`);
  
  let allProductsValid = true;
  
  // Check each required bundle product
  products.forEach((bundleProduct, index) => {
    if (!bundleProduct.productId || !bundleProduct.name) {
      console.log(`❌ Invalid bundle product at index ${index}:`, bundleProduct);
      allProductsValid = false;
      return;
    }
    
    // Convert productId to GID format if needed
    const productGid = bundleProduct.productId.startsWith('gid://shopify/Product/') 
      ? bundleProduct.productId 
      : `gid://shopify/Product/${bundleProduct.productId}`;
    
    const requiredQuantity = parseInt(bundleProduct.quantity) || 1;
    const cartQuantity = cartInfo.productQuantities[productGid] || 0;
    
    console.log(`Product "${bundleProduct.name}":`, {
      productId: productGid.split('/').pop(),
      requiredQty: requiredQuantity,
      cartQty: cartQuantity,
      sufficient: cartQuantity >= requiredQuantity ? '✅' : '❌'
    });
    
    // Check if cart has enough quantity of this product
    if (cartQuantity < requiredQuantity) {
      console.log(`❌ Insufficient quantity for "${bundleProduct.name}": need ${requiredQuantity}, have ${cartQuantity}`);
      allProductsValid = false;
    }
  });
  
  if (allProductsValid) {
    console.log("✅ All bundle products found with sufficient quantities");
    return true;
  } else {
    console.log("❌ Bundle requirements not met");
    return false;
  }
}

/**
 * Calculate discount for a specific bundle
 */
function calculateBundleDiscount(bundleDiscount, cartInfo, cartLines, subtotal) {
  const { pricingOption, discountValue, bundleName, products } = bundleDiscount;
  
  console.log(`Calculating discount for "${bundleName}"`);
  console.log(`Pricing: ${pricingOption} = ${discountValue}`);
  
  // Get target variants that are part of the bundle
  const targets = getBundleDiscountTargets(bundleDiscount, cartLines);
  if (targets.length === 0) {
    console.log("❌ No valid discount targets found");
    return null;
  }
  
  let discountAmount = 0;
  let discountValue_obj = null;
  let message = "";
  
  switch (pricingOption) {
    case "percentage":
      const percentage = parseFloat(discountValue);
      if (isNaN(percentage) || percentage <= 0) {
        console.log(`❌ Invalid percentage value: ${discountValue}`);
        return null;
      }
      
      discountAmount = (subtotal * percentage) / 100;
      discountValue_obj = {
        percentage: {
          value: percentage.toString()
        }
      };
      message = `${bundleName}: ${percentage}% off bundle items`;
      break;
      
    case "fixedDiscount":
      const fixedAmount = parseFloat(discountValue);
      if (isNaN(fixedAmount) || fixedAmount <= 0) {
        console.log(`❌ Invalid fixed discount value: ${discountValue}`);
        return null;
      }
      
      // Calculate based on how many complete bundle sets are in cart
      const bundleSetCount = calculateBundleSetCount(products, cartInfo);
      discountAmount = fixedAmount * bundleSetCount;
      
      discountValue_obj = {
        fixedAmount: {
          amount: discountAmount.toString()
        }
      };
      message = `${bundleName}: $${fixedAmount} off per bundle (${bundleSetCount} set${bundleSetCount !== 1 ? 's' : ''})`;
      break;
      
    case "fixedPrice":
      const fixedPrice = parseFloat(discountValue);
      if (isNaN(fixedPrice) || fixedPrice <= 0) {
        console.log(`❌ Invalid fixed price value: ${discountValue}`);
        return null;
      }
      
      // Calculate how much to discount to reach the fixed price
      const bundleProductsSubtotal = calculateBundleProductsSubtotal(bundleDiscount, cartLines, subtotal);
      console.log(`Bundle products subtotal: $${bundleProductsSubtotal.toFixed(2)}`);
      
      if (fixedPrice < bundleProductsSubtotal) {
        discountAmount = bundleProductsSubtotal - fixedPrice;
        const calculatedPercentage = (discountAmount / bundleProductsSubtotal) * 100;
        
        discountValue_obj = {
          percentage: {
            value: calculatedPercentage.toString()
          }
        };
        message = `${bundleName}: Bundle fixed at $${fixedPrice}`;
      } else {
        console.log(`❌ Fixed price ($${fixedPrice}) is not less than bundle subtotal ($${bundleProductsSubtotal.toFixed(2)})`);
        return null;
      }
      break;
      
    default:
      console.log(`❌ Unknown pricing option: ${pricingOption}`);
      return null;
  }
  
  if (!discountValue_obj || discountAmount <= 0) {
    console.log("❌ Could not calculate valid discount");
    return null;
  }
  
  console.log(`✅ Calculated discount: $${discountAmount.toFixed(2)}`);
  
  return {
    discountAmount,
    message,
    value: discountValue_obj,
    targets
  };
}

/**
 * Calculate how many complete bundle sets can be made from cart items
 */
function calculateBundleSetCount(products, cartInfo) {
  let minSets = Infinity;
  
  products.forEach(product => {
    const productGid = product.productId.startsWith('gid://shopify/Product/') 
      ? product.productId 
      : `gid://shopify/Product/${product.productId}`;
    
    const requiredQty = parseInt(product.quantity) || 1;
    const cartQty = cartInfo.productQuantities[productGid] || 0;
    const possibleSets = Math.floor(cartQty / requiredQty);
    
    minSets = Math.min(minSets, possibleSets);
  });
  
  return minSets === Infinity ? 0 : minSets;
}

/**
 * Get discount targets (only bundle product variants)
 */
function getBundleDiscountTargets(bundleDiscount, cartLines) {
  const { products, bundleName } = bundleDiscount;
  const targets = [];
  
  if (!products || !Array.isArray(products)) {
    console.log(`❌ No products array for bundle: ${bundleName}`);
    return targets;
  }
  
  // Get all bundle product IDs
  const bundleProductIds = products
    .filter(product => product.productId && product.name) // Only valid products
    .map(product => {
      return product.productId.startsWith('gid://shopify/Product/') 
        ? product.productId 
        : `gid://shopify/Product/${product.productId}`;
    });
  
  console.log(`Bundle product IDs for targeting (${bundleProductIds.length}):`, 
    bundleProductIds.map(id => id.split('/').pop()));
  
  cartLines.forEach((line, index) => {
    if (line.merchandise.__typename !== "ProductVariant") {
      return;
    }
    
    const productId = line.merchandise.product.id;
    const variantId = line.merchandise.id;
    
    // Only target variants of bundle products
    if (bundleProductIds.includes(productId)) {
      targets.push({
        productVariant: {
          id: variantId,
          quantity: line.quantity
        }
      });
      
      console.log(`✅ Target added: Product ${productId.split('/').pop()}, Variant ${variantId.split('/').pop()}, Qty ${line.quantity}`);
    }
  });
  
  console.log(`Total discount targets: ${targets.length}`);
  return targets;
}

/**
 * Calculate subtotal for bundle products only (for fixed price calculations)
 */
function calculateBundleProductsSubtotal(bundleDiscount, cartLines, totalSubtotal) {
  const { products } = bundleDiscount;
  
  if (!products || !Array.isArray(products)) {
    console.log("❌ No products for subtotal calculation");
    return 0;
  }
  
  const bundleProductIds = products
    .filter(product => product.productId && product.name)
    .map(product => {
      return product.productId.startsWith('gid://shopify/Product/') 
        ? product.productId 
        : `gid://shopify/Product/${product.productId}`;
    });
  
  // Count bundle items vs total items for proportional calculation
  const bundleItemCount = cartLines.filter(line => 
    line.merchandise.__typename === "ProductVariant" && 
    bundleProductIds.includes(line.merchandise.product.id)
  ).reduce((sum, line) => sum + line.quantity, 0);
  
  const totalItemCount = cartLines.reduce((sum, line) => sum + line.quantity, 0);
  
  if (totalItemCount === 0) {
    return 0;
  }
  
  // Approximate bundle subtotal as proportional to item count
  // This is a simplification - ideally you'd get actual product prices from GraphQL
  const bundleSubtotal = (bundleItemCount / totalItemCount) * totalSubtotal;
  
  console.log(`Bundle items: ${bundleItemCount}/${totalItemCount}, Estimated subtotal: $${bundleSubtotal.toFixed(2)}`);
  
  return bundleSubtotal;
}
