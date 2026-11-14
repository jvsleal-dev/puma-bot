<script lang="ts">
  import type { PageData } from './$types';
  import Button from '$lib/components/Button.svelte';

  export let data: PageData;

  let generatedLink = '';
  let isGenerating = false;
  let copied = false;

  function handleGenerateInvite() {
    isGenerating = true;
    setTimeout(() => {
      isGenerating = false;
      const rand = Math.random().toString(36).substring(2, 8);
      generatedLink = `https://t.me/+PumaVIP_singleuse_${rand}`;
    }, 400);
  }

  function copyLink() {
    if (!generatedLink) return;
    navigator.clipboard.writeText(generatedLink);
    copied = true;
    setTimeout(() => copied = false, 2500);
  }
</script>

<svelte:head>
  <title>Grupos VIP — Puma Bot SaaS</title>
</svelte:head>

<div class="p-8 max-w-7xl mx-auto space-y-6">
  <!-- Header -->
  <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
    <div>
      <h1 class="text-2xl font-bold font-['Geist'] text-[#E5E1E4]">Grupos & Canais VIP</h1>
      <p class="text-sm text-[#958DA1]">Gerencie canais e supergrupos do Telegram com controle automatizado de entradas e expulsões.</p>
    </div>
    <div class="flex items-center gap-2.5">
      <Button variant="secondary" icon="link" loading={isGenerating} on:click={handleGenerateInvite}>
        Gerar Link Descartável
      </Button>
      <a href="/robos" class="px-4 py-2 rounded-xl bg-[#7C3AED] hover:bg-[#6D28D9] text-xs font-semibold text-white transition-all flex items-center gap-2">
        <span class="material-symbols-outlined text-[16px]">add</span>
        Conectar Novo Grupo
      </a>
    </div>
  </div>

  {#if generatedLink}
    <div class="p-4 rounded-xl bg-[#7C3AED]/10 border border-[#7C3AED]/30 flex flex-col sm:flex-row items-center justify-between gap-3">
      <div class="space-y-1 text-center sm:text-left">
        <div class="text-xs font-semibold text-[#E5E1E4]">Link Descartável Gerado (1 Uso / Expira em 24h):</div>
        <div class="text-xs font-['JetBrains_Mono'] text-[#A78BFA] select-all break-all">{generatedLink}</div>
      </div>
      <button
        type="button"
        on:click={copyLink}
        class="px-4 py-2 rounded-lg bg-[#7C3AED] text-white text-xs font-medium hover:bg-[#6D28D9] transition-colors shrink-0"
      >
        {copied ? 'Copiado!' : 'Copiar Link'}
      </button>
    </div>
  {/if}

  <!-- Cards Grid dos Grupos Conectados -->
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
    {#each data.groups as group}
      <div class="p-5 rounded-2xl bg-[#111113] border border-[#222226] space-y-4 hover:border-[#353437] transition-all">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2.5">
            <div class="w-9 h-9 rounded-xl bg-[#7C3AED]/20 border border-[#7C3AED]/40 text-[#A78BFA] flex items-center justify-center font-bold">
              <span class="material-symbols-outlined text-[20px]">shield_person</span>
            </div>
            <div>
              <h3 class="text-sm font-semibold text-[#E5E1E4]">{group.name}</h3>
              <p class="text-[11px] text-[#958DA1]">via @{group.botUsername}</p>
            </div>
          </div>
          <span class="px-2 py-0.5 rounded text-[10px] font-['JetBrains_Mono'] {group.active ? 'bg-[#10B981]/15 text-[#10B981]' : 'bg-[#EF4444]/15 text-[#EF4444]'}">
            {group.active ? 'Ativo' : 'Inativo'}
          </span>
        </div>

        <div class="grid grid-cols-2 gap-3 pt-3 border-t border-[#1F1F24] text-xs font-['JetBrains_Mono']">
          <div>
            <div class="text-[10px] text-[#958DA1]">Membros VIP</div>
            <div class="text-base font-bold text-[#E5E1E4]">{group.activeMembersCount}</div>
          </div>
          <div>
            <div class="text-[10px] text-[#958DA1]">Vendas Totais</div>
            <div class="text-base font-bold text-[#10B981]">{group.totalSalesCount}</div>
          </div>
        </div>

        <div class="flex items-center justify-between pt-3 border-t border-[#1F1F24] text-[11px] text-[#958DA1]">
          <span>Chat ID: <code class="text-[#E5E1E4] font-['JetBrains_Mono']">{group.chatId}</code></span>
          <a href="/robos" class="text-[#A78BFA] hover:underline font-medium">Configurar</a>
        </div>
      </div>
    {/each}
  </div>

  <!-- Tabela de Membros Recentes com Assinatura Ativa -->
  <div class="p-5 rounded-2xl bg-[#111113] border border-[#222226] space-y-4">
    <div class="flex items-center justify-between pb-3 border-b border-[#222226]">
      <h3 class="text-sm font-semibold text-[#E5E1E4] font-['Geist']">Últimos Acessos Concedidos no Telegram</h3>
      <span class="text-xs font-['JetBrains_Mono'] text-[#958DA1]">{data.recentMembers.length} registros ativos</span>
    </div>

    {#if data.recentMembers.length === 0}
      <div class="py-8 text-center text-xs text-[#958DA1]">
        Nenhum membro VIP ativo no momento. As assinaturas liberadas via PIX aparecerão aqui dinamicamente.
      </div>
    {:else}
      <div class="overflow-x-auto">
        <table class="w-full text-left text-xs font-['Inter']">
          <thead class="text-[11px] text-[#958DA1] uppercase font-['JetBrains_Mono'] border-b border-[#222226]">
            <tr>
              <th class="pb-2.5">Membro</th>
              <th class="pb-2.5">Robô / Canal</th>
              <th class="pb-2.5">Plano</th>
              <th class="pb-2.5">Expiração</th>
              <th class="pb-2.5 text-right">Status</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-[#1F1F24]">
            {#each data.recentMembers as member}
              <tr class="hover:bg-[#18181C]/50 transition-colors">
                <td class="py-3 font-medium text-[#E5E1E4]">
                  <div>{member.name}</div>
                  <div class="text-[10px] text-[#958DA1] font-['JetBrains_Mono']">ID: {member.telegramUserId}</div>
                </td>
                <td class="py-3 text-[#958DA1]">{member.botName}</td>
                <td class="py-3 text-[#E5E1E4]">{member.planName}</td>
                <td class="py-3 text-[#958DA1] font-['JetBrains_Mono']">
                  {new Date(member.expiresAt).toLocaleDateString('pt-BR')}
                </td>
                <td class="py-3 text-right">
                  <span class="px-2 py-0.5 rounded-full text-[10px] font-['JetBrains_Mono'] bg-[#10B981]/15 text-[#10B981] font-medium">
                    Ativo
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
