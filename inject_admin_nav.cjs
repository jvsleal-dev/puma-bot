const fs = require('fs');

const adminPages = [
  'public/dashboard.html',
  'public/robos.html',
  'public/fluxos.html',
  'public/clientes.html',
  'public/gateways.html'
];

const navigationScript = `
<script>
  document.addEventListener('DOMContentLoaded', () => {
    // 1. Mapeamento de abas para URLs reais do sistema
    const navMap = {
      'tab-dashboard': '/dashboard',
      'tab-robos': '/robos',
      'tab-fluxos': '/fluxos',
      'tab-pendencias': '/clientes',
      'tab-gateways': '/gateways'
    };

    document.querySelectorAll('[data-nav]').forEach(btn => {
      const targetKey = btn.getAttribute('data-nav');
      const targetUrl = navMap[targetKey];
      if (targetUrl) {
        btn.style.cursor = 'pointer';
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          window.location.href = targetUrl;
        });
      }
    });

    // 2. Destacar item ativo de acordo com a rota atual
    const currentPath = window.location.pathname;
    document.querySelectorAll('[data-nav]').forEach(btn => {
      const targetKey = btn.getAttribute('data-nav');
      const targetUrl = navMap[targetKey];
      if (targetUrl === currentPath) {
        btn.classList.add('bg-surface-container-high', 'text-primary', 'border-l-2', 'border-primary');
        btn.classList.remove('text-on-surface-variant');
        const icon = btn.querySelector('.material-symbols-outlined');
        if (icon) icon.classList.add('text-primary');
      } else {
        btn.classList.remove('bg-surface-container-high', 'border-l-2', 'border-primary');
      }
    });

    // 3. Suporte ao atalho ⌘B para colapsar/expandir a sidebar
    const toggleBtn = document.getElementById('toggle-sidebar');
    const sidebar = document.getElementById('main-sidebar');
    const mainContent = document.querySelector('main');

    function toggleSidebar() {
      if (!sidebar) return;
      if (sidebar.style.transform === 'translateX(-100%)') {
        sidebar.style.transform = 'translateX(0)';
        if (mainContent) mainContent.style.marginLeft = '16rem';
      } else {
        sidebar.style.transform = 'translateX(-100%)';
        if (mainContent) mainContent.style.marginLeft = '0';
      }
    }

    if (toggleBtn) {
      toggleBtn.addEventListener('click', toggleSidebar);
    }

    document.addEventListener('keydown', (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'b') {
        e.preventDefault();
        toggleSidebar();
      }
    });
  });
</script>
`;

adminPages.forEach(file => {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    if (!content.includes('// 1. Mapeamento de abas para URLs reais')) {
      content = content.replace('</body>', navigationScript + '\n</body>');
      fs.writeFileSync(file, content);
      console.log(`Script de navegação de alta precisão injetado em: ${file}`);
    }
  }
});
