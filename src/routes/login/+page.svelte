<svelte:head>
 <title>Puma Bot — Login de Operadores</title>
</svelte:head>


<!-- Main Split-Screen Canvas (Suppressed TopNav/BottomNav as mandated for Transactional Login Canvas) -->
<main class="flex-1 w-full flex flex-col lg:flex-row min-h-screen relative overflow-hidden">
<!-- LEFT PANEL: Brand Telemetry & Engineering Foundation -->
<section class="w-full lg:w-5/12 xl:w-1/2 p-6 sm:p-10 lg:p-14 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-[#222226] bg-[#0C0C0E] relative carbon-grid">
<!-- Glow ambient violet corner anchor -->
<div class="absolute top-0 left-0 w-96 h-96 bg-[#7C3AED]/5 rounded-full blur-3xl pointer-events-none -translate-x-1/2 -translate-y-1/2"></div>
<!-- Top Brand Header -->
<div class="relative z-10">
<div class="flex items-center gap-3">
<div class="w-9 h-9 rounded-xl overflow-hidden border border-[#222226] bg-[#111113] p-0.5 flex-shrink-0 flex items-center justify-center shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1)]">
<img alt="Puma Bot Icon" class="w-full h-full object-cover rounded-lg" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBPHno5Zbesok3AgTPrr14S-kOiEAN5WIfd4lq8QIMwJfB9-lVx38YOIULyqBcKOSoyXWggyN020TThhJ3QPg5YTwOcaRXBhv9LKVwl-tl8S2IAsz3raNOp4Zbs_PQP7addFWlM1oGpEoSi2gI2yHFK2oAw6egg5NHnE88oydAGkAVy1Lyj5UDLP4Q3AkCbvtT25cDEWHqN35Iikd1BKGAy2ccBu-zeClGg5Ox2nkxD3Ozag0RiVQDy9A"/>
</div>
<div class="flex items-center gap-2">
<span class="font-headline-md text-headline-md tracking-tight font-bold text-white">PUMA<span class="text-primary font-bold">BOT</span></span>
<span class="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-label-code text-primary bg-[#7C3AED]/15 border border-[#7C3AED]/30 tracking-tight">v2.4 PRO</span>
</div>
</div>
<div class="mt-10 max-w-lg">
<h1 class="font-headline-xl text-headline-xl text-white tracking-tight font-semibold leading-tight">
 A infraestrutura autônoma de vendas no Telegram com liquidação PIX instantânea.
 </h1>
<p class="mt-3 font-body-md text-body-md text-on-surface-variant max-w-md">
 Ambiente unificado para gestão de múltiplos robôs de checkout, entrega de mídias criptografadas e split automatizado de comissões via API.
 </p>
</div>
</div>
<!-- Live Telemetry Matrix -->
<div class="my-8 lg:my-10 space-y-3 max-w-lg relative z-10">
<!-- Telemetry Card: Gateway Status -->
<div class="tech-card tech-card-hover rounded-xl p-3.5 flex items-center justify-between">
<div class="flex items-center gap-3">
<div class="w-7 h-7 rounded-lg bg-[#18181B] border border-[#222226] flex items-center justify-center">
<span class="material-symbols-outlined text-secondary text-[16px]" data-icon="terminal">terminal</span>
</div>
<div>
<div class="font-label-tabular text-label-tabular text-white flex items-center gap-2">
<span>API Gateway Cluster</span>
<span class="inline-flex items-center gap-1 px-1.5 py-0.2 rounded-full text-[10px] text-secondary bg-secondary/10 border border-secondary/25">
<span class="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse"></span>
 100% Operacional
 </span>
