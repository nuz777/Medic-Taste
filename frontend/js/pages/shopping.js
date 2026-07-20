import { get } from '../services/api.js';
import { logUsage } from '../services/usage.js';
import { escapeHtml } from '../utils/escapeHtml.js';
import { nameToSlug } from '../utils/nameToSlug.js';

const CART_KEY = 'tf_shopping_cart';
const DIET_KEY = 'tf_shop_show_all';

const MEAT_CATS = [
  'Carnes', 'Carnes y Aves', 'Carnes Frías y Embutidos',
  'Embutidos', 'Pescados', 'Pescados y Mariscos', 'Mariscos',
];
const DAIRY_CATS = ['Lacteos', 'Lácteos y Huevos'];

const INGREDIENT_IMAGES = {
  'tomate': 'assets/images/ingredients/tomate.jpg',
  'cebolla': 'assets/images/ingredients/cebolla.jpg',
  'pimenton': 'assets/images/ingredients/pimiento-rojo.jpg',
  'pimiento': 'assets/images/ingredients/pimiento-rojo.jpg',
  'pimiento rojo': 'assets/images/ingredients/pimiento-rojo.jpg',
  'ajo': 'assets/images/ingredients/ajo.jpg',
  'leche': 'assets/images/ingredients/leche.jpg',
  'pechuga de pollo': 'assets/images/ingredients/pechuga-de-pollo.jpg',
  'arroz': 'assets/images/ingredients/arroz-blanco.jpg',
  'arroz blanco': 'assets/images/ingredients/arroz-blanco.jpg',
  'aceite': 'assets/images/ingredients/aceite-de-oliva.jpg',
  'aceite de oliva': 'assets/images/ingredients/aceite-de-oliva.jpg',
  'sal': 'assets/images/ingredients/sal.jpg',
  'harina': 'assets/images/ingredients/harina-de-trigo.jpg',
  'harina de trigo': 'assets/images/ingredients/harina-de-trigo.jpg',
  'huevo': 'assets/images/ingredients/huevo.jpg',
  'lechuga': 'assets/images/ingredients/lechuga.jpg',
  'pasta': 'assets/images/ingredients/pasta.jpg',
  'pasta pastusa': 'assets/images/ingredients/pasta.jpg',
  'queso parmesano': 'assets/images/ingredients/queso-parmesano.jpg',
  'queso costeno': 'assets/images/ingredients/queso_costeño.png',
  'aguacate': 'assets/images/ingredients/aguacate.jpg',
  'pan integral': 'assets/images/ingredients/pan-integral.jpg',
  'atun': 'assets/images/ingredients/atun-en-lata.jpg',
  'lentejas': 'assets/images/ingredients/lentejas.jpg',
  'zanahoria': 'assets/images/ingredients/zanahoria.jpg',
  'manzana': 'assets/images/ingredients/manzana.jpg',
  'yogur': 'assets/images/ingredients/yogur-natural.jpg',
  'almendras': 'assets/images/ingredients/almendras.jpg',
  'miel': 'assets/images/ingredients/miel.jpg',
  'calabacin': 'assets/images/ingredients/calabacin.jpg',
  'platano': 'assets/images/ingredients/platano.jpg',
  'papa': 'assets/images/ingredients/PAPA-PASTUSA.png',
  'cafe': 'assets/images/ingredients/Cafe_sello_rojo.jpg',
  'cafe sello rojo': 'assets/images/ingredients/Cafe_sello_rojo.jpg',
  'azucar': 'assets/images/ingredients/AZUCAR-INCAUCAjpg.jpg',
  'azucar incauca': 'assets/images/ingredients/AZUCAR-INCAUCAjpg.jpg',
  'frijol': 'assets/images/ingredients/zaragoza.jpg',
  'frijol zaragoza': 'assets/images/ingredients/zaragoza.jpg',
  'zaragoza': 'assets/images/ingredients/zaragoza.jpg',
  'cilantro': 'assets/images/ingredients/cilantro.jpg',
  'aji': 'assets/images/ingredients/default-ingredient.svg',
  'mango': 'assets/images/ingredients/mango.jpg',
  'cerdo': 'assets/images/ingredients/default-ingredient.svg',
  'carne de cerdo': 'assets/images/ingredients/default-ingredient.svg',
  'panela': 'assets/images/ingredients/default-ingredient.svg',
  'mantequilla': 'assets/images/ingredients/mantequilla.jpg',
  'carne de res': 'assets/images/ingredients/default-ingredient.svg',
  'carne molida': 'assets/images/ingredients/default-ingredient.svg',
  'yuca': 'assets/images/ingredients/default-ingredient.svg',
  'semillas de chia': 'assets/images/ingredients/semillasCHIA.jpg',
  'chia': 'assets/images/ingredients/semillasCHIA.jpg',
  'butifarra': 'assets/images/ingredients/butifarra-soleden.jpg',
  'quinoa': 'assets/images/ingredients/default-ingredient.svg',
  'espinaca': 'assets/images/ingredients/default-ingredient.svg',
  'champinones': 'assets/images/ingredients/default-ingredient.svg',
  'brocoli': 'assets/images/ingredients/default-ingredient.svg',
  'tofu': 'assets/images/ingredients/default-ingredient.svg',
  'garbanzos': 'assets/images/ingredients/default-ingredient.svg',
  'salmon': 'assets/images/ingredients/default-ingredient.svg',
  'merluza': 'assets/images/ingredients/default-ingredient.svg',
  'camarones': 'assets/images/ingredients/default-ingredient.svg',
  'avena': 'assets/images/ingredients/default-ingredient.svg',
  'nueces': 'assets/images/ingredients/default-ingredient.svg',
};

