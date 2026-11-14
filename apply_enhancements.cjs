const fs = require('fs');

let html = fs.readFileSync('public/index.html', 'utf8');

// 1. Garantir que a seção do Cockpit tenha id="demo"
html = html.replace('<div class="relative max-w-5xl mx-auto mt-6">', '<div id="demo" class="relative max-w-5xl mx-auto mt-6 scroll-mt-24">');

// 2. Dar um ID ao container do Live Feed para podermos injetar novas transações dinâmicas
html = html.replace('<div class="space-y-2.5">', '<div id="live-transactions-container" class="space-y-2.5">');

// 3. Adicionar Toasts Flutuantes & Modal Interativo de Demonstração
const enhancementsMarkup = `
<!-- Notificação Toast Flutuante em Tempo Real -->
<div id="live-pix-toast" class="fixed bottom-6 right-6 z-50 transform translate-y-32 opacity-0 transition-all duration-300 pointer-events-none flex items-center gap-3 px-4 py-3 rounded-xl bg-surface-container-high/95 backdrop-blur-md border border-secondary/30 shadow-[0_12px_32px_rgba(0,0,0,0.6)]">
  <div class="w-8 h-8 rounded-lg bg-secondary/20 text-secondary flex items-center justify-center shrink-0">
    <span class="material-symbols-outlined text-[20px]">bolt</span>
  </div>
  <div>
    <div class="text-body-sm font-semibold text-white flex items-center gap-2">
      <span id="toast-title">Novo PIX Aprovado</span>
      <span id="toast-value" class="text-secondary font-label-tabular text-[12px] bg-secondary/10 px-1.5 py-0.2 rounded font-bold">+ R$ 97,00</span>
    </div>
    <div id="toast-desc" class="text-[11px] text-on-surface-variant font-label-code">@usuario liberado no Canal VIP</div>
  </div>
</div>

<!-- Modal Interativo do Simulador de Funil (⌘K / Ver Demonstração) -->
<div id="demo-modal" class="fixed inset-0 z-50 bg-black/80 backdrop-blur-md hidden items-center justify-center p-4 transition-opacity">
  <div class="relative w-full max-w-2xl bg-surface-container-low border border-outline-variant/40 rounded-2xl shadow-2xl overflow-hidden p-6">
    <div class="flex items-center justify-between pb-4 border-b border-outline-variant/20 mb-5">
      <div class="flex items-center gap-3">
        <div class="w-9 h-9 rounded-xl bg-primary-container/20 text-primary flex items-center justify-center">
          <span class="material-symbols-outlined">play_circle</span>
        </div>
        <div>
          <h3 class="font-headline-md font-bold text-white">Simulador do Funil Puma Bot</h3>
          <p class="text-body-sm text-on-surface-variant">Teste em tempo real a velocidade de conversão PIX</p>
        </div>
      </div>
      <button onclick="closeDemoModal()" class="w-8 h-8 rounded-lg bg-surface-container-high text-on-surface-variant hover:text-white flex items-center justify-center transition-colors">
        <span class="material-symbols-outlined text-[18px]">close</span>
      </button>
    </div>

    <div class="space-y-4">
      <div class="p-4 rounded-xl bg-surface-container-lowest border border-outline-variant/30 font-label-code text-body-sm text-on-surface space-y-2">
        <div class="text-outline">&gt; 1. Lead digita /start no Telegram</div>
        <div class="text-primary-tint">&gt; 2. Puma Bot gera Chave PIX Dinâmica (Payload EMV)</div>
        <div class="text-secondary">&gt; 3. Gateway dispara Webhook de Liquidação (18ms)</div>
        <div class="text-white">&gt; 4. Convite de uso único entregue ao cliente</div>
      </div>

      <div class="flex items-center justify-between p-4 rounded-xl bg-surface-container border border-secondary/30">
        <div>
          <div class="font-bold text-white text-body-md">Simular Pagamento Instantâneo</div>
          <div class="text-body-sm text-on-surface-variant">Dispara um evento de PIX aprovado no feed da tela</div>
        </div>
        <button onclick="simulatePixPayment()" class="px-4 py-2 rounded-lg bg-secondary text-surface font-semibold text-body-sm hover:bg-secondary/90 transition-transform active:scale-95 flex items-center gap-1.5">
          <span class="material-symbols-outlined text-[18px]">electric_bolt</span>
          Disparar Teste
        </button>
      </div>
    </div>
  </div>
</div>
`;

