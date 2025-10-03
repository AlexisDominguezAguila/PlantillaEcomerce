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
  initSlider(); // <-- aquí llamas algo que no existe todavía
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
                    <div class="product-price">$${product.price}</div>
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
                <div class="product-detail-price">$${product.price}</div>
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
            <div class="cart-item-image">${item.icon}</div>
            <div class="cart-item-info">
                <div class="cart-item-name">${item.name}</div>
                <div class="cart-item-price">$${item.price}</div>
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
                <div class="wishlist-item-price">$${item.price}</div>
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
