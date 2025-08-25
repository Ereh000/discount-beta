/* product-bundle.js - Product Bundle with Inline Errors and Fixed Variant Selection */
const shopUrl = window.shopUrl;
let bundle = null;
let settings = null;
let products = [];
let bundleTracker = null;

const dom = {};

// Predefined triggers for different themes and page structures
const INJECTION_TRIGGERS = [
  { selector: ".product__info-container", position: "inside-end" },
  { selector: ".product-form", position: "after" },
  { selector: "[data-product-form]", position: "after" },
  { selector: "product-form", position: "after" },
  { selector: ".product__details", position: "inside-end" },
  { selector: ".product-info", position: "inside-end" },
  { selector: ".product__info", position: "inside-end" },
  { selector: ".product-single__meta", position: "inside-end" },
  { selector: ".buy-buttons-block", position: "after" },
  { selector: "product-form-component", position: "after" },
  { selector: ".quantity-selector", position: "after" },
  { selector: "[data-quantity-selector]", position: "after" },
  { selector: ".product__quantity", position: "after" },
  { selector: ".product-form__buttons", position: "before" },
  { selector: ".product__buttons", position: "before" },
  { selector: "[data-add-to-cart]", position: "before" },
  { selector: ".product", position: "inside-end" },
  { selector: ".product-single", position: "inside-end" },
  { selector: "main .container", position: "inside-end" },
];

// Bundle Tracker Class
class BundleTracker {
  constructor(shopDomain, bundleId, bundleName) {
    this.shopDomain = shopDomain;
    this.bundleId = bundleId;
    this.bundleName = bundleName;
    this.apiEndpoint = `${shopDomain}/apps/vol-api/analytics`;
    this.trackImpression();
  }

  async track(type, additionalData = {}) {
    try {
      await fetch(this.apiEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type,
          bundleId: this.bundleId,
          bundleName: this.bundleName,
          ...additionalData,
        }),
      });
    } catch (error) {
      console.error("Bundle tracking error:", error);
    }
  }

  trackImpression() {
    this.track("IMPRESSION");
  }

  trackAddToCart(productIds) {
    this.track("ADD_TO_CART", { productIds });
  }
}

// Smart Injection Manager
class SmartInjector {
  constructor() {
    this.injected = false;
  }

  isProductPage() {
    return (
      document.body.classList.contains("template-product") ||
      window.location.pathname.includes("/products/") ||
      document.querySelector('form[action*="/cart/add"]') ||
      document.querySelector("[data-product-form]") ||
      document.querySelector("product-form")
    );
  }

  findBestTarget() {
    if (!this.isProductPage()) {
      console.log("Not a product page, skipping bundle injection");
      return null;
    }

    for (const trigger of INJECTION_TRIGGERS) {
      const element = document.querySelector(trigger.selector);
      if (element) {
        console.log(
          `Found injection target: ${trigger.selector} (${trigger.position})`,
        );
        return { element, position: trigger.position };
      }
    }

    console.log("No suitable injection target found");
    return null;
  }

  inject() {
    if (this.injected) return true;

    const target = this.findBestTarget();
    if (!target) return false;

    const container = document.createElement("div");
    container.id = "pb-placeholder";
    container.className = "pb-embedded-container";
    container.style.cssText = `margin: 15px 0; width: 100%; clear: both;`;

    this.insertElement(target.element, container, target.position);
    this.injected = true;
    console.log("Bundle container injected successfully");
    return true;
  }

  insertElement(targetElement, container, position) {
    switch (position) {
      case "before":
        targetElement.parentNode.insertBefore(container, targetElement);
        break;
      case "after":
        if (targetElement.nextSibling) {
          targetElement.parentNode.insertBefore(
            container,
            targetElement.nextSibling,
          );
        } else {
          targetElement.parentNode.appendChild(container);
        }
        break;
      case "inside-start":
        targetElement.insertBefore(container, targetElement.firstChild);
        break;
      case "inside-end":
      default:
        targetElement.appendChild(container);
        break;
    }
  }

