<script lang="ts">
  import type { PageData } from './$types';
  import Button from '$lib/components/Button.svelte';

  export let data: PageData;

  let welcomeMessage = data.welcomeMessage;
  let remarketingMsg = data.remarketingMsg;
  let downsellPrice = data.downsellPrice;
  let plans = [...data.plans];

  let isSaving = false;
  let alertMessage = '';
  let alertSuccess = false;

  async function handleSaveFlow() {
    isSaving = true;
    alertMessage = '';

    try {
      const res = await fetch('/api/flows', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          botId: data.botId,
          welcomeMessage,
          remarketingMsg,
          downsellPrice,
          plans
        })
      });

      const json = await res.json();
      if (json.success) {
        alertSuccess = true;
        alertMessage = 'Fluxo de vendas publicado com sucesso!';
      } else {
        alertSuccess = false;
        alertMessage = json.error || 'Erro ao publicar fluxo';
      }
    } catch (e) {
      alertSuccess = false;
      alertMessage = 'Erro na comunicação com o servidor.';
    } finally {
      isSaving = false;
      setTimeout(() => alertMessage = '', 3000);
    }
  }

  function addPlan() {
    plans = [
      ...plans,
      {
        id: 'plan_' + Date.now(),
        title: 'Novo Plano VIP',
        price: 97.00,
        durationDays: 60
      }
    ];
  }

  function removePlan(index: number) {
    if (plans.length <= 1) return;
    plans = plans.filter((_, i) => i !== index);
  }
</script>

