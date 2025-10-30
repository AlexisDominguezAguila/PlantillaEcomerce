/* =========================================================
   TEC RIVERA – Catálogo público completo
   (Catálogo + Detalle + Carrito + Wishlist + Checkout)
========================================================= */

/* ---------------------- Config ---------------------- */
const API_URL = "../controllers/ProductosController.php";
const IMG_URL = "../uploads/productos/";
const CURRENCY = "S/.";
const AUTOPLAY_MS = 6000;

// Métodos de pago (para Step 6)
const WHATSAPP_NUMBER = "51985468074";
const YAPE_PHONE = "985468074";
const PLIN_PHONE = "985468074";
const YAPE_QR = "../assets/images/yape.jpg";
const PLIN_QR = "../assets/images/plin.jpg";
const BANK_ACCOUNTS = [
  {
    bank: "BCP",
    holder: "TEC RIVERA",
    account: "53504461818006",
    cci: "00253510446181800638",
  },
  {
    bank: "INTERBANK",
    holder: "TEC RIVERA",
    account: "8983369307748",
    cci: "00389801336930774848",
  },
];

/* ---------------------- Estado Global ---------------------- */
let products = [];
let categories = [];
let selectedCategory = "all";

let cart = [];
let wishlist = [];

let currentSlide = 0;
let sliderTimer = null;

let searchQuery = "";
let priceMin = null;
let priceMax = null;

// Checkout
let checkoutStep = 1;
let selectedPaymentMethod = null;

/* ---------------------- Utils ---------------------- */
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));
const isHttpUrl = (u = "") => /^https?:\/\//i.test(String(u));
const safeImg = (path) =>
  !path
    ? "../assets/images/no-image.png"
    : isHttpUrl(path)
    ? path
    : IMG_URL + String(path).replace(/^\/+/, "");