</div>
<div class="font-label-code text-[11px] text-on-surface-variant mt-0.5">Cluster São Paulo (GRU) • Latência de borda: <span class="text-secondary font-label-tabular">18ms</span></div>
</div>
</div>
<span class="font-label-tabular text-label-tabular text-on-surface-variant hidden sm:block">mTLS v1.3</span>
</div>
<!-- Telemetry Card: Real-time Transaction -->
<div class="tech-card tech-card-hover rounded-xl p-3.5 flex items-center justify-between">
<div class="flex items-center gap-3">
<div class="w-7 h-7 rounded-lg bg-[#18181B] border border-[#222226] flex items-center justify-center">
<span class="material-symbols-outlined text-primary text-[16px]" data-icon="bolt">bolt</span>
</div>
<div>
<div class="font-body-md text-body-md text-white flex items-center gap-2">
<span>Última liquidação confirmada</span>
</div>
<div class="font-label-code text-[11px] text-on-surface-variant mt-0.5">
<span class="text-white font-label-tabular font-semibold">R$ 97,00</span> via <span class="text-on-surface">PushinPay failover</span> • Há 3s
 </div>
</div>
</div>
<div class="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[#10B981]/10 border border-[#10B981]/25 text-[#10B981] font-label-badge text-label-badge">
<span class="w-1.5 h-1.5 rounded-full bg-[#10B981]"></span>
 Aprovado
 </div>
</div>
<!-- Telemetry Sparkline & Metric -->
<div class="tech-card rounded-xl p-3.5">
<div class="flex items-center justify-between mb-2">
<span class="font-label-code text-label-code text-on-surface-variant">Taxa de Conversão PIX (Últimas 24h)</span>
<span class="font-label-tabular text-label-tabular text-secondary font-semibold">98.4%</span>
</div>
<!-- Sparkline representation with CSS bars -->
<div class="h-6 flex items-end gap-1 pt-1">
<div class="flex-1 bg-[#222226] hover:bg-primary-container h-[45%] rounded-t-sm transition-colors"></div>
<div class="flex-1 bg-[#222226] hover:bg-primary-container h-[60%] rounded-t-sm transition-colors"></div>
<div class="flex-1 bg-[#222226] hover:bg-primary-container h-[55%] rounded-t-sm transition-colors"></div>
<div class="flex-1 bg-[#222226] hover:bg-primary-container h-[70%] rounded-t-sm transition-colors"></div>
<div class="flex-1 bg-[#222226] hover:bg-primary-container h-[65%] rounded-t-sm transition-colors"></div>
<div class="flex-1 bg-[#222226] hover:bg-primary-container h-[85%] rounded-t-sm transition-colors"></div>
<div class="flex-1 bg-[#222226] hover:bg-primary-container h-[75%] rounded-t-sm transition-colors"></div>
<div class="flex-1 bg-[#222226] hover:bg-primary-container h-[90%] rounded-t-sm transition-colors"></div>
<div class="flex-1 bg-[#222226] hover:bg-primary-container h-[80%] rounded-t-sm transition-colors"></div>
<div class="flex-1 bg-[#7C3AED]/60 h-[95%] rounded-t-sm"></div>
<div class="flex-1 bg-primary-container h-[100%] rounded-t-sm"></div>
</div>
</div>
<!-- High-Scale Operator Testimonial -->
<div class="tech-card rounded-xl p-4 bg-[#141417]/80">
<p class="font-body-md text-body-md text-on-surface italic">
 "Migramos 14 robôs de infoprodutos para a Puma Bot. A taxa fixa de apenas <strong class="text-white not-italic font-label-tabular">R$ 0,50</strong> por transação aprovada sem mensalidade oculta aumentou nossa margem líquida em 18% no primeiro mês."
 </p>
<div class="mt-3 flex items-center justify-between text-on-surface-variant font-label-code text-[11px]">
<span class="text-white font-medium">Marcio D. • Operador Lead de Afiliados</span>
<span class="text-secondary flex items-center gap-1">
<span class="material-symbols-outlined text-[13px]" data-icon="verified">verified</span>
 Empresa Verificada
 </span>
