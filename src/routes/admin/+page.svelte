<script lang="ts">
  import type { PageData, ActionData } from './$types';
  import { enhance } from '$app/forms';

  export let data: PageData;
  export let form: ActionData;

  const { kpi, users, bots, sales } = data;

  type AdminTab = 'users' | 'sales' | 'bots' | 'metrics';
  let activeTab: AdminTab = 'users';

  let userSearchQuery = '';
  let salesSearchQuery = '';
  let salesStatusFilter: 'ALL' | 'PAID' | 'PENDING' | 'EXPIRED' = 'ALL';
  let botSearchQuery = '';

  let isSubmitting = false;

  function formatBrl(val: number) {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val || 0);
  }

  function formatDate(iso: string) {
    if (!iso) return '-';
    const d = new Date(iso);
    return d.toLocaleDateString('pt-BR') + ' ' + d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  }

  $: filteredUsers = users.filter(u =>
    (u.name || '').toLowerCase().includes(userSearchQuery.toLowerCase()) ||
    (u.email || '').toLowerCase().includes(userSearchQuery.toLowerCase())
  );

  $: filteredSales = sales.filter(s => {
    const matchesQuery =
      (s.pixTxid || '').toLowerCase().includes(salesSearchQuery.toLowerCase()) ||
      (s.telegramFirstName || '').toLowerCase().includes(salesSearchQuery.toLowerCase()) ||
      (s.telegramUsername || '').toLowerCase().includes(salesSearchQuery.toLowerCase()) ||
      (s.botName || '').toLowerCase().includes(salesSearchQuery.toLowerCase());

    const matchesStatus = salesStatusFilter === 'ALL' || s.status === salesStatusFilter;
    return matchesQuery && matchesStatus;
  });

  $: filteredBots = bots.filter(b =>
    (b.name || '').toLowerCase().includes(botSearchQuery.toLowerCase()) ||
    (b.username || '').toLowerCase().includes(botSearchQuery.toLowerCase()) ||
    (b.ownerName || '').toLowerCase().includes(botSearchQuery.toLowerCase())
  );
</script>

<svelte:head>
  <title>Super Admin Console — Puma Bot SaaS</title>
</svelte:head>

