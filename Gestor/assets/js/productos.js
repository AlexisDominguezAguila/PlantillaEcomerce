// Data Storage
let products = [];
const API_URL = "../controllers/ProductoController.php";

const UPLOAD_PATH = "public/uploads/productos/"; // para previsualización o paths locales

let currentPage = 1;
let itemsPerPage = 6;
let editingProductId = null;
let currentView = "grid";
let uploadedImages = [];

// Inicializar desde el backend
document.addEventListener("DOMContentLoaded", function () {
  cargarProductos();
  cargarCategoriasFiltro();
  updateStats();
  setupEventListeners();
});

async function cargarProductos() {
  try {
    const res = await fetch(`${API_URL}?action=listar`);
    const data = await res.json();

    products = data.map((p) => ({
      id: parseInt(p.id),
      name: p.name,
      category: p.category_name,
      sku: p.sku,
      price: parseFloat(p.price),
      oldPrice: p.old_price ? parseFloat(p.old_price) : null,
      stock: parseInt(p.stock),
      minStock: parseInt(p.min_stock),
      description: p.description,
      active: p.active == 1,
      isNew: p.is_new == 1,
      isHot: p.is_hot == 1,
      isOffer: p.is_offer == 1,
      images: p.image_urls
        ? p.image_urls.split(",").map((img) => `../../public/uploads/productos/${img}`)
        : ["../../public/uploads/productos/no-image.png"],
    }));

    renderProducts();
  } catch (error) {
    console.error("Error cargando productos:", error);
    showAlert("Error cargando productos desde el servidor", "error");
  }
}


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
// Cargar categorías desde el backend y llenar el select
async function cargarCategorias() {
  const select = document.getElementById("productCategory");
  select.innerHTML = `<option value="">Cargando categorías...</option>`;

  try {
    const res = await fetch(`${API_URL}?action=categorias`);
    const data = await res.json();

    if (!data || data.length === 0) {
      select.innerHTML = `<option value="">No hay categorías</option>`;
      return;
    }

    select.innerHTML = `<option value="">Seleccionar categoría</option>`;
    data.forEach((cat) => {
      const option = document.createElement("option");
      option.value = cat.id;
      option.textContent = cat.name;
      select.appendChild(option);
    });
  } catch (error) {
    console.error("Error cargando categorías:", error);
    select.innerHTML = `<option value="">Error al cargar categorías</option>`;
  }
}
async function cargarCategoriasFiltro() {
  const filterSelect = document.getElementById("categoryFilter");
  filterSelect.innerHTML = `<option value="">Todas las categorías</option>`;

  try {
    const res = await fetch(`${API_URL}?action=categorias`);
    const data = await res.json();

    data.forEach((cat) => {
      const option = document.createElement("option");
      option.value = cat.name; // ⚠️ O usa cat.id si filtras por id en tus productos
      option.textContent = cat.name;
      filterSelect.appendChild(option);
    });
  } catch (error) {
    console.error("Error cargando categorías del filtro:", error);
  }
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

  // Cargar categorías antes de mostrar el modal
  cargarCategorias();

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
async function handleFormSubmit(e) {
  e.preventDefault();

  const form = document.getElementById("productForm");
  const formData = new FormData(form);

  // flags
  formData.append("active", document.getElementById("productActive").checked ? 1 : 0);
  formData.append("is_new", document.getElementById("productNew").checked ? 1 : 0);
  formData.append("is_hot", document.getElementById("productHot").checked ? 1 : 0);
  formData.append("is_offer", document.getElementById("productOffer").checked ? 1 : 0);

  // acción
  const action = editingProductId ? "actualizar" : "crear";
  if (editingProductId) formData.append("id", editingProductId);

  try {
    const res = await fetch(`${API_URL}?action=${action}`, {
      method: "POST",
      body: formData,
    });

    // Si el servidor devolvió error 500/404, fetch NO lanza; validamos:
    if (!res.ok) {
      const txt = await res.text();
      console.error("Respuesta no OK:", res.status, txt);
      showAlert("El servidor respondió con error (" + res.status + ")", "error");
      return;
    }

    // Intentar parsear JSON; si falla, mostrar el texto crudo (debug)
    let result;
    try {
      result = await res.json();
    } catch (parseErr) {
      const txt = await res.text();
      console.error("No es JSON válido. Respuesta:", txt);
      showAlert("Respuesta no válida del servidor (ver consola)", "error");
      return;
    }

    if (result.success) {
      showAlert(`Producto ${editingProductId ? "actualizado" : "guardado"} correctamente`, "success");
      closeModal();
      await cargarProductos();
      updateStats();
    } else {
      console.error(result.error || result);
      showAlert("Error al guardar el producto", "error");
    }
  } catch (err) {
    console.error("Error guardando producto:", err);
    showAlert("Error de conexión con el servidor", "error");
  }
}

// Edit Product
function editProduct(id) {
  openModal(id);
}

// Delete Product
async function deleteProduct(id) {
  const confirmar = confirm("¿Estás seguro de que deseas eliminar este producto?");
  if (!confirmar) return;

  try {
    const res = await fetch(`${API_URL}?action=eliminar&id=${id}`);
    const result = await res.json();

    if (result.success) {
      showAlert("Producto eliminado correctamente", "success");
      await cargarProductos(); // Recarga desde la BD
      updateStats();
    } else {
      showAlert("Error al eliminar el producto", "error");
      console.error(result);
    }
  } catch (error) {
    console.error("Error al eliminar producto:", error);
    showAlert("Error de conexión al eliminar el producto", "error");
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
