<svelte:head>
 <title>Puma Bot — Cadastro de Nova Conta</title>
</svelte:head>


<!-- Minimal Brand Header bar for Context & Return Link -->
<header class="w-full border-b border-outline-variant/20 bg-surface-container-lowest/80 backdrop-blur-md sticky top-0 z-40">
<div class="max-w-7xl mx-auto px-4 md:px-8 h-14 flex items-center justify-between">
<div class="flex items-center gap-3">
<img alt="Puma Bot" class="w-7 h-7 rounded-xl object-cover ring-1 ring-outline-variant/30" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBPHno5Zbesok3AgTPrr14S-kOiEAN5WIfd4lq8QIMwJfB9-lVx38YOIULyqBcKOSoyXWggyN020TThhJ3QPg5YTwOcaRXBhv9LKVwl-tl8S2IAsz3raNOp4Zbs_PQP7addFWlM1oGpEoSi2gI2yHFK2oAw6egg5NHnE88oydAGkAVy1Lyj5UDLP4Q3AkCbvtT25cDEWHqN35Iikd1BKGAy2ccBu-zeClGg5Ox2nkxD3Ozag0RiVQDy9A"/>
<span class="font-headline-sm text-headline-sm font-bold tracking-tight text-white">
 PUMA <span class="text-primary-container">BOT</span>
</span>
<span class="px-2 py-0.5 rounded-full bg-surface-container border border-outline-variant/30 font-label-badge text-label-badge text-primary font-medium tracking-wide">
 REGISTRO v2.4
 </span>
</div>
<div class="flex items-center gap-2">
<span class="font-body-sm text-body-sm text-on-surface-variant hidden sm:inline">Já tem uma conta operacional?</span>
<a class="px-3 py-1.5 rounded-xl border border-outline-variant/40 bg-surface-container hover:bg-surface-container-high text-white font-body-sm text-body-sm transition-colors flex items-center gap-1.5 active:scale-95" href="/login">
<span>Entrar</span>
<span class="material-symbols-outlined text-[16px]">arrow_forward</span>
</a>
</div>
</div>
</header>
<!-- Main Split-Screen Container -->
<main class="flex-1 max-w-7xl w-full mx-auto px-4 md:px-8 py-6 md:py-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
<!-- LEFT COLUMN: Operational Scale, Telemetry & Profit Engine -->
<section class="lg:col-span-6 flex flex-col gap-6 lg:sticky lg:top-20">
<!-- Top Badges & Headline -->
<div class="space-y-3">
<div class="inline-flex items-center gap-2.5 px-3 py-1 rounded-full bg-surface-container-low border border-outline-variant/30">
<span class="w-2 h-2 rounded-full bg-secondary animate-pulse"></span>
<span class="font-label-badge text-label-badge text-secondary font-medium uppercase tracking-wider">
 Engine de Liquidação Instantânea PIX
 </span>
</div>
<h1 class="font-headline-xl text-headline-xl md:text-headline-xl font-bold tracking-tight text-white leading-tight">
 Crie sua conta em menos de <span class="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary-container">2 minutos</span> e pare de pagar 10% por venda.
 </h1>
<p class="font-body-lg text-body-lg text-on-surface-variant max-w-xl">
 A infraestrutura mais veloz do mercado brasileiro para produtores e afiliados operarem robôs de automação no Telegram com máxima liquidez e taxas justas.
 </p>
</div>
<!-- Feature Bullet List with Violet Accents -->
<div class="space-y-3 pt-2">
<!-- Benefit 1 -->
<div class="p-3.5 rounded-xl bg-surface-container-low subpixel-border carbon-glow flex items-start gap-3.5 hover:border-outline-variant/60 transition-colors">
<div class="w-6 h-6 rounded-lg bg-primary-container/20 border border-primary-container/40 flex items-center justify-center text-primary mt-0.5 shrink-0">
<span class="material-symbols-outlined" style="font-variation-settings: 'FILL' 1;">check</span>
</div>
<div>
<div class="font-headline-sm text-headline-sm font-semibold text-white">
 Taxa fixa de R$ 0,50 por PIX aprovado
 </div>
<div class="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
 Zero mensalidade, sem taxa de saque oculta e sem porcentagem predatória sobre seu faturamento bruto.
 </div>
</div>
</div>
<!-- Benefit 2 -->
<div class="p-3.5 rounded-xl bg-surface-container-low subpixel-border carbon-glow flex items-start gap-3.5 hover:border-outline-variant/60 transition-colors">
<div class="w-6 h-6 rounded-lg bg-primary-container/20 border border-primary-container/40 flex items-center justify-center text-primary mt-0.5 shrink-0">
<span class="material-symbols-outlined" style="font-variation-settings: 'FILL' 1;">bolt</span>
</div>
<div>
<div class="font-headline-sm text-headline-sm font-semibold text-white">
 Multi-gateways com failover inteligente em &lt; 3s
 </div>