</div>
</div>
</div>
<!-- Compliance & Security Indicators -->
<div class="pt-4 border-t border-[#222226] flex flex-wrap items-center justify-between gap-3 text-on-surface-variant font-label-code text-[11px] relative z-10">
<div class="flex items-center gap-2">
<span class="material-symbols-outlined text-primary text-[15px]" data-icon="lock">lock</span>
<span>Criptografia mTLS &amp; Chave Segregada</span>
</div>
<div class="flex items-center gap-2">
<span class="material-symbols-outlined text-secondary text-[15px]" data-icon="account_balance">account_balance</span>
<span>Conformidade Banco Central (BACEN)</span>
</div>
</div>
</section>
<!-- RIGHT PANEL: Precision Authentication Card -->
<section class="w-full lg:w-7/12 xl:w-1/2 p-6 sm:p-12 lg:p-16 flex flex-col justify-center items-center relative bg-[#09090B]">
<!-- Radial violet sheen for depth -->
<div class="absolute bottom-0 right-0 w-[500px] h-[500px] bg-[#7C3AED]/5 rounded-full blur-3xl pointer-events-none translate-x-1/3 translate-y-1/3"></div>
<!-- Top Quick Links (Documentação & Suporte) -->
<div class="w-full max-w-[420px] flex justify-end gap-4 mb-6">
<a class="font-body-sm text-body-sm text-on-surface-variant hover:text-white transition-colors duration-150 flex items-center gap-1" href="#documentacao">
<span class="material-symbols-outlined text-[14px]" data-icon="menu_book">menu_book</span>
 Documentação
 </a>
<a class="font-body-sm text-body-sm text-on-surface-variant hover:text-white transition-colors duration-150 flex items-center gap-1" href="#status">
<span class="material-symbols-outlined text-[14px]" data-icon="pulse_alert">pulse_alert</span>
 Status
 </a>
</div>
<!-- Form Box Container -->
<div class="w-full max-w-[420px] tech-card rounded-xl p-6 sm:p-8 relative z-10">
<!-- Header Text -->
<div class="mb-6">
<h2 class="font-headline-lg text-headline-lg text-white font-semibold tracking-tight">
 Acesse sua conta
 </h2>
<p class="font-body-md text-body-md text-on-surface-variant mt-1">
 Gerencie seus robôs, funis e liquidações em tempo real.
 </p>
</div>
<!-- Google OAuth Social Action -->
<button class="w-full h-10 px-4 rounded-md bg-[#18181B] hover:bg-[#222226] border border-[#27272A] text-white font-body-md text-body-md font-medium transition-all duration-150 flex items-center justify-center gap-3 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.07)] active:scale-[0.99]" type="button">
<!-- Official Google Multi-Color SVG Logo -->
<svg class="w-4 h-4 flex-shrink-0" viewbox="0 0 24 24">
<path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path>
<path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path>
<path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"></path>
<path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"></path>
</svg>
<span>Continuar com o Google</span>
</button>
<!-- Divider with Label -->
<div class="relative my-6">
<div class="absolute inset-0 flex items-center">
<div class="w-full border-t border-[#222226]"></div>
</div>
<div class="relative flex justify-center text-center">
<span class="bg-[#111113] px-3 font-body-sm text-body-sm text-on-surface-variant">ou continue com seu e-mail</span>
</div>
</div>
<!-- Credential Form -->
<div id="login-alert" class="hidden p-3 rounded-lg text-sm mb-4"></div>
<form id="login-form" class="space-y-4" onsubmit="event.preventDefault();">
<!-- Field: Email -->
<div>
<label class="block font-body-sm text-body-sm font-medium text-white mb-1.5" for="email">
 E-mail corporativo
 </label>