<div class="p-8 max-w-7xl mx-auto space-y-6">
  <!-- Header -->
  <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
    <div>
      <h1 class="text-2xl font-bold font-['Geist'] text-[#E5E1E4]">Construtor de Funil & Mensagens</h1>
      <p class="text-sm text-[#958DA1]">Configure a jornada de vendas, opções de planos e automação de remarketing.</p>
    </div>
    <div class="flex items-center gap-2.5">
      <Button variant="secondary" icon="send" on:click={() => alert('Simulação disparada! Verifique o preview no painel lateral.')}>
        Simular no Telegram
      </Button>
      <Button variant="primary" icon="publish" loading={isSaving} on:click={handleSaveFlow}>
        Publicar Alterações
      </Button>
    </div>
  </div>

  {#if alertMessage}
    <div class="p-3.5 rounded-xl text-xs font-medium border {alertSuccess ? 'bg-[#10B981]/10 text-[#10B981] border-[#10B981]/30' : 'bg-[#EF4444]/10 text-[#EF4444] border-[#EF4444]/30'}">
      {alertMessage}
    </div>
  {/if}

  <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
    <!-- Left Column: Settings -->
    <div class="lg:col-span-2 space-y-6">
      <!-- 1. Mensagem de Boas-Vindas -->
      <div class="bg-[#111113] border border-[#222226] rounded-xl p-5 space-y-3">
        <div class="flex items-center justify-between">
          <h2 class="text-sm font-semibold text-[#E5E1E4] flex items-center gap-2">
            <span class="w-2 h-2 rounded-full bg-[#7C3AED]"></span>
            Mensagem de Boas-Vindas (/start)
          </h2>
          <span class="text-[11px] font-['JetBrains_Mono'] text-[#958DA1]">Suporta tags HTML (&lt;b&gt;, &lt;i&gt;)</span>
        </div>
        <textarea
          bind:value={welcomeMessage}
          rows="4"
          class="w-full p-3 rounded-lg bg-[#09090B] border border-[#222226] text-sm text-[#E5E1E4] font-['Inter'] focus:outline-none focus:border-[#7C3AED]"
        ></textarea>
      </div>

      <!-- 2. Planos de Assinatura -->
      <div class="bg-[#111113] border border-[#222226] rounded-xl p-5 space-y-4">
        <div class="flex items-center justify-between">
          <h2 class="text-sm font-semibold text-[#E5E1E4] flex items-center gap-2">
            <span class="w-2 h-2 rounded-full bg-[#10B981]"></span>
            Planos de Assinatura (Botões Inline)
          </h2>
          <Button variant="secondary" size="sm" icon="add" on:click={addPlan}>
            Adicionar Plano
          </Button>
        </div>

        <div class="space-y-3">
          {#each plans as plan, index (plan.id || index)}
            <div class="p-3.5 rounded-lg bg-[#09090B] border border-[#222226] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div class="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <div>
                  <label class="block text-[10px] uppercase font-['JetBrains_Mono'] text-[#958DA1] mb-1">Título</label>
                  <input
                    type="text"
                    bind:value={plan.title}
                    class="w-full h-8 px-2.5 rounded bg-[#111113] border border-[#222226] text-xs text-[#E5E1E4] focus:outline-none focus:border-[#7C3AED]"
                  />
                </div>
                <div>
                  <label class="block text-[10px] uppercase font-['JetBrains_Mono'] text-[#958DA1] mb-1">Preço (R$)</label>
                  <input
                    type="number"
                    step="0.01"
                    bind:value={plan.price}
                    class="w-full h-8 px-2.5 rounded bg-[#111113] border border-[#222226] text-xs font-['JetBrains_Mono'] text-[#E5E1E4] focus:outline-none focus:border-[#7C3AED]"
                  />
                </div>
                <div>
                  <label class="block text-[10px] uppercase font-['JetBrains_Mono'] text-[#958DA1] mb-1">Duração (Dias)</label>
                  <input
                    type="number"
                    bind:value={plan.durationDays}
                    class="w-full h-8 px-2.5 rounded bg-[#111113] border border-[#222226] text-xs font-['JetBrains_Mono'] text-[#E5E1E4] focus:outline-none focus:border-[#7C3AED]"
                  />
                </div>
              </div>

              {#if plans.length > 1}
                <button
                  type="button"
                  on:click={() => removePlan(index)}
                  class="text-[#EF4444] hover:bg-[#EF4444]/10 p-1.5 rounded transition-colors self-end sm:self-center"
                  title="Remover Plano"
                >
                  <span class="material-symbols-outlined text-[18px]">delete</span>
                </button>
              {/if}
            </div>
          {/each}
        </div>
      </div>

      <!-- 3. Recuperação & Remarketing -->
      <div class="bg-[#111113] border border-[#222226] rounded-xl p-5 space-y-4">
        <h2 class="text-sm font-semibold text-[#E5E1E4] flex items-center gap-2">
          <span class="w-2 h-2 rounded-full bg-[#F59E0B]"></span>
          Recuperação de Carrinho Abandonado (Downsell)
        </h2>
        <div class="space-y-3">
          <div>
            <label class="block text-xs font-medium text-[#958DA1] mb-1.5">Mensagem de Remarketing (após 10 min de inatividade)</label>
            <textarea
              bind:value={remarketingMsg}
              rows="3"
              class="w-full p-3 rounded-lg bg-[#09090B] border border-[#222226] text-sm text-[#E5E1E4] font-['Inter'] focus:outline-none focus:border-[#7C3AED]"
            ></textarea>
          </div>
          <div class="max-w-xs">
            <label class="block text-xs font-medium text-[#958DA1] mb-1.5">Preço Promocional de Downsell (R$)</label>
            <input
              type="number"
              step="0.01"
              bind:value={downsellPrice}
              class="w-full h-9 px-3 rounded-lg bg-[#09090B] border border-[#222226] text-sm font-['JetBrains_Mono'] text-[#E5E1E4] focus:outline-none focus:border-[#7C3AED]"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Right Column: Live Telegram Preview -->
    <div class="space-y-4">
      <div class="bg-[#111113] border border-[#222226] rounded-xl p-5 sticky top-6">
        <div class="flex items-center justify-between pb-3 border-b border-[#222226] mb-4">
          <span class="text-xs font-semibold text-[#E5E1E4] uppercase tracking-wider font-['JetBrains_Mono']">Preview em Tempo Real</span>
          <span class="w-2 h-2 rounded-full bg-[#10B981]"></span>
        </div>

        <!-- Simulated Telegram Chat Bubble -->
        <div class="bg-[#09090B] border border-[#222226] rounded-xl p-4 space-y-3 font-['Inter'] text-xs">
          <div class="flex items-center gap-2 text-[#958DA1] text-[11px] pb-2 border-b border-[#222226]/50">
            <div class="w-5 h-5 rounded-full bg-[#7C3AED] flex items-center justify-center text-white text-[9px] font-bold">PB</div>
            <span class="font-semibold text-[#E5E1E4]">{data.botName}</span>
            <span class="text-[10px]">bot</span>
          </div>

          <!-- Message Body -->
          <div class="text-[#E5E1E4] leading-relaxed whitespace-pre-wrap">
            {welcomeMessage}
          </div>

          <!-- Inline Buttons -->
          <div class="space-y-1.5 pt-2">
            {#each plans as plan}
              <button class="w-full py-2 px-3 rounded-lg bg-[#18181B] hover:bg-[#201F22] text-[#7C3AED] hover:text-white border border-[#222226] font-medium text-xs transition-colors flex items-center justify-between">
                <span>{plan.title}</span>
                <span class="font-['JetBrains_Mono'] font-bold">R$ {Number(plan.price).toFixed(2).replace('.', ',')}</span>
              </button>
            {/each}
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

