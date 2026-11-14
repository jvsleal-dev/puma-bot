<script lang="ts">
  import StatusBadge from './StatusBadge.svelte';
  import Button from './Button.svelte';

  export let transactions: any[] = [];
  export let onResend: (id: string) => void = () => {};

  function formatBrl(amount: number) {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(amount || 0);
  }

  function getInitials(name?: string) {
    if (!name) return 'LD';
    return name.slice(0, 2).toUpperCase();
  }
</script>

<div class="w-full overflow-x-auto rounded-xl border border-[#222226] bg-[#111113]">
  <table class="w-full text-left text-xs font-['Inter']">
    <thead class="bg-[#0E0E10] text-[#958DA1] font-['JetBrains_Mono'] uppercase tracking-wider text-[10px] border-b border-[#222226]">
      <tr>
        <th class="py-3 px-4">Cliente / Telegram</th>
        <th class="py-3 px-4">Robô</th>
        <th class="py-3 px-4">Plano</th>
        <th class="py-3 px-4 text-right">Valor</th>
        <th class="py-3 px-4 text-center">Status</th>
        <th class="py-3 px-4 text-right">Ação</th>
      </tr>
    </thead>
    <tbody class="divide-y divide-[#222226] text-[13px]">
      {#if transactions.length === 0}
        <tr>
          <td colspan="6" class="py-8 text-center text-[#958DA1]">
            Nenhuma transação encontrada no período.
          </td>
        </tr>
      {:else}
        {#each transactions as tx (tx.id)}
          <tr class="hover:bg-[#18181B]/60 transition-colors">
            <td class="py-3 px-4 flex items-center gap-2.5">
              <div class="w-7 h-7 rounded-full bg-[#18181B] text-[#7C3AED] border border-[#222226] flex items-center justify-center font-bold text-[11px]">
                {getInitials(tx.telegramFirstName || tx.telegramUsername)}
              </div>
              <div class="flex flex-col">
                <span class="font-medium text-[#E5E1E4]">{tx.telegramFirstName || 'Lead VIP'}</span>
                {#if tx.telegramUsername}
                  <span class="text-[11px] font-['JetBrains_Mono'] text-[#958DA1]">@{tx.telegramUsername}</span>
                {/if}
              </div>
            </td>
            <td class="py-3 px-4 text-[#958DA1] text-[12px]">{tx.bot?.name || 'Puma VIP'}</td>
            <td class="py-3 px-4 text-[#CCC3D8]">{tx.planName || 'VIP Mensal'}</td>
            <td class="py-3 px-4 text-right font-['JetBrains_Mono'] font-semibold text-[#E5E1E4]">
              {formatBrl(tx.amount)}
            </td>
            <td class="py-3 px-4 text-center">
              <StatusBadge status={tx.status} />
            </td>
            <td class="py-3 px-4 text-right">
              {#if tx.status === 'PAID'}
                <Button variant="ghost" size="sm" icon="send" on:click={() => onResend(tx.id)}>
                  Reenviar VIP
                </Button>
              {:else}
                <span class="text-[11px] font-['JetBrains_Mono'] text-[#958DA1]">Aguardando PIX</span>
              {/if}
            </td>
          </tr>
        {/each}
      {/if}
    </tbody>
  </table>
</div>
