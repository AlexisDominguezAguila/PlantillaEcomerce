// ========== INICIALIZACIÓN ==========
document.addEventListener("DOMContentLoaded", function () {
  initializeApp();
});

function initializeApp() {
  initializeCategoryToggles();
  initializeDragAndDrop();
  initializeToolbarActions();
  initializeSidebarCollapse();
  initializeSearch();
}

// ========== CATEGORÍAS COLAPSABLES ==========
function initializeCategoryToggles() {
  const categoryHeaders = document.querySelectorAll(".category-header");

  categoryHeaders.forEach((header) => {
    header.addEventListener("click", function () {
      this.classList.toggle("active");
    });
  });

  // Abrir la primera categoría por defecto
  if (categoryHeaders.length > 0) {
    categoryHeaders[0].classList.add("active");
  }
}

// ========== DRAG AND DROP ==========
function initializeDragAndDrop() {
  const componentItems = document.querySelectorAll(".component-item");
  const canvas = document.getElementById("mainCanvas");

  componentItems.forEach((item) => {
    item.addEventListener("dragstart", handleDragStart);
    item.addEventListener("dragend", handleDragEnd);
  });

  canvas.addEventListener("dragover", handleDragOver);
  canvas.addEventListener("drop", handleDrop);
  canvas.addEventListener("dragleave", handleDragLeave);
}

function handleDragStart(e) {
  this.classList.add("dragging");
  e.dataTransfer.effectAllowed = "copy";
  e.dataTransfer.setData("component", this.dataset.component);
}

function handleDragEnd(e) {
  this.classList.remove("dragging");
}

function handleDragOver(e) {
  e.preventDefault();
  e.dataTransfer.dropEffect = "copy";
  this.classList.add("drag-over");
}

function handleDragLeave(e) {
  this.classList.remove("drag-over");
}

function handleDrop(e) {
  e.preventDefault();
  this.classList.remove("drag-over");

  const componentType = e.dataTransfer.getData("component");
  const emptyState = this.querySelector(".canvas-empty-state");

  if (emptyState) {
    emptyState.remove();
  }

  addComponentToCanvas(componentType);

  window.Swal.fire({
    icon: "success",
    title: "Componente agregado",
    text: `El componente ${componentType} ha sido agregado al canvas`,
    timer: 2000,
    showConfirmButton: false,
    background: "#1e293b",
    color: "#f1f5f9",
    toast: true,
    position: "top-end",
  });
}

async function addComponentToCanvas(componentType) {
  const canvas = document.getElementById("mainCanvas");

  try {
    const response = await fetch(
      `api/render_component.php?component=${componentType}`
    );
    const data = await response.json();

    if (data.html) {
      const wrapper = document.createElement("div");
      wrapper.classList.add("canvas-component");
      wrapper.dataset.component = componentType;
      wrapper.innerHTML = `
        <div class="component-toolbar">
          <button class="edit-btn" onclick="editComponent(this)"><i class='bx bx-edit'></i></button>
          <button class="delete-btn" onclick="deleteComponent(this)"><i class='bx bx-trash'></i></button>
        </div>
        ${data.html}
      `;
      canvas.appendChild(wrapper);

      showToast(
        "success",
        "Componente agregado",
        `${getComponentTitle(componentType)} agregado al canvas`
      );
    } else {
      showToast("error", "Error", "No se pudo cargar el componente");
    }
  } catch (error) {
    console.error(error);
    showToast("error", "Error", "No se pudo conectar al servidor");
  }
}

