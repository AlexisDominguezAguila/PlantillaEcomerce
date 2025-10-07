/* -------------------------
         Estado / datos simulados
      ------------------------- */
const state = {
  tenants: [
    {
      id: "t1",
      name: "RoosFood",
      domain: "roosfood.tenant.tecrivera.com",
      createdAt: "2025-09-10",
    },
    {
      id: "t2",
      name: "La Casita",
      domain: "casita.tenant.tecrivera.com",
      createdAt: "2025-08-02",
    },
    {
      id: "t3",
      name: "Coffee Bar",
      domain: "coffee.tenant.tecrivera.com",
      createdAt: "2025-10-01",
    },
  ],
  modulesLibrary: [
    "inicio",
    "nosotros",
    "catálogo de productos",
    "servicios (cards)",
    "reseñas",
    "estadísticas",
    "misión y visión",
    "testimonios",
    "contacto",
    "ubicación (mapa)",
  ],
  apps: [
    {
      id: "a1",
      name: "Landing RoosFood",
      type: "landing",
      tenant: "t1",
      subdomain: "roosfood",
      status: "activo",
      modules: ["inicio", "servicios (cards)", "contacto"],
      plan: "Pro",
      start: "2025-07-01",
      end: "2026-01-01",
    },
    {
      id: "a2",
      name: "Web La Casita",
      type: "web",
      tenant: "t2",
      subdomain: "casita",
      status: "en-pausa",
      modules: ["inicio", "nosotros", "catálogo de productos", "contacto"],
      plan: "Básico",
      start: "2025-08-01",
      end: "2025-09-01",
    },
    {
      id: "a3",
      name: "Landing Coffee",
      type: "landing",
      tenant: "t3",
      subdomain: "coffee",
      status: "pendiente",
      modules: ["inicio", "testimonios", "ubicación (mapa)"],
      plan: "Anual",
      start: "2025-10-01",
      end: "2026-10-01",
    },
  ],
  activity: [
    { when: "2025-10-05 10:00", text: "Se creó la app Landing Coffee" },
    {
      when: "2025-10-04 16:45",
      text: "Se renovó plan Pro para Landing RoosFood",
    },
    {
      when: "2025-10-02 09:12",
      text: "Se añadió módulo 'estadísticas' a Web La Casita",
    },
  ],
  charts: {
    months: [
      "Ene",
      "Feb",
      "Mar",
      "Abr",
      "May",
      "Jun",
      "Jul",
      "Ago",
      "Sep",
      "Oct",
      "Nov",
      "Dic",
    ],
    plans: [3, 4, 2, 5, 6, 5, 7, 4, 6, 8, 0, 0],
  },
};

const persisted = JSON.parse(localStorage.getItem("tr_state") || "{}");
state.currentTenantId = persisted.currentTenantId || state.tenants[0]?.id;

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

/* =========================
         SIDEBAR: navegación y colapso
      ========================= */
const routes = $$(".sidebar .nav__item");
routes.forEach((a) => {
  a.addEventListener("click", (ev) => {
    // ripple
    const rect = a.getBoundingClientRect();
    const r = document.createElement("span");
    r.className = "ripple";
    r.style.left = ev.clientX - rect.left + "px";
    r.style.top = ev.clientY - rect.top + "px";
    a.appendChild(r);
    setTimeout(() => r.remove(), 650);

    routes.forEach((n) => n.classList.remove("is-active"));
    a.classList.add("is-active");
    const view = a.dataset.route;
    const current = document.querySelector(".view.is-active");
    const next = document.querySelector(`.view[data-view="${view}"]`);
    if (current === next) return;
    current?.classList.remove("is-active");
    requestAnimationFrame(() => next?.classList.add("is-active"));
    window.scrollTo({ top: 0, behavior: "smooth" });
    document.dispatchEvent(
      new CustomEvent("routechange", { detail: { route: view } })
    );
  });
});

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
   SIDEBAR: modo móvil (hamburguesa)
========================= */
const scrim = byId("scrim");
const sidebarEl = byId("sidebar");
const mobileBtn = byId("hamburger"); // el de tu HTML

// Helpers
const isMobile = () => window.matchMedia("(max-width: 1024px)").matches;

