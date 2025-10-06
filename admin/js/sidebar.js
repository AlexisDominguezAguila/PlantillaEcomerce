/* -------------------------
   Estado / datos simulados
------------------------- */
const state = {
  tenants: [
    {
      id: "t1",
      name: "RoosFood",
      domain: "roosfood.tenant.tecrivera.com",
      apps: 3,
      status: "activo",
    },
    {
      id: "t2",
      name: "La Casita",
      domain: "casita.tenant.tecrivera.com",
      apps: 2,
      status: "en-pausa",
    },
    {
      id: "t3",
      name: "Coffee Bar",
      domain: "coffee.tenant.tecrivera.com",
      apps: 1,
      status: "pendiente",
    },
  ],
  apps: [
    { id: "a1", tenant: "t1", type: "restaurant", name: "POS Restaurante" },
    { id: "a2", tenant: "t1", type: "menu", name: "Carta QR" },
    { id: "a3", tenant: "t1", type: "other", name: "Reservas" },
    { id: "a4", tenant: "t2", type: "restaurant", name: "POS Restaurante" },
    { id: "a5", tenant: "t2", type: "menu", name: "Carta QR" },
    { id: "a6", tenant: "t3", type: "menu", name: "Carta QR" },
  ],
  orders: Array.from({ length: 14 }).map((_, i) => ({
    id: 1200 + i,
    customer: ["Luis", "Ana", "María", "Jorge", "Rosa"][i % 5],
    total: (30 + Math.random() * 80).toFixed(2),
    status: ["Pagado", "Pendiente", "Cancelado"][i % 3],
    date: new Date(Date.now() - i * 36e5).toLocaleString(),
  })),
  menu: [
    {
      id: "s1",
      title: "Entradas",
      items: [
        { id: "i1", name: "Causa limeña", price: 18.9 },
        { id: "i2", name: "Papa a la huancaína", price: 14.5 },
      ],
    },
    {
      id: "s2",
      title: "Platos fuertes",
      items: [
        { id: "i3", name: "Lomo saltado", price: 28.5 },
        { id: "i4", name: "Ají de gallina", price: 23.0 },
      ],
    },
  ],
  quickItems: [
    { name: "Pollo a la brasa", price: 39.9, cat: "Platos fuertes" },
    { name: "Chicha morada", price: 8.0, cat: "Bebidas" },
    { name: "Suspiro a la limeña", price: 12.0, cat: "Postres" },
  ],
};
const persisted = JSON.parse(localStorage.getItem("tr_state") || "{}");
if (persisted.currentTenantId) {
  state.currentTenantId = persisted.currentTenantId;
} else {
  state.currentTenantId = state.tenants[0]?.id;
}

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
const byId = (id) => document.getElementById(id);

function toast(msg, type = "") {
  const wrap = byId("toastWrap");
  if (!wrap) {
    alert(msg);
    return;
  }
  const el = document.createElement("div");
  el.className = `toast ${type}`;
  el.innerHTML = `<i class='bx bx-info-circle'></i><div>${msg}</div>`;
  wrap.appendChild(el);
  setTimeout(() => el.remove(), 3200);
}
function savePersist() {
  localStorage.setItem(
    "tr_state",
    JSON.stringify({ currentTenantId: state.currentTenantId })
  );
}

/* Restaurar tenant actual si existe en localStorage */
(() => {
  const persisted = JSON.parse(localStorage.getItem("tr_state") || "{}");
  if (persisted.currentTenantId)
    state.currentTenantId = persisted.currentTenantId;
  else state.currentTenantId ??= state.tenants?.[0]?.id ?? null;
})();

/* =========================
   SIDEBAR: navegación y colapso
========================= */
const routes = $$(".sidebar .nav__item");
/* Cambio de vista + clase activa */
routes.forEach((a) => {
  a.addEventListener("click", () => {
    routes.forEach((n) => n.classList.remove("is-active"));
    a.classList.add("is-active");

    const view = a.dataset.route;
    const current = document.querySelector(".view.is-active");
    const next = document.querySelector(`.view[data-view="${view}"]`);
    if (current === next) return;

    current?.classList.remove("is-active");
    requestAnimationFrame(() => next?.classList.add("is-active"));

    window.scrollTo({ top: 0, behavior: "smooth" });

    // Avisar al resto de la app (opcional)
    document.dispatchEvent(
      new CustomEvent("routechange", { detail: { route: view } })
    );
  });
});

