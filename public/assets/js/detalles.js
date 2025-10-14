(function () {
  document.addEventListener("DOMContentLoaded", () => {
    // Inicializa los iconos Lucide
    if (typeof lucide !== "undefined") lucide.createIcons();

    /* -------------------------------------------
    Datos del producto actual (demo)
    ------------------------------------------- */
    const PRODUCTO_DETALLE = {
      id: 101,
      brand: "LENOVO",
      category: "Laptops",
      name: 'Laptop Lenovo Ideapad SLIM 3 15IAH8 15.6", Intel Core i5-12450H, 512GB SSD, 8GB RAM, Windows 11 Home, azul',
      images: [
        "/api/placeholder/600/600",
        "/api/placeholder/600/600",
        "/api/placeholder/600/600",
      ],
      originalPrice: 2409.0,
      currentPrice: 1849.0,
      discount: 23,
      stock: 8,
      rating: 4.5,
      reviews: 127,
      specs: [
        { label: "Tamaño de pantalla", value: '15.6"' },
        { label: "Procesador", value: "Intel Core i5" },
        { label: "Detalle del procesador", value: "Intel Core i5-12450H" },
        { label: "Memoria RAM", value: "8 GB" },
        { label: "Capacidad SSD", value: "512 GB" },
      ],
      shipping: { location: "San Isidro", cost: 9.9, delivery: "Mañana" },
      seller: { name: "Mac Center Peru Sac", rating: 5.0 },
      image: "laptop.png", // imagen referencial para carrito
      description: "Laptop versátil con excelente rendimiento y diseño delgado.",
      price: 1849,
    };

    const PRODUCTOS_RELACIONADOS = [
      { id: 1, name: "Base Enfriadora", price: 89, image: "/api/placeholder/150/150" },
      { id: 2, name: "Mouse Inalámbrico", price: 45, image: "/api/placeholder/150/150" },
      { id: 3, name: "Audífonos Bluetooth", price: 120, image: "/api/placeholder/150/150" },
    ];

    const CURRENCY_SYMBOL = "S/";

    /* -------------------------------------------
    Acceso a datos globales del carrito/wishlist
    (comparten almacenamiento con productos.js)
    ------------------------------------------- */
    let cart = [];
    let wishlist = [];

    try {
      cart = JSON.parse(localStorage.getItem("cart") || "[]");
      wishlist = JSON.parse(localStorage.getItem("wishlist") || "[]");
    } catch {
      cart = [];
      wishlist = [];
    }

    const guardarDatos = () => {
      localStorage.setItem("cart", JSON.stringify(cart));
      localStorage.setItem("wishlist", JSON.stringify(wishlist));
    };

    /* -------------------------------------------
      Notificación rápida tipo toast
    ------------------------------------------- */
    const notificar = (mensaje) => {
      const alerta = document.createElement("div");
      alerta.textContent = mensaje;
      alerta.style.cssText = `
        position:fixed;bottom:20px;right:20px;background:#111344;color:#fff;
        padding:1rem 1.25rem;border-radius:10px;font-weight:600;
        box-shadow:0 10px 25px rgba(0,0,0,.25);z-index:9999;
        animation:fadeIn .3s ease;
      `;
      document.body.appendChild(alerta);
      setTimeout(() => alerta.remove(), 2500);
    };

    /* -------------------------------------------
      Funciones locales: carrito + wishlist
      (usa el mismo almacenamiento que productos.js)
    ------------------------------------------- */
    const agregarAlCarrito = (prod) => {
      const existe = cart.find((i) => i.id === prod.id);
      if (existe) existe.quantity += 1;
      else cart.push({ ...prod, quantity: 1 });
      guardarDatos();
      notificar(`${prod.name} agregado al carrito`);
      // Actualiza contador global si productos.js está cargado
      if (typeof updateCartCount === "function") updateCartCount();
    };

    const alternarFavorito = (prod, icono) => {
      const index = wishlist.findIndex((w) => w.id === prod.id);
      if (index > -1) {
        wishlist.splice(index, 1);
        notificar(`${prod.name} eliminado de favoritos`);
        icono.classList.remove("fill-red-500", "text-red-500");
        icono.classList.add("text-gray-400");
      } else {
        wishlist.push(prod);
        notificar(`${prod.name} agregado a favoritos`);
        icono.classList.remove("text-gray-400");
        icono.classList.add("fill-red-500", "text-red-500");
      }
      guardarDatos();
      if (typeof updateWishlistCount === "function") updateWishlistCount();
    };

    /* -------------------------------------------
      Render dinámico de la vista
    ------------------------------------------- */
    const p = PRODUCTO_DETALLE;

    const el = (id) => document.getElementById(id);
    el("breadcrumb-name").textContent = p.name;
    el("brand").textContent = p.brand;
    el("name").textContent = p.name;
    el("sku").textContent = "SKU: " + p.id;

    el("prices").innerHTML = `
      <span class="text-3xl font-bold text-gray-900">${CURRENCY_SYMBOL} ${p.currentPrice.toFixed(2)}</span>
      <span class="text-lg text-gray-400 line-through">${CURRENCY_SYMBOL} ${p.originalPrice.toFixed(2)}</span>
      <span class="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold">${p.discount}% DSCTO</span>
    `;

    el("shipping").innerHTML = `
      <div class="flex items-center gap-3 mb-2">
        <i data-lucide="truck" class="w-5 h-5 text-blue-600"></i>
        <div>
          <div class="font-semibold text-gray-900">
            Recíbelo ${p.shipping.delivery} en ${p.shipping.location}
          </div>
          <div class="text-sm text-gray-600">Envío desde ${CURRENCY_SYMBOL} ${p.shipping.cost.toFixed(2)}</div>
        </div>
      </div>
    `;

    el("stock").textContent = `¡Menos de ${p.stock} unidades disponibles!`;

    /* ----------- Galería ----------- */
    const thumbs = el("thumbs");
    const mainImg = el("main-img");
    let indice = 0;
    const actualizarImagen = () => (mainImg.src = p.images[indice]);
    actualizarImagen();

    p.images.forEach((src, i) => {
      const btn = document.createElement("button");
      btn.className = `w-20 h-20 rounded-lg overflow-hidden border-2 ${i === 0 ? "border-blue-500 shadow-md" : "border-gray-200"}`;
      btn.innerHTML = `<img src="${src}" class="w-full h-full object-cover"/>`;
      btn.addEventListener("click", () => {
        indice = i;
        actualizarImagen();
        thumbs.querySelectorAll("button").forEach((b) => (b.className = "w-20 h-20 rounded-lg overflow-hidden border-2 border-gray-200"));
        btn.className = "w-20 h-20 rounded-lg overflow-hidden border-2 border-blue-500 shadow-md";
      });
      thumbs.appendChild(btn);
    });

    el("prev-img").addEventListener("click", () => {
      indice = (indice - 1 + p.images.length) % p.images.length;
      actualizarImagen();
    });
    el("next-img").addEventListener("click", () => {
      indice = (indice + 1) % p.images.length;
      actualizarImagen();
    });

    /* ----------- Favorito ----------- */
    const favIcon = el("fav-btn").querySelector("i");
    const esFavorito = wishlist.some((w) => w.id === p.id);
    if (esFavorito) favIcon.classList.add("fill-red-500", "text-red-500");
    el("fav-btn").addEventListener("click", () => alternarFavorito(p, favIcon));

    /* ----------- Cantidad ----------- */
    let cantidad = 1;
    const inputCantidad = el("quantity");
    el("increment").addEventListener("click", () => {
      if (cantidad < p.stock) cantidad++;
      inputCantidad.value = cantidad;
    });
    el("decrement").addEventListener("click", () => {
      if (cantidad > 1) cantidad--;
      inputCantidad.value = cantidad;
    });

    /* ----------- Botón agregar al carrito ----------- */
    document.querySelectorAll(".btn-add-cart").forEach((b) =>
      b.addEventListener("click", () => agregarAlCarrito(p))
    );

    /* ----------- Botón comprar ahora (checkout global) ----------- */
    el("checkoutBtn")?.addEventListener("click", () => {
      agregarAlCarrito(p);
      if (typeof openCheckout === "function") openCheckout();
    });

    /* ----------- Especificaciones ----------- */
    el("specs").innerHTML = `
      <h2 class="text-2xl font-bold mb-6">Acerca del producto</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        ${p.specs
          .map(
            (s) =>
              `<div class="flex justify-between py-3 border-b border-gray-100">
                <span class="text-gray-600">${s.label}:</span>
                <span class="font-semibold text-gray-900">${s.value}</span>
              </div>`
          )
          .join("")}
      </div>
    `;

    /* ----------- Vendedor ----------- */
    el("seller").innerHTML = `
      <div class="flex items-center justify-between">
        <div>
          <div class="text-sm text-gray-600">Vendido por</div>
          <div class="font-semibold text-gray-900">${p.seller.name}</div>
        </div>
        <div class="flex items-center gap-1 bg-green-100 px-3 py-1 rounded-full">
          <i data-lucide="star" class="w-4 h-4 fill-green-600 text-green-600"></i>
          <span class="font-semibold text-green-700">${p.seller.rating}</span>
        </div>
      </div>
    `;

    /* ----------- Productos relacionados ----------- */
    const rel = el("related");
    if (rel) {
      rel.innerHTML = `
        <h2 class="text-2xl font-bold mb-6">¡Haz tu compra aún mejor!</h2>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          ${PRODUCTOS_RELACIONADOS.map(
            (item) => `
          <div class="border border-gray-200 rounded-xl p-4 hover:shadow-lg transition-all cursor-pointer group">
            <div class="aspect-square bg-gray-100 rounded-lg mb-3 overflow-hidden">
              <img src="${item.image}" class="w-full h-full object-contain group-hover:scale-105 transition-transform" />
            </div>
            <h3 class="font-medium text-sm mb-2 text-gray-900">${item.name}</h3>
            <div class="font-bold text-lg text-blue-600">${CURRENCY_SYMBOL} ${item.price}</div>
            <button class="btn-relacionado bg-blue-50 hover:bg-blue-100 text-blue-600 font-medium py-2 rounded-lg flex items-center justify-center gap-1">
              <i data-lucide="plus" class="w-4 h-4"></i> Agregar
            </button>
          </div>`
          ).join("")}
        </div>
      `;

      rel.querySelectorAll(".btn-relacionado").forEach((b, i) =>
        b.addEventListener("click", () => agregarAlCarrito(PRODUCTOS_RELACIONADOS[i]))
      );
    }

    // Reactiva los iconos Lucide
    if (typeof lucide !== "undefined") lucide.createIcons();
  });
})();
