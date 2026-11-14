<script lang="ts">
  let email = '';
  let password = '';
  let showPassword = false;
  let loading = false;
  let errorMessage = '';

  let isRecoveryOpen = false;
  let recoveryEmail = '';
  let recoverySent = false;
  let isTermsOpen = false;
  let isPrivacyOpen = false;

  function handleRecovery() {
    if (!recoveryEmail || !recoveryEmail.includes('@')) return;
    recoverySent = true;
    setTimeout(() => {
      recoverySent = false;
      isRecoveryOpen = false;
      recoveryEmail = '';
    }, 3000);
  }

  async function handleLogin() {
    if (!email || !password) {
      errorMessage = 'Informe o e-mail e a senha de operador.';
      return;
    }

    loading = true;
    errorMessage = '';

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        localStorage.setItem('puma_token', data.token);
        localStorage.setItem('puma_user', JSON.stringify(data.user));
        window.location.href = '/dashboard';
      } else {
        errorMessage = data.error || 'Credenciais inválidas. Verifique seu e-mail e senha.';
      }
    } catch (e) {
      errorMessage = 'Falha de comunicação com o servidor de autenticação.';
    } finally {
      loading = false;
    }
  }
</script>

<svelte:head>
  <title>Puma Bot — Login de Operadores</title>
</svelte:head>