/* Botón para colapsar/expandir sidebar con persistencia */
byId("sidebarToggle")?.addEventListener("click", () => {
  byId("sidebar").classList.toggle("collapsed");
  localStorage.setItem(
    "tr_sidebar_collapsed",
    JSON.stringify(byId("sidebar").classList.contains("collapsed"))
  );
});
if (JSON.parse(localStorage.getItem("tr_sidebar_collapsed") || "false")) {
  byId("sidebar")?.classList.add("collapsed");
}

/* =========================
   TOPBAR: menú de usuario
========================= */
byId("userBtn")?.addEventListener("click", () => {
  const d = byId("userDropdown");
  if (!d) return;
  d.hidden = !d.hidden;
});

/* Cerrar menús al hacer click fuera (user menu + tenant dropdown) */
document.addEventListener("click", (e) => {
  if (!e.target.closest(".user-menu"))
    byId("userDropdown") && (byId("userDropdown").hidden = true);

  const dd = byId("tenantDropdown");
  if (dd && !e.target.closest(".tenant-switch") && !dd.hasAttribute("hidden")) {
    dd.classList.remove("show");
    dd.addEventListener(
      "transitionend",
      function onEnd() {
        dd.setAttribute("hidden", "");
        dd.removeEventListener("transitionend", onEnd);
      },
      { once: true }
    );
  }
});

/* =========================
   SIDEBAR: Tenant switcher
========================= */
function renderTenantSwitcher() {
  const dd = byId("tenantDropdown");
  const current = state.tenants.find((x) => x.id === state.currentTenantId);
  byId("currentTenantName").textContent = current ? current.name : "—";

  dd.innerHTML = (state.tenants || [])
    .map(
      (x) => `
    <div class="tenant-option" data-id="${x.id}">
      <i class='bx bx-buildings'></i>
      <div>
        <div><strong>${x.name}</strong></div>
        <small class="muted">${x.domain}</small>
      </div>
      ${
        x.id === state.currentTenantId
          ? "<span style='margin-left:auto' class='badge'>Actual</span>"
          : ""
      }
    </div>
  `
    )
    .join("");

  $$(".tenant-option", dd).forEach((opt) => {
    opt.addEventListener("click", () => {
      state.currentTenantId = opt.dataset.id;
      savePersist();
      dd.setAttribute("hidden", "");
      dd.classList.remove("show");
      toast("Tenant cambiado", "success");
      // Notificar al resto de la app
      document.dispatchEvent(
        new CustomEvent("tenantchange", {
          detail: { tenantId: state.currentTenantId },
        })
      );
    });
  });
}

/* Abrir/cerrar dropdown (con fade/scale si tienes CSS .show) */
byId("currentTenantBtn")?.addEventListener("click", () => {
  const d = byId("tenantDropdown");
  if (!d) return;
  if (d.hasAttribute("hidden")) {
    d.removeAttribute("hidden");
    void d.offsetWidth; // reflow para iniciar transición
    d.classList.add("show");
  } else {
    d.classList.remove("show");
    d.addEventListener(
      "transitionend",
      function onEnd() {
        d.setAttribute("hidden", "");
        d.removeEventListener("transitionend", onEnd);
      },
      { once: true }
    );
  }
});

/* =========================
   TOPBAR: búsqueda, notificaciones y acción rápida
========================= */
/* Búsqueda global: solo emite evento con el término */
byId("globalSearchForm")?.addEventListener("submit", (e) => {
  e.preventDefault();
  const q = byId("globalSearch")?.value?.trim() || "";
  if (!q) {
    toast("Ingresa un término de búsqueda", "warn");
    return;
  }
  document.dispatchEvent(
    new CustomEvent("globalsearch", { detail: { query: q } })
  );
});

/* Notificaciones */
byId("notifBtn")?.addEventListener("click", () => {
  toast("No tienes nuevas notificaciones");
  const dot = byId("notifDot");
  if (dot) dot.style.display = "none";
});

/* Acción rápida (por ejemplo, abrir modal de nuevo tenant) */
byId("quickCreate")?.addEventListener("click", () => {
  document.dispatchEvent(new CustomEvent("open-create-tenant"));
});

/* =========================
   Init
========================= */
renderTenantSwitcher();
/* Marca el sidebar como listo para animaciones "staggered" (si tienes CSS .ready) */
requestAnimationFrame(() => byId("sidebar")?.classList.add("ready"));
