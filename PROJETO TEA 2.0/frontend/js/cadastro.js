// Regex patterns
const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const senhaRegex = /^.{8,}$/;

const form = document.getElementById('cadastroForm');
const nameInput = document.getElementById('name');
const emailInput = document.getElementById('email');
const senhaInput = document.getElementById('senha');
const confirmarSenhaInput = document.getElementById('confirmarSenha');

// Função para criar mensagem de erro
function criarMensagemErro(input, mensagem) {
  const erroExistente = input.parentElement.querySelector('.erro-mensagem');
  if (erroExistente) {
    erroExistente.remove();
  }

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
    criarMensagemErro(this, 'Digite um email válido');
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

// Validação da confirmação de senha
confirmarSenhaInput.addEventListener('blur', function() {
  const senha = senhaInput.value;
  const confirmarSenha = this.value;
  
  if (confirmarSenha === '') {
    criarMensagemErro(this, 'Confirme sua senha');
  } else if (senha !== confirmarSenha) {
    criarMensagemErro(this, 'As senhas não coincidem');
  } else {
    removerMensagemErro(this);
  }
});

confirmarSenhaInput.addEventListener('focus', function() {
  removerMensagemErro(this);
});

// Submit do formulário
form.addEventListener('submit', async function(e) {
  e.preventDefault();
  
  const name = nameInput.value.trim();
  const email = emailInput.value.trim();
  const senha = senhaInput.value;
  const confirmarSenha = confirmarSenhaInput.value;
  
  let temErro = false;
  
  // Valida nome
  if (name === '') {
    criarMensagemErro(nameInput, 'O nome é obrigatório');
    temErro = true;
  } else if (name.length < 3) {
    criarMensagemErro(nameInput, 'O nome deve ter no mínimo 3 caracteres');
    temErro = true;
  }
  
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
  
  // Valida confirmação de senha
  if (confirmarSenha === '') {
    criarMensagemErro(confirmarSenhaInput, 'Confirme sua senha');
    temErro = true;
  } else if (senha !== confirmarSenha) {
    criarMensagemErro(confirmarSenhaInput, 'As senhas não coincidem');
    temErro = true;
  }
  
  // Se não houver erros, faz a requisição
  if (!temErro) {
    try {
      const response = await fetch('http://localhost:3000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, email, senha })
      });
      
      const data = await response.json();
      
      if (response.ok && data.success) {
        // Salva o token no localStorage
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        
        // Redireciona para home
        window.location.href = 'home.html';
      } else {
        // Mostra erro do servidor
        alert(data.message || 'Erro ao realizar cadastro');
      }
    } catch (error) {
      console.error('Erro:', error);
      alert('Erro ao conectar com o servidor. Verifique se o backend está rodando.');
    }
  }
});