function createComponentElement(type) {
  const div = document.createElement("div");
  div.className = "canvas-component";
  div.dataset.component = type;
  div.style.cssText = `
        padding: 2rem;
        margin: 1rem;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        border-radius: 0.5rem;
        color: white;
        cursor: pointer;
        transition: all 0.3s;
        position: relative;
    `;

  div.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center;">
            <h3 style="margin: 0; font-size: 1.25rem;">${getComponentTitle(
              type
            )}</h3>
            <div class="component-actions" style="display: flex; gap: 0.5rem;">
                <button onclick="editComponent(this)" style="background: rgba(255,255,255,0.2); border: none; color: white; padding: 0.5rem; border-radius: 0.25rem; cursor: pointer;">
                    <i class='bx bx-edit'></i>
                </button>
                <button onclick="deleteComponent(this)" style="background: rgba(255,255,255,0.2); border: none; color: white; padding: 0.5rem; border-radius: 0.25rem; cursor: pointer;">
                    <i class='bx bx-trash'></i>
                </button>
            </div>
        </div>
        <p style="margin: 0.5rem 0 0 0; opacity: 0.9;">Este es un componente de tipo ${type}</p>
    `;

  div.addEventListener("mouseenter", function () {
    this.style.transform = "translateY(-2px)";
    this.style.boxShadow = "0 8px 24px rgba(0,0,0,0.2)";
  });

  div.addEventListener("mouseleave", function () {
    this.style.transform = "translateY(0)";
    this.style.boxShadow = "none";
  });

  return div;
}

function getComponentTitle(type) {
  const titles = {
    "hero-1": "Hero Centrado",
    "hero-2": "Hero con Imagen",
    "hero-3": "Hero Video",
    "about-1": "Sobre Nosotros",
    "about-2": "Equipo",
    "about-3": "Logros",
    "products-grid": "Grid de Productos",
    "products-carousel": "Carrusel de Productos",
    "products-featured": "Productos Destacados",
    "services-cards": "Tarjetas de Servicios",
    "services-list": "Lista de Servicios",
    "services-pricing": "Precios",
    "form-contact": "Formulario de Contacto",
    "form-newsletter": "Newsletter",
    "form-quote": "Cotización",
    "map-location": "Mapa de Ubicación",
    "map-interactive": "Mapa Interactivo",
    testimonials: "Testimonios",
    gallery: "Galería",
    faq: "Preguntas Frecuentes",
    cta: "Call to Action",
  };
  return titles[type] || type;
}

// ========== ACCIONES DE COMPONENTES ==========
window.editComponent = function (button) {
  const component = button.closest(".canvas-component");
  const propertiesPanel = document.getElementById("propertiesPanel");
  propertiesPanel.classList.add("active");

  window.Swal.fire({
    icon: "info",
    title: "Editar Componente",
    text: "Panel de propiedades abierto",
    timer: 1500,
    showConfirmButton: false,
    background: "#1e293b",
    color: "#f1f5f9",
    toast: true,
    position: "top-end",
  });
};

window.deleteComponent = function (button) {
  const component = button.closest(".canvas-component");

  window.Swal.fire({
    title: "¿Eliminar componente?",
    text: "Esta acción no se puede deshacer",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#ef4444",
    cancelButtonColor: "#64748b",
    confirmButtonText: "Sí, eliminar",
    cancelButtonText: "Cancelar",
    background: "#1e293b",
    color: "#f1f5f9",
  }).then((result) => {
    if (result.isConfirmed) {
      component.remove();
      window.Swal.fire({
        icon: "success",
        title: "Eliminado",
        text: "El componente ha sido eliminado",
        timer: 1500,
        showConfirmButton: false,
        background: "#1e293b",
        color: "#f1f5f9",
        toast: true,
        position: "top-end",
      });
    }
  });
};

// ========== TOOLBAR ACTIONS ==========
function initializeToolbarActions() {
  document.getElementById("undoBtn").addEventListener("click", () => {
    showToast("info", "Deshacer", "Acción deshecha");
  });

  document.getElementById("redoBtn").addEventListener("click", () => {
    showToast("info", "Rehacer", "Acción rehecha");
  });

  document.getElementById("desktopView").addEventListener("click", () => {
    setCanvasView("desktop");
  });

  document.getElementById("tabletView").addEventListener("click", () => {
    setCanvasView("tablet");
  });

  document.getElementById("mobileView").addEventListener("click", () => {
    setCanvasView("mobile");
  });

  document.getElementById("previewBtn").addEventListener("click", () => {
    window.Swal.fire({
      title: "Vista Previa",
      text: "Abriendo vista previa de la landing page...",
      icon: "info",
      background: "#1e293b",
      color: "#f1f5f9",
      confirmButtonColor: "#6366f1",
    });
  });

  document.getElementById("publishBtn").addEventListener("click", () => {
    window.Swal.fire({
      title: "¿Publicar Landing Page?",
      text: "Tu landing page será publicada y estará disponible públicamente",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#10b981",
      cancelButtonColor: "#64748b",
      confirmButtonText: "Sí, publicar",
      cancelButtonText: "Cancelar",
      background: "#1e293b",
      color: "#f1f5f9",
    }).then((result) => {
      if (result.isConfirmed) {
        window.Swal.fire({
          icon: "success",
          title: "¡Publicado!",
          text: "Tu landing page ha sido publicada exitosamente",
          background: "#1e293b",
          color: "#f1f5f9",
          confirmButtonColor: "#6366f1",
        });
      }
    });
  });

  document.getElementById("zoomIn").addEventListener("click", () => {
    adjustZoom(10);
  });

  document.getElementById("zoomOut").addEventListener("click", () => {
    adjustZoom(-10);
  });

  document.getElementById("closeProperties").addEventListener("click", () => {
    document.getElementById("propertiesPanel").classList.remove("active");
  });
}

function setCanvasView(view) {
  const canvas = document.getElementById("mainCanvas");
  const views = {
    desktop: "100%",
    tablet: "768px",
    mobile: "375px",
  };

  canvas.style.maxWidth = views[view];
  showToast("info", "Vista cambiada", `Vista ${view} activada`);
}

let currentZoom = 100;

function adjustZoom(delta) {
  currentZoom = Math.max(50, Math.min(200, currentZoom + delta));
  const canvas = document.getElementById("mainCanvas");
  canvas.style.transform = `scale(${currentZoom / 100})`;
  canvas.style.transformOrigin = "top center";
  document.querySelector(".zoom-level").textContent = `${currentZoom}%`;
}

// ========== SIDEBAR COLLAPSE ==========
function initializeSidebarCollapse() {
  const collapseBtn = document.getElementById("collapseSidebar");
  const sidebar = document.querySelector(".components-sidebar");

  collapseBtn.addEventListener("click", () => {
    sidebar.style.transform =
      sidebar.style.transform === "translateX(-100%)"
        ? "translateX(0)"
        : "translateX(-100%)";
  });
}

// ========== BÚSQUEDA ==========
function initializeSearch() {
  const searchInput = document.getElementById("searchComponents");

  searchInput.addEventListener("input", (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const componentItems = document.querySelectorAll(".component-item");

    componentItems.forEach((item) => {
      const componentName = item
        .querySelector(".component-name")
        .textContent.toLowerCase();
      const shouldShow = componentName.includes(searchTerm);
      item.style.display = shouldShow ? "flex" : "none";
    });
  });
}

// ========== UTILIDADES ==========
function showToast(icon, title, text) {
  window.Swal.fire({
    icon: icon,
    title: title,
    text: text,
    timer: 2000,
    showConfirmButton: false,
    background: "#1e293b",
    color: "#f1f5f9",
    toast: true,
    position: "top-end",
  });
}

// Declare Swal variable before using it
const Swal = window.Swal;
