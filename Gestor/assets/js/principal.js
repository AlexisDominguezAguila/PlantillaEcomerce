// Usa el API_URL que defines en la vista; si no existe, define uno por defecto:
if (typeof window.API_URL === 'undefined') {
  window.API_URL = "../controllers/GestionController.php";
}

let cards = [];
let editId = null;
let removedStoredImage = false; // si el usuario decide quitar la imagen actual

// ========= Utiles de salida segura =========
const escapeHTML = (str) =>
  String(str ?? "").replace(/[&<>"']/g, (m) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;"
  }[m]));
const escapeAttr = (str) => escapeHTML(String(str)).replace(/"/g, "&quot;");

// ========= Single image preview =========
const MAX_MB = 5;
const ALLOWED = ["image/png","image/jpeg","image/webp","image/gif"];

function handleImageUpload(e) {
  const input = e.target;
  const file = input.files && input.files[0];
  const grid = document.getElementById("imagePreviewGrid");

  grid.innerHTML = "";
  removedStoredImage = false;
  const keep = document.getElementById("keepCurrentImage");
  if (keep) keep.value = "0"; // hay nueva imagen => no mantener la actual

  if (!file) return;

  if (!ALLOWED.includes(file.type)) {
    alert("Tipo no permitido.");
    input.value = "";
    if (keep) keep.value = "1";
    return;
  }
  if (file.size > MAX_MB * 1024 * 1024) {
    alert(`Archivo supera ${MAX_MB}MB.`);
    input.value = "";
    if (keep) keep.value = "1";
    return;
  }

  const url = URL.createObjectURL(file);
  const box = document.createElement("div");
  box.className = "image-thumb";
  box.innerHTML = `
    <img src="${url}" alt="${file.name}">
    <button type="button" class="image-remove" title="Quitar" onclick="removeSelectedImage()">
      <i class="bx bx-x"></i>
    </button>
    <span class="image-badge">Nueva</span>
  `;
  grid.appendChild(box);
}

function removeSelectedImage() {
  const input = document.getElementById("imageInput");
  input.value = "";
  document.getElementById("imagePreviewGrid").innerHTML = "";
  removedStoredImage = false;
  const keep = document.getElementById("keepCurrentImage");
  if (keep) keep.value = "1"; // vuelve a mantener la actual
}

// Quitar imagen actual almacenada (modo editar, sin subir una nueva)
function removeStoredImage() {
  const input = document.getElementById("imageInput");
  input.value = "";
  document.getElementById("imagePreviewGrid").innerHTML = "";
  removedStoredImage = true;
  const keep = document.getElementById("keepCurrentImage");
  if (keep) keep.value = "0"; // no mantener la actual
}

// ========= Cargar / Listar =========
async function cargarCards() {
  try {
    const res = await fetch(`${API_URL}?action=list`, { cache: "no-store" });
    const data = await res.json();
    cards = Array.isArray(data) ? data : [];
    renderCards(cards);
  } catch (e) {
    console.error("Error listando cards:", e);
    cards = [];
    renderCards(cards);
  }
}

function renderCards(lista) {
  const grid  = document.getElementById("servicesGrid");
  const count = document.getElementById("servicesCount");
  const empty = document.getElementById("emptyState");

  grid.innerHTML = "";
  count.textContent = lista.length;
  empty.style.display = (lista.length === 0) ? "block" : "none";

  // Contadores
  const total    = lista.length;
  const visibles = lista.filter(s => Number(s.is_active) === 1).length;
  const ocultos  = total - visibles;

  const totalEl  = document.getElementById("totalServices");
  const activeEl = document.getElementById("activeServices");
  const hiddenEl = document.getElementById("hiddenServices");
  if (totalEl)  totalEl.textContent  = total;
  if (activeEl) activeEl.textContent = visibles;
  if (hiddenEl) hiddenEl.textContent = ocultos;

  lista.forEach(s => {
    const visible     = Number(s.is_active) === 1;
    const estado      = visible ? "Visible" : "Oculto";
    const colorEstado = visible ? "in-stock" : "out-stock";
    const badge       = s.badge_text ? `<span class="product-badge">${escapeHTML(s.badge_text)}</span>` : "";

    // Usar dataURL si viene de BD; si no, fallback a image_src (compat)
    const imgSrc = s.image_data_url ? s.image_data_url : (s.image_src || "");

    const card = document.createElement("div");
    card.className = "product-card";
    card.innerHTML = `
      <div class="product-image">
        <img src="${escapeAttr(imgSrc)}" alt="${escapeAttr(s.image_alt || "Imagen")}">
        ${badge}
      </div>
      <div class="product-info">
        <h3 class="product-title">${escapeHTML(s.title || "")}</h3>
        <p class="product-description">${escapeHTML(s.description || "")}</p>
        <div class="product-footer">
          <span class="product-price">${escapeHTML(s.footer_text || "")}</span>
          <div class="actions">
            <button class="btn-product" onclick="irA('${escapeAttr(s.button_url || "#")}')">${escapeHTML(s.button_label || "Ver Detalles")}</button>
            <button class="action-btn edit" title="Editar"   onclick="editarCard(${Number(s.id)})"><i class="bx bx-edit"></i></button>
            <button class="action-btn delete" title="Eliminar" onclick="eliminarCard(${Number(s.id)})"><i class="bx bx-trash"></i></button>
            <button class="action-btn" title="${visible ? "Ocultar" : "Mostrar"}" onclick="toggleVisible(${Number(s.id)}, ${visible ? 0 : 1})">
              <i class="bx ${visible ? "bx-hide" : "bx-show"}"></i>
            </button>
          </div>
        </div>
        <div class="product-meta">
          <span class="stock-badge ${colorEstado}">${estado}</span>
        </div>
      </div>
    `;
    grid.appendChild(card);
  });
}

function irA(url) { if (!url || url === "#") return; window.open(url, "_blank"); }

// ========= Búsqueda =========
function buscarServicio() {
  const q = document.getElementById("searchInput").value.toLowerCase().trim();
  if (!q) return renderCards(cards);
  const filtrados = cards.filter(s =>
    (s.title || "").toLowerCase().includes(q) ||
    (s.description || "").toLowerCase().includes(q)
  );
  renderCards(filtrados);
}

// ========= Modal =========
function openModal() {
  editId = null;
  removedStoredImage = false;
  document.getElementById("modalTitle").textContent = "Nueva Card";
  document.getElementById("serviceForm").reset();
  const activeChk = document.getElementById("serviceActive");
  if (activeChk) activeChk.checked = true;

  // imagen: limpiar preview y estado
  document.getElementById("imageInput").value = "";
  document.getElementById("imagePreviewGrid").innerHTML = "";
  const keep = document.getElementById("keepCurrentImage");
  if (keep) keep.value = "1";

  const m = document.getElementById("serviceModal");
  m.classList.add("active","show");
}

function closeModal() {
  const m = document.getElementById("serviceModal");
  m.classList.remove("active","show");
}

// ========= Crear / Actualizar =========
document.getElementById("serviceForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const fd = new FormData(e.target);

  // visible -> is_active
  const chk = document.getElementById("serviceActive");
  fd.set("is_active", chk && chk.checked ? 1 : 0);

  // keep_current_image:
  // - Si se sube una nueva imagen, el handler ya puso "0"
  // - Si usuario quitó imagen actual (removeStoredImage), también "0"
  if (removedStoredImage) fd.set("keep_current_image", "0");

  const action = editId ? "update" : "create";
  if (editId) fd.append("id", editId);

  try {
    const res = await fetch(`${API_URL}?action=${action}`, { method: "POST", body: fd });
    const data = await res.json();
    if (data && (data.ok || data.success)) {
      alert("✅ Card guardada correctamente");
      closeModal();
      cargarCards();
    } else {
      alert((data && (data.message || data.error)) || "Error al guardar");
    }
  } catch (err) {
    console.error(err);
    alert("Error de red al guardar");
  }
});

