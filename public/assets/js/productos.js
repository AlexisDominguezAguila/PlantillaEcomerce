/* ============================================================
   TEC RIVERA · Catálogo – JS de interacción (mock estático)
   ============================================================ */

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
    /**
     * Llamada preparada (lista para conectar con backend)
     * @param {string} action
     * @param {object} params
     */
    fetch: async (action, params = {}) => {
      const url = new URL(API.base, window.location.href);
      url.searchParams.set("action", action);
      Object.entries(params).forEach(([k, v]) => {
        if (v !== undefined && v !== null && v !== "")
          url.searchParams.set(k, v);
      });
      const res = await fetch(url.toString(), {
        headers: { Accept: "application/json" },
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return res.json();
    },
  };

  const currency = { code: "PEN", symbol: "S/ " };
  const LS_KEYS = { cart: "tr_cart", wishlist: "tr_wishlist" };

  const state = {
    cart: [],
    wishlist: [],
    currentProduct: null, // para detalle
    checkoutStep: 1,
  };

  /* DOM refs */
  const els = {
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

  const toast = (() => {
    // inyecta estilos mínimos de toasts
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
    if (els.cartBadge)
      els.cartBadge.textContent = String(
        state.cart.reduce((a, it) => a + it.qty, 0)
      );
    if (els.wishBadge)
      els.wishBadge.textContent = String(state.wishlist.length);
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
     3) Carrito y Wishlist (mutadores + render)
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
        <img src="${
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
     4) Modales
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

  /* -------------------------------------------
     5) Checkout (mock)
  -------------------------------------------- */
  const setupCheckoutStep = (step) => {
    state.checkoutStep = step;
    const panels = els.stepsBody?.querySelectorAll(".step-panel") || [];
    panels.forEach((p, i) => p.classList.toggle("hidden", i !== step - 1));
    const indicators =
      els.stepsContainer?.querySelectorAll(".step-indicator") || [];
    indicators.forEach((s, i) => s.classList.toggle("active", i === step - 1));
  };

  const nextStep = () => {
    const totalSteps =
      els.stepsBody?.querySelectorAll(".step-panel").length || 6;
    if (state.checkoutStep < totalSteps) {
      setupCheckoutStep(state.checkoutStep + 1);
    }
  };
  const prevStep = () => {
    if (state.checkoutStep > 1) {
      setupCheckoutStep(state.checkoutStep - 1);
    }
  };

  /* -------------------------------------------
     6) Toolbar y filtros (mock)
  -------------------------------------------- */
  els.toolbarMore?.addEventListener("click", () => {
    const expanded = els.toolbarMore.getAttribute("aria-expanded") === "true";
    els.toolbarMore.setAttribute("aria-expanded", String(!expanded));
    els.header?.classList.toggle("show-extra");
  });

  els.clearFilters?.addEventListener("click", () => {
    els.prodSearch && (els.prodSearch.value = "");
    els.priceMin && (els.priceMin.value = "");
    els.priceMax && (els.priceMax.value = "");
    els.categorySelect && (els.categorySelect.selectedIndex = -1);
    els.sortSelect && (els.sortSelect.value = "recent");
    document.dispatchEvent(new CustomEvent("tr:filters:cleared"));
    toast("Filtros limpiados", "info");
  });

  /* -------------------------------------------
     7) Navegación detalle (mock)
  -------------------------------------------- */
  const showDetail = (prod) => {
    state.currentProduct = prod;
    // Si quieres, rellena campos del detalle aquí cuando conectes con backend.
    els.detailSection?.classList.remove("hidden");
    els.flashContainer?.classList.add("hidden");
    els.bestContainer?.classList.add("hidden");
    els.prodGrid?.classList.add("hidden");
    els.pagination?.classList.add("hidden");
    // breadcrumbs
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
  els.backToProducts?.addEventListener("click", backToCatalog);

  // Thumbs / prev-next detalle
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

  /* -------------------------------------------
     8) Delegación de eventos (grids/cards)
  -------------------------------------------- */
  const grids = [els.prodGrid, els.flashGrid, els.bestGrid, els.recGrid].filter(
    Boolean
  );

  // Añadir al carrito
  document.addEventListener("click", (e) => {
    const btn = e.target.closest(".add-to-cart");
    if (!btn) return;
    const card = btn.closest(".card-prod");
    const prod = extractProductFromCard(card);
    addToCart(prod, 1, true);
  });

  // Comprar ahora (añade y abre checkout)
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

  // Wishlist en detalle (btn superior)
  els.favBtn?.addEventListener("click", () => {
    if (!state.currentProduct) {
      // intenta obtener desde el detalle (fallback)
      const name =
        document.getElementById("name")?.textContent?.trim() || "Producto";
      const img = els.mainImg?.getAttribute("src") || "";
      state.currentProduct = { id: "detail-mock", name, image: img, price: 0 };
    }
    toggleWishlist(state.currentProduct, true);
    els.favBtn.classList.toggle(
      "active",
      isInWishlist(state.currentProduct.id)
    );
  });

  /* -------------------------------------------
     9) Eventos específicos de modales
  -------------------------------------------- */
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

  // Navegación de pasos checkout
  els.nextStepBtn?.addEventListener("click", nextStep);
  els.prevStepBtn?.addEventListener("click", prevStep);

  // Controles dentro de Carrito/Wishlist
  document.addEventListener("click", (e) => {
    // qty +/- en carrito
    const wrap = e.target.closest(".cart-controls");
    if (wrap && wrap.dataset.id) {
      const id = wrap.dataset.id;
      if (e.target.closest(".inc")) changeQty(id, +1);
      if (e.target.closest(".dec")) changeQty(id, -1);
      if (e.target.closest(".remove-btn")) removeFromCart(id, true);
    }
    // eliminar de wishlist
    if (e.target.closest(".wish-row .remove-btn")) {
      const id = e.target.closest(".cart-controls")?.dataset.id;
      if (!id) return;
      const idx = state.wishlist.findIndex((w) => String(w.id) === String(id));
      if (idx >= 0) {
        state.wishlist.splice(idx, 1);
        saveLocal();
        updateBadges();
        renderWishlist();
        toast("Quitado de deseos", "info");
      }
    }
    // agregar al carrito desde wishlist
    if (e.target.closest(".add-from-wish")) {
      const id = e.target.closest(".cart-controls")?.dataset.id;
      const w = state.wishlist.find((x) => String(x.id) === String(id));
      if (w) addToCart({ ...w, qty: 1 }, 1, true);
    }
  });

  /* -------------------------------------------
     10) Init
  -------------------------------------------- */
  const init = () => {
    loadLocal();
    updateBadges();
    renderCart();
    renderWishlist();

    // Por si hay cards ya en DOM (mock): marca wishlist activa
    grids.forEach((grid) => {
      grid?.querySelectorAll(".card-prod").forEach((card) => {
        const id = card.dataset.id;
        const heart = card.querySelector(".wishlist-icon");
        if (heart && id) {
          heart.classList.toggle("active", isInWishlist(id));
        }
      });
    });

    // Timer de ofertas (mock visual)
    const h = document.getElementById("hours");
    const m = document.getElementById("minutes");
    const s = document.getElementById("seconds");
    if (h && m && s) {
      let left = 3600; // 1h mock
      setInterval(() => {
        left = Math.max(0, left - 1);
        const hh = String(Math.floor(left / 3600)).padStart(2, "0");
        const mm = String(Math.floor((left % 3600) / 60)).padStart(2, "0");
        const ss = String(left % 60).padStart(2, "0");
        h.textContent = hh;
        m.textContent = mm;
        s.textContent = ss;
      }, 1000);
    }
  };

  document.addEventListener("DOMContentLoaded", init);

  /* -------------------------------------------
     11) Hooks para backend (ejemplos de uso)
     - Descomentar cuando conectes API
  -------------------------------------------- */
  // async function loadFeatured() {
  //   const res = await API.fetch(API.routes.destacados, { limit: 12 });
  //   if (res.success) { /* pintar en #sliderTrack */ }
  // }
  // async function loadFlash() {
  //   const res = await API.fetch(API.routes.flash);
  //   if (res.success && res.data) { /* pintar trio + res.data.seconds_left */ }
  // }
  // async function loadCatalog(params) {
  //   const res = await API.fetch(API.routes.catalogo, params);
  //   if (res.success) { /* pintar cards */ }
  // }
})();