const fmtMoney = (n) =>
  `${CURRENCY} ${Number(n || 0).toLocaleString("es-PE", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

function showNotification(msg) {
  const n = document.createElement("div");
  n.textContent = msg;
  n.style.cssText = `
    position:fixed;bottom:20px;right:20px;background:#111344;color:#fff;
    padding:1rem 1.25rem;border-radius:10px;box-shadow:0 10px 25px rgba(0,0,0,.25);
    z-index:10000;font-weight:600;animation:trSlideIn .25s ease`;
  document.body.appendChild(n);
  setTimeout(() => {
    n.style.animation = "trSlideOut .25s ease";
    setTimeout(() => n.remove(), 250);
  }, 2500);
}
(() => {
  const style = document.createElement("style");
  style.textContent = `
  @keyframes trSlideIn{from{transform:translateX(400px);opacity:0;}to{transform:translateX(0);opacity:1;}}
  @keyframes trSlideOut{from{transform:translateX(0);opacity:1;}to{transform:translateX(400px);opacity:0;}}`;
  document.head.appendChild(style);
})();

/* ---------------------- API ---------------------- */
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
      let imgs = [];
      if (Array.isArray(p.images)) {
        imgs = p.images.map(safeImg).filter(Boolean);
      } else if (typeof p.images === "string" && p.images.trim() !== "") {
        imgs = p.images
          .split(",")
          .map((s) => safeImg(s.trim()))
          .filter(Boolean);
      } else {
        imgs = [first];
      }
      return {
        id: Number(p.id),
        name: p.name || "Producto",
        price: Number(p.price || 0),
        description: p.description || "",
        category_id: Number(p.category_id || 0),
        category: p.category_name || "",
        image: first,
        images: imgs.length ? imgs : [first],
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

/* ---------------------- Persistencia ---------------------- */
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
  $("#cartCountFab") && ($("#cartCountFab").textContent = String(c));
  $("#wishCountFab") && ($("#wishCountFab").textContent = String(w));
  const elH1 = $("#cartCount");
  const elH2 = $("#wishlistCount") || $("#wishCount");
  if (elH1) elH1.textContent = String(c);
  if (elH2) elH2.textContent = String(w);
}

/* ---------------------- Layout helpers ---------------------- */
function setStickyTop() {
  const topbarH = $(".topbar")?.offsetHeight || 0;
  const headerH = $(".header")?.offsetHeight || 0;
  const val = topbarH + headerH || 74;
  document.documentElement.style.setProperty("--sticky-top", `${val}px`);
}
function bindCategoryScroller() {
  const scroller = $("#categoryList");
  const left = $("#catScrollLeft");
  const right = $("#catScrollRight");
  if (!scroller) return;
  const by = () => Math.max(240, Math.round(scroller.clientWidth * 0.85));
  left?.addEventListener("click", () =>
    scroller.scrollBy({ left: -by(), behavior: "smooth" })
  );
  right?.addEventListener("click", () =>
    scroller.scrollBy({ left: +by(), behavior: "smooth" })
  );
}
function bindHamburger() {
  const btn = $("#toolbarMore");
  const header = $("#catalogoHeader");
  if (!btn || !header) return;
  btn.addEventListener("click", () => {
    const open = header.classList.toggle("show-extra");
    btn.setAttribute("aria-expanded", open ? "true" : "false");
  });
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
        if (!["nuevo", "hot", "oferta"].includes(tag))
          arr.push({ k: "custom", label: tag });
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

  const data =
    list && list.length
      ? list.slice(0, 6)
      : [
          {
            id: 0,
            name: "Producto destacado",
            price: 0,
            image: "../assets/images/no-image.png",
            description: "",
          },
        ];

  data.forEach((p, idx) => {
    const badges = getBadges(p)
      .map((b) => `<span class="tag tag-${b.k}">${b.label}</span>`)
      .join("");

    const slide = document.createElement("div");
    slide.className = "slide";
    slide.style.flex = "0 0 100%";
    slide.style.minWidth = "100%";
    slide.innerHTML = `
      <div class="slide-inner">
        <div class="slide-content">
          <div class="tags">${badges}</div>
          <h2>${p.name}</h2>
          <div class="price">${fmtMoney(p.price)}</div>
          <div class="slide-ctas">
            <button class="btn btn-primary" data-action="open-detail" data-id="${
              p.id
            }">Ver detalle</button>
            <button class="btn btn-secondary" data-action="buy-now" data-id="${
              p.id
            }">Comprar ahora</button>
          </div>
        </div>
        <div class="slide-image"><img src="${p.image}" alt="${p.name}"></div>
      </div>`;
    track.appendChild(slide);

    const dot = document.createElement("div");
    dot.className = `dot ${idx === 0 ? "active" : ""}`;
    dot.onclick = () => goToSlide(idx);
    dotsWrap.appendChild(dot);
  });

  currentSlide = 0;
  goToSlide(0);
  startAutoplay();
  addHoverPause();
  addSwipe(track);

  $("#prevBtn") && ($("#prevBtn").onclick = prevSlide);
  $("#nextBtn") && ($("#nextBtn").onclick = nextSlide);
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
$("#nextBtn")?.addEventListener("click", nextSlide);
$("#prevBtn")?.addEventListener("click", prevSlide);

/* =========================================================
   CATEGORÍAS (píldoras + select)
========================================================= */
function renderCategoryUI() {
  const pillsWrap = $("#categoryList");
  const select = $("#categorySelect");

  const allItem = { id: "all", name: "Todas" };
  const data = [allItem, ...categories];

  if (pillsWrap) {
    pillsWrap.innerHTML = data
      .map((c) => {
        const active =
          String(selectedCategory) === String(c.id) ? "is-active" : "";
        return `<button class="cat-pill ${active}" data-cid="${c.id}">${c.name}</button>`;
      })
      .join("");
  }
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

  pillsWrap?.addEventListener("click", async (e) => {
    const btn = e.target.closest("[data-cid]");
    if (!btn) return;
    await handleCategoryChange(btn.dataset.cid);
  });
  select?.addEventListener("change", async (e) => {
    await handleCategoryChange(e.target.value);
  });
}
async function handleCategoryChange(cid) {
  selectedCategory = cid || "all";
  $$("#categoryList .cat-pill").forEach((b) =>
    b.classList.toggle(
      "is-active",
      String(b.dataset.cid) === String(selectedCategory)
    )
  );
  products = await fetchProductos(
    selectedCategory !== "all" ? Number(selectedCategory) : null
  );
  applyFiltersAndRender();
}

/* =========================================================
   GRID DE PRODUCTOS
========================================================= */
function productCardHTML(p) {
  // Determinar etiquetas basadas en propiedades del producto
  const etiquetas = [];
  if (p.is_hot) etiquetas.push('<span class="etiqueta-hot">Hot</span>');
  if (p.is_offer) etiquetas.push('<span class="etiqueta-oferta">Oferta</span>');
  if (p.is_new) etiquetas.push('<span class="etiqueta-nueva">Nuevo</span>');

  // Usar la segunda imagen para el hover si existe
  const hoverImage = p.images && p.images.length > 1 ? p.images[1] : null;

  // Si hay badge_text personalizado, usarlo como etiqueta adicional
  if (p.badge_text) {
    etiquetas.push(
      `<span class="etiqueta-personalizada">${p.badge_text}</span>`
    );
  }

  return `
    <article class="card-prod" data-id="${p.id}">
      <div class="header-prod">
        <!-- Imagen principal -->
        <img src="${p.image}" alt="${
    p.name
  }" class="product-image" loading="lazy" />
        
        <!-- Imagen hover (si existe) -->
        ${
          hoverImage
            ? `
          <div class="hover-image">
            <img src="${hoverImage}" alt="${p.name}" class="product-image-hover" loading="lazy" />
          </div>
        `
            : ""
        }
        
        <!-- Wishlist icon -->
        <button class="wishlist-icon" data-action="add-wish" data-id="${
          p.id
        }" title="Agregar a deseos">
          <i class="bx bx-heart"></i>
        </button>
        
        <!-- Etiquetas del producto -->
        ${
          etiquetas.length > 0
            ? `
          <div class="etiquetas-prod">
            ${etiquetas.join("")}
          </div>
        `
            : ""
        }
      </div>
      
      <div class="body-prod">
        <!-- Categoría -->
        ${
          p.category
            ? `
          <div class="categoria-prod">
            <span class="pill-prod">${p.category}</span>
          </div>
        `
            : ""
        }
        
        <!-- Nombre del producto -->
        <h3 class="nombre-prod" data-action="open-detail" data-id="${p.id}">${
    p.name
  }</h3>
        
        <!-- Descripción (opcional) -->
        ${
          p.description
            ? `
          <p class="product-description">${p.description.substring(0, 80)}${
                p.description.length > 80 ? "..." : ""
              }</p>
        `
            : ""
        }
        
        <!-- Precios -->
        <div class="precios-prod">
          <span class="precio-actual">${fmtMoney(p.price)}</span>
        </div>
        
        <!-- Botones -->
        <div class="botones-prod">
          <button class="buy-now" data-action="add-cart" data-id="${p.id}">
            Comprar ahora
          </button>
          <div class="botones-secundarios">
            <button class="add-to-cart" data-action="add-cart" data-id="${
              p.id
            }">
              <i class='bx bx-cart'></i> Agregar
            </button>
            <button class="view-details" data-action="open-detail" data-id="${
              p.id
            }">
              <i class='bx bx-info-circle'></i> Detalles
            </button>
          </div>
        </div>
      </div>
    </article>
  `;
}

// Función para renderizar la grid de productos
function renderProductGrid(list) {
  const grid = $("#productGrid");
  if (!grid) return;

  if (!list || !list.length) {
    grid.innerHTML = `<div class="list-empty">No hay productos disponibles en esta categoría.</div>`;
    return;
  }

  grid.innerHTML = list.map(productCardHTML).join("");

  // Agregar event listeners para los iconos de wishlist
  setTimeout(() => {
    document.querySelectorAll(".wishlist-icon").forEach((icon) => {
      icon.addEventListener("click", function (e) {
        e.stopPropagation();
        const productId = this.getAttribute("data-id");
        const heartIcon = this.querySelector("i");

        // Toggle visual
        this.classList.toggle("active");
        if (this.classList.contains("active")) {
          heartIcon.className = "bx bxs-heart";
        } else {
          heartIcon.className = "bx bx-heart";
        }

        // Llamar a la función para manejar el wishlist
        toggleWishlist(productId, this);
      });
    });
  }, 0);
}

// Función para manejar el toggle del wishlist
async function toggleWishlist(productId, element) {
  try {
    const response = await fetch(`${API_URL}?action=toggle_wish`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: `product_id=${productId}`,
    });

    const result = await response.json();

    if (!result.success) {
      // Revertir cambio visual si falla
      element.classList.toggle("active");
      const heartIcon = element.querySelector("i");
      heartIcon.className = element.classList.contains("active")
        ? "bx bxs-heart"
        : "bx bx-heart";

      console.error("Error al actualizar wishlist:", result.error);
    }
  } catch (error) {
    console.error("Error al actualizar wishlist:", error);
    // Revertir cambio visual
    element.classList.toggle("active");
    const heartIcon = element.querySelector("i");
    heartIcon.className = element.classList.contains("active")
      ? "bx bxs-heart"
      : "bx bx-heart";
  }
}

// Función para cargar y mostrar productos
async function loadAndRenderProducts(categoryId = null) {
  try {
    // Mostrar loading
    const grid = $("#productGrid");
    if (grid) {
      grid.innerHTML = '<div class="loading">Cargando productos...</div>';
    }

    // Obtener productos
    const productos = await fetchProductos(categoryId);

    // Renderizar grid
    renderProductGrid(productos);
  } catch (error) {
    console.error("Error al cargar productos:", error);
    const grid = $("#productGrid");
    if (grid) {
      grid.innerHTML = '<div class="error">Error al cargar los productos</div>';
    }
  }
}

/* ---------------------- Filtros y búsqueda ---------------------- */
function getVisibleProducts() {
  let list = products.slice();
  if (searchQuery) {
    const q = searchQuery.toLowerCase();
    list = list.filter(
      (p) =>
        (p.name || "").toLowerCase().includes(q) ||
        (p.description || "").toLowerCase().includes(q)
    );
  }
  if (priceMin != null)
    list = list.filter((p) => Number(p.price || 0) >= priceMin);
  if (priceMax != null)
    list = list.filter((p) => Number(p.price || 0) <= priceMax);
  return list;
}
function applyFiltersAndRender() {
  const visible = getVisibleProducts();
  buildHeroSlides(visible.slice(0, 6));
  renderProductGrid(visible);
}
function bindSearchAndPrice() {
  const s = $("#prodSearch");
  const minI = $("#priceMin");
  const maxI = $("#priceMax");

  s?.addEventListener("input", (e) => {
    searchQuery = (e.target.value || "").trim();
    applyFiltersAndRender();
  });
  const toNumOrNull = (v) => {
    const n = Number(v);
    return Number.isFinite(n) && n >= 0 ? n : null;
  };
  const clampMaxIfNeeded = () => {
    if (priceMin != null && priceMax != null && priceMax < priceMin) {
      priceMax = priceMin;
      if (maxI) maxI.value = String(priceMax);
    }
  };
  minI?.addEventListener("input", (e) => {
    priceMin = toNumOrNull(e.target.value);
    clampMaxIfNeeded();
    applyFiltersAndRender();
  });
  maxI?.addEventListener("input", (e) => {
    priceMax = toNumOrNull(e.target.value);
    clampMaxIfNeeded();
    applyFiltersAndRender();
  });
}

/* =========================================================
   CARRITO & WISHLIST
========================================================= */
const els = {
  // FABs
  fabCart: $("#fabCart"),
  fabWishlist: $("#fabWishlist"),
  cartCountFab: $("#cartCountFab"),
  wishCountFab: $("#wishCountFab"),

  // Modales
  cartModal: $("#cartModal"),
  wishModal: $("#wishlistModal"),
  cartClose: $("#cartModalClose"),
  wishClose: $("#wishlistModalClose"),
  checkoutModal: $("#checkoutModal"),
  checkoutClose: $("#checkoutClose"),

  // Contenido modal carrito/wishlist
  cartItems: $("#cartItems"),
  cartTotal: $("#cartTotal"),
  wishItems: $("#wishlistItems"),

  // Checkout botones
  nextStepBtn: $("#nextStepBtn"),
  prevStepBtn: $("#prevStepBtn"),

  // Checkout triggers
  checkoutBtnCart: $("#checkoutBtnCart"),
  checkoutBtnDetail: $("#checkoutBtnDetail"),
};

function openModal(modalEl) {
  if (!modalEl) return;
  modalEl.classList.add("is-open");
  document.documentElement.style.overflow = "hidden";
}
function closeModal(modalEl) {
  if (!modalEl) return;
  modalEl.classList.remove("is-open");
  if (!document.querySelector(".modal.is-open")) {
    document.documentElement.style.overflow = "";
  }
}

/* ---- Render carrito / wishlist ---- */
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

/* ---- Mutadores carrito / wishlist ---- */
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

/* ---- Delegación en modales ---- */
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
  if (e.target.matches('[data-action="remove"], .remove-btn *'))
    removeFromWishlist(id);
  if (e.target.matches('[data-action="to-cart"]')) {
    const item = (wishlist || []).find((x) => Number(x.id) === id);
    if (item) addToCart(item, 1);
  }
});

/* ---- Abrir/cerrar modales FAB ---- */
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

/* =========================================================
   DETALLE DE PRODUCTO + RECOMENDACIONES
========================================================= */
function showProductDetail(p) {
  if (!p) return;

  // toggle secciones
  $("#productGrid")?.classList.add("hidden");
  $("#productDetailSection")?.classList.remove("hidden");

  // migas y básicos
  $("#breadcrumb-name") && ($("#breadcrumb-name").textContent = p.name);
  $("#name") && ($("#name").textContent = p.name);
  $("#brand") && ($("#brand").textContent = p.category || "");
  $("#sku") && ($("#sku").textContent = `SKU: ${p.id}`);
  $("#prices") &&
    ($("#prices").innerHTML = `<span class="text-3xl font-bold">${fmtMoney(
      p.price
    )}</span>`);
  $("#shipping") &&
    ($("#shipping").innerHTML = `
    <div class="flex items-center gap-3 mb-2">
      <i data-lucide="truck" class="w-5 h-5 text-blue-600"></i>
      <div>
        <div class="font-semibold text-gray-900">Envío disponible en todo el país</div>
        <div class="text-sm text-gray-600">Tiempo estimado: 2-3 días hábiles</div>
      </div>
    </div>`);
  $("#stock") && ($("#stock").textContent = "Disponible en stock");

  // Favoritos
  const favIcon = $("#fav-btn i");
  if (favIcon) {
    const isFav = (wishlist || []).some((w) => Number(w.id) === Number(p.id));
    favIcon.classList.toggle("text-red-500", isFav);
    favIcon.classList.toggle("bx-heart", !isFav);
    favIcon.classList.toggle("bxs-heart", isFav);
    $("#fav-btn").onclick = () => {
      if (isFav) {
        removeFromWishlist(p.id);
      } else {
        addToWishlist(p);
      }
      // toggle visual
      favIcon.classList.toggle("text-red-500");
      favIcon.classList.toggle("bx-heart");
      favIcon.classList.toggle("bxs-heart");
    };
  }

  // Cantidad
  let cantidad = 1;
  const inputCantidad = $("#quantity");
  if (inputCantidad) inputCantidad.value = cantidad;
  $("#increment")?.addEventListener("click", () => {
    cantidad++;
    if (inputCantidad) inputCantidad.value = cantidad;
  });
  $("#decrement")?.addEventListener("click", () => {
    if (cantidad > 1) cantidad--;
    if (inputCantidad) inputCantidad.value = cantidad;
  });

  // Galería
  const imgs = p.images && p.images.length ? p.images : [p.image];
  let idx = 0;
  const main = $("#main-img");
  const thumbs = $("#thumbs");
  if (main) main.src = imgs[0];
  if (thumbs) {
    thumbs.innerHTML = "";
    imgs.forEach((src, i) => {
      const b = document.createElement("button");
      b.className = `w-20 h-20 rounded-lg overflow-hidden border-2 ${
        i === 0 ? "border-blue-500 shadow-md" : "border-gray-200"
      }`;
      b.innerHTML = `<img src="${src}" class="w-full h-full object-cover" alt="thumb ${
        i + 1
      }"/>`;
      b.onclick = () => {
        idx = i;
        if (main) main.src = src;
        $$("#thumbs button").forEach(
          (bb) =>
            (bb.className =
              "w-20 h-20 rounded-lg overflow-hidden border-2 border-gray-200")
        );
        b.className =
          "w-20 h-20 rounded-lg overflow-hidden border-2 border-blue-500 shadow-md";
      };
      thumbs.appendChild(b);
    });
  }
  $("#prev-img") &&
    ($("#prev-img").onclick = () => {
      idx = (idx - 1 + imgs.length) % imgs.length;
      if (main) main.src = imgs[idx];
    });
  $("#next-img") &&
    ($("#next-img").onclick = () => {
      idx = (idx + 1) % imgs.length;
      if (main) main.src = imgs[idx];
    });

  // Botones detalle
  $$(".btn-add-cart").forEach(
    (btn) =>
      (btn.onclick = () => {
        addToCart(p, cantidad);
        showNotification("Agregado al carrito");
      })
  );
  $("#checkoutBtnDetail")?.addEventListener("click", () => {
    addToCart(p, Math.max(1, cantidad));
    openCheckout();
  });

  // Especificaciones
  $("#specs") &&
    ($("#specs").innerHTML = `
    <h2 class="text-2xl font-bold mb-6">Acerca del producto</h2>
    <p class="text-gray-600">${p.description || ""}</p>`);

  // Relacionados (dentro del detalle)
  const related = $("#related");
  const relatedList = products
    .filter((x) => x.category_id === p.category_id && x.id !== p.id)
    .slice(0, 4);
  if (related) {
    related.innerHTML = relatedList.length
      ? `
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-2xl font-bold">Podrían interesarte</h2>
        <a href="#" id="backToProducts" class="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium px-4 py-2 rounded-lg">← Volver al catálogo</a>
      </div>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        ${relatedList
          .map(
            (r) => `
          <div class="border border-gray-200 rounded-xl p-4 hover:shadow-lg transition cursor-pointer group" data-id="${
            r.id
          }">
            <div class="aspect-square bg-gray-100 rounded-lg mb-3 overflow-hidden">
              <img src="${
                r.image
              }" class="w-full h-full object-contain group-hover:scale-105 transition-transform" alt="${
              r.name
            }"/>
            </div>
            <h3 class="font-medium text-sm mb-2 text-gray-900">${r.name}</h3>
            <div class="font-bold text-lg text-blue-600">${fmtMoney(
              r.price
            )}</div>
          </div>`
          )
          .join("")}
      </div>`
      : `<p class="text-gray-500">No hay productos relacionados.</p>`;
    related.querySelectorAll("[data-id]")?.forEach((card) => {
      card.onclick = () => {
        const id = Number(card.dataset.id);
        const prod = products.find((x) => x.id === id);
        if (prod) showProductDetail(prod);
        window.scrollTo({ top: 0, behavior: "smooth" });
      };
    });
  }

  // Recomendaciones (bloque inferior)
  renderRecommendations(p);
  window.scrollTo({ top: 0, behavior: "smooth" });
}
function renderRecommendations(p) {
  const wrap = $("#recommendationGrid");
  if (!wrap) return;
  const recs = products
    .filter(
      (x) =>
        x.id !== p.id &&
        (x.category_id === p.category_id || x.category === p.category)
    )
    .slice(0, 8);
  if (!recs.length) {
    wrap.innerHTML = `<div class="text-gray-500">Aún no hay recomendaciones.</div>`;
    return;
  }
  wrap.innerHTML = recs.map(productCardHTML).join("");
}