<div class="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
 Se um adquirente oscilar, sua transação migra instantaneamente para o gateway de backup sem perda de conversão.
 </div>
</div>
</div>
<!-- Benefit 3 -->
<div class="p-3.5 rounded-xl bg-surface-container-low subpixel-border carbon-glow flex items-start gap-3.5 hover:border-outline-variant/60 transition-colors">
<div class="w-6 h-6 rounded-lg bg-primary-container/20 border border-primary-container/40 flex items-center justify-center text-primary mt-0.5 shrink-0">
<span class="material-symbols-outlined" style="font-variation-settings: 'FILL' 1;">graphic_eq</span>
</div>
<div>
<div class="font-headline-sm text-headline-sm font-semibold text-white">
 Disparo de áudio gravado nativo para até 10x mais conversão
 </div>
<div class="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
 Envio com status visual 'gravando áudio...' diretamente no Telegram do comprador com pitch de remarketing humanizado.
 </div>
</div>
</div>
<!-- Benefit 4 -->
<div class="p-3.5 rounded-xl bg-surface-container-low subpixel-border carbon-glow flex items-start gap-3.5 hover:border-outline-variant/60 transition-colors">
<div class="w-6 h-6 rounded-lg bg-primary-container/20 border border-primary-container/40 flex items-center justify-center text-primary mt-0.5 shrink-0">
<span class="material-symbols-outlined" style="font-variation-settings: 'FILL' 1;">speed</span>
</div>
<div>
<div class="font-headline-sm text-headline-sm font-semibold text-white">
 Webhooks ultrarrápidos com latência de 18ms
 </div>
<div class="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
 Cluster dedicado em São Paulo (GRU) homologado com entrega imediata do link de acesso ou canal VIP.
 </div>
</div>
</div>
</div>
<!-- Real-time Cost Savings Simulation Card -->
<div class="p-5 rounded-xl bg-[#111113] subpixel-border carbon-glow relative overflow-hidden">
<!-- Ambient Decorative Line -->
<div class="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-primary to-transparent opacity-40"></div>
<div class="flex items-center justify-between pb-3 border-b border-[#222226]">
<div class="flex items-center gap-2">
<span class="material-symbols-outlined text-secondary text-[20px]">calculate</span>
<span class="font-headline-sm text-headline-sm font-semibold text-white">Simulador de Economia Real</span>
</div>
<span class="px-2 py-0.5 rounded bg-secondary/10 border border-secondary/30 text-secondary font-label-tabular text-label-tabular font-medium">
 +91% MARGEM
 </span>
</div>
<div class="grid grid-cols-2 gap-4 mt-4">
<div class="p-3 rounded-lg bg-surface-container-lowest border border-[#222226]">
<div class="font-body-sm text-body-sm text-on-surface-variant">Faturamento Mensal</div>
<div class="font-label-tabular text-headline-md font-bold text-white mt-1 tabular-nums">
 R$ 50.000,00
 </div>
<div class="font-body-sm text-[11px] text-outline mt-0.5">ticket médio de R$ 50,00 (1.000 vendas)</div>
</div>
<div class="p-3 rounded-lg bg-surface-container-lowest border border-[#222226]">
<div class="font-body-sm text-body-sm text-on-surface-variant">Economia no Puma Bot</div>
<div class="font-label-tabular text-headline-md font-bold text-secondary mt-1 tabular-nums">
 + R$ 4.490,00
 </div>
<div class="font-body-sm text-[11px] text-secondary/80 mt-0.5">vs 9.99% + R$ 1,00 padrão</div>
</div>
</div>
<div class="mt-3.5 flex items-center justify-between text-on-surface-variant font-body-sm text-body-sm">
<span class="flex items-center gap-1.5">
<span class="w-1.5 h-1.5 rounded-full bg-secondary"></span>
 Custo total no Puma: <strong class="text-white font-label-tabular">R$ 500,00</strong>
</span>
<span class="text-outline">
 Outras: <span class="line-through font-label-tabular">R$ 4.990,00</span>
