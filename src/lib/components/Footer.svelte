<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();

  let newsletterEmail = '';
  let newsletterSuccess = false;
  let newsletterLoading = false;

  // Modais de Termos e Privacidade
  let isTermsModalOpen = false;
  let isPrivacyModalOpen = false;

  function handleSubscribeNewsletter() {
    if (!newsletterEmail || !newsletterEmail.includes('@')) return;
    newsletterLoading = true;
    setTimeout(() => {
      newsletterLoading = false;
      newsletterSuccess = true;
      setTimeout(() => {
        newsletterSuccess = false;
        newsletterEmail = '';
      }, 4000);
    }, 600);
  }

  function openDemo() {
    dispatch('openDemo');
  }
</script>

<footer class="w-full bg-[#08080A] border-t border-[#1F1F24] text-[#958DA1] font-['Inter'] relative overflow-hidden">
  <!-- Subtle Gradient Ambient Accent -->
  <div class="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[1px] bg-gradient-to-r from-transparent via-[#7C3AED]/40 to-transparent pointer-events-none"></div>

  <!-- 1. Top Call-to-Action Bar (Pré-Footer) -->
  <div class="border-b border-[#18181C]">
    <div class="max-w-7xl mx-auto px-4 md:px-8 py-10 flex flex-col lg:flex-row items-center justify-between gap-6">
      <div class="text-center lg:text-left space-y-1.5">
        <div class="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-[#7C3AED]/10 border border-[#7C3AED]/30 text-[#A78BFA] text-[11px] font-['JetBrains_Mono'] font-medium">
          <span class="w-1.5 h-1.5 rounded-full bg-[#7C3AED] animate-pulse"></span>
          INFRAESTRUTURA SAAS V2.4
        </div>
        <h3 class="text-xl md:text-2xl font-bold font-['Geist'] text-[#E5E1E4]">
          Pronto para automatizar 100% das suas vendas no Telegram?
        </h3>
        <p class="text-xs text-[#958DA1] max-w-xl">
          Conecte sua conta em menos de 2 minutos. Sem taxas de setup, sem mensalidade nos primeiros 14 dias.
        </p>
      </div>

      <div class="flex flex-wrap items-center justify-center gap-3 w-full lg:w-auto">
        <button
          type="button"
          on:click={openDemo}
          class="px-5 py-2.5 rounded-xl bg-[#141417] hover:bg-[#1E1E23] border border-[#27272E] text-xs font-semibold text-[#E5E1E4] transition-all flex items-center gap-2 active:scale-[0.98]"
        >
          <span class="material-symbols-outlined text-[18px] text-[#A78BFA]">play_circle</span>
          Testar Simulador
        </button>
        <a
          href="/cadastro"
          class="px-6 py-2.5 rounded-xl bg-[#7C3AED] hover:bg-[#6D28D9] text-xs font-semibold text-white shadow-lg shadow-[#7C3AED]/20 transition-all flex items-center gap-2 active:scale-[0.98]"
        >
          Criar Conta Gratuita
          <span class="material-symbols-outlined text-[16px]">arrow_forward</span>
        </a>
      </div>
    </div>
  </div>

  <!-- 2. Main Footer Grid: 5 Colunas Arquitetadas -->
  <div class="max-w-7xl mx-auto px-4 md:px-8 py-16">
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8">
      
      <!-- Coluna 1: Marca, Missão e Uptime Live Widget -->
      <div class="lg:col-span-1 space-y-5">
        <a href="/" class="inline-flex items-center gap-2.5 group">
          <div class="w-8 h-8 rounded-xl bg-[#18181D] border border-[#2B2B32] p-1 flex items-center justify-center group-hover:border-[#7C3AED]/60 transition-colors">
            <img
              alt="Logo Puma Bot"
              class="w-full h-full object-contain"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuApMe26OJRCrk9Da2M1tSH_NEUFMosNGCHptrVStnQTT55QwOPWNedO8DlKHnkENQNTYaHA5yGQHwwJ2qPI9plY7o8sGn1GddyD243xTxVM-TYELVX2Vw4tFG8FPaAZ4_CFN7kwbQMwmZcTkeAJ_9wrKIiGmsnkDvQR1rkfdEAct7cEpMaTdS0vjEzkGsdSYLOgVt4dbRODh-IzRsoK9QUC5AWbbdIjOOf-uZVEy7vFZL09aW0VWvjDlQ"
            />
          </div>
          <div class="flex flex-col">
            <span class="text-base font-bold font-['Geist'] text-[#E5E1E4] tracking-tight group-hover:text-white transition-colors">Puma Bot</span>
            <span class="text-[9px] uppercase font-['JetBrains_Mono'] text-[#7C3AED] tracking-wider font-semibold">Gateway & Bot SaaS</span>
          </div>
        </a>

        <p class="text-xs text-[#958DA1] leading-relaxed">
          Infraestrutura de alta disponibilidade para monetização de canais e grupos VIP no Telegram. Liquidação instantânea via PIX sem retenção de saldo.
        </p>

        <!-- Live Status Widget -->
        <div class="p-3 rounded-xl bg-[#0F0F12] border border-[#202026] space-y-2">
          <div class="flex items-center justify-between text-[11px] font-['JetBrains_Mono']">
            <span class="flex items-center gap-2 text-[#10B981] font-semibold">
              <span class="w-2 h-2 rounded-full bg-[#10B981] animate-ping"></span>
              Operacional
            </span>
            <span class="text-[#958DA1]">99.98% SLA</span>
          </div>
          <div class="flex items-center justify-between text-[10px] text-[#6E6778] font-['JetBrains_Mono'] pt-1.5 border-t border-[#1C1C22]">
            <span>Latência PIX</span>
            <span class="text-[#E5E1E4]">32ms</span>
          </div>
        </div>

        <!-- Badges Técnicos -->
        <div class="flex flex-wrap gap-1.5 text-[10px] font-['JetBrains_Mono'] text-[#857D91]">
          <span class="px-2 py-0.5 rounded bg-[#131317] border border-[#222228]">Zero Custódia</span>
          <span class="px-2 py-0.5 rounded bg-[#131317] border border-[#222228]">BACEN Res. 1</span>
          <span class="px-2 py-0.5 rounded bg-[#131317] border border-[#222228]">AES-256</span>
        </div>
      </div>

      <!-- Coluna 2: Produto & Recursos -->
      <div class="space-y-3.5">
        <h4 class="text-xs font-semibold uppercase tracking-wider text-[#E5E1E4] font-['JetBrains_Mono']">
          Produto
        </h4>
        <ul class="space-y-2.5 text-xs">
          <li>
            <a href="/robos" class="hover:text-[#E5E1E4] transition-colors flex items-center justify-between group">
              <span>Gestão de Robôs</span>
              <span class="text-[10px] font-['JetBrains_Mono'] text-[#7C3AED] opacity-0 group-hover:opacity-100 transition-opacity">v2.4</span>
            </a>
          </li>
          <li>
            <a href="/fluxos" class="hover:text-[#E5E1E4] transition-colors">Funis e Remarketing</a>
          </li>
          <li>
            <a href="/grupos" class="hover:text-[#E5E1E4] transition-colors">Grupos & Canais VIP</a>
          </li>
          <li>
            <a href="/#taxas" class="hover:text-[#E5E1E4] transition-colors">Calculadora de Lucro</a>
          </li>
          <li>
            <button type="button" on:click={openDemo} class="hover:text-[#E5E1E4] transition-colors text-left flex items-center gap-1.5">
              <span>Simulador Interativo</span>
              <span class="text-[9px] px-1 py-0.2 rounded bg-[#7C3AED]/20 text-[#A78BFA] font-['JetBrains_Mono']">Demo</span>
            </button>
          </li>
          <li>
            <a href="/#recursos" class="hover:text-[#E5E1E4] transition-colors">Links de Uso Único</a>
          </li>
          <li>
            <a href="/#recursos" class="hover:text-[#E5E1E4] transition-colors">Expulsão de Inadimplentes</a>
          </li>
          <li>
            <a href="/financeiro" class="hover:text-[#E5E1E4] transition-colors">Extrato Financeiro</a>
          </li>
          <li>
            <a href="/dashboard" class="hover:text-[#E5E1E4] transition-colors">Dashboard em Tempo Real</a>
          </li>
        </ul>
      </div>

      <!-- Coluna 3: Gateways & Liquidação -->
      <div class="space-y-3.5">
        <h4 class="text-xs font-semibold uppercase tracking-wider text-[#E5E1E4] font-['JetBrains_Mono']">
          Gateways PIX
        </h4>
        <ul class="space-y-2.5 text-xs">
          <li>
            <a href="/gateways" class="hover:text-[#E5E1E4] transition-colors flex items-center gap-1.5">
              <span>PushinPay</span>
              <span class="text-[9px] px-1 rounded bg-[#10B981]/15 text-[#10B981] font-['JetBrains_Mono']">&lt;50ms</span>
            </a>
          </li>
          <li>
            <a href="/gateways" class="hover:text-[#E5E1E4] transition-colors">Efí Bank (BACEN Pix)</a>
          </li>
          <li>
            <a href="/gateways" class="hover:text-[#E5E1E4] transition-colors">Asaas API v3</a>
          </li>
          <li>
            <a href="/gateways" class="hover:text-[#E5E1E4] transition-colors">Mercado Pago IPN</a>
          </li>
          <li>
            <a href="/gateways" class="hover:text-[#E5E1E4] transition-colors">OpenPIX / Woovi</a>
          </li>
          <li>
            <a href="/gateways" class="hover:text-[#E5E1E4] transition-colors flex items-center gap-1">
              <span>Configuração de Chaves</span>
              <span class="material-symbols-outlined text-[13px] text-[#A78BFA]">settings</span>
            </a>
          </li>
          <li>
            <a href="/gateways" class="hover:text-[#E5E1E4] transition-colors">Sandbox de Liquidação</a>
          </li>
        </ul>
      </div>

      <!-- Coluna 4: Desenvolvedores & API -->
      <div class="space-y-3.5">
        <h4 class="text-xs font-semibold uppercase tracking-wider text-[#E5E1E4] font-['JetBrains_Mono']">
          Desenvolvedores
        </h4>
        <ul class="space-y-2.5 text-xs">
          <li>
            <a href="/#documentacao" class="hover:text-[#E5E1E4] transition-colors font-['JetBrains_Mono'] text-[11px] text-[#A78BFA] flex items-center justify-between">
              <span>POST /api/webhook/pix</span>
              <span class="text-[9px] text-[#10B981]">BACEN</span>
            </a>
          </li>
          <li>
            <a href="/#documentacao" class="hover:text-[#E5E1E4] transition-colors font-['JetBrains_Mono'] text-[11px] text-[#A78BFA] flex items-center justify-between">
              <span>POST /api/webhook/telegram</span>
              <span class="text-[9px] text-[#10B981]">Bot API</span>
            </a>
          </li>
          <li>
            <a href="/#documentacao" class="hover:text-[#E5E1E4] transition-colors font-['JetBrains_Mono'] text-[11px] text-[#958DA1] flex items-center justify-between">
              <span>GET /api/cron/check-expired</span>
              <span class="text-[9px] text-[#38BDF8]">5min</span>
            </a>
          </li>
          <li>
            <a href="https://github.com/jvsleal-dev/puma-bot" target="_blank" rel="noopener noreferrer" class="hover:text-[#E5E1E4] transition-colors flex items-center gap-1.5">
              <span>Repositório GitHub</span>
              <span class="material-symbols-outlined text-[13px]">open_in_new</span>
            </a>
          </li>
          <li>
            <a href="/admin" class="hover:text-[#E5E1E4] transition-colors flex items-center gap-1.5 text-[#E5E1E4] font-medium">
              <span>Console Super Admin</span>
              <span class="text-[9px] px-1 rounded bg-[#EF4444]/15 text-[#EF4444] font-['JetBrains_Mono']">Admin</span>
            </a>
          </li>
          <li>
            <a href="/#seguranca" class="hover:text-[#E5E1E4] transition-colors">Assinatura HMAC & Segurança</a>
          </li>
        </ul>
      </div>

      <!-- Coluna 5: Institucional & Atualizações -->
      <div class="space-y-3.5">
        <h4 class="text-xs font-semibold uppercase tracking-wider text-[#E5E1E4] font-['JetBrains_Mono']">
          Institucional & Avisos
        </h4>
        <ul class="space-y-2.5 text-xs">
          <li>
            <a href="/#faq" class="hover:text-[#E5E1E4] transition-colors">Perguntas Frequentes</a>
          </li>
          <li>
            <button type="button" on:click={() => isTermsModalOpen = true} class="hover:text-[#E5E1E4] transition-colors text-left">
              Termos de Serviço
            </button>
          </li>
          <li>
            <button type="button" on:click={() => isPrivacyModalOpen = true} class="hover:text-[#E5E1E4] transition-colors text-left">
              Políticas de Privacidade (LGPD)
            </button>
          </li>
          <li>
            <a href="https://t.me/PumaBotSuporte" target="_blank" rel="noopener noreferrer" class="hover:text-[#E5E1E4] transition-colors flex items-center gap-1">
              <span>Suporte Oficial Telegram</span>
              <span class="material-symbols-outlined text-[13px] text-[#0088CC]">send</span>
            </a>
          </li>
        </ul>

        <!-- Newsletter Bar -->
        <div class="pt-3 border-t border-[#1C1C22] space-y-2">
          <span class="text-[11px] text-[#E5E1E4] font-medium block">Avisos de Releases da API</span>
          <form on:submit|preventDefault={handleSubscribeNewsletter} class="flex items-center gap-1.5">
            <input
              type="email"
              bind:value={newsletterEmail}
              placeholder="seu@email.com"
              class="w-full h-8 px-2.5 text-[11px] rounded-lg bg-[#141417] border border-[#27272E] text-[#E5E1E4] placeholder-[#6E6778] focus:outline-none focus:border-[#7C3AED]"
            />
            <button
              type="submit"
              disabled={newsletterLoading}
              class="h-8 px-3 rounded-lg bg-[#27272E] hover:bg-[#32323B] text-white text-[11px] font-medium transition-colors shrink-0"
            >
              {newsletterLoading ? '...' : 'OK'}
            </button>
          </form>
          {#if newsletterSuccess}
            <p class="text-[10px] text-[#10B981] font-['JetBrains_Mono']">Inscrição confirmada com sucesso.</p>
          {/if}
        </div>
      </div>

    </div>
  </div>

  <!-- 3. Bottom Bar: Compliance, Copyright e Redes -->
  <div class="border-t border-[#18181C] bg-[#060608]">
    <div class="max-w-7xl mx-auto px-4 md:px-8 py-8 flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-[#716A7B]">
      
      <!-- Informações Legais e Isenção Regulatória -->
      <div class="text-center md:text-left space-y-1.5 max-w-2xl">
        <p class="text-[11px] text-[#8C8497] font-normal leading-relaxed">
          © 2026 Puma Bot Tecnologia e Automação de Mensageria Ltda. Todos os direitos reservados.
        </p>
        <p class="text-[10px] text-[#635C6D] leading-relaxed">
          O Puma Bot atua exclusivamente como provedor de software SaaS e infraestrutura de integração via Telegram Bot API. As cobranças e liquidações PIX são processadas diretamente na conta bancária do titular pelos participantes autorizados do Sistema de Pagamentos Brasileiro (BACEN). Não realizamos retenção ou custódia de fundos.
        </p>
      </div>

      <!-- Links Técnicos & Redes -->
      <div class="flex flex-col sm:flex-row items-center gap-4 shrink-0">
        <div class="flex items-center gap-3">
          <a
            href="https://github.com/jvsleal-dev/puma-bot"
            target="_blank"
            rel="noopener noreferrer"
            title="GitHub"
            class="w-8 h-8 rounded-lg bg-[#141417] hover:bg-[#1E1E23] border border-[#27272E] text-[#958DA1] hover:text-white flex items-center justify-center transition-colors"
          >
            <span class="material-symbols-outlined text-[17px]">code</span>
          </a>
          <a
            href="https://t.me/PumaBotSuporte"
            target="_blank"
            rel="noopener noreferrer"
            title="Canal Telegram"
            class="w-8 h-8 rounded-lg bg-[#141417] hover:bg-[#1E1E23] border border-[#27272E] text-[#958DA1] hover:text-[#0088CC] flex items-center justify-center transition-colors"
          >
            <span class="material-symbols-outlined text-[17px]">send</span>
          </a>
          <a
            href="/admin"
            title="Super Admin"
            class="w-8 h-8 rounded-lg bg-[#141417] hover:bg-[#1E1E23] border border-[#27272E] text-[#958DA1] hover:text-[#A78BFA] flex items-center justify-center transition-colors"
          >
            <span class="material-symbols-outlined text-[17px]">admin_panel_settings</span>
          </a>
        </div>

        <div class="text-[11px] font-['JetBrains_Mono'] text-[#635C6D] px-2.5 py-1 rounded-md bg-[#101013] border border-[#1E1E24]">
          BR (PT-BR) • BRL (R$)
        </div>
      </div>

    </div>
  </div>
</footer>

<!-- Modal: Termos de Serviço -->
{#if isTermsModalOpen}
  <div
    class="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
    role="dialog"
    aria-modal="true"
    tabindex="-1"
    on:click|self={() => isTermsModalOpen = false}
    on:keydown={(e) => e.key === 'Escape' && (isTermsModalOpen = false)}
  >
    <div class="relative w-full max-w-2xl bg-[#111113] border border-[#222226] rounded-2xl shadow-2xl p-6 max-h-[85vh] overflow-y-auto space-y-4 font-['Inter'] text-xs text-[#958DA1]">
      <div class="flex items-center justify-between pb-3 border-b border-[#222226]">
        <h3 class="font-['Geist'] text-base font-bold text-[#E5E1E4]">Termos de Serviço — Puma Bot SaaS</h3>
        <button
          type="button"
          on:click={() => isTermsModalOpen = false}
          class="w-7 h-7 rounded-lg bg-[#1A1A1E] text-[#958DA1] hover:text-white flex items-center justify-center"
        >
          <span class="material-symbols-outlined text-[16px]">close</span>
        </button>
      </div>

      <div class="space-y-3 leading-relaxed">
        <h4 class="font-bold text-[#E5E1E4]">1. Objeto do Software</h4>
        <p>O Puma Bot disponibiliza uma plataforma de software como serviço (SaaS) voltada à automação de vendas, geração dinâmica de cobranças PIX e gestão automatizada de participantes em canais e grupos na rede Telegram.</p>

        <h4 class="font-bold text-[#E5E1E4]">2. Sem Custódia Financeira</h4>
        <p>O Puma Bot não atua como instituição bancária ou financeira. O processamento de pagamentos ocorre diretamente entre a conta do contratante e o respectivo gateway bancário credenciado (PushinPay, Efí Bank, Asaas, Mercado Pago), sem intermediação ou retenção de liquidez por parte do Puma Bot.</p>

        <h4 class="font-bold text-[#E5E1E4]">3. Uso Aceitável e Políticas do Telegram</h4>
        <p>O contratante é o único responsável pelos conteúdos compartilhados em seus grupos e canais, devendo observar integralmente as diretrizes do Telegram e a legislação brasileira aplicável.</p>

        <h4 class="font-bold text-[#E5E1E4]">4. Disponibilidade (SLA)</h4>
        <p>Empregamos arquitetura distribuída com redundância contínua para garantir taxa de disponibilidade média de 99.98% dos webhooks e rotas de integração.</p>
      </div>

      <div class="pt-3 border-t border-[#222226] flex justify-end">
        <button
          type="button"
          on:click={() => isTermsModalOpen = false}
          class="px-4 py-2 rounded-lg bg-[#7C3AED] text-white font-medium text-xs hover:bg-[#6D28D9] transition-colors"
        >
          Entendido e Aceito
        </button>
      </div>
    </div>
  </div>
{/if}

<!-- Modal: Políticas de Privacidade & LGPD -->
{#if isPrivacyModalOpen}
  <div
    class="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
    role="dialog"
    aria-modal="true"
    tabindex="-1"
    on:click|self={() => isPrivacyModalOpen = false}
    on:keydown={(e) => e.key === 'Escape' && (isPrivacyModalOpen = false)}
  >
    <div class="relative w-full max-w-2xl bg-[#111113] border border-[#222226] rounded-2xl shadow-2xl p-6 max-h-[85vh] overflow-y-auto space-y-4 font-['Inter'] text-xs text-[#958DA1]">
      <div class="flex items-center justify-between pb-3 border-b border-[#222226]">
        <h3 class="font-['Geist'] text-base font-bold text-[#E5E1E4]">Política de Privacidade & LGPD — Puma Bot SaaS</h3>
        <button
          type="button"
          on:click={() => isPrivacyModalOpen = false}
          class="w-7 h-7 rounded-lg bg-[#1A1A1E] text-[#958DA1] hover:text-white flex items-center justify-center"
        >
          <span class="material-symbols-outlined text-[16px]">close</span>
        </button>
      </div>

      <div class="space-y-3 leading-relaxed">
        <h4 class="font-bold text-[#E5E1E4]">1. Tratamento de Dados (Lei 13.709/2018)</h4>
        <p>O Puma Bot coleta exclusivamente os dados estritamente indispensáveis para o funcionamento do serviço: endereço de e-mail, credenciais cifradas (PBKDF2) e identificadores públicos de usuários do Telegram (ID e @username) para concessão e revogação de acessos VIP.</p>

        <h4 class="font-bold text-[#E5E1E4]">2. Criptografia em Repouso e Trânsito</h4>
        <p>Todas as comunicações com webhooks, bancos de dados e APIs do Telegram são protegidas por protocolos TLS 1.3 com chaves simétricas AES-256 e hashes SHA-512.</p>

        <h4 class="font-bold text-[#E5E1E4]">3. Compartilhamento de Dados</h4>
        <p>Em nenhuma hipótese vendemos ou transferimos informações de usuários ou clientes a terceiros. As transmissões de dados ocorrem apenas para liquidação junto aos gateways bancários autorizados pelo contratante.</p>

        <h4 class="font-bold text-[#E5E1E4]">4. Direitos do Titular</h4>
        <p>O titular tem pleno direito de solicitar a exportação, anonimização ou exclusão definitiva de seus registros através do painel de administração ou do canal de suporte.</p>
      </div>

      <div class="pt-3 border-t border-[#222226] flex justify-end">
        <button
          type="button"
          on:click={() => isPrivacyModalOpen = false}
          class="px-4 py-2 rounded-lg bg-[#7C3AED] text-white font-medium text-xs hover:bg-[#6D28D9] transition-colors"
        >
          Fechar
        </button>
      </div>
    </div>
  </div>
{/if}