/* =========================================================
   CHECKOUT (pasos / validaciones / render de método pago)
========================================================= */
function openCheckout() {
  if (!cart.length) {
    showNotification("Carrito vacío");
    return;
  }
  checkoutStep = 1;
  selectedPaymentMethod = null;

  // cerrar carrito si está abierto y abrir checkout
  closeModal(els.cartModal);
  openModal(els.checkoutModal);

  updateStepUI();
  renderCheckoutSummary();
}
function renderCheckoutSummary() {
  const w = $("#checkoutSummary");
  if (!w) return;
  const total = cart.reduce(
    (s, i) => s + Number(i.price || 0) * Number(i.qty || 1),
    0
  );
  w.innerHTML =
    cart
      .map(
        (i) => `
      <div class="co-item">
        <div>${i.name} x${i.qty}</div>
        <div>${fmtMoney(Number(i.price || 0) * Number(i.qty || 1))}</div>
      </div>`
      )
      .join("") +
    `<div class="co-total"><span>Total</span><strong>${fmtMoney(
      total
    )}</strong></div>`;
}
function readSelectedMethod() {
  const f = $("#paymentMethodForm");
  if (!f) return null;
  const fd = new FormData(f);
  return fd.get("paymentMethod");
}
function renderPaymentMethodView() {
  const v = $("#paymentMethodView");
  if (!v) return;
  const total = cart.reduce(
    (s, i) => s + Number(i.price || 0) * Number(i.qty || 1),
    0
  );
  const totalText = fmtMoney(total);
  const setStepTitle = (t) => {
    const el = $("#step6Title");
    if (el) el.textContent = t;
  };

  if (selectedPaymentMethod === "card") {
    setStepTitle("Pagar con tarjeta");
    v.innerHTML = `
      <form id="cardForm" class="form-grid" onsubmit="event.preventDefault();">
        <div class="form-field"><label>Nombre del titular</label><input type="text" required /></div>
        <div class="form-field"><label>Número de tarjeta</label><input type="text" inputmode="numeric" maxlength="19" placeholder="0000 0000 0000 0000" required /></div>
        <div class="form-row">
          <div class="form-field"><label>Vencimiento</label><input type="text" inputmode="numeric" maxlength="5" placeholder="MM/AA" required /></div>
          <div class="form-field"><label>CVV</label><input type="password" inputmode="numeric" maxlength="4" placeholder="***" required /></div>
        </div>
        <button class="btn-primary full" id="payCardBtn">Pagar ${totalText}</button>
      </form>`;
    $("#payCardBtn").onclick = () => confirmPayment("Tarjeta", total);
  } else if (selectedPaymentMethod === "wallet") {
    setStepTitle("Pagar con billetera (Yape / Plin)");
    v.innerHTML = `
      <div class="wallet-chooser">
        <label><input type="radio" name="walletType" value="yape" checked/> Yape</label>
        <label><input type="radio" name="walletType" value="plin"/> Plin</label>
      </div>
      <div class="wallet-box">
        <div class="wallet-info">
          <div>Monto: <strong>${totalText}</strong></div>
          <div id="walletNumber"></div>
          <div class="hint">* Escanea el QR o envía al número y luego confirma.</div>
        </div>
        <div class="wallet-qr" id="walletQr"></div>
      </div>
      <button class="btn-primary full" id="walletConfirm">Ya realicé el pago</button>`;
    const renderWallet = () => {
      const type =
        (document.querySelector('input[name="walletType"]:checked') || {})
          .value || "yape";
      const phone = type === "yape" ? YAPE_PHONE : PLIN_PHONE;
      const qr = type === "yape" ? YAPE_QR : PLIN_QR;
      $(
        "#walletNumber"
      ).innerHTML = `Número ${type.toUpperCase()}: <strong>${phone}</strong>`;
      $(
        "#walletQr"
      ).innerHTML = `<img src="${qr}" alt="QR ${type}" class="wallet-qr-img"/>`;
    };
    renderWallet();
    $$('input[name="walletType"]').forEach((r) =>
      r.addEventListener("change", renderWallet)
    );
    $("#walletConfirm").onclick = () =>
      confirmPayment("Billetera (Yape/Plin)", total);
  } else if (selectedPaymentMethod === "transfer") {
    setStepTitle("Pagar por transferencia bancaria");
    v.innerHTML =
      BANK_ACCOUNTS.map(
        (b) => `
      <div class="bank-card">
        <div class="bank-title">${b.bank}</div>
        <div>Titular: <strong>${b.holder}</strong></div>
        <div>Cuenta: <strong>${b.account}</strong></div>
        <div>CCI: <strong>${b.cci}</strong></div>
      </div>`
      ).join("") +
      `<button id="transferBtn" class="btn-primary w-full mt-4">He transferido</button>`;
    $("#transferBtn").onclick = () => confirmPayment("Transferencia", total);
  } else if (selectedPaymentMethod === "whatsapp") {
    setStepTitle("Coordinar por WhatsApp (efectivo)");
    const msg = `Hola, quiero coordinar pago en efectivo. Total: ${totalText}. Pedido: ${cart
      .map((i) => `${i.name} x${i.qty}`)
      .join(", ")}`;
    v.innerHTML = `
      <div class="wa-wrap">
        <a class="btn-primary full" target="_blank" rel="noopener" href="https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
      msg
    )}">Abrir WhatsApp</a>
        <button class="btn-secondary full" id="waConfirm">Ya coordiné por WhatsApp</button>
      </div>`;
    $("#waConfirm").onclick = () =>
      confirmPayment("WhatsApp (efectivo)", total);
  } else {
    setStepTitle("Detalles del pago");
    v.innerHTML = `<p class="hint">Selecciona un método de pago en el paso anterior.</p>`;
  }
}
function confirmPayment(method, total) {
  const box = $("#receiptBox");
  if (box) {
    box.innerHTML = `<div>Método: ${method}</div><div>Total: ${fmtMoney(
      total
    )}</div>`;
  }
  cart = [];
  saveLocal();
  updateCounts();
  renderCart();

  // Avanza al panel de confirmación
  checkoutStep = 7;
  updateStepUI();
}

