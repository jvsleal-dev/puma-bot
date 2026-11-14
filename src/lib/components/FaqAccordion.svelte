<script lang="ts">
  import { slide } from 'svelte/transition';

  export let items: { question: string; answer: string }[] = [];
  export let allowMultiple: boolean = false;

  let openIndexes = new Set<number>();

  function toggle(index: number) {
    if (allowMultiple) {
      const next = new Set(openIndexes);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      openIndexes = next;
    } else {
      if (openIndexes.has(index)) {
        openIndexes = new Set();
      } else {
        openIndexes = new Set([index]);
      }
    }
  }
</script>

<div class="space-y-3 w-full">
  {#each items as item, i}
    {@const isOpen = openIndexes.has(i)}
    <div
      class="rounded-xl border transition-all duration-200 overflow-hidden {isOpen ? 'border-[#7C3AED]/60 bg-[#121117] shadow-[0_0_24px_rgba(124,58,237,0.12)]' : 'border-[#222226] bg-[#111113] hover:border-[#353437]'}"
    >
      <button
        type="button"
        on:click={() => toggle(i)}
        class="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 select-none focus:outline-none transition-colors"
        aria-expanded={isOpen}
      >
        <span class="font-['Geist',sans-serif] text-sm sm:text-base font-medium transition-colors {isOpen ? 'text-white' : 'text-[#E5E1E4] hover:text-white'}">
          {item.question}
        </span>
        <span
          class="material-symbols-outlined text-[#958DA1] transition-transform duration-300 shrink-0 text-[20px] {isOpen ? 'rotate-180 text-[#7C3AED]' : ''}"
        >
          expand_more
        </span>
      </button>

      {#if isOpen}
        <div
          transition:slide={{ duration: 220 }}
          class="px-4 sm:px-5 pb-4 sm:pb-5 text-xs sm:text-sm text-[#958DA1] leading-relaxed border-t border-[#222226]/80 pt-3.5 font-['Inter',sans-serif]"
        >
          {item.answer}
        </div>
      {/if}
    </div>
  {/each}
</div>
