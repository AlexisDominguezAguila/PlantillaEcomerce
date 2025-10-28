// Igual que tu otro módulo: si no te inyectan una ruta, usa la relativa por defecto
if (typeof window.PRICING_API === 'undefined') {
  window.PRICING_API = "../controllers/PricingController.php";
}

const esc = s => String(s ?? "").replace(/[&<>"']/g, m => (
  {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[m]
));

let plans = [];
let editId = null;

// -------- util para leer JSON y diagnosticar 404/HTML --------
async function fetchJson(url, opts) {
  const res  = await fetch(url, opts);
  const text = await res.text();
  try {
    return JSON.parse(text);
  } catch {
    throw new Error(`No recibí JSON de ${url}\nHTTP ${res.status}\n${text.slice(0,200)}`);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  loadPlans();
  document.getElementById('btnNewPlan')?.addEventListener('click', () => openModal());
  document.getElementById('planForm')?.addEventListener('submit', onSubmit);
  document.getElementById('modalClose')?.addEventListener('click', closeModal);
  document.getElementById('adminModal')?.addEventListener('click', e => {
    if (e.target.id === 'adminModal') closeModal();
  });
});

async function loadPlans() {
  try {
    const j = await fetchJson(`${window.PRICING_API}?action=listar`, { cache:'no-store' });
    plans = (j && j.success && Array.isArray(j.data)) ? j.data : [];
  } catch (e) {
    console.error(e);
    alert(e.message);
    plans = [];
  }
  renderList();
}

function renderList() {
  const tbody = document.getElementById('plansTbody');
  const empty = document.getElementById('emptyState');
  if (!tbody) return;

  tbody.innerHTML = plans.map(p => `
    <tr>
      <td>${esc(p.name)}</td>
      <td>S/${Number(p.price_amount ?? 0).toFixed(0)}</td>
      <td>${esc(p.period_note || '')}</td>
      <td>${Number(p.is_featured)===1 ? '<span class="badge badge-green">Destacado</span>' : '<span class="badge">—</span>'}</td>
      <td>${esc(p.badge_text || '')}</td>
      <td class="nowrap">${Number(p.display_order ?? 0)}</td>
      <td class="nowrap">
        <button class="btn sm" title="Subir" onclick="movePlan(${p.id}, 'up')"><i class="bx bx-chevron-up"></i></button>
        <button class="btn sm" title="Bajar" onclick="movePlan(${p.id}, 'down')"><i class="bx bx-chevron-down"></i></button>
        <button class="btn sm" onclick="editPlan(${p.id})"><i class="bx bx-edit"></i></button>
        <button class="btn sm danger" onclick="deletePlan(${p.id})"><i class="bx bx-trash"></i></button>
      </td>
    </tr>
  `).join('');

  const isEmpty = plans.length === 0;
  if (empty) empty.style.display = isEmpty ? 'block' : 'none';

  // Counters opcionales (tu vista los define)
  if (window.counters?.update) window.counters.update(plans);
}

function openModal(plan=null) {
  editId = plan ? Number(plan.id) : null;
  const f = document.getElementById('planForm');
  const titleEl = document.getElementById('modalTitle');
  f.reset();

  // hidden correcto
  f.elements['id'].value = plan ? plan.id : "";

  if (plan) {
    titleEl.textContent = "Editar plan";
    f.elements['name'].value          = plan.name || '';
    f.elements['slug'].value          = plan.slug || '';
    f.elements['description'].value   = plan.description || '';
    f.elements['price_amount'].value  = plan.price_amount ?? '';
    f.elements['period_note'].value   = plan.period_note || '/mes · sin IGV';
    f.elements['is_featured'].checked = Number(plan.is_featured) === 1;
    f.elements['badge_text'].value    = plan.badge_text || '';
    f.elements['cta1_label'].value    = plan.cta1_label || 'Empezar';
    f.elements['cta1_url'].value      = plan.cta1_url || 'contacto.html';
    f.elements['cta2_label'].value    = plan.cta2_label || 'Probar demo';
    f.elements['cta2_url'].value      = plan.cta2_url || 'login.html';
    f.elements['display_order'].value = Number(plan.display_order ?? 0);
    f.elements['features_text'].value = (Array.isArray(plan.features) ? plan.features : []).join('\n');
  } else {
    titleEl.textContent = "Nuevo plan";
    const ft = document.getElementById('featuresText');
    if (ft) ft.value = '';
  }

  document.getElementById('adminModal').classList.add('show');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  document.getElementById('adminModal').classList.remove('show');
  document.body.style.overflow = 'auto';
  editId = null;
}

function editPlan(id) {
  const plan = plans.find(p => Number(p.id) === Number(id));
  if (!plan) return;
  openModal(plan);
}

async function deletePlan(id) {
  if (!confirm('¿Eliminar este plan?')) return;
  try {
    const fd = new FormData(); fd.append('id', id);
    const j = await fetchJson(`${window.PRICING_API}?action=eliminar`, { method:'POST', body: fd });
    if (j && j.success) { await loadPlans(); alert('Eliminado'); }
    else alert(j?.error || 'No se pudo eliminar');
  } catch (e) {
    console.error(e);
    alert(e.message);
  }
}

async function movePlan(id, direction) {
  try {
    const fd = new FormData(); fd.append('id', id); fd.append('direction', direction);
    const j = await fetchJson(`${window.PRICING_API}?action=move`, { method:'POST', body: fd });
    if (j && j.success) loadPlans();
  } catch (e) {
    console.error(e);
    alert(e.message);
  }
}

async function onSubmit(e) {
  e.preventDefault();
  const f = e.target;
  const idVal = f.elements['id']?.value?.trim();
  const action = idVal ? 'actualizar' : 'crear';

  try {
    const fd = new FormData(f);
    const j = await fetchJson(`${window.PRICING_API}?action=${action}`, { method:'POST', body: fd });
    if (j && j.success) {
      closeModal();
      await loadPlans();
      alert('Guardado correctamente');
    } else {
      alert(j?.error || 'Error al guardar');
    }
  } catch (e) {
    console.error(e);
    alert(e.message);
  }
}