<div class="relative rounded-md shadow-sm">
<div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-on-surface-variant">
<span class="material-symbols-outlined text-[17px]" data-icon="alternate_email">alternate_email</span>
</div>
<input class="block w-full h-10 pl-9 pr-3 rounded-md bg-[#09090B] border border-[#222226] text-white placeholder-on-surface-variant/50 font-body-md text-body-md focus:border-primary-container focus:ring-1 focus:ring-primary-container focus:outline-none transition-colors" id="email" name="email" placeholder="nome@empresa.com.br" required="" type="email"/>
</div>
</div>
<!-- Field: Password -->
<div>
<div class="flex items-center justify-between mb-1.5">
<label class="font-body-sm text-body-sm font-medium text-white" for="password">
 Senha
 </label>
<a class="font-body-sm text-body-sm text-primary hover:text-primary-fixed transition-colors font-medium" href="#recuperar">
 Esqueceu a senha?
 </a>
</div>
<div class="relative rounded-md shadow-sm">
<div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-on-surface-variant">
<span class="material-symbols-outlined text-[17px]" data-icon="lock">lock</span>
</div>
<input class="block w-full h-10 pl-9 pr-10 rounded-md bg-[#09090B] border border-[#222226] text-white placeholder-on-surface-variant/50 font-body-md text-body-md focus:border-primary-container focus:ring-1 focus:ring-primary-container focus:outline-none transition-colors" id="password" name="password" placeholder="••••••••••••" required="" type="password"/>
<button aria-label="Alternar visibilidade da senha" class="absolute inset-y-0 right-0 flex items-center pr-3 text-on-surface-variant hover:text-white transition-colors" id="togglePassword" type="button">
<span class="material-symbols-outlined text-[18px]" data-icon="visibility" id="eyeIcon">visibility</span>
</button>
</div>
</div>
<!-- Keep Signed In Checkbox -->
<div class="flex items-center justify-between pt-1">
<label class="flex items-center gap-2 cursor-pointer select-none">
<input checked="" class="w-4 h-4 rounded bg-[#09090B] border-[#222226] text-primary-container focus:ring-primary-container focus:ring-offset-0 focus:ring-opacity-0 transition cursor-pointer" type="checkbox"/>
<span class="font-body-sm text-body-sm text-on-surface">Manter conectado por 30 dias</span>
</label>
</div>
<!-- Primary Submit CTA Button -->
<div class="pt-2">
<button class="w-full h-10 rounded-md bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-body-md text-body-md font-semibold border border-[#8B5CF6]/50 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.25)] flex items-center justify-center gap-2 transition-all duration-150 active:scale-[0.98] group" type="submit">
<span>Entrar na Plataforma</span>
<span class="material-symbols-outlined text-[16px] group-hover:translate-x-0.5 transition-transform" data-icon="arrow_forward">arrow_forward</span>
<kbd class="ml-2 hidden sm:inline-flex items-center px-1.5 py-0.5 text-[10px] font-label-code text-on-primary-container bg-black/25 rounded border border-white/10">↵ Enter</kbd>
</button>
</div>
</form>
<!-- Form Footer Link (Register prompt) -->
<div class="mt-6 pt-5 border-t border-[#222226] text-center font-body-sm text-body-sm text-on-surface-variant">
 Não possui uma conta? 
 <a class="text-primary hover:text-primary-fixed font-medium transition-colors ml-1" href="/cadastro">
 Criar conta grátis
 </a>
</div>
</div>
<!-- Footer Micro-Security Trust Badge -->
<div class="mt-6 flex items-center justify-center gap-2 text-on-surface-variant font-label-code text-[11px] text-center max-w-[420px]">
<span class="material-symbols-outlined text-[14px] text-secondary" data-icon="verified_user">verified_user</span>
<span>Ambiente seguro com autenticação de dois fatores (2FA) e proteção Cloudflare DDoS.</span>
</div>
</section>
</main>
<!-- Canonical System Sub-Footer (Strictly per Shared Components JSON) -->
<footer class="w-full bg-surface-container-lowest border-t border-outline-variant/30 py-6 px-4 md:px-8">
<div class="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
<div class="flex items-center gap-3">
<span class="font-headline-sm text-headline-sm font-bold text-on-surface">Puma Bot</span>
<span class="text-on-surface-variant font-body-sm text-body-sm hidden sm:inline">•</span>
<p class="font-body-sm text-body-sm text-on-surface-variant">
 © 2025 Puma Bot Inc. Todos os direitos reservados. Liquidação instantânea via PIX homologada pelo Banco Central.
 </p>
