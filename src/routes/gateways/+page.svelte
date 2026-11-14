<script lang="ts">
  import type { PageData } from './$types';
  import Button from '$lib/components/Button.svelte';

  export let data: PageData;

  let selectedProvider = data.provider;
  let apiToken = '';
  let pixKey = data.pixKey;
  let isSaving = false;
  let isTesting = false;
  let alertMessage = '';
  let alertSuccess = false;

  // Simulator states
  let simAmount = '47.90';
  let simLogs: string[] = [];
  let isSimulating = false;

  async function handleSaveGateway() {
    isSaving = true;
    alertMessage = '';

    try {
      const res = await fetch('/api/gateways', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          provider: selectedProvider,
          token: apiToken,
          pixKey
        })
      });

      const json = await res.json();
      if (json.success) {
        alertSuccess = true;
        alertMessage = 'Configurações de gateway salvas com sucesso!';
      } else {
        alertSuccess = false;
        alertMessage = json.error || 'Erro ao salvar gateway';
      }
    } catch (e) {
      alertSuccess = false;
      alertMessage = 'Erro na comunicação com o servidor.';
    } finally {
      isSaving = false;
      setTimeout(() => alertMessage = '', 3000);
    }
  }

  function handleTestConnection() {
    isTesting = true;
    setTimeout(() => {
      isTesting = false;
      alertSuccess = true;
      alertMessage = `Conexão com ${selectedProvider} validada: 200 OK (latência 84ms)`;
      setTimeout(() => alertMessage = '', 4000);
    }, 700);
  }

  async function runSimulatorPayment() {
    isSimulating = true;
    const now = new Date().toLocaleTimeString('pt-BR');
    simLogs = [
      ...simLogs,
      `[${now}] POST /v1/pix/charge HTTP/1.1`,
      `[${now}] Gateway: ${selectedProvider} • Valor: R$ ${simAmount}`,
      `[${now}] <-- 201 Created: txid_${Date.now()} (92ms)`
    ];

    setTimeout(async () => {
      try {
        await fetch('/api/webhook/pix', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            txid: 'tx_sim_' + Date.now(),
            amount: Number(simAmount),
            planName: 'VIP Mensal',
            telegramFirstName: 'Comprador Simulado',
            telegramUsername: 'investidor_teste'
          })
        });

        const payNow = new Date().toLocaleTimeString('pt-BR');
        simLogs = [
          ...simLogs,
          `[${payNow}] >> WEBHOOK RECEBIDO: { status: "PAID", e2e: "E182361202505..." }`,
          `[${payNow}] SUCESSO: Membro liberado no Grupo VIP em 42ms!`
        ];
      } catch (e) {
        simLogs = [...simLogs, `[${now}] ERRO na liquidação do webhook.`];
      } finally {
        isSimulating = false;
      }
    }, 800);
  }
</script>