  setupRetryMechanism() {
    let attempts = 0;
    const maxAttempts = 15;

    const retryInterval = setInterval(() => {
      if (this.injected || attempts >= maxAttempts) {
        clearInterval(retryInterval);
        if (!this.injected) {
          console.log("Failed to inject bundle after maximum attempts");
        }
        return;
      }

      if (this.inject()) {
        clearInterval(retryInterval);
        initializeBundle();
      }

      attempts++;
    }, 300);

    if (typeof MutationObserver !== "undefined") {
      const observer = new MutationObserver((mutations) => {
        if (this.injected) {
          observer.disconnect();
          return;
        }

        for (const mutation of mutations) {
          if (mutation.type === "childList" && mutation.addedNodes.length > 0) {
            if (this.inject()) {
              observer.disconnect();
              initializeBundle();
              break;
            }
          }
        }
      });

      observer.observe(document.body, {
        childList: true,
        subtree: true,
      });

      setTimeout(() => observer.disconnect(), 10000);
    }
  }
}

const injector = new SmartInjector();

// Utility Functions
function hexToRgba(hex, alpha = 1) {
  hex = hex.replace(/^#/, "");
  if (hex.length === 3) {
    hex = hex
      .split("")
      .map((char) => char + char)
      .join("");
  }
  if (hex.length !== 6) {
    throw new Error("Invalid HEX color.");
  }
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function querySelector(selector, rootElement = document) {
  return rootElement.querySelector(selector);
}

function querySelectorAll(selector, rootElement = document) {
  return [...rootElement.querySelectorAll(selector)];
}

// Simplified and reliable variant availability checking
function isVariantAvailable(variant) {
  if (!variant) return false;

  if (variant.hasOwnProperty("availableForSale")) {
    return variant.availableForSale === true;
  }
  if (variant.hasOwnProperty("available")) {
    return variant.available === true;
  }

  const inventoryManagement =
    variant.inventoryManagement || variant.inventory_management;
  if (
    inventoryManagement === null ||
    inventoryManagement === "" ||
    inventoryManagement === "null"
  ) {
    return true;
  }

  const inventoryQty =
    variant.inventoryQuantity ||
    variant.inventory_quantity ||
    variant.quantityAvailable ||
    0;

  const inventoryPolicy =
    variant.inventoryPolicy || variant.inventory_policy || "";

  if (inventoryPolicy === "continue") return true;
  return inventoryQty > 0;
}

function startEmbedInjection() {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
      if (!injector.inject()) {
        injector.setupRetryMechanism();
      } else {
        initializeBundle();
      }
    });
  } else {
    if (!injector.inject()) {
      injector.setupRetryMechanism();
    } else {
      initializeBundle();
    }
  }
}

// Bundle initialization
async function initializeBundle() {
  try {
    await loadBundle();
    if (!bundle) return;

    if (bundle && bundle.id) {
      bundleTracker = new BundleTracker(
        shopUrl,
        bundle.id.toString(),
        bundle.title || bundle.name || `Bundle ${bundle.id}`,
      );
    }

    createBundleDOM();
    cacheDom();
    applyTheme();
    await loadBundleProducts();
    renderProducts();
    recalcTotals();
    bindEvents();
  } catch (error) {
    console.error("Bundle initialization failed:", error);
  }
}

async function loadBundle() {
  try {
    const response = await fetch(`${shopUrl}/apps/vol-api/product-bundle`);
    const data = await response.json();
    console.log("bundle settings data:", data?.bundles?.settings);

    if (data.success && data.bundles?.length > 0) {
      bundle = data.bundles.find(
        (bundleItem) => bundleItem.status === "published",
      );
      settings = bundle?.settings || null;
    }
  } catch (error) {
    console.error("Bundle fetch error", error);
  }
}

