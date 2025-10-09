const mobileToggle = document.getElementById("mobileToggle");
const navMenu = document.getElementById("navMenu");

// Abrir/cerrar menú
mobileToggle.addEventListener("click", () => {
  navMenu.classList.toggle("active");
  mobileToggle.classList.toggle("active");
});

// Cierra al hacer clic en un enlace
document.querySelectorAll(".nav-menu a").forEach((link) => {
  link.addEventListener("click", () => {
    navMenu.classList.remove("active");
    mobileToggle.classList.remove("active");
  });
});

// Cierra al hacer scroll
window.addEventListener("scroll", () => {
  if (navMenu.classList.contains("active")) {
    navMenu.classList.remove("active");
    mobileToggle.classList.remove("active");
  }
});
