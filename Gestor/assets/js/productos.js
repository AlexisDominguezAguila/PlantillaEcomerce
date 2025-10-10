// Data Storage
let products = [];
let currentPage = 1;
let itemsPerPage = 6;
let editingProductId = null;
let currentView = "grid";
let uploadedImages = [];

// Initialize
document.addEventListener("DOMContentLoaded", function () {
  loadSampleData();
  renderProducts();
  updateStats();
  setupEventListeners();
});

// Setup Event Listeners
function setupEventListeners() {
  document
    .getElementById("searchInput")
    .addEventListener("input", filterProducts);
  document
    .getElementById("categoryFilter")
    .addEventListener("change", filterProducts);
  document
    .getElementById("statusFilter")
    .addEventListener("change", filterProducts);
  document
    .getElementById("tagFilter")
    .addEventListener("change", filterProducts);
  document
    .getElementById("productForm")
    .addEventListener("submit", handleFormSubmit);
}

// Load Sample Data
function loadSampleData() {
  products = [
    {
      id: 1,
      name: "Laptop HP Pavilion 15",
      category: "Electrónica",
      sku: "TEC-001",
      price: 899.99,
      oldPrice: 1099.99,
      stock: 15,
      minStock: 5,
      description:
        "Laptop potente con procesador Intel Core i7, 16GB RAM y 512GB SSD",
      active: true,
      isNew: true,
      isHot: false,
      isOffer: true,
      images: [
        "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400",
      ],
    },
    {
      id: 2,
      name: "Auriculares Sony WH-1000XM5",
      category: "Electrónica",
      sku: "TEC-002",
      price: 349.99,
      oldPrice: null,
      stock: 20,
      minStock: 5,
      description:
        "Auriculares premium con cancelación de ruido líder en la industria",
      active: true,
      isNew: true,
      isHot: true,
      isOffer: false,
      images: [
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400",
      ],
    },
    {
      id: 3,
      name: "Smartwatch Samsung Galaxy Watch",
      category: "Electrónica",
      sku: "TEC-003",
      price: 299.99,
      oldPrice: 349.99,
      stock: 12,
      minStock: 4,
      description: "Reloj inteligente con monitor de salud y GPS integrado",
      active: true,
      isNew: true,
      isHot: true,
      isOffer: true,
      images: [
        "https://images.samsung.com/is/image/samsung/p6pim/pe/2407/gallery/pe-galaxy-watch7-l310-sm-l310nzsalta-542358243?$684_547_PNG$",
      ],
    },
    {
      id: 4,
      name: "Tablet Apple iPad Air",
      category: "Electrónica",
      sku: "TEC-004",
      price: 599.99,
      oldPrice: 699.99,
      stock: 8,
      minStock: 3,
      description: "Tablet ligera y potente con pantalla Retina y chip M1",
      active: true,
      isNew: false,
      isHot: false,
      isOffer: true,
      images: [
        "https://mac-center.com.pe/cdn/shop/files/iPad_Air_11_M2_WiFi_Space_Gray_PDP_Image_Position_2__COES_f17a0230-cdce-4191-b0d9-12f32ace5de6.jpg?v=1720075415&width=823",
      ],
    },
    {
      id: 5,
      name: "Monitor LG UltraWide 34''",
      category: "Electrónica",
      sku: "TEC-005",
      price: 449.99,
      oldPrice: 499.99,
      stock: 10,
      minStock: 2,
      description: "Monitor panorámico para productividad y gaming",
      active: false,
      isNew: false,
      isHot: false,
      isOffer: true,
      images: [
        "https://www.kabifperu.com/imagenes/prod-06022021202531-monitor-lg-led-34-34uc79g-b-gaming-curvo-2-hdmi-dp-2-usb-2560x1080-1ms-144hz-deta.png",
      ],
    },
    {
      id: 6,
      name: "Teclado Mecánico Logitech G Pro",
      category: "Electrónica",
      sku: "TEC-006",
      price: 129.99,
      oldPrice: null,
      stock: 25,
      minStock: 5,
      description: "Teclado mecánico profesional para gaming y productividad",
      active: true,
      isNew: true,
      isHot: false,
      isOffer: false,
      images: [
        "https://www.impacto.com.pe/storage/products/md/173834505497890.webp",
      ],
    },
    {
      id: 7,
      name: "Mouse Inalámbrico Razer Basilisk",
      category: "Electrónica",
      sku: "TEC-007",
      price: 89.99,
      oldPrice: 119.99,
      stock: 35,
      minStock: 15,
      description:
        "Mouse inalámbrico ergonómico con sensor óptico de alta precisión",
      active: true,
      isNew: false,
      isHot: true,
      isOffer: true,
      images: [
        "https://assets2.razerzone.com/images/pnx.assets/b2ab0e9be26141d4677cae0f2d38cb88/razer-basilisk-x-hyperspeed-hero-mobile.jpg",
      ],
    },
  ];
}

