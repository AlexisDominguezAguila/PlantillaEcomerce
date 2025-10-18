const API_URL = "../controllers/ServiciosController.php";

async function cargarServiciosPublicos() {
    const grid = document.getElementById("servicesGrid");
    grid.innerHTML = "<p>Cargando...</p>";

    const res = await fetch(`${API_URL}?action=listar`);
    const servicios = await res.json();

    grid.innerHTML = "";
    if (!Array.isArray(servicios) || servicios.length === 0) {
        grid.innerHTML = "<p>No hay servicios activos disponibles.</p>";
        return;
    }

    window.serviciosPublicos = servicios;

    servicios.forEach(s => {
    const card = document.createElement("div");
    card.className = "service-detail-card";

    const caracteristicas = (s.caracteristicas || "")
        .split(";")
        .filter(txt => txt.trim() !== "")
        .map(txt => `<li><i class="fas fa-check-circle"></i> ${txt.trim()}</li>`)
        .join("");

    // Detectar si tiene enlace
    const botonAccion = s.enlace && s.enlace.trim() !== ""
        ? `<a href="${s.enlace}" class="btn-primary">Ver detalles</a>`
        : `<button class="btn-primary" onclick="mostrarModalServicio(${s.id})">Ver detalles</button>`;

    card.innerHTML = `
        <div class="service-header">
        <div class="service-icon"><i class="${s.icono || 'fas fa-cog'}"></i></div>
        <h2>${s.titulo}</h2>
        </div>
        <p class="service-intro">${s.descripcion}</p>

        ${caracteristicas 
        ? `<div class="service-features">
            <h3>Incluye:</h3>
            <ul>${caracteristicas}</ul>
            </div>`
        : ""
        }

        <div class="service-pricing">
        <div class="price-tag">${s.etiqueta || 'Consultar precio'}</div>
        ${botonAccion}
        </div>
    `;
    grid.appendChild(card);
    });



    }

    function mostrarModalServicio(id) {
    const s = window.serviciosPublicos?.find(x => Number(x.id) === Number(id));
    if (!s) return;
    const modal = document.getElementById("serviceModal");
    const body = document.getElementById("modalBody");
    body.innerHTML = `
        <h2><i class="${s.icono}"></i> ${s.titulo}</h2>
        <p>${s.descripcion}</p>
        <p>${s.caracteristicas?.replaceAll(';','<br>') || ''}</p>
    `;
    modal.classList.add("active");
    }
    function cerrarModalServicio() {
    document.getElementById("serviceModal").classList.remove("active");
    }

window.onload = cargarServiciosPublicos;
