<script lang="ts">
  import { onMount } from 'svelte';
  import { slide, fade } from 'svelte/transition';
  import FaqAccordion from '$lib/components/FaqAccordion.svelte';
  import Footer from '$lib/components/Footer.svelte';

  let faturamento = 50000;
  let isDemoModalOpen = false;
  let showToast = false;
  let toastTitle = 'Novo PIX Aprovado';
  let toastValue = '+ R$ 97,00';
  let toastDesc = '@usuario liberado no Canal VIP';
  let toastTimer: ReturnType<typeof setTimeout> | null = null;

  $: avgTicket = 97;
  $: salesCount = Math.round(faturamento / avgTicket);
  $: legacyCost = (faturamento * 0.079) + (salesCount * 1.00);
  $: pumaCost = salesCount * 0.50;
  $: monthlySavings = Math.max(0, legacyCost - pumaCost);
  $: annualSavings = monthlySavings * 12;

  const faqItems = [
    {
      question: 'Preciso pagar alguma taxa ou mensalidade para criar minha conta?',
      answer: 'Não. O cadastro, a integração com múltiplos bots e o construtor de funis são 100% gratuitos. Você só paga R$ 0,50 quando uma venda via PIX for efetivamente confirmada e aprovada pelo banco.'
    },
    {
      question: 'O dinheiro do PIX cai na minha conta ou fica retido com o Puma Bot?',
      answer: 'O valor cai imediatamente na sua conta cadastrada junto ao gateway de liquidação (PushinPay, Mercado Pago, Efí Bank, etc). O Puma Bot não faz custódia do seu faturamento bruto.'
    },
    {
      question: 'O que acontece se meu bot sofrer limite de requisições no Telegram?',
      answer: 'O Puma Bot implementa arquitetura com balanceamento distribuído. Você pode cadastrar instâncias reservas do BotFather e nossa fila gerencia o backoff exponencial e o roteamento imediato de requisições.'
    },
    {
      question: 'Posso usar meus próprios domínios e rastreadores (UTMify, Pixel)?',
      answer: 'Sim! Temos suporte nativo para UTMify, Facebook Conversions API, TikTok Pixel e Google Ads, garantindo que você rastreie desde o clique do anúncio até o comando /start e a aprovação do PIX.'
    }
  ];

  function formatBrl(val: number) {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val || 0);
  }

  function openDemoModal() {
    isDemoModalOpen = true;
  }

  function closeDemoModal() {
    isDemoModalOpen = false;
  }

  function simulatePixPayment() {
    toastTitle = 'Novo PIX Aprovado';
    toastValue = `+ ${formatBrl(avgTicket)}`;
    toastDesc = `@lead_${Math.floor(1000 + Math.random() * 9000)} liberado no Canal VIP`;
    showToast = true;
    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      showToast = false;
    }, 4000);
  }

  onMount(() => {
    // Atalho de teclado K / ESC
    function handleKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        isDemoModalOpen = !isDemoModalOpen;
      }
      if (e.key === 'Escape' && isDemoModalOpen) {
        isDemoModalOpen = false;
      }
    }
    window.addEventListener('keydown', handleKey);
    return () => {
      window.removeEventListener('keydown', handleKey);
      if (toastTimer) clearTimeout(toastTimer);
    };
  });
</script>

<svelte:head>
 <title>Puma Bot — Gateway PIX & Automação de Alta Conversão no Telegram</title>
</svelte:head>


<!-- TopNavBar (Shared Component JSON Blueprint) -->
<header class="fixed top-0 left-0 right-0 z-50 w-full bg-surface/80 dark:bg-surface/80 backdrop-blur-md border-b border-outline-variant/30 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.07)]">
<div class="flex justify-between items-center max-w-7xl mx-auto px-4 md:px-8 h-16">
<!-- Brand & Version Anchor -->
<div class="flex items-center gap-3">
<a class="flex items-center gap-2.5 group" href="/">
<div class="relative w-8 h-8 rounded-xl bg-surface-container-lowest border border-outline-variant/40 flex items-center justify-center overflow-hidden p-1 shadow-inner">
<img alt="Logo Puma Bot perfil violeta minimalista" class="w-full h-full object-contain filter drop-shadow group-hover:scale-105 transition-transform duration-200" src="https://lh3.googleusercontent.com/aida-public/AB6AXuApMe26OJRCrk9Da2M1tSH_NEUFMosNGCHptrVStnQTT55QwOPWNedO8DlKHnkENQNTYaHA5yGQHwwJ2qPI9plY7o8sGn1GddyD243xTxVM-TYELVX2Vw4tFG8FPaAZ4_CFN7kwbQMwmZcTkeAJ_9wrKIiGmsnkDvQR1rkfdEAct7cEpMaTdS0vjEzkGsdSYLOgVt4dbRODh-IzRsoK9QUC5AWbbdIjOOf-uZVEy7vFZL09aW0VWvjDlQ"/>
</div>
<span class="text-headline-md font-headline-md font-bold tracking-tight text-on-surface dark:text-on-surface flex items-center gap-2">
 Puma Bot
 </span>
</a>
<span class="hidden sm:inline-flex items-center gap-1.5 px-2 py-0.5 rounded-lg bg-surface-container border border-outline-variant/30 text-primary font-label-code text-label-code">
<span class="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse"></span>
 v2.4 PRO
 </span>
</div>
<!-- Navigation Links from JSON Anchor -->
<nav class="hidden md:flex items-center gap-7">
<a class="text-on-surface-variant hover:text-on-surface font-medium text-body-md transition-colors" href="#recursos">Recursos</a>
<a class="text-on-surface-variant hover:text-on-surface font-medium text-body-md transition-colors" href="#solucoes">Soluções</a>
<a class="text-on-surface-variant hover:text-on-surface font-medium text-body-md transition-colors" href="#taxas">Taxas</a>
<a class="text-on-surface-variant hover:text-on-surface font-medium text-body-md transition-colors" href="#gateways">Gateways</a>
<a class="text-on-surface-variant hover:text-on-surface font-medium text-body-md transition-colors" href="#documentacao">Documentação</a>
<a class="text-on-surface-variant hover:text-on-surface font-medium text-body-md transition-colors" href="#faq">Dúvidas</a>
</nav>
<!-- Trailing Status & Actions -->
<div class="flex items-center gap-3.5">
<!-- Telemetry Live Status -->
<div class="hidden lg:flex items-center gap-2 px-2.5 py-1 rounded-lg bg-surface-container-low border border-outline-variant/20">
<span class="w-2 h-2 rounded-full bg-secondary"></span>
<span class="font-label-tabular text-label-badge text-on-surface-variant">API 99.98% Online</span>
<span class="material-symbols-outlined text-outline text-[14px]">terminal</span>
</div>
<a class="text-on-surface-variant hover:text-on-surface text-body-md font-body-md px-3 py-1.5 rounded-lg transition-colors" href="/login">
 Entrar
 </a>
<a class="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-primary-container hover:bg-primary-container/90 text-on-primary-container font-headline-sm text-headline-sm font-semibold shadow-[inset_0_1px_0_0_rgba(255,255,255,0.25)] border border-primary-fixed-dim/40 active:scale-[0.98] transition-all" href="/cadastro">
 Criar Bot Grátis
 <span class="material-symbols-outlined text-[16px]">arrow_forward</span>
