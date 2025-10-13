/* =====================================================================
   PRODUCTO.JS – versión saneada y profesional
   TEC RIVERA · Catálogo + Carrito + Checkout (frontend)
   ===================================================================== */

/* -------------------------
   Configuración / Constantes
------------------------- */
const CURRENCY = "S/";
const WHATSAPP_NUMBER = "51985468074"; // WhatsApp para coordinar efectivo
const YAPE_PHONE = "985468074";
const PLIN_PHONE = "985468074";
const YAPE_QR = "/public/assets/images/yape.jpg"; // <-- ruta a tu imagen QR Yape
const PLIN_QR = "/public/assets/images/plin.jpg"; // <-- ruta a tu imagen QR Plin
const BANK_ACCOUNTS = [
  {
    bank: "BCP",
    holder: "TEC RIVERA.",
    account: "53504461818006",
    cci: "00253510446181800638",
  },
  {
    bank: "INTERBANK",
    holder: "TEC RIVERA.",
    account: "898 3369307748",
    cci: "00389801336930774848",
  },
];

/* -------------------------
   Datos (demo)
------------------------- */
const products = [
  {
    id: 1,
    name: "Consola Portátil XGame",
    category: "Gaming",
    price: 1299,
    description:
      "Potente consola portátil con gráficos de última generación y 128GB de almacenamiento. Ideal para gamers en movimiento.",
    images: ["consolaPortatil.png"],
    image: "consolaPortatil.png",
  },
  {
    id: 2,
    name: "Asus TUF Gaming F15",
    category: "Laptops",
    price: 3499,
    description:
      "Laptop gamer con procesador Intel Core i7, 16GB RAM y tarjeta gráfica NVIDIA GeForce RTX 3060.",
    images: ["laptop.png", "laptop1.webp", "laptop2.webp", "laptop3.webp"],
    image: "laptop.png",
  },
  {
    id: 3,
    name: "Tablet Samsung Galaxy Tab S7",
    category: "Tablets",
    price: 999,
    description:
      "Tablet de alto rendimiento con pantalla de 11 pulgadas y S Pen incluido.",
    images: ["Tablet1.png", "Tablet2.webp", "Tablet3.webp", "Tablet4.webp"],
    image: "Tablet1.png",
  },
  {
    id: 4,
    name: "Impresora Epson EcoTank L3150",
    category: "Impresoras",
    price: 499,
    description:
      "Impresora láser compacta y eficiente, ideal para uso doméstico y pequeñas oficinas.",
    images: [
      "impresora.png",
      "impresora2.webp",
      "impresora3.webp",
      "impresora4.webp",
    ],
    image: "impresora.png",
  },
];

// Categorías con iconos (Boxicons)
const categories = [
  { name: "Laptops", icon: "bx bx-laptop" },
  { name: "Tablets", icon: "bx bx-tab" },
  { name: "Audio", icon: "bx bx-headphone" },
  { name: "Monitores", icon: "bx bx-desktop" },
  { name: "Gaming", icon: "bx bx-joystick" },
  { name: "Impresoras", icon: "bx bx-printer" },
];

/* -------------------------
   Estado de la app
------------------------- */
let cart = [];
let wishlist = [];
let currentSlide = 0;
let sliderTimer = null;

let checkoutStep = 1;
let selectedPaymentMethod = null;

/* -------------------------
   Utilidades
------------------------- */
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);
const fmtMoney = (n) => `${CURRENCY}${Number(n).toFixed(2)}`;

function openModal(id) {
  const m = document.getElementById(id);
  if (!m) return;
  m.classList.add("active");
  document.body.classList.add("modal-open");
}

function closeModal(id) {
  const m = document.getElementById(id);
  if (!m) return;
  m.classList.remove("active");
  if (!document.querySelector(".modal.active")) {
    document.body.classList.remove("modal-open");
  }
}

function showNotification(message) {
  const notification = document.createElement("div");
  notification.style.cssText = `
    position: fixed; bottom: 20px; right: 20px;
    background: #111344; color: #fff;
    padding: 1rem 1.25rem; border-radius: 10px;
    box-shadow: 0 10px 25px rgba(0,0,0,.25);
    z-index: 10000; animation: slideIn .25s ease;
    font-weight: 600;
  `;
  notification.textContent = message;
  document.body.appendChild(notification);
  setTimeout(() => {
    notification.style.animation = "slideOut .25s ease";
    setTimeout(() => notification.remove(), 250);
  }, 2500);
}