/* ---- Validaciones y navegación de pasos ---- */
function getDeliveryMethod() {
  const r = document.querySelector('input[name="deliveryMethod"]:checked');
  return r ? r.value : null;
}
function validateStep2() {
  const req = [
    "#customerName",
    "#customerLastName",
    "#customerEmail",
    "#customerPhone",
    "#customerDNI",
  ];
  for (const sel of req) {
    const el = $(sel);
    if (!el || !el.value?.trim()) {
      showNotification("Completa tus datos obligatorios");
      el?.focus();
      return false;
    }
  }
  const dni = $("#customerDNI")?.value || "";
  if (!/^\d{8}$/.test(dni)) {
    showNotification("DNI inválido (8 dígitos)");
    $("#customerDNI")?.focus();
    return false;
  }
  return true;
}
function validateStep3() {
  const m = getDeliveryMethod();
  if (!m) {
    showNotification("Elige un método de entrega");
    return false;
  }
  return true;
}
function validateStep4() {
  if (getDeliveryMethod() !== "delivery") return true;
  const req = ["#department", "#province", "#district", "#addressStreet"];
  for (const sel of req) {
    const el = $(sel);
    if (!el || !el.value?.trim()) {
      showNotification("Completa la dirección de envío");
      el?.focus();
      return false;
    }
  }
  return true;
}