// Inserir antes de </body>
html = html.replace('</body>', enhancementsMarkup + '\n</body>');

// 4. Script dos novos recursos interativos
const scriptsMarkup = `
<script>
  // Dynamic Live Feed & Toast Simulation
  const mockUsers = [
    { name: '@felipe_crypto', val: 'R$ 147,00', canal: 'VIP Sinais Alpha' },
    { name: '@marina_vendas', val: 'R$ 49,90', canal: 'Grupo Mentoria PRO' },
    { name: '@rodrigo_fx', val: 'R$ 197,00', canal: 'Sala de Operações' },
    { name: '@camila_dropship', val: 'R$ 97,00', canal: 'Comunidade VIP' },
    { name: '@lucas_trader', val: 'R$ 49,90', canal: 'Canal de Análises' }
  ];

  function showToast(title, value, desc) {
    const toast = document.getElementById('live-pix-toast');
    if (!toast) return;
    document.getElementById('toast-title').textContent = title;
    document.getElementById('toast-value').textContent = value;
    document.getElementById('toast-desc').textContent = desc;

    toast.classList.remove('translate-y-32', 'opacity-0');
    toast.classList.add('translate-y-0', 'opacity-100');

    setTimeout(() => {
      toast.classList.remove('translate-y-0', 'opacity-100');
      toast.classList.add('translate-y-32', 'opacity-0');
    }, 4500);
  }

  function simulatePixPayment() {
    const randomUser = mockUsers[Math.floor(Math.random() * mockUsers.length)];
    const container = document.getElementById('live-transactions-container');

    if (container) {
      const newItem = document.createElement('div');
      newItem.className = 'p-2.5 rounded-lg bg-surface-container-low border border-secondary/40 flex items-center justify-between transition-all duration-300 animate-pulse';
      newItem.innerHTML = \`
        <div class="flex items-center gap-2.5">
          <div class="w-7 h-7 rounded-lg bg-secondary/15 flex items-center justify-center text-secondary">
            <span class="material-symbols-outlined text-[16px]">check_circle</span>
          </div>
          <div>
            <div class="text-body-sm font-semibold text-on-surface">Venda aprovada • \${randomUser.val}</div>
            <div class="text-[11px] text-on-surface-variant font-label-code">\${randomUser.name} liberado no \${randomUser.canal}</div>
          </div>
        </div>
        <span class="font-label-tabular text-label-code text-secondary bg-secondary/10 px-2 py-0.5 rounded font-bold">agora</span>
      \`;

      container.prepend(newItem);
      if (container.children.length > 5) {
        container.removeChild(container.lastElementChild);
      }
    }

    showToast('Novo PIX Aprovado', randomUser.val, \`\${randomUser.name} liberado no \${randomUser.canal}\`);
    closeDemoModal();
  }

  // Timer para alimentar o feed periodicamente
  setInterval(() => {
    simulatePixPayment();
  }, 14000);

  // Modal Controls
  function openDemoModal() {
    const modal = document.getElementById('demo-modal');
    if (modal) {
      modal.classList.remove('hidden');
      modal.classList.add('flex');
    }
  }

  function closeDemoModal() {
    const modal = document.getElementById('demo-modal');
    if (modal) {
      modal.classList.add('hidden');
      modal.classList.remove('flex');
    }
  }

  // Interceptar clique no botão "Ver Demonstração do Funil"
  document.querySelectorAll('a[href="#demo"]').forEach(el => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      openDemoModal();
    });
  });

  // Atalho de teclado ⌘K / Ctrl+K
  document.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      const modal = document.getElementById('demo-modal');
      if (modal && modal.classList.contains('flex')) {
        closeDemoModal();
      } else {
        openDemoModal();
      }
    }
  });
</script>
`;

html = html.replace('</body>', scriptsMarkup + '\n</body>');

fs.writeFileSync('public/index.html', html);

// Sincronizar +page.svelte
const start = html.indexOf('<body');
const bodyOpenEnd = html.indexOf('>', start);
const end = html.lastIndexOf('</body>');
const body = html.substring(bodyOpenEnd + 1, end);
fs.writeFileSync('src/routes/+page.svelte', '<svelte:head>\n  <title>Puma Bot — Gateway PIX & Automação de Alta Conversão no Telegram</title>\n</svelte:head>\n\n' + body);

console.log('Melhorias aplicadas e sincronizadas com sucesso!');

