// Datos simulados
let services = [
  {
    id: 1,
    name: "Análisis de Datos",
    category: "sistemas",
    description: "Transforma información en decisiones estratégicas.",
    image: "../../public/assets/images/servicio1.jpg",
    active: true
  }
];

function renderServices() {
  const grid = document.getElementById("servicesGrid");
  const tableBody = document.getElementById("servicesTableBody");
  const count = document.getElementById("servicesCount");

  grid.innerHTML = "";
  tableBody.innerHTML = "";

  if (services.length === 0) {
    document.getElementById("emptyState").style.display = "block";
    count.textContent = 0;
    return;
  } else {
    document.getElementById("emptyState").style.display = "none";
  }

  count.textContent = services.length;

  services.forEach(s => {
    const card = `
      <div class="product-card">
        <div class="product-image"><img src="${s.image}" alt="${s.name}"></div>
        <div class="product-info">
          <div class="product-category">${s.category}</div>
          <h3 class="product-name">${s.name}</h3>
          <p class="product-description">${s.description}</p>
          <div class="product-meta">
            <div class="product-stock">
              <span class="stock-badge ${s.active ? "in-stock" : "out-stock"}">
                ${s.active ? "Visible" : "Oculto"}
              </span>
            </div>
            <div class="product-actions">
              <button class="action-btn edit" onclick="editService(${s.id})"><i class="bx bx-edit"></i></button>
              <button class="action-btn delete" onclick="deleteService(${s.id})"><i class="bx bx-trash"></i></button>
            </div>
          </div>
        </div>
      </div>`;
    grid.innerHTML += card;

    const row = `
      <tr>
        <td><img src="${s.image}" class="table-product-img" /></td>
        <td>${s.name}</td>
        <td>${s.category}</td>
        <td>${s.description}</td>
        <td>${s.active ? "Visible" : "Oculto"}</td>
        <td>
          <button class="action-btn edit" onclick="editService(${s.id})"><i class="bx bx-edit"></i></button>
          <button class="action-btn delete" onclick="deleteService(${s.id})"><i class="bx bx-trash"></i></button>
        </td>
      </tr>`;
    tableBody.innerHTML += row;
  });
}

function openModal() {
  document.getElementById("serviceModal").classList.add("active");
}

function closeModal() {
  document.getElementById("serviceModal").classList.remove("active");
}

function previewImage(event) {
  const preview = document.getElementById("imagePreview");
  preview.innerHTML = "";
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = e => {
      preview.innerHTML = `<div class="image-preview-item"><img src="${e.target.result}"/></div>`;
    };
    reader.readAsDataURL(file);
  }
}

function deleteService(id) {
  services = services.filter(s => s.id !== id);
  renderServices();
}

document.getElementById("serviceForm").addEventListener("submit", e => {
  e.preventDefault();
  const name = document.getElementById("serviceName").value;
  const category = document.getElementById("serviceCategory").value;
  const description = document.getElementById("serviceDescription").value;
  const active = document.getElementById("serviceActive").checked;
  const image = "../../public/assets/images/servicio1.jpg";

  services.push({ id: Date.now(), name, category, description, image, active });
  closeModal();
  renderServices();
});

window.onload = renderServices;