function openSidebarMobile() {
  if (!isMobile()) return;
  sidebarEl.classList.add("mobile-open");
  if (scrim) scrim.hidden = false;
}

function closeSidebarMobile() {
  sidebarEl.classList.remove("mobile-open");
  if (scrim) scrim.hidden = true;
}

function toggleSidebarMobile() {
  if (!isMobile()) return;
  const opened = sidebarEl.classList.toggle("mobile-open");
  if (scrim) scrim.hidden = !opened;
}

// Botón hamburguesa (abre/cierra y anima el ícono)
mobileBtn?.addEventListener("click", () => {
  mobileBtn.classList.toggle("active");
  toggleSidebarMobile();
});

// Cerrar al tocar fuera
scrim?.addEventListener("click", () => {
  mobileBtn?.classList.remove("active");
  closeSidebarMobile();
});

// Cerrar con ESC
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    mobileBtn?.classList.remove("active");
    closeSidebarMobile();
  }
});

// Cerrar al cambiar de ruta en móvil
document.addEventListener("routechange", () => {
  if (isMobile()) {
    mobileBtn?.classList.remove("active");
    closeSidebarMobile();
  }
});

// Limpiar al pasar a escritorio
window.addEventListener("resize", () => {
  if (!isMobile()) {
    mobileBtn?.classList.remove("active");
    closeSidebarMobile();
  }
});

/* =========================
         TOPBAR
      ========================= */
byId("userBtn")?.addEventListener("click", () => {
  const d = byId("userDropdown");
  if (!d) return;
  d.hidden = !d.hidden;
});
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

// búsqueda global
byId("doSearch")?.addEventListener("click", () => {
  const q = byId("globalSearch")?.value?.trim() || "";
  if (!q) {
    toast("Ingresa un término de búsqueda", "warn");
    return;
  }
  renderApps(q);
  renderTenants(q);
  renderContracts(q);
});

