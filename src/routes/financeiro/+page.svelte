<script lang="ts">
  import type { PageData } from './$types';
  import Button from '$lib/components/Button.svelte';

  export let data: PageData;

  function exportCsv() {
    const headers = ['ID,Comprador,Robo,Plano,Bruto (R$),Taxa Puma (R$),Liquido (R$),Data\n'];
    const rows = data.transactions.map((t: any) => 
      `"${t.id}","${t.buyerName}","${t.botName}","${t.planName}",${t.grossAmount.toFixed(2)},${t.pumaFee.toFixed(2)},${t.netAmount.toFixed(2)},"${new Date(t.paidAt).toISOString()}"\n`
    );
    const blob = new Blob([...headers, ...rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `extrato-financeiro-pumabot-${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }
</script>

<svelte:head>
  <title>Financeiro & Extrato — Puma Bot SaaS</title>
</svelte:head>

<div class="p-8 max-w-7xl mx-auto space-y-6">
  <!-- Header -->
  <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
    <div>
      <h1 class="text-2xl font-bold font-['Geist'] text-[#E5E1E4]">Extrato Financeiro & Liquidações</h1>
      <p class="text-sm text-[#958DA1]">Acompanhe receitas líquidas, comissões fixas de R$ 0,50 e extratos consolidados.</p>
    </div>
    <div class="flex items-center gap-2.5">
      <a href="/gateways" class="px-4 py-2 rounded-xl bg-[#141417] hover:bg-[#1E1E23] border border-[#27272E] text-xs font-semibold text-[#E5E1E4] transition-all flex items-center gap-2">
        <span class="material-symbols-outlined text-[16px]">account_balance_wallet</span>
        Configurar Gateways
      </a>
      <Button variant="secondary" icon="download" on:click={exportCsv}>
        Exportar CSV
      </Button>
    </div>
  </div>

  <!-- KPI Grid -->
  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
    <!-- 1. Volume Bruto -->
    <div class="p-5 rounded-2xl bg-[#111113] border border-[#222226] space-y-1">
      <div class="flex items-center justify-between text-xs text-[#958DA1]">
        <span>Volume Bruto Aprovado</span>
        <span class="material-symbols-outlined text-[18px] text-[#A78BFA]">payments</span>
      </div>
      <div class="text-2xl font-bold font-['Geist'] text-[#E5E1E4]">
        R$ {data.financials.totalGrossRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
      </div>
      <div class="text-[11px] font-['JetBrains_Mono'] text-[#10B981]">
        {data.financials.totalTransactions} vendas confirmadas
      </div>
    </div>

    <!-- 2. Taxas Puma Bot -->
    <div class="p-5 rounded-2xl bg-[#111113] border border-[#222226] space-y-1">
      <div class="flex items-center justify-between text-xs text-[#958DA1]">
        <span>Taxa Puma (R$ 0,50 fixo)</span>
        <span class="material-symbols-outlined text-[18px] text-[#EAB308]">receipt</span>
      </div>
      <div class="text-2xl font-bold font-['Geist'] text-[#EAB308]">
        R$ {data.financials.pumaFeesTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
      </div>
      <div class="text-[11px] font-['JetBrains_Mono'] text-[#958DA1]">
        Economia de até 90% vs plataformas 8%
      </div>
    </div>

    <!-- 3. Receita Líquida no Bolso -->
    <div class="p-5 rounded-2xl bg-[#111113] border border-[#222226] space-y-1">
      <div class="flex items-center justify-between text-xs text-[#958DA1]">
        <span>Receita Líquida na Conta</span>
        <span class="material-symbols-outlined text-[18px] text-[#10B981]">account_balance</span>
      </div>
      <div class="text-2xl font-bold font-['Geist'] text-[#10B981]">
        R$ {data.financials.netRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
      </div>
      <div class="text-[11px] font-['JetBrains_Mono'] text-[#958DA1]">
        Cai direto no seu gateway
      </div>
    </div>

    <!-- 4. Ticket Médio -->
    <div class="p-5 rounded-2xl bg-[#111113] border border-[#222226] space-y-1">
      <div class="flex items-center justify-between text-xs text-[#958DA1]">
        <span>Ticket Médio por Venda</span>
        <span class="material-symbols-outlined text-[18px] text-[#38BDF8]">analytics</span>
      </div>
      <div class="text-2xl font-bold font-['Geist'] text-[#E5E1E4]">
        R$ {data.financials.avgTicket.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
      </div>
      <div class="text-[11px] font-['JetBrains_Mono'] text-[#958DA1]">
        {data.financials.gatewayProvider} ativo
      </div>
    </div>
  </div>

  <!-- Tabela de Lançamentos Financeiros -->
  <div class="p-5 rounded-2xl bg-[#111113] border border-[#222226] space-y-4">
    <div class="flex items-center justify-between pb-3 border-b border-[#222226]">
      <h3 class="text-sm font-semibold text-[#E5E1E4] font-['Geist']">Livro-Razão de Liquidações PIX</h3>
      <span class="text-xs font-['JetBrains_Mono'] text-[#958DA1]">{data.transactions.length} transações listadas</span>
    </div>

    {#if data.transactions.length === 0}
      <div class="py-8 text-center text-xs text-[#958DA1]">
        Nenhuma transação liquidada registrada no banco de dados ainda.
      </div>
    {:else}
      <div class="overflow-x-auto">
        <table class="w-full text-left text-xs font-['Inter']">
          <thead class="text-[11px] text-[#958DA1] uppercase font-['JetBrains_Mono'] border-b border-[#222226]">
            <tr>
              <th class="pb-2.5">ID / Txid</th>
              <th class="pb-2.5">Comprador</th>
              <th class="pb-2.5">Plano / Robô</th>
              <th class="pb-2.5 text-right">Valor Bruto</th>
              <th class="pb-2.5 text-right">Taxa Fixa</th>
              <th class="pb-2.5 text-right">Valor Líquido</th>
              <th class="pb-2.5 text-right">Data Liquidação</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-[#1F1F24]">
            {#each data.transactions as item}
              <tr class="hover:bg-[#18181C]/50 transition-colors">
                <td class="py-3 font-['JetBrains_Mono'] text-[#958DA1] text-[11px]">
                  {item.pixTxid ? item.pixTxid.slice(0, 14) + '...' : item.id.slice(0, 10)}
                </td>
                <td class="py-3 font-medium text-[#E5E1E4]">
                  {item.buyerName}
                </td>
                <td class="py-3 text-[#958DA1]">
                  <div>{item.planName}</div>
                  <div class="text-[10px] text-[#6E6778]">{item.botName}</div>
                </td>
                <td class="py-3 text-right font-['JetBrains_Mono'] text-[#E5E1E4]">
                  R$ {item.grossAmount.toFixed(2).replace('.', ',')}
                </td>
                <td class="py-3 text-right font-['JetBrains_Mono'] text-[#EF4444]">
                  - R$ 0,50
                </td>
                <td class="py-3 text-right font-['JetBrains_Mono'] font-bold text-[#10B981]">
                  R$ {item.netAmount.toFixed(2).replace('.', ',')}
                </td>
                <td class="py-3 text-right text-[#958DA1] font-['JetBrains_Mono'] text-[11px]">
                  {new Date(item.paidAt).toLocaleDateString('pt-BR')} {new Date(item.paidAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                </td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
    {/if}
  </div>
</div>

