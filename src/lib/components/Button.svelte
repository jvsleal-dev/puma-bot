<script lang="ts">
  export let variant: 'primary' | 'secondary' | 'danger' | 'ghost' = 'primary';
  export let size: 'sm' | 'md' | 'lg' = 'md';
  export let disabled: boolean = false;
  export let loading: boolean = false;
  export let type: 'button' | 'submit' | 'reset' = 'button';
  export let icon: string = '';

  const sizeClasses = {
    sm: 'h-7 px-2.5 text-[12px] gap-1.5',
    md: 'h-8 px-3.5 text-[13px] gap-2',
    lg: 'h-10 px-5 text-[14px] gap-2.5'
  };

  const variantClasses = {
    primary: 'bg-[#7C3AED] hover:bg-[#6D28D9] text-white border border-[#905B00]/0 shadow-[0_0_12px_rgba(124,58,237,0.35)] active:scale-[0.98]',
    secondary: 'bg-[#18181B] hover:bg-[#201F22] text-[#E5E1E4] border border-[#222226] hover:border-[#353437] active:scale-[0.98]',
    danger: 'bg-[#EF4444]/10 hover:bg-[#EF4444]/20 text-[#EF4444] border border-[#EF4444]/30 active:scale-[0.98]',
    ghost: 'bg-transparent hover:bg-[#18181B] text-[#958DA1] hover:text-[#E5E1E4]'
  };
</script>

<button
  {type}
  {disabled}
  on:click
  class="inline-flex items-center justify-center rounded-lg font-medium transition-all duration-150 select-none {sizeClasses[size]} {variantClasses[variant]} {disabled || loading ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''}"
>
  {#if loading}
    <span class="material-symbols-outlined text-[16px] animate-spin">sync</span>
  {:else if icon}
    <span class="material-symbols-outlined text-[16px]">{icon}</span>
  {/if}
  <slot />
</button>