async function loadBundleProducts() {
  if (!bundle) return;
  try {
    const response = await fetch(
      `${shopUrl}/apps/vol-api/product-bundle?bundleId=${bundle.id}`,
    );
    const data = await response.json();
    if (data.success && data.fetchedProducts) {
      products = data.fetchedProducts;

      console.log("=== BUNDLE PRODUCTS DEBUG ===");
      products.forEach((product, index) => {
        console.log(`Product ${index + 1}: ${product.title}`);
        console.log(
          "Variants:",
          product.variants?.nodes?.map((v) => ({
            id: v.id,
            title: v.title,
            price: v.price,
            availableForSale: v.availableForSale,
            available: v.available,
            inventoryQuantity: v.inventoryQuantity,
            inventory_quantity: v.inventory_quantity,
            quantityAvailable: v.quantityAvailable,
            inventoryPolicy: v.inventoryPolicy,
            inventory_policy: v.inventory_policy,
            inventoryManagement: v.inventoryManagement,
            inventory_management: v.inventory_management,
            selectedOptions: v.selectedOptions,
            isAvailable: isVariantAvailable(v),
          })),
        );
        console.log("---");
      });
    }
  } catch (error) {
    console.error("Product fetch error", error);
  }
}

function fetchVariants(productGid) {
  return fetch(
    `${shopUrl}/apps/vol-api/product-variant?productId=${productGid}`,
  ).then((response) => response.json());
}

function createBundleDOM() {
  const placeholder = document.getElementById("pb-placeholder");
  if (!placeholder) return;

  const container = document.createElement("div");
  container.id = "pb-root";
  container.className = "pb-container pb-embedded";

  const header = document.createElement("div");
  header.className = "pb-header";

  const heading = document.createElement("h2");
  heading.className = "pb-heading";
  heading.textContent = settings?.header || "Frequently bought together";
  header.appendChild(heading);
  container.appendChild(header);

  const productsDiv = document.createElement("div");
  productsDiv.className = "pb-products";
  container.appendChild(productsDiv);

  const summary = document.createElement("div");
  summary.className = "pb-summary";

  const discountBadge = document.createElement("div");
  discountBadge.className = "pb-discount-badge";
  discountBadge.textContent = settings?.highlight?.title || "";
  summary.appendChild(discountBadge);

  const total = document.createElement("div");
  total.className = "pb-total";

  const label = document.createElement("span");
  label.className = "pb-summary-label";
  label.textContent = settings?.footer || "Total :";
  total.appendChild(label);

  const price = document.createElement("span");
  price.className = "pb-current-price";
  total.appendChild(price);

  summary.appendChild(total);

  const addToCartButton = document.createElement("button");
  addToCartButton.className = "pb-add-to-cart";
  addToCartButton.textContent = settings?.button || "Claim Offer";
  summary.appendChild(addToCartButton);

  // Inline error node below the button
  const errorNode = document.createElement("div");
  errorNode.className = "pb-error";
  errorNode.setAttribute("role", "alert");
  errorNode.setAttribute("aria-live", "polite");
  errorNode.style.display = "none";
  summary.appendChild(errorNode);

  container.appendChild(summary);
  placeholder.appendChild(container);

  ensureBundleErrorStyles();
}

function cacheDom() {
  const rootElement = querySelector("#pb-root");
  if (!rootElement) return;

  Object.assign(dom, {
    root: rootElement,
    heading: querySelector(".pb-heading", rootElement),
    productsWrapper: querySelector(".pb-products", rootElement),
    priceElement: querySelector(".pb-current-price", rootElement),
    discountBadge: querySelector(".pb-discount-badge", rootElement),
    addToCartButton: querySelector(".pb-add-to-cart", rootElement),
    totalSection: querySelector(".pb-total", rootElement),
    errorNode: querySelector(".pb-error", rootElement),
  });
}

// Inline error helpers
function showError(message) {
  if (!dom.errorNode) return;
  dom.errorNode.textContent =
    message || "Something went wrong. Please try again.";
  dom.errorNode.style.display = "block";
  dom.addToCartButton?.classList.add("pb-btn-error");
}

