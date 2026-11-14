<script lang="ts">
  let name = '';
  let email = '';
  let password = '';
  let confirmPassword = '';
  let showPassword = false;
  let loading = false;
  let errorMessage = '';
  let successMessage = '';

  async function handleRegister() {
    if (!name || !email || !password) {
      errorMessage = 'Preencha todos os campos obrigatórios.';
      return;
    }

    if (password.length < 6) {
      errorMessage = 'A senha deve conter no mínimo 6 caracteres.';
      return;
    }

    if (password !== confirmPassword) {
      errorMessage = 'As senhas não coincidem.';
      return;
    }

    loading = true;
    errorMessage = '';
    successMessage = '';

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        successMessage = 'Conta criada com sucesso! Redirecionando para login...';
        setTimeout(() => {
          window.location.href = '/login?registered=1';
        }, 1200);
      } else {
        errorMessage = data.error || 'Erro ao criar conta.';
      }
    } catch (e) {
      errorMessage = 'Erro de conexão com o servidor.';
    } finally {
      loading = false;
    }
  }
</script>

<svelte:head>
  <title>Puma Bot — Cadastro de Nova Conta</title>
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
      <span class="px-2 py-0.5 rounded text-[10px] font-['JetBrains_Mono'] bg-[#7C3AED]/15 text-[#7C3AED] border border-[#7C3AED]/30">REGISTRO</span>
    </a>

    <div class="flex items-center gap-3 text-xs font-['Inter']">
      <span class="text-[#958DA1] hidden sm:inline">Já tem uma conta operacional?</span>
      <a href="/login" class="px-3 py-1.5 rounded-lg border border-[#222226] bg-[#18181B] hover:bg-[#201F22] text-white transition-colors flex items-center gap-1.5 active:scale-95">
        <span>Entrar</span>
        <span class="material-symbols-outlined text-[14px]">arrow_forward</span>
      </a>
    </div>
  </header>

  <!-- Center Split Canvas (flex-1 overflow-hidden) -->
  <main class="flex-1 w-full max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center overflow-hidden">
    
    <!-- Left Column: Value Proposition & Profit Savings Engine -->
    <div class="hidden lg:flex lg:col-span-6 flex-col justify-center space-y-4">
      <div class="space-y-2">
        <span class="inline-flex items-center gap-1.5 text-[11px] font-['JetBrains_Mono'] uppercase tracking-wider text-[#10B981] bg-[#10B981]/10 px-2.5 py-1 rounded-full border border-[#10B981]/25">
          <span class="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse"></span>
          Engine de Liquidação Instantânea PIX
        </span>
        <h1 class="font-['Geist'] text-3xl xl:text-4xl font-bold tracking-tight text-white leading-tight">
          Crie sua conta em 2 minutos e pare de pagar 10% por venda.
        </h1>
        <p class="text-sm text-[#958DA1] leading-relaxed">
          Sem porcentagem predatória sobre seu faturamento bruto. Pague estritamente R$ 0,50 por transação aprovada.
        </p>
      </div>

      <!-- Compact 3 Benefits -->
      <div class="space-y-2.5 pt-1 text-xs">
        <div class="p-3 rounded-xl bg-[#111113] border border-[#222226] flex items-center gap-3">
          <div class="w-6 h-6 rounded-lg bg-[#7C3AED]/20 text-[#7C3AED] flex items-center justify-center shrink-0">
            <span class="material-symbols-outlined text-[16px]">check</span>
          </div>
          <div>
            <div class="font-semibold text-white">Taxa fixa de R$ 0,50 por PIX</div>
            <div class="text-[11px] text-[#958DA1]">Sem mensalidade, sem taxa de saque e sem surpresas.</div>
          </div>
        </div>

        <div class="p-3 rounded-xl bg-[#111113] border border-[#222226] flex items-center gap-3">
          <div class="w-6 h-6 rounded-lg bg-[#10B981]/20 text-[#10B981] flex items-center justify-center shrink-0">
            <span class="material-symbols-outlined text-[16px]">bolt</span>
          </div>
          <div>
            <div class="font-semibold text-white">Multi-gateways com Failover Inteligente</div>
            <div class="text-[11px] text-[#958DA1]">PushinPay, Mercado Pago, Asaas e EFI com migração automática.</div>
          </div>
        </div>

        <div class="p-3 rounded-xl bg-[#111113] border border-[#222226] flex items-center gap-3">
          <div class="w-6 h-6 rounded-lg bg-[#F59E0B]/20 text-[#F59E0B] flex items-center justify-center shrink-0">
            <span class="material-symbols-outlined text-[16px]">speed</span>
          </div>
          <div>
            <div class="font-semibold text-white">Webhooks com Latência &lt;18ms</div>
            <div class="text-[11px] text-[#958DA1]">Cluster dedicado em São Paulo para entrega imediata do link VIP.</div>
          </div>
        </div>
      </div>

      <!-- Trust Metrics -->
      <div class="flex items-center gap-4 text-xs font-['JetBrains_Mono'] text-[#958DA1] pt-1">
        <span class="flex items-center gap-1.5 text-[#10B981]">
          <span class="w-2 h-2 rounded-full bg-[#10B981]"></span>
          SLA 99.98%
        </span>
        <span>•</span>
        <span>Criptografia Ponta a Ponta</span>
        <span>•</span>
        <span>Conformidade BACEN</span>
      </div>
    </div>

    <!-- Right Column: Focused Compact Registration Card -->
    <div class="col-span-12 lg:col-span-6 w-full flex justify-center">
      <div class="w-full max-w-[440px] bg-[#111113] border border-[#222226] rounded-2xl p-6 shadow-2xl relative">
        
        <div class="mb-4">
          <div class="flex items-center justify-between">
            <h2 class="font-['Geist'] text-xl font-bold text-white tracking-tight">Criar conta gratuita</h2>
            <span class="px-2 py-0.5 rounded text-[10px] font-['JetBrains_Mono'] text-[#7C3AED] bg-[#7C3AED]/15 border border-[#7C3AED]/30">OPERADOR</span>
          </div>
          <p class="text-xs text-[#958DA1] mt-0.5">Comece a vender com seus robôs no Telegram hoje mesmo.</p>
        </div>

        <!-- Google OAuth Button -->
        <button
          type="button"
          on:click={() => alert('Cadastro Google simulado: conectando via OAuth 2.0')}
          class="w-full h-8 px-3 rounded-lg bg-[#18181B] hover:bg-[#201F22] border border-[#222226] hover:border-[#353437] text-white text-xs font-medium flex items-center justify-center gap-2.5 transition-colors"
        >
          <svg class="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
          </svg>
          <span>Cadastrar com o Google</span>
        </button>

        <div class="relative my-3 flex items-center justify-center">
          <div class="w-full border-t border-[#222226]"></div>
          <span class="absolute px-2.5 bg-[#111113] text-[10px] uppercase font-['JetBrains_Mono'] tracking-wider text-[#958DA1]">ou preencha seus dados</span>
        </div>

        {#if errorMessage}
          <div class="mb-2.5 p-2 rounded-lg text-xs font-medium bg-[#EF4444]/10 border border-[#EF4444]/30 text-[#EF4444]">
            {errorMessage}
          </div>
        {/if}

        {#if successMessage}
          <div class="mb-2.5 p-2 rounded-lg text-xs font-medium bg-[#10B981]/10 border border-[#10B981]/30 text-[#10B981]">
            {successMessage}
          </div>
        {/if}

        <form on:submit|preventDefault={handleRegister} class="space-y-2.5">
          <div>
            <label class="block text-xs font-medium text-[#958DA1] mb-1" for="cad-name">Nome Completo</label>
            <input
              id="cad-name"
              type="text"
              bind:value={name}
              required
              placeholder="Ex: João Vitor"
              class="w-full h-8 px-3 rounded-lg bg-[#09090B] border border-[#222226] text-xs text-white focus:outline-none focus:border-[#7C3AED] transition-colors"
            />
          </div>

          <div>
            <label class="block text-xs font-medium text-[#958DA1] mb-1" for="cad-email">E-mail Comercial</label>
            <input
              id="cad-email"
              type="email"
              bind:value={email}
              required
              placeholder="nome@empresa.com"
              class="w-full h-8 px-3 rounded-lg bg-[#09090B] border border-[#222226] text-xs text-white focus:outline-none focus:border-[#7C3AED] transition-colors"
            />
          </div>

          <div class="grid grid-cols-2 gap-2">
            <div>
              <label class="block text-xs font-medium text-[#958DA1] mb-1" for="cad-password">Senha</label>
              {#if showPassword}
                <input
                  id="cad-password"
                  type="text"
                  bind:value={password}
                  required
                  placeholder="Mínimo 6 chars"
                  class="w-full h-8 px-3 rounded-lg bg-[#09090B] border border-[#222226] text-xs text-white focus:outline-none focus:border-[#7C3AED] transition-colors font-['JetBrains_Mono']"
                />
              {:else}
                <input
                  id="cad-password"
                  type="password"
                  bind:value={password}
                  required
                  placeholder="Mínimo 6 chars"
                  class="w-full h-8 px-3 rounded-lg bg-[#09090B] border border-[#222226] text-xs text-white focus:outline-none focus:border-[#7C3AED] transition-colors font-['JetBrains_Mono']"
                />
              {/if}
            </div>

            <div>
              <label class="block text-xs font-medium text-[#958DA1] mb-1" for="cad-confirm">Confirmar Senha</label>
              {#if showPassword}
                <input
                  id="cad-confirm"
                  type="text"
                  bind:value={confirmPassword}
                  required
                  placeholder="Repita a senha"
                  class="w-full h-8 px-3 rounded-lg bg-[#09090B] border border-[#222226] text-xs text-white focus:outline-none focus:border-[#7C3AED] transition-colors font-['JetBrains_Mono']"
                />
              {:else}
                <input
                  id="cad-confirm"
                  type="password"
                  bind:value={confirmPassword}
                  required
                  placeholder="Repita a senha"
                  class="w-full h-8 px-3 rounded-lg bg-[#09090B] border border-[#222226] text-xs text-white focus:outline-none focus:border-[#7C3AED] transition-colors font-['JetBrains_Mono']"
                />
              {/if}
            </div>
          </div>

          <div class="flex items-center justify-between text-[11px] pt-1 text-[#958DA1]">
            <label class="flex items-center gap-1.5 cursor-pointer">
              <input type="checkbox" on:change={() => showPassword = !showPassword} class="rounded bg-[#09090B] border-[#222226] text-[#7C3AED]" />
              <span>Exibir senhas</span>
            </label>
            <span>Mínimo 6 caracteres</span>
          </div>

          <div class="pt-1.5">
            <button
              type="submit"
              disabled={loading}
              class="w-full h-9 rounded-lg bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-xs font-semibold shadow-[0_0_12px_rgba(124,58,237,0.35)] transition-all flex items-center justify-center gap-1.5 active:scale-[0.98] disabled:opacity-50"
            >
              {#if loading}
                <span class="material-symbols-outlined text-[16px] animate-spin">sync</span>
                <span>Criando Conta...</span>
              {:else}
                <span>Criar Conta Gratuita</span>
                <span class="material-symbols-outlined text-[15px]">arrow_forward</span>
              {/if}
            </button>
          </div>
        </form>

        <div class="mt-3 pt-2.5 border-t border-[#222226] text-center text-xs text-[#958DA1]">
          Já possui conta?
          <a href="/login" class="text-[#7C3AED] hover:underline font-semibold ml-1">
            Fazer login
          </a>
        </div>
      </div>
    </div>
  </main>

  <!-- Bottom Slim Footer (h-10) -->
  <footer class="h-10 shrink-0 px-6 md:px-12 border-t border-[#222226] bg-[#0C0C0E]/90 flex items-center justify-between text-[11px] text-[#958DA1]">
    <span>© 2026 Puma Bot Inc. Todos os direitos reservados.</span>
    <div class="flex items-center gap-4">
      <a href="#termos" class="hover:text-white transition-colors">Termos de Uso</a>
      <a href="#privacidade" class="hover:text-white transition-colors">Privacidade</a>
      <span class="text-[#10B981] font-['JetBrains_Mono']">Ambiente Seguro 256-bit</span>
    </div>
  </footer>

</div>
