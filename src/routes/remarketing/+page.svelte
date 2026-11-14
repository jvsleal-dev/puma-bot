<script lang="ts">
  import type { PageData } from './$types';
  import Button from '$lib/components/Button.svelte';

  export let data: PageData;

  let remarketingMsg = data.flow.remarketingMsg;
  let downsellPrice = data.flow.downsellPrice;
  let delayMinutes = 10;
  let isSaving = false;
  let saveSuccess = false;

  async function handleSaveRemarketing() {
    isSaving = true;
    try {
      const res = await fetch('/api/flows', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          remarketingMsg,
          downsellPrice
        })
      });

      const resJson = await res.json();
      if (resJson.success) {
        saveSuccess = true;
        setTimeout(() => saveSuccess = false, 3000);
      }
    } catch (e) {
      console.error(e);
    } finally {
      isSaving = false;
    }
  }
</script>

<svelte:head>
  <title>Remarketing & Recuperação — Puma Bot SaaS</title>
</svelte:head>

<div class="p-8 max-w-7xl mx-auto space-y-6">
  <!-- Header -->
  <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
    <div>
      <h1 class="text-2xl font-bold font-['Geist'] text-[#E5E1E4]">Remarketing & Recuperação de PIX</h1>
      <p class="text-sm text-[#958DA1]">Dispare mensagens automatizadas de áudio e ofertas de downsell para recuperar pedidos pendentes.</p>
    </div>
    <div class="flex items-center gap-2.5">
      <a href="/fluxos" class="px-4 py-2 rounded-xl bg-[#141417] hover:bg-[#1E1E23] border border-[#27272E] text-xs font-semibold text-[#E5E1E4] transition-all flex items-center gap-2">
        <span class="material-symbols-outlined text-[16px]">account_tree</span>
        Ver Funil Completo
      </a>
      <Button variant="primary" icon="save" loading={isSaving} on:click={handleSaveRemarketing}>
        Salvar Regras de Disparo
      </Button>
    </div>
  </div>

  {#if saveSuccess}
    <div class="p-3.5 rounded-xl bg-[#10B981]/10 border border-[#10B981]/30 text-xs font-medium text-[#10B981]">
      Configurações de remarketing salvas com sucesso no banco de dados.
    </div>
  {/if}

  <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
    <!-- Left Column: Configuração de Mensagem -->
    <div class="lg:col-span-2 space-y-6">
      <div class="p-5 rounded-2xl bg-[#111113] border border-[#222226] space-y-4">
        <h2 class="text-sm font-semibold text-[#E5E1E4] flex items-center gap-2">
          <span class="w-2 h-2 rounded-full bg-[#7C3AED]"></span>
          Cadência Automática de Recuperação
        </h2>

        <div class="space-y-4 text-xs font-['Inter']">
          <div>
            <label class="block text-xs font-medium text-[#958DA1] mb-1.5" for="remarketing-msg">
              Texto da Mensagem de Remarketing
            </label>
            <textarea
              id="remarketing-msg"
              bind:value={remarketingMsg}
              rows="4"
              class="w-full p-3 rounded-xl bg-[#09090B] border border-[#222226] text-xs text-[#E5E1E4] focus:outline-none focus:border-[#7C3AED] transition-colors resize-none"
            ></textarea>
            <p class="text-[11px] text-[#958DA1] mt-1">Enviada no privado do lead caso o PIX não seja pago no tempo estipulado.</p>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-medium text-[#958DA1] mb-1.5" for="downsell-price">
                Preço Promocional de Downsell (R$)
              </label>
              <input
                id="downsell-price"
                type="number"
                step="0.01"
                bind:value={downsellPrice}
                class="w-full h-9 px-3 rounded-lg bg-[#09090B] border border-[#222226] text-xs font-['JetBrains_Mono'] text-[#E5E1E4] focus:outline-none focus:border-[#7C3AED]"
              />
            </div>

            <div>
              <label class="block text-xs font-medium text-[#958DA1] mb-1.5" for="delay-min">
                Tempo de Espera Após Geração (Minutos)
              </label>
              <input
                id="delay-min"
                type="number"
                bind:value={delayMinutes}
                class="w-full h-9 px-3 rounded-lg bg-[#09090B] border border-[#222226] text-xs font-['JetBrains_Mono'] text-[#E5E1E4] focus:outline-none focus:border-[#7C3AED]"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Pedidos Pendentes Aguardando Recuperação -->
      <div class="p-5 rounded-2xl bg-[#111113] border border-[#222226] space-y-4">
        <div class="flex items-center justify-between pb-3 border-b border-[#222226]">
          <h3 class="text-sm font-semibold text-[#E5E1E4] font-['Geist']">Leads Pendentes de Pagamento</h3>
          <span class="text-xs font-['JetBrains_Mono'] text-[#EAB308]">{data.pendingSales.length} aguardando compensação</span>
        </div>

        {#if data.pendingSales.length === 0}
          <div class="py-8 text-center text-xs text-[#958DA1]">
            Nenhum pedido pendente de pagamento. Todos os PIX foram liquidados!
          </div>
        {:else}
          <div class="overflow-x-auto">
            <table class="w-full text-left text-xs font-['Inter']">
              <thead class="text-[11px] text-[#958DA1] uppercase font-['JetBrains_Mono'] border-b border-[#222226]">
                <tr>
                  <th class="pb-2.5">Comprador</th>
                  <th class="pb-2.5">Robô</th>
                  <th class="pb-2.5">Valor</th>
                  <th class="pb-2.5">Gerado em</th>
                  <th class="pb-2.5 text-right">Ação</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-[#1F1F24]">
                {#each data.pendingSales as sale}
                  <tr class="hover:bg-[#18181C]/50 transition-colors">
                    <td class="py-3 font-medium text-[#E5E1E4]">
                      <div>{sale.name}</div>
                      <div class="text-[10px] text-[#958DA1]">@{sale.username}</div>
                    </td>
                    <td class="py-3 text-[#958DA1]">{sale.botName}</td>
                    <td class="py-3 font-['JetBrains_Mono'] text-[#E5E1E4]">
                      R$ {sale.amount.toFixed(2).replace('.', ',')}
                    </td>
                    <td class="py-3 text-[#958DA1] font-['JetBrains_Mono']">
                      {new Date(sale.createdAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td class="py-3 text-right">
                      <span class="px-2 py-0.5 rounded text-[10px] font-['JetBrains_Mono'] bg-[#EAB308]/15 text-[#EAB308]">
                        Pendente
                      </span>
                    </td>
                  </tr>
                {/each}
              </tbody>
            </table>
          </div>
        {/if}
      </div>
    </div>

    <!-- Right Column: Simulação de Áudio de Voz Nativo -->
    <div class="space-y-4">
      <div class="p-5 rounded-2xl bg-[#111113] border border-[#222226] space-y-4 sticky top-6">
        <div class="flex items-center justify-between pb-3 border-b border-[#222226]">
          <span class="text-xs font-semibold text-[#E5E1E4] uppercase tracking-wider font-['JetBrains_Mono']">Recuperação por Áudio</span>
          <span class="text-[11px] font-['JetBrains_Mono'] text-[#10B981]">Telegram Nativo</span>
        </div>

        <p class="text-xs text-[#958DA1] leading-relaxed">
          O Puma Bot simula o status <em class="text-[#E5E1E4]">"gravando áudio..."</em> na conversa do Telegram e envia uma mensagem de voz real com onda senoidal para elevar a conversão em até 40%.
        </p>

        <!-- Preview do Player de Áudio Telegram -->
        <div class="p-3.5 rounded-xl bg-[#09090B] border border-[#222226] space-y-2.5">
          <div class="flex items-center gap-3">
            <button type="button" class="w-9 h-9 rounded-full bg-[#7C3AED] hover:bg-[#6D28D9] text-white flex items-center justify-center transition-colors">
              <span class="material-symbols-outlined text-[20px]">play_arrow</span>
            </button>
            <div class="flex-1 space-y-1">
              <div class="h-2 rounded-full bg-[#1F1F24] overflow-hidden">
                <div class="h-full w-3/4 bg-[#7C3AED] rounded-full"></div>
              </div>
              <div class="flex justify-between text-[10px] font-['JetBrains_Mono'] text-[#958DA1]">
                <span>0:18</span>
                <span>0:24</span>
              </div>
            </div>
          </div>
          <div class="text-[11px] text-[#A78BFA] font-['JetBrains_Mono']">
            "Fala amigo! Vi que você gerou o PIX do acesso VIP mas ainda não liberou..."
          </div>
        </div>

        <div class="pt-3 border-t border-[#1F1F24] text-[11px] text-[#958DA1] space-y-1.5">
          <div class="flex justify-between">
            <span>Taxa Média de Recuperação:</span>
            <span class="text-[#10B981] font-bold font-['JetBrains_Mono']">34.2%</span>
          </div>
          <div class="flex justify-between">
            <span>Tempo Médio até Liquidação:</span>
            <span class="text-[#E5E1E4] font-['JetBrains_Mono']">4.8 minutos</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