function clearError() {
  if (!dom.errorNode) return;
  dom.errorNode.textContent = "";
  dom.errorNode.style.display = "none";
  dom.addToCartButton?.classList.remove("pb-btn-error");
}

// Theme styling (original logic)
function applyTheme() {
  if (!settings) return;

  const colors = settings.colors || {};
  const typography = settings.typography || {};
  const spacing = settings.spacing || {};
  const shapes = settings.shapes || {};
  const borderThickness = settings.borderThickness || {};

  if (dom.root) {
    if (spacing.bundleTop) dom.root.style.paddingTop = `${spacing.bundleTop}px`;
    if (spacing.bundleBottom)
      dom.root.style.paddingBottom = `${spacing.bundleBottom}px`;
    if (colors.border) dom.root.style.borderColor = colors.border;
    if (shapes.bundle === "Rounded") dom.root.style.borderRadius = "12px";
  }

  if (dom.heading) {
    if (colors.headerText) dom.heading.style.color = colors.headerText;
    if (typography.header?.size)
      dom.heading.style.fontSize = `${typography.header.size}px`;
    if (typography.header?.weight) {
      dom.heading.style.fontWeight =
        typography.header.weight === "Bold"
          ? "700"
          : typography.header.weight === "Lighter"
            ? "300"
            : "400";
    }
    if (settings.alignment) dom.heading.style.textAlign = settings.alignment;
  }

  if (dom.totalSection) {
    if (colors.footerBackground)
      dom.totalSection.style.backgroundColor = colors.footerBackground;
    if (colors.footerText) dom.totalSection.style.color = colors.footerText;
    if (spacing.footerTop)
      dom.totalSection.style.marginTop = `${spacing.footerTop}px`;
    if (spacing.footerBottom)
      dom.totalSection.style.marginBottom = `${spacing.footerBottom}px`;
    if (borderThickness.footer && borderThickness.footer !== "0") {
      dom.totalSection.style.borderWidth = `${borderThickness.footer}px`;
      dom.totalSection.style.borderStyle = "solid";
      if (colors.border) dom.totalSection.style.borderColor = colors.border;
    }
    if (shapes.footer === "Rounded")
      dom.totalSection.style.borderRadius = "7px";
  }

  if (dom.discountBadge) {
    if (colors.highlightBackground)
      dom.discountBadge.style.backgroundColor = colors.highlightBackground;
    if (colors.highlightText)
      dom.discountBadge.style.color = colors.highlightText;
    if (typography.highlight?.size)
      dom.discountBadge.style.fontSize = `${typography.highlight.size}px`;
    if (typography.highlight?.fontStyle === "Bold")
      dom.discountBadge.style.fontWeight = "700";

    if (settings.highlight?.isBlinking) {
      dom.discountBadge.style.animation = "pb-blink 1s infinite";
      addBlinkingCSS();
    }

    if (
      settings.highlight?.option === "timer" &&
      settings.highlight?.timerEndDate
    ) {
      setupTimer();
    }
  }

  if (dom.addToCartButton) {
    if (colors.buttonBackground)
      dom.addToCartButton.style.backgroundColor = colors.buttonBackground;
    if (colors.addToCartText)
      dom.addToCartButton.style.color = colors.addToCartText;
    if (colors.buttonBorder)
      dom.addToCartButton.style.borderColor = colors.buttonBorder;
    if (borderThickness.addToCart) {
      dom.addToCartButton.style.borderWidth = `${borderThickness.addToCart}px`;
      dom.addToCartButton.style.borderStyle = "solid";
    }
    if (shapes.addToCart === "Rounded")
      dom.addToCartButton.style.borderRadius = "10px";
  }

  const documentRoot = document.documentElement;
  if (colors.titleText)
    documentRoot.style.setProperty("--pb-title-color", colors.titleText);
  if (colors.price)
    documentRoot.style.setProperty("--pb-price-color", colors.price);
  if (colors.comparedPrice)
    documentRoot.style.setProperty(
      "--pb-compare-price-color",
      colors.comparedPrice,
    );
  if (colors.quantityText)
    documentRoot.style.setProperty(
      "--pb-quantity-text-color",
      colors.quantityText,
    );
  if (colors.quantityBackground)
    documentRoot.style.setProperty(
      "--pb-quantity-bg-color",
      colors.quantityBackground,
    );
  if (colors.background)
    documentRoot.style.setProperty(
      "--pb-product-bg-color",
      hexToRgba(colors.background, 0.2),
    );
  if (colors.border)
    documentRoot.style.setProperty("--pb-border-color", colors.border);
  if (borderThickness.product)
    documentRoot.style.setProperty(
      "--pb-border-thickness",
      `${borderThickness.product}px`,
    );

  if (typography.titlePrice?.size)
    documentRoot.style.setProperty(
      "--pb-title-font-size",
      `${typography.titlePrice.size}px`,
    );
  if (typography.titlePrice?.weight) {
    const fontWeight =
      typography.titlePrice.weight === "Bold"
        ? "700"
        : typography.titlePrice.weight === "Lighter"
          ? "300"
          : "400";
    documentRoot.style.setProperty("--pb-title-font-weight", fontWeight);
  }

  if (typography.quantityPrice?.size)
    documentRoot.style.setProperty(
      "--pb-quantity-font-size",
      `${typography.quantityPrice.size}px`,
    );
  if (typography.quantityPrice?.fontStyle) {
    const fontWeight =
      typography.quantityPrice.fontStyle === "Bold"
        ? "700"
        : typography.quantityPrice.fontStyle === "Lighter"
          ? "300"
          : "400";
    documentRoot.style.setProperty("--pb-quantity-font-weight", fontWeight);
  }

  if (settings.productImageSize) {
    documentRoot.style.setProperty(
      "--pb-image-size",
      `${settings.productImageSize}px`,
    );
  }
}