// Render Products
function renderProducts() {
  const filteredProducts = getFilteredProducts();
  const paginatedProducts = getPaginatedProducts(filteredProducts);

  if (currentView === "grid") {
    renderGridView(paginatedProducts);
  } else {
    renderTableView(paginatedProducts);
  }

  renderPagination(filteredProducts.length);
  updateProductsCount(filteredProducts.length);

  // Show empty state if no products
  document.getElementById("emptyState").style.display =
    filteredProducts.length === 0 ? "block" : "none";
  document.getElementById("productsGrid").style.display =
    filteredProducts.length === 0 ? "none" : "grid";
  document.getElementById("pagination").style.display =
    filteredProducts.length === 0 ? "none" : "flex";
}

// Render Grid View
function renderGridView(products) {
  const grid = document.getElementById("productsGrid");
  grid.innerHTML = products
    .map(
      (product) => `
                <div class="product-card">
                    <div class="product-image">
                        <img src="${product.images[0]}" alt="${product.name}">
                        <div class="product-badges">
                            ${
                              product.isNew
                                ? '<span class="badge badge-new">Nuevo</span>'
                                : ""
                            }
                            ${
                              product.isHot
                                ? '<span class="badge badge-hot">Hot</span>'
                                : ""
                            }
                            ${
                              product.isOffer
                                ? '<span class="badge badge-offer">Oferta</span>'
                                : ""
                            }
                        </div>
                        <div class="product-status ${
                          product.active ? "active" : "inactive"
                        }"></div>
                    </div>
                    <div class="product-info">
                        <div class="product-category">${product.category}</div>
                        <h3 class="product-name">${product.name}</h3>
                        <p class="product-description">${
                          product.description
                        }</p>
                        <div class="product-meta">
                            <div class="product-price">
                                <span class="price-current">S/${product.price.toFixed(
                                  2
                                )}</span>
                                ${
                                  product.oldPrice
                                    ? `<span class="price-old">S/${product.oldPrice.toFixed(
                                        2
                                      )}</span>`
                                    : ""
                                }
                            </div>
                            <div class="product-stock">
                                <span class="stock-badge ${getStockClass(
                                  product
                                )}">
                                    ${product.stock} unid.
                                </span>
                            </div>
                        </div>
                        <div class="product-actions">
                            <button class="action-btn edit" onclick="editProduct(${
                              product.id
                            })">
                                <i class='bx bx-edit'></i>
                            </button>
                            <button class="action-btn delete" onclick="deleteProduct(${
                              product.id
                            })">
                                <i class='bx bx-trash'></i>
                            </button>
                        </div>
                    </div>
                </div>
            `
    )
    .join("");
}

// Render Table View
function renderTableView(products) {
  const tbody = document.getElementById("productsTableBody");
  tbody.innerHTML = products
    .map(
      (product) => `
                <tr>
                    <td>
                        <img src="${product.images[0]}" alt="${
        product.name
      }" class="table-product-img">
                    </td>
                    <td>
                        <strong>${product.name}</strong><br>
                        <small style="color: var(--muted);">SKU: ${
                          product.sku
                        }</small>
                    </td>
                    <td>${product.category}</td>
                    <td>
                        <strong style="color: var(--primary);">S/${product.price.toFixed(
                          2
                        )}</strong>
                        ${
                          product.oldPrice
                            ? `<br><small style="text-decoration: line-through; color: var(--muted);">S/${product.oldPrice.toFixed(
                                2
                              )}</small>`
                            : ""
                        }
                    </td>
                    <td>
                        <span class="stock-badge ${getStockClass(product)}">
                            ${product.stock} unid.
                        </span>
                    </td>
                    <td>
                        <span class="badge ${
                          product.active ? "badge-new" : ""
                        }" style="background: ${
        product.active ? "var(--success)" : "var(--muted)"
      };">
                            ${product.active ? "Activo" : "Inactivo"}
                        </span>
                    </td>
                    <td>
                        <div class="table-badges">
                            ${
                              product.isNew
                                ? '<span class="badge badge-new">Nuevo</span>'
                                : ""
                            }
                            ${
                              product.isHot
                                ? '<span class="badge badge-hot">Hot</span>'
                                : ""
                            }
                            ${
                              product.isOffer
                                ? '<span class="badge badge-offer">Oferta</span>'
                                : ""
                            }
                        </div>
                    </td>
                    <td>
                        <div style="display: flex; gap: 0.5rem;">
                            <button class="action-btn edit btn-sm" onclick="editProduct(${
                              product.id
                            })">
                                <i class='bx bx-edit'></i>
                            </button>
                            <button class="action-btn delete btn-sm" onclick="deleteProduct(${
                              product.id
                            })">
                                <i class='bx bx-trash'></i>
                            </button>
                        </div>
                    </td>
                </tr>
            `
    )
    .join("");
}