/* -------------------------
   Persistencia
------------------------- */
function saveToLocalStorage() {
  localStorage.setItem("cart", JSON.stringify(cart));
  localStorage.setItem("wishlist", JSON.stringify(wishlist));
}

function loadFromLocalStorage() {
  try {
    const savedCart = JSON.parse(localStorage.getItem("cart") || "[]");
    const savedWishlist = JSON.parse(localStorage.getItem("wishlist") || "[]");
    cart = Array.isArray(savedCart) ? savedCart : [];
    wishlist = Array.isArray(savedWishlist) ? savedWishlist : [];
  } catch {
    cart = [];
    wishlist = [];
  }
  updateCartCount();
  updateWishlistCount();
}

/* -------------------------
   Categorías
------------------------- */
function createCategoryCard(category) {
  const card = document.createElement("div");
  card.className = "category-card";
  card.innerHTML = `
    <i class="category-icon ${category.icon}" aria-hidden="true"></i>
    <h3>${category.name}</h3>
  `;
  card.addEventListener("click", () => filterByCategory(category.name));
  return card;
}

function renderCategories() {
  const categorySlider = document.getElementById("categorySlider");
  const categoryFilter = document.getElementById("categoryFilter");
  if (!categorySlider) return;

  categorySlider.innerHTML = "";
  if (categoryFilter) {
    categoryFilter.innerHTML = `<option value="all">Todas las categorías</option>`;
  }

  categories.forEach((category) => {
    const card = createCategoryCard(category);
    categorySlider.appendChild(card);

    if (categoryFilter) {
      const opt = document.createElement("option");
      opt.value = category.name;
      opt.textContent = category.name;
      categoryFilter.appendChild(opt);
    }
  });
}

function setupSliderNavigation() {
  const slider = document.getElementById("categorySlider");
  const leftBtn = document.querySelector(".left-btn");
  const rightBtn = document.querySelector(".right-btn");
  if (!slider || !leftBtn || !rightBtn) return;

  const step = 220; // desplazamiento aprox por tarjeta

  rightBtn.addEventListener("click", () => {
    const max = slider.scrollWidth - slider.clientWidth;
    const next = Math.min(slider.scrollLeft + step, max);
    slider.scrollTo({ left: next, behavior: "smooth" });
  });

  leftBtn.addEventListener("click", () => {
    const next = Math.max(slider.scrollLeft - step, 0);
    slider.scrollTo({ left: next, behavior: "smooth" });
  });
}

/* -------------------------
   Slider (Hero)
------------------------- */
function initSlider() {
  const sliderTrack = document.getElementById("sliderTrack");
  const sliderDots = document.getElementById("sliderDots");
  if (!sliderTrack || !sliderDots) return;

  sliderTrack.innerHTML = "";
  sliderDots.innerHTML = "";
  currentSlide = 0;

  const featured = products.slice(0, Math.min(5, products.length));
  featured.forEach((product, index) => {
    const slide = document.createElement("div");
    slide.className = "slide";
    slide.innerHTML = `
      <div class="slide-inner">
        <div class="slide-content">
          <h2>${product.name}</h2>
          <p>${product.description}</p>
          <div class="price">${fmtMoney(product.price)}</div>
        </div>
        <div class="slide-image">
          <img src="../assets/uploads/${product.image}" alt="${product.name}" />
        </div>
      </div>
    `;
    sliderTrack.appendChild(slide);

    const dot = document.createElement("div");
    dot.className = `dot ${index === 0 ? "active" : ""}`;
    dot.addEventListener("click", () => goToSlide(index));
    sliderDots.appendChild(dot);
  });

  const prev = document.getElementById("prevBtn");
  const next = document.getElementById("nextBtn");
  prev?.addEventListener("click", prevSlide);
  next?.addEventListener("click", nextSlide);

  if (sliderTimer) clearInterval(sliderTimer);
  sliderTimer = setInterval(nextSlide, 5000);
}

function goToSlide(index) {
  const sliderTrack = document.getElementById("sliderTrack");
  const dots = document.querySelectorAll(".dot");
  if (!sliderTrack || dots.length === 0) return;

  const total = dots.length;
  currentSlide = Math.max(0, Math.min(index, total - 1));
  sliderTrack.style.transform = `translateX(-${currentSlide * 100}%)`;
  dots.forEach((dot, i) => dot.classList.toggle("active", i === currentSlide));
}

