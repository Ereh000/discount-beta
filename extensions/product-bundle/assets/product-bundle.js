/* product-bundle.js */
const shopUrl  = window.shopUrl;
let bundle     = null;
let settings   = null;
let products   = [];

const dom = {};

document.addEventListener('DOMContentLoaded', async () => {
  await loadBundle();
  if (!bundle) return;

  cacheDom();
  fillStaticText();
  applyTheme();

  await loadBundleProducts();
  renderProducts();
  recalcTotals();
  bindEvents();
});

async function loadBundle() {
  try {
    const res  = await fetch(`${shopUrl}/apps/vol-api/product-bundle`);
    const data = await res.json();
    if (data.success && data.bundles?.length > 0) {
      bundle   = data.bundles.find(b => b.status === 'published');
      settings = bundle?.settings || null;
    }
  } catch (e) { console.error('Bundle fetch error', e); }
}

async function loadBundleProducts() {
  if (!bundle) return;
  try {
    const res  = await fetch(
      `${shopUrl}/apps/vol-api/product-bundle?bundleId=${bundle.id}`
    );
    const data = await res.json();
    if (data.success && data.fetchedProducts) {
      products = data.fetchedProducts;
    }
  } catch (e) { console.error('Product fetch error', e); }
}

function fetchVariants(productGid) {
  return fetch(
    `${shopUrl}/apps/vol-api/product-variant?productId=${productGid}`
  ).then(r => r.json());
}

function $(sel, root = document)  { return root.querySelector(sel); }
function $$(sel, root = document) { return [...root.querySelectorAll(sel)]; }

function cacheDom() {
  const root = $('#pb-root');
  if (!root) return;
  
  Object.assign(dom, {
    root,
    heading : $('.pb-heading',  root),
    proWrap : $('.pb-products', root),
    price   : $('.pb-current-price', root),
    badge   : $('.pb-discount-badge', root),
    addBtn  : $('.pb-add-to-cart', root),
    total   : $('.pb-total', root)
  });
}

function fillStaticText() {
  if (!settings) return;
  if (settings.header && dom.heading)             dom.heading.textContent = settings.header;
  if (settings.highlight?.title && dom.badge)     dom.badge.textContent   = settings.highlight.title;
  if (settings.button && dom.addBtn)              dom.addBtn.textContent  = settings.button;
  if (settings.footer && $('.pb-summary-label'))  $('.pb-summary-label').textContent = settings.footer;
}

function applyTheme() {
  if (!settings) return;
  
  const c = settings.colors || {};
  const t = settings.typography || {};
  const s = settings.spacing || {};
  const sh = settings.shapes || {};
  const bt = settings.borderThickness || {};

  // Container styling
  if (dom.root) {
    if (s.bundleTop) dom.root.style.paddingTop = `${s.bundleTop}px`;
    if (s.bundleBottom) dom.root.style.paddingBottom = `${s.bundleBottom}px`;
    if (c.border) dom.root.style.borderColor = c.border;
    if (bt.bundle) {
      dom.root.style.borderWidth = `${bt.bundle}px`;
      dom.root.style.borderStyle = bt.bundle === '0' ? 'none' : 'solid';
    }
    if (sh.bundle === 'Rounded') dom.root.style.borderRadius = '12px';
  }

  // Header styling
  if (dom.heading) {
    if (c.headerText) dom.heading.style.color = c.headerText;
    if (t.header?.size) dom.heading.style.fontSize = `${t.header.size}px`;
    if (t.header?.weight) {
      dom.heading.style.fontWeight = t.header.weight === 'Bold' ? '700' : 
                                     t.header.weight === 'Lighter' ? '300' : '400';
    }
    if (settings.alignment) dom.heading.style.textAlign = settings.alignment;
  }

  // Product cards styling
  if (dom.proWrap && c.background) {
    dom.proWrap.style.setProperty('--pb-product-bg', c.background);
  }

  // Total section styling  
  if (dom.total) {
    if (c.footerBackground) dom.total.style.backgroundColor = c.footerBackground;
    if (c.footerText) dom.total.style.color = c.footerText;
    if (s.footerTop) dom.total.style.marginTop = `${s.footerTop}px`;
    if (s.footerBottom) dom.total.style.marginBottom = `${s.footerBottom}px`;
    if (bt.footer && bt.footer !== '0') {
      dom.total.style.borderWidth = `${bt.footer}px`;
      dom.total.style.borderStyle = 'solid';
      if (c.border) dom.total.style.borderColor = c.border;
    }
    if (sh.footer === 'Rounded') dom.total.style.borderRadius = '12px';
  }

  // Discount badge styling
  if (dom.badge) {
    if (c.highlightBackground) dom.badge.style.backgroundColor = c.highlightBackground;
    if (c.highlightText) dom.badge.style.color = c.highlightText;
    if (t.highlight?.size) dom.badge.style.fontSize = `${t.highlight.size}px`;
    if (t.highlight?.fontStyle === 'Bold') dom.badge.style.fontWeight = '700';
    
    // Handle blinking effect
    if (settings.highlight?.isBlinking) {
      dom.badge.style.animation = 'pb-blink 1s infinite';
      addBlinkingCSS();
    }

    // Handle timer
    if (settings.highlight?.option === 'timer' && settings.highlight?.timerEndDate) {
      setupTimer();
    }
  }

  // Button styling
  if (dom.addBtn) {
    if (c.buttonBackground) dom.addBtn.style.backgroundColor = c.buttonBackground;
    if (c.addToCartText) dom.addBtn.style.color = c.addToCartText;
    if (c.buttonBorder) dom.addBtn.style.borderColor = c.buttonBorder;
    if (bt.addToCart) {
      dom.addBtn.style.borderWidth = `${bt.addToCart}px`;
      dom.addBtn.style.borderStyle = 'solid';
    }
    if (sh.addToCart === 'Rounded') dom.addBtn.style.borderRadius = '12px';
  }

  // Apply dynamic CSS variables for product styling
  const root = document.documentElement;
  if (c.titleText) root.style.setProperty('--pb-title-color', c.titleText);
  if (c.price) root.style.setProperty('--pb-price-color', c.price);
  if (c.comparedPrice) root.style.setProperty('--pb-compare-price-color', c.comparedPrice);
  if (c.quantityText) root.style.setProperty('--pb-quantity-text-color', c.quantityText);
  if (c.quantityBackground) root.style.setProperty('--pb-quantity-bg-color', c.quantityBackground);
  if (c.background) root.style.setProperty('--pb-product-bg-color', c.background);
  if (c.border) root.style.setProperty('--pb-border-color', c.border);
  
  if (t.titlePrice?.size) root.style.setProperty('--pb-title-font-size', `${t.titlePrice.size}px`);
  if (t.titlePrice?.weight) {
    const weight = t.titlePrice.weight === 'Bold' ? '700' : 
                   t.titlePrice.weight === 'Lighter' ? '300' : '400';
    root.style.setProperty('--pb-title-font-weight', weight);
  }
  
  if (t.quantityPrice?.size) root.style.setProperty('--pb-quantity-font-size', `${t.quantityPrice.size}px`);
  if (t.quantityPrice?.fontStyle) {
    const weight = t.quantityPrice.fontStyle === 'Bold' ? '700' : 
                   t.quantityPrice.fontStyle === 'Lighter' ? '300' : '400';
    root.style.setProperty('--pb-quantity-font-weight', weight);
  }

  if (settings.productImageSize) {
    root.style.setProperty('--pb-image-size', `${settings.productImageSize}px`);
  }
}