<!-- Full-viewport zero-scroll container -->
<div class="h-screen w-screen overflow-hidden flex flex-col justify-between bg-[#09090B] text-[#E5E1E4] select-none font-['Inter',sans-serif]">

  <!-- Top Minimal Header (h-14) -->
  <header class="h-14 shrink-0 px-6 md:px-12 border-b border-[#222226] bg-[#0C0C0E]/90 flex items-center justify-between">
    <a href="/" class="flex items-center gap-2.5">
      <div class="w-7 h-7 rounded-lg bg-[#7C3AED] flex items-center justify-center text-white shadow-[0_0_12px_rgba(124,58,237,0.4)]">
        <span class="material-symbols-outlined text-[18px]">bolt</span>
      </div>
      <span class="font-['Geist'] font-bold text-base tracking-tight text-white">PUMA<span class="text-[#7C3AED]">BOT</span></span>
      <span class="px-1.5 py-0.5 rounded text-[10px] font-['JetBrains_Mono'] bg-[#201F22] text-[#CCC3D8] border border-[#353437]">v2.4 PRO</span>
    </a>

    <div class="flex items-center gap-4 text-xs font-['Inter']">
      <div class="hidden sm:flex items-center gap-1.5 text-[11px] font-['JetBrains_Mono'] text-[#10B981] bg-[#10B981]/10 px-2 py-0.5 rounded border border-[#10B981]/25">
        <span class="w-1.5 h-1.5 rounded-full bg-[#10B981] shadow-[0_0_6px_#10B981]"></span>
        <span>CLUSTER SÃO PAULO • 18ms</span>
      </div>
      <a href="/" class="text-[#958DA1] hover:text-white transition-colors flex items-center gap-1">
        <span class="material-symbols-outlined text-[15px]">arrow_back</span>
        <span>Início</span>
      </a>
    </div>
  </header>

  <!-- Center Split Canvas (flex-1 overflow-hidden) -->
  <main class="flex-1 w-full max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center overflow-hidden">
    
    <!-- Left Column: Value Proposition & Live Telemetry -->
    <div class="hidden lg:flex lg:col-span-6 flex-col justify-center space-y-5">
      <div class="space-y-2">
        <span class="inline-flex items-center gap-1.5 text-[11px] font-['JetBrains_Mono'] uppercase tracking-wider text-[#7C3AED] bg-[#7C3AED]/10 px-2.5 py-1 rounded-full border border-[#7C3AED]/30">
          Automação de Checkout PIX no Telegram
        </span>
        <h1 class="font-['Geist'] text-3xl xl:text-4xl font-bold tracking-tight text-white leading-tight">
          A infraestrutura mais rápida para vendas VIP automatizadas.
        </h1>
        <p class="text-sm text-[#958DA1] leading-relaxed">
          Sem mensalidades ou taxas predatórias. Pague estritamente R$ 0,50 por transação aprovada com entrega imediata de convite único.
        </p>
      </div>

      <!-- Telemetry Strip Compact Cards -->
      <div class="grid grid-cols-2 gap-3 pt-1">
        <div class="p-3.5 rounded-xl bg-[#111113] border border-[#222226]">
          <div class="flex items-center justify-between text-[#958DA1] text-xs mb-1">
            <span>Taxa por PIX</span>
            <span class="material-symbols-outlined text-[16px] text-[#10B981]">check_circle</span>
          </div>
          <div class="text-xl font-bold font-['JetBrains_Mono'] text-white">R$ 0,50</div>
          <div class="text-[11px] text-[#10B981] mt-0.5 font-medium">+91% de margem líquida</div>
        </div>

        <div class="p-3.5 rounded-xl bg-[#111113] border border-[#222226]">
          <div class="flex items-center justify-between text-[#958DA1] text-xs mb-1">
            <span>Latência Webhook</span>
            <span class="material-symbols-outlined text-[16px] text-[#7C3AED]">bolt</span>
          </div>
          <div class="text-xl font-bold font-['JetBrains_Mono'] text-white">&lt;18ms</div>
          <div class="text-[11px] text-[#958DA1] mt-0.5">Failover em tempo real</div>
        </div>
      </div>

      <!-- Security Trust Line -->
      <div class="flex items-center gap-4 text-xs font-['JetBrains_Mono'] text-[#958DA1] pt-1">
        <span class="flex items-center gap-1.5">
          <span class="material-symbols-outlined text-[15px] text-[#10B981]">verified_user</span>
          mTLS v1.3 Criptografado
        </span>
        <span class="flex items-center gap-1.5">
          <span class="material-symbols-outlined text-[15px] text-[#7C3AED]">shield</span>
          Homologado Banco Central
        </span>
      </div>
    </div>

    <!-- Right Column: Focused Compact Login Form -->
    <div class="col-span-12 lg:col-span-6 w-full flex justify-center">
      <div class="w-full max-w-[420px] bg-[#111113] border border-[#222226] rounded-2xl p-6 sm:p-7 shadow-2xl relative">
        
        <div class="mb-5">
          <h2 class="font-['Geist'] text-xl font-bold text-white tracking-tight">Acesse sua conta</h2>
          <p class="text-xs text-[#958DA1] mt-1">Gerencie robôs, funis e faturamento PIX em tempo real.</p>
        </div>

        <!-- Google OAuth Button -->
        <button
          type="button"
          on:click={() => alert('Autenticação Google simulada: conectando via OAuth 2.0')}
          class="w-full h-9 px-3 rounded-lg bg-[#18181B] hover:bg-[#201F22] border border-[#222226] hover:border-[#353437] text-white text-xs font-medium flex items-center justify-center gap-2.5 transition-colors"
        >
          <svg class="w-4 h-4 shrink-0" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
          </svg>
          <span>Continuar com o Google</span>
        </button>

        <div class="relative my-4 flex items-center justify-center">
          <div class="w-full border-t border-[#222226]"></div>
          <span class="absolute px-2.5 bg-[#111113] text-[10px] uppercase font-['JetBrains_Mono'] tracking-wider text-[#958DA1]">ou e-mail</span>
        </div>

        {#if errorMessage}
          <div class="mb-3.5 p-2.5 rounded-lg text-xs font-medium bg-[#EF4444]/10 border border-[#EF4444]/30 text-[#EF4444]">
            {errorMessage}
          </div>
        {/if}

        <form on:submit|preventDefault={handleLogin} class="space-y-3.5">
          <div>
            <label class="block text-xs font-medium text-[#958DA1] mb-1" for="email">E-mail de Operador</label>
            <input
              id="email"
              type="email"
              bind:value={email}
              required
              placeholder="operador@pumabot.com"
              class="w-full h-9 px-3 rounded-lg bg-[#09090B] border border-[#222226] text-xs text-white focus:outline-none focus:border-[#7C3AED] transition-colors"
            />
          </div>

          <div>
            <div class="flex items-center justify-between mb-1">
              <label class="text-xs font-medium text-[#958DA1]" for="password">Senha</label>
              <button type="button" on:click={() => isRecoveryOpen = true} class="text-[11px] text-[#7C3AED] hover:underline">
                Esqueceu?
              </button>
            </div>
            <div class="relative">
              {#if showPassword}
                <input
                  id="password"
                  type="text"
                  bind:value={password}
                  required
                  placeholder="••••••••••••"
                  class="w-full h-9 pl-3 pr-9 rounded-lg bg-[#09090B] border border-[#222226] text-xs text-white focus:outline-none focus:border-[#7C3AED] transition-colors font-['JetBrains_Mono']"
                />
              {:else}
                <input
                  id="password"
                  type="password"
                  bind:value={password}
                  required
                  placeholder="••••••••••••"
                  class="w-full h-9 pl-3 pr-9 rounded-lg bg-[#09090B] border border-[#222226] text-xs text-white focus:outline-none focus:border-[#7C3AED] transition-colors font-['JetBrains_Mono']"
                />
              {/if}
              <button
                type="button"
                on:click={() => showPassword = !showPassword}
                class="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#958DA1] hover:text-white"
                title="Mostrar/Ocultar"
              >
                <span class="material-symbols-outlined text-[16px]">{showPassword ? 'visibility_off' : 'visibility'}</span>
              </button>
            </div>
          </div>

          <div class="pt-1">
            <button
              type="submit"
              disabled={loading}
              class="w-full h-9 rounded-lg bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-xs font-semibold shadow-[0_0_12px_rgba(124,58,237,0.35)] transition-all flex items-center justify-center gap-1.5 active:scale-[0.98] disabled:opacity-50"
            >
              {#if loading}
                <span class="material-symbols-outlined text-[16px] animate-spin">sync</span>
                <span>Entrando...</span>
              {:else}
                <span>Entrar na Plataforma</span>
                <span class="material-symbols-outlined text-[15px]">arrow_forward</span>
              {/if}
            </button>
          </div>
        </form>

        <div class="mt-4 pt-3.5 border-t border-[#222226] text-center text-xs text-[#958DA1]">
          Não possui uma conta?
          <a href="/cadastro" class="text-[#7C3AED] hover:underline font-semibold ml-1">
            Criar conta grátis
          </a>
        </div>
      </div>
    </div>
  </main>

  <!-- Bottom Slim Footer (h-10) -->
  <footer class="h-10 shrink-0 px-6 md:px-12 border-t border-[#222226] bg-[#0C0C0E]/90 flex items-center justify-between text-[11px] text-[#958DA1]">
    <span>© 2026 Puma Bot Inc. Todos os direitos reservados.</span>
    <div class="flex items-center gap-4">
      <button type="button" on:click={() => isTermsOpen = true} class="hover:text-white transition-colors">Termos</button>
      <button type="button" on:click={() => isPrivacyOpen = true} class="hover:text-white transition-colors">Privacidade</button>
      <span class="text-[#10B981] font-['JetBrains_Mono']">SLA 99.98%</span>
    </div>
  </footer>

</div>

<!-- Modal: Recuperar Senha -->
{#if isRecoveryOpen}
  <div class="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
    <div class="w-full max-w-sm bg-[#111113] border border-[#222226] rounded-2xl p-6 space-y-4 text-xs font-['Inter']">
      <div class="flex items-center justify-between pb-3 border-b border-[#222226]">
        <h3 class="font-bold text-[#E5E1E4]">Recuperação de Acesso</h3>
        <button type="button" on:click={() => isRecoveryOpen = false} class="text-[#958DA1] hover:text-white">
          <span class="material-symbols-outlined text-[16px]">close</span>
        </button>
      </div>

      {#if recoverySent}
        <div class="p-3 rounded-lg bg-[#10B981]/15 text-[#10B981] font-medium text-center">
          Instruções de redefinição enviadas para {recoveryEmail}.
        </div>
      {:else}
        <p class="text-[#958DA1]">Informe seu e-mail cadastrado para receber o link de redefinição:</p>
        <input
          type="email"
          bind:value={recoveryEmail}
          placeholder="seu@email.com"
          class="w-full h-9 px-3 rounded-lg bg-[#09090B] border border-[#222226] text-xs text-white focus:outline-none focus:border-[#7C3AED]"
        />
        <button
          type="button"
          on:click={handleRecovery}
          class="w-full h-9 rounded-lg bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-medium"
        >
          Enviar Instruções
        </button>
      {/if}
    </div>
  </div>
{/if}

<!-- Modal: Termos -->
{#if isTermsOpen}
  <div class="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
    <div class="w-full max-w-md bg-[#111113] border border-[#222226] rounded-2xl p-6 space-y-4 text-xs text-[#958DA1]">
      <div class="flex items-center justify-between pb-3 border-b border-[#222226]">
        <h3 class="font-bold text-[#E5E1E4]">Termos de Uso</h3>
        <button type="button" on:click={() => isTermsOpen = false} class="text-[#958DA1] hover:text-white">
          <span class="material-symbols-outlined text-[16px]">close</span>
        </button>
      </div>
      <p>O Puma Bot disponibiliza software como serviço (SaaS) para automação de mensagens e vendas via PIX no Telegram. Não realizamos custódia de valores brutos.</p>
      <button type="button" on:click={() => isTermsOpen = false} class="w-full h-8 rounded-lg bg-[#7C3AED] text-white">Fechar</button>
    </div>
  </div>
{/if}

<!-- Modal: Privacidade -->
{#if isPrivacyOpen}
  <div class="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
    <div class="w-full max-w-md bg-[#111113] border border-[#222226] rounded-2xl p-6 space-y-4 text-xs text-[#958DA1]">
      <div class="flex items-center justify-between pb-3 border-b border-[#222226]">
        <h3 class="font-bold text-[#E5E1E4]">Políticas de Privacidade & LGPD</h3>
        <button type="button" on:click={() => isPrivacyOpen = false} class="text-[#958DA1] hover:text-white">
          <span class="material-symbols-outlined text-[16px]">close</span>
        </button>
      </div>
      <p>Seus dados são protegidos por criptografia em repouso e trânsito (AES-256 e TLS 1.3). Não vendemos dados a terceiros.</p>
      <button type="button" on:click={() => isPrivacyOpen = false} class="w-full h-8 rounded-lg bg-[#7C3AED] text-white">Fechar</button>
    </div>
  </div>
{/if}