function nextSlide() {
  const total = document.querySelectorAll(".dot").length;
  if (!total) return;
  currentSlide = (currentSlide + 1) % total;
  goToSlide(currentSlide);
}

function prevSlide() {
  const total = document.querySelectorAll(".dot").length;
  if (!total) return;
  currentSlide = (currentSlide - 1 + total) % total;
  goToSlide(currentSlide);
}

/* -------------------------
   Render de productos
------------------------- */
function renderProducts(filter = "all") {
  const grid = document.getElementById("productGrid");
  if (!grid) return;
  grid.innerHTML = "";

  const list =
    filter === "all" ? products : products.filter((p) => p.category === filter);

  list.forEach((product) => {
    const card = document.createElement("div");
    card.className = "product-card";

    const isInWishlist = wishlist.some((w) => w.id === product.id);

    // Imagen principal
    const firstImage = `../uploads/productos/${product.image}`;
    const secondImage =
      product.images && product.images.length > 1
        ? `../uploads/productos/${product.images[1]}`
        : firstImage;

    card.innerHTML = `
      <div class="product-image" data-action="open-detail" data-id="${
        product.id
      }">
        <img src="${firstImage}" alt="${
      product.name
    }" class="product-main-img" />
        <img src="${secondImage}" alt="${
      product.name
    }" class="product-hover-img" />
        <div class="product-actions">
          <button class="btn-icon wishlist-btn ${isInWishlist ? "active" : ""}"
            data-action="toggle-wishlist" data-id="${
              product.id
            }" aria-label="Añadir a deseos">
            <i class="bx bx-heart"></i>
          </button>
          <button class="btn-icon cart-btn"
            data-action="add-cart" data-id="${
              product.id
            }" aria-label="Agregar al carrito">
            <i class="bx bx-cart"></i>
          </button>
        </div>
      </div>

      <div class="product-info">
        <div class="product-category">${product.category}</div>
        <h3 class="product-name" data-action="open-detail" data-id="${
          product.id
        }">
          ${product.name}
        </h3>
        <p class="product-description">${product.description}</p>
        <div class="product-footer">
          <div class="product-price">${fmtMoney(product.price)}</div>
          <button class="btn-view-detail" data-action="open-detail" data-id="${
            product.id
          }">
            <i class="bx bx-show-alt"></i>
          </button>
        </div>
      </div>
    `;

    // Eventos de acción (sin abrir detalle por error)
    card.addEventListener("click", (e) => {
      const t = e.target.closest("[data-action]");
      if (!t) return;

      const action = t.getAttribute("data-action");
      const id = Number(t.getAttribute("data-id"));
      if (!action) return;
      e.stopPropagation();

      if (action === "open-detail") {
        showProductDetail(product);
      } else if (action === "toggle-wishlist") {
        toggleWishlist(product);
      } else if (action === "add-cart") {
        addToCart(product);
      }
    });

    grid.appendChild(card);
  });
}

function filterByCategory(category) {
  const sel = document.getElementById("categoryFilter");
  if (sel) sel.value = category || "all";
  renderProducts(category || "all");
}

