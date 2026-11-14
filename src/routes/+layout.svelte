<script lang="ts">
  import '../app.css';
  import { page } from '$app/stores';
  import type { LayoutData } from './$types';

  export let data: LayoutData;

  $: activeBotsBadge = (data?.activeBotsCount ?? 0) > 0
    ? `${data.activeBotsCount} Ativo${data.activeBotsCount > 1 ? 's' : ''}`
    : '0 Ativos';

  $: navItems = [
    { title: 'Dashboard', href: '/dashboard', icon: 'dashboard' },
    { title: 'Meus Robôs', href: '/robos', icon: 'smart_toy', badge: activeBotsBadge },
    { title: 'Meus Fluxos', href: '/fluxos', icon: 'account_tree' },
    { title: 'Grupos VIP', href: '/grupos', icon: 'shield_person' },
    { title: 'Clientes & Vendas', href: '/clientes', icon: 'point_of_sale' },
    { title: 'Remarketing', href: '/remarketing', icon: 'campaign' },
    { title: 'Gateways PIX', href: '/gateways', icon: 'account_balance_wallet' },
    { title: 'Financeiro', href: '/financeiro', icon: 'payments' },
    { title: 'Painel Admin', href: '/admin', icon: 'admin_panel_settings', badge: 'ROOT' }
  ];

  // Identifica se estamos em página pública (landing, login, cadastro)
  $: isPublicPage = $page.url.pathname === '/' || $page.url.pathname === '/login' || $page.url.pathname === '/cadastro';
</script>

<svelte:head>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="">
  <link href="https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600;700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet">
  <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
</svelte:head>

{#if isPublicPage}
  <slot />
{:else}
  <!-- High-Precision App Shell (Linear / Stripe Standard) -->
  <div class="flex h-screen w-screen overflow-hidden bg-[#09090B] text-[#E5E1E4] antialiased select-none font-['Inter',sans-serif]">
    
    <!-- Sidebar Fixa (240px) -->
    <aside class="w-[240px] shrink-0 border-r border-[#222226] bg-[#111113] flex flex-col justify-between">
      <!-- Top Brand Header -->
      <div>
        <div class="h-14 px-4 border-b border-[#222226] flex items-center justify-between">
          <a href="/dashboard" class="flex items-center gap-2.5">
            <div class="w-7 h-7 rounded-md bg-[#7C3AED] flex items-center justify-center text-white shadow-[0_0_12px_rgba(124,58,237,0.4)]">
              <span class="material-symbols-outlined text-[18px]">bolt</span>
            </div>
            <span class="font-['Geist',sans-serif] font-bold text-[15px] tracking-tight text-white">Puma Bot</span>
          </a>
          <span class="px-1.5 py-0.5 rounded text-[10px] font-['JetBrains_Mono'] bg-[#201F22] text-[#CCC3D8] border border-[#353437]">v2.4</span>
        </div>

        <!-- Telemetria do Webhook Global -->
        <div class="px-3 pt-3.5 pb-2">
          <div class="px-2.5 py-1.5 rounded-md bg-[#09090B] border border-[#222226] flex items-center justify-between">
            <div class="flex items-center gap-1.5">
              <span class="w-1.5 h-1.5 rounded-full bg-[#10B981] shadow-[0_0_6px_#10B981]"></span>
              <span class="text-[11px] font-medium text-[#10B981]">WEBHOOKS ONLINE</span>
            </div>
            <span class="text-[11px] font-['JetBrains_Mono'] text-[#958DA1]">&lt;18ms</span>
          </div>
        </div>

        <!-- Navigation Links -->
        <nav class="p-2 space-y-0.5">
          {#each navItems as item}
            {@const isActive = $page.url.pathname === item.href}
            <a
              href={item.href}
              class="flex items-center justify-between px-2.5 py-2 rounded-md text-[13px] font-medium transition-colors {isActive ? 'bg-[#201F22] text-white border border-[#353437]' : 'text-[#CCC3D8] hover:bg-[#18181B] hover:text-white'}"
            >
              <div class="flex items-center gap-2.5">
                <span class="material-symbols-outlined text-[18px] {isActive ? 'text-[#7C3AED]' : 'text-[#958DA1]'}">{item.icon}</span>
                <span>{item.title}</span>
              </div>
              {#if item.badge}
                <span class="px-1.5 py-0.2 rounded text-[10px] font-['JetBrains_Mono'] bg-[#10B981]/10 text-[#10B981] border border-[#10B981]/30">{item.badge}</span>
              {/if}
            </a>
          {/each}
        </nav>
      </div>

      <!-- User Profile / Footer Sidebar -->
      <div class="p-3 border-t border-[#222226]">
        <div class="p-2 rounded-md bg-[#09090B] border border-[#222226] flex items-center justify-between">
          <div class="flex items-center gap-2 min-w-0">
            <div class="w-7 h-7 rounded bg-[#7C3AED]/20 border border-[#7C3AED]/40 flex items-center justify-center text-white text-[11px] font-bold">
              {(data?.user?.name || 'OP').slice(0, 2).toUpperCase()}
            </div>
            <div class="truncate text-left">
              <div class="text-[12px] font-semibold text-white truncate">{data?.user?.name || 'Operador Admin'}</div>
              <div class="text-[10px] text-[#958DA1] font-['JetBrains_Mono'] truncate">{data?.user?.plan || 'PRO Trial'}</div>
            </div>
          </div>
          <a href="/login" class="text-[#958DA1] hover:text-white p-1 transition-colors" title="Sair da Plataforma">
            <span class="material-symbols-outlined text-[16px]">logout</span>
          </a>
        </div>
      </div>
    </aside>

    <!-- Main Content Area -->
    <div class="flex-1 flex flex-col min-w-0 overflow-hidden">
      <!-- Top Navigation Header (56px) -->
      <header class="h-14 shrink-0 px-6 border-b border-[#222226] bg-[#09090B] flex items-center justify-between">
        <div class="flex items-center gap-2 text-[13px] text-[#958DA1]">
          <span>App</span>
          <span>/</span>
          <span class="text-white font-medium capitalize">{$page.url.pathname.replace('/', '') || 'Dashboard'}</span>
        </div>

        <div class="flex items-center gap-3">
          <!-- Seletor Rápido de Robô -->
          <div class="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-[#111113] border border-[#222226] text-[12px]">
            <span class="w-1.5 h-1.5 rounded-full bg-[#10B981]"></span>
            <span class="text-white font-medium">@PumaVIP_AlphaBot</span>
            <span class="material-symbols-outlined text-[14px] text-[#958DA1]">unfold_more</span>
          </div>

          <!-- Botão Primário Cirúrgico -->
          <button class="h-8 px-3 rounded-md bg-[#7C3AED] hover:bg-[#8B5CF6] text-white text-[12px] font-semibold flex items-center gap-1.5 transition-all shadow-[0_2px_8px_rgba(124,58,237,0.3)]">
            <span class="material-symbols-outlined text-[15px]">add</span>
            <span>Conectar Robô</span>
          </button>
        </div>
      </header>

      <!-- Scrollable Viewport -->
      <main class="flex-1 overflow-y-auto p-6 bg-[#09090B]">
        <slot />
      </main>
    </div>
  </div>
{/if}