// ========= Editar =========
function editarCard(id) {
  const s = cards.find(x => Number(x.id) === Number(id));
  if (!s) return;

  editId = id;
  removedStoredImage = false;
  document.getElementById("modalTitle").textContent = "Editar Card";

  document.getElementById("serviceId").value          = s.id;
  document.getElementById("imageAlt").value           = s.image_alt || "";
  document.getElementById("badgeText").value          = s.badge_text || "";
  document.getElementById("serviceTitle").value       = s.title || "";
  document.getElementById("serviceDescription").value = s.description || "";
  document.getElementById("footerText").value         = s.footer_text || "";
  document.getElementById("buttonLabel").value        = s.button_label || "Ver Detalles";
  document.getElementById("buttonUrl").value          = s.button_url || "";
  document.getElementById("displayOrder").value       = (s.display_order ?? 0);
  const activeChk = document.getElementById("serviceActive");
  if (activeChk) activeChk.checked = Number(s.is_active) === 1;

  // Imagen actual
  const grid = document.getElementById("imagePreviewGrid");
  grid.innerHTML = "";
  document.getElementById("imageInput").value = "";
  const keep = document.getElementById("keepCurrentImage");
  if (keep) keep.value = "1"; // mantener por defecto

  const currentSrc = s.image_data_url ? s.image_data_url : (s.image_src || "");
  if (currentSrc) {
    const box = document.createElement("div");
    box.className = "image-thumb";
    box.innerHTML = `
      <img src="${currentSrc}" alt="${s.image_alt || 'Imagen actual'}">
      <button type="button" class="image-remove" title="Quitar imagen actual" onclick="removeStoredImage()">
        <i class="bx bx-trash"></i>
      </button>
      <span class="image-badge">Actual</span>
    `;
    grid.appendChild(box);
  }

  const m = document.getElementById("serviceModal");
  m.classList.add("active","show");
}

// ========= Eliminar =========
async function eliminarCard(id) {
  if (!confirm("¿Deseas eliminar esta card?")) return;
  const fd = new FormData();
  fd.append("id", id);
  try {
    const res = await fetch(`${API_URL}?action=delete`, { method: "POST", body: fd });
    const data = await res.json();
    if (data && (data.ok || data.success)) {
      alert("🗑️ Card eliminada correctamente");
      cargarCards();
    } else {
      alert((data && (data.message || data.error)) || "Error al eliminar");
    }
  } catch (err) {
    console.error(err);
    alert("Error de red al eliminar");
  }
}

// ========= Toggle visible =========
async function toggleVisible(id, value) {
  const fd = new FormData();
  fd.append("id", id);
  fd.append("is_active", value);
  try {
    const res = await fetch(`${API_URL}?action=toggle_active`, { method: "POST", body: fd });
    const data = await res.json();
    if (data && (data.ok || data.success)) {
      cargarCards();
    } else {
      alert((data && (data.message || data.error)) || "No se pudo cambiar el estado");
    }
  } catch (err) {
    console.error(err);
    alert("Error de red al cambiar el estado");
  }
}

// ========= Init =========
document.addEventListener("DOMContentLoaded", cargarCards);