/* -------------------------
   Detalle de producto
------------------------- */
function showProductDetail(product) {
  const productsSection = document.getElementById("productsSection");
  const detailSection = document.getElementById("productDetailSection");
  if (!productsSection || !detailSection) return;

  // Ocultar productos y mostrar detalle
  productsSection.classList.add("hidden");
  detailSection.classList.remove("hidden");

  // Hacer scroll al inicio
  detailSection.scrollIntoView({ behavior: "smooth", block: "start" });

  // Reactivar íconos Lucide si existen
  if (typeof lucide !== "undefined") lucide.createIcons();

  // Actualizar breadcrumb
  $("#breadcrumb-name").textContent = product.name;

  // Rellenar datos principales
  $("#brand").textContent = product.category;
  $("#name").textContent = product.name;
  $("#sku").textContent = "SKU: " + product.id;
  $("#prices").innerHTML = `
    <span class="text-3xl font-bold text-gray-900">${fmtMoney(
      product.price
    )}</span>
  `;
  $("#shipping").innerHTML = `
    <div class="flex items-center gap-3 mb-2">
      <i data-lucide="truck" class="w-5 h-5 text-blue-600"></i>
      <div>
        <div class="font-semibold text-gray-900">
          Envío disponible en todo el país
        </div>
        <div class="text-sm text-gray-600">Tiempo estimado: 2-3 días hábiles</div>
      </div>
    </div>
  `;
  $("#stock").textContent = "Disponible en stock";

  /* ---------------------------
     Galería de imágenes
  --------------------------- */
  const mainImg = $("#main-img");
  const thumbs = $("#thumbs");
  thumbs.innerHTML = "";

  const images = product.images?.length
    ? product.images.map((img) => `../uploads/productos/${img}`)
    : [`../uploads/productos/${product.image}`];

  let currentIndex = 0;
  mainImg.src = images[currentIndex];

  function updateImage() {
    mainImg.src = images[currentIndex];
  }

  $("#prev-img").onclick = () => {
    currentIndex = (currentIndex - 1 + images.length) % images.length;
    updateImage();
  };
  $("#next-img").onclick = () => {
    currentIndex = (currentIndex + 1) % images.length;
    updateImage();
  };

  images.forEach((src, i) => {
    const btn = document.createElement("button");
    btn.className = `w-20 h-20 rounded-lg overflow-hidden border-2 ${
      i === 0 ? "border-blue-500 shadow-md" : "border-gray-200"
    }`;
    btn.innerHTML = `<img src="${src}" class="w-full h-full object-cover"/>`;
    btn.addEventListener("click", () => {
      currentIndex = i;
      updateImage();
      thumbs
        .querySelectorAll("button")
        .forEach(
          (b) =>
            (b.className =
              "w-20 h-20 rounded-lg overflow-hidden border-2 border-gray-200")
        );
      btn.className =
        "w-20 h-20 rounded-lg overflow-hidden border-2 border-blue-500 shadow-md";
    });
    thumbs.appendChild(btn);
  });

  /* ---------------------------
     Wishlist
  --------------------------- */
  const favIcon = $("#fav-btn i");
  const isFav = wishlist.some((w) => w.id === product.id);
  favIcon.classList.toggle("fill-red-500", isFav);
  favIcon.classList.toggle("text-red-500", isFav);

  $("#fav-btn").onclick = () => {
    toggleWishlist(product);
    favIcon.classList.toggle("fill-red-500");
    favIcon.classList.toggle("text-red-500");
    favIcon.classList.toggle("text-gray-400");
  };

  /* ---------------------------
     Cantidad
  --------------------------- */
  let cantidad = 1;
  const inputCantidad = $("#quantity");
  $("#increment").onclick = () => {
    cantidad++;
    inputCantidad.value = cantidad;
  };
  $("#decrement").onclick = () => {
    if (cantidad > 1) cantidad--;
    inputCantidad.value = cantidad;
  };

  /* ---------------------------
     Botones principales
  --------------------------- */
  $$(".btn-add-cart").forEach((btn) =>
    btn.addEventListener("click", () => addToCart(product))
  );
  $("#checkoutBtn")?.addEventListener("click", () => {
    addToCart(product);
    if (typeof openCheckout === "function") openCheckout();
  });

  /* ---------------------------
     Especificaciones y vendedor
  --------------------------- */
  $("#specs").innerHTML = `
    <h2 class="text-2xl font-bold mb-6">Acerca del producto</h2>
    <p class="text-gray-600">${product.description}</p>
  `;
  $("#seller").innerHTML = `
    <div class="flex items-center justify-between">
      <div>
        <div class="text-sm text-gray-600">Vendido por</div>
        <div class="font-semibold text-gray-900">TEC RIVERA</div>
      </div>
      <div class="flex items-center gap-1 bg-green-100 px-3 py-1 rounded-full">
        <i data-lucide="star" class="w-4 h-4 fill-green-600 text-green-600"></i>
        <span class="font-semibold text-green-700">5.0</span>
      </div>
    </div>
  `;

  /* ---------------------------
     Productos relacionados
  --------------------------- */
  const related = $("#related");
  related.innerHTML = `
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-2xl font-bold">Productos relacionados</h2>
      <button id="backToCatalogBtn" class="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium px-4 py-2 rounded-lg transition">
        ← Volver al catálogo
      </button>
    </div>
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
      ${products
        .filter((p) => p.id !== product.id)
        .slice(0, 4)
        .map(
          (p) => `
          <div class="related-item border border-gray-200 rounded-xl p-4 hover:shadow-lg transition-all cursor-pointer group">
            <div class="aspect-square bg-gray-100 rounded-lg mb-3 overflow-hidden">
              <img src="../assets/uploads/${
                p.image
              }" class="w-full h-full object-contain group-hover:scale-105 transition-transform" />
            </div>
            <h3 class="font-medium text-sm mb-2 text-gray-900">${p.name}</h3>
            <div class="font-bold text-lg text-blue-600">${fmtMoney(
              p.price
            )}</div>
            <button class="view-detail-btn mt-2 w-full bg-blue-50 hover:bg-blue-100 text-blue-600 font-medium py-2 rounded-lg flex items-center justify-center gap-1">
              <i data-lucide="eye" class="w-4 h-4"></i> Ver detalles
            </button>
          </div>`
        )
        .join("")}
    </div>
  `;

  // Añadir eventos dinámicos a los botones de “Ver detalles” y “Volver”
  related.querySelectorAll(".view-detail-btn").forEach((btn, i) => {
    btn.addEventListener("click", () => {
      const relProduct = products.filter((p) => p.id !== product.id)[i];
      showProductDetail(relProduct);
    });
  });

  $("#backToCatalogBtn")?.addEventListener("click", () => {
    detailSection.classList.add("hidden");
    productsSection.classList.remove("hidden");
    productsSection.scrollIntoView({ behavior: "smooth", block: "start" });
  });

  // Reactiva iconos Lucide
  if (typeof lucide !== "undefined") lucide.createIcons();
}

