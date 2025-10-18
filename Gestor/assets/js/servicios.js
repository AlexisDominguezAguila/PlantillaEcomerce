const API_URL = "../controllers/ServicioController.php";
let servicios = [];
let editId = null;

async function cargarServicios() {
  try {
    const res = await fetch(`${API_URL}?action=listar`, { cache: "no-store" });
    servicios = await res.json();
    if (!Array.isArray(servicios)) servicios = [];
    renderServicios(servicios);
  } catch (e) {
    console.error("Error listando servicios:", e);
    servicios = [];
    renderServicios(servicios);
  }
}

function renderServicios(lista) {
  const grid = document.getElementById("servicesGrid");
  const count = document.getElementById("servicesCount");
  const empty = document.getElementById("emptyState");

  grid.innerHTML = "";
  count.textContent = lista.length;

  empty.style.display = (lista.length === 0) ? "block" : "none";

  // Contadores en JS
  const total = lista.length;
  const visibles = lista.filter(s => Number(s.active) === 1).length;
  const ocultos = total - visibles;

  const totalEl = document.getElementById("totalServices");
  const activeEl = document.getElementById("activeServices");
  const hiddenEl = document.getElementById("hiddenServices");
  if (totalEl) totalEl.textContent = total;
  if (activeEl) activeEl.textContent = visibles;
  if (hiddenEl) hiddenEl.textContent = ocultos;

  lista.forEach(s => {
    const visible = Number(s.active) === 1;
    const estado = visible ? "Visible" : "Oculto";
    const colorEstado = visible ? "in-stock" : "out-stock";

    const card = document.createElement("div");
    card.className = "product-card";
    card.innerHTML = `
      <div class="product-image">
        <i class="${s.icono || 'fas fa-cog'}" style="font-size:2rem;"></i>
      </div>
      <div class="product-info">
        <h3 class="product-name">${escapeHTML(s.titulo || '')}</h3>
        <p class="product-description">${escapeHTML(s.descripcion || '')}</p>
        <p class="product-description small">${escapeHTML(s.caracteristicas || '')}</p>
        <p><strong>${escapeHTML(s.etiqueta || '')}</strong></p>
        <div class="product-meta">
          <span class="stock-badge ${colorEstado}">${estado}</span>
          <div>
            <button class="action-btn edit" onclick="editarServicio(${Number(s.id)})"><i class="bx bx-edit"></i></button>
            <button class="action-btn delete" onclick="eliminarServicio(${Number(s.id)})"><i class="bx bx-trash"></i></button>
          </div>
        </div>
      </div>
    `;
    grid.appendChild(card);
  });
}

// Seguridad básica para mostrar textos
function escapeHTML(str) {
  return String(str).replace(/[&<>"']/g, m => (
    { "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;" }[m]
  ));
}

document.getElementById("serviceForm").addEventListener("submit", async e => {
  e.preventDefault();
  const form = e.target;
  const formData = new FormData(form);

  // Normalizar vacíos a null (que el backend convierte)
  ["precio_min","precio_max"].forEach(k => {
    if (formData.has(k) && formData.get(k).trim() === "") {
      formData.set(k, "");
    }
  });

  const action = editId ? "actualizar" : "crear";
  if (editId) formData.append("id", editId);

  try {
    const res = await fetch(`${API_URL}?action=${action}`, { method: "POST", body: formData });
    const data = await res.json();
    if (data && data.success) {
      alert("Servicio guardado correctamente");
      closeModal();
      cargarServicios();
    } else {
      alert(data?.message || "Error al guardar el servicio");
    }
  } catch (err) {
    console.error(err);
    alert("Error de red al guardar el servicio");
  }
});

function buscarServicio() {
  const search = document.getElementById("searchInput").value.toLowerCase();
  const filtrados = servicios.filter(s => (s.titulo || '').toLowerCase().includes(search));
  renderServicios(filtrados);
}

function openModal() {
  editId = null;
  document.getElementById("modalTitle").textContent = "Nuevo Servicio";
  document.getElementById("serviceForm").reset();
  // por defecto visible
  const activeChk = document.getElementById("serviceActive");
  if (activeChk) activeChk.checked = true;
  document.getElementById("serviceModal").classList.add("active");
}

function closeModal() {
  document.getElementById("serviceModal").classList.remove("active");
}

function editarServicio(id) {
  const s = servicios.find(x => Number(x.id) === Number(id));
  if (!s) return;

  editId = id;
  document.getElementById("modalTitle").textContent = "Editar Servicio";

  document.getElementById("serviceId").value = s.id;
  document.getElementById("serviceTitle").value = s.titulo || "";
  document.getElementById("serviceDescription").value = s.descripcion || "";
  document.getElementById("serviceFeatures").value = s.caracteristicas || "";
  document.getElementById("serviceMin").value = s.precio_min ?? "";
  document.getElementById("serviceMax").value = s.precio_max ?? "";
  document.getElementById("serviceLabel").value = s.etiqueta || "";
  document.getElementById("serviceLink").value = s.enlace || "";
  document.getElementById("serviceIcon").value = s.icono || "";
  const activeChk = document.getElementById("serviceActive");
  if (activeChk) activeChk.checked = Number(s.active) === 1;

  document.getElementById("serviceModal").classList.add("active");
}

async function eliminarServicio(id) {
  if (!confirm("¿Deseas eliminar este servicio?")) return;
  const formData = new FormData();
  formData.append("id", id);

  try {
    const res = await fetch(`${API_URL}?action=eliminar`, { method: "POST", body: formData });
    const data = await res.json();
    if (data && data.success) {
      alert("🗑️ Servicio eliminado correctamente");
      cargarServicios();
    } else {
      alert(data?.message || "Error al eliminar");
    }
  } catch (err) {
    console.error(err);
    alert("Error de red al eliminar");
  }
}

window.onload = cargarServicios;