</a>
</div>
</div>
</header>
<!-- Hero Section -->
<section class="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden carbon-mesh">
<!-- Ambient subtle violet atmospheric radiance -->
<div class="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[360px] bg-primary-container/15 blur-[120px] rounded-full pointer-events-none -z-10"></div>
<div class="max-w-7xl mx-auto px-4 md:px-8">
<!-- Announcement Pill -->
<div class="flex justify-center mb-6">
<div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-container border border-outline-variant/40 shadow-sm">
<span class="flex h-2 w-2 relative">
<span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-container opacity-75"></span>
<span class="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
</span>
<span class="text-label-tabular font-label-tabular text-on-surface text-body-sm">
 Puma Engine v2.4 Liberado • Conecte múltiplos bots em segundos
 </span>
<span class="material-symbols-outlined text-primary text-[14px]">chevron_right</span>
</div>
</div>
<!-- Hero Typography -->
<div class="text-center max-w-4xl mx-auto mb-10">
<h1 class="text-headline-xl font-headline-xl md:text-[52px] md:leading-[58px] font-extrabold tracking-tight text-on-surface mb-6">
 Transforme seu Telegram em uma máquina autônoma de vendas no <span class="bg-gradient-to-r from-primary-fixed via-primary to-secondary bg-clip-text text-transparent">PIX</span>
</h1>
<p class="text-body-lg font-body-lg text-on-surface-variant max-w-2xl mx-auto">
 Funis inteligentes, remarketing automático com áudio nativo, checkout de 1 clique e liquidação instantânea sem mensalidade. Pague apenas <span class="text-on-surface font-semibold underline decoration-secondary underline-offset-4">R$ 0,50 por PIX aprovado</span>.
 </p>
<!-- CTA Action Cluster -->
<div class="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
<a class="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-primary-container hover:bg-primary-container/90 text-on-primary-container font-headline-sm text-headline-sm font-semibold shadow-[0_12px_24px_-6px_rgba(124,58,237,0.4),inset_0_1px_0_0_rgba(255,255,255,0.25)] border border-primary-fixed-dim/40 active:scale-[0.98] transition-all" href="/cadastro">
<span class="material-symbols-outlined text-[18px]">bolt</span>
 Criar Conta Gratuita
 </a>
<button type="button" on:click={() => isDemoModalOpen = true} class="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-surface-container-high hover:bg-surface-variant text-on-surface border border-outline-variant/40 font-headline-sm text-headline-sm font-medium active:scale-[0.98] transition-all group">
<span class="material-symbols-outlined text-primary text-[18px]">play_circle</span>
 Ver Demonstração do Funil (2 min)
 <kbd class="hidden sm:inline-block px-1.5 py-0.5 rounded bg-surface-container-lowest border border-outline-variant/30 text-label-tabular font-label-tabular text-[11px] text-on-surface-variant group-hover:text-on-surface">K</kbd>
</button>
</div>
<!-- Telemetry Metric Strip -->
<div class="mt-12 grid grid-cols-2 md:grid-cols-3 gap-4 max-w-2xl mx-auto pt-6 border-t border-outline-variant/20">
<div class="flex flex-col items-center">
<span class="font-label-tabular text-headline-lg font-headline-lg font-bold text-on-surface tracking-tight">+R$ 50M</span>
<span class="font-body-sm text-body-sm text-on-surface-variant mt-0.5">Processados no PIX</span>
</div>
<div class="flex flex-col items-center">
<span class="font-label-tabular text-headline-lg font-headline-lg font-bold text-on-surface tracking-tight">10.000+</span>
<span class="font-body-sm text-body-sm text-on-surface-variant mt-0.5">Bots ativos em produção</span>
</div>
<div class="col-span-2 md:col-span-1 flex flex-col items-center">
<span class="font-label-tabular text-headline-lg font-headline-lg font-bold text-secondary tracking-tight">18ms</span>
<span class="font-body-sm text-body-sm text-on-surface-variant mt-0.5">Latência no webhook</span>
</div>
</div>
</div>
<!-- High Craft Hero Mockup Display (Puma Cockpit + Live Stream Feed) -->
<div id="demo" class="relative max-w-5xl mx-auto mt-6 scroll-mt-24">
<div class="rounded-2xl p-1.5 md:p-2 bg-gradient-to-b from-outline-variant/40 via-surface-container-high/40 to-surface-container-lowest border border-outline-variant/30 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.85)]">
<div class="rounded-xl bg-surface-container-lowest border border-outline-variant/30 overflow-hidden">
<!-- Window Titlebar -->
<div class="h-10 px-4 bg-surface-container-low border-b border-outline-variant/20 flex items-center justify-between">
<div class="flex items-center gap-2">
<span class="w-3 h-3 rounded-full bg-error-container/60 border border-error/40"></span>
<span class="w-3 h-3 rounded-full bg-tertiary-container/60 border border-tertiary/40"></span>
<span class="w-3 h-3 rounded-full bg-secondary-container/60 border border-secondary/40"></span>
<span class="ml-2 font-label-tabular text-body-sm text-outline">puma://engine/live-telemetry</span>
</div>
<div class="flex items-center gap-3">
<span class="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-surface-container text-label-badge font-label-badge text-secondary border border-secondary/20">
<span class="w-1.5 h-1.5 rounded-full bg-secondary"></span> 100% ONLINE
 </span>