function addBlinkingCSS() {
  if (!querySelector("#pb-blink-style")) {
    const styleElement = document.createElement("style");
    styleElement.id = "pb-blink-style";
    styleElement.textContent = `
      @keyframes pb-blink {
        0%, 50% { opacity: 1; }
        51%, 100% { opacity: 0.3; }
      }
    `;
    document.head.appendChild(styleElement);
  }
}

function setupTimer() {
  if (!settings.highlight?.timerEndDate) return;

  const endDate = new Date(settings.highlight.timerEndDate);
  const timerFormat = settings.highlight.timerFormat || "dd:hh:mm:ss";
  const timerTitle = settings.highlight.timerTitle || "Offer ends in";

  function updateTimer() {
    const currentTime = new Date();
    const timeDifference = endDate - currentTime;

    if (timeDifference <= 0) {
      dom.discountBadge.innerHTML = "Offer Expired";
      return;
    }

    const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
    );
    const minutes = Math.floor(
      (timeDifference % (1000 * 60 * 60)) / (1000 * 60),
    );
    const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);

    let formattedTime = timerFormat
      .replace("dd", days.toString().padStart(2, "0"))
      .replace("hh", hours.toString().padStart(2, "0"))
      .replace("mm", minutes.toString().padStart(2, "0"))
      .replace("ss", seconds.toString().padStart(2, "0"));

    dom.discountBadge.innerHTML = `<div>${timerTitle}</div><div>${formattedTime}</div>`;
  }

  updateTimer();
  setInterval(updateTimer, 1000);
}

function renderProducts() {
  if (!dom.productsWrapper) return;
  const productsContainer = dom.productsWrapper;
  productsContainer.innerHTML = "";

  products.forEach((product, index) => {
    const defaultVariant = findBestDefaultVariant(product);

    if (defaultVariant) {
      const productCard = buildProductCard(product, defaultVariant);
      productsContainer.appendChild(productCard);

      if (index < products.length - 1) {
        const plusIcon = document.createElement("div");
        plusIcon.className = "pb-plus-icon";
        plusIcon.textContent = "+";
        productsContainer.appendChild(plusIcon);
      }
    } else {
      console.warn(`No variants found for product: ${product.title}`);
    }
  });
}

