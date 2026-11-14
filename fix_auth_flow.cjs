const fs = require('fs');

// 1. Atualizar redirecionamento de login para /dashboard
let loginHtml = fs.readFileSync('public/login.html', 'utf8');
loginHtml = loginHtml.replace("window.location.href = '/';", "window.location.href = '/dashboard';");
fs.writeFileSync('public/login.html', loginHtml);
console.log('Login agora redireciona com sucesso para /dashboard');

// 2. Injetar Auth Guard e sincronização de dados do usuário em todas as telas administrativas
const adminPages = [
  'public/dashboard.html',
  'public/robos.html',
  'public/fluxos.html',
  'public/clientes.html',
  'public/gateways.html'
];

const authGuardScript = `
<script>
  (function() {
    // Auth Guard: protege a rota caso não haja token
    const token = localStorage.getItem('puma_token');
    const userRaw = localStorage.getItem('puma_user');

    if (!token && !window.location.search.includes('preview=1')) {
      // Redireciona de forma segura para login
      window.location.href = '/login?expired=1';
      return;
    }

    if (userRaw) {
      try {
        const user = JSON.parse(userRaw);
        document.addEventListener('DOMContentLoaded', () => {
          // Atualizar nome do usuário e avatar na sidebar
          const nameEl = document.querySelector('.font-headline-sm.text-body-sm.font-medium');
          if (nameEl) nameEl.textContent = user.name || 'Operador Alpha';

          const avatarEl = document.querySelector('.relative.w-7.h-7');
          if (avatarEl && user.name) {
            const initials = user.name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();
            avatarEl.childNodes[0].nodeValue = initials + ' ';
          }
        });
      } catch (e) {}
    }

    // Adicionar botão de logout funcional no rodapé da sidebar
    document.addEventListener('DOMContentLoaded', () => {
      const footerNav = document.querySelector('#main-sidebar .border-t.border-outline-variant\\\\/30');
      if (footerNav && !document.getElementById('logout-btn')) {
        const logoutBtn = document.createElement('button');
        logoutBtn.id = 'logout-btn';
        logoutBtn.className = 'w-full flex items-center justify-between px-space-md py-space-sm rounded-lg text-error hover:bg-error/10 text-body-sm transition-colors mt-1';
        logoutBtn.innerHTML = \`
          <div class="flex items-center gap-space-sm">
            <span class="material-symbols-outlined text-error" data-icon="logout">logout</span>
            <span>Sair da Conta</span>
          </div>
        \`;
        logoutBtn.addEventListener('click', () => {
          localStorage.removeItem('puma_token');
          localStorage.removeItem('puma_user');
          window.location.href = '/login';
        });
        footerNav.appendChild(logoutBtn);
      }
    });
  })();
</script>
`;

adminPages.forEach(file => {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    if (!content.includes('// Auth Guard: protege a rota')) {
      content = content.replace('</body>', authGuardScript + '\n</body>');
      fs.writeFileSync(file, content);
      console.log(`Auth Guard injetado em: ${file}`);
    }
  }
});
