const userBtn = document.getElementById("userBtn");
const dropdown = document.getElementById("dropdown");

// Toggle dropdown
userBtn.addEventListener("click", () => {
  dropdown.classList.toggle("show");
});

// Fecha dropdown ao clicar fora
window.addEventListener("click", (e) => {
  if (!userBtn.contains(e.target) && !dropdown.contains(e.target)) {
    dropdown.classList.remove("show");
  }
});

// Alternar abas
const tabButtons = document.querySelectorAll(".tab-btn");
const tabContents = document.querySelectorAll(".tab-content");

tabButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    tabButtons.forEach((b) => b.classList.remove("active"));
    tabContents.forEach((c) => c.classList.remove("active"));

    btn.classList.add("active");
    document.getElementById(btn.dataset.tab).classList.add("active");
  });
});

// Forms com preventDefault
document.querySelectorAll("form").forEach((form) => {
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    console.log("Form enviado:", form.id);
  });
});

// Máscara CPF/CNPJ
const cpfCnpjInput = document.getElementById("cpfcnpj");
cpfCnpjInput?.addEventListener("input", (e) => {
  let value = e.target.value.replace(/\D/g, "");
  if (value.length <= 11) {
    // CPF
    value = value.replace(/(\d{3})(\d)/, "$1.$2");
    value = value.replace(/(\d{3})(\d)/, "$1.$2");
    value = value.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
  } else {
    // CNPJ
    value = value.replace(/^(\d{2})(\d)/, "$1.$2");
    value = value.replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3");
    value = value.replace(/\.(\d{3})(\d)/, ".$1/$2");
    value = value.replace(/(\d{4})(\d)/, "$1-$2");
  }
  e.target.value = value;
});

// Máscara CEP
const cepInput = document.getElementById("cep");
cepInput?.addEventListener("input", (e) => {
  let value = e.target.value.replace(/\D/g, "");
  value = value.replace(/^(\d{5})(\d)/, "$1-$2");
  e.target.value = value;
});
// Inicializa os ícones do Lucide
document.addEventListener("DOMContentLoaded", () => {
  lucide.createIcons();
});
