<script lang="ts">
  export let status: 'PAID' | 'PENDING' | 'EXPIRED' | 'REFUNDED' | string = 'PENDING';

  $: normalized = (status || '').toUpperCase();
</script>

{#if normalized === 'PAID'}
  <span class="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-['JetBrains_Mono'] font-medium bg-[#10B981]/10 text-[#10B981] border border-[#10B981]/25">
    <span class="w-1.5 h-1.5 rounded-full bg-[#10B981] shadow-[0_0_6px_#10B981]"></span>
    <span>Aprovado</span>
  </span>
{:else if normalized === 'PENDING'}
  <span class="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-['JetBrains_Mono'] font-medium bg-[#F59E0B]/10 text-[#F59E0B] border border-[#F59E0B]/25">
    <span class="w-1.5 h-1.5 rounded-full bg-[#F59E0B] animate-pulse"></span>
    <span>Pendente</span>
  </span>
{:else if normalized === 'EXPIRED'}
  <span class="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-['JetBrains_Mono'] font-medium bg-[#EF4444]/10 text-[#EF4444] border border-[#EF4444]/25">
    <span class="w-1.5 h-1.5 rounded-full bg-[#EF4444]"></span>
    <span>Expirado</span>
  </span>
{:else}
  <span class="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-['JetBrains_Mono'] font-medium bg-[#353437] text-[#CCC3D8] border border-[#4A4455]">
    <span>{status}</span>
  </span>
{/if}