function updateStepUI() {
  checkoutStep = Math.max(1, Math.min(7, checkoutStep));
  const panels = {
    1: $("#step1"),
    2: $("#step2"),
    3: $("#step3"),
    4: $("#step4"),
    5: $("#step5"),
    6: $("#step6"),
    7: $("#step7"),
  };
  Object.values(panels).forEach((p) => p && p.classList.add("hidden"));
  panels[checkoutStep]?.classList.remove("hidden");

  $$(".step-indicator").forEach((ind) => {
    const s = Number(ind.getAttribute("data-step"));
    ind.classList.toggle("active", s === checkoutStep);
    ind.classList.toggle("done", s < checkoutStep);
  });

  const nextBtn = $("#nextStepBtn");
  if (nextBtn) {
    nextBtn.textContent =
      checkoutStep <= 5
        ? "Siguiente"
        : checkoutStep === 6
        ? "Finalizar"
        : "Cerrar";
  }

  // Toggle contenedores de dirección/tienda al entrar a Step 4
  if (checkoutStep === 4) {
    const method = getDeliveryMethod();
    $("#addressFormContainer")?.classList.toggle(
      "hidden",
      method !== "delivery"
    );
    $("#storeInfoContainer")?.classList.toggle("hidden", method !== "pickup");
  }
}

