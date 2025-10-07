// Datos de productos
const products = [
  {
    id: 1,
    name: "Consola Portátil XGame",
    category: "Gaming",
    price: 1299,
    description:
      "Potente consola portátil con gráficos de última generación y 128GB de almacenamiento. Ideal para gamers en movimiento.",
    image: "consolaPortatil.png",
  },
  {
    id: 2,
    name: "Asus TUF Gaming F15",
    category: "Laptops",
    price: 3499,
    description:
      "Laptop gamer con procesador Intel Core i7, 16GB RAM y tarjeta gráfica NVIDIA GeForce RTX 3060.",
    image: "laptop.png",
  },
  {
    id: 3,
    name: "Tablet Samsung Galaxy Tab S7",
    category: "Tablets",
    price: 999,
    description:
      "Tablet de alto rendimiento con pantalla de 11 pulgadas y S Pen incluido.",
    image: "Tablet1.png",
  },
  {
    id: 4,
    name: "Impresora Epson EcoTank L3150",
    category: "Impresoras",
    price: 499,
    description:
      "Impresora láser compacta y eficiente, ideal para uso doméstico y pequeñas oficinas.",
    image: "impresora.png",
  },
];

// ==============================
// Categorías con íconos Boxicons
// ==============================
const categories = [
  { name: "Laptops", icon: "bx bx-laptop" },
  { name: "Smartphones", icon: "bx bx-mobile" },
  { name: "Tablets", icon: "bx bx-tab" },
  { name: "Audio", icon: "bx bx-headphone" },
  { name: "Wearables", icon: "bx bx-clock" },
  { name: "Cámaras", icon: "bx bx-camera" },
  { name: "Monitores", icon: "bx bx-desktop" },
  { name: "Accesorios", icon: "bx bx-keyboard" },
  { name: "Drones", icon: "bx bx-cube" },
  { name: "Gaming", icon: "bx bx-joystick" },
  { name: "Impresoras", icon: "bx bx-printer" },
];

function renderCategories() {
  const categorySlider = document.getElementById("categorySlider");
  const categoryFilter = document.getElementById("categoryFilter");

  if (!categorySlider) {
    return console.warn("No existe #categorySlider en el HTML");
  }

  // Limpia antes de renderizar
  categorySlider.innerHTML = "";
  if (categoryFilter)
    categoryFilter.innerHTML = "<option value=''>Todas</option>";

  // Renderizar categorías normales
  categories.forEach((category) => {
    const card = createCategoryCard(category);
    categorySlider.appendChild(card);

    // Añadir al select si existe
    if (categoryFilter) {
      const option = document.createElement("option");
      option.value = category.name;
      option.textContent = category.name;
      categoryFilter.appendChild(option);
    }
  });

  // Clonar los primeros 3 elementos para efecto infinito
  categories.slice(0, 3).forEach((category) => {
    const card = createCategoryCard(category);
    categorySlider.appendChild(card);
  });
}

function createCategoryCard(category) {
  const card = document.createElement("div");
  card.className = "category-card";
  card.innerHTML = `
    <i class="category-icon ${category.icon}"></i>
    <h3>${category.name}</h3>
  `;
  card.addEventListener("click", () => filterByCategory(category.name));
  return card;
}

function setupSliderNavigation() {
  const slider = document.getElementById("categorySlider");
  const leftBtn = document.querySelector(".left-btn");
  const rightBtn = document.querySelector(".right-btn");

  if (!slider || !leftBtn || !rightBtn) return;

  const cardWidth = 200; // ancho aprox de cada tarjeta
  const totalCards = slider.children.length;

  rightBtn.addEventListener("click", () => {
    slider.scrollBy({ left: cardWidth, behavior: "smooth" });

    // Revisar si llegó al final
    setTimeout(() => {
      if (slider.scrollLeft >= (totalCards - 3) * cardWidth) {
        slider.scrollTo({ left: 0 });
      }
    }, 400);
  });

  leftBtn.addEventListener("click", () => {
    if (slider.scrollLeft <= 0) {
      slider.scrollTo({ left: (totalCards - 3) * cardWidth });
    } else {
      slider.scrollBy({ left: -cardWidth, behavior: "smooth" });
    }
  });
}

// Estado de la aplicación
let cart = [];
let wishlist = [];
let currentSlide = 0;

// Inicialización
document.addEventListener("DOMContentLoaded", () => {
  renderCategories();
  setupSliderNavigation();
  initSlider();
  renderProducts();
  setupEventListeners();
  loadFromLocalStorage();
});