function getIngredientImage(name) {
  const lower = name.toLowerCase();
  for (const [key, img] of Object.entries(INGREDIENT_IMAGES)) {
    if (lower.includes(key)) return img;
  }
  const slug = nameToSlug(name);
  return `assets/images/ingredients/${slug}.jpg`;
}

const CATEGORY_ICONS = {
  'Verduras': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 2a10 10 0 0 1 10 10c0 5.52-4.48 10-10 10S2 17.52 2 12 6.48 2 12 2z"/><path d="M12 6v6l4 2"/></svg>',
  'Frutas': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/></svg>',
  'Carnes': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>',
  'default': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/></svg>',
};

function formatCOP(v) {
  return '$' + Math.round(v).toLocaleString('es-CO');
}

function extractUnit(name) {
  const m = name.match(/\(([^)]+)\)\s*$/);
  return m ? m[1] : null;
}

function cleanName(name) {
  return name.replace(/\s*\([^)]+\)\s*$/, '').trim();
}

function getUserDiet() {
  try {
    return JSON.parse(localStorage.getItem('tf_preferences') || '{}').diet || 'omnivore';
  } catch { return 'omnivore'; }
}

function getExcluded(diet) {
  if (diet === 'vegan') return [...MEAT_CATS, ...DAIRY_CATS];
  if (diet === 'vegetarian') return MEAT_CATS;
  if (diet === 'pescatarian') return ['Carnes', 'Carnes y Aves', 'Carnes Frías y Embutidos', 'Embutidos'];
  return [];
}

function loadCart() {
  try { return JSON.parse(localStorage.getItem(CART_KEY) || '[]'); }
  catch { return []; }
}

function saveCart(c) { localStorage.setItem(CART_KEY, JSON.stringify(c)); }

function debounce(fn, ms) {
  let t;
  return (...a) => { clearTimeout(t); t = setTimeout(() => fn(...a), ms); };
}

/* =========================================
   RENDER
   ========================================= */