<div class="max-w-7xl mx-auto space-y-6 select-none font-['Inter',sans-serif] pb-12">
  
  <!-- SuperAdmin Header Banner -->
  <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl bg-[#111113] border border-[#222226] shadow-xl">
    <div>
      <div class="flex items-center gap-2.5 mb-1">
        <div class="w-7 h-7 rounded-lg bg-[#7C3AED] flex items-center justify-center text-white shadow-[0_0_12px_rgba(124,58,237,0.4)]">
          <span class="material-symbols-outlined text-[18px]">admin_panel_settings</span>
        </div>
        <h1 class="font-['Geist',sans-serif] text-xl font-bold text-white tracking-tight">Console Super Admin</h1>
        <span class="px-2 py-0.5 rounded text-[10px] font-['JetBrains_Mono'] bg-[#7C3AED]/15 text-[#7C3AED] border border-[#7C3AED]/30 font-semibold">
          ROOT ACCESS
        </span>
      </div>
      <p class="text-xs text-[#958DA1]">Gestão unificada de usuários, robôs, taxas de conversão e transações de toda a plataforma.</p>
    </div>

    <div class="flex items-center gap-3">
      <div class="px-3 py-1.5 rounded-lg bg-[#09090B] border border-[#222226] text-[11px] font-['JetBrains_Mono'] text-[#10B981] flex items-center gap-2">
        <span class="w-2 h-2 rounded-full bg-[#10B981] animate-pulse"></span>
        <span>LATÊNCIA 18ms • SÃO PAULO</span>
      </div>
      <button
        type="button"
        on:click={() => window.location.reload()}
        class="h-8 px-3 rounded-lg bg-[#18181B] hover:bg-[#201F22] border border-[#222226] text-white text-xs font-medium flex items-center gap-1.5 transition-colors active:scale-95"
      >
        <span class="material-symbols-outlined text-[15px]">refresh</span>
        <span>Sincronizar</span>
      </button>
    </div>
  </div>

  {#if form?.message}
    <div class="p-3.5 rounded-xl text-xs font-medium bg-[#10B981]/10 border border-[#10B981]/30 text-[#10B981] flex items-center gap-2">
      <span class="material-symbols-outlined text-[16px]">check_circle</span>
      <span>{form.message}</span>
    </div>
  {/if}

  {#if form?.error}
    <div class="p-3.5 rounded-xl text-xs font-medium bg-[#EF4444]/10 border border-[#EF4444]/30 text-[#EF4444] flex items-center gap-2">
      <span class="material-symbols-outlined text-[16px]">error</span>
      <span>{form.error}</span>
    </div>
  {/if}

  <!-- Bento Grid: 6 Global Metrics -->
  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3.5">
    
    <!-- 1. Volume Total (GMV) -->
    <div class="p-4 rounded-xl bg-[#111113] border border-[#222226] lg:col-span-2">
      <div class="flex items-center justify-between text-[#958DA1] mb-2 text-xs">
        <span class="font-medium uppercase tracking-wider">Volume Processado (GMV)</span>
        <span class="material-symbols-outlined text-[18px] text-[#10B981]">payments</span>
      </div>
      <div class="font-['JetBrains_Mono'] text-2xl font-bold text-white tracking-tight tabular-nums">
        {formatBrl(kpi.platformVolume)}
      </div>
      <div class="text-[11px] text-[#10B981] mt-1.5 font-medium flex items-center gap-1">
        <span class="material-symbols-outlined text-[14px]">check</span>
        <span>{kpi.paidSales} pagamentos confirmados</span>
      </div>
    </div>

    <!-- 2. Taxa de Aprovação Média -->
    <div class="p-4 rounded-xl bg-[#111113] border border-[#222226]">
      <div class="flex items-center justify-between text-[#958DA1] mb-2 text-xs">
        <span class="font-medium uppercase tracking-wider">Taxa de Aprovação</span>
        <span class="material-symbols-outlined text-[18px] text-[#7C3AED]">percent</span>
      </div>
      <div class="font-['JetBrains_Mono'] text-2xl font-bold text-white tracking-tight tabular-nums">
        {kpi.approvalRate}%
      </div>
      <div class="text-[11px] text-[#958DA1] mt-1.5 font-['JetBrains_Mono']">
        {kpi.paidSales}/{kpi.totalSales} PIX gerados
      </div>
    </div>

    <!-- 3. Ticket Médio -->
    <div class="p-4 rounded-xl bg-[#111113] border border-[#222226]">
      <div class="flex items-center justify-between text-[#958DA1] mb-2 text-xs">
        <span class="font-medium uppercase tracking-wider">Ticket Médio</span>
        <span class="material-symbols-outlined text-[18px] text-[#38BDF8]">price_change</span>
      </div>
      <div class="font-['JetBrains_Mono'] text-2xl font-bold text-white tracking-tight tabular-nums">
        R$ {kpi.averageTicket}
      </div>
      <div class="text-[11px] text-[#958DA1] mt-1.5">
        Média por venda aprovada
      </div>
    </div>

    <!-- 4. Receita da Plataforma (R$ 0,50/tx) -->
    <div class="p-4 rounded-xl bg-[#111113] border border-[#222226]">
      <div class="flex items-center justify-between text-[#958DA1] mb-2 text-xs">
        <span class="font-medium uppercase tracking-wider">Taxa Puma Bot</span>
        <span class="material-symbols-outlined text-[18px] text-[#F59E0B]">monetization_on</span>
      </div>
      <div class="font-['JetBrains_Mono'] text-2xl font-bold text-[#F59E0B] tracking-tight tabular-nums">
        {formatBrl(kpi.pumaRevenue)}
      </div>
      <div class="text-[11px] text-[#958DA1] mt-1.5">
        R$ 0,50 retidos por PIX
      </div>
    </div>

    <!-- 5. Usuários e Robôs -->
    <div class="p-4 rounded-xl bg-[#111113] border border-[#222226]">
      <div class="flex items-center justify-between text-[#958DA1] mb-2 text-xs">
        <span class="font-medium uppercase tracking-wider">Comunidade</span>
        <span class="material-symbols-outlined text-[18px] text-[#CCC3D8]">groups</span>
      </div>
      <div class="font-['JetBrains_Mono'] text-2xl font-bold text-white tracking-tight tabular-nums">
        {kpi.totalUsers} / {kpi.totalBots}
      </div>
      <div class="text-[11px] text-[#958DA1] mt-1.5">
        Operadores / Robôs ativos
      </div>
    </div>

  </div>

  <!-- Navigation Tabs Header -->
  <div class="flex items-center justify-between border-b border-[#222226] pb-1">
    <div class="flex items-center gap-2">
      <button
        type="button"
        on:click={() => activeTab = 'users'}
        class="px-4 py-2 rounded-lg text-xs font-medium transition-colors flex items-center gap-2 {activeTab === 'users' ? 'bg-[#201F22] text-white border border-[#353437]' : 'text-[#958DA1] hover:text-white'}"
      >
        <span class="material-symbols-outlined text-[16px]">manage_accounts</span>
        <span>Operadores & Usuários ({users.length})</span>
      </button>

      <button
        type="button"
        on:click={() => activeTab = 'sales'}
        class="px-4 py-2 rounded-lg text-xs font-medium transition-colors flex items-center gap-2 {activeTab === 'sales' ? 'bg-[#201F22] text-white border border-[#353437]' : 'text-[#958DA1] hover:text-white'}"
      >
        <span class="material-symbols-outlined text-[16px]">receipt_long</span>
        <span>Todas as Vendas ({sales.length})</span>
      </button>

      <button
        type="button"
        on:click={() => activeTab = 'bots'}
        class="px-4 py-2 rounded-lg text-xs font-medium transition-colors flex items-center gap-2 {activeTab === 'bots' ? 'bg-[#201F22] text-white border border-[#353437]' : 'text-[#958DA1] hover:text-white'}"
      >
        <span class="material-symbols-outlined text-[16px]">smart_toy</span>
        <span>Robôs da Plataforma ({bots.length})</span>
      </button>

      <button
        type="button"
        on:click={() => activeTab = 'metrics'}
        class="px-4 py-2 rounded-lg text-xs font-medium transition-colors flex items-center gap-2 {activeTab === 'metrics' ? 'bg-[#201F22] text-white border border-[#353437]' : 'text-[#958DA1] hover:text-white'}"
      >
        <span class="material-symbols-outlined text-[16px]">analytics</span>
        <span>Métricas Globais & Gateways</span>
      </button>
    </div>
  </div>

  <!-- Tab 1: Gestão de Operadores & Usuários -->
  {#if activeTab === 'users'}
    <div class="space-y-4">
      <div class="flex items-center justify-between gap-4">
        <div class="relative w-full max-w-sm">
          <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[16px] text-[#958DA1]">search</span>
          <input
            type="text"
            bind:value={userSearchQuery}
            placeholder="Buscar por nome ou e-mail de operador..."
            class="w-full h-9 pl-9 pr-3 rounded-lg bg-[#111113] border border-[#222226] text-xs text-white placeholder-[#958DA1] focus:outline-none focus:border-[#7C3AED]"
          />
        </div>
        <span class="text-xs text-[#958DA1] font-['JetBrains_Mono']">
          Exibindo {filteredUsers.length} de {users.length} operadores
        </span>
      </div>

      <div class="rounded-xl bg-[#111113] border border-[#222226] overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs">
            <thead class="bg-[#09090B] border-b border-[#222226] text-[#958DA1] font-['JetBrains_Mono'] uppercase tracking-wider text-[11px]">
              <tr>
                <th class="py-3 px-4 font-medium">Operador</th>
                <th class="py-3 px-4 font-medium">Plano Atual</th>
                <th class="py-3 px-4 font-medium text-center">Robôs</th>
                <th class="py-3 px-4 font-medium text-center">Vendas</th>
                <th class="py-3 px-4 font-medium text-right">Volume (R$)</th>
                <th class="py-3 px-4 font-medium">Cadastro</th>
                <th class="py-3 px-4 font-medium text-right">Alterar Plano</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-[#222226]/60">
              {#if filteredUsers.length === 0}
                <tr>
                  <td colspan="7" class="py-10 text-center text-[#958DA1]">Nenhum operador encontrado com os termos de busca.</td>
                </tr>
              {:else}
                {#each filteredUsers as user (user.id)}
                  <tr class="hover:bg-[#141416] transition-colors">
                    <td class="py-3 px-4">
                      <div class="flex items-center gap-2.5">
                        <div class="w-7 h-7 rounded-lg bg-[#7C3AED]/20 border border-[#7C3AED]/30 flex items-center justify-center text-white text-[10px] font-bold shrink-0">
                          {user.name.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <div class="font-semibold text-white">{user.name}</div>
                          <div class="text-[11px] font-['JetBrains_Mono'] text-[#958DA1]">{user.email}</div>
                        </div>
                      </div>
                    </td>

                    <td class="py-3 px-4">
                      <span class="px-2 py-0.5 rounded text-[10px] font-['JetBrains_Mono'] font-medium bg-[#201F22] text-[#CCC3D8] border border-[#353437]">
                        {user.plan}
                      </span>
                    </td>

                    <td class="py-3 px-4 text-center font-['JetBrains_Mono'] text-white">
                      {user.botsCount}
                    </td>

                    <td class="py-3 px-4 text-center font-['JetBrains_Mono'] text-[#10B981]">
                      {user.salesCount}
                    </td>

                    <td class="py-3 px-4 text-right font-['JetBrains_Mono'] font-bold text-white tabular-nums">
                      {formatBrl(user.totalRevenue)}
                    </td>

                    <td class="py-3 px-4 text-[11px] text-[#958DA1]">
                      {formatDate(user.createdAt)}
                    </td>

                    <td class="py-3 px-4 text-right">
                      <form method="POST" action="?/updateUserPlan" use:enhance class="inline-flex items-center gap-1.5">
                        <input type="hidden" name="userId" value={user.id} />
                        <select
                          name="plan"
                          class="h-7 px-2 rounded bg-[#09090B] border border-[#222226] text-[11px] text-[#CCC3D8] focus:outline-none focus:border-[#7C3AED]"
                        >
                          <option value="PRO Trial (14 dias)" selected={user.plan.includes('Trial')}>Trial (14d)</option>
                          <option value="PRO Starter" selected={user.plan === 'PRO Starter'}>PRO Starter</option>
                          <option value="PRO Scale" selected={user.plan === 'PRO Scale'}>PRO Scale</option>
                          <option value="ENTERPRISE VIP" selected={user.plan === 'ENTERPRISE VIP'}>Enterprise</option>
                        </select>
                        <button
                          type="submit"
                          class="h-7 px-2.5 rounded bg-[#18181B] hover:bg-[#201F22] border border-[#222226] text-white text-[11px] transition-colors"
                        >
                          Salvar
                        </button>
                      </form>
                    </td>
                  </tr>
                {/each}
              {/if}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  {/if}

  <!-- Tab 2: Todas as Vendas Globais -->
  {#if activeTab === 'sales'}
    <div class="space-y-4">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div class="flex items-center gap-2">
          <div class="relative w-full max-w-sm">
            <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[16px] text-[#958DA1]">search</span>
            <input
              type="text"
              bind:value={salesSearchQuery}
              placeholder="Buscar por TxID, cliente, robô..."
              class="w-full h-9 pl-9 pr-3 rounded-lg bg-[#111113] border border-[#222226] text-xs text-white placeholder-[#958DA1] focus:outline-none focus:border-[#7C3AED]"
            />
          </div>

          <div class="flex items-center gap-1 p-0.5 rounded-lg bg-[#111113] border border-[#222226]">
            <button
              type="button"
              on:click={() => salesStatusFilter = 'ALL'}
              class="px-2.5 py-1.5 rounded-md text-[11px] font-medium transition-colors {salesStatusFilter === 'ALL' ? 'bg-[#201F22] text-white' : 'text-[#958DA1] hover:text-white'}"
            >
              Todos ({sales.length})
            </button>
            <button
              type="button"
              on:click={() => salesStatusFilter = 'PAID'}
              class="px-2.5 py-1.5 rounded-md text-[11px] font-medium transition-colors {salesStatusFilter === 'PAID' ? 'bg-[#10B981]/20 text-[#10B981]' : 'text-[#958DA1] hover:text-white'}"
            >
              Aprovados ({sales.filter(s => s.status === 'PAID').length})
            </button>
            <button
              type="button"
              on:click={() => salesStatusFilter = 'PENDING'}
              class="px-2.5 py-1.5 rounded-md text-[11px] font-medium transition-colors {salesStatusFilter === 'PENDING' ? 'bg-[#F59E0B]/20 text-[#F59E0B]' : 'text-[#958DA1] hover:text-white'}"
            >
              Pendentes ({sales.filter(s => s.status === 'PENDING').length})
            </button>
          </div>
        </div>

        <span class="text-xs text-[#958DA1] font-['JetBrains_Mono']">
          Exibindo {filteredSales.length} transações
        </span>
      </div>

      <div class="rounded-xl bg-[#111113] border border-[#222226] overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs">
            <thead class="bg-[#09090B] border-b border-[#222226] text-[#958DA1] font-['JetBrains_Mono'] uppercase tracking-wider text-[11px]">
              <tr>
                <th class="py-3 px-4 font-medium">TxID / Data</th>
                <th class="py-3 px-4 font-medium">Comprador Telegram</th>
                <th class="py-3 px-4 font-medium">Robô / Operador</th>
                <th class="py-3 px-4 font-medium">Plano</th>
                <th class="py-3 px-4 font-medium text-center">Status</th>
                <th class="py-3 px-4 font-medium text-right">Valor</th>
                <th class="py-3 px-4 font-medium text-right">Ação</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-[#222226]/60">
              {#if filteredSales.length === 0}
                <tr>
                  <td colspan="7" class="py-10 text-center text-[#958DA1]">Nenhuma transação encontrada com os filtros atuais.</td>
                </tr>
              {:else}
                {#each filteredSales as sale (sale.id)}
                  <tr class="hover:bg-[#141416] transition-colors">
                    <td class="py-3 px-4">
                      <div class="font-['JetBrains_Mono'] text-white font-medium">{sale.pixTxid}</div>
                      <div class="text-[11px] text-[#958DA1]">{formatDate(sale.createdAt)}</div>
                    </td>

                    <td class="py-3 px-4">
                      <div class="text-white font-medium">{sale.telegramFirstName}</div>
                      <div class="text-[11px] font-['JetBrains_Mono'] text-[#958DA1]">
                        {sale.telegramUsername ? `@${sale.telegramUsername}` : `ID: ${sale.telegramUserId}`}
                      </div>
                    </td>

                    <td class="py-3 px-4">
                      <div class="text-[#CCC3D8] font-medium">{sale.botName}</div>
                      <div class="text-[11px] text-[#958DA1]">Dono: {sale.ownerName}</div>
                    </td>

                    <td class="py-3 px-4 text-[#958DA1]">
                      {sale.planName}
                    </td>

                    <td class="py-3 px-4 text-center">
                      {#if sale.status === 'PAID'}
                        <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold font-['JetBrains_Mono'] bg-[#10B981]/10 text-[#10B981] border border-[#10B981]/30">
                          <span class="w-1.5 h-1.5 rounded-full bg-[#10B981]"></span>
                          APROVADO
                        </span>
                      {:else if sale.status === 'PENDING'}
                        <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold font-['JetBrains_Mono'] bg-[#F59E0B]/10 text-[#F59E0B] border border-[#F59E0B]/30">
                          <span class="w-1.5 h-1.5 rounded-full bg-[#F59E0B]"></span>
                          PENDENTE
                        </span>
                      {:else}
                        <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold font-['JetBrains_Mono'] bg-[#EF4444]/10 text-[#EF4444] border border-[#EF4444]/30">
                          EXPIRADO
                        </span>
                      {/if}
                    </td>

                    <td class="py-3 px-4 text-right font-['JetBrains_Mono'] font-bold text-white tabular-nums">
                      {formatBrl(sale.amount)}
                    </td>

                    <td class="py-3 px-4 text-right">
                      <form method="POST" action="?/deleteSale" use:enhance class="inline-block" on:submit|preventDefault={(e) => { if (confirm('Remover transação do banco?')) e.currentTarget.submit(); }}>
                        <input type="hidden" name="saleId" value={sale.id} />
                        <button
                          type="submit"
                          class="h-7 px-2.5 rounded bg-[#18181B] hover:bg-[#EF4444]/20 border border-[#222226] hover:border-[#EF4444]/40 text-[#958DA1] hover:text-[#EF4444] text-[11px] transition-colors"
                          title="Remover transação"
                        >
                          <span class="material-symbols-outlined text-[14px]">delete</span>
                        </button>
                      </form>
                    </td>
                  </tr>
                {/each}
              {/if}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  {/if}

  <!-- Tab 3: Robôs da Plataforma -->
  {#if activeTab === 'bots'}
    <div class="space-y-4">
      <div class="flex items-center justify-between gap-4">
        <div class="relative w-full max-w-sm">
          <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[16px] text-[#958DA1]">search</span>
          <input
            type="text"
            bind:value={botSearchQuery}
            placeholder="Buscar por nome de robô, @username ou dono..."
            class="w-full h-9 pl-9 pr-3 rounded-lg bg-[#111113] border border-[#222226] text-xs text-white placeholder-[#958DA1] focus:outline-none focus:border-[#7C3AED]"
          />
        </div>
        <span class="text-xs text-[#958DA1] font-['JetBrains_Mono']">
          {filteredBots.length} robôs conectados
        </span>
      </div>

      <div class="rounded-xl bg-[#111113] border border-[#222226] overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs">
            <thead class="bg-[#09090B] border-b border-[#222226] text-[#958DA1] font-['JetBrains_Mono'] uppercase tracking-wider text-[11px]">
              <tr>
                <th class="py-3 px-4 font-medium">Robô</th>
                <th class="py-3 px-4 font-medium">Operador Responsável</th>
                <th class="py-3 px-4 font-medium">Grupo VIP ID</th>
                <th class="py-3 px-4 font-medium text-center">Status</th>
                <th class="py-3 px-4 font-medium text-center">Vendas</th>
                <th class="py-3 px-4 font-medium text-center">Membros VIP</th>
                <th class="py-3 px-4 font-medium text-right">Gerenciar</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-[#222226]/60">
              {#if filteredBots.length === 0}
                <tr>
                  <td colspan="7" class="py-10 text-center text-[#958DA1]">Nenhum robô encontrado.</td>
                </tr>
              {:else}
                {#each filteredBots as bot (bot.id)}
                  <tr class="hover:bg-[#141416] transition-colors">
                    <td class="py-3 px-4">
                      <div class="flex items-center gap-2.5">
                        <div class="w-7 h-7 rounded-lg bg-[#7C3AED]/20 text-[#7C3AED] flex items-center justify-center shrink-0">
                          <span class="material-symbols-outlined text-[16px]">smart_toy</span>
                        </div>
                        <div>
                          <div class="font-semibold text-white">{bot.name}</div>
                          <div class="text-[11px] font-['JetBrains_Mono'] text-[#958DA1]">@{bot.username}</div>
                        </div>
                      </div>
                    </td>

                    <td class="py-3 px-4">
                      <div class="text-white font-medium">{bot.ownerName}</div>
                      <div class="text-[11px] font-['JetBrains_Mono'] text-[#958DA1]">{bot.ownerEmail}</div>
                    </td>

                    <td class="py-3 px-4 font-['JetBrains_Mono'] text-[#CCC3D8]">
                      {bot.vipChatId}
                    </td>

                    <td class="py-3 px-4 text-center">
                      {#if bot.active}
                        <span class="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-semibold font-['JetBrains_Mono'] bg-[#10B981]/10 text-[#10B981] border border-[#10B981]/30">
                          <span class="w-1.5 h-1.5 rounded-full bg-[#10B981]"></span>
                          ATIVO
                        </span>
                      {:else}
                        <span class="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-semibold font-['JetBrains_Mono'] bg-[#EF4444]/10 text-[#EF4444] border border-[#EF4444]/30">
                          PAUSADO
                        </span>
                      {/if}
                    </td>

                    <td class="py-3 px-4 text-center font-['JetBrains_Mono'] text-white">
                      {bot.salesCount}
                    </td>

                    <td class="py-3 px-4 text-center font-['JetBrains_Mono'] text-[#10B981]">
                      {bot.vipCount}
                    </td>

                    <td class="py-3 px-4 text-right">
                      <form method="POST" action="?/toggleBotStatus" use:enhance class="inline-block">
                        <input type="hidden" name="botId" value={bot.id} />
                        <input type="hidden" name="active" value={bot.active.toString()} />
                        <button
                          type="submit"
                          class="h-7 px-2.5 rounded border text-[11px] font-medium transition-colors {bot.active ? 'bg-[#EF4444]/10 hover:bg-[#EF4444]/20 border-[#EF4444]/30 text-[#EF4444]' : 'bg-[#10B981]/10 hover:bg-[#10B981]/20 border-[#10B981]/30 text-[#10B981]'}"
                        >
                          {bot.active ? 'Pausar' : 'Ativar'}
                        </button>
                      </form>
                    </td>
                  </tr>
                {/each}
              {/if}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  {/if}

  <!-- Tab 4: Métricas Globais & Infraestrutura de Gateways -->
  {#if activeTab === 'metrics'}
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      
      <!-- Card: Divisão por Gateway -->
      <div class="p-6 rounded-2xl bg-[#111113] border border-[#222226] space-y-4">
        <div class="flex items-center justify-between pb-3 border-b border-[#222226]">
          <h3 class="font-['Geist'] font-semibold text-white text-sm flex items-center gap-2">
            <span class="material-symbols-outlined text-[#7C3AED] text-[18px]">account_balance</span>
            <span>Roteamento de Gateways PIX</span>
          </h3>
          <span class="text-[11px] font-['JetBrains_Mono'] text-[#10B981]">Failover Ativo</span>
        </div>

        <div class="space-y-3 text-xs">
          <div class="p-3 rounded-xl bg-[#09090B] border border-[#222226] flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 rounded-lg bg-[#7C3AED]/20 text-[#7C3AED] flex items-center justify-center font-bold">
                PP
              </div>
              <div>
                <div class="font-semibold text-white">PushinPay (Preferencial)</div>
                <div class="text-[11px] text-[#958DA1]">Latência média: 18ms • Liquidação Direta</div>
              </div>
            </div>
            <span class="px-2 py-0.5 rounded text-[10px] font-['JetBrains_Mono'] bg-[#10B981]/10 text-[#10B981] border border-[#10B981]/25">
              PADRÃO
            </span>
          </div>

          <div class="p-3 rounded-xl bg-[#09090B] border border-[#222226] flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 rounded-lg bg-[#009EE3]/20 text-[#009EE3] flex items-center justify-center font-bold">
                MP
              </div>
              <div>
                <div class="font-semibold text-white">Mercado Pago</div>
                <div class="text-[11px] text-[#958DA1]">Latência média: 84ms • Fallback 1</div>
              </div>
            </div>
            <span class="px-2 py-0.5 rounded text-[10px] font-['JetBrains_Mono'] bg-[#201F22] text-[#CCC3D8] border border-[#353437]">
              STANDBY
            </span>
          </div>

          <div class="p-3 rounded-xl bg-[#09090B] border border-[#222226] flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 rounded-lg bg-[#F59E0B]/20 text-[#F59E0B] flex items-center justify-center font-bold">
                EFI
              </div>
              <div>
                <div class="font-semibold text-white">Efí Bank (Gerencianet)</div>
                <div class="text-[11px] text-[#958DA1]">Latência média: 45ms • Certificados mTLS</div>
              </div>
            </div>
            <span class="px-2 py-0.5 rounded text-[10px] font-['JetBrains_Mono'] bg-[#201F22] text-[#CCC3D8] border border-[#353437]">
              STANDBY
            </span>
          </div>
        </div>
      </div>

      <!-- Card: Modelo Financeiro do Puma Bot -->
      <div class="p-6 rounded-2xl bg-[#111113] border border-[#222226] space-y-4">
        <div class="flex items-center justify-between pb-3 border-b border-[#222226]">
          <h3 class="font-['Geist'] font-semibold text-white text-sm flex items-center gap-2">
            <span class="material-symbols-outlined text-[#10B981] text-[18px]">query_stats</span>
            <span>Auditoria Financeira da Plataforma</span>
          </h3>
          <span class="text-[11px] font-['JetBrains_Mono'] text-[#958DA1]">Taxa Fixa R$ 0,50</span>
        </div>

        <div class="space-y-3 text-xs">
          <div class="flex justify-between py-2 border-b border-[#222226]">
            <span class="text-[#958DA1]">Total de Transações no Banco:</span>
            <span class="font-['JetBrains_Mono'] font-bold text-white">{kpi.totalSales}</span>
          </div>
          <div class="flex justify-between py-2 border-b border-[#222226]">
            <span class="text-[#958DA1]">Transações Aprovadas (Status PAID):</span>
            <span class="font-['JetBrains_Mono'] font-bold text-[#10B981]">{kpi.paidSales}</span>
          </div>
          <div class="flex justify-between py-2 border-b border-[#222226]">
            <span class="text-[#958DA1]">Volume Bruto Movimentado (GMV):</span>
            <span class="font-['JetBrains_Mono'] font-bold text-white">{formatBrl(kpi.platformVolume)}</span>
          </div>
          <div class="flex justify-between py-2 border-b border-[#222226]">
            <span class="text-[#958DA1]">Taxa Operacional Acumulada Puma Bot:</span>
            <span class="font-['JetBrains_Mono'] font-bold text-[#F59E0B]">{formatBrl(kpi.pumaRevenue)}</span>
          </div>
          <div class="flex justify-between py-2">
            <span class="text-[#958DA1]">Taxa de Conversão Global:</span>
            <span class="font-['JetBrains_Mono'] font-bold text-white">{kpi.approvalRate}%</span>
          </div>
        </div>
      </div>

    </div>
  {/if}

</div>