// Slider
function initSlider() {
  const sliderTrack = document.getElementById("sliderTrack");
  const sliderDots = document.getElementById("sliderDots");
  const featuredProducts = products.slice(0, 5);

  featuredProducts.forEach((product, index) => {
    const slide = document.createElement("div");
    slide.className = "slide";
    slide.innerHTML = `
      <div class="slide-inner">
        <!-- Texto -->
        <div class="slide-content">
          <h2>${product.name}</h2>
          <p>${product.description}</p>
          <div class="price">S/${product.price}</div>
        </div>
        <!-- Imagen -->
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

  document.getElementById("prevBtn").addEventListener("click", prevSlide);
  document.getElementById("nextBtn").addEventListener("click", nextSlide);

  setInterval(nextSlide, 5000);
}

function goToSlide(index) {
  const sliderTrack = document.getElementById("sliderTrack");
  const dots = document.querySelectorAll(".dot");
  const totalSlides = dots.length;

  currentSlide = index;
  sliderTrack.style.transform = `translateX(-${currentSlide * 100}%)`;

  dots.forEach((dot, i) => {
    dot.classList.toggle("active", i === currentSlide);
  });
}

function nextSlide() {
  const totalSlides = document.querySelectorAll(".dot").length;
  currentSlide = (currentSlide + 1) % totalSlides;
  goToSlide(currentSlide);
}

function prevSlide() {
  const totalSlides = document.querySelectorAll(".dot").length;
  currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
  goToSlide(currentSlide);
}

// Productos
function renderProducts(filter = "all") {
  const productGrid = document.getElementById("productGrid");
  productGrid.innerHTML = "";

  const filteredProducts =
    filter === "all" ? products : products.filter((p) => p.category === filter);

  filteredProducts.forEach((product) => {
    const card = document.createElement("div");
    card.className = "product-card";

    const isInWishlist = wishlist.some((item) => item.id === product.id);

    card.innerHTML = `
            <div class="product-image"><img src="../assets/uploads/${
              product.image
            }" alt="${product.name}" /></div>
            <div class="product-info">
                <div class="product-category">${product.category}</div>
                <h3 class="product-name">${product.name}</h3>
                <p class="product-description">${product.description}</p>
                <div class="product-footer">
                    <div class="product-price">S/${product.price}</div>
                    <div class="product-actions">
                        <button class="btn-icon wishlist-btn ${
                          isInWishlist ? "active" : ""
                        }" data-id="${product.id}">
                            ♥
                        </button>
                        <button class="btn-icon cart-btn" data-id="${
                          product.id
                        }">
                            🛒
                        </button>
                    </div>
                </div>
            </div>
        `;

    card
      .querySelector(".product-image")
      .addEventListener("click", () => showProductDetail(product));
    card
      .querySelector(".product-name")
      .addEventListener("click", () => showProductDetail(product));
    card.querySelector(".wishlist-btn").addEventListener("click", (e) => {
      e.stopPropagation();
      toggleWishlist(product);
    });
    card.querySelector(".cart-btn").addEventListener("click", (e) => {
      e.stopPropagation();
      addToCart(product);
    });

    productGrid.appendChild(card);
  });
}

function filterByCategory(category) {
  document.getElementById("categoryFilter").value = category;
  renderProducts(category);
}

// Detalle del producto
function showProductDetail(product) {
  const modal = document.getElementById("productModal");
  const modalBody = document.getElementById("modalBody");

  const isInWishlist = wishlist.some((item) => item.id === product.id);

  modalBody.innerHTML = `
        <div class="product-detail">
            <div class="product-detail-image"><img src="../assets/uploads/${
              product.image
            }" alt="${product.name}" /></div>
            <div class="product-detail-info">
                <div class="product-category">${product.category}</div>
                <h2>${product.name}</h2>
                <p class="product-description">${product.description}</p>
                <div class="product-detail-price">s/${product.price}</div>
                <div class="product-detail-actions">
                    <button class="btn btn-primary" onclick="addToCart(${JSON.stringify(
                      product
                    ).replace(/"/g, "&quot;")})">
                        🛒 Agregar al Carrito
                    </button>
                    <button class="btn btn-secondary ${
                      isInWishlist ? "active" : ""
                    }" onclick="toggleWishlist(${JSON.stringify(
    product
  ).replace(/"/g, "&quot;")})">
                        ♥ ${isInWishlist ? "En Lista" : "Deseos"}
                    </button>
                </div>
            </div>
        </div>
    `;

  modal.classList.add("active");
}

// Carrito
function addToCart(product) {
  const existingItem = cart.find((item) => item.id === product.id);

  if (existingItem) {
    existingItem.quantity++;
  } else {
    cart.push({ ...product, quantity: 1 });
  }

  updateCartCount();
  saveToLocalStorage();
  showNotification(`${product.name} agregado al carrito`);
}

function removeFromCart(productId) {
  cart = cart.filter((item) => item.id !== productId);
  updateCartCount();
  renderCart();
  saveToLocalStorage();
}

function updateQuantity(productId, change) {
  const item = cart.find((item) => item.id === productId);
  if (item) {
    item.quantity += change;
    if (item.quantity <= 0) {
      removeFromCart(productId);
    } else {
      renderCart();
      updateCartCount();
      saveToLocalStorage();
    }
  }
}

function renderCart() {
  const cartItems = document.getElementById("cartItems");
  const cartTotal = document.getElementById("cartTotal");

  if (cart.length === 0) {
    cartItems.innerHTML =
      '<div class="empty-message">Tu carrito está vacío</div>';
    cartTotal.textContent = "0";
    return;
  }

  cartItems.innerHTML = cart
    .map(
      (item) => `
        <div class="cart-item">
            <div class="cart-item-image">
                <img src="../assets/uploads/${item.image}" alt="${item.name}" />
            </div>
            <div class="cart-item-info">
                <div class="cart-item-name">${item.name}</div>
                <div class="cart-item-price">S/${item.price}</div>
            </div>
            <div class="cart-item-actions">
                <button class="quantity-btn" onclick="updateQuantity(${item.id}, -1)">-</button>
                <span class="quantity">${item.quantity}</span>
                <button class="quantity-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
                <button class="remove-btn" onclick="removeFromCart(${item.id})">Eliminar</button>
            </div>
        </div>
    `
    )
    .join("");

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  cartTotal.textContent = total.toFixed(2);
}

function updateCartCount() {
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);
  document.getElementById("cartCount").textContent = count;
}

// Lista de deseos
function toggleWishlist(product) {
  const index = wishlist.findIndex((item) => item.id === product.id);

  if (index > -1) {
    wishlist.splice(index, 1);
    showNotification(`${product.name} eliminado de la lista de deseos`);
  } else {
    wishlist.push(product);
    showNotification(`${product.name} agregado a la lista de deseos`);
  }

  updateWishlistCount();
  renderProducts(document.getElementById("categoryFilter").value);
  saveToLocalStorage();
}

function removeFromWishlist(productId) {
  wishlist = wishlist.filter((item) => item.id !== productId);
  updateWishlistCount();
  renderWishlist();
  renderProducts(document.getElementById("categoryFilter").value);
  saveToLocalStorage();
}

function renderWishlist() {
  const wishlistItems = document.getElementById("wishlistItems");

  if (wishlist.length === 0) {
    wishlistItems.innerHTML =
      '<div class="empty-message">Tu lista de deseos está vacía</div>';
    return;
  }

  wishlistItems.innerHTML = wishlist
    .map(
      (item) => `
        <div class="wishlist-item">
            <div class="wishlist-item-image"><img src="../assets/uploads/${
              item.image
            }" alt="${item.name}" /></div>
            <div class="wishlist-item-info">
                <div class="wishlist-item-name">${item.name}</div>
                <div class="wishlist-item-price">S/${item.price}</div>
            </div>
            <div class="cart-item-actions">
                <button class="btn btn-primary" onclick="addToCart(${JSON.stringify(
                  item
                ).replace(/"/g, "&quot;")})">
                    Agregar al Carrito
                </button>
                <button class="remove-btn" onclick="removeFromWishlist(${
                  item.id
                })">Eliminar</button>
            </div>
        </div>
    `
    )
    .join("");
}

function updateWishlistCount() {
  document.getElementById("wishlistCount").textContent = wishlist.length;
}

// Event Listeners
function setupEventListeners() {
  document.getElementById("cartBtn").addEventListener("click", () => {
    renderCart();
    document.getElementById("cartModal").classList.add("active");
  });

  document.getElementById("wishlistBtn").addEventListener("click", () => {
    renderWishlist();
    document.getElementById("wishlistModal").classList.add("active");
  });

  document.getElementById("modalClose").addEventListener("click", () => {
    document.getElementById("productModal").classList.remove("active");
  });

  document.getElementById("cartModalClose").addEventListener("click", () => {
    document.getElementById("cartModal").classList.remove("active");
  });

  document
    .getElementById("wishlistModalClose")
    .addEventListener("click", () => {
      document.getElementById("wishlistModal").classList.remove("active");
    });

  document.getElementById("categoryFilter").addEventListener("change", (e) => {
    renderProducts(e.target.value);
  });

  // Cerrar modales al hacer click fuera
  document.querySelectorAll(".modal").forEach((modal) => {
    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        modal.classList.remove("active");
      }
    });
  });
}

// Notificaciones
function showNotification(message) {
  const notification = document.createElement("div");
  notification.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: #111344;
        color: white;
        padding: 1rem 2rem;
        border-radius: 8px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.3);
        z-index: 10000;
        animation: slideIn 0.3s ease;
    `;
  notification.textContent = message;
  document.body.appendChild(notification);

  setTimeout(() => {
    notification.style.animation = "slideOut 0.3s ease";
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

// LocalStorage
function saveToLocalStorage() {
  localStorage.setItem("cart", JSON.stringify(cart));
  localStorage.setItem("wishlist", JSON.stringify(wishlist));
}

function loadFromLocalStorage() {
  const savedCart = localStorage.getItem("cart");
  const savedWishlist = localStorage.getItem("wishlist");

  if (savedCart) {
    cart = JSON.parse(savedCart);
    updateCartCount();
  }

  if (savedWishlist) {
    wishlist = JSON.parse(savedWishlist);
    updateWishlistCount();
  }
}

// Animaciones CSS
const style = document.createElement("style");
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

/***********************
 * CHECKOUT PASO A PASO *
 ***********************/

// ========= Configuración rápida (edítalo a tu gusto) =========
const WHATSAPP_NUMBER = "51999999999"; // Número para coordinar pago en efectivo (formato internacional sin +)
const YAPE_PHONE = "999999999";
const PLIN_PHONE = "999888777";
const BANK_ACCOUNTS = [
  {
    bank: "BCP",
    holder: "TEC RIVERA S.A.C.",
    account: "123-45678901-0-12",
    cci: "002-123-004567890123-45",
  },
  {
    bank: "INTERBANK",
    holder: "TEC RIVERA S.A.C.",
    account: "123-4567890123",
    cci: "003-123-004567890123-45",
  },
];

// ========= Estado interno del checkout =========
let checkoutStep = 1;
let selectedPaymentMethod = null;

// Conecta el botón "Proceder al Pago" del carrito
document.addEventListener("DOMContentLoaded", () => {
  const checkoutBtn = document.getElementById("checkoutBtn");
  if (checkoutBtn) checkoutBtn.addEventListener("click", openCheckout);

  // Cerrar el checkout
  const checkoutClose = document.getElementById("checkoutClose");
  if (checkoutClose) {
    checkoutClose.addEventListener("click", () => {
      document.getElementById("checkoutModal").classList.remove("active");
    });
  }

  // Botones de navegación del wizard
  document.getElementById("prevStepBtn").addEventListener("click", prevStep);
  document.getElementById("nextStepBtn").addEventListener("click", nextStep);

  // Cerrar el modal clic fuera
  const checkoutModal = document.getElementById("checkoutModal");
  if (checkoutModal) {
    checkoutModal.addEventListener("click", (e) => {
      if (e.target === checkoutModal) checkoutModal.classList.remove("active");
    });
  }
});

// Abre el modal de checkout e inicia en el paso 1
function openCheckout() {
  if (cart.length === 0) {
    showNotification("Tu carrito está vacío");
    return;
  }
  checkoutStep = 1;
  selectedPaymentMethod = null;
  updateStepUI();
  renderCheckoutSummary();

  // Cierra el modal del carrito y abre checkout
  document.getElementById("cartModal").classList.remove("active");
  document.getElementById("checkoutModal").classList.add("active");
}

// ------ Paso 1: resumen ------
function renderCheckoutSummary() {
  const wrap = document.getElementById("checkoutSummary");
  const total = cart.reduce((s, it) => s + it.price * it.quantity, 0);
  const itemsHTML = cart
    .map(
      (it) => `
      <div class="co-item">
        <div class="co-item-info">
          <div class="co-name">${it.name}</div>
          <div class="co-qty">x${it.quantity}</div>
        </div>
        <div class="co-price">S/${(it.price * it.quantity).toFixed(2)}</div>
      </div>
    `
    )
    .join("");

  wrap.innerHTML = `
    <div class="co-items">${itemsHTML}</div>
    <div class="co-total">
      <span>Total a pagar</span>
      <strong>S/${total.toFixed(2)}</strong>
    </div>
  `;
}

// ------ Paso 2: método de pago ------
function readSelectedMethod() {
  const form = document.getElementById("paymentMethodForm");
  if (!form) return null;
  const fd = new FormData(form);
  return fd.get("paymentMethod");
}

// ------ Paso 3: vista dinámica por método ------
function renderPaymentMethodView() {
  const view = document.getElementById("paymentMethodView");
  const total = cart.reduce((s, it) => s + it.price * it.quantity, 0);
  const totalText = `S/${total.toFixed(2)}`;

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
        <div class="hint">* Demo: este formulario no procesa pagos reales.</div>
        <button class="btn-primary full" id="payCardBtn">Pagar ${totalText}</button>
      </form>
    `;

    // Handler del botón
    document.getElementById("payCardBtn").addEventListener("click", () => {
      confirmPayment("Tarjeta", total);
    });
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

      <button class="btn-primary full" id="walletConfirmBtn">Ya realicé el pago</button>
    `;

    const renderWallet = () => {
      const type =
        (document.querySelector('input[name="walletType"]:checked') || {})
          .value || "yape";
      const phone = type === "yape" ? YAPE_PHONE : PLIN_PHONE;
      document.getElementById(
        "walletNumber"
      ).innerHTML = `Número ${type.toUpperCase()}: <strong>${phone}</strong>`;

      // QR DEMO (placeholder SVG con monto y número)
      const svg = encodeURIComponent(`
        <svg xmlns='http://www.w3.org/2000/svg' width='180' height='180'>
          <rect width='100%' height='100%' fill='#eee'/>
          <text x='50%' y='45%' font-size='14' text-anchor='middle' fill='#333'>${type.toUpperCase()}</text>
          <text x='50%' y='60%' font-size='12' text-anchor='middle' fill='#333'>${phone}</text>
          <text x='50%' y='75%' font-size='12' text-anchor='middle' fill='#333'>${totalText}</text>
        </svg>
      `);
      document.getElementById(
        "walletQr"
      ).innerHTML = `<img alt="QR ${type}" src="data:image/svg+xml;utf8,${svg}" />`;
    };

    renderWallet();
    document
      .querySelectorAll('input[name="walletType"]')
      .forEach((r) => r.addEventListener("change", renderWallet));

    document
      .getElementById("walletConfirmBtn")
      .addEventListener("click", () => confirmPayment("Billetera (Yape/Plin)", total));
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
        <button class="btn-primary full" id="transferConfirmBtn">He realizado la transferencia</button>
      </div>
    `;

    document
      .getElementById("transferConfirmBtn")
      .addEventListener("click", () =>
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
        <button class="btn-secondary full" id="waConfirmBtn">Ya coordiné por WhatsApp</button>
      </div>
    `;

    document
      .getElementById("waConfirmBtn")
      .addEventListener("click", () =>
        confirmPayment("WhatsApp (efectivo)", total)
      );
  }
}

// ------ Paso 4: confirmación y “cierre” ------
function confirmPayment(method, total) {
  // Demo: simula número de recibo
  const receipt = "TR-" + Math.random().toString(36).slice(2, 8).toUpperCase();
  const details = `
    <div><strong>Método:</strong> ${method}</div>
    <div><strong>Total:</strong> S/${total.toFixed(2)}</div>
    <div><strong>Recibo:</strong> ${receipt}</div>
  `;

  document.getElementById("receiptBox").innerHTML = details;
  document.getElementById("confirmationText").textContent =
    "Gracias. Tu pedido fue registrado correctamente (demo).";

  // Vaciar carrito y refrescar
  cart = [];
  updateCartCount();
  renderCart();
  saveToLocalStorage();

  checkoutStep = 4;
  updateStepUI();
}

// ------ Navegación entre pasos ------
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
    // En métodos con botón propio no hacemos nada aquí.
    showNotification("Usa el botón de confirmar/pagar del método elegido");
    return;
  }

  if (checkoutStep === 4) {
    // Cerrar checkout
    document.getElementById("checkoutModal").classList.remove("active");
  }
}