// Botón "volver"
document.addEventListener("click", (e) => {
  const target = e.target;
  if (target && target.id === "backToProducts") {
    e.preventDefault();
    document.getElementById("productDetailSection").classList.add("hidden");
    document.getElementById("productsSection").classList.remove("hidden");
  }
});

/* -------------------------
   Carrito
------------------------- */
function addToCart(product) {
  const existing = cart.find((i) => i.id === product.id);
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }
  updateCartCount();
  saveToLocalStorage();
  showNotification(`${product.name} agregado al carrito`);
}

function removeFromCart(productId) {
  cart = cart.filter((i) => i.id !== productId);
  updateCartCount();
  renderCart();
  saveToLocalStorage();
}

function updateQuantity(productId, change) {
  const item = cart.find((i) => i.id === productId);
  if (!item) return;
  item.quantity += change;
  if (item.quantity <= 0) {
    removeFromCart(productId);
  } else {
    renderCart();
    updateCartCount();
    saveToLocalStorage();
  }
}

function renderCart() {
  const wrap = document.getElementById("cartItems");
  const totalEl = document.getElementById("cartTotal");
  if (!wrap || !totalEl) return;

  if (cart.length === 0) {
    wrap.innerHTML = '<div class="empty-message">Tu carrito está vacío</div>';
    totalEl.textContent = "0.00";
    return;
  }

  wrap.innerHTML = cart
    .map(
      (item) => `
      <div class="cart-item">
        <div class="cart-item-image">
          <img src="../assets/uploads/${item.image}" alt="${item.name}" />
        </div>
        <div class="cart-item-info">
          <div class="cart-item-name">${item.name}</div>
          <div class="cart-item-price">${fmtMoney(item.price)}</div>
        </div>
        <div class="cart-item-actions">
          <button class="quantity-btn" aria-label="Disminuir" data-action="qty-dec" data-id="${
            item.id
          }">-</button>
          <span class="quantity">${item.quantity}</span>
          <button class="quantity-btn" aria-label="Aumentar" data-action="qty-inc" data-id="${
            item.id
          }">+</button>
          <button class="remove-btn" data-action="remove" data-id="${
            item.id
          }">Eliminar</button>
        </div>
      </div>
    `
    )
    .join("");

  const total = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);
  totalEl.textContent = total.toFixed(2);

  // Delegación de eventos para los botones del carrito
  wrap.addEventListener(
    "click",
    (e) => {
      const t = e.target;
      if (!(t instanceof HTMLElement)) return;
      const id = Number(t.getAttribute("data-id"));
      const action = t.getAttribute("data-action");
      if (!action || Number.isNaN(id)) return;

      if (action === "qty-dec") updateQuantity(id, -1);
      if (action === "qty-inc") updateQuantity(id, 1);
      if (action === "remove") removeFromCart(id);
    },
    { once: true }
  );
}

function updateCartCount() {
  const count = cart.reduce((sum, i) => sum + i.quantity, 0);
  const b = document.getElementById("cartCount");
  if (b) b.textContent = String(count);
}

/* -------------------------
   Wishlist
------------------------- */
function toggleWishlist(product) {
  const i = wishlist.findIndex((w) => w.id === product.id);
  if (i > -1) {
    wishlist.splice(i, 1);
    showNotification(`${product.name} eliminado de la lista de deseos`);
  } else {
    wishlist.push(product);
    showNotification(`${product.name} agregado a la lista de deseos`);
  }
  updateWishlistCount();
  renderProducts($("#categoryFilter")?.value || "all");
  saveToLocalStorage();
}

