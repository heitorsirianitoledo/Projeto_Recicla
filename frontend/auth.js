const API_URL = 'http://localhost:3000/api/auth';

// Configuração do Toast do SweetAlert2 (não quebra o layout nem bloqueia o fundo)
const Toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 3500,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.addEventListener('mouseenter', Swal.stopTimer);
    toast.addEventListener('mouseleave', Swal.resumeTimer);
  }
});

document.addEventListener('DOMContentLoaded', () => {
  // Formulário de Cadastro (telaCadastro.html)
  const formCadastro = document.getElementById('formCadastro');
  
  // Formulário de Login (login.html)
  const formLogin = document.getElementById('formLogin') || document.getElementById('form-login');

  // ==========================================
  // FLUXO DE CADASTRO
  // ==========================================
  if (formCadastro) {
    formCadastro.addEventListener('submit', async (e) => {
      e.preventDefault();

      const btnSubmit = document.getElementById('btnCadastrar') || formCadastro.querySelector('button[type="submit"]');
      const textoOriginalBtn = btnSubmit ? btnSubmit.textContent : 'Criar conta';

      const nome = document.getElementById('cadNome')?.value.trim();
      const cnpj = document.getElementById('cadCnpj')?.value.trim();
      const endereco = document.getElementById('cadEndereco')?.value.trim();
      const telefone = document.getElementById('cadTelefone')?.value.trim();
      const email = document.getElementById('cadEmail')?.value.trim();
      const senha = document.getElementById('cadSenha')?.value;
      const confirmarSenha = document.getElementById('cadConfirmaSenha')?.value;

      // Validação de senhas coincidentes
      if (senha !== confirmarSenha) {
        Toast.fire({
          icon: 'warning',
          title: 'As senhas não coincidem!'
        });
        return;
      }

      try {
        if (btnSubmit) {
          btnSubmit.disabled = true;
          btnSubmit.textContent = 'Cadastrando...';
        }

        const resposta = await fetch(`${API_URL}/register`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            nome,
            cnpj,
            endereco,
            telefone,
            email,
            senha
          })
        });

        const dados = await resposta.json();

        if (!resposta.ok) {
          throw new Error(dados.erro || dados.mensagem || 'Falha ao processar cadastro.');
        }

        // Notificação de sucesso
        Toast.fire({
          icon: 'success',
          title: dados.mensagem || 'Conta criada com sucesso!'
        });

        // Redireciona suavemente após 2 segundos
        setTimeout(() => {
          window.location.href = 'login.html';
        }, 2000);

      } catch (erro) {
        Toast.fire({
          icon: 'error',
          title: erro.message
        });
      } finally {
        if (btnSubmit) {
          btnSubmit.disabled = false;
          btnSubmit.textContent = textoOriginalBtn;
        }
      }
    });
  }

  // ==========================================
  // FLUXO DE LOGIN
  // ==========================================
  if (formLogin) {
    formLogin.addEventListener('submit', async (e) => {
      e.preventDefault();

      const btnSubmit = formLogin.querySelector('button[type="submit"]');
      const textoOriginalBtn = btnSubmit ? btnSubmit.textContent : 'Entrar';

      const email = (document.getElementById('email') || document.getElementById('loginEmail'))?.value.trim();
      const senha = (document.getElementById('senha') || document.getElementById('loginSenha'))?.value;

      try {
        if (btnSubmit) {
          btnSubmit.disabled = true;
          btnSubmit.textContent = 'Entrando...';
        }

        const resposta = await fetch(`${API_URL}/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ email, senha })
        });

        const dados = await resposta.json();

        if (!resposta.ok) {
          throw new Error(dados.erro || dados.mensagem || 'Credenciais inválidas.');
        }

        if (dados.token) {
          localStorage.setItem('@recicla:token', dados.token);
        }
        if (dados.usuario) {
          localStorage.setItem('@recicla:usuario', JSON.stringify(dados.usuario));
        }

        Toast.fire({
          icon: 'success',
          title: 'Login realizado com sucesso!'
        });

        setTimeout(() => {
          window.location.href = 'telaInicio.html';
        }, 1500);

      } catch (erro) {
        Toast.fire({
          icon: 'error',
          title: erro.message
        });
      } finally {
        if (btnSubmit) {
          btnSubmit.disabled = false;
          btnSubmit.textContent = textoOriginalBtn;
        }
      }
    });
  }
});