function findBestDefaultVariant(product) {
  if (!product.variants?.nodes?.length) return null;

  const availableVariant = product.variants.nodes.find((variant) =>
    isVariantAvailable(variant),
  );
  if (availableVariant) return availableVariant;

  return product.variants.nodes;
}

function buildProductCard(product, defaultVariant) {
  const productCard = document.createElement("div");
  productCard.className = "pb-product";
  productCard.dataset.pid = product.id;
  productCard.dataset.variant = defaultVariant.id;

  const bundleQuantity = getQuantityForProduct(product.id);
  const hasComparePrice =
    product.compareAtPriceRange?.minVariantCompareAtPrice?.amount >
    product.priceRangeV2?.minVariantPrice?.amount;

  const isAvailable = isVariantAvailable(defaultVariant);
  if (!isAvailable) {
    productCard.classList.add("pb-variant-unavailable");
  }

  productCard.innerHTML = `
    <div class="pb-product-wrapper">
      <div class="pb-product-image">
        <img src="${product.featuredImage?.url || ""}" alt="${product.title}">
        ${!isAvailable ? '<div class="pb-unavailable-overlay">Sold Out</div>' : ""}
      </div>
      <div class="pb-product-details">
        <h3 class="pb-product-title">${product.title}</h3>
        <div class="pb-pricing-quantity-wrapper">
          <div class="pb-product-pricing">
            ${hasComparePrice ? `<span class="pb-compare-price">₹${formatPrice(defaultVariant.compareAtPrice || product.compareAtPriceRange?.minVariantCompareAtPrice?.amount)}</span>` : ""}
            <span class="pb-current-price">₹${formatPrice(defaultVariant.price)}</span>
          </div>
          <div class="pb-quantity-selector">x${bundleQuantity}</div>
        </div>
        ${buildVariantSelectors(product, defaultVariant)}
      </div>
    </div>`;

  return productCard;
}

function getQuantityForProduct(productId) {
  return (
    bundle.products?.find((productItem) => productItem.productId === productId)
      ?.quantity || 1
  );
}

function buildVariantSelectors(product, currentVariant) {
  if (!product.options?.length || !product.variants?.nodes?.length) return "";

  return product.options
    .filter((option) => option.name !== "Title")
    .map((option) => {
      const currentValue = currentVariant.selectedOptions?.find(
        (selectedOption) => selectedOption.name === option.name,
      )?.value;

      // Collect unique option values and availability
      const uniqueValues = new Map();

      product.variants.nodes.forEach((variant) => {
        const optionValue = variant.selectedOptions?.find(
          (selectedOption) => selectedOption.name === option.name,
        )?.value;

        if (optionValue) {
          if (!uniqueValues.has(optionValue)) {
            uniqueValues.set(optionValue, {
              value: optionValue,
              hasAvailableVariant: false,
              variants: [],
            });
          }
          const entry = uniqueValues.get(optionValue);
          entry.variants.push(variant);
          if (isVariantAvailable(variant)) {
            entry.hasAvailableVariant = true;
          }
        }
      });

      const optionValues = Array.from(uniqueValues.values());
      if (optionValues.length <= 1) return "";

      return `
        <div class="pb-product-options">
          <label class="pb-option-label">
            ${option.name}:
            <select class="pb-option-select" data-option="${option.name}" data-pid="${product.id}">
              ${optionValues
                .map(({ value, hasAvailableVariant }) => {
                  const isSelected = value === currentValue ? "selected" : "";
                  const isDisabled = !hasAvailableVariant ? "disabled" : "";
                  const displayText = hasAvailableVariant
                    ? value
                    : `${value} (Sold Out)`;
                  return `<option value="${value}" ${isSelected} ${isDisabled}>${displayText}</option>`;
                })
                .join("")}
            </select>
          </label>
        </div>`;
    })
    .join("");
}

