// Regex patterns
const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const senhaRegex = /^.{8,}$/; // Google apenas requer mínimo de 8 caracteres

// Elementos do formulário
const form = document.getElementById('loginForm');
const emailInput = document.getElementById('email');
const senhaInput = document.getElementById('senha');

// Função para criar mensagem de erro
function criarMensagemErro(input, mensagem) {
  // Remove mensagem de erro anterior se existir
  const erroExistente = input.parentElement.querySelector('.erro-mensagem');
  if (erroExistente) {
    erroExistente.remove();
  }

  // Cria nova mensagem de erro
  const erroDiv = document.createElement('div');
  erroDiv.className = 'erro-mensagem';
  erroDiv.textContent = mensagem;
  erroDiv.style.color = '#ff0000';
  erroDiv.style.fontSize = '12px';
  erroDiv.style.marginTop = '5px';
  erroDiv.style.fontFamily = 'var(--fonte-paragrado)';
  
  input.parentElement.appendChild(erroDiv);
  input.style.borderColor = '#ff0000';
}

// Função para remover mensagem de erro
function removerMensagemErro(input) {
  const erroExistente = input.parentElement.querySelector('.erro-mensagem');
  if (erroExistente) {
    erroExistente.remove();
  }
  input.style.borderColor = '#ccc';
}

// Validação em tempo real do email
emailInput.addEventListener('blur', function() {
  const email = this.value.trim();
  
  if (email === '') {
    criarMensagemErro(this, 'O email é obrigatório');
  } else if (!emailRegex.test(email)) {
    criarMensagemErro(this, 'Digite um email válido (ex: usuario@email.com)');
  } else {
    removerMensagemErro(this);
  }
});

emailInput.addEventListener('focus', function() {
  removerMensagemErro(this);
});

// Validação em tempo real da senha
senhaInput.addEventListener('blur', function() {
  const senha = this.value;
  
  if (senha === '') {
    criarMensagemErro(this, 'A senha é obrigatória');
  } else if (!senhaRegex.test(senha)) {
    criarMensagemErro(this, 'A senha deve ter no mínimo 8 caracteres');
  } else {
    removerMensagemErro(this);
  }
});

senhaInput.addEventListener('focus', function() {
  removerMensagemErro(this);
});

// Validação no submit do formulário
form.addEventListener('submit', function(e) {
  e.preventDefault();
  
  const email = emailInput.value.trim();
  const senha = senhaInput.value;
  
  let temErro = false;
  
  // Valida email
  if (email === '') {
    criarMensagemErro(emailInput, 'O email é obrigatório');
    temErro = true;
  } else if (!emailRegex.test(email)) {
    criarMensagemErro(emailInput, 'Digite um email válido');
    temErro = true;
  }
  
  // Valida senha
  if (senha === '') {
    criarMensagemErro(senhaInput, 'A senha é obrigatória');
    temErro = true;
  } else if (!senhaRegex.test(senha)) {
    criarMensagemErro(senhaInput, 'A senha deve ter no mínimo 8 caracteres');
    temErro = true;
  }
  
  // Se não houver erros, submete o formulário
  if (!temErro) {
    console.log('Formulário válido!');
    console.log('Email:', email);
    console.log('Senha:', senha);
    
    // Aqui você pode fazer a requisição para o backend
    // fetch('/api/login', { method: 'POST', body: JSON.stringify({ email, senha }) })
    
    window.location.href = 'home.html';
  }
});