function nextStep() {
  switch (checkoutStep) {
    case 1:
      checkoutStep = 2;
      break;
    case 2:
      if (!validateStep2()) return;
      checkoutStep = 3;
      break;
    case 3:
      if (!validateStep3()) return;
      checkoutStep = 4;
      break;
    case 4:
      if (!validateStep4()) return;
      checkoutStep = 5;
      break;
    case 5: {
      const m = readSelectedMethod();
      if (!m) {
        showNotification("Selecciona un método de pago");
        return;
      }
      selectedPaymentMethod = m;
      renderPaymentMethodView();
      checkoutStep = 6;
      break;
    }
    case 6:
      /* Finalizar: confirmPayment avanza a 7; si no, mantenemos 6 */ break;
    case 7:
      closeModal(els.checkoutModal);
      return;
  }
  updateStepUI();
}
function prevStep() {
  if (checkoutStep <= 1) {
    closeModal(els.checkoutModal);
    return;
  }
  checkoutStep--;
  updateStepUI();
}

/* =========================================================
   Delegación global (cards/hero) + navegación básica
========================================================= */
document.body.addEventListener("click", (e) => {
  const target = e.target;
  const btn = target.closest("[data-action]");
  if (!btn) return;

  const action = btn.getAttribute("data-action");
  const hostWithId = btn.closest("[data-id]");
  const id = Number(btn.dataset.id || hostWithId?.dataset.id || 0);

  // Encontrar producto
  let p = null;
  if (id) p = products.find((x) => Number(x.id) === id);

  if (action === "add-cart" || action === "buy-now") {
    if (!p) return;
    addToCart(p, 1);
    if (action === "buy-now") {
      renderCart();
      openCheckout();
    } else {
      showNotification("Agregado al carrito");
    }
  }

  if (action === "add-wish") {
    if (!p) return;
    addToWishlist(p);
    showNotification("Agregado a deseos");
  }

  if (action === "open-detail") {
    if (!p && hostWithId) {
      const pid = Number(hostWithId.dataset.id);
      p = products.find((x) => x.id === pid);
    }
    if (!p) return;
    showProductDetail(p);
  }
});