function calculateRawSum() {
  if (!dom.productsWrapper) return 0;

  return querySelectorAll(".pb-current-price", dom.productsWrapper).reduce(
    (total, priceElement) => {
      const priceText = priceElement.textContent.replace(/[^\d.]/g, "");
      const quantity =
        +priceElement
          .closest(".pb-product")
          ?.querySelector(".pb-quantity-selector")
          ?.textContent?.replace("x", "") || 1;
      return total + (parseFloat(priceText) || 0) * quantity;
    },
    0,
  );
}

function applyDiscount(originalSum) {
  const pricingSettings = settings?.pricing || {};
  if (pricingSettings.option === "percentage") {
    return originalSum * (1 - (+pricingSettings.discountPercentage || 0) / 100);
  }
  if (pricingSettings.option === "fixedDiscount") {
    return originalSum - (+pricingSettings.fixedDiscount || 0);
  }
  if (pricingSettings.option === "fixedPrice") {
    return +pricingSettings.fixedPrice || originalSum;
  }
  return originalSum;
}

function recalcTotals() {
  if (!dom.priceElement) return;
  const baseTotal = calculateRawSum();
  const finalTotal = applyDiscount(baseTotal);
  dom.priceElement.textContent = `₹${finalTotal.toFixed(2)}`;
}

function formatPrice(priceValue) {
  return parseFloat(priceValue || 0).toFixed(2);
}

function bindEvents() {
  if (!dom.productsWrapper || !dom.addToCartButton) return;

  // Clear errors on option changes and update variant selection
  dom.productsWrapper.addEventListener("change", async (event) => {
    if (!event.target.matches(".pb-option-select")) return;

    clearError();

    const productCard = event.target.closest(".pb-product");
    const productId = productCard.dataset.pid;
    const product = products.find((p) => p.id === productId);

    if (!product) {
      console.error("Product not found:", productId);
      return;
    }

    const selectedChoices = [
      ...productCard.querySelectorAll(".pb-option-select"),
    ].map((selectElement) => ({
      name: selectElement.dataset.option,
      value: selectElement.value,
    }));

    let matchingVariant = product.variants.nodes.find((variant) =>
      selectedChoices.every((choice) =>
        variant.selectedOptions?.some(
          (option) =>
            option.name === choice.name && option.value === choice.value,
        ),
      ),
    );

    if (matchingVariant) {
      updateVariantSelection(productCard, matchingVariant);
    } else {
      try {
        const variantResponse = await fetchVariants(productId);
        const freshVariants = variantResponse.product?.variants?.nodes;

        if (freshVariants) {
          matchingVariant = freshVariants.find((variant) =>
            selectedChoices.every((choice) =>
              variant.selectedOptions?.some(
                (option) =>
                  option.name === choice.name && option.value === choice.value,
              ),
            ),
          );
          if (matchingVariant) {
            updateVariantSelection(productCard, matchingVariant);
          }
        }
      } catch (error) {
        console.error("Error fetching variants:", error);
      }
    }
  });

  dom.addToCartButton.addEventListener("click", addToCart);
}

function updateVariantSelection(productCard, selectedVariant) {
  if (!selectedVariant) return;

  productCard.dataset.variant = selectedVariant.id;

  const priceElement = querySelector(".pb-current-price", productCard);
  if (priceElement) {
    priceElement.textContent = `₹${formatPrice(selectedVariant.price)}`;
  }

  const compareElement = querySelector(".pb-compare-price", productCard);
  if (
    compareElement &&
    selectedVariant.compareAtPrice &&
    +selectedVariant.compareAtPrice > +selectedVariant.price
  ) {
    compareElement.textContent = `₹${formatPrice(selectedVariant.compareAtPrice)}`;
    compareElement.style.display = "inline";
  } else if (compareElement) {
    compareElement.style.display = "none";
  }

  const isAvailable = isVariantAvailable(selectedVariant);
  const overlay = querySelector(".pb-unavailable-overlay", productCard);

  if (isAvailable) {
    productCard.classList.remove("pb-variant-unavailable");
    if (overlay) overlay.style.display = "none";
  } else {
    productCard.classList.add("pb-variant-unavailable");
    if (overlay) overlay.style.display = "block";
  }

  recalcTotals();
}