function prevStep() {
  if (checkoutStep <= 1) {
    document.getElementById("checkoutModal").classList.remove("active");
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
  // Panels
  ["step1", "step2", "step3", "step4"].forEach((id, idx) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.classList.toggle("hidden", checkoutStep !== idx + 1);
  });

  // Indicadores
  document.querySelectorAll(".step-indicator").forEach((el) => {
    const step = Number(el.getAttribute("data-step"));
    el.classList.toggle("active", step === checkoutStep);
    el.classList.toggle("done", step < checkoutStep);
  });

  // Botones
  const prevBtn = document.getElementById("prevStepBtn");
  const nextBtn = document.getElementById("nextStepBtn");

  prevBtn.style.display = checkoutStep === 1 ? "none" : "inline-flex";
  nextBtn.textContent =
    checkoutStep === 4 ? "Cerrar" : checkoutStep === 3 ? "Siguiente" : "Siguiente";
}

// ========= Estilos mínimos del checkout (inyectados) =========
const coStyle = document.createElement("style");
coStyle.textContent = `
  .modal-lg { max-width: 900px; width: 95%; }
  .checkout { display: flex; flex-direction: column; gap: 1rem; }
  .steps { display: grid; grid-template-columns: repeat(4,1fr); gap: .5rem; }
  .step-indicator { 
    text-align: center; padding: .6rem; border-radius: 10px; 
    background: #f2f3f7; color: #555; font-weight: 600; 
    border: 1px solid #e3e6ef;
  }
  .step-indicator.active { background: #111344; color: #fff; border-color: #111344; }
  .step-indicator.done { background: #dce3ff; color: #111344; border-color: #b9c5ff; }
  .steps-body { min-height: 260px; }
  .step-panel.hidden { display: none; }

  .steps-actions { display: flex; justify-content: space-between; gap: .75rem; }
  .btn-primary.full, .btn-secondary.full { width: 100%; }

  .co-items { display: flex; flex-direction: column; gap: .5rem; margin-bottom: .75rem; }
  .co-item { display: flex; justify-content: space-between; align-items: center; padding: .5rem .75rem; border: 1px solid #e9e9f1; border-radius: 10px; }
  .co-item-info { display: flex; gap: .5rem; align-items: baseline; }
  .co-name { font-weight: 600; }
  .co-qty { color: #666; font-size: .9rem; }
  .co-price { font-weight: 700; }
  .co-total { display: flex; justify-content: space-between; padding-top: .5rem; border-top: 1px dashed #ddd; font-size: 1.1rem; }

  .payment-methods { display: grid; grid-template-columns: repeat(auto-fit,minmax(220px,1fr)); gap: .75rem; }
  .payment-card { border: 1px solid #e3e6ef; border-radius: 12px; padding: .75rem; display: flex; gap: .6rem; cursor: pointer; }
  .payment-card:hover { border-color: #b9c5ff; box-shadow: 0 2px 10px rgba(0,0,0,.04); }
  .payment-card input { margin-top: .3rem; }
  .payment-card-body .title { font-weight: 700; }
  .payment-card-body .desc { color: #666; font-size: .9rem; }

  .form-grid { display: flex; flex-direction: column; gap: .75rem; }
  .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: .75rem; }
  .form-field { display: flex; flex-direction: column; gap: .3rem; }
  .form-field input, .form-field select, .form-field textarea { 
    padding: .7rem .9rem; border: 1px solid #e3e6ef; border-radius: 10px; outline: none; 
  }
  .form-field input:focus { border-color: #b9c5ff; }
  .hint { color: #667085; font-size: .88rem; }

  .wallet-chooser { display: flex; gap: 1rem; margin-bottom: .75rem; }
  .wallet-box { display: grid; grid-template-columns: 1fr 180px; gap: 1rem; align-items: center; }
  .wallet-qr img { width: 180px; height: 180px; border-radius: 8px; border: 1px solid #e3e6ef; }

  .bank-card { border: 1px solid #e3e6ef; border-radius: 12px; padding: .75rem; margin-bottom: .6rem; }
  .bank-title { font-weight: 800; margin-bottom: .25rem; }
  .voucher { display: flex; gap: .5rem; align-items: center; margin-top: .5rem; }

  .wa-wrap p { margin-bottom: .75rem; }

  .receipt-box { margin-top: .75rem; border: 1px dashed #b9c5ff; padding: .75rem; border-radius: 10px; background: #f7f9ff; }
`;
document.head.appendChild(coStyle);

/***********************
 * FIN CHECKOUT        *
 ***********************/
