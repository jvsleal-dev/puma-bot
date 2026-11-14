const fs = require('fs');

// ==========================================
// 1. Corrigir FAQ Acordeão na Landing Page
// ==========================================
let indexHtml = fs.readFileSync('public/index.html', 'utf8');

const faqScript = `
<script>
  // FAQ Accordion Logic
  document.querySelectorAll('.faq-toggle').forEach(btn => {
    btn.addEventListener('click', () => {
      const content = btn.nextElementSibling;
      const icon = btn.querySelector('.material-symbols-outlined');
      const isHidden = content.classList.contains('hidden');
      
      // Fechar outros
      document.querySelectorAll('.faq-content').forEach(c => c.classList.add('hidden'));
      document.querySelectorAll('.faq-toggle .material-symbols-outlined').forEach(i => i.style.transform = 'rotate(0deg)');

      if (isHidden) {
        content.classList.remove('hidden');
        if (icon) icon.style.transform = 'rotate(180deg)';
      }
    });
  });
</script>
`;

if (!indexHtml.includes('// FAQ Accordion Logic')) {
  indexHtml = indexHtml.replace('</body>', faqScript + '\n</body>');
  fs.writeFileSync('public/index.html', indexHtml);
  console.log('FAQ Accordion interativo adicionado ao index.html');
}

// ==========================================
// 2. Corrigir e Ativar Form de Cadastro
// ==========================================
let cadastroHtml = fs.readFileSync('public/cadastro.html', 'utf8');

// Adicionar IDs aos inputs de nome e email
cadastroHtml = cadastroHtml.replace('placeholder="Seu nome ou nome da operação" required="" type="text"', 'id="name-input" placeholder="Seu nome ou nome da operação" required="" type="text"');
cadastroHtml = cadastroHtml.replace('placeholder="ex: voce@empresa.com.br" required="" type="email"', 'id="email-input" placeholder="ex: voce@empresa.com.br" required="" type="email"');

// Adicionar container de alerta se não tiver
if (!cadastroHtml.includes('id="cadastro-alert"')) {
  cadastroHtml = cadastroHtml.replace('<form class="space-y-4"', '<div id="cadastro-alert" class="hidden p-3 rounded-lg text-sm mb-4"></div>\n<form id="cadastro-form" class="space-y-4"');
}

const cadastroScript = `
<script>
  document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('cadastro-form') || document.querySelector('form');
    const alertBox = document.getElementById('cadastro-alert');

    if (form) {
      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = (document.getElementById('name-input') || {}).value;
        const email = (document.getElementById('email-input') || {}).value;
        const password = (document.getElementById('password-input') || {}).value;
        const passwordConfirm = (document.getElementById('password-confirm') || {}).value;

        if (passwordConfirm && password !== passwordConfirm) {
          showAlert('As senhas não coincidem.', 'error');
          return;
        }

        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.disabled = true;
        submitBtn.innerText = 'Processando...';

        try {
          const res = await fetch('/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password })
          });
          const data = await res.json();

          if (!res.ok) {
            throw new Error(data.error || 'Erro ao realizar cadastro');
          }

          showAlert('🎉 Conta criada com sucesso! Redirecionando para login...', 'success');
          setTimeout(() => {
            window.location.href = '/login?registered=1';
          }, 1200);
        } catch (err) {
          showAlert(err.message, 'error');
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalText;
        }
      });
    }

    function showAlert(msg, type) {
      if (!alertBox) return alert(msg);
      alertBox.className = type === 'error' 
        ? 'p-3 rounded-lg text-sm mb-4 bg-red-950/80 border border-red-500/50 text-red-200 block'
        : 'p-3 rounded-lg text-sm mb-4 bg-emerald-950/80 border border-emerald-500/50 text-emerald-200 block';
      alertBox.innerText = msg;
    }
  });
</script>
`;

if (!cadastroHtml.includes('// Cadastro API Submit Logic')) {
  cadastroHtml = cadastroHtml.replace('</body>', cadastroScript + '\n</body>');
  fs.writeFileSync('public/cadastro.html', cadastroHtml);
  console.log('Script de envio e validação conectado ao cadastro.html');
}

// ==========================================
// 3. Corrigir e Ativar Form de Login
// ==========================================
let loginHtml = fs.readFileSync('public/login.html', 'utf8');

if (!loginHtml.includes('id="login-alert"')) {
  loginHtml = loginHtml.replace('<form class="space-y-4"', '<div id="login-alert" class="hidden p-3 rounded-lg text-sm mb-4"></div>\n<form id="login-form" class="space-y-4"');
}

const loginScript = `
<script>
  document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('login-form') || document.querySelector('form');
    const alertBox = document.getElementById('login-alert');

    // Checar se veio redirecionado do cadastro
    const params = new URLSearchParams(window.location.search);
    if (params.get('registered')) {
      showAlert('Conta criada com sucesso! Faça seu login para continuar.', 'success');
    }

    if (form) {
      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = (document.getElementById('email') || {}).value;
        const password = (document.getElementById('password') || {}).value;

        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.disabled = true;
        submitBtn.innerText = 'Autenticando...';

        try {
          const res = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
          });
          const data = await res.json();

          if (!res.ok) {
            throw new Error(data.error || 'Credenciais inválidas');
          }

          localStorage.setItem('puma_user', JSON.stringify(data.user));
          localStorage.setItem('puma_token', data.token);

          showAlert('✅ Login efetuado com sucesso! Redirecionando...', 'success');
          setTimeout(() => {
            window.location.href = '/';
          }, 1200);
        } catch (err) {
          showAlert(err.message, 'error');
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalText;
        }
      });
    }

    function showAlert(msg, type) {
      if (!alertBox) return alert(msg);
      alertBox.className = type === 'error' 
        ? 'p-3 rounded-lg text-sm mb-4 bg-red-950/80 border border-red-500/50 text-red-200 block'
        : 'p-3 rounded-lg text-sm mb-4 bg-emerald-950/80 border border-emerald-500/50 text-emerald-200 block';
      alertBox.innerText = msg;
    }
  });
</script>
`;

if (!loginHtml.includes('// Login API Submit Logic')) {
  loginHtml = loginHtml.replace('</body>', loginScript + '\n</body>');
  fs.writeFileSync('public/login.html', loginHtml);
  console.log('Script de autenticação conectado ao login.html');
}

// Sincronizar SvelteKit
function extractBody(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const start = content.indexOf('<body');
  const bodyOpenEnd = content.indexOf('>', start);
  const end = content.lastIndexOf('</body>');
  return content.substring(bodyOpenEnd + 1, end);
}

fs.writeFileSync('src/routes/+page.svelte', '<svelte:head>\n  <title>Puma Bot — Gateway PIX & Automação de Alta Conversão no Telegram</title>\n</svelte:head>\n\n' + extractBody('public/index.html'));
fs.writeFileSync('src/routes/cadastro/+page.svelte', '<svelte:head>\n  <title>Puma Bot — Cadastro de Nova Conta</title>\n</svelte:head>\n\n' + extractBody('public/cadastro.html'));
fs.writeFileSync('src/routes/login/+page.svelte', '<svelte:head>\n  <title>Puma Bot — Login de Operadores</title>\n</svelte:head>\n\n' + extractBody('public/login.html'));

console.log('Todos os ajustes foram sincronizados!');

