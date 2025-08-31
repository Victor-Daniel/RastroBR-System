const userBtn = document.getElementById("userBtn");
const dropdown = document.getElementById("dropdown");

// Toggle dropdown
userBtn.addEventListener("click", () => {
  dropdown.classList.toggle("show");
});

// Fecha dropdown se clicar fora
window.addEventListener("click", (e) => {
  if (!userBtn.contains(e.target) && !dropdown.contains(e.target)) {
    dropdown.classList.remove("show");
  }
});

// Inicializa os ícones do Lucide
document.addEventListener("DOMContentLoaded", () => {
  lucide.createIcons();
});