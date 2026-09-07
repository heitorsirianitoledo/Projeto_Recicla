const btnLogin = document.getElementById('btn-login');
if (btnLogin) {
  btnLogin.addEventListener('click', function () {
    const email = document.getElementById('email').value.trim();
    const senha = document.getElementById('senha').value.trim();
    const erro = document.getElementById('erro-login');

    if (!email || !senha) {
      erro.textContent = 'Preencha o e-mail e a senha para continuar.';
      return;
    }

    if (!email.includes('@')) {
      erro.textContent = 'Digite um e-mail válido.';
      return;
    }

    erro.textContent = '';
    alert('Login realizado com sucesso!');
  });
}


const btnCadastro = document.getElementById('btn-cadastro');
if (btnCadastro) {
  btnCadastro.addEventListener('click', function () {
    const nome = document.getElementById('nome').value.trim();
    const cnpj = document.getElementById('cnpj').value.trim();
    const endereco = document.getElementById('endereco').value.trim();
    const telefone = document.getElementById('telefone').value.trim();
    const email = document.getElementById('email').value.trim();
    const senha = document.getElementById('senha').value.trim();
    const confirmar = document.getElementById('confirmar-senha').value.trim();
    const erro = document.getElementById('erro-cadastro');

    if (!nome || !cnpj || !endereco || !telefone || !email || !senha || !confirmar) {
      erro.textContent = 'Preencha todos os campos.';
      return;
    }

    if (!email.includes('@')) {
      erro.textContent = 'Digite um e-mail válido.';
      return;
    }

    if (senha !== confirmar) {
      erro.textContent = 'As senhas não coincidem.';
      return;
    }

    if (senha.length < 6) {
      erro.textContent = 'A senha deve ter pelo menos 6 caracteres.';
      return;
    }

    erro.textContent = '';
    alert('Conta criada com sucesso!');
    window.location.href = 'login.html';
  });
}

const calendario = document.getElementById('calendario');
const btnCalendario = document.getElementById('btn-calendario');
const dataInput = document.getElementById('data-coleta');
const calDays = document.getElementById('cal-days');
const calTitle = document.getElementById('cal-title');
const calPrev = document.getElementById('cal-prev');
const calNext = document.getElementById('cal-next');

const meses = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'];

let calDate = new Date(2025, 0, 1);

function renderCalendario() {
  if (!calDays) return;
  const ano = calDate.getFullYear();
  const mes = calDate.getMonth();
  calTitle.textContent = `${meses[mes]} ${ano}`;
  const primeiroDia = new Date(ano, mes, 1).getDay();
  const diasNoMes = new Date(ano, mes + 1, 0).getDate();
  calDays.innerHTML = '';
  for (let i = 0; i < primeiroDia; i++) {
    const vazio = document.createElement('span');
    vazio.classList.add('cal-day', 'empty');
    calDays.appendChild(vazio);
  }
  for (let d = 1; d <= diasNoMes; d++) {
    const dia = document.createElement('span');
    dia.classList.add('cal-day');
    dia.textContent = d;
    dia.addEventListener('click', () => {
      document.querySelectorAll('.cal-day').forEach(el => el.classList.remove('selected'));
      dia.classList.add('selected');
      const dd = String(d).padStart(2, '0');
      const mm = String(mes + 1).padStart(2, '0');
      dataInput.value = `${dd}/${mm}/${ano}`;
      calendario.classList.remove('open');
    });
    calDays.appendChild(dia);
  }
}

if (btnCalendario) {
  btnCalendario.addEventListener('click', () => {
    calendario.classList.toggle('open');
    renderCalendario();
  });
}

if (calPrev) {
  calPrev.addEventListener('click', () => {
    calDate.setMonth(calDate.getMonth() - 1);
    renderCalendario();
  });
}

if (calNext) {
  calNext.addEventListener('click', () => {
    calDate.setMonth(calDate.getMonth() + 1);
    renderCalendario();
  });
}

document.addEventListener('click', (e) => {
  if (calendario && !calendario.contains(e.target) && e.target !== btnCalendario && e.target !== dataInput) {
    calendario.classList.remove('open');
  }
});

const btnAgendar = document.getElementById('btn-agendar');
const modalConfirmacao = document.getElementById('modal-confirmacao');
const btnNovaColeta = document.getElementById('btn-nova-coleta');

if (btnAgendar) {
  btnAgendar.addEventListener('click', () => {
    modalConfirmacao.classList.add('open');
  });
}

if (btnNovaColeta) {
  btnNovaColeta.addEventListener('click', () => {
    modalConfirmacao.classList.remove('open');
    document.querySelectorAll('input, select').forEach(el => el.value = '');
    document.querySelectorAll('input[type="checkbox"]').forEach(el => el.checked = false);
  });
}