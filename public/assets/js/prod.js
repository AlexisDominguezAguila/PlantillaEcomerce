/* =========================================================
   Configuración
========================================================= */
const API_URL = "../controllers/ProductosController.php";
const IMG_URL = "../uploads/productos/";
const CURRENCY = "S/.";
const AUTOPLAY_MS = 6000;

/* =========================================================
   Estado Global
========================================================= */
let products = [];
let categories = [];
let selectedCategory = "all";

let cart = [];
let wishlist = [];

let currentSlide = 0;
let sliderTimer = null;

/* =========================================================
   Utilidades
========================================================= */
const fmtMoney = (n) =>
  `${CURRENCY} ${Number(n || 0).toLocaleString("es-PE", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

function isHttpUrl(u = "") {
  return /^https?:\/\//i.test(String(u));
}
function safeImg(path) {
  if (!path) return "../assets/images/no-image.png";
  return isHttpUrl(path) ? path : IMG_URL + path.replace(/^\/+/, "");
}

/* =========================================================
   API
========================================================= */
async function fetchCategories() {
  try {
    const res = await fetch(`${API_URL}?action=categorias`);
    const data = await res.json();
    if (Array.isArray(data)) return data;
    return data?.categories || [];
  } catch (e) {
    console.error("fetchCategories", e);
    return [];
  }
}

async function fetchProductos(categoryId = null) {
  try {
    const q =
      categoryId && categoryId !== "all" ? `&category_id=${categoryId}` : "";
    const res = await fetch(`${API_URL}?action=listar${q}`);
    const rows = await res.json();
    return (rows || []).map((p) => {
      const first = p.first_image
        ? safeImg(p.first_image)
        : "../assets/images/no-image.png";
      return {
        id: Number(p.id),
        name: p.name || "Producto",
        price: Number(p.price || 0),
        description: p.description || "",
        category_id: Number(p.category_id || 0),
        category: p.category_name || "",
        image: first,
        images: [first],
        // flags opcionales si luego los agregas en la DB
        is_new: Number(p.is_new || 0) === 1,
        is_hot: Number(p.is_hot || 0) === 1,
        is_offer: Number(p.is_offer || 0) === 1,
        badge_text: p.badge_text || "",
      };
    });
  } catch (e) {
    console.error("fetchProductos", e);
    return [];
  }
}

/* =========================================================
   HERO SLIDER
========================================================= */
function getBadges(p) {
  const arr = [];
  if (p.is_new) arr.push({ k: "nuevo", label: "Nuevo" });
  if (p.is_hot) arr.push({ k: "hot", label: "Hot" });
  if (p.is_offer) arr.push({ k: "oferta", label: "Oferta" });

  if (p.badge_text) {
    p.badge_text
      .split(",")
      .map((s) => s.trim().toLowerCase())
      .forEach((tag) => {
        if (!["nuevo", "hot", "oferta"].includes(tag)) {
          arr.push({ k: "custom", label: tag });
        }
      });
  }
  return arr;
}

function buildHeroSlides(list) {
  const track = $("#sliderTrack");
  const dotsWrap = $("#sliderDots");
  if (!track || !dotsWrap) return;

  track.innerHTML = "";
  dotsWrap.innerHTML = "";

  const data = list.length
    ? list
    : [
        {
          id: 0,
          name: "Producto destacado",
          price: 0,
          image: "../assets/images/no-image.png",
        },
      ];

  data.forEach((p, idx) => {
    const slide = document.createElement("article");
    slide.className = "hero-slide";
    slide.innerHTML = `
      <div class="hero-left">
        <h2 class="hero-title">${p.name}</h2>
        <div class="hero-price">
          <span class="price">${fmtMoney(p.price)}</span>
        </div>
      </div>

      <div class="hero-right">
        <div class="hero-media">
          <img class="hero-img" src="${p.image}" alt="${p.name}" />
        </div>
      </div>
    `;
    track.appendChild(slide);

    const dot = document.createElement("button");
    dot.className = "dot" + (idx === 0 ? " active" : "");
    dot.setAttribute("aria-label", `Ir al slide ${idx + 1}`);
    dot.addEventListener("click", () => goToSlide(idx));
    dotsWrap.appendChild(dot);
  });

  currentSlide = 0;
  goToSlide(0);
  startAutoplay();
  addHoverPause();
  addSwipe(track);
}

function goToSlide(index) {
  const track = $("#sliderTrack");
  const dots = $$(".dot");
  const total = track?.children?.length || 0;
  if (!total) return;

  currentSlide = (index + total) % total;
  const x = -currentSlide * 100;
  track.style.transform = `translateX(${x}%)`;
  dots.forEach((d, i) => d.classList.toggle("active", i === currentSlide));
}

function nextSlide() {
  goToSlide(currentSlide + 1);
}
function prevSlide() {
  goToSlide(currentSlide - 1);
}

function startAutoplay() {
  stopAutoplay();
  sliderTimer = setInterval(nextSlide, AUTOPLAY_MS);
}
function stopAutoplay() {
  if (sliderTimer) clearInterval(sliderTimer);
  sliderTimer = null;
}
function addHoverPause() {
  const container = $(".hero-slider");
  if (!container) return;
  container.addEventListener("mouseenter", stopAutoplay);
  container.addEventListener("mouseleave", startAutoplay);
}
function addSwipe(el) {
  let startX = 0,
    dx = 0,
    touching = false;
  el.addEventListener(
    "touchstart",
    (e) => {
      touching = true;
      startX = e.touches[0].clientX;
      dx = 0;
      stopAutoplay();
    },
    { passive: true }
  );
  el.addEventListener(
    "touchmove",
    (e) => {
      if (!touching) return;
      dx = e.touches[0].clientX - startX;
    },
    { passive: true }
  );
  el.addEventListener("touchend", () => {
    touching = false;
    if (Math.abs(dx) > 40) dx < 0 ? nextSlide() : prevSlide();
    startAutoplay();
  });
}

// Flechas
document.getElementById("nextBtn")?.addEventListener("click", nextSlide);
document.getElementById("prevBtn")?.addEventListener("click", prevSlide);

/* =========================================================
   CATEGORÍAS
   HTML sugerido:
   - Contenedor de píldoras: #categoryList (opcional)
   - <select id="categorySelect"> (fallback si no hay píldoras)
========================================================= */
function renderCategoryUI() {
  const pillsWrap = $("#categoryList");
  const select = $("#categorySelect");

  const allItem = { id: "all", name: "Todas" };
  const data = [allItem, ...categories];

  // Píldoras
  if (pillsWrap) {
    pillsWrap.innerHTML = data
      .map((c) => {
        const active =
          String(selectedCategory) === String(c.id) ? "is-active" : "";
        return `<button class="cat-pill ${active}" data-cid="${c.id}">${c.name}</button>`;
      })
      .join("");
  }

  // Select
  if (select) {
    select.innerHTML = data
      .map(
        (c) =>
          `<option value="${c.id}" ${
            String(selectedCategory) === String(c.id) ? "selected" : ""
          }>${c.name}</option>`
      )
      .join("");
  }

  // Delegación
  pillsWrap?.addEventListener("click", async (e) => {
    const btn = e.target.closest("[data-cid]");
    if (!btn) return;
    const cid = btn.dataset.cid;
    await handleCategoryChange(cid);
  });
  select?.addEventListener("change", async (e) => {
    await handleCategoryChange(e.target.value);
  });
}

async function handleCategoryChange(cid) {
  selectedCategory = cid || "all";
  // resaltar píldoras
  $$("#categoryList .cat-pill").forEach((b) =>
    b.classList.toggle(
      "is-active",
      String(b.dataset.cid) === String(selectedCategory)
    )
  );
  // recargar productos
  products = await fetchProductos(
    selectedCategory !== "all" ? Number(selectedCategory) : null
  );
  buildHeroSlides(products.slice(0, 6));
  renderProductGrid(products);
}

/* =========================================================
   GRID DE PRODUCTOS
   HTML esperado/sugerido:
   - sección contenedora #catalogo
   - grid #productGrid (si no existe, lo creamos)
========================================================= */
function ensureCatalogContainers() {
  let catalogo = document.getElementById("catalogo");
  if (!catalogo) {
    // crea sección si no existe
    catalogo = document.createElement("section");
    catalogo.id = "catalogo";
    // lo insertamos después del hero
    const hero = $(".hero-slider");
    (hero?.parentNode || document.body).insertBefore(
      catalogo,
      hero?.nextSibling || null
    );

    // título + select fallback si no existía
    const header = document.createElement("div");
    header.id = "catalogoHeader";
    header.innerHTML = `
      <div class="catalogo-title">
        <h3>Productos</h3>
        <div id="categoryList" class="category-list"></div>
      </div>
      <div class="catalogo-filters">
        <label for="categorySelect" class="sr-only">Categoría</label>
        <select id="categorySelect" class="category-select"></select>
      </div>
    `;
    catalogo.appendChild(header);

    const grid = document.createElement("div");
    grid.id = "productGrid";
    grid.className = "product-grid";
    catalogo.appendChild(grid);
  } else {
    // si existe, asegura grid
    if (!$("#productGrid", catalogo)) {
      const grid = document.createElement("div");
      grid.id = "productGrid";
      grid.className = "product-grid";
      catalogo.appendChild(grid);
    }
    if (!$("#categoryList", catalogo)) {
      const list = document.createElement("div");
      list.id = "categoryList";
      list.className = "category-list";
      $("#catalogoHeader", catalogo)?.appendChild(list);
    }
    if (!$("#categorySelect", catalogo)) {
      const selWrap = document.createElement("div");
      selWrap.className = "catalogo-filters";
      selWrap.innerHTML = `
        <label for="categorySelect" class="sr-only">Categoría</label>
        <select id="categorySelect" class="category-select"></select>
      `;
      catalogo.insertBefore(selWrap, $("#productGrid", catalogo));
    }
  }
  return catalogo;
}

function productCardHTML(p) {
  return `
    <article class="product-card" data-id="${p.id}">
      <div class="product-media">
        <img src="${p.image}" alt="${p.name}" loading="lazy" />
        <div class="product-actions">
          <button class="btn-icon" data-action="add-cart" title="Agregar al carrito">
            <i class="bx bx-cart"></i>
          </button>
          <button class="btn-icon" data-action="add-wish" title="Agregar a deseos">
            <i class="bx bx-heart"></i>
          </button>
        </div>
      </div>
      <div class="product-body">
        <h4 class="product-title">${p.name}</h4>
        <div class="product-meta">
          <span class="product-price">${fmtMoney(p.price)}</span>
          ${p.category ? `<span class="product-cat">${p.category}</span>` : ""}
        </div>
        <button class="btn btn-primary btn-block" data-action="add-cart">
          <i class="bx bx-cart"></i> Añadir
        </button>
      </div>
    </article>
  `;
}

function renderProductGrid(list) {
  ensureCatalogContainers();
  const grid = $("#productGrid");
  if (!grid) return;
  if (!list || !list.length) {
    grid.innerHTML = `<div class="list-empty">No hay productos disponibles en esta categoría.</div>`;
    return;
  }
  grid.innerHTML = list.map(productCardHTML).join("");
}

/* =========================================================
   CARRITO & WISHLIST
========================================================= */
const els = {
  // FAB
  fabCart: document.getElementById("fabCart"),
  fabWishlist: document.getElementById("fabWishlist"),
  cartCountFab: document.getElementById("cartCountFab"),
  wishCountFab: document.getElementById("wishCountFab"),

  // Modales
  cartModal: document.getElementById("cartModal"),
  wishModal: document.getElementById("wishlistModal"),
  cartClose: document.getElementById("cartModalClose"),
  wishClose: document.getElementById("wishlistModalClose"),

  // Contenido
  cartItems: document.getElementById("cartItems"),
  cartTotal: document.getElementById("cartTotal"),
  wishItems: document.getElementById("wishlistItems"),
};

function openModal(modalEl) {
  if (!modalEl) return;
  modalEl.classList.add("is-open");
  document.documentElement.style.overflow = "hidden";
}
function closeModal(modalEl) {
  if (!modalEl) return;
  modalEl.classList.remove("is-open");
  document.documentElement.style.overflow = "";
}

// Persistencia
function saveLocal() {
  try {
    localStorage.setItem("cart", JSON.stringify(cart || []));
  } catch {}
  try {
    localStorage.setItem("wishlist", JSON.stringify(wishlist || []));
  } catch {}
}
function loadLocal() {
  try {
    cart = JSON.parse(localStorage.getItem("cart") || "[]");
  } catch {
    cart = [];
  }
  try {
    wishlist = JSON.parse(localStorage.getItem("wishlist") || "[]");
  } catch {
    wishlist = [];
  }
  updateCounts();
}

function updateCounts() {
  const c = (cart || []).reduce((a, x) => a + (Number(x.qty) || 1), 0);
  const w = (wishlist || []).length;

  // FAB badges
  if (els.cartCountFab) els.cartCountFab.textContent = String(c);
  if (els.wishCountFab) els.wishCountFab.textContent = String(w);

  // si tienes contadores en header/topbar
  const elH1 = document.getElementById("cartCount");
  const elH2 =
    document.getElementById("wishlistCount") ||
    document.getElementById("wishCount");
  if (elH1) elH1.textContent = String(c);
  if (elH2) elH2.textContent = String(w);
}

function cartRowHTML(item) {
  const img = safeImg(item.image);
  const subtotal = Number(item.price || 0) * Number(item.qty || 1);
  return `
    <div class="cart-row" data-id="${item.id}">
      <img src="${img}" alt="${item.name || "Producto"}" />
      <div>
        <div class="cart-title">${item.name || "Producto"}</div>
        <div class="cart-meta">${fmtMoney(item.price || 0)}</div>
      </div>
      <div class="cart-controls">
        <button class="qty-btn" data-action="dec">-</button>
        <input class="qty-input" type="number" min="1" value="${Number(
          item.qty || 1
        )}" />
        <button class="qty-btn" data-action="inc">+</button>
        <span class="cart-meta" style="min-width:90px; text-align:right;">${fmtMoney(
          subtotal
        )}</span>
        <button class="remove-btn" data-action="remove" title="Quitar"><i class="bx bx-trash"></i></button>
      </div>
    </div>
  `;
}
function wishRowHTML(item) {
  const img = safeImg(item.image);
  return `
    <div class="wish-row" data-id="${item.id}">
      <img src="${img}" alt="${item.name || "Producto"}" />
      <div>
        <div class="wish-title">${item.name || "Producto"}</div>
        <div class="wish-meta">${fmtMoney(item.price || 0)}</div>
      </div>
      <div>
        <button class="btn btn-primary" data-action="to-cart">Añadir al carrito</button>
        <button class="remove-btn" data-action="remove" title="Quitar"><i class="bx bx-x"></i></button>
      </div>
    </div>
  `;
}

function renderCart() {
  if (!els.cartItems || !els.cartTotal) return;
  if (!cart || !cart.length) {
    els.cartItems.innerHTML = `<div class="list-empty">Tu carrito está vacío.</div>`;
    els.cartTotal.textContent = fmtMoney(0);
    updateCounts();
    return;
  }
  els.cartItems.innerHTML = cart.map(cartRowHTML).join("");
  const total = cart.reduce(
    (acc, it) => acc + Number(it.price || 0) * Number(it.qty || 1),
    0
  );
  els.cartTotal.textContent = fmtMoney(total);
  updateCounts();
}

function renderWishlist() {
  if (!els.wishItems) return;
  if (!wishlist || !wishlist.length) {
    els.wishItems.innerHTML = `<div class="list-empty">Aún no tienes productos en tu lista de deseos.</div>`;
    updateCounts();
    return;
  }
  els.wishItems.innerHTML = wishlist.map(wishRowHTML).join("");
  updateCounts();
}

function addToCart(product, qty = 1) {
  const id = Number(product.id);
  const i = (cart || []).findIndex((x) => Number(x.id) === id);
  if (i >= 0) {
    cart[i].qty = Number(cart[i].qty || 1) + Number(qty || 1);
  } else {
    cart.push({
      id,
      name: product.name,
      price: Number(product.price || 0),
      image: product.image || "",
      qty: Number(qty || 1),
    });
  }
  saveLocal();
  renderCart();
}

function removeFromCart(id) {
  cart = (cart || []).filter((x) => Number(x.id) !== Number(id));
  saveLocal();
  renderCart();
}

function setQty(id, qty) {
  qty = Math.max(1, Number(qty || 1));
  const i = (cart || []).findIndex((x) => Number(x.id) === Number(id));
  if (i >= 0) {
    cart[i].qty = qty;
    saveLocal();
    renderCart();
  }
}

function addToWishlist(product) {
  const id = Number(product.id);
  if (!(wishlist || []).some((x) => Number(x.id) === id)) {
    wishlist.push({
      id,
      name: product.name,
      price: Number(product.price || 0),
      image: product.image || "",
    });
    saveLocal();
    renderWishlist();
  }
}

function removeFromWishlist(id) {
  wishlist = (wishlist || []).filter((x) => Number(x.id) !== Number(id));
  saveLocal();
  renderWishlist();
}

/* Delegación de eventos en modales */
els.cartItems?.addEventListener("click", (e) => {
  const row = e.target.closest(".cart-row");
  if (!row) return;
  const id = row.dataset.id;
  if (e.target.matches('[data-action="inc"]')) {
    const current = Number(row.querySelector(".qty-input")?.value || 1);
    setQty(id, current + 1);
  }
  if (e.target.matches('[data-action="dec"]')) {
    const current = Number(row.querySelector(".qty-input")?.value || 1);
    setQty(id, Math.max(1, current - 1));
  }
  if (e.target.matches('[data-action="remove"], .remove-btn *')) {
    removeFromCart(id);
  }
});
els.cartItems?.addEventListener("change", (e) => {
  const row = e.target.closest(".cart-row");
  if (row && e.target.matches(".qty-input")) {
    const id = row.dataset.id;
    setQty(id, Number(e.target.value || 1));
  }
});

els.wishItems?.addEventListener("click", (e) => {
  const row = e.target.closest(".wish-row");
  if (!row) return;
  const id = Number(row.dataset.id);
  if (e.target.matches('[data-action="remove"], .remove-btn *')) {
    removeFromWishlist(id);
  }
  if (e.target.matches('[data-action="to-cart"]')) {
    const item = (wishlist || []).find((x) => Number(x.id) === id);
    if (item) addToCart(item, 1);
  }
});

// Abrir/cerrar modales
els.fabCart?.addEventListener("click", () => {
  renderCart();
  openModal(els.cartModal);
});
els.fabWishlist?.addEventListener("click", () => {
  renderWishlist();
  openModal(els.wishModal);
});
els.cartClose?.addEventListener("click", () => closeModal(els.cartModal));
els.wishClose?.addEventListener("click", () => closeModal(els.wishModal));
els.cartModal?.addEventListener("click", (e) => {
  if (e.target === els.cartModal) closeModal(els.cartModal);
});
els.wishModal?.addEventListener("click", (e) => {
  if (e.target === els.wishModal) closeModal(els.wishModal);
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    closeModal(els.cartModal);
    closeModal(els.wishModal);
  }
});

/* =========================================================
   Delegación global para cards & hero
========================================================= */
document.body.addEventListener("click", (e) => {
  // Cards (grid) y CTA hero
  const card = e.target.closest("[data-action]");
  if (!card) return;

  const action = card.getAttribute("data-action");
  const article = e.target.closest("[data-id]"); // hero usa data-id en botón, card en article
  const id = Number(card.dataset.id || article?.dataset.id || 0);
  if (!id) return;

  const p = products.find((x) => Number(x.id) === id);
  if (!p) return;

  if (action === "add-cart" || action === "buy-now") {
    addToCart(p, 1);
    if (action === "buy-now") {
      // abre carrito si existe modal
      if (els.cartModal) {
        renderCart();
        openModal(els.cartModal);
      }
    }
  }
  if (action === "add-wish") {
    addToWishlist(p);
  }
});
function setStickyTop() {
  const topbarH = document.querySelector(".topbar")?.offsetHeight || 0;
  const headerH = document.querySelector(".header")?.offsetHeight || 0;
  const val = topbarH + headerH || 64;
  document.documentElement.style.setProperty("--sticky-top", `${val}px`);
}

function bindCategoryScroller() {
  const scroller = document.getElementById("categoryList");
  const left = document.getElementById("catScrollLeft");
  const right = document.getElementById("catScrollRight");
  const by = () => Math.max(240, Math.round(scroller.clientWidth * 0.85));

  left?.addEventListener("click", () =>
    scroller?.scrollBy({ left: -by(), behavior: "smooth" })
  );
  right?.addEventListener("click", () =>
    scroller?.scrollBy({ left: +by(), behavior: "smooth" })
  );
}

function bindFilterHamburger() {
  const btn = document.getElementById("filterToggle");
  const extra = document.getElementById("filtersExtra");
  if (!btn || !extra) return;
  btn.addEventListener("click", () => {
    const open = extra.classList.toggle("is-open");
    btn.setAttribute("aria-expanded", open ? "true" : "false");
  });
}

/* =========================================================
   Inicialización
========================================================= */
async function init() {
  loadLocal();

  // Carga categorías (si no hay, igual renderizamos productos)
  categories = await fetchCategories();
  ensureCatalogContainers();
  setStickyTop();
  bindCategoryScroller();
  bindFilterHamburger();
  window.addEventListener("resize", setStickyTop, { passive: true });

  renderCategoryUI();

  // Carga productos iniciales (todas)
  products = await fetchProductos(null);
  buildHeroSlides(products.slice(0, 6));
  renderProductGrid(products);
}

document.addEventListener("DOMContentLoaded", init);
