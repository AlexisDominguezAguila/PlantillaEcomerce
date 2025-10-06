const $ = (s, r = document) => r.querySelector(s);
const byId = (id) => document.getElementById(id);

// Mostrar / ocultar contraseña
byId("togglePass").addEventListener("click", () => {
  const inp = byId("password");
  const isPass = inp.type === "password";
  inp.type = isPass ? "text" : "password";
  byId("togglePass").innerHTML = `<i class='bx ${
    isPass ? "bx-hide" : "bx-show"
  }'></i>`;
  inp.focus();
});

// Modal “olvidé contraseña”
const resetModal = byId("resetModal");
byId("forgotLink").addEventListener("click", (e) => {
  e.preventDefault();
  resetModal.showModal();
});
byId("resetForm").addEventListener("submit", (e) => {
  e.preventDefault();
  // Simula envío
  resetModal.close();
  showAlert(
    "Te enviamos un enlace de recuperación si el correo existe.",
    "info"
  );
});

// Submit del login
const form = byId("loginForm");
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  clearAlert();

  const tenant = byId("tenant").value.trim();
  const email = byId("email").value.trim();
  const pass = byId("password").value;

  if (!tenant || !email || pass.length < 6) {
    return showAlert(
      "Revisa los campos: tenant válido, correo y contraseña (mín. 6)."
    );
  }

  const btn = byId("submitBtn");
  btn.classList.add("loading");

  try {
    // TODO: API => reemplaza este bloque por tu fetch
    // const res = await fetch('/api/login', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ tenant, email, password: pass }) });
    // const data = await res.json();
    await wait(900); // simulación
    const ok = true; // data.ok

    if (ok) {
      // Guarda selección para tu SPA
      localStorage.setItem("tr_current_tenant", tenant);
      // Redirige a tu app principal
      window.location.href = "index.html"; // cámbialo si usas otra ruta
    } else {
      showAlert("Credenciales incorrectas o tenant inválido.");
    }
  } catch (err) {
    showAlert("No se pudo iniciar sesión. Intenta de nuevo.");
  } finally {
    btn.classList.remove("loading");
  }
});

function wait(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

function showAlert(msg, type = "error") {
  const box = byId("formAlert");
  box.textContent = msg;
  box.hidden = false;
}
function clearAlert() {
  byId("formAlert").hidden = true;
}
