<script lang="ts">
  import type { PageData } from './$types';
  import Button from '$lib/components/Button.svelte';
  import TransactionsTable from '$lib/components/TransactionsTable.svelte';

  export let data: PageData;

  let sales = [...data.sales];
  let filterStatus: 'ALL' | 'PAID' | 'PENDING' = 'ALL';
  let isSimulating = false;

  $: filteredSales = filterStatus === 'ALL'
    ? sales
    : sales.filter(s => s.status === filterStatus);

  async function handleExportCsv() {
    let csv = 'ID,TelegramUser,Plano,Valor,Status,Data\n';
    filteredSales.forEach(s => {
      csv += `${s.id},${s.telegramUsername || s.telegramFirstName || s.telegramUserId},${s.planName},${s.amount},${s.status},${s.createdAt}\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `vendas_pumabot_${filterStatus.toLowerCase()}.csv`;
    a.click();
  }

  async function handleSimulatePix() {
    isSimulating = true;
    try {
      const res = await fetch('/api/webhook/pix', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          txid: 'tx_sim_' + Date.now(),
          telegramUserId: '987654321',
          telegramUsername: 'trader_vip',
          telegramFirstName: 'Investidor VIP',
          planName: 'VIP Mensal (Sinais)',
          amount: 47.90
        })
      });

      const json = await res.json();
      alert(`Pagamento PIX liquidado com sucesso em ${json.latencyMs}ms! Atualizando listagem...`);
      window.location.reload();
    } catch (e) {
      alert('Erro ao simular PIX.');
    } finally {
      isSimulating = false;
    }
  }

  async function handleResendVip(saleId: string) {
    try {
      const res = await fetch(`/api/sales/${saleId}/resend-vip`, { method: 'POST' });
      const json = await res.json();
      if (json.success) {
        alert(json.message || 'Link VIP reenviado com sucesso!');
      } else {
        alert(json.error || 'Erro ao reenviar link');
      }
    } catch (e) {
      alert('Erro na comunicação com o servidor.');
    }
  }
</script>

<div class="p-8 max-w-7xl mx-auto space-y-6">
  <!-- Header -->
  <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
    <div>
      <h1 class="text-2xl font-bold font-['Geist'] text-[#E5E1E4]">Clientes & Vendas PIX</h1>
      <p class="text-sm text-[#958DA1]">Monitore transações em tempo real, pedidos pendentes e links exclusivos de acesso VIP.</p>
    </div>
    <div class="flex items-center gap-2.5">
      <Button variant="secondary" icon="bolt" loading={isSimulating} on:click={handleSimulatePix}>
        Simulador PIX
      </Button>
      <Button variant="secondary" icon="file_download" on:click={handleExportCsv}>
        Exportar CSV
      </Button>
    </div>
  </div>

  <!-- Filter Tabs -->
  <div class="flex items-center gap-1.5 p-1 bg-[#111113] border border-[#222226] rounded-lg w-fit">
    <button
      class="px-3.5 py-1.5 rounded-md text-xs font-medium transition-colors {filterStatus === 'ALL' ? 'bg-[#201F22] text-[#E5E1E4]' : 'text-[#958DA1] hover:text-[#E5E1E4]'}"
      on:click={() => filterStatus = 'ALL'}
    >
      Todos ({sales.length})
    </button>
    <button
      class="px-3.5 py-1.5 rounded-md text-xs font-medium transition-colors {filterStatus === 'PAID' ? 'bg-[#201F22] text-[#10B981]' : 'text-[#958DA1] hover:text-[#E5E1E4]'}"
      on:click={() => filterStatus = 'PAID'}
    >
      Aprovados ({sales.filter(s => s.status === 'PAID').length})
    </button>
    <button
      class="px-3.5 py-1.5 rounded-md text-xs font-medium transition-colors {filterStatus === 'PENDING' ? 'bg-[#201F22] text-[#F59E0B]' : 'text-[#958DA1] hover:text-[#E5E1E4]'}"
      on:click={() => filterStatus = 'PENDING'}
    >
      Pendentes ({sales.filter(s => s.status === 'PENDING').length})
    </button>
  </div>

  <!-- Transactions Table -->
  <TransactionsTable transactions={filteredSales} onResend={handleResendVip} />
</div>