</span>
</div>
</div>
<!-- Trust Metrics & Telemetry Feed -->
<div class="pt-2 border-t border-[#222226] flex items-center justify-between text-on-surface-variant font-label-tabular text-body-sm">
<div class="flex items-center gap-2">
<span class="w-2 h-2 rounded-full bg-secondary"></span>
<span>99.98% SLA Operacional</span>
</div>
<div class="flex items-center gap-2">
<span class="material-symbols-outlined text-[16px] text-primary">verified_user</span>
<span>Criptografia Ponta a Ponta</span>
</div>
<div class="hidden sm:flex items-center gap-1.5">
<span class="material-symbols-outlined text-[16px] text-secondary">database</span>
<span>Failover Redundante</span>
</div>
</div>
</section>
<!-- RIGHT COLUMN: High-Craft Registration Form -->
<section class="lg:col-span-6 w-full flex justify-center">
<div class="w-full max-w-lg p-6 sm:p-8 rounded-xl bg-[#111113] subpixel-border carbon-glow carbon-glow-hover transition-all">
<!-- Form Header -->
<div class="mb-6">
<div class="flex items-center justify-between">
<h2 class="font-headline-lg text-headline-lg font-bold text-white tracking-tight">
 Criar conta gratuita
 </h2>
<span class="px-2 py-0.5 rounded text-[11px] font-label-tabular font-medium text-primary bg-primary-container/20 border border-primary-container/40">
 OPERADOR SAAS
 </span>
</div>
<p class="font-body-md text-body-md text-on-surface-variant mt-1">
 Comece a vender com seus robôs no Telegram hoje mesmo.
 </p>
</div>
<!-- Google Social Login Button -->
<button class="w-full h-11 px-4 rounded-lg bg-[#18181B] border border-[#27272A] text-white font-body-md text-body-md font-medium flex items-center justify-center gap-3 hover:bg-[#202024] hover:border-outline-variant/60 active:scale-[0.99] transition-all duration-150 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)]" type="button">
<!-- Google Official SVG Icon -->
<svg aria-hidden="true" class="w-4 h-4 shrink-0" viewbox="0 0 24 24">
<path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path>
<path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path>
<path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"></path>
<path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"></path>
</svg>
<span>Cadastrar com o Google</span>
</button>
<!-- Elegant Divider -->
<div class="relative my-5 flex items-center justify-center">
<div class="w-full border-t border-[#222226]"></div>
<span class="absolute px-3 bg-[#111113] font-body-sm text-[11px] uppercase tracking-wider text-outline">
 ou preencha seus dados
 </span>
</div>
<!-- Registration Form Inputs -->
<div id="cadastro-alert" class="hidden p-3 rounded-lg text-sm mb-4"></div>
<form id="cadastro-form" class="space-y-4" onsubmit="event.preventDefault();">
<!-- Full Name -->
<div>
<label class="block font-body-sm text-body-sm font-medium text-white mb-1.5 flex items-center justify-between">
<span>Nome Completo</span>
<span class="text-[11px] text-outline">Pessoa Física ou Jurídica</span>
</label>
<div class="relative">
<span class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-outline">
<span class="material-symbols-outlined text-[18px]">person</span>
</span>
<input class="w-full pl-9 pr-3.5 py-2 h-10 rounded-lg bg-[#09090B] border border-[#222226] text-white placeholder-outline focus:border-primary-container focus:ring-1 focus:ring-primary-container font-body-md text-body-md transition-all outline-none" id="name-input" placeholder="Seu nome ou nome da operação" required="" type="text"/>
</div>
</div>
<!-- Business Email -->
<div>
<label class="block font-body-sm text-body-sm font-medium text-white mb-1.5">
 E-mail Comercial
 </label>
<div class="relative">
<span class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-outline">
<span class="material-symbols-outlined text-[18px]">mail</span>
</span>
<input class="w-full pl-9 pr-3.5 py-2 h-10 rounded-lg bg-[#09090B] border border-[#222226] text-white placeholder-outline focus:border-primary-container focus:ring-1 focus:ring-primary-container font-body-md text-body-md transition-all outline-none" id="email-input" placeholder="ex: voce@empresa.com.br" required="" type="email"/>
</div>
</div>
<!-- Password with Strength Meter -->
<div>
<div class="flex items-center justify-between mb-1.5">
<label class="block font-body-sm text-body-sm font-medium text-white">
 Senha de Acesso
 </label>
<span class="font-label-tabular text-[11px] text-secondary font-medium" id="strength-label">
 Forte
 </span>
