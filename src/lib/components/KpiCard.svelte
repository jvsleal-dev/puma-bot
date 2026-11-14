<script lang="ts">
  export let title: string = '';
  export let value: string = '';
  export let delta: string = '';
  export let deltaPositive: boolean = true;
  export let subtitle: string = '';
  export let icon: string = '';
</script>

<div class="bg-[#111113] border border-[#222226] hover:border-[#353437] transition-all rounded-xl p-5 flex flex-col justify-between shadow-sm relative overflow-hidden group">
  <!-- Accent Top Line -->
  <div class="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#7C3AED]/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>

  <div>
    <div class="flex items-center justify-between mb-3">
      <span class="text-[12px] font-medium text-[#958DA1]">{title}</span>
      {#if icon}
        <span class="material-symbols-outlined text-[18px] text-[#958DA1]">{icon}</span>
      {/if}
    </div>

    <div class="flex items-baseline gap-2.5 mb-2">
      <span class="text-2xl font-bold font-['JetBrains_Mono'] tracking-tight text-[#E5E1E4]">{value}</span>
      {#if delta}
        <span class="inline-flex items-center gap-0.5 text-[11px] font-['JetBrains_Mono'] px-1.5 py-0.2 rounded border {deltaPositive ? 'bg-[#10B981]/10 text-[#10B981] border-[#10B981]/25' : 'bg-[#EF4444]/10 text-[#EF4444] border-[#EF4444]/25'}">
          <span class="material-symbols-outlined text-[12px]">{deltaPositive ? 'arrow_upward' : 'arrow_downward'}</span>
          {delta}
        </span>
      {/if}
    </div>
  </div>

  {#if subtitle}
    <p class="text-[11px] text-[#958DA1] mt-1 font-['Inter']">{subtitle}</p>
  {/if}
</div>