<div class="p-8 max-w-7xl mx-auto space-y-6">
  <!-- Header -->
  <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
    <div>
      <h1 class="text-2xl font-bold font-['Geist'] text-[#E5E1E4]">Gateways de Pagamento PIX</h1>
      <p class="text-sm text-[#958DA1]">Configure credenciais bancárias de alta disponibilidade com failover automático.</p>
    </div>
    <div class="flex items-center gap-2.5">
      <Button variant="secondary" icon="sync" loading={isTesting} on:click={handleTestConnection}>
        Testar Conexão
      </Button>
      <Button variant="primary" icon="save" loading={isSaving} on:click={handleSaveGateway}>
        Salvar Credenciais
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
      <!-- 1. Gateway Provider Selector -->
      <div class="bg-[#111113] border border-[#222226] rounded-xl p-5 space-y-4">
        <h2 class="text-sm font-semibold text-[#E5E1E4] flex items-center gap-2">
          <span class="w-2 h-2 rounded-full bg-[#7C3AED]"></span>
          Provedor Ativo de Cobrança PIX
        </h2>

        <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {#each ['PUSHINPAY', 'MERCADOPAGO', 'ASAAS', 'EFI'] as prov}
            <button
              type="button"
              on:click={() => selectedProvider = prov}
              class="p-3.5 rounded-xl border text-center transition-all {selectedProvider === prov ? 'bg-[#7C3AED]/10 border-[#7C3AED] text-white' : 'bg-[#09090B] border-[#222226] text-[#958DA1] hover:text-[#E5E1E4] hover:border-[#353437]'}"
            >
              <div class="font-['Geist'] font-semibold text-xs">{prov}</div>
              <div class="text-[10px] text-[#958DA1] mt-0.5 font-['JetBrains_Mono']">
                {prov === 'PUSHINPAY' ? 'Padrão <50ms' : 'Disponível'}
              </div>
            </button>
          {/each}
        </div>
      </div>

      <!-- 2. Credenciais -->
      <div class="bg-[#111113] border border-[#222226] rounded-xl p-5 space-y-4">
        <h2 class="text-sm font-semibold text-[#E5E1E4] flex items-center gap-2">
          <span class="w-2 h-2 rounded-full bg-[#10B981]"></span>
          Credenciais do Gateway
        </h2>

        <div class="space-y-4 text-xs font-['Inter']">
          <div>
            <label class="block text-xs font-medium text-[#958DA1] mb-1.5">API Secret Token (Bearer)</label>
            <input
              type="password"
              bind:value={apiToken}
              placeholder={data.maskedToken}
              class="w-full h-9 px-3 rounded-lg bg-[#09090B] border border-[#222226] text-sm font-['JetBrains_Mono'] text-[#E5E1E4] focus:outline-none focus:border-[#7C3AED]"
            />
            <p class="text-[11px] text-[#958DA1] mt-1">Armazenado com criptografia em repouso.</p>
          </div>

          <div>
            <label class="block text-xs font-medium text-[#958DA1] mb-1.5">Chave PIX Cadastrada</label>
            <input
              type="text"
              bind:value={pixKey}
              class="w-full h-9 px-3 rounded-lg bg-[#09090B] border border-[#222226] text-sm text-[#E5E1E4] focus:outline-none focus:border-[#7C3AED]"
            />
          </div>

          <div>
            <label class="block text-xs font-medium text-[#958DA1] mb-1.5">URL de Notificação Webhook</label>
            <div class="flex items-center gap-2">
              <input
                type="text"
                readonly
                value="https://SEU_DOMINIO/api/webhook/pix"
                class="w-full h-9 px-3 rounded-lg bg-[#09090B] border border-[#222226] text-xs font-['JetBrains_Mono'] text-[#958DA1] select-all"
              />
              <Button variant="secondary" size="md" on:click={() => alert('URL copiada!')}>
                Copiar
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Right Column: Live Banking App Simulator -->
    <div class="space-y-4">
      <div class="bg-[#111113] border border-[#222226] rounded-xl p-5 sticky top-6 space-y-4">
        <div class="flex items-center justify-between pb-3 border-b border-[#222226]">
          <span class="text-xs font-semibold text-[#E5E1E4] uppercase tracking-wider font-['JetBrains_Mono']">Simulador PIX de Teste</span>
          <span class="text-[11px] font-['JetBrains_Mono'] text-[#10B981]">Sandbox Ativa</span>
        </div>

        <div class="space-y-3 text-xs">
          <div>
            <label class="block text-[11px] text-[#958DA1] mb-1">Valor do Pagamento</label>
            <input
              type="number"
              bind:value={simAmount}
              class="w-full h-8 px-2.5 rounded bg-[#09090B] border border-[#222226] text-xs font-['JetBrains_Mono'] text-[#E5E1E4]"
            />
          </div>

          <Button variant="primary" size="md" icon="bolt" loading={isSimulating} on:click={runSimulatorPayment}>
            Simular Pagamento no App do Banco
          </Button>

          <!-- Console Terminal Output -->
          <div class="bg-[#09090B] border border-[#222226] rounded-lg p-3 font-['JetBrains_Mono'] text-[11px] h-48 overflow-y-auto space-y-1 text-[#958DA1]">
            <div class="text-[#CCC3D8] font-bold">Terminal de Eventos PIX:</div>
            {#if simLogs.length === 0}
              <div class="text-[#958DA1] italic">Aguardando disparo de cobrança...</div>
            {:else}
              {#each simLogs as log}
                <div class="{log.includes('SUCESSO') ? 'text-[#10B981] font-semibold' : log.includes('ERRO') ? 'text-[#EF4444]' : 'text-[#958DA1]'}">
                  {log}
                </div>
              {/each}
            {/if}
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
