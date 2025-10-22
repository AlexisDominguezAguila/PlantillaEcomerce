const API_URL = "../controllers/ServiciosController.php";

// Mapeo de iconos por tipo de servicio
const iconMap = {
  análisis: "fas fa-chart-bar",
  datos: "fas fa-database",
  venta: "fas fa-shopping-cart",
  punto: "fas fa-cash-register",
  soporte: "fas fa-headset",
  reporte: "fas fa-file-alt",
  restaurante: "fas fa-utensils",
  sistema: "fas fa-cogs",
  cloud: "fas fa-cloud",
  seguridad: "fas fa-shield-alt",
  default: "fas fa-cog",
};

// Mapeo de colores por servicio
const colorMap = {
  análisis: "linear-gradient(135deg, #6366f1, #8b5cf6)",
  datos: "linear-gradient(135deg, #06b5d448, #0890b252)",
  venta: "linear-gradient(135deg, #ec4899, #f43f5e)",
  punto: "linear-gradient(135deg, #f59e0b, #d97706)",
  soporte: "linear-gradient(135deg, #10b981, #059669)",
  reporte: "linear-gradient(135deg, #3b82f6, #1d4ed8)",
  restaurante: "linear-gradient(135deg, #f97316, #ea580c)",
  sistema: "linear-gradient(135deg, #6366f1, #00d4ff)",
  default: "linear-gradient(135deg, #6366f1, #00d4ff)",
};

// Mapeo de emojis/iconos para imágenes placeholder
const emojiMap = {
  análisis: "📊",
  datos: "🗄️",
  venta: "🛒",
  punto: "💳",
  soporte: "🎧",
  reporte: "📄",
  restaurante: "🍽️",
  sistema: "⚙️",
  cloud: "☁️",
  seguridad: "🔒",
  default: "💼",
};

function getServiceKey(titulo) {
  const lower = titulo.toLowerCase();
  for (const key of Object.keys(iconMap)) {
    if (key !== "default" && lower.includes(key)) {
      return key;
    }
  }
  return "default";
}

function getIcon(titulo) {
  const key = getServiceKey(titulo);
  return iconMap[key] || iconMap.default;
}

function getGradient(titulo) {
  const key = getServiceKey(titulo);
  return colorMap[key] || colorMap.default;
}

function getEmoji(titulo) {
  const key = getServiceKey(titulo);
  return emojiMap[key] || emojiMap.default;
}

async function cargarServiciosPublicos() {
  const grid = document.getElementById("servicesGrid");
  grid.innerHTML =
    "<p style='text-align: center; color: #b0b0c0;'>Cargando servicios...</p>";

  try {
    const res = await fetch(`${API_URL}?action=listar`);
    const servicios = await res.json();

    grid.innerHTML = "";
    if (!Array.isArray(servicios) || servicios.length === 0) {
      grid.innerHTML =
        "<p style='text-align: center; color: #b0b0c0;'>No hay servicios activos disponibles.</p>";
      return;
    }

    window.serviciosPublicos = servicios;

    servicios.forEach((s, index) => {
      const serviceItem = document.createElement("div");
      serviceItem.className = `service-item ${
        index % 2 === 1 ? "reverse" : ""
      }`;
      serviceItem.style.animationDelay = `${index * 0.15}s`;

      const caracteristicas = (s.caracteristicas || "")
        .split(";")
        .filter((txt) => txt.trim() !== "")
        .map(
          (txt) => `<li><i class="fas fa-check-circle"></i> ${txt.trim()}</li>`
        )
        .join("");

      const botonAccion =
        s.enlace && s.enlace.trim() !== ""
          ? `<a href="${s.enlace}" class="btn-primary">Ver detalles</a>`
          : `<button class="btn-primary" onclick="mostrarModalServicio(${s.id})">Ver detalles</button>`;

      const icon = getIcon(s.titulo);
      const gradient = getGradient(s.titulo);
      const emoji = getEmoji(s.titulo);

      serviceItem.innerHTML = `
              <div class="service-image" style="background: ${gradient};">
                <div class="service-image-placeholder">${emoji}</div>
              </div>
              <div class="service-content">
                <div class="service-number">${String(index + 1).padStart(
                  2,
                  "0"
                )}</div>
                <h2>
                  <div class="service-icon"><i class="${icon}"></i></div>
                  ${s.titulo}
                </h2>
                <p>${s.descripcion}</p>
                ${
                  caracteristicas
                    ? `<div class="service-features">
                      <h3>Incluye:</h3>
                      <ul>${caracteristicas}</ul>
                    </div>`
                    : ""
                }
                <div class="service-pricing">
                  <div class="price-tag">${
                    s.etiqueta || "Consultar precio"
                  }</div>
                  ${botonAccion}
                </div>
              </div>
            `;
      grid.appendChild(serviceItem);
    });

    // Iniciar observador de scroll
    initScrollAnimations();
  } catch (error) {
    console.error("Error cargando servicios:", error);
    grid.innerHTML =
      "<p style='text-align: center; color: #ff6b6b;'>Error al cargar los servicios. Intenta más tarde.</p>";
  }
}

function initScrollAnimations() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.animation = "fadeInUp 0.8s ease-out forwards";
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.1,
      rootMargin: "0px 0px -120px 0px",
    }
  );

  document.querySelectorAll(".service-item").forEach((item) => {
    observer.observe(item);
  });
}

function mostrarModalServicio(id) {
  const s = window.serviciosPublicos?.find((x) => Number(x.id) === Number(id));
  if (!s) return;

  const modal = document.getElementById("serviceModal");
  const body = document.getElementById("modalBody");
  const icon = getIcon(s.titulo);

  body.innerHTML = `
          <h2><i class="${icon}"></i> ${s.titulo}</h2>
          <p>${s.descripcion}</p>
          ${
            s.caracteristicas
              ? `<p><strong>Características:</strong><br>${s.caracteristicas.replaceAll(
                  ";",
                  "<br>"
                )}</p>`
              : ""
          }
        `;
  modal.classList.add("active");
}

function cerrarModalServicio() {
  document.getElementById("serviceModal").classList.remove("active");
}

// Cerrar modal al hacer click fuera
document.addEventListener("DOMContentLoaded", () => {
  const modal = document.getElementById("serviceModal");
  modal.addEventListener("click", (e) => {
    if (e.target === modal) cerrarModalServicio();
  });

  const hero = document.getElementById("hero");
  const heroBg = document.querySelector(".hero-bg");
  const speedHero = parseFloat(heroBg?.dataset.speed || "0.35");

  let ticking = false;
  function onScroll() {
    if (ticking) return;
    requestAnimationFrame(() => {
      const scrolled =
        window.pageYOffset || document.documentElement.scrollTop || 0;

      /* Parallax del HERO (en base a su posición en viewport) */
      if (hero && heroBg) {
        const r = hero.getBoundingClientRect();
        const offset = -r.top * speedHero; // mueve más cuando el hero entra/sale
        heroBg.style.transform = `translateY(${offset}px) scale(1.08)`;
      }

      /* Parallax de imágenes de servicios que ya tenías */
      document.querySelectorAll(".service-image").forEach((el, index) => {
        const factor = index % 2 === 0 ? 0.3 : -0.3;
        el.style.transform = `translateY(${scrolled * factor}px)`;
      });

      ticking = false;
    });
    ticking = true;
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);
  onScroll(); // primer cálculo

  cargarServiciosPublicos();
});
