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
    if (!txt) return 0;
    return (
      Number(
        String(txt)
          .replace(/[^\d.,-]/g, "")
          .replace(/\./g, "")
          .replace(",", ".")
      ) || 0
    );
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
    const priceTxt = card.querySelector(".precio-actual")?.textContent || "";
    const price = parseMoney(priceTxt);
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
      row.className = "cart-row";
      row.innerHTML = `
      <img src="../uploads/productos/${
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
        <span style="min-width:90px;text-align:right;font-weight:800;">${fmtMoney(
          it.price * it.qty
        )}</span>
        <button class="remove-btn" title="Eliminar" aria-label="Eliminar">×</button>
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
      row.className = "wish-row";
      row.innerHTML = `
      <img src="../uploads/productos/${
        it.image || "https://via.placeholder.com/64x64?text=%20"
      }" alt="${it.name}">
      <div>
        <div class="wish-title">${it.name}</div>
        <div class="wish-meta">${fmtMoney(it.price)}</div>
      </div>
      <div class="cart-controls" data-id="${it.id}">
        <button class="add-from-wish btn-secondary" title="Agregar al carrito">Agregar</button>
        <button class="remove-btn" title="Quitar de deseos" aria-label="Quitar">×</button>
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

  const tplCard = (p) => {
    const old = p.old_price || null;
    const off =
      old && old > p.price ? Math.round(((old - p.price) / old) * 100) : 0;
    const firstImage = p.images && p.images.length ? p.images[0] : "";

    return `
      <article class="card-prod" role="listitem" data-id="${
        p.id
      }" data-category="${p.category_id}">
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
    els.flashGrid.innerHTML = dealData.items.map(tplCard).join("");
    startFlashCountdown(dealData.seconds_left);
  }

  function renderBestSellers(products) {
    if (!els.bestGrid) return;
    if (!products.length) {
      els.bestContainer.style.display = "none";
      return;
    }
    els.bestGrid.innerHTML = products.map(tplCard).join("");
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
      const card = btn.closest(".card-prod");
      const prod = extractProductFromCard(card);
      showDetail(prod);
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