async function addToCart() {
  if (!dom.productsWrapper) return;

  clearError();

  const productElements = querySelectorAll(".pb-product", dom.productsWrapper);

  const unavailableProducts = productElements.filter((element) =>
    element.classList.contains("pb-variant-unavailable"),
  );

  if (unavailableProducts.length > 0) {
    showError(
      "Some selected variants are not available. Please select different options.",
    );
    return;
  }

  const cartItems = productElements
    .map((productElement) => {
      const variantId = productElement.dataset.variant;
      const quantityText =
        querySelector(".pb-quantity-selector", productElement)?.textContent ||
        "x1";
      const quantity = parseInt(quantityText.replace(/[^\d]/g, "")) || 1;

      if (!variantId) return null;

      const numericId = variantId.includes("gid://")
        ? variantId.split("/").pop()
        : variantId;
      const parsedId = parseInt(numericId);

      if (isNaN(parsedId) || parsedId <= 0) return null;

      return {
        id: parsedId,
        quantity,
        properties: {
          _bundle_id: bundle?.id?.toString() || "unknown",
          _bundle_name: bundle?.title || bundle?.name || `Bundle ${bundle?.id}`,
          _bundle_source: "product_bundle",
        },
      };
    })
    .filter(Boolean);

  if (!cartItems.length) {
    showError("No valid items to add to cart. Please refresh and try again.");
    return;
  }

  if (!dom.addToCartButton) return;

  dom.addToCartButton.disabled = true;
  const originalLabel = dom.addToCartButton.textContent;
  dom.addToCartButton.textContent = "Adding…";

  try {
    const response = await fetch("/cart/add.js", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // Helps ensure consistent JSON error payloads from .js endpoints
        "X-Requested-With": "XMLHttpRequest",
      },
      body: JSON.stringify({ items: cartItems }),
    });

    if (!response.ok) {
      let detail = "";
      try {
        const err = await response.json();
        detail = err?.description || err?.message || "";
      } catch {
        detail = await response.text();
      }

      if (response.status === 422) {
        showError(detail || "One or more items are unavailable or sold out.");
      } else {
        showError(detail || "Failed to add items to cart. Please try again.");
      }
      return;
    }

    clearError();
    await response.json();

    if (bundleTracker) {
      const productIds = products.map((p) => p.id.toString());
      bundleTracker.trackAddToCart(productIds);
    }

    window.location.href = "/cart";
  } catch (e) {
    showError("Network error. Please retry.");
  } finally {
    dom.addToCartButton.textContent = originalLabel;
    dom.addToCartButton.disabled = false;
  }
}

// One-time CSS for inline error and sold-out overlay
function ensureBundleErrorStyles() {
  if (document.getElementById("pb-error-styles")) return;
  const style = document.createElement("style");
  style.id = "pb-error-styles";
  style.textContent = `
    .pb-error {
      margin-top: 8px;
      color: #b42318; /* red-700 */
      font-size: 13px;
      line-height: 1.3;
    }
    .pb-btn-error {
      box-shadow: 0 0 0 2px rgba(180,35,24,0.15);
    }
    .pb-unavailable-overlay {
      position: absolute;
      inset: 0;
      background: rgba(0, 0, 0, 0.7);
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 600;
      border-radius: 4px;
    }
    .pb-product-image { position: relative; }
    .pb-variant-unavailable { opacity: 0.7; }
    .pb-variant-unavailable .pb-product-title { text-decoration: line-through; }
  `;
  document.head.appendChild(style);
}

// Start the injection process automatically
startEmbedInjection();