</div>
<div class="relative">
<span class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-outline">
<span class="material-symbols-outlined text-[18px]">lock</span>
</span>
<input class="w-full pl-9 pr-10 py-2 h-10 rounded-lg bg-[#09090B] border border-[#222226] text-white placeholder-outline focus:border-primary-container focus:ring-1 focus:ring-primary-container font-body-md text-body-md transition-all outline-none" id="password-input" placeholder="Mínimo 8 caracteres seguros" required="" type="password" value="PumaBot#2025!"/>
<button class="absolute inset-y-0 right-0 pr-3 flex items-center text-outline hover:text-white" onclick="togglePasswordVisibility('password-input', this)" type="button">
<span class="material-symbols-outlined text-[18px]">visibility</span>
</button>
</div>
<!-- Password Strength Bar Indicators -->
<div class="grid grid-cols-4 gap-1.5 mt-2">
<div class="h-1 rounded-full bg-secondary"></div>
<div class="h-1 rounded-full bg-secondary"></div>
<div class="h-1 rounded-full bg-secondary"></div>
<div class="h-1 rounded-full bg-[#27272A]"></div>
</div>
<!-- Security Requirements checklist -->
<div class="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-[11px] font-label-tabular text-on-surface-variant">
<span class="flex items-center gap-1 text-secondary">
<span class="material-symbols-outlined text-[13px]">check</span> Mínimo 8 caracteres
 </span>
<span class="flex items-center gap-1 text-secondary">
<span class="material-symbols-outlined text-[13px]">check</span> Número
 </span>
