/* product-bundle.js */
const shopUrl = window.shopUrl;
let bundle = null;
let settings = null;
let products = [];
let bundleTracker = null; // Add tracker instance

const dom = {};

// Bundle Tracker Class
class BundleTracker {
  constructor(shopDomain, bundleId, bundleName) {
    this.shopDomain = shopDomain;
    this.bundleId = bundleId;
    this.bundleName = bundleName;
    this.apiEndpoint = `${shopDomain}/apps/vol-api/analytics`;
    
    // Track impression when tracker is initialized
    this.trackImpression();
  }

  async track(type, additionalData = {}) {
    try {
      await fetch(this.apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type,
          bundleId: this.bundleId,
          bundleName: this.bundleName,
          ...additionalData
        })
      });
    } catch (error) {
      console.error('Bundle tracking error:', error);
    }
  }

  trackImpression() {
    this.track('IMPRESSION');
  }

  trackAddToCart(productIds) {
    this.track('ADD_TO_CART', { productIds });
  }
}

function hexToRgba(hex, alpha = 1) {
  // Remove leading #
  hex = hex.replace(/^#/, '');

  // Handle shorthand (#RGB → #RRGGBB)
  if (hex.length === 3) {
    hex = hex.split('').map(char => char + char).join('');
  }

  if (hex.length !== 6) {
    throw new Error('Invalid HEX color.');
  }

  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

document.addEventListener('DOMContentLoaded', async () => {
  await initializeBundle();
});

async function initializeBundle() {
  try {
    // Load bundle data first
    await loadBundle();
    if (!bundle) return;

    // Initialize tracker after bundle is loaded
    if (bundle && bundle.id) {
      bundleTracker = new BundleTracker(
        shopUrl,
        bundle.id.toString(),
        bundle.title || bundle.name || `Bundle ${bundle.id}`
      );
    }

    // Create DOM structure after data is loaded
    createBundleDOM();
    
    // Cache DOM elements
    cacheDom();
    
    // Apply settings and styling
    applyTheme();
    
    // Load and render products
    await loadBundleProducts();
    renderProducts();
    recalcTotals();
    bindEvents();
    
  } catch (error) {
    console.error('Bundle initialization failed:', error);
  }
}

async function loadBundle() {
  try {
    const response = await fetch(`${shopUrl}/apps/vol-api/product-bundle`);
    const data = await response.json();
    console.log("bundle settings data:", data?.bundles[0]?.settings);

    if (data.success && data.bundles?.length > 0) {
      bundle = data.bundles.find(bundleItem => bundleItem.status === 'published');
      settings = bundle?.settings || null;
    }
  } catch (error) { 
    console.error('Bundle fetch error', error); 
  }
}

async function loadBundleProducts() {
  if (!bundle) return;
  try {
    const response = await fetch(
      `${shopUrl}/apps/vol-api/product-bundle?bundleId=${bundle.id}`
    );
    const data = await response.json();
    if (data.success && data.fetchedProducts) {
      products = data.fetchedProducts;
    }
  } catch (error) { 
    console.error('Product fetch error', error); 
  }
}

function fetchVariants(productGid) {
  return fetch(
    `${shopUrl}/apps/vol-api/product-variant?productId=${productGid}`
  ).then(response => response.json());
}

function createBundleDOM() {
  const placeholder = document.getElementById('pb-placeholder');
  if (!placeholder) return;

  // Create main container
  const container = document.createElement('div');
  container.id = 'pb-root';
  container.className = 'pb-container';

  // Create header (without cart icon as requested)
  const header = document.createElement('div');
  header.className = 'pb-header';
  
  const heading = document.createElement('h2');
  heading.className = 'pb-heading';
  heading.textContent = settings?.header || 'Frequently bought together';
  header.appendChild(heading);
  
  container.appendChild(header);

  // Create products container
  const productsDiv = document.createElement('div');
  productsDiv.className = 'pb-products';
  container.appendChild(productsDiv);

  // Create summary section
  const summary = document.createElement('div');
  summary.className = 'pb-summary';

  // Create discount badge
  const discountBadge = document.createElement('div');
  discountBadge.className = 'pb-discount-badge';
  discountBadge.textContent = settings?.highlight?.title || '';
  summary.appendChild(discountBadge);

  // Create total section
  const total = document.createElement('div');
  total.className = 'pb-total';

  const label = document.createElement('span');
  label.className = 'pb-summary-label';
  label.textContent = settings?.footer || 'Total :';
  total.appendChild(label);

  const price = document.createElement('span');
  price.className = 'pb-current-price';
  total.appendChild(price);

  summary.appendChild(total);

  // Create add to cart button
  const addToCartButton = document.createElement('button');
  addToCartButton.className = 'pb-add-to-cart';
  addToCartButton.textContent = settings?.button || 'Claim Offer';
  summary.appendChild(addToCartButton);

  container.appendChild(summary);

  // Replace placeholder with the bundle
  placeholder.parentNode.replaceChild(container, placeholder);
}

function querySelector(selector, rootElement = document) { 
  return rootElement.querySelector(selector); 
}

function querySelectorAll(selector, rootElement = document) { 
  return [...rootElement.querySelectorAll(selector)]; 
}

function cacheDom() {
  const rootElement = querySelector('#pb-root');
  if (!rootElement) return;
  
  Object.assign(dom, {
    root: rootElement,
    heading: querySelector('.pb-heading', rootElement),
    productsWrapper: querySelector('.pb-products', rootElement),
    priceElement: querySelector('.pb-current-price', rootElement),
    discountBadge: querySelector('.pb-discount-badge', rootElement),
    addToCartButton: querySelector('.pb-add-to-cart', rootElement),
    totalSection: querySelector('.pb-total', rootElement)
  });
}

function applyTheme() {
  if (!settings) return;
  
  const colors = settings.colors || {};
  const typography = settings.typography || {};
  const spacing = settings.spacing || {};
  const shapes = settings.shapes || {};
  const borderThickness = settings.borderThickness || {};

  // Container styling
  if (dom.root) {
    if (spacing.bundleTop) dom.root.style.paddingTop = `${spacing.bundleTop}px`;
    if (spacing.bundleBottom) dom.root.style.paddingBottom = `${spacing.bundleBottom}px`;
    if (colors.border) dom.root.style.borderColor = colors.border;
    if (shapes.bundle === 'Rounded') dom.root.style.borderRadius = '12px';
  }

  // Header styling
  if (dom.heading) {
    if (colors.headerText) dom.heading.style.color = colors.headerText;
    if (typography.header?.size) dom.heading.style.fontSize = `${typography.header.size}px`;
    if (typography.header?.weight) {
      dom.heading.style.fontWeight = typography.header.weight === 'Bold' ? '700' : 
                                     typography.header.weight === 'Lighter' ? '300' : '400';
    }
    if (settings.alignment) dom.heading.style.textAlign = settings.alignment;
  }

  // Total section styling  
  if (dom.totalSection) {
    if (colors.footerBackground) dom.totalSection.style.backgroundColor = colors.footerBackground;
    if (colors.footerText) dom.totalSection.style.color = colors.footerText;
    if (spacing.footerTop) dom.totalSection.style.marginTop = `${spacing.footerTop}px`;
    if (spacing.footerBottom) dom.totalSection.style.marginBottom = `${spacing.footerBottom}px`;
    if (borderThickness.footer && borderThickness.footer !== '0') {
      dom.totalSection.style.borderWidth = `${borderThickness.footer}px`;
      dom.totalSection.style.borderStyle = 'solid';
      if (colors.border) dom.totalSection.style.borderColor = colors.border;
    }
    if (shapes.footer === 'Rounded') dom.totalSection.style.borderRadius = '7px';
  }

  // Discount badge styling
  if (dom.discountBadge) {
    if (colors.highlightBackground) dom.discountBadge.style.backgroundColor = colors.highlightBackground;
    if (colors.highlightText) dom.discountBadge.style.color = colors.highlightText;
    if (typography.highlight?.size) dom.discountBadge.style.fontSize = `${typography.highlight.size}px`;
    if (typography.highlight?.fontStyle === 'Bold') dom.discountBadge.style.fontWeight = '700';
    
    // Handle blinking effect
    if (settings.highlight?.isBlinking) {
      dom.discountBadge.style.animation = 'pb-blink 1s infinite';
      addBlinkingCSS();
    }

    // Handle timer
    if (settings.highlight?.option === 'timer' && settings.highlight?.timerEndDate) {
      setupTimer();
    }
  }

  // Button styling
  if (dom.addToCartButton) {
    if (colors.buttonBackground) dom.addToCartButton.style.backgroundColor = colors.buttonBackground;
    if (colors.addToCartText) dom.addToCartButton.style.color = colors.addToCartText;
    if (colors.buttonBorder) dom.addToCartButton.style.borderColor = colors.buttonBorder;
    if (borderThickness.addToCart) {
      dom.addToCartButton.style.borderWidth = `${borderThickness.addToCart}px`;
      dom.addToCartButton.style.borderStyle = 'solid';
    }
    if (shapes.addToCart === 'Rounded') dom.addToCartButton.style.borderRadius = '10px';
  }

  // Apply dynamic CSS variables for product styling
  const documentRoot = document.documentElement;
  if (colors.titleText) documentRoot.style.setProperty('--pb-title-color', colors.titleText);
  if (colors.price) documentRoot.style.setProperty('--pb-price-color', colors.price);
  if (colors.comparedPrice) documentRoot.style.setProperty('--pb-compare-price-color', colors.comparedPrice);
  if (colors.quantityText) documentRoot.style.setProperty('--pb-quantity-text-color', colors.quantityText);
  if (colors.quantityBackground) documentRoot.style.setProperty('--pb-quantity-bg-color', colors.quantityBackground);
  if (colors.background) documentRoot.style.setProperty('--pb-product-bg-color', hexToRgba(colors.background, 0.2));
  if (colors.border) documentRoot.style.setProperty('--pb-border-color', colors.border);
  if (borderThickness.product) documentRoot.style.setProperty('--pb-border-thickness', `${borderThickness.product}px`);
  
  if (typography.titlePrice?.size) documentRoot.style.setProperty('--pb-title-font-size', `${typography.titlePrice.size}px`);
  if (typography.titlePrice?.weight) {
    const fontWeight = typography.titlePrice.weight === 'Bold' ? '700' : 
                       typography.titlePrice.weight === 'Lighter' ? '300' : '400';
    documentRoot.style.setProperty('--pb-title-font-weight', fontWeight);
  }
  
  if (typography.quantityPrice?.size) documentRoot.style.setProperty('--pb-quantity-font-size', `${typography.quantityPrice.size}px`);
  if (typography.quantityPrice?.fontStyle) {
    const fontWeight = typography.quantityPrice.fontStyle === 'Bold' ? '700' : 
                       typography.quantityPrice.fontStyle === 'Lighter' ? '300' : '400';
    documentRoot.style.setProperty('--pb-quantity-font-weight', fontWeight);
  }

  if (settings.productImageSize) {
    documentRoot.style.setProperty('--pb-image-size', `${settings.productImageSize}px`);
  }
}

function addBlinkingCSS() {
  if (!querySelector('#pb-blink-style')) {
    const styleElement = document.createElement('style');
    styleElement.id = 'pb-blink-style';
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
  const timerFormat = settings.highlight.timerFormat || 'dd:hh:mm:ss';
  const timerTitle = settings.highlight.timerTitle || 'Offer ends in';

  function updateTimer() {
    const currentTime = new Date();
    const timeDifference = endDate - currentTime;

    if (timeDifference <= 0) {
      dom.discountBadge.innerHTML = 'Offer Expired';
      return;
    }

    const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);

    let formattedTime = timerFormat
      .replace('dd', days.toString().padStart(2, '0'))
      .replace('hh', hours.toString().padStart(2, '0'))
      .replace('mm', minutes.toString().padStart(2, '0'))
      .replace('ss', seconds.toString().padStart(2, '0'));

    dom.discountBadge.innerHTML = `<div>${timerTitle}</div><div>${formattedTime}</div>`;
  }

  updateTimer();
  setInterval(updateTimer, 1000);
}

function renderProducts() {
  if (!dom.productsWrapper) return;
  const productsContainer = dom.productsWrapper;
  productsContainer.innerHTML = '';

  products.forEach((product, index) => {
    const firstVariant = product.variants?.nodes?.[0];
    if (firstVariant) {
      productsContainer.appendChild(buildProductCard(product, firstVariant));
      if (index < products.length - 1) {
        const plusIcon = document.createElement('div');
        plusIcon.className = 'pb-plus-icon';
        plusIcon.textContent = '+';
        productsContainer.appendChild(plusIcon);
      }
    }
  });
}

function buildProductCard(product, defaultVariant) {
  const productCard = document.createElement('div');
  productCard.className = 'pb-product';
  productCard.dataset.pid = product.id;
  productCard.dataset.variant = defaultVariant.id;

  const bundleQuantity = getQuantityForProduct(product.id);
  const hasComparePrice = product.compareAtPriceRange?.minVariantCompareAtPrice?.amount > 
                          product.priceRangeV2?.minVariantPrice?.amount;

  productCard.innerHTML = `
    <div class="pb-product-wrapper">
      <div class="pb-product-image">
        <img src="${product.featuredImage?.url || ''}" alt="${product.title}">
      </div>
      <div class="pb-product-details">
        <h3 class="pb-product-title">${product.title}</h3>
        <div class="pb-pricing-quantity-wrapper">
          <div class="pb-product-pricing">
            ${hasComparePrice ? `<span class="pb-compare-price">₹${formatPrice(defaultVariant.compareAtPrice || product.compareAtPriceRange?.minVariantCompareAtPrice?.amount)}</span>` : ''}
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
  return bundle.products?.find(productItem => productItem.productId === productId)?.quantity || 1;
}

function buildVariantSelectors(product, firstVariant) {
  if (!product.options?.length) return '';
  
  return product.options
    .filter(option => option.name !== 'Title')
    .map(option => {
      const currentValue = firstVariant.selectedOptions
        ?.find(selectedOption => selectedOption.name === option.name)?.value;

      const availableValues = [...new Set(
        product.variants.nodes
          ?.map(variant => variant.selectedOptions?.find(selectedOption => selectedOption.name === option.name)?.value)
          .filter(Boolean)
      )];

      if (availableValues.length <= 1) return '';

      return `
        <div class="pb-product-options">
          <label class="pb-option-label">
            ${option.name}:
            <select class="pb-option-select" data-option="${option.name}" data-pid="${product.id}">
              ${availableValues.map(value =>
                `<option value="${value}" ${value === currentValue ? 'selected' : ''}>${value}</option>`
              ).join('')}
            </select>
          </label>
        </div>`;
    })
    .join('');
}

function calculateRawSum() {
  if (!dom.productsWrapper) return 0;
  
  return querySelectorAll('.pb-current-price', dom.productsWrapper)
    .reduce((total, priceElement) => {
      const priceText = priceElement.textContent.replace(/[^\d.]/g, '');
      const quantity = +priceElement.closest('.pb-product')
        ?.querySelector('.pb-quantity-selector')
        ?.textContent?.replace('x', '') || 1;
      return total + (parseFloat(priceText) || 0) * quantity;
    }, 0);
}

function applyDiscount(originalSum) {
  const pricingSettings = settings?.pricing || {};
  if (pricingSettings.option === 'percentage') {
    return originalSum * (1 - (+pricingSettings.discountPercentage || 0) / 100);
  }
  if (pricingSettings.option === 'fixedDiscount') {
    return originalSum - (+pricingSettings.fixedDiscount || 0);
  }
  if (pricingSettings.option === 'fixedPrice') {
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

  dom.productsWrapper.addEventListener('change', async event => {
    if (!event.target.matches('.pb-option-select')) return;
    
    const productCard = event.target.closest('.pb-product');
    const productId = productCard.dataset.pid;

    const selectedChoices = [...productCard.querySelectorAll('.pb-option-select')]
      .map(selectElement => ({ 
        name: selectElement.dataset.option, 
        value: selectElement.value 
      }));

    try {
      const variantResponse = await fetchVariants(productId);
      const availableVariants = variantResponse.product?.variants?.nodes;
      
      if (!availableVariants) return;

      const matchingVariant = availableVariants.find(variant =>
        selectedChoices.every(choice =>
          variant.selectedOptions?.some(option => 
            option.name === choice.name && option.value === choice.value
          )
        )
      );
      
      if (!matchingVariant) return;

      productCard.dataset.variant = matchingVariant.id;
      
      const priceElement = querySelector('.pb-current-price', productCard);
      if (priceElement) {
        priceElement.textContent = `₹${formatPrice(matchingVariant.price)}`;
      }

      const compareElement = querySelector('.pb-compare-price', productCard);
      if (compareElement && matchingVariant.compareAtPrice && +matchingVariant.compareAtPrice > +matchingVariant.price) {
        compareElement.textContent = `₹${formatPrice(matchingVariant.compareAtPrice)}`;
      }
      
      recalcTotals();
    } catch (error) {
      console.error('Error fetching variants:', error);
    }
  });

  dom.addToCartButton.addEventListener('click', addToCart);
}

function addToCart() {
  if (!dom.productsWrapper) return;
  
  const cartItems = querySelectorAll('.pb-product', dom.productsWrapper).map(productElement => {
    const variantId = productElement.dataset.variant;
    const quantity = +querySelector('.pb-quantity-selector', productElement)?.textContent?.replace('x', '') || 1;
    const priceElement = querySelector('.pb-current-price', productElement);
    const originalPrice = priceElement ? priceElement.textContent.replace(/[^\d.]/g, '') : '0';
    
    if (!variantId) return null;
    
    const numericId = variantId.includes('gid://') 
      ? variantId.split('/').pop() 
      : variantId;
      
    return {
      id: parseInt(numericId),
      quantity: quantity,
      properties: {
        '_bundle_id': bundle?.id?.toString() || 'unknown',
        '_bundle_name': bundle?.title || bundle?.name || `Bundle ${bundle?.id}`,
        '_bundle_source': 'volume_discount',
        '_original_price': originalPrice
      }
    };
  }).filter(Boolean);

  if (!cartItems.length) {
    console.error('No valid variants selected');
    return;
  }

  if (!dom.addToCartButton) return;
  
  dom.addToCartButton.disabled = true;
  dom.addToCartButton.textContent = 'Adding…';

  fetch('/cart/add.js', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ items: cartItems })
  })
    .then(response => response.ok ? response.json() : Promise.reject(response))
    .then(() => {
      // Track add to cart success
      if (bundleTracker) {
        const productIds = products.map(p => p.id.toString());
        bundleTracker.trackAddToCart(productIds);
      }
      
      window.location.href = '/cart';
    })
    .catch((error) => {
      console.error('Cart error:', error);
      if (dom.addToCartButton) {  
        dom.addToCartButton.textContent = 'Error - Try Again';
        dom.addToCartButton.disabled = false;
      }
    });
}