function addBlinkingCSS() {
  if (!$('#pb-blink-style')) {
    const style = document.createElement('style');
    style.id = 'pb-blink-style';
    style.textContent = `
      @keyframes pb-blink {
        0%, 50% { opacity: 1; }
        51%, 100% { opacity: 0.3; }
      }
    `;
    document.head.appendChild(style);
  }
}

function setupTimer() {
  if (!settings.highlight?.timerEndDate) return;
  
  const endDate = new Date(settings.highlight.timerEndDate);
  const format = settings.highlight.timerFormat || 'dd:hh:mm:ss';
  const title = settings.highlight.timerTitle || 'Offer ends in';

  function updateTimer() {
    const now = new Date();
    const diff = endDate - now;

    if (diff <= 0) {
      dom.badge.innerHTML = 'Offer Expired';
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    let formattedTime = format
      .replace('dd', days.toString().padStart(2, '0'))
      .replace('hh', hours.toString().padStart(2, '0'))
      .replace('mm', minutes.toString().padStart(2, '0'))
      .replace('ss', seconds.toString().padStart(2, '0'));

    dom.badge.innerHTML = `<div>${title}</div><div>${formattedTime}</div>`;
  }

  updateTimer();
  setInterval(updateTimer, 1000);
}

function renderProducts() {
  if (!dom.proWrap) return;
  const wrap = dom.proWrap;
  wrap.innerHTML = '';

  products.forEach((p, i) => {
    const firstVariant = p.variants?.nodes?.[0];
    if (firstVariant) {
      wrap.appendChild(buildCard(p, firstVariant));
      if (i < products.length - 1) {
        const plus = document.createElement('div');
        plus.className = 'pb-plus-icon';
        plus.textContent = '+';
        wrap.appendChild(plus);
      }
    }
  });
}

function buildCard(p, firstVariant) {
  const v0   = firstVariant;
  const card = document.createElement('div');
  card.className   = 'pb-product';
  card.dataset.pid = p.id;
  card.dataset.variant = v0.id;

  const bundleQty = qtyFor(p.id);
  const compareOk = p.compareAtPriceRange?.minVariantCompareAtPrice?.amount > 
                    p.priceRangeV2?.minVariantPrice?.amount;

  card.innerHTML = `
    <div class="pb-product-wrapper">
      <div class="pb-product-image">
        <img src="${p.featuredImage?.url || ''}" alt="${p.title}">
      </div>
      <div class="pb-product-details">
        <h3 class="pb-product-title">${p.title}</h3>
        <div class="pb-product-pricing">
          ${compareOk ? `<span class="pb-compare-price">$${fmt(v0.compareAtPrice || p.compareAtPriceRange?.minVariantCompareAtPrice?.amount)}</span>` : ''}
          <span class="pb-current-price">$${fmt(v0.price)}</span>
        </div>
        <div class="pb-quantity-selector">x${bundleQty}</div>
        ${variantSelectors(p, v0)}
      </div>
    </div>`;
  return card;
}

function qtyFor(pid) {
  return bundle.products?.find(x => x.productId === pid)?.quantity || 1;
}

function variantSelectors(p, firstVariant) {
  if (!p.options?.length) return '';
  
  return p.options
    .filter(o => o.name !== 'Title')
    .map(o => {
      const current = firstVariant.selectedOptions
        ?.find(so => so.name === o.name)?.value;

      const vals = [...new Set(
        p.variants.nodes
          ?.map(v => v.selectedOptions?.find(s => s.name === o.name)?.value)
          .filter(Boolean)
      )];

      if (vals.length <= 1) return '';

      return `
        <div class="pb-product-options">
          <label class="pb-option-label">
            ${o.name}:
            <select class="pb-option-select" data-option="${o.name}" data-pid="${p.id}">
              ${vals.map(v =>
                `<option value="${v}" ${v === current ? 'selected' : ''}>${v}</option>`
              ).join('')}
            </select>
          </label>
        </div>`;
    })
    .join('');
}

function rawSum() {
  if (!dom.proWrap) return 0;
  
  return $$('.pb-current-price', dom.proWrap)
    .reduce((total, el) => {
      const text = el.textContent.replace(/[^\d.]/g, '');
      const qty = +el.closest('.pb-product')
        ?.querySelector('.pb-quantity-selector')
        ?.textContent?.replace('x', '') || 1;
      return total + (parseFloat(text) || 0) * qty;
    }, 0);
}

function discount(sum) {
  const pr = settings?.pricing || {};
  if (pr.option === 'percentage') return sum * (1 - (+pr.discountPercentage || 0) / 100);
  if (pr.option === 'fixedDiscount') return sum - (+pr.fixedDiscount || 0);
  if (pr.option === 'fixedPrice') return +pr.fixedPrice || sum;
  return sum;
}

function recalcTotals() {
  if (!dom.price) return;
  
  const base  = rawSum();
  const final = discount(base);
  
  dom.price.textContent = `$${final.toFixed(2)}`;
}

function fmt(n) {
  return parseFloat(n || 0).toFixed(2);
}

function bindEvents() {
  if (!dom.proWrap || !dom.addBtn) return;

  dom.proWrap.addEventListener('change', async e => {
    if (!e.target.matches('.pb-option-select')) return;
    
    const card = e.target.closest('.pb-product');
    const pid  = card.dataset.pid;

    const choices = [...card.querySelectorAll('.pb-option-select')]
      .map(s => ({ name: s.dataset.option, value: s.value }));

    try {
      const response = await fetchVariants(pid);
      const variants = response.product?.variants?.nodes;
      
      if (!variants) return;

      const match = variants.find(v =>
        choices.every(c =>
          v.selectedOptions?.some(o => o.name === c.name && o.value === c.value)
        )
      );
      
      if (!match) return;

      card.dataset.variant = match.id;
      
      const priceEl = $('.pb-current-price', card);
      if (priceEl) {
        priceEl.textContent = `$${fmt(match.price)}`;
      }

      const cmp = $('.pb-compare-price', card);
      if (cmp && match.compareAtPrice && +match.compareAtPrice > +match.price) {
        cmp.textContent = `$${fmt(match.compareAtPrice)}`;
      }
      
      recalcTotals();
    } catch (error) {
      console.error('Error fetching variants:', error);
    }
  });

  dom.addBtn.addEventListener('click', addToCart);
}

function addToCart() {
  if (!dom.proWrap) return;
  
  const items = $$('.pb-product', dom.proWrap).map(el => {
    const variantId = el.dataset.variant;
    const qty = +$('.pb-quantity-selector', el)?.textContent?.replace('x', '') || 1;
    
    if (!variantId) return null;
    
    const numericId = variantId.includes('gid://') 
      ? variantId.split('/').pop() 
      : variantId;
      
    return {
      id: parseInt(numericId),
      quantity: qty
    };
  }).filter(Boolean);

  if (!items.length) {
    console.error('No valid variants selected');
    return;
  }

  if (!dom.addBtn) return;
  
  dom.addBtn.disabled = true;
  dom.addBtn.textContent = 'Adding…';

  fetch('/cart/add.js', {
    method : 'POST',
    headers: { 'Content-Type': 'application/json' },
    body   : JSON.stringify({ items })
  })
    .then(r => r.ok ? r.json() : Promise.reject(r))
    .then(() => (window.location.href = '/cart'))
    .catch((error) => {
      console.error('Cart error:', error);
      if (dom.addBtn) {
        dom.addBtn.textContent = 'Error - Try Again';
        dom.addBtn.disabled    = false;
      }
    });
}
