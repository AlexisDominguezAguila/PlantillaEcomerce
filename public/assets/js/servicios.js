// servicios.js
const API_URL = "../controllers/ServiciosController.php";
const MAX_SHIFT = 28; // px de desplazamiento máximo para parallax

/* ---------- Helpers ---------- */
const escapeHTML = (str = "") =>
  String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

const formatPrecio = (n) => {
  if (n === null || n === undefined || n === "") return null;
  const num = Number(n);
  if (Number.isNaN(num)) return null;
  return new Intl.NumberFormat("es-PE", {
    style: "currency",
    currency: "PEN",
    maximumFractionDigits: 2,
  }).format(num);
};

const clamp = (min, v, max) => Math.max(min, Math.min(v, max));

/* ---------- UI builders ---------- */
function buildServiceItem(s, index) {
  const hasImg = s.imagen && String(s.imagen).trim() !== "";
  const iconClasses = s.icono && s.icono.trim() !== "" ? s.icono : "fas fa-cog";
  const numero = String(index + 1).padStart(2, "0");

  const pMin = formatPrecio(s.precio_min);
  const pMax = formatPrecio(s.precio_max);
  let priceBadge = escapeHTML(s.etiqueta || "");
  if (!priceBadge) {
    if (pMin && pMax) priceBadge = `${pMin} – ${pMax}`;
    else if (pMin) priceBadge = `Desde ${pMin}`;
    else priceBadge = "Consultar precio";
  }

  const href =
    s.enlace && s.enlace.trim() !== ""
      ? s.enlace
      : `servicio.php?id=${encodeURIComponent(s.id)}`;

  const carHTML = (s.caracteristicas || "")
    .split(";")
    .map((t) => t.trim())
    .filter(Boolean)
    .map((t) => `<li><i class="fas fa-check-circle"></i> ${escapeHTML(t)}</li>`)
    .join("");

  return `
      <div class="service-item ${
        index % 2 === 1 ? "reverse" : ""
      }" style="animation-delay:${index * 0.15}s">
        <div class="service-image">
          ${
            hasImg
              ? `<img src="../uploads/servicios/${escapeHTML(
                  s.imagen
                )}" alt="${escapeHTML(s.titulo)}" loading="lazy" />`
              : `<div class="service-image-placeholder">
                   <i class="${escapeHTML(iconClasses)}" aria-hidden="true"></i>
                 </div>`
          }
        </div>

        <div class="service-content">
          <div class="service-number">${numero}</div>
          <h2>
            <div class="service-icon"><i class="${escapeHTML(
              iconClasses
            )}" aria-hidden="true"></i></div>
            ${escapeHTML(s.titulo)}
          </h2>
          <p>${escapeHTML(s.descripcion || "")}</p>

          ${
            carHTML
              ? `
            <div class="service-features">
              <h3>Incluye:</h3>
              <ul>${carHTML}</ul>
            </div>`
              : ""
          }

          <div class="service-pricing">
            <div class="price-tag">${priceBadge}</div>
            <a href="${escapeHTML(href)}" class="btn-primary">Ver detalles</a>
          </div>
        </div>
      </div>
    `;
}

/* ---------- Data fetch & render ---------- */
async function cargarServiciosPublicos() {
  const grid = document.getElementById("servicesGrid");
  grid.innerHTML =
    "<p style='text-align:center;color:#b0b0c0'>Cargando servicios...</p>";

  try {
    const res = await fetch(`${API_URL}?action=listar`);
    const servicios = await res.json();

    if (!Array.isArray(servicios) || servicios.length === 0) {
      grid.innerHTML =
        "<p style='text-align:center;color:#b0b0c0'>No hay servicios activos disponibles.</p>";
      return [];
    }

    grid.innerHTML = servicios.map(buildServiceItem).join("");
    return servicios; // devolvemos para encadenar inicialización
  } catch (e) {
    console.error("Error cargando servicios:", e);
    grid.innerHTML =
      "<p style='text-align:center;color:#ff6b6b'>Error al cargar los servicios. Intenta más tarde.</p>";
    return [];
  }
}

/* ---------- Animaciones de aparición ---------- */
function initServiceRevealObserver() {
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const el = entry.target;
        if (entry.isIntersecting) {
          el.classList.add("is-visible");
          el.style.animation = "fadeInUp 0.8s ease-out forwards";
        } else {
          el.classList.remove("is-visible");
        }
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -120px 0px" }
  );

  document.querySelectorAll(".service-item").forEach((el) => io.observe(el));
}

/* ---------- Overscan adaptativo (servicios + CTA) ---------- */
function computeOverscanScale() {
  const apply = (box) => {
    const inner = box.querySelector("img, .service-image-placeholder");
    if (!inner) return;
    const h = box.clientHeight || 500;
    const minScale = 1 + (2 * MAX_SHIFT) / h; // cubrir ±MAX_SHIFT
    const cssScale =
      parseFloat(getComputedStyle(inner).getPropertyValue("--scale")) || 1.12;
    inner.style.setProperty("--scale", Math.max(cssScale, minScale).toFixed(3));
  };

  document.querySelectorAll(".service-image").forEach(apply);
  const ctaBox = document.querySelector(".cta-media");
  if (ctaBox) apply(ctaBox);
}

/* ---------- Parallax por item (solo contenido interno) ---------- */
function updateServiceParallax() {
  const vh = window.innerHeight || 0;
  document.querySelectorAll(".service-item").forEach((item) => {
    const rect = item.getBoundingClientRect();

    // Reset si está fuera
    if (rect.bottom < 0 || rect.top > vh) {
      const inner = item.querySelector(
        ".service-image > img, .service-image .service-image-placeholder"
      );
      if (inner) inner.style.setProperty("--py", "0px");
      return;
    }

    // Progreso del item en viewport
    const progress = clamp(0, (vh - rect.top) / (vh + rect.height), 1);
    const centered = progress - 0.5;

    const invert = item.classList.contains("reverse") ? -1 : 1;
    const shift = centered * MAX_SHIFT * invert;

    const inner = item.querySelector(
      ".service-image > img, .service-image .service-image-placeholder"
    );
    if (inner) inner.style.setProperty("--py", `${Math.round(shift)}px`);
  });
}

/* ---------- Parallax CTA (misma mecánica) ---------- */
function updateCtaParallax() {
  const box = document.querySelector(".cta-media");
  if (!box) return;
  const img = box.querySelector("img");
  if (!img) return;

  const vh = window.innerHeight || 0;
  const section = box.closest(".cta");
  const rect = section.getBoundingClientRect();

  if (rect.bottom < 0 || rect.top > vh) {
    img.style.setProperty("--py", "0px");
    return;
  }

  const progress = clamp(0, (vh - rect.top) / (vh + rect.height), 1);
  const centered = progress - 0.5;
  const shift = centered * MAX_SHIFT;

  img.style.setProperty("--py", `${Math.round(shift)}px`);
}

/* ---------- Boot ---------- */
document.addEventListener("DOMContentLoaded", () => {
  const hero = document.getElementById("hero");
  const heroBg = document.querySelector(".hero-bg");
  const speedHero = parseFloat(heroBg?.dataset.speed || "0.35");

  let ticking = false;
  function onScroll() {
    if (ticking) return;
    requestAnimationFrame(() => {
      // Parallax del HERO
      if (hero && heroBg) {
        const r = hero.getBoundingClientRect();
        const offset = -r.top * speedHero;
        heroBg.style.transform = `translateY(${offset}px) scale(1.08)`;
      }

      // Servicios y CTA
      updateServiceParallax();
      updateCtaParallax();

      ticking = false;
    });
    ticking = true;
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", () => {
    computeOverscanScale();
    updateServiceParallax();
    updateCtaParallax();
    onScroll();
  });

  cargarServiciosPublicos().then(() => {
    initServiceRevealObserver();
    computeOverscanScale(); // adapta la escala a la altura real
    updateServiceParallax(); // primer cálculo
    updateCtaParallax(); // primer cálculo
    onScroll(); // hero
  });
});