export function renderShopping(container) {
  const diet = getUserDiet();
  const excludedDefault = getExcluded(diet);
  let cart = loadCart();
  let categories = [];
  let page = 1;
  let pages = 1;
  let search = '';
  let selectedCat = '';
  let showAll = localStorage.getItem(DIET_KEY) === 'true';

  /* --- initial HTML --- */
  container.innerHTML = `
    <div class="shop-page-header">
      <h1>Lista de Compras</h1>
      <p>Busca ingredientes y agrega lo que necesites a tu carrito</p>
    </div>

    <div class="shop-search-wrap">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
      <input class="shop-search" id="shopSearch" type="text" placeholder="Buscar ingrediente..." />
    </div>

    ${excludedDefault.length ? `
      <div class="shop-diet-bar">
        <label>
          <input type="checkbox" id="shopShowAll" ${showAll ? 'checked' : ''} />
          Mostrar todos los productos (incluye no aptos para tu dieta)
        </label>
      </div>
    ` : ''}

    <div class="shop-pills" id="shopPills"></div>

    <div class="shop-main">
      <div class="shop-catalog-area">
        <div id="shopGrid" class="shop-grid">
          <div class="shop-empty">Cargando ingredientes...</div>
        </div>
      </div>

      <div class="shop-cart-overlay" id="shopCartOverlay"></div>
      <div class="shop-cart" id="shopCart">
        <div class="shop-cart-drag-handle"></div>
        <div class="shop-cart-header">
          <div class="shop-cart-title">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
            Mi Carrito
          </div>
          <span class="shop-cart-badge" id="cartBadge">0</span>
          <button class="shop-cart-close" id="cartCloseBtn" aria-label="Cerrar carrito">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>
        <div class="shop-cart-items" id="cartItems">
          <div class="shop-cart-empty">
            <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
            <p>Tu carrito está vacío</p>
          </div>
        </div>
        <div class="shop-cart-footer" id="cartFooter" style="display:none">
          <div class="shop-cart-total-row">
            <span class="shop-cart-total-label">Total estimado</span>
            <span class="shop-cart-total-value" id="cartTotal">$0</span>
          </div>
          <button class="shop-cart-generate" id="cartGenerate">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
            Generar lista
          </button>
        </div>
      </div>
    </div>

    <button class="shop-float-cart" id="shopFloatCart">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
      Ir al carrito <span class="shop-float-badge" id="floatBadge">0</span>
    </button>
  `;

  /* --- event listeners --- */
  document.getElementById('shopSearch').addEventListener('input', debounce(() => {
    search = document.getElementById('shopSearch').value;
    page = 1;
    loadIngredients();
  }, 300));

  document.getElementById('cartGenerate').addEventListener('click', showModal);

  function openCart() {
    const cartEl = document.getElementById('shopCart');
    const overlay = document.getElementById('shopCartOverlay');
    if (cartEl) cartEl.classList.add('expanded');
    if (overlay) overlay.classList.add('open');
  }

  function closeCart() {
    const cartEl = document.getElementById('shopCart');
    const overlay = document.getElementById('shopCartOverlay');
    if (cartEl) cartEl.classList.remove('expanded');
    if (overlay) overlay.classList.remove('open');
  }

  function toggleCart() {
    const cartEl = document.getElementById('shopCart');
    if (cartEl && cartEl.classList.contains('expanded')) {
      closeCart();
    } else {
      openCart();
    }
  }

  const floatBtn = document.getElementById('shopFloatCart');
  if (floatBtn) {
    floatBtn.addEventListener('click', () => {
      if (window.innerWidth <= 768) {
        openCart();
      } else {
        const cartEl = document.getElementById('shopCart');
        if (cartEl) cartEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  }

  const overlay = document.getElementById('shopCartOverlay');
  if (overlay) {
    overlay.addEventListener('click', closeCart);
  }

  const cartDragHandle = document.querySelector('.shop-cart-drag-handle');
  if (cartDragHandle) {
    cartDragHandle.addEventListener('click', (e) => {
      e.stopPropagation();
      closeCart();
    });
  }

  const cartCloseBtn = document.getElementById('cartCloseBtn');
  if (cartCloseBtn) {
    cartCloseBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      closeCart();
    });
  }

  const cartHeader = document.querySelector('.shop-cart-header');
  if (cartHeader) {
    cartHeader.addEventListener('click', () => {
      if (window.innerWidth <= 768) {
        toggleCart();
      }
    });
  }

  const cb = document.getElementById('shopShowAll');
  if (cb) cb.addEventListener('change', () => {
    showAll = cb.checked;
    localStorage.setItem(DIET_KEY, showAll);
    page = 1;
    loadCategories();
    loadIngredients();
  });

  loadCategories();
  loadIngredients();
  renderCart();

  /* --- helpers --- */
  function activeExcluded() { return showAll ? [] : excludedDefault; }

  async function loadCategories() {
    try {
      categories = await get('/ingredients/categories');
      const excl = activeExcluded();
      const vis = categories.filter(c => !excl.includes(c));

      document.getElementById('shopPills').innerHTML =
        `<button class="shop-pill active" data-cat="">Todos</button>` +
        vis.map(c => `<button class="shop-pill" data-cat="${c}">${c}</button>`).join('');

      document.querySelectorAll('.shop-pill').forEach(b => b.addEventListener('click', () => {
        document.querySelectorAll('.shop-pill').forEach(p => p.classList.remove('active'));
        b.classList.add('active');
        selectedCat = b.dataset.cat;
        page = 1;
        loadIngredients();
      }));
    } catch {}
  }

  async function loadIngredients() {
    const grid = document.getElementById('shopGrid');
    grid.innerHTML = '<div class="shop-empty">Cargando...</div>';

    try {
      const excl = activeExcluded();
      const p = new URLSearchParams({ page, limit: 30 });
      if (search.trim()) p.set('search', search.trim());
      if (selectedCat) p.set('category', selectedCat);

      const data = await get(`/ingredients?${p}`);
      const list = excl.length
        ? data.ingredients.filter(i => !excl.includes(i.category))
        : data.ingredients;
      pages = data.pages;

      if (!list.length) {
        grid.innerHTML = `
          <div class="shop-empty">
            <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <p>No se encontraron ingredientes</p>
          </div>`;
        return;
      }

      let html = '';
      list.forEach(ing => {
        const unit = extractUnit(ing.name);
        const name = cleanName(ing.name);
        const inCart = cart.some(c => c.id === ing.id);
        const img = getIngredientImage(name);

        html += `
          <div class="shop-card">
            <div class="shop-card-img">
              <img src="${img}" alt="${escapeHtml(name)}" loading="lazy" onerror="var s=this;s.style.display='none';s.nextElementSibling.style.display='flex'">
              <div class="shop-card-img-placeholder" style="display:none">
                <span>${(ing.category || '').substring(0, 12)}</span>
              </div>
            </div>
            <div class="shop-card-body">
              <span class="shop-card-category">${(ing.category || 'General').substring(0, 15)}</span>
              <div class="shop-card-name" title="${escapeHtml(ing.name)}">${escapeHtml(name)}</div>
              ${unit ? `<span class="shop-card-unit">${unit}</span>` : ''}
            </div>
            <div class="shop-card-footer">
              <span class="shop-card-price">${formatCOP(ing.price_per_unit || 0)}</span>
              <button class="shop-card-add ${inCart ? 'in-cart' : ''}" data-id="${ing.id}" title="${inCart ? 'En el carrito' : 'Agregar'}">
                ${inCart ? '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>' : '+'}
              </button>
            </div>
          </div>`;
      });

      if (pages > 1) {
        html += renderPagination();
      }

      grid.innerHTML = html;

      grid.querySelectorAll('.shop-card-add').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          const ing = list.find(i => i.id === parseInt(btn.dataset.id));
          if (ing) addToCart(ing);
        });
      });

      grid.querySelectorAll('.shop-page-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          page = parseInt(btn.dataset.page);
          loadIngredients();
          document.querySelector('.shop-catalog-area').scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
      });

    } catch {
      grid.innerHTML = '<div class="shop-empty">Error al cargar ingredientes</div>';
    }
  }

  function renderPagination() {
    let h = '<div class="shop-pagination">';
    h += `<button class="shop-page-btn" data-page="${page - 1}" ${page <= 1 ? 'disabled' : ''}>‹</button>`;
    const s = Math.max(1, page - 2), e = Math.min(pages, page + 2);
    for (let i = s; i <= e; i++) {
      h += `<button class="shop-page-btn ${i === page ? 'active' : ''}" data-page="${i}">${i}</button>`;
    }
    h += `<button class="shop-page-btn" data-page="${page + 1}" ${page >= pages ? 'disabled' : ''}>›</button>`;
    h += `<span class="shop-page-info">Página ${page} de ${pages}</span></div>`;
    return h;
  }

  /* --- cart logic --- */
  function addToCart(ing) {
    const unit = extractUnit(ing.name);
    const existing = cart.find(c => c.id === ing.id);
    if (existing) {
      existing.qty += 1;
    } else {
      cart.push({
        id: ing.id,
        name: cleanName(ing.name),
        fullName: ing.name,
        price: parseFloat(ing.price_per_unit) || 0,
        unit: unit || '',
        qty: 1,
      });
    }
    saveCart(cart);
    renderCart();
    logUsage('cart_item_added', ing.id);

    const btn = document.querySelector(`.shop-card-add[data-id="${ing.id}"]`);
    if (btn) {
      btn.classList.add('in-cart');
      btn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>';
      btn.title = 'En el carrito';
    }
  }

  function removeFromCart(id) {
    cart = cart.filter(c => c.id !== id);
    saveCart(cart);
    renderCart();
    loadIngredients();
  }

  function updateQty(id, d) {
    const it = cart.find(c => c.id === id);
    if (!it) return;
    it.qty = Math.max(1, it.qty + d);
    saveCart(cart);
    renderCart();
  }

  function renderCart() {
    const itemsEl = document.getElementById('cartItems');
    const footerEl = document.getElementById('cartFooter');
    const badge = document.getElementById('cartBadge');
    const totalEl = document.getElementById('cartTotal');
    const floatBadge = document.getElementById('floatBadge');
    const totalCount = cart.reduce((s, i) => s + i.qty, 0);

    badge.textContent = totalCount;
    if (floatBadge) floatBadge.textContent = totalCount;

    const floatBtn = document.getElementById('shopFloatCart');
    if (floatBtn) {
      floatBtn.classList.toggle('visible', totalCount > 0);
    }

    if (!cart.length) {
      itemsEl.innerHTML = `
        <div class="shop-cart-empty">
          <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
          <p>Tu carrito está vacío</p>
        </div>`;
      footerEl.style.display = 'none';
      return;
    }

    footerEl.style.display = '';
    let total = 0;

    itemsEl.innerHTML = cart.map(it => {
      const sub = it.price * it.qty;
      total += sub;
      return `
        <div class="shop-cart-row">
          <div class="shop-cart-row-info">
            <div class="shop-cart-row-name">${escapeHtml(it.name)}</div>
            ${it.unit ? `<div class="shop-cart-row-unit">${it.unit}</div>` : ''}
            <div class="shop-cart-row-price">${formatCOP(it.price)} × ${it.qty} = ${formatCOP(sub)}</div>
          </div>
          <div class="shop-qty">
            <button data-action="minus" data-id="${it.id}">−</button>
            <span>${it.qty}</span>
            <button data-action="plus" data-id="${it.id}">+</button>
          </div>
          <button class="shop-cart-row-del" data-action="delete" data-id="${it.id}" title="Eliminar">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>`;
    }).join('');

    totalEl.textContent = formatCOP(total);

    itemsEl.querySelectorAll('.shop-qty button, .shop-cart-row-del').forEach(b => {
      b.addEventListener('click', () => {
        const id = parseInt(b.dataset.id);
        const a = b.dataset.action;
        if (a === 'delete') removeFromCart(id);
        else if (a === 'minus') updateQty(id, -1);
        else if (a === 'plus') updateQty(id, 1);
      });
    });
  }

  /* --- modal --- */
  function showModal() {
    if (!cart.length) return;
    let total = 0;

    const overlay = document.createElement('div');
    overlay.className = 'shop-modal-overlay';
    overlay.innerHTML = `
      <div class="shop-modal">
        <h3>Tu lista de compras</h3>
        <ul class="shop-modal-list">
          ${cart.map(it => {
            const sub = it.price * it.qty;
            total += sub;
            return `<li><span class="item-name">${it.name}${it.unit ? ' (' + it.unit + ')' : ''} × ${it.qty}</span><span class="item-price">${formatCOP(sub)}</span></li>`;
          }).join('')}
        </ul>
        <div class="shop-modal-total"><span>Total</span><span>${formatCOP(total)}</span></div>
        <div class="shop-modal-actions">
          <button class="shop-modal-btn" id="mClose">Cerrar</button>
          <button class="shop-modal-btn shop-modal-btn-primary" id="mCopy">Copiar lista</button>
        </div>
      </div>`;

    document.body.appendChild(overlay);
    overlay.addEventListener('click', e => { if (e.target === overlay) overlay.remove(); });
    overlay.querySelector('#mClose').addEventListener('click', () => overlay.remove());
    overlay.querySelector('#mCopy').addEventListener('click', () => {
      const txt = cart.map(it =>
        `${it.name}${it.unit ? ' (' + it.unit + ')' : ''} × ${it.qty} — ${formatCOP(it.price * it.qty)}`
      ).join('\n');
      navigator.clipboard.writeText(txt + `\n\nTotal: ${formatCOP(total)}`)
        .then(() => alert('Lista copiada al portapapeles'))
        .catch(() => alert('No se pudo copiar'));
      logUsage('shopping_list_copied');
    });
  }
}