byId("notifBtn")?.addEventListener("click", () => {
  toast("No tienes nuevas notificaciones");
  const dot = byId("notifDot");
  if (dot) dot.style.display = "none";
});
byId("quickCreate")?.addEventListener("click", () => {
  openDialog(byId("modalTenant"));
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
          </div>`
    )
    .join("");
  $$(".tenant-option", dd).forEach((opt) => {
    opt.addEventListener("click", () => {
      state.currentTenantId = opt.dataset.id;
      savePersist();
      dd.setAttribute("hidden", "");
      dd.classList.remove("show");
      toast("Tenant cambiado", "success");
      document.dispatchEvent(
        new CustomEvent("tenantchange", {
          detail: { tenantId: state.currentTenantId },
        })
      );
    });
  });
}
byId("currentTenantBtn")?.addEventListener("click", () => {
  const d = byId("tenantDropdown");
  if (!d) return;
  if (d.hasAttribute("hidden")) {
    d.removeAttribute("hidden");
    void d.offsetWidth;
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
byId("openCreateTenant")?.addEventListener("click", () =>
  openDialog(byId("modalTenant"))
);

/* =========================
         Utils
      ========================= */
const uid = (p = "id") => p + Math.random().toString(36).slice(2, 9);
const tenantById = (id) => state.tenants.find((t) => t.id === id);
const appById = (id) => state.apps.find((a) => a.id === id);
const fullDomain = (sub) => `${sub}.tecrivera.com`;
const statusBadge = (s) => `<span class="status ${s}">${s}</span>`;
const addActivity = (txt) => {
  state.activity.unshift({
    when: dayjs().format("YYYY-MM-DD HH:mm"),
    text: txt,
  });
  renderActivity();
  toast(txt, "success");
};
const openDialog = (el) => {
  el?.showModal();
};
const closeDialog = (el) => {
  el?.close();
};
const showLoader = (v) => {
  byId("globalLoader").hidden = !v;
};

/* =========================
         Render
      ========================= */
function renderStats() {
  byId("kpiTenants").textContent = state.tenants.length;
  byId("kpiApps").textContent = state.apps.length;
  const a = state.apps.filter((x) => x.status === "activo").length;
  const p = state.apps.filter((x) => x.status === "en-pausa").length;
  byId("kpiActive").textContent = a;
  byId("kpiPaused").textContent = p;
}

function renderTenants(filter = "") {
  const tb = byId("tbTenants");
  tb.innerHTML = "";
  state.tenants
    .filter((t) =>
      (t.name + t.domain).toLowerCase().includes(filter.toLowerCase())
    )
    .forEach((t) => {
      const appsCount = state.apps.filter((a) => a.tenant === t.id).length;
      tb.insertAdjacentHTML(
        "beforeend",
        `
              <tr>
                <td><strong>${t.name}</strong></td>
                <td><span class="muted">${t.domain}</span></td>
                <td>${appsCount}</td>
                <td>${dayjs(t.createdAt).format("DD/MM/YYYY")}</td>
                <td class="right">
                  <button class="btn btn--ghost" onclick="prefillNewApp('${
                    t.id
                  }')"><i class="bx bx-plus"></i></button>
                  <button class="btn btn--ghost" onclick="copyText('${
                    t.domain
                  }')"><i class="bx bx-copy"></i></button>
                </td>
              </tr>
            `
      );
    });
}

let changeDomainAppId = null;
let manageModulesAppId = null;
let deleteAppId = null;

function renderApps(filter = "") {
  const tb = byId("tbApps");
  tb.innerHTML = "";
  state.apps
    .filter((a) =>
      (a.name + a.subdomain + a.type)
        .toLowerCase()
        .includes(filter.toLowerCase())
    )
    .forEach((a) => {
      const t = tenantById(a.tenant);
      tb.insertAdjacentHTML(
        "beforeend",
        `
              <tr>
                <td><strong>${a.name}</strong></td>
                <td><span class="muted">${fullDomain(a.subdomain)}</span></td>
                <td>${a.type}</td>
                <td>${t ? t.name : "-"}</td>
                <td>${statusBadge(a.status)}</td>
                <td>${a.modules
                  .map(
                    (m) =>
                      `<span class="module-chip"><i class='bx bx-palette'></i>${m}</span>`
                  )
                  .join("")}</td>
                <td class="right table-actions">
                  <button class="btn btn--ghost" title="Dominio" onclick="openChangeDomain('${
                    a.id
                  }')"><i class="bx bx-globe"></i></button>
                  <button class="btn btn--ghost" title="Módulos" onclick="openManageModules('${
                    a.id
                  }')"><i class="bx bx-cube"></i></button>
                  <button class="btn btn--ghost" title="Eliminar" onclick="openDelete('${
                    a.id
                  }')"><i class="bx bx-trash"></i></button>
                </td>
              </tr>
            `
      );
    });
}

function renderContracts(filter = "") {
  const tb = byId("tbContracts");
  tb.innerHTML = "";
  state.apps
    .filter((a) =>
      (a.name + (tenantById(a.tenant)?.name || ""))
        .toLowerCase()
        .includes(filter.toLowerCase())
    )
    .forEach((a) => {
      const t = tenantById(a.tenant);
      const now = dayjs();
      const start = dayjs(a.start);
      const end = dayjs(a.end);
      const remaining = end.diff(now);
      const isExpired = remaining <= 0;
      const dur = dayjs.duration(Math.max(remaining, 0), "millisecond");
      const remainStr = `${dur.months()}m ${dur.days()}d ${String(
        dur.hours()
      ).padStart(2, "0")}:${String(dur.minutes()).padStart(2, "0")}:${String(
        dur.seconds()
      ).padStart(2, "0")}`;
      const soon = !isExpired && end.diff(now, "day") <= 5;

      if (isExpired && a.status !== "en-pausa") {
        a.status = "en-pausa";
        addActivity(
          `El contrato de ${a.name} venció. Estado cambiado a "en pausa".`
        );
        renderApps();
        renderStats();
        renderCharts();
      }
      tb.insertAdjacentHTML(
        "beforeend",
        `
              <tr>
                <td>${a.name}</td>
                <td>${t ? t.name : "-"}</td>
                <td>${a.plan}</td>
                <td>${start.format("DD/MM/YYYY")}</td>
                <td>${end.format("DD/MM/YYYY")}</td>
                <td><span class="countdown ${
                  isExpired ? "timer-expired" : soon ? "timer-soon" : ""
                }" data-app="${a.id}" data-end="${a.end}">${
          isExpired ? "Vencido" : remainStr
        }</span></td>
                <td>${statusBadge(a.status)}</td>
              </tr>
            `
      );
    });
}

function renderModulesLibrary() {
  const wrap = byId("modulesLibrary");
  wrap.innerHTML = "";
  state.modulesLibrary.forEach((m) => {
    wrap.insertAdjacentHTML(
      "beforeend",
      `<span class="module-chip" onclick="copyText('${m}')"><i class='bx bx-palette'></i>${m}</span>`
    );
  });
}

function renderActivity() {
  const ul = byId("activityFeed");
  ul.innerHTML = "";
  state.activity.slice(0, 12).forEach((i) => {
    ul.insertAdjacentHTML(
      "beforeend",
      `
            <li style="display:flex;gap:8px;align-items:center">
              <span class="badge">${dayjs(i.when).format("DD/MM HH:mm")}</span>
              <span>${i.text}</span>
            </li>
          `
    );
  });
}

/* =========================
         Charts
      ========================= */
let chartPlans, chartStatus;
function renderCharts() {
  const ctx1 = byId("chartPlans");
  const ctx2 = byId("chartStatus");
  const stacked = byId("switchBars").checked;

  if (chartPlans) chartPlans.destroy();
  chartPlans = new Chart(ctx1, {
    type: stacked ? "bar" : "line",
    data: {
      labels: state.charts.months,
      datasets: [
        {
          label: "Planes",
          data: state.charts.plans,
          borderWidth: 2,
          tension: 0.25,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: { legend: { display: false } },
      scales: { y: { beginAtZero: true } },
    },
  });

  const active = state.apps.filter((a) => a.status === "activo").length;
  const paused = state.apps.filter((a) => a.status === "en-pausa").length;
  const pending = state.apps.filter((a) => a.status === "pendiente").length;

  if (chartStatus) chartStatus.destroy();
  chartStatus = new Chart(ctx2, {
    type: "doughnut",
    data: {
      labels: ["Activas", "En pausa", "Pendientes"],
      datasets: [{ data: [active, paused, pending] }],
    },
    options: { plugins: { legend: { position: "bottom" } } },
  });
}
byId("switchBars")?.addEventListener("change", renderCharts);

/* =========================
         Interacciones
      ========================= */
function prefillNewApp(tenantId) {
  // Cambia a vista apps y abre modal
  document.querySelector('.nav__item[data-route="apps"]').click();
  byId("appTenantSelect").value = tenantId;
  openDialog(byId("modalApp"));
}
window.prefillNewApp = prefillNewApp;

function fillTenantSelect() {
  const sel = byId("appTenantSelect");
  sel.innerHTML = "";
  state.tenants.forEach((t) =>
    sel.insertAdjacentHTML(
      "beforeend",
      `<option value="${t.id}">${t.name}</option>`
    )
  );
}
function fillModulesPicker(container, selected = []) {
  container.innerHTML = "";
  state.modulesLibrary.forEach((m) => {
    const id = uid("mod");
    container.insertAdjacentHTML(
      "beforeend",
      `
            <label class="check"><input type="checkbox" value="${m}" ${
        selected.includes(m) ? "checked" : ""
      }/> ${m}</label>
          `
    );
  });
}

// abrir gestionar módulos
function openManageModules(appId) {
  manageModulesAppId = appId;
  const app = appById(appId);
  byId("mmAppName").textContent = app.name;
  fillModulesPicker(byId("mmModules"), app.modules);
  openDialog(byId("modalManageModules"));
}
window.openManageModules = openManageModules;

byId("btnSaveModules").addEventListener("click", () => {
  const checks = $$("#mmModules input[type='checkbox']");
  const mods = checks.filter((c) => c.checked).map((c) => c.value);
  const app = appById(manageModulesAppId);
  app.modules = mods;
  addActivity(`Se actualizaron módulos de ${app.name}`);
  closeDialog(byId("modalManageModules"));
  renderApps();
});

// abrir cambiar dominio
function openChangeDomain(appId) {
  changeDomainAppId = appId;
  const app = appById(appId);
  byId("changeDomainInput").value = app.subdomain;
  openDialog(byId("modalChangeDomain"));
}
window.openChangeDomain = openChangeDomain;

byId("btnConfirmChangeDomain").addEventListener("click", () => {
  const val = byId("changeDomainInput").value.trim();
  if (!val) {
    toast("Ingresa el subdominio", "warn");
    return;
  }
  const app = appById(changeDomainAppId);
  app.subdomain = val;
  app.status = app.status === "pendiente" ? "activo" : app.status;
  addActivity(`Dominio actualizado: ${app.name} → ${fullDomain(val)}`);
  closeDialog(byId("modalChangeDomain"));
  renderApps();
  renderContracts();
  renderStats();
  renderCharts();
});

// eliminar
function openDelete(appId) {
  deleteAppId = appId;
  byId("delAppName").textContent = appById(appId).name;
  openDialog(byId("modalConfirmDelete"));
}
window.openDelete = openDelete;

byId("btnDeleteApp").addEventListener("click", () => {
  const idx = state.apps.findIndex((a) => a.id === deleteAppId);
  const name = state.apps[idx].name;
  state.apps.splice(idx, 1);
  closeDialog(byId("modalConfirmDelete"));
  addActivity(`Aplicación eliminada: ${name}`);
  renderApps();
  renderContracts();
  renderStats();
  renderCharts();
});

// crear tenant
byId("btnOpenNewTenant")?.addEventListener("click", () =>
  openDialog(byId("modalTenant"))
);
byId("openCreateTenant")?.addEventListener("click", () =>
  openDialog(byId("modalTenant"))
);
byId("createTenantConfirm").addEventListener("click", () => {
  const name = byId("tenantNameInput").value.trim();
  const domain = byId("tenantDomainInput").value.trim();
  if (!name || !domain) {
    toast("Completa nombre y dominio", "warn");
    return;
  }
  state.tenants.push({
    id: uid("t"),
    name,
    domain,
    createdAt: dayjs().format("YYYY-MM-DD"),
  });
  byId("tenantNameInput").value = "";
  byId("tenantDomainInput").value = "";
  closeDialog(byId("modalTenant"));
  addActivity(`Nuevo tenant creado: ${name}`);
  renderTenantSwitcher();
  renderTenants();
  fillTenantSelect();
  renderStats();
});

// crear app
byId("btnOpenNewApp")?.addEventListener("click", () =>
  openDialog(byId("modalApp"))
);
function initNewAppModal() {
  fillModulesPicker(byId("appModulesPicker"));
}
byId("createAppConfirm").addEventListener("click", () => {
  const name = byId("appNameInput").value.trim();
  const type = byId("appTypeSelect").value;
  const sub = byId("appSubInput").value.trim();
  const tenant = byId("appTenantSelect").value;
  const plan = byId("appPlanSelect").value;
  const start = byId("appStartInput").value || dayjs().format("YYYY-MM-DD");
  if (!name || !sub || !tenant) {
    toast("Completa nombre, subdominio y tenant", "warn");
    return;
  }
  const months = plan === "Básico" ? 1 : plan === "Pro" ? 6 : 12;
  const end = dayjs(start).add(months, "month").format("YYYY-MM-DD");
  const modules = $$("#appModulesPicker input[type='checkbox']")
    .filter((c) => c.checked)
    .map((c) => c.value);
  state.apps.push({
    id: uid("a"),
    name,
    type,
    tenant,
    subdomain: sub,
    status: "pendiente",
    modules,
    plan,
    start,
    end,
  });
  byId("appNameInput").value = "";
  byId("appSubInput").value = "";
  $$("#appModulesPicker input").forEach((i) => (i.checked = false));
  closeDialog(byId("modalApp"));
  addActivity(`Nueva aplicación creada: ${name} (${fullDomain(sub)})`);
  renderApps();
  renderContracts();
  renderStats();
  renderCharts();
});

// modal de perfil de usuario

// Estado de usuario (si no existe)
state.user ??= {
  name: "Admin",
  email: "admin@tecrivera.com",
  avatar: "images/perfil.jpg",
};

// Abrir modal de perfil
function openUserProfile() {
  // Prefill
  byId("userNameInput").value = state.user.name || "";
  byId("userEmailInput").value = state.user.email || "";
  byId("userPasswordInput").value = ""; // vacío a propósito

  // Cerrar el dropdown de usuario si está abierto
  const dd = byId("userDropdown");
  if (dd && !dd.hidden) dd.hidden = true;

  openDialog(byId("modalUserProfile"));
}

// Guardar perfil
function saveUserProfile() {
  const name = byId("userNameInput").value.trim();
  const email = byId("userEmailInput").value.trim();
  const pwd = byId("userPasswordInput").value; // opcional

  if (!name || !email) {
    toast("Completa nombre y email", "warn");
    return;
  }

  // Actualiza estado
  state.user.name = name;
  state.user.email = email;

  // Si ingresó una contraseña, aquí solo la simulamos (no persistimos)
  if (pwd) {
    addActivity("Se actualizó la contraseña del usuario");
  }

  // Refrescar nombre en la topbar (si tienes .user__name)
  const nameEl = document.querySelector(".user__name");
  if (nameEl) nameEl.textContent = state.user.name;

  closeDialog(byId("modalUserProfile"));
  toast("Perfil actualizado", "success");
  addActivity("Perfil de usuario actualizado");
}

// Listeners
byId("btnOpenProfile")?.addEventListener("click", openUserProfile);
byId("btnSaveProfile")?.addEventListener("click", (e) => {
  e.preventDefault();
  saveUserProfile();
});

// Export/Import JSON
byId("btnExportConfig").addEventListener("click", () => {
  const blob = new Blob([JSON.stringify(state, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "tenant_config.json";
  a.click();
  URL.revokeObjectURL(url);
});
byId("importConfig").addEventListener("change", async (e) => {
  const file = e.target.files[0];
  if (!file) return;
  try {
    const txt = await file.text();
    const data = JSON.parse(txt);
    if (data.tenants && data.apps) {
      state.tenants = data.tenants;
      state.apps = data.apps;
      if (data.modulesLibrary) state.modulesLibrary = data.modulesLibrary;
      if (data.activity) state.activity = data.activity;
      if (data.charts) state.charts = data.charts;
      addActivity("Se importó configuración JSON");
      refreshAll();
    } else {
      toast("Archivo inválido", "warn");
    }
  } catch (err) {
    toast("No se pudo importar", "danger");
  }
  e.target.value = "";
});

// Countdown
function tickCountdowns() {
  $$(".countdown").forEach((el) => {
    const end = dayjs(el.dataset.end);
    const now = dayjs();
    const diff = end.diff(now);
    if (diff <= 0) {
      el.textContent = "Vencido";
      el.classList.add("timer-expired");
      return;
    }
    const d = dayjs.duration(diff);
    el.textContent = `${d.months()}m ${d.days()}d ${String(d.hours()).padStart(
      2,
      "0"
    )}:${String(d.minutes()).padStart(2, "0")}:${String(d.seconds()).padStart(
      2,
      "0"
    )}`;
    if (end.diff(now, "day") <= 5) el.classList.add("timer-soon");
  });
}
setInterval(tickCountdowns, 1000);

// Copiar
function copyText(txt) {
  navigator.clipboard.writeText(txt);
  toast("Copiado: " + txt, "success");
}
window.copyText = copyText;

// Inicialización
function refreshAll() {
  renderStats();
  renderTenantSwitcher();
  renderTenants(byId("searchTenants").value || "");
  renderApps(byId("searchApps").value || "");
  renderContracts(byId("searchContracts").value || "");
  renderModulesLibrary();
  renderActivity();
  renderCharts();
  initNewAppModal();
  tickCountdowns();
}
byId("searchTenants").addEventListener("input", (e) =>
  renderTenants(e.target.value)
);
byId("searchApps").addEventListener("input", (e) => renderApps(e.target.value));
byId("searchContracts").addEventListener("input", (e) =>
  renderContracts(e.target.value)
);

// Ready
requestAnimationFrame(() => byId("sidebar")?.classList.add("ready"));
refreshAll();
