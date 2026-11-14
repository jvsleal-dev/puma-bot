<script lang="ts">
  import { createEventDispatcher, onMount } from 'svelte';
  export let open: boolean = false;
  export let title: string = '';
  export let size: 'sm' | 'md' | 'lg' = 'md';

  const dispatch = createEventDispatcher();

  function close() {
    dispatch('close');
  }

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === 'Escape' && open) close();
  }

  onMount(() => {
    window.addEventListener('keydown', handleKeydown);
    return () => window.removeEventListener('keydown', handleKeydown);
  });

  const widthClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl'
  };
</script>

{#if open}
  <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
    <!-- Click Outside Backdrop -->
    <div class="absolute inset-0" on:click={close} on:keydown={() => {}} role="button" tabindex="0"></div>

    <!-- Modal Content Card -->
    <div class="relative w-full {widthClasses[size]} bg-[#111113] border border-[#222226] rounded-xl shadow-2xl overflow-hidden z-10 flex flex-col max-h-[90vh]">
      <!-- Header -->
      <div class="px-5 py-4 border-b border-[#222226] flex items-center justify-between">
        <h3 class="font-semibold text-base text-[#E5E1E4] font-['Geist']">{title}</h3>
        <button on:click={close} class="text-[#958DA1] hover:text-[#E5E1E4] p-1 rounded-md hover:bg-[#18181B] transition-colors" title="Fechar">
          <span class="material-symbols-outlined text-[20px]">close</span>
        </button>
      </div>

      <!-- Body -->
      <div class="p-5 overflow-y-auto space-y-4">
        <slot />
      </div>

      <!-- Footer -->
      {#if $$slots.footer}
        <div class="px-5 py-3.5 border-t border-[#222226] bg-[#0E0E10] flex items-center justify-end gap-2.5">
          <slot name="footer" />
        </div>
      {/if}
    </div>
  </div>
{/if}
