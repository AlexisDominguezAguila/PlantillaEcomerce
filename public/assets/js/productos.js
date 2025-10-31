(() => {
  /* -------------------------------------------
     1) Variables y estado global
  -------------------------------------------- */
  const API = {
    base: "../controllers/ProductosController.php",
    routes: {
      destacados: "destacados",
      flash: "flash",
      masVendidos: "masvendidos",
      catalogo: "catalogo",
      detalle: "detalle",
      recomendados: "recomendados",
      categorias: "categorias",
      rango: "rango",
    },

    fetch: async (action, params = {}) => {
      const url = new URL(API.base, window.location.href);
      url.searchParams.set("action", action);
      Object.entries(params).forEach(([k, v]) => {
        if (v !== undefined && v !== null && v !== "")
          url.searchParams.set(k, v);
      });

      try {
        const res = await fetch(url.toString(), {
          headers: { Accept: "application/json" },
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        return data;
      } catch (error) {
        console.error(`API Error (${action}):`, error);
        throw error;
      }
    },
  };

  const currency = { code: "PEN", symbol: "S/ " };
  const LS_KEYS = { cart: "tr_cart", wishlist: "tr_wishlist" };

  const state = {
    cart: [],
    wishlist: [],
    currentProduct: null,
    checkoutStep: 1,
  };

  // Estado de filtros y datos
  const filters = {
    q: "",
    category_id: null,
    price_min: null,
    price_max: null,
    sort: "recent",
    page: 1,
    page_size: 16,
  };

  const store = {
    featured: [],
    flash: null,
    best: [],
    categories: [],
    priceRange: { min_price: 0, max_price: 0 },
    catalog: { items: [], total: 0, page: 1, pages: 1, page_size: 16 },
  };

  /* DOM refs */
  const els = {
    // Hero slider
    heroSlider: document.querySelector(".hero-slider"),
    heroTrack: document.getElementById("sliderTrack"),
    heroPrev: document.getElementById("prevBtn"),
    heroNext: document.getElementById("nextBtn"),
    heroDots: document.getElementById("sliderDots"),

    // Grids
    flashGrid: document.getElementById("flashSaleGrid"),
    bestGrid: document.getElementById("bestSellersGrid"),
    prodGrid: document.getElementById("productGrid"),
    recGrid: document.getElementById("recommendationGrid"),

    // Modales
    cartModal: document.getElementById("cartModal"),
    wishModal: document.getElementById("wishlistModal"),
    checkoutModal: document.getElementById("checkoutModal"),

    // Botones FAB
    fabCart: document.getElementById("fabCart"),
    fabWishlist: document.getElementById("fabWishlist"),

    // Cierre modales
    cartClose: document.getElementById("cartModalClose"),
    wishClose: document.getElementById("wishlistModalClose"),
    checkoutClose: document.getElementById("checkoutClose"),

    // Contenedores de lista
    cartItems: document.getElementById("cartItems"),
    wishItems: document.getElementById("wishlistItems"),
    cartTotal: document.getElementById("cartTotal"),

    // Badges
    cartBadge: document.getElementById("cartCountFab"),
    wishBadge: document.getElementById("wishCountFab"),

    // Checkout
    checkoutBtnCart: document.getElementById("checkoutBtnCart"),
    nextStepBtn: document.getElementById("nextStepBtn"),
    prevStepBtn: document.getElementById("prevStepBtn"),
    stepsContainer: document.querySelector(".steps"),
    stepsBody: document.querySelector(".steps-body"),

    // Toolbar + filtros
    header: document.getElementById("catalogoHeader"),
    toolbarMore: document.getElementById("toolbarMore"),
    clearFilters: document.getElementById("clearFilters"),
    prodSearch: document.getElementById("prodSearch"),
    priceMin: document.getElementById("priceMin"),
    priceMax: document.getElementById("priceMax"),
    categorySelect: document.getElementById("categorySelect"),
    sortSelect: document.getElementById("sortSelect"),

    // Detalle
    detailSection: document.getElementById("productDetailSection"),
    backToProducts: document.getElementById("backToProducts"),
    mainImg: document.getElementById("main-img"),
    thumbs: document.getElementById("thumbs"),
    prevImg: document.getElementById("prev-img"),
    nextImg: document.getElementById("next-img"),
    favBtn: document.getElementById("fav-btn"),

    // Slide de mas vendidos
    bestPrev: document.getElementById("prevBtn-seller"),
    bestNext: document.getElementById("nextBtn-seller"),

    // Otros
    flashContainer: document.getElementById("flashSaleContainer"),
    bestContainer: document.getElementById("bestSellersContainer"),
    pagination: document.getElementById("catalogPagination"),
  };

  /* -------------------------------------------
     2) Utils
  -------------------------------------------- */
  const fmtMoney = (n) => {
    const num = Number(n || 0);
    return `${currency.symbol}${num.toLocaleString("es-PE", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  const parseMoney = (txt) => {
    if (txt === null || txt === undefined) return 0;
    let s = String(txt)
      .replace(/[^\d.,-]/g, "")
      .trim();

    // Caso con ambos separadores (ej: "1,234.56" o "1.234,56")
    if (s.includes(",") && s.includes(".")) {
      const lastComma = s.lastIndexOf(",");
      const lastDot = s.lastIndexOf(".");
      if (lastDot > lastComma) {
        // Formato estilo es-PE habitual: miles "," y decimales "."
        // "1,234.56" -> remove "," -> "1234.56"
        s = s.replace(/,/g, "");
        return Number(s) || 0;
      } else {
        // Formato EU/LA: miles "." y decimales ","
        // "1.234,56" -> remove "." -> "1234,56" -> ","->"."
        s = s.replace(/\./g, "").replace(",", ".");
        return Number(s) || 0;
      }
    }

    // Solo comas -> asúmelas como decimales
    if (s.includes(",")) {
      s = s.replace(/\./g, ""); // por si hay puntos residuales
      s = s.replace(",", ".");
      return Number(s) || 0;
    }

    // Solo puntos o solo dígitos
    return Number(s) || 0;
  };

  const debounce = (fn, ms = 300) => {
    let t;
    return (...args) => {
      clearTimeout(t);
      t = setTimeout(() => fn(...args), ms);
    };
  };

  const safeImg = (url) =>
    url || "https://via.placeholder.com/900x600?text=Producto";

  const safe = (v, fb = "") => (v === null || v === undefined ? fb : v);

  const toast = (() => {
    const style = document.createElement("style");
    style.textContent = `
      .tr-toast-wrap{position:fixed;right:16px;bottom:16px;z-index:9999;display:flex;flex-direction:column;gap:8px}
      .tr-toast{min-width:220px;max-width:340px;padding:10px 12px;border-radius:12px;
        color:#fff;box-shadow:0 14px 35px rgba(0,0,0,.25);display:flex;gap:10px;align-items:flex-start;
        animation:trToastIn .2s ease both}
      .tr-toast.success{background:linear-gradient(135deg,#126fa8,#2da4ff)}
      .tr-toast.error{background:linear-gradient(135deg,#d32f2f,#f44336)}
      .tr-toast.info{background:linear-gradient(135deg,#5f6a8a,#8a94b5)}
      .tr-toast .t-msg{flex:1;font-weight:700}
      .tr-toast .t-close{border:0;background:transparent;color:#fff;cursor:pointer;font-size:18px;line-height:1}
      @keyframes trToastIn{from{transform:translateY(8px);opacity:0}to{transform:translateY(0);opacity:1}}
    `;
    document.head.appendChild(style);
    const wrap = document.createElement("div");
    wrap.className = "tr-toast-wrap";
    document.body.appendChild(wrap);
    return (msg, type = "success", timeout = 2400) => {
      const t = document.createElement("div");
      t.className = `tr-toast ${type}`;
      t.innerHTML = `<div class="t-msg">${msg}</div><button class="t-close" aria-label="Cerrar">×</button>`;
      wrap.appendChild(t);
      const close = () => t.remove();
      t.querySelector(".t-close")?.addEventListener("click", close);
      setTimeout(close, timeout);
    };
  })();

  // Local Storage
  const saveLocal = () => {
    localStorage.setItem(LS_KEYS.cart, JSON.stringify(state.cart));
    localStorage.setItem(LS_KEYS.wishlist, JSON.stringify(state.wishlist));
  };

  const loadLocal = () => {
    try {
      state.cart = JSON.parse(localStorage.getItem(LS_KEYS.cart) || "[]");
      state.wishlist = JSON.parse(
        localStorage.getItem(LS_KEYS.wishlist) || "[]"
      );
    } catch (_) {
      state.cart = [];
      state.wishlist = [];
    }
  };

  const updateBadges = () => {
    if (els.cartBadge) {
      els.cartBadge.textContent = String(
        state.cart.reduce((a, it) => a + it.qty, 0)
      );
    }
    if (els.wishBadge) {
      els.wishBadge.textContent = String(state.wishlist.length);
    }
  };

  const findCartIndex = (id) =>
    state.cart.findIndex((it) => String(it.id) === String(id));

  const isInWishlist = (id) =>
    state.wishlist.some((it) => String(it.id) === String(id));

  const calcTotal = () =>
    state.cart.reduce((a, it) => a + it.price * it.qty, 0);

  const extractProductFromCard = (card) => {
    if (!card) return null;
    const id = card.dataset.id || "p-" + Math.random().toString(36).slice(2, 7);
    const name =
      card.querySelector(".nombre-prod")?.textContent?.trim() || "Producto";
    const cat = card.querySelector(".pill-prod")?.textContent?.trim() || "";
    const img = card.querySelector(".product-image")?.getAttribute("src") || "";

    // preferir dataset para evitar parsear el DOM
    const dsPrice = card.dataset.price;
    const priceTxt = card.querySelector(".precio-actual")?.textContent || "";
    const price =
      dsPrice !== undefined && dsPrice !== null && dsPrice !== ""
        ? Number(dsPrice)
        : parseMoney(priceTxt);

    const oldTxt = card.querySelector(".precio-antiguo")?.textContent || "";
    const old = parseMoney(oldTxt);

    return {
      id,
      name,
      category: cat,
      image: img,
      price,
      old_price: old,
      qty: 1,
    };
  };

  /* -------------------------------------------
     3) Funciones de Carrito y Wishlist
  -------------------------------------------- */
  const addToCart = (prod, qty = 1, notify = true) => {
    if (!prod) return;
    const idx = findCartIndex(prod.id);
    if (idx >= 0) state.cart[idx].qty += qty;
    else state.cart.push({ ...prod, qty });
    saveLocal();
    updateBadges();
    renderCart();
    if (notify) toast("Añadido al carrito", "success");
  };

  const removeFromCart = (id, notify = true) => {
    const idx = findCartIndex(id);
    if (idx >= 0) {
      state.cart.splice(idx, 1);
      saveLocal();
      updateBadges();
      renderCart();
      if (notify) toast("Eliminado del carrito", "info");
    }
  };

  const changeQty = (id, delta) => {
    const idx = findCartIndex(id);
    if (idx >= 0) {
      state.cart[idx].qty = Math.max(1, state.cart[idx].qty + delta);
      saveLocal();
      updateBadges();
      renderCart();
    }
  };

  const toggleWishlist = (prod, notify = true) => {
    if (!prod) return;
    const idx = state.wishlist.findIndex(
      (it) => String(it.id) === String(prod.id)
    );
    if (idx >= 0) {
      state.wishlist.splice(idx, 1);
      if (notify) toast("Quitado de deseos", "info");
    } else {
      state.wishlist.push({
        id: prod.id,
        name: prod.name,
        image: prod.image,
        price: prod.price,
      });
      if (notify) toast("Añadido a deseos", "success");
    }
    saveLocal();
    updateBadges();
    renderWishlist();
  };

  const renderCart = () => {
    if (!els.cartItems || !els.cartTotal) return;
    els.cartItems.innerHTML = "";
    if (!state.cart.length) {
      els.cartItems.innerHTML = `<div class="list-empty">Tu carrito está vacío.</div>`;
      els.cartTotal.textContent = fmtMoney(0);
      return;
    }

    const frag = document.createDocumentFragment();
    state.cart.forEach((it) => {
      const row = document.createElement("div");
      const priceNum = Number(it.price) || 0;
      row.className = "cart-row";
      row.innerHTML = `
        <img src="${
          it.image || "https://via.placeholder.com/64x64?text=%20"
        }" alt="${it.name}">
        <div>
          <div class="cart-title">${it.name}</div>
          <div class="cart-meta">${it.category || ""}</div>
        </div>
        <div class="cart-controls" data-id="${it.id}">
          <button class="qty-btn dec" aria-label="Disminuir">−</button>
          <input class="qty-input" type="text" value="${it.qty}" readonly>
          <button class="qty-btn inc" aria-label="Aumentar">+</button>
          <span style="min-width:90px;text-align:right;font-weight:800;">
            ${fmtMoney(priceNum * it.qty)}
          </span>
          <button class="remove-btn" title="Eliminar" aria-label="Eliminar"><i class="bx bx-trash"></i></button>
        </div>
      `;
      frag.appendChild(row);
    });
    els.cartItems.appendChild(frag);
    els.cartTotal.textContent = fmtMoney(calcTotal());
  };

  const renderWishlist = () => {
    if (!els.wishItems) return;
    els.wishItems.innerHTML = "";
    if (!state.wishlist.length) {
      els.wishItems.innerHTML = `<div class="list-empty">Tu lista de deseos está vacía.</div>`;
      return;
    }
    const frag = document.createDocumentFragment();
    state.wishlist.forEach((it) => {
      const row = document.createElement("div");
      const priceNum = Number(it.price) || 0;
      row.className = "wish-row";
      row.innerHTML = `
      <img src="${
        it.image || "https://via.placeholder.com/64x64?text=%20"
      }" alt="${it.name}">
      <div>
        <div class="wish-title">${it.name}</div>
        <div class="wish-meta">${fmtMoney(priceNum)}</div>
      </div>
      <div class="cart-controls" data-id="${it.id}">
        <button class="add-from-wish btn-secondary" title="Agregar al carrito">Agregar al carrito</button>
        <button class="remove-btn" title="Quitar de deseos" aria-label="Quitar"> <i class="bx bx-trash"></i> </button>
      </div>
    `;
      frag.appendChild(row);
    });
    els.wishItems.appendChild(frag);
  };

  /* -------------------------------------------
     4) Funciones de Modales y Detalle
  -------------------------------------------- */
  const openModal = (name) => {
    const map = {
      cart: els.cartModal,
      wishlist: els.wishModal,
      checkout: els.checkoutModal,
    };
    const m = map[name];
    if (!m) return;
    m.classList.add("is-open");
    if (name === "cart") renderCart();
    if (name === "wishlist") renderWishlist();
    if (name === "checkout") setupCheckoutStep(1);
  };

  const closeModal = (name) => {
    const map = {
      cart: els.cartModal,
      wishlist: els.wishModal,
      checkout: els.checkoutModal,
    };
    const m = map[name];
    if (!m) return;
    m.classList.remove("is-open");
  };

  const showDetail = (prod) => {
    state.currentProduct = prod;
    els.detailSection?.classList.remove("hidden");
    els.flashContainer?.classList.add("hidden");
    els.bestContainer?.classList.add("hidden");
    els.prodGrid?.classList.add("hidden");
    els.pagination?.classList.add("hidden");
    const bc = document.getElementById("breadcrumb-name");
    if (bc) bc.textContent = prod?.name || "";
  };

  const backToCatalog = (e) => {
    if (e) e.preventDefault();
    els.detailSection?.classList.add("hidden");
    els.flashContainer?.classList.remove("hidden");
    els.bestContainer?.classList.remove("hidden");
    els.prodGrid?.classList.remove("hidden");
    els.pagination?.classList.remove("hidden");
    state.currentProduct = null;
  };

  const setupCheckoutStep = (step) => {
    state.checkoutStep = step;
    const panels = els.stepsBody?.querySelectorAll(".step-panel") || [];
    panels.forEach((p, i) => p.classList.toggle("hidden", i !== step - 1));
    const indicators =
      els.stepsContainer?.querySelectorAll(".step-indicator") || [];
    indicators.forEach((s, i) => s.classList.toggle("active", i === step - 1));
  };

  /* -------------------------------------------
     5) Templates
  -------------------------------------------- */
  const tplSlide = (p) => {
    const old = p.old_price || null;
    const off =
      old && old > p.price ? Math.round(((old - p.price) / old) * 100) : 0;
    const firstImage = p.images && p.images.length ? p.images[0] : "";

    return `
      <article class="slide" data-id="${p.id}">
        <div class="slide-inner">
          <figure class="slide-media">
            <img src="../uploads/productos/${safeImg(firstImage)}" alt="${
      p.name
    }" class="slide-image"/>
          </figure>
          <div class="slide-info">
            <div class="slide-pills">
              ${
                p.is_featured
                  ? `<span class="pill pill-featured">Destacado</span>`
                  : ""
              }
              ${
                p.category_name
                  ? `<span class="pill pill-category">${p.category_name}</span>`
                  : ""
              }
            </div>
            <h2 class="slide-title">${p.name}</h2>
            <div class="slide-prices">
              ${old ? `<span class="old">${fmtMoney(old)}</span>` : ""}
              <span class="new">${fmtMoney(p.price)}</span>
              ${off ? `<span class="off">-${off}%</span>` : ""}
            </div>
            <div class="slide-cta">
              <button class="btn-primary buy-now">Comprar ahora</button>
              <button class="btn-secondary view-details">Ver detalles</button>
            </div>
          </div>
        </div>
      </article>`;
  };

  // Card compacta para Ofertas y Más Vendidos (con wishlist y hover real)
  const tplCardSimple = (p) => {
    const imgs = Array.isArray(p.images) ? p.images : [];
    const mainImg = imgs[0] || "";
    const hoverImg = imgs[0] || "";
    const hasHover = Boolean(imgs[1]);
    const old = p.old_price || null;

    return `
  <article class="card-prod card-prod--simple" role="listitem"
           data-id="${p.id}"
           data-category="${p.category_id || ""}"
           data-price="${Number(p.price)}"
           data-old-price="${p.old_price ?? ""}">
      <div class="header-prod">
        <img src="../uploads/productos/${safeImg(mainImg)}" alt="${
      p.name
    }" class="product-image"/>
        ${
          hasHover
            ? `
        <div class="hover-image">
          <img src="../uploads/productos/${safeImg(hoverImg)}" alt="${
                p.name
              } (vista alternativa)" class="product-image-hover"/>
        </div>`
            : ""
        }
        <div class="wishlist-icon ${isInWishlist(p.id) ? "active" : ""}">
          <i class="bx bx-heart"></i>
        </div>
      </div>
      <div class="body-prod">
        <div class="categoria-prod">
          ${
            p.category_name
              ? `<span class="pill-prod">${p.category_name}</span>`
              : ""
          }
        </div>
        <h3 class="nombre-prod">${p.name}</h3>
        <div class="precios-prod">
          ${old ? `<span class="precio-antiguo">${fmtMoney(old)}</span>` : ""}
          <span class="precio-actual">${fmtMoney(p.price)}</span>
        </div>
        <div class="botones-prod">
          <button class="buy-now">Comprar ahora</button>
        </div>
      </div>
    </article>
  `;
  };

  const tplCard = (p) => {
    const old = p.old_price || null;
    const off =
      old && old > p.price ? Math.round(((old - p.price) / old) * 100) : 0;
    const firstImage = p.images && p.images.length ? p.images[0] : "";

    return `
    <article class="card-prod" role="listitem"
           data-id="${p.id}"
           data-category="${p.category_id}"
           data-price="${Number(p.price)}"
           data-old-price="${p.old_price ?? ""}">
        <div class="header-prod">
          <img src="../uploads/productos/${safeImg(firstImage)}" alt="${
      p.name
    }" class="product-image"/>
          <div class="hover-image">
            <img src="../uploads/productos/${safeImg(firstImage)}" alt="${
      p.name
    }" class="product-image-hover"/>
          </div>
          <div class="wishlist-icon ${isInWishlist(p.id) ? "active" : ""}">
            <i class="bx bx-heart"></i>
          </div>
          <div class="etiquetas-prod">
            ${p.is_hot ? `<span class="etiqueta-hot">Hot</span>` : ""}
            ${p.is_new ? `<span class="etiqueta-nueva">Nuevo</span>` : ""}
            ${p.is_offer ? `<span class="etiqueta-oferta">Oferta</span>` : ""}
          </div>
        </div>
        <div class="body-prod">
          <div class="categoria-prod">
            ${
              p.category_name
                ? `<span class="pill-prod">${p.category_name}</span>`
                : ""
            }
          </div>
          <h3 class="nombre-prod">${p.name}</h3>
          <div class="precios-prod">
            ${old ? `<span class="precio-antiguo">${fmtMoney(old)}</span>` : ""}
            <span class="precio-actual">${fmtMoney(p.price)}</span>
            ${
              off > 0
                ? `<span class="porcentaje-descuento">-${off}%</span>`
                : ""
            }
          </div>
          <div class="botones-prod">
            <button class="buy-now">Comprar ahora</button>
            <div class="botones-secundarios">
              <button class="add-to-cart"><i class="bx bx-cart"></i> Agregar</button>
              <button class="view-details"><i class="bx bx-info-circle"></i> Detalles</button>
            </div>
          </div>
        </div>
      </article>`;
  };

  /* -------------------------------------------
     6) Render Functions
  -------------------------------------------- */
  function renderHeroSlides(products) {
    if (!els.heroTrack || !products.length) return;
    els.heroTrack.innerHTML = products.map(tplSlide).join("");
    HeroSlider.rebuild();
  }

  function renderFlashDeal(dealData) {
    if (!els.flashGrid) return;
    if (!dealData || !dealData.items || !dealData.items.length) {
      els.flashContainer.style.display = "none";
      return;
    }
    els.flashGrid.innerHTML = dealData.items.map(tplCardSimple).join("");
    startFlashCountdown(dealData.seconds_left);
  }

  function renderBestSellers(products) {
    if (!els.bestGrid) return;
    if (!products.length) {
      els.bestContainer.style.display = "none";
      return;
    }
    els.bestGrid.innerHTML = products.map(tplCardSimple).join("");
    BestSellersSlider.rebuild();
  }

  function renderCatalog(products, meta = {}) {
    if (!els.prodGrid) return;
    if (!products.length) {
      els.prodGrid.innerHTML =
        '<div class="list-empty">No se encontraron productos</div>';
      return;
    }
    els.prodGrid.innerHTML = products.map(tplCard).join("");
    renderPagination(meta);
  }

  function renderPagination(meta) {
    if (!els.pagination) return;
    const { page = 1, limit = 16, total = 0 } = meta;
    const totalPages = Math.ceil(total / limit);

    if (totalPages <= 1) {
      els.pagination.style.display = "none";
      return;
    }

    els.pagination.style.display = "flex";
    let paginationHTML = `
      <button class="page-prev" ${page <= 1 ? "disabled" : ""}>Anterior</button>
      <ul class="page-list">
    `;

    let startPage = Math.max(1, page - 2);
    let endPage = Math.min(totalPages, startPage + 4);
    if (endPage - startPage < 4) {
      startPage = Math.max(1, endPage - 4);
    }

    for (let i = startPage; i <= endPage; i++) {
      paginationHTML += `
        <li><button class="page-btn ${
          i === page ? "is-active" : ""
        }" data-page="${i}">${i}</button></li>
      `;
    }

    paginationHTML += `
      </ul>
      <button class="page-next" ${
        page >= totalPages ? "disabled" : ""
      }>Siguiente</button>
    `;

    els.pagination.innerHTML = paginationHTML;

    els.pagination.querySelector(".page-prev").addEventListener("click", () => {
      if (page > 1) {
        filters.page = page - 1;
        loadCatalogData();
      }
    });

    els.pagination.querySelector(".page-next").addEventListener("click", () => {
      if (page < totalPages) {
        filters.page = page + 1;
        loadCatalogData();
      }
    });

    els.pagination.querySelectorAll(".page-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const newPage = parseInt(btn.dataset.page);
        if (newPage !== page) {
          filters.page = newPage;
          loadCatalogData();
        }
      });
    });
  }

  function renderCategories(categories) {
    const nav = document.getElementById("categoryList");
    const select = els.categorySelect;

    if (nav) {
      nav.innerHTML = categories
        .map(
          (cat) => `
        <button class="cat-pill" type="button" data-id="${cat.id}">
          ${cat.name} <small>(${cat.total})</small>
        </button>
      `
        )
        .join("");

      nav.addEventListener("click", (e) => {
        const pill = e.target.closest(".cat-pill");
        if (pill) {
          nav
            .querySelectorAll(".cat-pill")
            .forEach((p) => p.classList.remove("is-active"));
          pill.classList.add("is-active");
          filters.category_id = pill.dataset.id;
          filters.page = 1;
          loadCatalogData();
        }
      });
    }

    if (select) {
      select.innerHTML =
        '<option value="">Todas las categorías</option>' +
        categories
          .map(
            (cat) => `
          <option value="${cat.id}">${cat.name} (${cat.total})</option>
        `
          )
          .join("");
    }
  }

  /* -------------------------------------------
     7) API Data Loaders
  -------------------------------------------- */
  async function loadFeaturedProducts() {
    try {
      const res = await API.fetch(API.routes.destacados, { limit: 8 });
      if (res.success) {
        store.featured = res.data || [];
        renderHeroSlides(store.featured);
      }
    } catch (error) {
      console.error("Error loading featured:", error);
      toast("Error cargando productos destacados", "error");
    }
  }

  async function loadFlashDeals() {
    try {
      const res = await API.fetch(API.routes.flash);
      if (res.success) {
        store.flash = res.data;
        renderFlashDeal(store.flash);
      }
    } catch (error) {
      console.error("Error loading flash deals:", error);
      els.flashContainer.style.display = "none";
    }
  }

  async function loadBestSellers() {
    try {
      const res = await API.fetch(API.routes.masVendidos, { limit: 12 });
      if (res.success) {
        store.best = res.data || [];
        renderBestSellers(store.best);
      }
    } catch (error) {
      console.error("Error loading best sellers:", error);
      els.bestContainer.style.display = "none";
    }
  }

  async function loadCategories() {
    try {
      const res = await API.fetch(API.routes.categorias);
      if (res.success) {
        store.categories = res.data || [];
        renderCategories(store.categories);
      }
    } catch (error) {
      console.error("Error loading categories:", error);
    }
  }

  async function loadPriceRange() {
    try {
      const res = await API.fetch(API.routes.rango);
      if (res.success) {
        store.priceRange = res.data;
        if (els.priceMin)
          els.priceMin.placeholder = `Mín: ${fmtMoney(
            store.priceRange.min_price
          )}`;
        if (els.priceMax)
          els.priceMax.placeholder = `Máx: ${fmtMoney(
            store.priceRange.max_price
          )}`;
      }
    } catch (error) {
      console.error("Error loading price range:", error);
    }
  }

  async function loadCatalogData() {
    try {
      const params = {
        category_id: filters.category_id,
        q: filters.q,
        pmin: filters.price_min,
        pmax: filters.price_max,
        limit: filters.page_size,
        offset: (filters.page - 1) * filters.page_size,
      };

      Object.keys(params).forEach((key) => {
        if (
          params[key] === null ||
          params[key] === "" ||
          params[key] === undefined
        ) {
          delete params[key];
        }
      });

      const res = await API.fetch(API.routes.catalogo, params);
      if (res.success) {
        store.catalog.items = res.data || [];
        renderCatalog(store.catalog.items, {
          page: filters.page,
          limit: filters.page_size,
          total: res.data.length,
        });
      }
    } catch (error) {
      console.error("Error loading catalog:", error);
      toast("Error cargando productos", "error");
    }
  }

  /* -------------------------------------------
     8) Sliders
  -------------------------------------------- */
  const HeroSlider = (() => {
    let idx = 0;
    let slides = [];
    let auto = null;

    const opts = {
      autoplay: true,
      delay: 5000,
      pauseOnHover: true,
      loop: true,
    };

    const cache = () => {
      slides = Array.from(els.heroTrack?.querySelectorAll(".slide") || []);
      if (els.heroTrack && !els.heroTrack.style.transition) {
        els.heroTrack.style.transition = "transform 0.5s ease";
      }
    };

    const updateDots = () => {
      if (!els.heroDots) return;
      els.heroDots.innerHTML = "";
      slides.forEach((_, i) => {
        const b = document.createElement("button");
        b.type = "button";
        b.className = "dot" + (i === idx ? " active" : "");
        b.setAttribute("aria-label", `Ir al slide ${i + 1}`);
        b.addEventListener("click", () => goTo(i, true));
        els.heroDots.appendChild(b);
      });
    };

    const apply = () => {
      if (!els.heroTrack || !slides.length) return;
      els.heroTrack.style.transform = `translateX(-${idx * 100}%)`;
      slides.forEach((s, i) =>
        s.setAttribute("aria-hidden", i === idx ? "false" : "true")
      );
      const dots = els.heroDots?.querySelectorAll(".dot") || [];
      dots.forEach((d, i) => d.classList.toggle("active", i === idx));
    };

    const goTo = (i, user = false) => {
      if (!slides.length) return;
      const len = slides.length;
      idx = ((i % len) + len) % len;
      apply();
      if (opts.autoplay && user) restartAuto();
    };

    const next = (user = false) => goTo(idx + 1, user);
    const prev = (user = false) => goTo(idx - 1, user);

    const startAuto = () => {
      if (!opts.autoplay || slides.length <= 1) return;
      stopAuto();
      auto = setInterval(() => next(false), opts.delay);
    };

    const stopAuto = () => {
      if (auto) {
        clearInterval(auto);
        auto = null;
      }
    };

    const restartAuto = () => {
      stopAuto();
      startAuto();
    };

    const bind = () => {
      els.heroPrev?.addEventListener("click", () => prev(true));
      els.heroNext?.addEventListener("click", () => next(true));

      if (els.heroSlider && opts.pauseOnHover) {
        els.heroSlider.addEventListener("mouseenter", stopAuto);
        els.heroSlider.addEventListener("mouseleave", startAuto);
      }

      els.heroSlider?.addEventListener("keydown", (e) => {
        if (e.key === "ArrowLeft") prev(true);
        if (e.key === "ArrowRight") next(true);
      });

      let startX = 0,
        dx = 0,
        active = false;
      const threshold = 40;

      const onDown = (x) => {
        active = true;
        startX = x;
        dx = 0;
        stopAuto();
        els.heroTrack.style.transition = "none";
      };
      const onMove = (x) => {
        if (!active) return;
        dx = x - startX;
        els.heroTrack.style.transform = `translateX(calc(-${
          idx * 100
        }% + ${dx}px))`;
      };
      const onUp = () => {
        if (!active) return;
        els.heroTrack.style.transition = "transform 0.5s ease";
        if (Math.abs(dx) > threshold) dx > 0 ? prev(true) : next(true);
        else apply();
        active = false;
        startAuto();
      };

      els.heroTrack?.addEventListener("pointerdown", (e) => {
        els.heroTrack.setPointerCapture(e.pointerId);
        onDown(e.clientX);
      });
      els.heroTrack?.addEventListener("pointermove", (e) => onMove(e.clientX));
      els.heroTrack?.addEventListener("pointerup", onUp);
      els.heroTrack?.addEventListener("pointercancel", onUp);

      window.addEventListener("resize", apply);
      document.addEventListener("visibilitychange", () =>
        document.hidden ? stopAuto() : startAuto()
      );
    };

    const rebuild = () => {
      cache();
      updateDots();
      apply();
    };

    const init = (options = {}) => {
      Object.assign(opts, options);
      rebuild();
      bind();
      startAuto();
    };

    return {
      init,
      rebuild,
      next: () => next(true),
      prev: () => prev(true),
      goTo: (i) => goTo(i, true),
      stop: stopAuto,
      start: startAuto,
    };
  })();

  const BestSellersSlider = (() => {
    let idx = 0;
    let cards = [];
    let perView = 4;
    let cardWidthPct = 25;
    let startX = 0,
      dx = 0,
      dragging = false;

    const getPerView = () => {
      const w = window.innerWidth;
      if (w < 768) return 1;
      if (w < 1024) return 2;
      if (w < 1280) return 3;
      return 4;
    };

    const cache = () => {
      cards = Array.from(els.bestGrid?.querySelectorAll(".card-prod") || []);
    };

    const setupCSS = () => {
      if (!els.bestGrid) return;
      els.bestGrid.style.display = "flex";
      els.bestGrid.style.gap = "10px";
      els.bestGrid.style.transition = "transform .45s ease";
      els.bestGrid.style.willChange = "transform";

      perView = getPerView();
      cardWidthPct = 100 / perView;

      cards.forEach((c) => {
        c.style.flex = `0 0 ${cardWidthPct}%`;
      });
    };

    const maxIndex = () => Math.max(0, cards.length - perView);

    const apply = () => {
      if (!els.bestGrid) return;
      idx = Math.min(Math.max(idx, 0), maxIndex());
      els.bestGrid.style.transform = `translateX(-${idx * cardWidthPct}%)`;

      cards.forEach((c, i) => {
        const visible = i >= idx && i < idx + perView;
        c.setAttribute("aria-hidden", visible ? "false" : "true");
      });

      els.bestPrev?.classList.toggle("disabled", idx <= 0);
      els.bestNext?.classList.toggle("disabled", idx >= maxIndex());
    };

    const next = () => {
      idx += 1;
      apply();
    };

    const prev = () => {
      idx -= 1;
      apply();
    };

    const bind = () => {
      els.bestPrev?.addEventListener("click", prev);
      els.bestNext?.addEventListener("click", next);

      const track = els.bestGrid;
      if (!track) return;

      const down = (x, id) => {
        dragging = true;
        startX = x;
        dx = 0;
        track.style.transition = "none";
        if (id) track.setPointerCapture(id);
      };

      const move = (x) => {
        if (!dragging) return;
        dx = x - startX;
        track.style.transform = `translateX(calc(-${
          idx * cardWidthPct
        }% + ${dx}px))`;
      };

      const up = () => {
        if (!dragging) return;
        track.style.transition = "transform .45s ease";
        const threshold = 50;
        if (Math.abs(dx) > threshold) dx > 0 ? prev() : next();
        else apply();
        dragging = false;
      };

      track.addEventListener("pointerdown", (e) =>
        down(e.clientX, e.pointerId)
      );
      track.addEventListener("pointermove", (e) => move(e.clientX));
      track.addEventListener("pointerup", up);
      track.addEventListener("pointercancel", up);

      els.bestGrid?.addEventListener("keydown", (e) => {
        if (e.key === "ArrowLeft") prev();
        if (e.key === "ArrowRight") next();
      });

      window.addEventListener("resize", rebuild);
      document.addEventListener(
        "visibilitychange",
        () => !document.hidden && apply()
      );
    };

    const rebuild = () => {
      cache();
      setupCSS();
      apply();
    };

    const init = () => {
      rebuild();
      bind();
    };

    return { init, rebuild, next, prev };
  })();

  /* -------------------------------------------
     9) Event Listeners y Configuración
  -------------------------------------------- */
  function setupEventListeners() {
    // Búsqueda
    if (els.prodSearch) {
      els.prodSearch.addEventListener(
        "input",
        debounce((e) => {
          filters.q = e.target.value.trim();
          filters.page = 1;
          loadCatalogData();
        }, 500)
      );
    }

    // Filtros de precio
    if (els.priceMin) {
      els.priceMin.addEventListener(
        "change",
        debounce((e) => {
          filters.price_min = e.target.value || null;
          filters.page = 1;
          loadCatalogData();
        }, 500)
      );
    }

    if (els.priceMax) {
      els.priceMax.addEventListener(
        "change",
        debounce((e) => {
          filters.price_max = e.target.value || null;
          filters.page = 1;
          loadCatalogData();
        }, 500)
      );
    }

    // Select de categoría
    if (els.categorySelect) {
      els.categorySelect.addEventListener("change", (e) => {
        filters.category_id = e.target.value || null;
        filters.page = 1;
        loadCatalogData();
      });
    }

    // Ordenamiento
    if (els.sortSelect) {
      els.sortSelect.addEventListener("change", (e) => {
        filters.sort = e.target.value;
        filters.page = 1;
        loadCatalogData();
      });
    }

    // Limpiar filtros
    if (els.clearFilters) {
      els.clearFilters.addEventListener("click", () => {
        filters.q = "";
        filters.category_id = null;
        filters.price_min = null;
        filters.price_max = null;
        filters.sort = "recent";
        filters.page = 1;

        if (els.prodSearch) els.prodSearch.value = "";
        if (els.priceMin) els.priceMin.value = "";
        if (els.priceMax) els.priceMax.value = "";
        if (els.categorySelect) els.categorySelect.value = "";
        if (els.sortSelect) els.sortSelect.value = "recent";

        document.querySelectorAll(".cat-pill").forEach((pill) => {
          pill.classList.remove("is-active");
        });

        loadCatalogData();
        toast("Filtros limpiados", "info");
      });
    }

    // Toolbar móvil
    els.toolbarMore?.addEventListener("click", () => {
      const expanded = els.toolbarMore.getAttribute("aria-expanded") === "true";
      els.toolbarMore.setAttribute("aria-expanded", String(!expanded));
      els.header?.classList.toggle("show-extra");
    });
  }

  function setupModalEvents() {
    // Abrir desde FAB
    els.fabCart?.addEventListener("click", () => openModal("cart"));
    els.fabWishlist?.addEventListener("click", () => openModal("wishlist"));

    // Cerrar modales
    els.cartClose?.addEventListener("click", () => closeModal("cart"));
    els.wishClose?.addEventListener("click", () => closeModal("wishlist"));
    els.checkoutClose?.addEventListener("click", () => closeModal("checkout"));

    // Checkout desde carrito
    els.checkoutBtnCart?.addEventListener("click", () => {
      if (!state.cart.length) return toast("Tu carrito está vacío", "error");
      openModal("checkout");
    });

    // Back to products desde detalle
    els.backToProducts?.addEventListener("click", backToCatalog);

    // Navegación checkout
    els.nextStepBtn?.addEventListener("click", () => {
      const totalSteps =
        els.stepsBody?.querySelectorAll(".step-panel").length || 6;
      if (state.checkoutStep < totalSteps) {
        state.checkoutStep += 1;
        setupCheckoutStep(state.checkoutStep);
      }
    });

    els.prevStepBtn?.addEventListener("click", () => {
      if (state.checkoutStep > 1) {
        state.checkoutStep -= 1;
        setupCheckoutStep(state.checkoutStep);
      }
    });

    // Cerrar al hacer click fuera del contenido
    [els.cartModal, els.wishModal, els.checkoutModal].forEach((modal) => {
      if (!modal) return;
      modal.addEventListener("click", (e) => {
        if (e.target === modal) modal.classList.remove("is-open");
      });
    });

    // ESC para cerrar
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        closeModal("cart");
        closeModal("wishlist");
        closeModal("checkout");
      }
    });
  }

  function setupEventDelegation() {
    // Añadir al carrito
    document.addEventListener("click", (e) => {
      const btn = e.target.closest(".add-to-cart");
      if (!btn) return;
      const card = btn.closest(".card-prod");
      const prod = extractProductFromCard(card);
      addToCart(prod, 1, true);
    });

    // Comprar ahora
    document.addEventListener("click", (e) => {
      const btn = e.target.closest(".buy-now");
      if (!btn) return;
      const card = btn.closest(".card-prod");
      const prod = extractProductFromCard(card);
      addToCart(prod, 1, false);
      openModal("checkout");
      toast("Preparando checkout…", "info");
    });

    // Ver detalles
    document.addEventListener("click", (e) => {
      const btn = e.target.closest(".view-details");
      if (!btn) return;
      const card = btn.closest("[data-id]");
      const id = card?.dataset?.id;
      if (!id) return;
      openDetailById(id);
    });

    // Wishlist (icono corazón en card)
    document.addEventListener("click", (e) => {
      const icon = e.target.closest(".wishlist-icon");
      if (!icon) return;
      const card = icon.closest(".card-prod");
      const prod = extractProductFromCard(card);
      toggleWishlist(prod, true);
      icon.classList.toggle("active", isInWishlist(prod.id));
    });

    // Wishlist en detalle
    els.favBtn?.addEventListener("click", () => {
      if (!state.currentProduct) {
        const name =
          document.getElementById("name")?.textContent?.trim() || "Producto";
        const img = els.mainImg?.getAttribute("src") || "";
        state.currentProduct = {
          id: "detail-mock",
          name,
          image: img,
          price: 0,
        };
      }
      toggleWishlist(state.currentProduct, true);
      els.favBtn.classList.toggle(
        "active",
        isInWishlist(state.currentProduct.id)
      );
    });

    // Controles dentro de Carrito/Wishlist
    document.addEventListener("click", (e) => {
      const wrap = e.target.closest(".cart-controls");
      if (wrap && wrap.dataset.id) {
        const id = wrap.dataset.id;
        if (e.target.closest(".inc")) changeQty(id, +1);
        if (e.target.closest(".dec")) changeQty(id, -1);
        if (e.target.closest(".remove-btn")) removeFromCart(id, true);
      }

      if (e.target.closest(".wish-row .remove-btn")) {
        const id = e.target.closest(".cart-controls")?.dataset.id;
        if (!id) return;
        const idx = state.wishlist.findIndex(
          (w) => String(w.id) === String(id)
        );
        if (idx >= 0) {
          state.wishlist.splice(idx, 1);
          saveLocal();
          updateBadges();
          renderWishlist();
          toast("Quitado de deseos", "info");
        }
      }

      if (e.target.closest(".add-from-wish")) {
        const id = e.target.closest(".cart-controls")?.dataset.id;
        const w = state.wishlist.find((x) => String(x.id) === String(id));
        if (w) addToCart({ ...w, qty: 1 }, 1, true);
      }
    });
  }

  /* -------------------------------------------
     10) Galería de Detalle
  -------------------------------------------- */
  let activeThumbIndex = 0;
  const getThumbs = () =>
    Array.from(els.thumbs?.querySelectorAll(".thumb img") || []);
  const setMainByIndex = (i) => {
    const imgs = getThumbs();
    if (!imgs.length) return;
    activeThumbIndex = (i + imgs.length) % imgs.length;
    els.mainImg?.setAttribute(
      "src",
      imgs[activeThumbIndex].getAttribute("src")
    );
    els.thumbs
      ?.querySelectorAll(".thumb")
      .forEach((b, j) =>
        b.classList.toggle("is-active", j === activeThumbIndex)
      );
  };

  function setupGalleryEvents() {
    els.prevImg?.addEventListener("click", () =>
      setMainByIndex(activeThumbIndex - 1)
    );
    els.nextImg?.addEventListener("click", () =>
      setMainByIndex(activeThumbIndex + 1)
    );
    els.thumbs?.addEventListener("click", (e) => {
      const btn = e.target.closest(".thumb");
      if (!btn) return;
      const idx = getThumbs().findIndex(
        (img) => img === btn.querySelector("img")
      );
      setMainByIndex(idx);
    });
  }

  /* -------------------------------------------
     11) Flash Deal Countdown
  -------------------------------------------- */
  function startFlashCountdown(seconds) {
    const timerEl = document.getElementById("flashSaleTimer");
    if (!timerEl) return;

    let timeLeft = seconds || 0;

    const updateTimer = () => {
      if (timeLeft <= 0) {
        timerEl.innerHTML = "<span>Oferta finalizada</span>";
        return;
      }

      const hours = Math.floor(timeLeft / 3600);
      const minutes = Math.floor((timeLeft % 3600) / 60);
      const secs = timeLeft % 60;

      timerEl.innerHTML = `
        <span>Oferta termina en:</span>
        <span id="hours" aria-label="Horas">${String(hours).padStart(
          2,
          "0"
        )}</span>:
        <span id="minutes" aria-label="Minutos">${String(minutes).padStart(
          2,
          "0"
        )}</span>:
        <span id="seconds" aria-label="Segundos">${String(secs).padStart(
          2,
          "0"
        )}</span>
      `;

      timeLeft--;
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }
  /* -------------------------------------------
    11) Funciones de Detalle de Producto
-------------------------------------------- */

  // Función para cargar y mostrar detalles del producto
  async function openDetailById(productId) {
    try {
      // Mostrar loading state
      showLoadingState();

      // Cargar detalles del producto
      const detailRes = await API.fetch(API.routes.detalle, { id: productId });

      if (!detailRes.success || !detailRes.data) {
        showEmptyDetailState("Producto no encontrado");
        return;
      }

      const product = detailRes.data;
      state.currentProduct = product;

      // Renderizar detalles del producto
      renderProductDetail(product);

      // Cargar productos recomendados
      await loadRecommendedProducts(product.category_id, product.id);

      // Mostrar sección de detalle
      showDetailSection();
    } catch (error) {
      console.error("Error loading product detail:", error);
      showEmptyDetailState("Error al cargar el producto");
      toast("Error cargando producto", "error");
    }
  }

  // Estado de loading
  function showLoadingState() {
    els.detailSection?.classList.remove("hidden");
    els.flashContainer?.classList.add("hidden");
    els.bestContainer?.classList.add("hidden");
    els.prodGrid?.classList.add("hidden");
    els.pagination?.classList.add("hidden");

    // Mostrar indicador de carga
    const breadcrumb = document.getElementById("breadcrumb-name");
    const name = document.getElementById("name");
    if (breadcrumb) breadcrumb.textContent = "Cargando...";
    if (name) name.textContent = "Cargando producto...";
  }

  // Estado cuando no hay producto
  function showEmptyDetailState(message) {
    els.detailSection?.classList.remove("hidden");
    els.flashContainer?.classList.add("hidden");
    els.bestContainer?.classList.add("hidden");
    els.prodGrid?.classList.add("hidden");
    els.pagination?.classList.add("hidden");

    const detailGrid = document.querySelector(".detail-grid");
    const specs = document.getElementById("specs");
    const related = document.getElementById("related");

    if (detailGrid)
      detailGrid.innerHTML = `
    <div class="empty-detail-state">
      <i class="bx bx-package" style="font-size: 64px; margin-bottom: 16px; opacity: 0.5;"></i>
      <h2>${message}</h2>
      <p>No se pudieron cargar los detalles del producto.</p>
      <button class="btn-primary" onclick="backToCatalog()">Volver al catálogo</button>
    </div>
  `;

    if (specs) specs.style.display = "none";
    if (related) related.style.display = "none";
  }

  // Renderizar detalles del producto
  function renderProductDetail(product) {
    // Información básica
    document.getElementById("breadcrumb-name").textContent = product.name;
    document.getElementById("name").textContent = product.name;
    document.getElementById("sku").textContent = `SKU: ${product.sku || "N/A"}`;
    document.getElementById("description").textContent =
      product.description || "Sin descripción disponible.";

    // Precios
    renderProductPrices(product);

    // Stock y disponibilidad
    renderStockInfo(product);

    // Galería de imágenes
    renderProductGallery(product);

    // Especificaciones
    renderProductSpecs(product);

    // Wishlist button state
    updateWishlistButtonState(product.id);

    // Event listeners para botones de detalle
    setupDetailButtonEvents(product);
  }

  // Renderizar precios
  function renderProductPrices(product) {
    const pricesContainer = document.getElementById("prices");
    const oldPrice = product.old_price;
    const currentPrice = product.price;
    let discountHtml = "";

    if (oldPrice && oldPrice > currentPrice) {
      const discount = Math.round(((oldPrice - currentPrice) / oldPrice) * 100);
      discountHtml = `<span class="price-off">-${discount}%</span>`;
    }

    pricesContainer.innerHTML = `
    ${
      oldPrice && oldPrice > currentPrice
        ? `<span class="price-old">${fmtMoney(oldPrice)}</span>`
        : ""
    }
    <span class="price-new">${fmtMoney(currentPrice)}</span>
    ${discountHtml}
  `;
  }

  // Renderizar información de stock
  function renderStockInfo(product) {
    const stockElement = document.getElementById("stock");
    const availabilityElement = document.getElementById("availability");

    if (product.stock > 0) {
      const stockLevel =
        product.stock <= (product.min_stock || 5) ? "low" : "high";

      if (stockLevel === "low") {
        stockElement.innerHTML = `<span style="color: #ff6b35;">⚠️ Pocas unidades</span>`;
        availabilityElement.textContent = `Quedan pocas unidades`;
        availabilityElement.style.color = "#ff6b35";
      } else {
        stockElement.innerHTML = `<span style="color: #2ecc71;">✓ Disponible</span>`;
        availabilityElement.textContent = `En stock `;
        availabilityElement.style.color = "#2ecc71";
      }
    } else {
      stockElement.innerHTML = `<span style="color: #e74c3c;">✗ Agotado</span>`;
      availabilityElement.textContent = "Producto no disponible";
      availabilityElement.style.color = "#e74c3c";

      // Deshabilitar botones de compra
      document.querySelector(".btn-add-cart").disabled = true;
      document.querySelector(".btn-buy-now").disabled = true;
    }
  }

  // Renderizar galería de imágenes
  function renderProductGallery(product) {
    const mainImg = document.getElementById("main-img");
    const thumbsContainer = document.getElementById("thumbs");

    if (!product.images || product.images.length === 0) {
      // Sin imágenes
      mainImg.src =
        "https://via.placeholder.com/600x400?text=Imagen+no+disponible";
      mainImg.alt = product.name;
      thumbsContainer.innerHTML =
        '<div class="no-images">No hay imágenes disponibles</div>';
      return;
    }

    // Imagen principal
    const firstImage = product.images[0];
    mainImg.src = `../uploads/productos/${firstImage}`;
    mainImg.alt = product.name;

    // Thumbnails
    thumbsContainer.innerHTML = product.images
      .map(
        (img, index) => `
    <button class="thumb ${
      index === 0 ? "is-active" : ""
    }" data-index="${index}">
      <img src="../uploads/productos/${img}" alt="${product.name} - vista ${
          index + 1
        }" />
    </button>
  `
      )
      .join("");

    // Configurar eventos de galería
    setupGalleryEvents();
  }

  // Renderizar especificaciones
  function renderProductSpecs(product) {
    const specsGrid = document.getElementById("specsGrid");

    if (!product.specs || product.specs.length === 0) {
      specsGrid.innerHTML = `
      <div class="empty-specs">
        <p>No hay especificaciones disponibles para este producto.</p>
      </div>
    `;
      return;
    }

    specsGrid.innerHTML = product.specs
      .map(
        (spec) => `
    <div role="row" class="spec-row">
      <div role="cell" class="spec-name">${
        spec.variable || "Especificación"
      }</div>
      <div role="cell" class="spec-values">
        ${Array.isArray(spec.values) ? spec.values.join(", ") : "No disponible"}
      </div>
    </div>
  `
      )
      .join("");
  }

  // Cargar productos recomendados
  async function loadRecommendedProducts(
    categoryId,
    excludeProductId,
    limit = 8
  ) {
    try {
      let recommendedProducts = [];

      // Primero intentar cargar de la misma categoría
      const sameCategoryRes = await API.fetch(API.routes.recomendados, {
        category_id: categoryId,
        exclude_id: excludeProductId,
        limit: limit,
      });

      if (sameCategoryRes.success && sameCategoryRes.data.length > 0) {
        recommendedProducts = sameCategoryRes.data.slice(0, limit);
      }

      // Si no hay suficientes, cargar productos destacados como fallback
      if (recommendedProducts.length < limit) {
        const needed = limit - recommendedProducts.length;
        const featuredRes = await API.fetch(API.routes.destacados, {
          limit: needed + 5, // Traer unos extras para filtrar
        });

        if (featuredRes.success && featuredRes.data.length > 0) {
          // Filtrar productos que ya están en recomendados y excluir el producto actual
          const additionalProducts = featuredRes.data
            .filter(
              (p) =>
                p.id !== excludeProductId &&
                !recommendedProducts.some((rp) => rp.id === p.id)
            )
            .slice(0, needed);

          recommendedProducts = [...recommendedProducts, ...additionalProducts];
        }
      }

      // Renderizar productos recomendados
      renderRecommendedProducts(recommendedProducts);
    } catch (error) {
      console.error("Error loading recommended products:", error);
      // Mostrar estado vacío para recomendados
      renderRecommendedProducts([]);
    }
  }

  // Renderizar productos recomendados
  function renderRecommendedProducts(products) {
    const recommendationGrid = document.getElementById("recommendationGrid");

    if (!products || products.length === 0) {
      recommendationGrid.innerHTML = `
      <div class="empty-recommendations">
        <p>No hay productos recomendados disponibles en este momento.</p>
      </div>
    `;
      return;
    }

    recommendationGrid.innerHTML = products.map(tplCard).join("");

    // Actualizar estado de wishlist en los productos recomendados
    recommendationGrid.querySelectorAll(".card-prod").forEach((card) => {
      const id = card.dataset.id;
      const heart = card.querySelector(".wishlist-icon");
      if (heart && id) heart.classList.toggle("active", isInWishlist(id));
    });
  }

  // Actualizar estado del botón de wishlist en detalle
  function updateWishlistButtonState(productId) {
    const favBtn = document.getElementById("fav-btn");
    if (favBtn) {
      favBtn.classList.toggle("active", isInWishlist(productId));
    }
  }

  // Configurar eventos de botones en detalle
  function setupDetailButtonEvents(product) {
    const addToCartBtn = document.querySelector(".btn-add-cart");
    const buyNowBtn = document.querySelector(".btn-buy-now");
    const incrementBtn = document.getElementById("increment");
    const decrementBtn = document.getElementById("decrement");
    const quantityInput = document.getElementById("quantity");

    // Añadir al carrito desde detalle
    if (addToCartBtn) {
      addToCartBtn.onclick = () => {
        const quantity = parseInt(quantityInput.value) || 1;
        addToCart(
          {
            id: product.id,
            name: product.name,
            image:
              product.images && product.images.length > 0
                ? product.images[0]
                : "",
            price: product.price,
            category: product.category_name,
          },
          quantity,
          true
        );
      };
    }

    // Comprar ahora desde detalle
    if (buyNowBtn) {
      buyNowBtn.onclick = () => {
        const quantity = parseInt(quantityInput.value) || 1;
        addToCart(
          {
            id: product.id,
            name: product.name,
            image:
              product.images && product.images.length > 0
                ? product.images[0]
                : "",
            price: product.price,
            category: product.category_name,
          },
          quantity,
          false
        );
        openModal("checkout");
      };
    }

    // Control de cantidad
    if (incrementBtn && decrementBtn && quantityInput) {
      incrementBtn.onclick = () => {
        const current = parseInt(quantityInput.value) || 1;
        const maxStock = product.stock || 99;
        quantityInput.value = Math.min(current + 1, maxStock);
      };

      decrementBtn.onclick = () => {
        const current = parseInt(quantityInput.value) || 1;
        quantityInput.value = Math.max(current - 1, 1);
      };
    }
  }

  // Mostrar sección de detalle
  function showDetailSection() {
    els.detailSection?.classList.remove("hidden");
    els.flashContainer?.classList.add("hidden");
    els.bestContainer?.classList.add("hidden");
    els.prodGrid?.classList.add("hidden");
    els.pagination?.classList.add("hidden");

    // Scroll to top
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  /* -------------------------------------------
     12) Inicialización Principal
  -------------------------------------------- */
  async function initializeApp() {
    // Cargar datos iniciales
    loadLocal();
    updateBadges();
    renderCart();
    renderWishlist();

    try {
      await Promise.all([
        loadFeaturedProducts(),
        loadFlashDeals(),
        loadBestSellers(),
        loadCategories(),
        loadPriceRange(),
      ]);

      // Cargar catálogo inicial
      await loadCatalogData();
    } catch (error) {
      console.error("Error initializing app:", error);
      toast("Error inicializando la aplicación", "error");
    }

    // Inicializar componentes UI
    HeroSlider.init();
    BestSellersSlider.init();

    // Configurar event listeners
    setupEventListeners();
    setupModalEvents();
    setupEventDelegation();
    setupGalleryEvents();
  }

  /* -------------------------------------------
     13) Inicialización
  -------------------------------------------- */
  document.addEventListener("DOMContentLoaded", initializeApp);
})();