function removeFromWishlist(productId) {
  wishlist = wishlist.filter((w) => w.id !== productId);
  updateWishlistCount();
  renderWishlist();
  renderProducts($("#categoryFilter")?.value || "all");
  saveToLocalStorage();
}

function renderWishlist() {
  const wrap = document.getElementById("wishlistItems");
  if (!wrap) return;

  if (wishlist.length === 0) {
    wrap.innerHTML =
      '<div class="empty-message">Tu lista de deseos está vacía</div>';
    return;
  }

  wrap.innerHTML = wishlist
    .map(
      (item) => `
      <div class="wishlist-item">
        <div class="wishlist-item-image">
          <img src="../assets/uploads/${item.image}" alt="${item.name}" />
        </div>
        <div class="wishlist-item-info">
          <div class="wishlist-item-name">${item.name}</div>
          <div class="wishlist-item-price">${fmtMoney(item.price)}</div>
        </div>
        <div class="cart-item-actions">
          <button class="btn btn-primary" data-action="wish-add-cart" data-id="${
            item.id
          }">Agregar al Carrito</button>
          <button class="remove-btn" data-action="wish-remove" data-id="${
            item.id
          }">Eliminar</button>
        </div>
      </div>
    `
    )
    .join("");

  wrap.addEventListener(
    "click",
    (e) => {
      const t = e.target;
      if (!(t instanceof HTMLElement)) return;
      const id = Number(t.getAttribute("data-id"));
      const action = t.getAttribute("data-action");
      if (!action || Number.isNaN(id)) return;

      const product = products.find((p) => p.id === id);
      if (!product) return;
      if (action === "wish-add-cart") addToCart(product);
      if (action === "wish-remove") removeFromWishlist(id);
    },
    { once: true }
  );
}

function updateWishlistCount() {
  const el = document.getElementById("wishlistCount");
  if (el) el.textContent = String(wishlist.length);
}

/* -------------------------
   Checkout (Wizard)
------------------------- */
function openCheckout() {
  if (cart.length === 0) {
    showNotification("Tu carrito está vacío");
    return;
  }
  checkoutStep = 1;
  selectedPaymentMethod = null;
  updateStepUI();
  renderCheckoutSummary();
  closeModal("cartModal");
  openModal("checkoutModal");
}

function renderCheckoutSummary() {
  const wrap = document.getElementById("checkoutSummary");
  if (!wrap) return;

  const total = cart.reduce((s, it) => s + it.price * it.quantity, 0);
  const itemsHTML = cart
    .map(
      (it) => `
      <div class="co-item">
        <div class="co-item-info">
          <div class="co-name">${it.name}</div>
          <div class="co-qty">x${it.quantity}</div>
        </div>
        <div class="co-price">${fmtMoney(it.price * it.quantity)}</div>
      </div>
    `
    )
    .join("");

  wrap.innerHTML = `
    <div class="co-items">${itemsHTML}</div>
    <div class="co-total">
      <span>Total a pagar</span>
      <strong>${fmtMoney(total)}</strong>
    </div>
  `;
}

function readSelectedMethod() {
  const form = document.getElementById("paymentMethodForm");
  if (!form) return null;
  const fd = new FormData(form);
  return fd.get("paymentMethod");
}

