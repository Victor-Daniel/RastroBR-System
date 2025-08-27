const userBtn = document.getElementById("userBtn");
const dropdown = document.getElementById("dropdown");

// Toggle menu
userBtn.addEventListener("click", () => {
  dropdown.classList.toggle("hidden");
});

// Fecha se clicar fora
window.addEventListener("click", (e) => {
  if (!userBtn.contains(e.target) && !dropdown.contains(e.target)) {
    dropdown.classList.add("hidden");
  }
});