<span class="font-label-code text-label-code text-on-surface-variant">Cluster: SA-EAST-1</span>
</div>
</div>
<!-- Dashboard Internal Grid -->
<div class="p-4 md:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 bg-surface-dim">
<!-- Metrics Column (Left 7 Cols) -->
<div class="lg:col-span-7 space-y-4">
<!-- Quick KPI Row -->
<div class="grid grid-cols-3 gap-3">
<div class="p-3 rounded-xl bg-surface-container-low border border-outline-variant/20 rim-card">
<span class="text-body-sm font-body-sm text-on-surface-variant block mb-1">Faturamento Hoje</span>
<span class="font-label-tabular text-headline-sm font-headline-sm font-bold text-on-surface">R$ 29.556,38</span>
<span class="font-label-tabular text-label-badge text-secondary block mt-1">↑ +24.8% vs ontem</span>
</div>
<div class="p-3 rounded-xl bg-surface-container-low border border-outline-variant/20 rim-card">
<span class="text-body-sm font-body-sm text-on-surface-variant block mb-1">Conversão PIX</span>
<span class="font-label-tabular text-headline-sm font-headline-sm font-bold text-secondary">94.2%</span>
<span class="font-label-tabular text-label-badge text-on-surface-variant block mt-1">2.009 vendas</span>
</div>
<div class="p-3 rounded-xl bg-surface-container-low border border-outline-variant/20 rim-card">
<span class="text-body-sm font-body-sm text-on-surface-variant block mb-1">Custo Plataforma</span>
<span class="font-label-tabular text-headline-sm font-headline-sm font-bold text-primary">R$ 0,50 <span class="text-[10px] font-normal text-on-surface-variant">/tx</span></span>
<span class="font-label-tabular text-label-badge text-secondary block mt-1">Zero % percentual</span>
</div>
</div>
<!-- Live Funnel Node Diagram Graphic -->
<div class="p-4 rounded-xl bg-surface-container-lowest border border-outline-variant/30 relative overflow-hidden">
<div class="flex items-center justify-between pb-3 border-b border-outline-variant/20 mb-3">
<span class="font-headline-sm text-headline-sm text-on-surface font-semibold flex items-center gap-2">
<span class="material-symbols-outlined text-primary text-[18px]">account_tree</span>
 Fluxo Ativo: Oferta VIP Perpétuo [Node #04]
 </span>
<span class="font-label-code text-label-code text-primary bg-primary-container/20 px-2 py-0.5 rounded border border-primary/30">Auto-Disparo</span>
</div>
<!-- Node steps -->
<div id="live-transactions-container" class="space-y-2.5">
<div class="p-2.5 rounded-lg bg-surface-container-low border border-outline-variant/20 flex items-center justify-between text-body-sm">
<div class="flex items-center gap-2">
<span class="w-5 h-5 rounded-full bg-primary/20 text-primary font-label-tabular text-label-code flex items-center justify-center font-bold">1</span>
<span class="text-on-surface">Lead aciona comando <code class="text-primary font-label-code">/start</code></span>
</div>
<span class="font-label-tabular text-label-code text-secondary">100% (2.410)</span>
</div>
<div class="p-2.5 rounded-lg bg-surface-container-low border border-outline-variant/20 flex items-center justify-between text-body-sm">
<div class="flex items-center gap-2">
<span class="w-5 h-5 rounded-full bg-primary/20 text-primary font-label-tabular text-label-code flex items-center justify-center font-bold">2</span>
<span class="text-on-surface">Envio de Vídeo de Apresentação + Oferta R$ 97,00</span>
</div>
<span class="font-label-tabular text-label-code text-secondary">88.4% (2.130)</span>
</div>
<div class="p-2.5 rounded-lg bg-primary-container/10 border border-primary/30 flex items-center justify-between text-body-sm">
<div class="flex items-center gap-2">
<span class="w-5 h-5 rounded-full bg-primary-container text-on-primary-container font-label-tabular text-label-code flex items-center justify-center font-bold">3</span>
<span class="text-on-surface font-medium">Geração de Copia e Cola PIX Instantâneo</span>
</div>
<span class="font-label-tabular text-label-code text-primary font-bold">94.2% Aprovado</span>
</div>
<div class="p-2.5 rounded-lg bg-surface-container-low border border-outline-variant/20 flex items-center justify-between text-body-sm">
<div class="flex items-center gap-2">
<span class="w-5 h-5 rounded-full bg-secondary/20 text-secondary font-label-tabular text-label-code flex items-center justify-center font-bold">4</span>
<span class="text-on-surface">Entrega de Link Exclusivo do Canal VIP Privado</span>
</div>
<span class="font-label-tabular text-label-code text-secondary font-bold">Webhook 12ms</span>
</div>
</div>
</div>
</div>
<!-- Live Stream Transaction Ticker (Right 5 Cols) -->
<div class="lg:col-span-5 flex flex-col h-full">
<div class="p-4 rounded-xl bg-surface-container-lowest border border-outline-variant/30 flex-1 flex flex-col justify-between">
<div>
<div class="flex items-center justify-between pb-3 border-b border-outline-variant/20 mb-3">
<span class="font-headline-sm text-headline-sm text-on-surface font-semibold flex items-center gap-2">
<span class="w-2 h-2 rounded-full bg-secondary animate-ping"></span>
 Transações em Tempo Real
 </span>
<span class="font-label-code text-label-badge text-on-surface-variant">Live Feed</span>
</div>
<!-- Live feed items -->
<div class="space-y-2.5">
<!-- Notification 1 -->
<div class="p-2.5 rounded-lg bg-surface-container-low border border-secondary/20 flex items-center justify-between">
<div class="flex items-center gap-2.5">
<div class="w-7 h-7 rounded-lg bg-secondary/15 flex items-center justify-center text-secondary">
<span class="material-symbols-outlined text-[16px]">check_circle</span>
</div>
<div>
<div class="text-body-sm font-semibold text-on-surface">Venda aprovada • R$ 97,00</div>
<div class="text-[11px] text-on-surface-variant font-label-code">@marcos_trader liberado no VIP</div>
</div>
</div>
<span class="font-label-tabular text-label-code text-secondary bg-secondary/10 px-2 py-0.5 rounded">agora</span>
</div>
<!-- Notification 2 -->
<div class="p-2.5 rounded-lg bg-surface-container-low border border-outline-variant/20 flex items-center justify-between">
<div class="flex items-center gap-2.5">
<div class="w-7 h-7 rounded-lg bg-primary-container/20 flex items-center justify-center text-primary">
<span class="material-symbols-outlined text-[16px]">mic</span>
</div>
<div>
<div class="text-body-sm font-semibold text-on-surface">Remarketing Áudio Enviado</div>
<div class="text-[11px] text-on-surface-variant font-label-code">Lead @carla_fx recuperado</div>
</div>
</div>
<span class="font-label-tabular text-label-code text-on-surface-variant">há 12s</span>
</div>
<!-- Notification 3 -->
<div class="p-2.5 rounded-lg bg-surface-container-low border border-secondary/20 flex items-center justify-between">
<div class="flex items-center gap-2.5">
<div class="w-7 h-7 rounded-lg bg-secondary/15 flex items-center justify-center text-secondary">
<span class="material-symbols-outlined text-[16px]">check_circle</span>
</div>
<div>
<div class="text-body-sm font-semibold text-on-surface">Venda aprovada • R$ 197,00</div>
<div class="text-[11px] text-on-surface-variant font-label-code">PushinPay Failover • VIP Black</div>
</div>
</div>
<span class="font-label-tabular text-label-code text-secondary bg-secondary/10 px-2 py-0.5 rounded">há 34s</span>
</div>
<!-- Notification 4 -->
<div class="p-2.5 rounded-lg bg-surface-container-low border border-outline-variant/20 flex items-center justify-between">
<div class="flex items-center gap-2.5">
<div class="w-7 h-7 rounded-lg bg-surface-container-highest flex items-center justify-center text-on-surface">
<span class="material-symbols-outlined text-[16px]">sync</span>
</div>
<div>
<div class="text-body-sm font-semibold text-on-surface">Broadcast Concluído</div>
<div class="text-[11px] text-on-surface-variant font-label-code">1.247 mensagens entregues</div>
</div>
</div>
<span class="font-label-tabular text-label-code text-on-surface-variant">há 1m</span>
</div>
</div>
</div>
<!-- Quick fee reminder footer -->
<div class="mt-4 pt-3 border-t border-outline-variant/20 flex items-center justify-between text-body-sm">
<span class="text-on-surface-variant">Taxa líquida Puma:</span>
<span class="font-label-tabular text-on-surface font-bold text-secondary">R$ 0,50 fixo por venda</span>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</section>
<!-- Integration Gateways & Cascade Failover Strip -->
<section class="py-12 border-y border-outline-variant/20 bg-surface-container-lowest/60 scroll-mt-16" id="gateways">
<div class="max-w-7xl mx-auto px-4 md:px-8">
<div class="text-center mb-6">
<span class="font-label-code text-label-code text-on-surface-variant uppercase tracking-widest">
 Multi-Gateways Nativos com Cascata e Failover Automático
 </span>
</div>
<!-- Gateways Grid -->
<div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
<div class="p-3 rounded-xl bg-surface-container-low border border-outline-variant/20 flex items-center justify-center gap-2 hover:border-primary/40 transition-colors">
<span class="w-2 h-2 rounded-full bg-secondary"></span>
<span class="font-headline-sm text-headline-sm font-semibold text-on-surface">PushinPay</span>
</div>
<div class="p-3 rounded-xl bg-surface-container-low border border-outline-variant/20 flex items-center justify-center gap-2 hover:border-primary/40 transition-colors">
<span class="w-2 h-2 rounded-full bg-secondary"></span>
<span class="font-headline-sm text-headline-sm font-semibold text-on-surface">SyncPay</span>
</div>
<div class="p-3 rounded-xl bg-surface-container-low border border-outline-variant/20 flex items-center justify-center gap-2 hover:border-primary/40 transition-colors">
<span class="w-2 h-2 rounded-full bg-secondary"></span>
<span class="font-headline-sm text-headline-sm font-semibold text-on-surface">AbacatePay</span>
</div>
<div class="p-3 rounded-xl bg-surface-container-low border border-outline-variant/20 flex items-center justify-center gap-2 hover:border-primary/40 transition-colors">
<span class="w-2 h-2 rounded-full bg-secondary"></span>
<span class="font-headline-sm text-headline-sm font-semibold text-on-surface">Mercado Pago</span>
</div>
<div class="p-3 rounded-xl bg-surface-container-low border border-outline-variant/20 flex items-center justify-center gap-2 hover:border-primary/40 transition-colors">
<span class="w-2 h-2 rounded-full bg-secondary"></span>
<span class="font-headline-sm text-headline-sm font-semibold text-on-surface">Efí Bank</span>
</div>
<div class="p-3 rounded-xl bg-surface-container-low border border-outline-variant/20 flex items-center justify-center gap-2 hover:border-primary/40 transition-colors">
<span class="w-2 h-2 rounded-full bg-secondary"></span>
<span class="font-headline-sm text-headline-sm font-semibold text-on-surface">Asaas PIX</span>
</div>
</div>
<p class="text-center font-body-sm text-body-sm text-on-surface-variant mt-4">
 Se um gateway oscilar ou demorar mais de 300ms, o Puma Bot comuta a chave PIX instantaneamente sem o cliente perceber.
 </p>
</div>
</section>
<!-- Fee Comparison & Interactive Profit Calculator (Inspired by AbacatePay / Raven) -->
<section class="py-20 md:py-28 relative" id="taxas">
<div class="max-w-7xl mx-auto px-4 md:px-8">
<div class="max-w-3xl mx-auto text-center mb-16">
<span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary/10 border border-secondary/30 text-secondary font-label-code text-label-code mb-4">
<span class="material-symbols-outlined text-[14px]">price_check</span>
 SEM MENSALIDADE • SEM TAXA PERCENTUAL
 </span>
<h2 class="text-headline-xl font-headline-xl text-on-surface font-bold tracking-tight mb-4">
 Pare de pagar 5% a 10% por cada venda no Telegram
 </h2>
<p class="text-body-lg font-body-lg text-on-surface-variant">
 Enquanto plataformas tradicionais devoram seu lucro com comissões abusivas e taxas escondidas, o Puma Bot opera com taxa fixa de <strong class="text-on-surface">R$ 0,50 por transação aprovada</strong>.
 </p>
</div>
<!-- Calculator & Comparison Bento Grid -->
<div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
<!-- Interactive Simulator (Left 7 Cols) -->
<div class="lg:col-span-7 p-6 md:p-8 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 rim-card shadow-2xl">
<div class="flex items-center justify-between mb-6">
<span class="text-headline-md font-headline-md font-semibold text-on-surface">Simulador de Economia Líquida</span>
<span class="font-label-code text-label-code text-primary bg-primary-container/20 px-2.5 py-1 rounded-lg border border-primary/30">Cálculo em Tempo Real</span>
</div>
<!-- Slider Control -->
<div class="mb-8">
<div class="flex justify-between items-center mb-3">
<label class="text-body-md font-body-md text-on-surface-variant" for="faturamentoRange">Seu faturamento mensal estimado:</label>
<span class="font-label-tabular text-headline-md font-headline-md font-bold text-secondary" id="faturamentoDisplay">{formatBrl(faturamento)}</span>
</div>
<input class="w-full h-2 bg-surface-container-high rounded-lg appearance-none cursor-pointer accent-primary-container" id="faturamentoRange" max="250000" min="5000" step="5000" type="range" bind:value={faturamento}/>
<div class="flex justify-between text-[11px] font-label-code text-on-surface-variant mt-2">
<span>R$ 5.000</span>
<span>R$ 50.000</span>
<span>R$ 150.000</span>
<span>R$ 250.000+</span>
</div>
</div>
<!-- Side-by-side Numbers -->
<div class="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6 border-t border-outline-variant/20 mb-6">
<div class="p-4 rounded-xl bg-surface-container-low border border-error/20">
<span class="text-body-sm font-body-sm text-error block mb-1">Plataformas Legadas (7.9% + R$ 1)</span>
<span class="font-label-tabular text-headline-md font-headline-md font-bold text-error" id="custoTradicional">{formatBrl(legacyCost)}</span>
<span class="text-[11px] text-on-surface-variant block mt-1">Descontados do seu saldo todo mês</span>
</div>
<div class="p-4 rounded-xl bg-primary-container/10 border border-primary/40">
<span class="text-body-sm font-body-sm text-primary block mb-1">Com Puma Bot (R$ 0,50 fixo)</span>
<span class="font-label-tabular text-headline-md font-headline-md font-bold text-secondary" id="custoPuma">{formatBrl(pumaCost)}</span>
<span class="text-[11px] text-primary block mt-1">Economia pura que volta pro seu bolso</span>
</div>
</div>
<!-- Result Banner -->
<div class="p-4 rounded-xl bg-surface-container border border-secondary/30 flex items-center justify-between">
<div>
<span class="text-body-sm font-body-sm text-on-surface-variant block">Você economiza anualmente:</span>
<span class="font-label-tabular text-headline-lg font-headline-lg font-extrabold text-secondary" id="economiaAnual">{formatBrl(annualSavings)}</span>
</div>
<a class="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-secondary hover:bg-secondary/90 text-on-secondary font-headline-sm text-headline-sm font-semibold transition-all" href="/cadastro">
 Garantir Taxa Fixa
 <span class="material-symbols-outlined text-[16px]">arrow_forward</span>
</a>
</div>
</div>
<!-- Rules of Fairness (Right 5 Cols) -->
<div class="lg:col-span-5 space-y-4">
<div class="p-6 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 rim-card">
<div class="w-10 h-10 rounded-xl bg-primary-container/20 border border-primary/30 flex items-center justify-center text-primary mb-4">
<span class="material-symbols-outlined text-[22px]">lock_open</span>
</div>
<h3 class="text-headline-sm font-headline-sm font-semibold text-on-surface mb-2">Sem Mensalidade ou Assinatura</h3>
<p class="text-body-md font-body-md text-on-surface-variant">
 Crie quantos bots quiser, conecte quantos canais precisar. Se você não vender em um determinado mês, sua fatura é rigorosamente <strong class="text-on-surface">R$ 0,00</strong>.
 </p>
</div>
<div class="p-6 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 rim-card">
<div class="w-10 h-10 rounded-xl bg-secondary/15 border border-secondary/30 flex items-center justify-center text-secondary mb-4">
<span class="material-symbols-outlined text-[22px]">account_balance_wallet</span>
</div>
<h3 class="text-headline-sm font-headline-sm font-semibold text-on-surface mb-2">Liquidação Direta no seu Banco</h3>
<p class="text-body-md font-body-md text-on-surface-variant">
 O dinheiro do PIX não fica preso conosco para render flutuante de dias. Cai direto na sua conta do gateway configurado em segundos.
 </p>
</div>
<div class="p-4 rounded-xl bg-surface-container-low border border-outline-variant/20 flex items-center justify-between text-body-sm font-label-tabular">
<span class="text-on-surface-variant">Vendeu R$ 20 → Paga R$ 0,50</span>
<span class="text-secondary font-semibold">Vendeu R$ 500 → Paga R$ 0,50</span>
</div>
</div>
</div>
</div>
</section>
<!-- Bento Grid de Engenharia de Produto (Features) -->
<section class="py-20 bg-surface-dim relative border-t border-outline-variant/20" id="recursos">
<div class="max-w-7xl mx-auto px-4 md:px-8">
<div class="max-w-3xl mb-14">
<span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-container/20 border border-primary/30 text-primary font-label-code text-label-code mb-4">
<span class="material-symbols-outlined text-[14px]">tune</span>
 ENGENHARIA PARA ALTA ESCALA
 </span>
<h2 class="text-headline-xl font-headline-xl font-bold text-on-surface tracking-tight mb-3">
 Recursos construídos para operadores que não podem perder uma única venda
 </h2>
<p class="text-body-lg font-body-lg text-on-surface-variant">
 De disparos de remarketing nativo com áudio a rotações de instâncias para contornar instabilidades do Telegram.
 </p>
</div>
<!-- Bento Grid Construction -->
<div class="grid grid-cols-1 md:grid-cols-12 gap-5">
<!-- Bento 1: Funnel Node Editor (Large 7 Cols) -->
<div class="md:col-span-7 p-6 md:p-8 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 rim-card flex flex-col justify-between">
<div>
<div class="inline-flex items-center gap-2 text-primary font-label-code text-label-code mb-3">
<span class="material-symbols-outlined text-[18px]">schema</span>
 CONSTRUTOR DE FUNIL INTELIGENTE
 </div>
<h3 class="text-headline-lg font-headline-lg font-semibold text-on-surface mb-3">
 Fluxos visuais sem código: Menus Inline, Copys e Timers de Urgência
 </h3>
<p class="text-body-md font-body-md text-on-surface-variant mb-6">
 Monte cadências complexas de mensagens quando o usuário clica em botões específicos. Programe atrasos calculados (ex: esperar 3 minutos para enviar cupom de desconto) e reduza atrito na decisão de compra.
 </p>
</div>
<!-- Interactive Micro Mockup -->
<div class="p-4 rounded-xl bg-surface-container-low border border-outline-variant/30 space-y-2">
<div class="flex items-center justify-between text-body-sm font-label-code text-outline">
<span>Trigger: Botão 'Quero Acesso VIP'</span>
<span class="text-secondary">Ativo</span>
</div>
<div class="p-3 rounded-lg bg-surface-container border border-outline-variant/20 text-body-sm text-on-surface flex items-center justify-between">
<span> Enviar Mensagem + PIX Dinâmico + Timer 15m</span>
<span class="material-symbols-outlined text-primary text-[18px]">timer</span>
</div>
</div>
</div>
<!-- Bento 2: Native Audio Recovery (5 Cols) -->
<div class="md:col-span-5 p-6 md:p-8 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 rim-card flex flex-col justify-between">
<div>
<div class="inline-flex items-center gap-2 text-secondary font-label-code text-label-code mb-3">
<span class="material-symbols-outlined text-[18px]">record_voice_over</span>
 RECUPERAÇÃO DE ALTA CONVERSÃO
 </div>
<h3 class="text-headline-lg font-headline-lg font-semibold text-on-surface mb-3">
 Disparo de Áudio Nativo gravado na hora
 </h3>
<p class="text-body-md font-body-md text-on-surface-variant mb-6">
 O Puma Bot não envia áudio como arquivo anexado. Ele simula 'gravando áudio...' e envia como mensagem de voz real com onda senoidal no Telegram, multiplicando as chances do lead ouvir e pagar.
 </p>
</div>
<div class="p-3.5 rounded-xl bg-surface-container-low border border-secondary/20 flex items-center gap-3">
<button class="w-8 h-8 rounded-full bg-secondary/20 text-secondary flex items-center justify-center">
<span class="material-symbols-outlined text-[18px]">play_arrow</span>
</button>
<div class="flex-1">
<div class="h-2 rounded-full bg-surface-container-highest overflow-hidden">
<div class="h-full w-2/3 bg-secondary rounded-full"></div>
</div>
<div class="flex justify-between text-[10px] font-label-tabular text-on-surface-variant mt-1">
<span>0:14</span>
<span>"Fala irmão! Vi que gerou o PIX..."</span>
<span>0:28</span>
</div>
</div>
</div>
</div>
<!-- Bento 3: VIP Membership Automation (4 Cols) -->
<div class="md:col-span-4 p-6 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 rim-card">
<div class="w-10 h-10 rounded-xl bg-primary-container/20 border border-primary/30 flex items-center justify-center text-primary mb-4">
<span class="material-symbols-outlined text-[20px]">groups</span>
</div>
<h3 class="text-headline-sm font-headline-sm font-semibold text-on-surface mb-2">Gestão de Grupos &amp; Canais VIP</h3>
<p class="text-body-md font-body-md text-on-surface-variant">
 Liberação instantânea por link de uso único e remoção automática no segundo exato em que a assinatura expira ou o pagamento falha.
 </p>
</div>
<!-- Bento 4: Anti-Ban & Multiple BotFather Tokens (4 Cols) -->
<div class="md:col-span-4 p-6 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 rim-card">
<div class="w-10 h-10 rounded-xl bg-surface-container-highest border border-outline-variant/40 flex items-center justify-center text-on-surface mb-4">
<span class="material-symbols-outlined text-[20px]">security</span>
</div>
<h3 class="text-headline-sm font-headline-sm font-semibold text-on-surface mb-2">Anti-Bloqueio &amp; Rotação de Tokens</h3>
<p class="text-body-md font-body-md text-on-surface-variant">
 Cadastre múltiplos tokens de bot. Se houver limite de taxa imposto pela API do Telegram, o tráfego é rebalanceado em frações de segundo.
 </p>
</div>
<!-- Bento 5: Ultra Low Latency Failover (4 Cols) -->
<div class="md:col-span-4 p-6 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 rim-card">
<div class="w-10 h-10 rounded-xl bg-secondary/15 border border-secondary/30 flex items-center justify-center text-secondary mb-4">
<span class="material-symbols-outlined text-[20px]">speed</span>
</div>
<h3 class="text-headline-sm font-headline-sm font-semibold text-on-surface mb-2">Latência Sub-280ms no Webhook</h3>
<p class="text-body-md font-body-md text-on-surface-variant">
 Hospedagem distribuída em São Paulo com links dedicados aos data centers dos maiores bancos emissores de PIX.
 </p>
</div>
</div>
</div>
</section>
<!-- Step-by-Step Practical Implementation (4 Passos) -->
<section class="py-20 md:py-28 relative scroll-mt-16" id="solucoes">
<div id="passos"></div>
<div class="max-w-7xl mx-auto px-4 md:px-8">
<div class="text-center max-w-3xl mx-auto mb-16">
<span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container border border-outline-variant/40 text-on-surface font-label-code text-label-code mb-4">
 SETUP RELÂMPAGO
 </span>
<h2 class="text-headline-xl font-headline-xl font-bold text-on-surface tracking-tight mb-4">
 Como o Puma Bot funciona na prática em 4 passos simples
 </h2>
<p class="text-body-lg font-body-lg text-on-surface-variant">
 Sem deploys complexos de servidores, sem escrever uma linha de código. Você pronto para faturar em menos de 5 minutos.
 </p>
</div>
<div class="grid grid-cols-1 md:grid-cols-4 gap-6">
<!-- Step 1 -->
<div class="p-6 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 rim-card relative">
<div class="font-label-tabular text-headline-xl font-headline-xl font-extrabold text-outline-variant/40 mb-3">01</div>
<h3 class="text-headline-sm font-headline-sm font-semibold text-on-surface mb-2">Conecte o @BotFather</h3>
<p class="text-body-md font-body-md text-on-surface-variant">
 Crie seu bot no Telegram e cole o token da API no Puma Bot. A conexão é validada em menos de 3 segundos.
 </p>
</div>
<!-- Step 2 -->
<div class="p-6 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 rim-card relative">
<div class="font-label-tabular text-headline-xl font-headline-xl font-extrabold text-outline-variant/40 mb-3">02</div>
<h3 class="text-headline-sm font-headline-sm font-semibold text-on-surface mb-2">Desenhe o Funil &amp; PIX</h3>
<p class="text-body-md font-body-md text-on-surface-variant">
 Escreva os textos de boas-vindas, adicione mídias, defina o preço da oferta e plugue sua chave do gateway PIX preferido.
 </p>
</div>
<!-- Step 3 -->
<div class="p-6 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 rim-card relative">
<div class="font-label-tabular text-headline-xl font-headline-xl font-extrabold text-primary mb-3">03</div>
<h3 class="text-headline-sm font-headline-sm font-semibold text-on-surface mb-2">Ative o Grupo ou VIP</h3>
<p class="text-body-md font-body-md text-on-surface-variant">
 Adicione o Puma Bot como administrador no seu canal. Ele cuidará da aprovação de membros e convites temporários.
 </p>
</div>
<!-- Step 4 -->
<div class="p-6 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 rim-card relative">
<div class="font-label-tabular text-headline-xl font-headline-xl font-extrabold text-secondary mb-3">04</div>
<h3 class="text-headline-sm font-headline-sm font-semibold text-on-surface mb-2">Vendas Líquidas no Bolso</h3>
<p class="text-body-md font-body-md text-on-surface-variant">
 Receba notificações em tempo real. Cada real cai direto na sua conta pagando apenas R$ 0,50 por transação.
 </p>
</div>
</div>
</div>
</section>
<!-- Real Market Proof & Social Evidence -->
<section class="py-20 bg-surface-dim border-t border-outline-variant/20" id="depoimentos">
<div class="max-w-7xl mx-auto px-4 md:px-8">
<div class="text-center max-w-2xl mx-auto mb-16">
<h2 class="text-headline-xl font-headline-xl font-bold text-on-surface tracking-tight mb-3">
 Quem opera em alta escala escolheu o Puma Bot
 </h2>
<p class="text-body-lg font-body-lg text-on-surface-variant">
 Infoprodutores, traders, gestores de comunidades pagas e donos de SaaS que exigem confiabilidade absoluta.
 </p>
</div>
<div class="grid grid-cols-1 md:grid-cols-3 gap-6">
<!-- Review 1 -->
<div class="p-6 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 rim-card flex flex-col justify-between">
<div class="space-y-3">
<div class="flex items-center gap-1 text-tertiary">
<span class="material-symbols-outlined text-[16px]">star</span>
<span class="material-symbols-outlined text-[16px]">star</span>
<span class="material-symbols-outlined text-[16px]">star</span>
<span class="material-symbols-outlined text-[16px]">star</span>
<span class="material-symbols-outlined text-[16px]">star</span>
</div>
<p class="text-body-md font-body-md text-on-surface-variant italic">
 "Migrei 4 canais de trading com mais de 12.000 membros pagantes. A economia de taxas passou de R$ 9.000 no primeiro mês. O áudio de remarketing é surreal de bom."
 </p>
</div>
<div class="mt-6 pt-4 border-t border-outline-variant/20 flex items-center justify-between">
<div>
<span class="font-headline-sm text-headline-sm font-semibold text-on-surface block">Rodrigo Meneses</span>
<span class="text-body-sm text-on-surface-variant">Comunidade Crypto Alpha</span>
</div>
<span class="font-label-tabular text-label-code text-secondary">R$ 180k/mês</span>
</div>
</div>
<!-- Review 2 -->
<div class="p-6 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 rim-card flex flex-col justify-between">
<div class="space-y-3">
<div class="flex items-center gap-1 text-tertiary">
<span class="material-symbols-outlined text-[16px]">star</span>
<span class="material-symbols-outlined text-[16px]">star</span>
<span class="material-symbols-outlined text-[16px]">star</span>
<span class="material-symbols-outlined text-[16px]">star</span>
<span class="material-symbols-outlined text-[16px]">star</span>
</div>
<p class="text-body-md font-body-md text-on-surface-variant italic">
 "Estávamos cansados de perder 8% em plataformas convencionais. Com o Puma Bot pagamos R$ 0,50 fixo por PIX e o dinheiro fica 100% sob nossa custódia direta."
 </p>
</div>
<div class="mt-6 pt-4 border-t border-outline-variant/20 flex items-center justify-between">
<div>
<span class="font-headline-sm text-headline-sm font-semibold text-on-surface block">Carolina P. Soares</span>
<span class="text-body-sm text-on-surface-variant">Infoprodutora &amp; Mentora</span>
</div>
<span class="font-label-tabular text-label-code text-secondary">R$ 95k/mês</span>
</div>
</div>
<!-- Review 3 -->
<div class="p-6 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 rim-card flex flex-col justify-between">
<div class="space-y-3">
<div class="flex items-center gap-1 text-tertiary">
<span class="material-symbols-outlined text-[16px]">star</span>
<span class="material-symbols-outlined text-[16px]">star</span>
<span class="material-symbols-outlined text-[16px]">star</span>
<span class="material-symbols-outlined text-[16px]">star</span>
<span class="material-symbols-outlined text-[16px]">star</span>
</div>
<p class="text-body-md font-body-md text-on-surface-variant italic">
 "O failover de gateways me salvou em pleno lançamento. Um gateway oscilou o webhook e o Puma comutou pro backup sem que ninguém ficasse sem acesso ao link VIP."
 </p>
</div>
<div class="mt-6 pt-4 border-t border-outline-variant/20 flex items-center justify-between">
<div>
<span class="font-headline-sm text-headline-sm font-semibold text-on-surface block">Felipe Guimarães</span>
<span class="text-body-sm text-on-surface-variant">Clube de Apostas &amp; Tipsters</span>
</div>
<span class="font-label-tabular text-label-code text-secondary">R$ 310k/mês</span>
</div>
</div>
</div>
</div>
</section>
<!-- API & Webhook Documentation Section -->
<section class="py-20 bg-surface-dim border-t border-outline-variant/20 scroll-mt-16" id="documentacao">
  <div class="max-w-7xl mx-auto px-4 md:px-8">
    <div class="text-center max-w-3xl mx-auto mb-14">
      <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-container/20 border border-primary/30 text-primary font-label-code text-label-code mb-4">
        <span class="material-symbols-outlined text-[14px]">terminal</span>
        DESENVOLVEDORES & INTEGRABILIDADE
      </span>
      <h2 class="text-headline-xl font-headline-xl font-bold text-on-surface tracking-tight mb-3">
        Documentação da API & Webhooks em Tempo Real
      </h2>
      <p class="text-body-lg font-body-lg text-on-surface-variant">
        Endpoints de alto throughput homologados para liquidação em menos de 50 milissegundos com padrão BACEN.
      </p>
    </div>

    <!-- Interactive API Endpoints Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6" id="seguranca">
      <!-- Card 1: Webhook PIX -->
      <div class="p-6 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 rim-card space-y-4 flex flex-col justify-between">
        <div class="space-y-3">
          <div class="flex items-center justify-between">
            <span class="px-2 py-0.5 rounded text-[11px] font-['JetBrains_Mono'] bg-[#10B981]/15 text-[#10B981] font-bold">POST</span>
            <span class="text-[10px] font-['JetBrains_Mono'] text-on-surface-variant">&lt; 50ms SLA</span>
          </div>
          <h3 class="text-headline-sm font-headline-sm font-semibold text-on-surface">Webhook PIX Multi-Gateway</h3>
          <p class="text-xs text-on-surface-variant leading-relaxed">
            Recepção de confirmação bancária compatível com Efí Bank (BACEN), Asaas, PushinPay e Mercado Pago com idempotência e entrega de link de uso único.
          </p>
          <div class="p-3 rounded-xl bg-surface-container-low border border-outline-variant/20 font-['JetBrains_Mono'] text-[11px] text-[#A78BFA] overflow-x-auto">
            <code>/api/webhook/pix</code>
          </div>
        </div>
        <div class="pt-3 border-t border-outline-variant/20 flex items-center justify-between text-xs text-on-surface-variant">
          <span class="flex items-center gap-1"><span class="w-1.5 h-1.5 rounded-full bg-secondary"></span> Atômico</span>
          <a href="/gateways" class="text-primary hover:underline font-semibold">Testar no Sandbox</a>
        </div>
      </div>

      <!-- Card 2: Webhook Telegram -->
      <div class="p-6 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 rim-card space-y-4 flex flex-col justify-between">
        <div class="space-y-3">
          <div class="flex items-center justify-between">
            <span class="px-2 py-0.5 rounded text-[11px] font-['JetBrains_Mono'] bg-[#10B981]/15 text-[#10B981] font-bold">POST</span>
            <span class="text-[10px] font-['JetBrains_Mono'] text-on-surface-variant">Fail-Fast</span>
          </div>
          <h3 class="text-headline-sm font-headline-sm font-semibold text-on-surface">Webhook Telegram Bot</h3>
          <p class="text-xs text-on-surface-variant leading-relaxed">
            Manipulação instantânea de comandos /start, botões inline, geração de cobrança PIX com cópia em 1 toque e verificação com secret token.
          </p>
          <div class="p-3 rounded-xl bg-surface-container-low border border-outline-variant/20 font-['JetBrains_Mono'] text-[11px] text-[#A78BFA] overflow-x-auto">
            <code>/api/webhook/telegram/[botId]</code>
          </div>
        </div>
        <div class="pt-3 border-t border-outline-variant/20 flex items-center justify-between text-xs text-on-surface-variant">
          <span class="flex items-center gap-1"><span class="w-1.5 h-1.5 rounded-full bg-secondary"></span> Zero Emojis</span>
          <a href="/robos" class="text-primary hover:underline font-semibold">Ver Meus Bots</a>
        </div>
      </div>

      <!-- Card 3: Cron Inadimplência -->
      <div class="p-6 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 rim-card space-y-4 flex flex-col justify-between">
        <div class="space-y-3">
          <div class="flex items-center justify-between">
            <span class="px-2 py-0.5 rounded text-[11px] font-['JetBrains_Mono'] bg-[#38BDF8]/15 text-[#38BDF8] font-bold">GET</span>
            <span class="text-[10px] font-['JetBrains_Mono'] text-on-surface-variant">A cada 5 min</span>
          </div>
          <h3 class="text-headline-sm font-headline-sm font-semibold text-on-surface">Cron Job de Expulsão</h3>
          <p class="text-xs text-on-surface-variant leading-relaxed">
            Varredura automática das assinaturas vencidas com expulsão imediata do grupo VIP no Telegram e envio de mensagem privada de renovação.
          </p>
          <div class="p-3 rounded-xl bg-surface-container-low border border-outline-variant/20 font-['JetBrains_Mono'] text-[11px] text-[#A78BFA] overflow-x-auto">
            <code>/api/cron/check-expired</code>
          </div>
        </div>
        <div class="pt-3 border-t border-outline-variant/20 flex items-center justify-between text-xs text-on-surface-variant">
          <span class="flex items-center gap-1"><span class="w-1.5 h-1.5 rounded-full bg-secondary"></span> Protegido Bearer</span>
          <a href="/clientes" class="text-primary hover:underline font-semibold">Ver Assinantes</a>
        </div>
      </div>
    </div>
  </div>
</section>
<!-- Technical FAQ Accordion -->
<section class="py-20 md:py-28 relative scroll-mt-16" id="faq">
<div class="max-w-4xl mx-auto px-4 md:px-8">
<div class="text-center mb-14">
<span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container border border-outline-variant/40 text-on-surface font-label-code text-label-code mb-4">
 DÚVIDAS FREQUENTES
 </span>
<h2 class="text-headline-xl font-headline-xl font-bold text-on-surface tracking-tight mb-3">
 Perguntas Frequentes &amp; Detalhes Técnicos
 </h2>
<p class="text-body-lg font-body-lg text-on-surface-variant">
 Transparência radical em cada linha de documentação e precificação.
 </p>
</div>
    <FaqAccordion items={faqItems} />
  </div>
</section>
<!-- Final CTA Callout -->
<section class="py-20 relative overflow-hidden">
<div class="max-w-5xl mx-auto px-4 md:px-8">
<div class="relative rounded-3xl p-8 md:p-12 bg-gradient-to-b from-primary-container/20 to-surface-container-lowest border border-primary/30 rim-card text-center overflow-hidden">
<!-- Glowing Puma Accent -->
<div class="w-16 h-16 mx-auto mb-6 rounded-2xl bg-surface-container-lowest border border-outline-variant/40 flex items-center justify-center p-2.5 shadow-xl">
<img alt="Logo Puma Bot perfil violeta minimalista" class="w-full h-full object-contain filter drop-shadow" src="https://lh3.googleusercontent.com/aida-public/AB6AXuApMe26OJRCrk9Da2M1tSH_NEUFMosNGCHptrVStnQTT55QwOPWNedO8DlKHnkENQNTYaHA5yGQHwwJ2qPI9plY7o8sGn1GddyD243xTxVM-TYELVX2Vw4tFG8FPaAZ4_CFN7kwbQMwmZcTkeAJ_9wrKIiGmsnkDvQR1rkfdEAct7cEpMaTdS0vjEzkGsdSYLOgVt4dbRODh-IzRsoK9QUC5AWbbdIjOOf-uZVEy7vFZL09aW0VWvjDlQ"/>
</div>
<h2 class="text-headline-xl font-headline-xl md:text-[38px] md:leading-[44px] font-bold text-on-surface tracking-tight mb-4">
 Comece a lucrar mais com seus bots no Telegram em menos de 2 minutos
 </h2>
<p class="text-body-lg font-body-lg text-on-surface-variant max-w-xl mx-auto mb-8">
 Junte-se a mais de 10.000 bots ativos e economize até 90% em comissões por venda. Sem mensalidade, pague só quando faturar.
 </p>
<div class="flex flex-col sm:flex-row items-center justify-center gap-4">
<a class="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-primary-container hover:bg-primary-container/90 text-on-primary-container font-headline-sm text-headline-sm font-semibold shadow-[0_12px_24px_-6px_rgba(124,58,237,0.4),inset_0_1px_0_0_rgba(255,255,255,0.25)] border border-primary-fixed-dim/40 active:scale-[0.98] transition-all" href="/cadastro">
<span class="material-symbols-outlined text-[18px]">rocket_launch</span>
 Criar Conta Gratuita Agora
 </a>
<a class="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-surface-container border border-outline-variant/40 text-on-surface font-headline-sm text-headline-sm font-medium hover:bg-surface-variant active:scale-[0.98] transition-all" href="#documentacao">
 Explorar Documentação API
 </a>
</div>
<p class="text-[11px] font-label-tabular text-on-surface-variant mt-6">
 Ativação instantânea • Sem necessidade de cartão de crédito
 </p>
</div>
</div>
</section>
<!-- Footer Componentizado de Alta Conversão -->
<Footer on:openDemo={openDemoModal} />
<!-- Notificação Toast Flutuante em Tempo Real -->
{#if showToast}
  <div
    transition:slide={{ duration: 250 }}
    class="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-xl bg-[#111113]/95 backdrop-blur-md border border-[#10B981]/40 shadow-[0_12px_32px_rgba(0,0,0,0.6)]"
  >
    <div class="w-8 h-8 rounded-lg bg-[#10B981]/20 text-[#10B981] flex items-center justify-center shrink-0">
      <span class="material-symbols-outlined text-[20px]">bolt</span>
    </div>
    <div>
      <div class="text-xs font-semibold text-white flex items-center gap-2">
        <span>{toastTitle}</span>
        <span class="text-[#10B981] font-['JetBrains_Mono'] text-[11px] bg-[#10B981]/15 px-1.5 py-0.5 rounded font-bold">{toastValue}</span>
      </div>
      <div class="text-[11px] text-[#958DA1] font-['JetBrains_Mono']">{toastDesc}</div>
    </div>
  </div>
{/if}

<!-- Modal Interativo do Simulador de Funil (K / Ver Demonstração) -->
{#if isDemoModalOpen}
  <div
    transition:fade={{ duration: 150 }}
    class="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
    role="dialog"
    aria-modal="true"
  >
    <button
      type="button"
      class="absolute inset-0 w-full h-full cursor-default bg-transparent border-0"
      on:click={closeDemoModal}
      aria-label="Fechar modal"
      tabindex="-1"
    ></button>
    <div class="relative z-10 w-full max-w-2xl bg-[#111113] border border-[#222226] rounded-2xl shadow-2xl overflow-hidden p-6">
      <div class="flex items-center justify-between pb-4 border-b border-[#222226] mb-5">
        <div class="flex items-center gap-3">
          <div class="w-9 h-9 rounded-xl bg-[#7C3AED]/20 text-[#7C3AED] flex items-center justify-center">
            <span class="material-symbols-outlined">play_circle</span>
          </div>
          <div>
            <h3 class="font-['Geist'] text-lg font-bold text-white">Simulador do Funil Puma Bot</h3>
            <p class="text-xs text-[#958DA1]">Teste em tempo real a velocidade de conversão PIX</p>
          </div>
        </div>
        <button
          type="button"
          on:click={closeDemoModal}
          class="w-8 h-8 rounded-lg bg-[#18181B] text-[#958DA1] hover:text-white flex items-center justify-center transition-colors"
        >
          <span class="material-symbols-outlined text-[18px]">close</span>
        </button>
      </div>

      <div class="space-y-4">
        <div class="p-4 rounded-xl bg-[#09090B] border border-[#222226] font-['JetBrains_Mono'] text-xs text-white space-y-2">
          <div class="text-[#958DA1]">&gt; 1. Lead digita /start no Telegram</div>
          <div class="text-[#A78BFA]">&gt; 2. Puma Bot gera Chave PIX Dinâmica (Payload EMV)</div>
          <div class="text-[#10B981]">&gt; 3. Gateway dispara Webhook de Liquidação (18ms)</div>
          <div class="text-white">&gt; 4. Convite de uso único entregue ao cliente</div>
        </div>

        <div class="flex items-center justify-between p-4 rounded-xl bg-[#18181B] border border-[#10B981]/30">
          <div>
            <div class="font-bold text-white text-xs sm:text-sm">Simular Pagamento Instantâneo</div>
            <div class="text-[11px] text-[#958DA1]">Dispara um evento de PIX aprovado no feed da tela</div>
          </div>
          <button
            type="button"
            on:click={simulatePixPayment}
            class="px-4 py-2 rounded-lg bg-[#10B981] text-black font-semibold text-xs hover:bg-[#059669] transition-transform active:scale-95 flex items-center gap-1.5"
          >
            <span class="material-symbols-outlined text-[18px]">electric_bolt</span>
            Disparar Teste
          </button>
        </div>
      </div>
    </div>
  </div>
{/if}