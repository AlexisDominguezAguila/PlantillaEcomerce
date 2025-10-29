// Path canónico (ajústalo si tu vista está en otra carpeta):
const API_URL = (window.API_URL) || "../controllers/PricingController.php";

const esc = s => String(s ?? '').replace(/[&<>"']/g, m => (
  {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[m]
));

let plans = [];
let editId = null;

document.addEventListener('DOMContentLoaded', () => {
  loadPlans();

  const btnNew = document.getElementById('btnNewPlan');
  btnNew && btnNew.addEventListener('click', () => openModal());

  const form = document.getElementById('planForm');
  form && form.addEventListener('submit', onSubmit);

  document.getElementById('modalClose')?.addEventListener('click', closeModal);
  document.getElementById('adminModal')?.addEventListener('click', (e)=>{
    if (e.target.id === 'adminModal') closeModal();
  });
});

async function loadPlans() {
  try {
    const r = await fetch(`${API_URL}?action=listar`, {cache:'no-store'});
    const j = await r.json();
    plans = (j && j.success && Array.isArray(j.data)) ? j.data : [];
  } catch (e) {
    console.warn('No se pudo cargar:', e);
    plans = [];
  }
  renderList();
  updateCounters();
}

function updateCounters() {
  const total = plans.length;
  const featured = plans.filter(p => Number(p.is_featured)===1).length;
  document.getElementById('plansCount')?.replaceChildren(document.createTextNode(total));
  document.getElementById('totalPlans')?.replaceChildren(document.createTextNode(total));
  document.getElementById('featuredPlans')?.replaceChildren(document.createTextNode(featured));

  const empty = document.getElementById('emptyState');
  if (empty) empty.style.display = total === 0 ? 'block':'none';
}

function renderList() {
  const tbody = document.getElementById('plansTbody');
  if (!tbody) return;
  tbody.innerHTML = plans.map(p => `
    <tr>
      <td>${esc(p.name)}</td>
      <td>S/${Number(p.price_amount).toFixed(0)}</td>
      <td>${esc(p.period_note || '')}</td>
      <td>${Number(p.is_featured)===1 ? '<span class="badge badge-green">Destacado</span>' : '<span class="badge">—</span>'}</td>
      <td>${esc(p.badge_text || '')}</td>
      <td class="nowrap">
        <button class="btn sm" title="Subir" onclick="movePlan(${p.id}, 'up')"><i class="bx bx-chevron-up"></i></button>
        <button class="btn sm" title="Bajar" onclick="movePlan(${p.id}, 'down')"><i class="bx bx-chevron-down"></i></button>
      </td>
      <td class="nowrap">
        <button class="btn sm" onclick="editPlan(${p.id})"><i class="bx bx-edit"></i></button>
        <button class="btn sm danger" onclick="deletePlan(${p.id})"><i class="bx bx-trash"></i></button>
      </td>
    </tr>
  `).join('');
}

function openModal(plan=null) {
  editId = plan ? Number(plan.id) : null;
  const f = document.getElementById('planForm');
  if (!f) return;
  f.reset();
  document.getElementById('modalTitle').textContent = plan ? 'Editar plan' : 'Nuevo plan';

  if (plan) {
    f.id.value            = plan.id;
    f.name.value          = plan.name || '';
    f.slug.value          = plan.slug || '';
    f.description.value   = plan.description || '';
    f.price_amount.value  = plan.price_amount || '';
    f.period_note.value   = plan.period_note || '/mes · sin IGV';
    f.is_featured.checked = Number(plan.is_featured) === 1;
    f.badge_text.value    = plan.badge_text || '';
    f.cta1_label.value    = plan.cta1_label || 'Empezar';
    f.cta1_url.value      = plan.cta1_url || 'contacto.html';
    f.cta2_label.value    = plan.cta2_label || 'Probar demo';
    f.cta2_url.value      = plan.cta2_url || 'login.html';
    f.display_order.value = plan.display_order ?? 0;
    f.features_text.value = (Array.isArray(plan.features) ? plan.features : []).join('\n');
  }

  document.getElementById('adminModal')?.classList.add('show');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  document.getElementById('adminModal')?.classList.remove('show');
  document.body.style.overflow = 'auto';
  editId = null;
}

function editPlan(id) {
  const plan = plans.find(p => Number(p.id)===Number(id));
  if (!plan) return;
  openModal(plan);
}

async function deletePlan(id) {
  if (!confirm('¿Eliminar este plan?')) return;
  const fd = new FormData(); fd.append('id', id);
  const r = await fetch(`${API_URL}?action=eliminar`, { method:'POST', body: fd });
  const j = await r.json();
  if (j && j.success) { await loadPlans(); alert('Eliminado'); }
  else alert(j?.error || 'No se pudo eliminar');
}

async function movePlan(id, direction) {
  const fd = new FormData(); fd.append('id', id); fd.append('direction', direction);
  const r = await fetch(`${API_URL}?action=move`, { method:'POST', body: fd });
  const j = await r.json();
  if (j && j.success) loadPlans();
}

async function onSubmit(e) {
  e.preventDefault();
  const f = e.target;
  const fd = new FormData(f);
  // normalizar checkbox
  if (f.is_featured) {
    if (f.is_featured.checked) fd.set('is_featured','1'); else fd.delete('is_featured');
  }
  const action = f.id.value ? 'actualizar' : 'crear';

  try {
    const r = await fetch(`${API_URL}?action=${action}`, { method:'POST', body: fd });
    const j = await r.json();
    if (j && j.success) {
      closeModal();
      await loadPlans();
      alert('Guardado correctamente');
    } else {
      alert(j?.error || 'Error al guardar');
    }
  } catch (err) {
    console.error(err);
    alert('Error de red');
  }
}
