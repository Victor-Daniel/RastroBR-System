// Arquivo de edição do comportamendo do btn caso os campos fiquem vazios

document.getElementById('loginForm').addEventListener('submit', function (e) {
  e.preventDefault();

  const user = document.getElementById('email').value.trim();
  const pass = document.getElementById('senha').value.trim();
  const error = document.getElementById('errorMessage');

  if (!user || !pass) {
    error.textContent = "Por favor, preencha todos os campos.";
    return;
  }

  // Simulação de login bem-sucedido
  error.textContent = "";
  //alert(`Bem-vindo, ${user}!`);
});