function renderPaymentMethodView() {
  const view = document.getElementById("paymentMethodView");
  if (!view) return;

  const total = cart.reduce((s, it) => s + it.price * it.quantity, 0);
  const totalText = fmtMoney(total);

  if (selectedPaymentMethod === "card") {
    document.getElementById("step3Title").textContent = "Pagar con tarjeta";
    view.innerHTML = `
      <form id="cardForm" class="form-grid" onsubmit="event.preventDefault();">
        <div class="form-field">
          <label>Nombre del titular</label>
          <input type="text" required placeholder="Como aparece en la tarjeta" />
        </div>
        <div class="form-field">
          <label>Número de tarjeta</label>
          <input type="text" inputmode="numeric" maxlength="19" placeholder="0000 0000 0000 0000" required />
        </div>
        <div class="form-row">
          <div class="form-field">
            <label>Vencimiento</label>
            <input type="text" inputmode="numeric" maxlength="5" placeholder="MM/AA" required />
          </div>
          <div class="form-field">
            <label>CVV</label>
            <input type="password" inputmode="numeric" maxlength="4" placeholder="***" required />
          </div>
        </div>
        <button class="btn-primary full" id="##payCardBtn">Pagar ${totalText}</button>
      </form>
    `;
    $("#payCardBtn")?.addEventListener("click", () =>
      confirmPayment("Tarjeta", total)
    );
  }

  if (selectedPaymentMethod === "wallet") {
    document.getElementById("step3Title").textContent =
      "Pagar con billetera (Yape / Plin)";
    view.innerHTML = `
      <div class="wallet-chooser">
        <label><input type="radio" name="walletType" value="yape" checked /> Yape</label>
        <label><input type="radio" name="walletType" value="plin" /> Plin</label>
      </div>

      <div class="wallet-box">
        <div class="wallet-info">
          <div>Monto: <strong>${totalText}</strong></div>
          <div id="walletNumber"></div>
          <div class="hint">* Escanea el QR o envía al número y luego confirma.</div>
        </div>
        <div class="wallet-qr" id="walletQr"></div>
      </div>

      <button class="btn-primary full" id="##walletConfirmBtn">Ya realicé el pago</button>
    `;

    const renderWallet = () => {
      const type =
        (document.querySelector('input[name="walletType"]:checked') || {})
          .value || "yape";

      const phone = type === "yape" ? YAPE_PHONE : PLIN_PHONE;
      const qr = type === "yape" ? YAPE_QR : PLIN_QR;

      document.getElementById(
        "walletNumber"
      ).innerHTML = `Número ${type.toUpperCase()}: <strong>${phone}</strong>`;

      document.getElementById(
        "walletQr"
      ).innerHTML = `<img src="${qr}" alt="QR ${type}" class="wallet-qr-img" />`;
    };

    renderWallet();

    // Escuchar cambio de billetera
    document
      .querySelectorAll('input[name="walletType"]')
      .forEach((r) => r.addEventListener("change", renderWallet));

    document
      .getElementById("walletConfirmBtn")
      ?.addEventListener("click", () =>
        confirmPayment("Billetera (Yape/Plin)", total)
      );
  }

  if (selectedPaymentMethod === "transfer") {
    document.getElementById("step3Title").textContent =
      "Pagar por transferencia bancaria";
    const accountsHtml = BANK_ACCOUNTS.map(
      (b) => `
        <div class="bank-card">
          <div class="bank-title">${b.bank}</div>
          <div>Titular: <strong>${b.holder}</strong></div>
          <div>Cuenta: <strong>${b.account}</strong></div>
          <div>CCI: <strong>${b.cci}</strong></div>
        </div>`
    ).join("");

    view.innerHTML = `
      <div class="transfer-wrap">
        <div class="transfer-info">
          <div>Monto a transferir: <strong>${totalText}</strong></div>
          <div class="banks">${accountsHtml}</div>
          <label class="voucher">
            <span>Adjuntar comprobante (opcional):</span>
            <input type="file" id="voucherInput" accept="image/*,application/pdf" />
          </label>
        </div>
        <button class="btn-primary full" id="##transferConfirmBtn">He realizado la transferencia</button>
      </div>
    `;

    $("#transferConfirmBtn")?.addEventListener("click", () =>
      confirmPayment("Transferencia bancaria", total)
    );
  }

  if (selectedPaymentMethod === "whatsapp") {
    document.getElementById("step3Title").textContent =
      "Coordinar por WhatsApp (pago en efectivo)";
    const msg = `Hola, quiero coordinar mi pago en efectivo. Total: ${totalText}. Pedido: ${cart
      .map((i) => `${i.name} x${i.quantity}`)
      .join(", ")}`;
    const waUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
      msg
    )}`;

    view.innerHTML = `
      <div class="wa-wrap">
        <p>Abriremos WhatsApp para coordinar la entrega y el pago en efectivo.</p>
        <a class="btn-primary full" href="${waUrl}" target="_blank" rel="noopener">Abrir WhatsApp</a>
        <button class="btn-secondary full" id="##waConfirmBtn">Ya coordiné por WhatsApp</button>
      </div>
    `;

    $("#waConfirmBtn")?.addEventListener("click", () =>
      confirmPayment("WhatsApp (efectivo)", total)
    );
  }
}

function confirmPayment(method, total) {
  const receipt = "TR-" + Math.random().toString(36).slice(2, 8).toUpperCase();
  const box = document.getElementById("receiptBox");
  const msg = document.getElementById("confirmationText");
  if (box) {
    box.innerHTML = `
      <div><strong>Método:</strong> ${method}</div>
      <div><strong>Total:</strong> ${fmtMoney(total)}</div>
      <div><strong>Recibo:</strong> ${receipt}</div>
    `;
  }
  if (msg)
    msg.textContent = "Gracias. Tu pedido fue registrado correctamente (demo).";

  // Vaciar carrito
  cart = [];
  updateCartCount();
  renderCart();
  saveToLocalStorage();

  checkoutStep = 4;
  updateStepUI();
}

function nextStep() {
  if (checkoutStep === 1) {
    checkoutStep = 2;
    updateStepUI();
    return;
  }
  if (checkoutStep === 2) {
    const chosen = readSelectedMethod();
    if (!chosen) {
      showNotification("Selecciona un método de pago");
      return;
    }
    selectedPaymentMethod = chosen;
    checkoutStep = 3;
    updateStepUI();
    renderPaymentMethodView();
    return;
  }
  if (checkoutStep === 3) {
    showNotification("Usa el botón de confirmar/pagar del método elegido");
    return;
  }
  if (checkoutStep === 4) {
    closeModal("checkoutModal");
  }
}

function prevStep() {
  if (checkoutStep <= 1) {
    closeModal("checkoutModal");
    return;
  }
  if (checkoutStep === 4) {
    checkoutStep = 3;
  } else {
    checkoutStep -= 1;
  }
  updateStepUI();
  if (checkoutStep === 1) renderCheckoutSummary();
  if (checkoutStep === 3) renderPaymentMethodView();
}

function updateStepUI() {
  ["step1", "step2", "step3", "step4"].forEach((id, idx) => {
    const el = document.getElementById(id);
    if (el) el.classList.toggle("hidden", checkoutStep !== idx + 1);
  });
  document.querySelectorAll(".step-indicator").forEach((el) => {
    const step = Number(el.getAttribute("data-step"));
    el.classList.toggle("active", step === checkoutStep);
    el.classList.toggle("done", step < checkoutStep);
  });

  const prevBtn = document.getElementById("prevStepBtn");
  const nextBtn = document.getElementById("nextStepBtn");
  if (prevBtn)
    prevBtn.style.display = checkoutStep === 1 ? "none" : "inline-flex";
  if (nextBtn) {
    nextBtn.textContent = checkoutStep === 4 ? "Cerrar" : "Siguiente";
  }
}

/* -------------------------
   Listeners globales
------------------------- */
function setupEventListeners() {
  // Abrir modales
  $("#cartBtn")?.addEventListener("click", () => {
    renderCart();
    openModal("cartModal");
  });
  $("#wishlistBtn")?.addEventListener("click", () => {
    renderWishlist();
    openModal("wishlistModal");
  });

  // Cierres
  $("#modalClose")?.addEventListener("click", () => closeModal("productModal"));
  $("#cartModalClose")?.addEventListener("click", () =>
    closeModal("cartModal")
  );
  $("#wishlistModalClose")?.addEventListener("click", () =>
    closeModal("wishlistModal")
  );
  $("#checkoutClose")?.addEventListener("click", () =>
    closeModal("checkoutModal")
  );

  // Click fuera para cerrar
  document.querySelectorAll(".modal").forEach((modal) => {
    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        modal.classList.remove("active");
        if (!document.querySelector(".modal.active")) {
          document.body.classList.remove("modal-open");
        }
      }
    });
  });

  // Filtro categorías
  $("#categoryFilter")?.addEventListener("change", (e) => {
    renderProducts(e.target.value || "all");
  });

  // Checkout
  $("#checkoutBtn")?.addEventListener("click", openCheckout);
  $("#prevStepBtn")?.addEventListener("click", prevStep);
  $("#nextStepBtn")?.addEventListener("click", nextStep);
}

/* -------------------------
   Animaciones mínimas (toast)
------------------------- */
const style = document.createElement("style");
style.textContent = `
  @keyframes slideIn { from { transform: translateX(400px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
  @keyframes slideOut { from { transform: translateX(0); opacity: 1; } to { transform: translateX(400px); opacity: 0; } }
`;
document.head.appendChild(style);

/* -------------------------
   Bootstrap de la página
------------------------- */
document.addEventListener("DOMContentLoaded", () => {
  loadFromLocalStorage();
  renderCategories();
  setupSliderNavigation();
  initSlider();
  renderProducts("all");
  setupEventListeners();
});
