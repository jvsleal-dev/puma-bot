<script lang="ts">
  import type { PageData } from './$types';
  import Button from '$lib/components/Button.svelte';
  import Modal from '$lib/components/Modal.svelte';

  export let data: PageData;

  let isModalOpen = false;
  let botName = '';
  let botUsername = '';
  let botToken = '';
  let vipChatId = '';
  let isSubmitting = false;
  let alertMessage = '';
  let alertSuccess = false;

  async function handleConnectBot() {
    if (!botName.trim() || !botToken.trim()) {
      alertMessage = 'Nome do robô e Bot Token são obrigatórios.';
      alertSuccess = false;
      return;
    }

    isSubmitting = true;
    alertMessage = '';

    try {
      const res = await fetch('/api/bots', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: botName,
          username: botUsername,
          botToken,
          vipChatId
        })
      });

      const json = await res.json();
      if (json.success) {
        alertSuccess = true;
        alertMessage = 'Robô conectado com sucesso e webhook ativado!';
        setTimeout(() => {
          isModalOpen = false;
          window.location.reload();
        }, 1200);
      } else {
        alertSuccess = false;
        alertMessage = json.error || 'Falha ao conectar robô';
      }
    } catch (e) {
      alertSuccess = false;
      alertMessage = 'Erro na comunicação com o servidor.';
    } finally {
      isSubmitting = false;
    }
  }
</script>

<div class="p-8 max-w-7xl mx-auto space-y-6">
  <!-- Header -->
  <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
    <div>
      <h1 class="text-2xl font-bold font-['Geist'] text-[#E5E1E4]">Meus Robôs Telegram</h1>
      <p class="text-sm text-[#958DA1]">Gerencie instâncias conectadas, webhooks e grupos VIP sincronizados.</p>
    </div>
    <Button variant="primary" icon="add" on:click={() => { isModalOpen = true; alertMessage = ''; }}>
      Conectar Novo Robô
    </Button>
  </div>

  <!-- Bots Grid -->
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
    {#each data.bots as bot (bot.id)}
      <div class="bg-[#111113] border border-[#222226] hover:border-[#353437] transition-all rounded-xl p-5 flex flex-col justify-between shadow-sm relative overflow-hidden group">
        <div>
          <!-- Status pill -->
          <div class="flex items-center justify-between mb-4">
            <div class="flex items-center gap-2">
              <div class="w-8 h-8 rounded-lg bg-[#7C3AED]/20 border border-[#7C3AED]/30 flex items-center justify-center text-[#7C3AED]">
                <span class="material-symbols-outlined text-[18px]">smart_toy</span>
              </div>
              <div>
                <h3 class="font-semibold text-[15px] text-[#E5E1E4]">{bot.name}</h3>
                <span class="text-[11px] font-['JetBrains_Mono'] text-[#958DA1]">@{bot.username}</span>
              </div>
            </div>
            <span class="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-['JetBrains_Mono'] bg-[#10B981]/10 text-[#10B981] border border-[#10B981]/25">
              <span class="w-1.5 h-1.5 rounded-full bg-[#10B981]"></span>
              ONLINE
            </span>
          </div>

          <!-- Technical Specs -->
          <div class="space-y-2 py-3 border-y border-[#222226] text-xs font-['Inter']">
            <div class="flex justify-between">
              <span class="text-[#958DA1]">Grupo VIP:</span>
              <span class="font-['JetBrains_Mono'] text-[#E5E1E4]">{bot.vipChatId}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-[#958DA1]">Token:</span>
              <span class="font-['JetBrains_Mono'] text-[#958DA1]">{bot.maskedToken}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-[#958DA1]">Latência Webhook:</span>
              <span class="font-['JetBrains_Mono'] text-[#10B981]">18ms</span>
            </div>
          </div>
        </div>

        <div class="pt-4 flex items-center justify-between">
          <div class="flex items-center gap-3 text-xs text-[#958DA1]">
            <span><strong>{bot.salesCount || 0}</strong> vendas</span>
            <span>•</span>
            <span><strong>{bot.vipCount || 0}</strong> membros VIP</span>
          </div>
          <Button variant="secondary" size="sm" icon="tune" on:click={() => window.location.href = '/fluxos'}>
            Funil
          </Button>
        </div>
      </div>
    {/each}
  </div>
</div>

<!-- Modal Conectar Robô -->
<Modal open={isModalOpen} title="Conectar Novo Robô Telegram" on:close={() => isModalOpen = false}>
  {#if alertMessage}
    <div class="p-3 rounded-lg text-xs font-medium border {alertSuccess ? 'bg-[#10B981]/10 text-[#10B981] border-[#10B981]/30' : 'bg-[#EF4444]/10 text-[#EF4444] border-[#EF4444]/30'}">
      {alertMessage}
    </div>
  {/if}

  <div class="space-y-4">
    <div>
      <label class="block text-xs font-medium text-[#958DA1] mb-1.5">Nome de Identificação</label>
      <input
        type="text"
        bind:value={botName}
        placeholder="Ex: Puma VIP Trader Sinais"
        class="w-full h-9 px-3 rounded-lg bg-[#09090B] border border-[#222226] text-sm text-[#E5E1E4] focus:outline-none focus:border-[#7C3AED]"
      />
    </div>

    <div>
      <label class="block text-xs font-medium text-[#958DA1] mb-1.5">@Username do Bot (opcional)</label>
      <input
        type="text"
        bind:value={botUsername}
        placeholder="Ex: pumavip_bot"
        class="w-full h-9 px-3 rounded-lg bg-[#09090B] border border-[#222226] text-sm text-[#E5E1E4] focus:outline-none focus:border-[#7C3AED]"
      />
    </div>

    <div>
      <label class="block text-xs font-medium text-[#958DA1] mb-1.5">Bot Token (obtido via @BotFather)</label>
      <input
        type="password"
        bind:value={botToken}
        placeholder="123456789:ABCDefghIJKlmnoPQRstuvwxyZ"
        class="w-full h-9 px-3 rounded-lg bg-[#09090B] border border-[#222226] text-sm text-[#E5E1E4] font-['JetBrains_Mono'] focus:outline-none focus:border-[#7C3AED]"
      />
      <p class="text-[11px] text-[#958DA1] mt-1">O token é encriptado antes do armazenamento.</p>
    </div>

    <div>
      <label class="block text-xs font-medium text-[#958DA1] mb-1.5">ID do Canal ou Grupo VIP</label>
      <input
        type="text"
        bind:value={vipChatId}
        placeholder="Ex: -1001829482910"
        class="w-full h-9 px-3 rounded-lg bg-[#09090B] border border-[#222226] text-sm text-[#E5E1E4] font-['JetBrains_Mono'] focus:outline-none focus:border-[#7C3AED]"
      />
      <p class="text-[11px] text-[#958DA1] mt-1">Certifique-se de adicionar o robô como Administrador com permissão de convite.</p>
    </div>
  </div>

  <svelte:fragment slot="footer">
    <Button variant="ghost" size="md" on:click={() => isModalOpen = false}>Cancelar</Button>
    <Button variant="primary" size="md" icon="bolt" loading={isSubmitting} on:click={handleConnectBot}>
      Validar & Ativar Webhook
    </Button>
  </svelte:fragment>
</Modal>