// Get Stock Class
function getStockClass(product) {
  if (product.stock === 0) return "out-stock";
  if (product.stock <= product.minStock) return "low-stock";
  return "in-stock";
}

// Filter Products
function getFilteredProducts() {
  const search = document.getElementById("searchInput").value.toLowerCase();
  const category = document.getElementById("categoryFilter").value;
  const status = document.getElementById("statusFilter").value;
  const tag = document.getElementById("tagFilter").value;

  return products.filter((product) => {
    const matchSearch =
      product.name.toLowerCase().includes(search) ||
      product.sku.toLowerCase().includes(search);
    const matchCategory = !category || product.category === category;
    const matchStatus =
      !status || (status === "active" ? product.active : !product.active);
    const matchTag =
      !tag ||
      (tag === "new" && product.isNew) ||
      (tag === "hot" && product.isHot) ||
      (tag === "offer" && product.isOffer);

    return matchSearch && matchCategory && matchStatus && matchTag;
  });
}

// Paginate Products
function getPaginatedProducts(products) {
  const start = (currentPage - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return products.slice(start, end);
}

// Render Pagination
function renderPagination(totalItems) {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const pagination = document.getElementById("pagination");

  if (totalPages <= 1) {
    pagination.innerHTML = "";
    return;
  }

  let html = `
                <button class="pagination-btn" onclick="changePage(${
                  currentPage - 1
                })" ${currentPage === 1 ? "disabled" : ""}>
                    <i class='bx bx-chevron-left'></i>
                </button>
            `;

  for (let i = 1; i <= totalPages; i++) {
    if (
      i === 1 ||
      i === totalPages ||
      (i >= currentPage - 1 && i <= currentPage + 1)
    ) {
      html += `
                        <button class="pagination-btn ${
                          i === currentPage ? "active" : ""
                        }" onclick="changePage(${i})">
                            ${i}
                        </button>
                    `;
    } else if (i === currentPage - 2 || i === currentPage + 2) {
      html +=
        '<span style="padding: 0 0.5rem; color: var(--muted);">...</span>';
    }
  }

  html += `
                <button class="pagination-btn" onclick="changePage(${
                  currentPage + 1
                })" ${currentPage === totalPages ? "disabled" : ""}>
                    <i class='bx bx-chevron-right'></i>
                </button>
            `;

  pagination.innerHTML = html;
}

// Change Page
function changePage(page) {
  currentPage = page;
  renderProducts();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

// Filter Products
function filterProducts() {
  currentPage = 1;
  renderProducts();
}

// Update Products Count
function updateProductsCount(count) {
  document.getElementById("productsCount").textContent = count;
}

// Update Stats
function updateStats() {
  document.getElementById("totalProducts").textContent = products.length;
  document.getElementById("activeProducts").textContent = products.filter(
    (p) => p.active
  ).length;
  document.getElementById("lowStockProducts").textContent = products.filter(
    (p) => p.stock <= p.minStock
  ).length;
  document.getElementById("offerProducts").textContent = products.filter(
    (p) => p.isOffer
  ).length;
}

// Cambiar vista entre Grid y Tabla
function changeView(view) {
  currentView = view;

  // Actualiza los botones de vista
  document
    .querySelectorAll(".view-btn")
    .forEach((btn) => btn.classList.remove("active"));
  const activeBtn = document.querySelector(
    `.view-btn[onclick="changeView('${view}')"]`
  );
  if (activeBtn) activeBtn.classList.add("active");

  // Referencias a contenedores
  const grid = document.getElementById("productsGrid");
  const table = document.getElementById("productsTable");

  if (view === "grid") {
    grid.classList.remove("hidden");
    table.classList.add("hidden");
    table.classList.remove("active");
  } else {
    table.classList.add("active");
    table.classList.remove("hidden");
    grid.classList.add("hidden");
  }

  // Renderizar productos de acuerdo a la vista actual
  renderProducts();
}

// Modal Functions
function openModal(productId = null) {
  editingProductId = productId;
  const modal = document.getElementById("productModal");
  const form = document.getElementById("productForm");

  if (productId) {
    const product = products.find((p) => p.id === productId);
    document.getElementById("modalTitle").textContent = "Editar Producto";
    fillForm(product);
  } else {
    document.getElementById("modalTitle").textContent = "Nuevo Producto";
    form.reset();
    uploadedImages = [];
    document.getElementById("imagePreviewGrid").innerHTML = "";
  }

  modal.classList.add("active");
  document.body.style.overflow = "hidden";
}

function closeModal() {
  document.getElementById("productModal").classList.remove("active");
  document.body.style.overflow = "auto";
  editingProductId = null;
  uploadedImages = [];
}

function fillForm(product) {
  document.getElementById("productName").value = product.name;
  document.getElementById("productCategory").value = product.category;
  document.getElementById("productSKU").value = product.sku;
  document.getElementById("productPrice").value = product.price;
  document.getElementById("productOldPrice").value = product.oldPrice || "";
  document.getElementById("productStock").value = product.stock;
  document.getElementById("productMinStock").value = product.minStock;
  document.getElementById("productDescription").value = product.description;
  document.getElementById("productActive").checked = product.active;
  document.getElementById("productNew").checked = product.isNew;
  document.getElementById("productHot").checked = product.isHot;
  document.getElementById("productOffer").checked = product.isOffer;

  uploadedImages = [...product.images];
  renderImagePreviews();
}

// Handle Form Submit
function handleFormSubmit(e) {
  e.preventDefault();

  const productData = {
    name: document.getElementById("productName").value,
    category: document.getElementById("productCategory").value,
    sku: document.getElementById("productSKU").value,
    price: parseFloat(document.getElementById("productPrice").value),
    oldPrice:
      parseFloat(document.getElementById("productOldPrice").value) || null,
    stock: parseInt(document.getElementById("productStock").value),
    minStock: parseInt(document.getElementById("productMinStock").value) || 5,
    description: document.getElementById("productDescription").value,
    active: document.getElementById("productActive").checked,
    isNew: document.getElementById("productNew").checked,
    isHot: document.getElementById("productHot").checked,
    isOffer: document.getElementById("productOffer").checked,
    images:
      uploadedImages.length > 0
        ? uploadedImages
        : ["https://via.placeholder.com/400"],
  };

  if (editingProductId) {
    // Update existing product
    const index = products.findIndex((p) => p.id === editingProductId);
    products[index] = { ...products[index], ...productData };
    showAlert("Producto actualizado exitosamente", "success");
  } else {
    // Create new product
    const newProduct = {
      id: products.length > 0 ? Math.max(...products.map((p) => p.id)) + 1 : 1,
      ...productData,
    };
    products.push(newProduct);
    showAlert("Producto creado exitosamente", "success");
  }

  closeModal();
  renderProducts();
  updateStats();
}

// Edit Product
function editProduct(id) {
  openModal(id);
}

// Delete Product
function deleteProduct(id) {
  if (confirm("¿Estás seguro de que deseas eliminar este producto?")) {
    products = products.filter((p) => p.id !== id);
    showAlert("Producto eliminado exitosamente", "success");
    renderProducts();
    updateStats();
  }
}

// Handle Image Upload
function handleImageUpload(event) {
  const files = event.target.files;

  for (let file of files) {
    if (file.size > 5 * 1024 * 1024) {
      showAlert("La imagen es demasiado grande (máx. 5MB)", "error");
      continue;
    }

    const reader = new FileReader();
    reader.onload = function (e) {
      uploadedImages.push(e.target.result);
      renderImagePreviews();
    };
    reader.readAsDataURL(file);
  }
}

// Render Image Previews
function renderImagePreviews() {
  const grid = document.getElementById("imagePreviewGrid");
  grid.innerHTML = uploadedImages
    .map(
      (img, index) => `
                <div class="image-preview-item">
                    <img src="${img}" alt="Preview ${index + 1}">
                    <button type="button" class="image-preview-remove" onclick="removeImage(${index})">
                        <i class='bx bx-x'></i>
                    </button>
                </div>
            `
    )
    .join("");
}

// Remove Image
function removeImage(index) {
  uploadedImages.splice(index, 1);
  renderImagePreviews();
}

// Show Alert
function showAlert(message, type = "success") {
  const alert = document.createElement("div");
  alert.className = `alert alert-${type}`;

  const icon =
    type === "success"
      ? "bx-check-circle"
      : type === "error"
      ? "bx-error-circle"
      : type === "warning"
      ? "bx-error"
      : "bx-info-circle";

  alert.innerHTML = `
                <i class='bx ${icon}'></i>
                <span>${message}</span>
            `;

  document.body.appendChild(alert);

  setTimeout(() => {
    alert.style.animation = "alertSlideIn 0.3s ease reverse";
    setTimeout(() => alert.remove(), 300);
  }, 3000);
}

// Close modal on outside click
document.getElementById("productModal").addEventListener("click", function (e) {
  if (e.target === this) {
    closeModal();
  }
});

// Keyboard shortcuts
document.addEventListener("keydown", function (e) {
  if (e.key === "Escape") {
    closeModal();
  }
});
