<script lang="ts">
  import type { PageData } from './$types';

  export let data: PageData;

  const { stats, transactions } = data;

  function formatCurrency(val: number) {
    return val.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  function getStatusBadge(status: string) {
    switch (status) {
      case 'PAID':
        return {
          label: 'Aprovado',
          class: 'bg-[#10B981]/10 text-[#10B981] border-[#10B981]/30',
          dot: 'bg-[#10B981]'
        };
      case 'PENDING':
        return {
          label: 'Pendente',
          class: 'bg-[#F59E0B]/10 text-[#F59E0B] border-[#F59E0B]/30',
          dot: 'bg-[#F59E0B]'
        };
      case 'EXPIRED':
        return {
          label: 'Expirado',
          class: 'bg-[#EF4444]/10 text-[#EF4444] border-[#EF4444]/30',
          dot: 'bg-[#EF4444]'
        };
      default:
        return {
          label: status,
          class: 'bg-[#201F22] text-[#CCC3D8] border-[#353437]',
          dot: 'bg-[#958DA1]'
        };
    }
  }
</script>

<svelte:head>
  <title>Dashboard Geral — Puma Bot SaaS</title>
</svelte:head>

<div class="max-w-7xl mx-auto space-y-6">
  
  <!-- Page Header -->
  <div class="flex items-center justify-between">
    <div>
      <h1 class="font-['Geist',sans-serif] text-[22px] font-bold text-white tracking-tight">Dashboard Operacional</h1>
      <p class="text-[13px] text-[#958DA1] mt-0.5">Métricas de transação PIX, retenção de grupos VIP e telemetria em tempo real.</p>
    </div>

    <div class="flex items-center gap-2">
      <span class="px-2.5 py-1 rounded bg-[#111113] border border-[#222226] text-[12px] font-['JetBrains_Mono'] text-[#CCC3D8]">
        Cluster: SA-EAST-1 (São Paulo)
      </span>
      <button class="h-8 px-3 rounded bg-[#111113] hover:bg-[#18181B] border border-[#222226] text-white text-[12px] font-medium flex items-center gap-1.5 transition-colors">
        <span class="material-symbols-outlined text-[15px]">refresh</span>
        Atualizar
      </button>
    </div>
  </div>

  <!-- Bento Grid: 4 Top KPI Cards -->
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
    <!-- Card 1: Faturamento Aprovado -->
    <div class="p-4 rounded-xl bg-[#111113] border border-[#222226] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)]">
      <div class="flex items-center justify-between text-[#958DA1] mb-2">
        <span class="text-[12px] font-medium uppercase tracking-wider">Faturamento PIX</span>
        <span class="material-symbols-outlined text-[18px] text-[#10B981]">payments</span>
      </div>
      <div class="font-['JetBrains_Mono'] text-[24px] font-bold text-white tracking-tight tabular-nums">
        R$ {formatCurrency(stats.totalRevenue)}
      </div>
      <div class="flex items-center gap-1.5 mt-2 text-[11px] font-medium text-[#10B981]">
        <span class="material-symbols-outlined text-[14px]">trending_up</span>
        <span>+28.4% vs semana anterior</span>
      </div>
    </div>

    <!-- Card 2: Conversão PIX -->
    <div class="p-4 rounded-xl bg-[#111113] border border-[#222226] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)]">
      <div class="flex items-center justify-between text-[#958DA1] mb-2">
        <span class="text-[12px] font-medium uppercase tracking-wider">Conversão de PIX</span>
        <span class="material-symbols-outlined text-[18px] text-[#7C3AED]">percent</span>
      </div>
      <div class="flex items-baseline gap-2">
        <div class="font-['JetBrains_Mono'] text-[24px] font-bold text-white tracking-tight tabular-nums">
          {stats.conversionRate}%
        </div>
        <span class="text-[12px] text-[#958DA1] font-['JetBrains_Mono']">({stats.paidPix}/{stats.totalPix})</span>
      </div>
      <div class="flex items-center gap-1.5 mt-2 text-[11px] text-[#958DA1]">
        <span>Média do mercado: 42%</span>
      </div>
    </div>

    <!-- Card 3: Novos Leads Hoje -->
    <div class="p-4 rounded-xl bg-[#111113] border border-[#222226] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)]">
      <div class="flex items-center justify-between text-[#958DA1] mb-2">
        <span class="text-[12px] font-medium uppercase tracking-wider">Novos Leads (/start)</span>
        <span class="material-symbols-outlined text-[18px] text-[#38BDF8]">group_add</span>
      </div>
      <div class="font-['JetBrains_Mono'] text-[24px] font-bold text-white tracking-tight tabular-nums">
        +{stats.todayLeads}
      </div>
      <div class="flex items-center gap-1.5 mt-2 text-[11px] text-[#38BDF8]">
        <span>Entraram no funil hoje</span>
      </div>
    </div>

    <!-- Card 4: Membros VIP Ativos -->
    <div class="p-4 rounded-xl bg-[#111113] border border-[#222226] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)]">
      <div class="flex items-center justify-between text-[#958DA1] mb-2">
        <span class="text-[12px] font-medium uppercase tracking-wider">Assinantes VIP Ativos</span>
        <span class="material-symbols-outlined text-[18px] text-[#F59E0B]">verified</span>
      </div>
      <div class="font-['JetBrains_Mono'] text-[24px] font-bold text-white tracking-tight tabular-nums">
        {stats.activeVip}
      </div>
      <div class="flex items-center gap-1.5 mt-2 text-[11px] text-[#F59E0B]">
        <span>Monitorados pelo Cron (5m)</span>
      </div>
    </div>
  </div>

  <!-- Tabela Financeira de Alta Precisão (Transações Recentes) -->
  <div class="rounded-xl bg-[#111113] border border-[#222226] overflow-hidden shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)]">
    <!-- Table Header -->
    <div class="px-5 py-3.5 border-b border-[#222226] flex items-center justify-between">
      <div class="flex items-center gap-2">
        <span class="w-2 h-2 rounded-full bg-[#10B981] animate-pulse"></span>
        <h3 class="font-['Geist',sans-serif] text-[14px] font-semibold text-white">Transações Recentes no Telegram</h3>
      </div>
      <span class="text-[11px] font-['JetBrains_Mono'] text-[#958DA1]">Sincronização em tempo real</span>
    </div>

    <!-- Table Contents -->
    <div class="overflow-x-auto">
      <table class="w-full text-left border-collapse">
        <thead>
          <tr class="h-8 bg-[#09090B] border-b border-[#222226] text-[11px] uppercase tracking-wider text-[#958DA1] font-['Inter']">
            <th class="px-5 font-medium">Lead / Comprador</th>
            <th class="px-4 font-medium">Robô / Origem</th>
            <th class="px-4 font-medium">Plano</th>
            <th class="px-4 font-medium">Status PIX</th>
            <th class="px-4 font-medium text-right">Valor</th>
            <th class="px-5 font-medium text-right">Ação</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-[#222226]/60 text-[13px]">
          {#each transactions as tx}
            {@const badge = getStatusBadge(tx.status)}
            <tr class="h-12 hover:bg-[#141416] transition-colors">
              <!-- Lead Name & Username -->
              <td class="px-5">
                <div class="flex items-center gap-2.5">
                  <div class="w-6 h-6 rounded-full bg-[#201F22] border border-[#353437] flex items-center justify-center text-[10px] font-bold text-white shrink-0">
                    {tx.telegramFirstName ? tx.telegramFirstName[0] : 'U'}
                  </div>
                  <div>
                    <div class="font-medium text-white truncate max-w-[150px]">{tx.telegramFirstName || 'Lead Telegram'}</div>
                    <div class="text-[11px] font-['JetBrains_Mono'] text-[#958DA1]">@{tx.telegramUsername || 'anônimo'}</div>
                  </div>
                </div>
              </td>

              <!-- Bot -->
              <td class="px-4 text-[#CCC3D8] font-medium">
                {tx.bot?.name || 'Puma VIP Alpha'}
              </td>

              <!-- Plano -->
              <td class="px-4 text-[#958DA1]">
                {tx.planName}
              </td>

              <!-- Status Badge -->
              <td class="px-4">
                <span class="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-semibold border {badge.class}">
                  <span class="w-1.5 h-1.5 rounded-full {badge.dot}"></span>
                  <span>{badge.label}</span>
                </span>
              </td>

              <!-- Valor (Tabular Mono) -->
              <td class="px-4 text-right font-['JetBrains_Mono'] font-bold text-white tabular-nums">
                R$ {formatCurrency(tx.amount)}
              </td>

              <!-- Ação Rápida -->
              <td class="px-5 text-right">
                <button
                  class="h-7 px-2.5 rounded bg-[#18181B] hover:bg-[#201F22] border border-[#222226] text-[11px] font-medium text-[#CCC3D8] hover:text-white transition-colors"
                  title="Reenviar convite no Telegram"
                >
                  Reenviar VIP
                </button>
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  </div>
</div>