</div>
<div class="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-on-surface-variant font-body-sm text-body-sm">
<a class="hover:text-on-surface transition-colors duration-150" href="#api">Documentação API</a>
<a class="hover:text-on-surface transition-colors duration-150" href="#status">Status do Sistema</a>
<a class="hover:text-on-surface transition-colors duration-150" href="#privacidade">Políticas de Privacidade</a>
<a class="hover:text-on-surface transition-colors duration-150" href="#termos">Termos de Serviço</a>
<a class="hover:text-on-surface transition-colors duration-150" href="#seguranca">Segurança e Certificações</a>
<a class="text-primary hover:text-white transition-colors duration-150 flex items-center gap-1" href="#telegram">
<span class="material-symbols-outlined text-[13px]" data-icon="send">send</span>
 Suporte Telegram
 </a>
</div>
</div>
</footer>
<!-- Light interactive script for password toggle and visual polish -->
<script>
 document.addEventListener('DOMContentLoaded', () => {
 const toggleBtn = document.getElementById('togglePassword');
 const passwordInput = document.getElementById('password');
 const eyeIcon = document.getElementById('eyeIcon');

 if (toggleBtn && passwordInput && eyeIcon) {
 toggleBtn.addEventListener('click', () => {
 const isPassword = passwordInput.getAttribute('type') === 'password';
 passwordInput.setAttribute('type', isPassword ? 'text' : 'password');
 eyeIcon.innerText = isPassword ? 'visibility_off' : 'visibility';
 });
 }
 });
 </script>

<script>
 document.addEventListener('DOMContentLoaded', () => {
 const form = document.getElementById('login-form') || document.querySelector('form');
 const alertBox = document.getElementById('login-alert');

 // Checar se veio redirecionado do cadastro
 const params = new URLSearchParams(window.location.search);
 if (params.get('registered')) {
 showAlert('Conta criada com sucesso! Faça seu login para continuar.', 'success');
 }

 if (form) {
 form.addEventListener('submit', async (e) => {
 e.preventDefault();
 const email = (document.getElementById('email') || {}).value;
 const password = (document.getElementById('password') || {}).value;

 const submitBtn = form.querySelector('button[type="submit"]');
 const originalText = submitBtn.innerHTML;
 submitBtn.disabled = true;
 submitBtn.innerText = 'Autenticando...';

 try {
 const res = await fetch('/api/auth/login', {
 method: 'POST',
 headers: { 'Content-Type': 'application/json' },
 body: JSON.stringify({ email, password })
 });
 const data = await res.json();

 if (!res.ok) {
 throw new Error(data.error || 'Credenciais inválidas');
 }

 localStorage.setItem('puma_user', JSON.stringify(data.user));
 localStorage.setItem('puma_token', data.token);

 showAlert(' Login efetuado com sucesso! Redirecionando...', 'success');
 setTimeout(() => {
 window.location.href = '/';
 }, 1200);
 } catch (err) {
 showAlert(err.message, 'error');
 submitBtn.disabled = false;
 submitBtn.innerHTML = originalText;
 }
 });
 }

 function showAlert(msg, type) {
 if (!alertBox) return alert(msg);
 alertBox.className = type === 'error' 
 ? 'p-3 rounded-lg text-sm mb-4 bg-red-950/80 border border-red-500/50 text-red-200 block'
 : 'p-3 rounded-lg text-sm mb-4 bg-emerald-950/80 border border-emerald-500/50 text-emerald-200 block';
 alertBox.innerText = msg;
 }
 });
</script>