<span class="flex items-center gap-1 text-secondary">
<span class="material-symbols-outlined text-[13px]">check</span> Símbolo (@, #, !)
 </span>
</div>
</div>
<!-- Confirm Password -->
<div>
<label class="block font-body-sm text-body-sm font-medium text-white mb-1.5">
 Confirme sua Senha
 </label>
<div class="relative">
<span class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-outline">
<span class="material-symbols-outlined text-[18px]">lock_reset</span>
</span>
<input class="w-full pl-9 pr-10 py-2 h-10 rounded-lg bg-[#09090B] border border-secondary/40 text-white placeholder-outline focus:border-primary-container focus:ring-1 focus:ring-primary-container font-body-md text-body-md transition-all outline-none" id="password-confirm" placeholder="Repita a mesma senha" required="" type="password" value="PumaBot#2025!"/>
<div class="absolute inset-y-0 right-0 pr-3 flex items-center text-secondary">
<span class="material-symbols-outlined text-[18px]">verified</span>
</div>
</div>
<!-- Live Match Feedback -->
<div class="flex items-center gap-1.5 mt-1.5 text-[11px] font-label-tabular text-secondary">
<span class="w-1.5 h-1.5 rounded-full bg-secondary"></span>
<span>As senhas coincidem perfeitamente</span>
</div>
</div>
<!-- Terms & Compliance Checkbox -->
<div class="pt-1">
<label class="flex items-start gap-2.5 cursor-pointer select-none">
<input checked="" class="w-4 h-4 rounded border-[#27272A] bg-[#09090B] text-primary-container focus:ring-0 focus:ring-offset-0 mt-0.5 cursor-pointer accent-[#7C3AED]" required="" type="checkbox"/>
<span class="font-body-sm text-[12px] text-on-surface-variant leading-tight">
 Concordo com os <a class="text-white underline hover:text-primary transition-colors" href="#termos">Termos de Serviço</a> e a <a class="text-white underline hover:text-primary transition-colors" href="#privacidade">Política de Privacidade</a> do Puma Bot.
 </span>
</label>
</div>
<!-- Primary Submit CTA -->
<button class="w-full h-11 mt-2 rounded-lg bg-primary-container text-white font-headline-sm text-headline-sm font-semibold flex items-center justify-center gap-2 border border-[#8B5CF6] hover:bg-[#8B5CF6] active:scale-[0.98] transition-all duration-150 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.20)] group cursor-pointer" type="submit">
<span>Criar Minha Conta Grátis</span>
<span class="material-symbols-outlined text-[18px] group-hover:translate-x-0.5 transition-transform">
 arrow_forward
 </span>
</button>
</form>
<!-- Footer Callout: Return to Login -->
<div class="mt-6 pt-5 border-t border-[#222226] text-center">
<p class="font-body-md text-body-md text-on-surface-variant">
 Já tem uma conta? 
 <a class="text-primary hover:text-white font-semibold underline decoration-primary/50 underline-offset-4 transition-colors" href="/login">
 Entrar na plataforma
 </a>
</p>
</div>
<!-- Compliance & Regulatory Micro-Footer -->
<div class="mt-4 pt-4 border-t border-[#1C1C20] flex items-center justify-between text-[11px] font-label-tabular text-outline">
<div class="flex items-center gap-1.5">
<span class="material-symbols-outlined text-[14px] text-secondary">lock</span>
<span>TLS 1.3 / AES-256</span>
</div>
<div class="flex items-center gap-1.5">
<span class="material-symbols-outlined text-[14px] text-primary">account_balance</span>
<span>PIX BCB Homologado</span>
</div>
<div>
<span>SaaS SP-01</span>
</div>
</div>
</div>
</section>
</main>
<!-- Global Footer Component (Aligned with Shared Components JSON Specifications) -->
<footer class="w-full bg-surface-container-lowest border-t border-outline-variant/30 mt-12">
<div class="max-w-7xl mx-auto px-4 md:px-8 py-8 flex flex-col md:flex-row justify-between items-center gap-6">
<!-- Brand & Copyright -->
<div class="flex flex-col md:flex-row items-center gap-3 text-center md:text-left">
<div class="flex items-center gap-2">
<img alt="Puma Bot" class="w-5 h-5 rounded-md object-cover ring-1 ring-outline-variant/30" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBPHno5Zbesok3AgTPrr14S-kOiEAN5WIfd4lq8QIMwJfB9-lVx38YOIULyqBcKOSoyXWggyN020TThhJ3QPg5YTwOcaRXBhv9LKVwl-tl8S2IAsz3raNOp4Zbs_PQP7addFWlM1oGpEoSi2gI2yHFK2oAw6egg5NHnE88oydAGkAVy1Lyj5UDLP4Q3AkCbvtT25cDEWHqN35Iikd1BKGAy2ccBu-zeClGg5Ox2nkxD3Ozag0RiVQDy9A"/>
<span class="font-headline-sm text-headline-sm font-bold text-on-surface">Puma Bot</span>
</div>
<span class="hidden md:inline text-outline">•</span>
<p class="font-body-sm text-body-sm text-on-surface-variant max-w-xl">
 © 2025 Puma Bot Inc. Todos os direitos reservados. Liquidação instantânea via PIX homologada pelo Banco Central.
 </p>
</div>
<!-- Links Cluster -->
<nav class="flex flex-wrap items-center justify-center md:justify-end gap-x-6 gap-y-2 text-on-surface-variant font-body-sm text-body-sm">
<a class="hover:text-on-surface transition-colors" href="#api">Documentação API</a>
<a class="hover:text-on-surface transition-colors flex items-center gap-1" href="#status">
<span class="w-1.5 h-1.5 rounded-full bg-secondary"></span>
<span>Status do Sistema</span>
</a>
<a class="hover:text-on-surface transition-colors" href="#privacidade">Políticas de Privacidade</a>
<a class="hover:text-on-surface transition-colors" href="#termos">Termos de Serviço</a>
<a class="hover:text-on-surface transition-colors" href="#seguranca">Segurança e Certificações</a>
<a class="text-primary hover:text-white transition-colors flex items-center gap-1" href="#telegram">
<span class="material-symbols-outlined text-[15px]">send</span>
<span>Suporte Telegram</span>
</a>
</nav>
</div>
</footer>
<!-- Script for UI Micro-Interactions -->
<script>
 function togglePasswordVisibility(inputId, btn) {
 const input = document.getElementById(inputId);
 const icon = btn.querySelector('.material-symbols-outlined');
 if (input.type === 'password') {
 input.type = 'text';
 icon.textContent = 'visibility_off';
 } else {
 input.type = 'password';
 icon.textContent = 'visibility';
 }
 }
 </script>

<script>
 document.addEventListener('DOMContentLoaded', () => {
 const form = document.getElementById('cadastro-form') || document.querySelector('form');
 const alertBox = document.getElementById('cadastro-alert');

 if (form) {
 form.addEventListener('submit', async (e) => {
 e.preventDefault();
 const name = (document.getElementById('name-input') || {}).value;
 const email = (document.getElementById('email-input') || {}).value;
 const password = (document.getElementById('password-input') || {}).value;
 const passwordConfirm = (document.getElementById('password-confirm') || {}).value;

 if (passwordConfirm && password !== passwordConfirm) {
 showAlert('As senhas não coincidem.', 'error');
 return;
 }

 const submitBtn = form.querySelector('button[type="submit"]');
 const originalText = submitBtn.innerHTML;
 submitBtn.disabled = true;
 submitBtn.innerText = 'Processando...';

 try {
 const res = await fetch('/api/auth/register', {
 method: 'POST',
 headers: { 'Content-Type': 'application/json' },
 body: JSON.stringify({ name, email, password })
 });
 const data = await res.json();

 if (!res.ok) {
 throw new Error(data.error || 'Erro ao realizar cadastro');
 }

 showAlert(' Conta criada com sucesso! Redirecionando para login...', 'success');
 setTimeout(() => {
 window.location.href = '/login?registered=1';
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