// Volver del detalle
document.addEventListener("click", (e) => {
  if (e.target?.id === "backToProducts") {
    e.preventDefault();
    $("#productDetailSection")?.classList.add("hidden");
    $("#productGrid")?.classList.remove("hidden");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
});

// Checkout botones
els.checkoutBtnCart?.addEventListener("click", openCheckout);
els.nextStepBtn?.addEventListener("click", nextStep);
els.prevStepBtn?.addEventListener("click", prevStep);
els.checkoutClose?.addEventListener("click", () =>
  closeModal(els.checkoutModal)
);
els.checkoutModal?.addEventListener("click", (e) => {
  if (e.target === els.checkoutModal) closeModal(els.checkoutModal);
});

// ESC para cerrar modales
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    closeModal(els.cartModal);
    closeModal(els.wishModal);
    closeModal(els.checkoutModal);
  }
});

/* =========================================================
   Inicialización
========================================================= */
async function init() {
  loadLocal();

  categories = await fetchCategories();
  renderCategoryUI();

  setStickyTop();
  bindCategoryScroller();
  bindHamburger();
  bindSearchAndPrice();
  window.addEventListener("resize", setStickyTop, { passive: true });

  // Carga inicial de productos
  products = await fetchProductos(null);
  buildHeroSlides(products.slice(0, 6));
  renderProductGrid(products);
}

document.addEventListener("DOMContentLoaded", init);
