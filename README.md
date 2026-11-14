# Puma Bot — Plataforma SaaS de Vendas PIX Automatizadas no Telegram

[![SvelteKit](https://img.shields.io/badge/SvelteKit-2.0-FF3E00?style=flat-square&logo=svelte&logoColor=white)](https://kit.svelte.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?style=flat-square&logo=prisma&logoColor=white)](https://www.prisma.io/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-v3-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Node.js](https://img.shields.io/badge/Node.js-20+-339933?style=flat-square&logo=node.js&logoColor=white)](https://nodejs.org/)
[![License](https://img.shields.io/badge/License-Proprietary-7C3AED?style=flat-square)](LICENSE)

Infraestrutura SaaS de alta performance para monetização e automação de comunidades, canais e supergrupos VIP na rede Telegram, com liquidação instantânea via PIX, links de uso único autodestrutivos, expulsão automática de inadimplentes e recuperação ativa de leads.

Projetada com arquitetura desacoplada, taxa de resposta de webhook inferior a 50ms, modelo de precificação fixa de R$ 0,50 por transação compensada e tolerância a falhas para altos volumes de requisições simultâneas.

---

## Sumário

- [Visão Geral e Diferenciais](#visão-geral-e-diferenciais)
- [Arquitetura do Sistema](#arquitetura-do-sistema)
- [Funcionalidades Principais](#funcionalidades-principais)
- [Padrões de Segurança (OWASP Hardened)](#padrões-de-segurança-owasp-hardened)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Requisitos de Ambiente](#requisitos-de-ambiente)
- [Variáveis de Ambiente](#variáveis-de-ambiente)
- [Instalação e Execução](#instalação-e-execução)
- [Endpoints de Integração e Webhooks](#endpoints-de-integração-e-webhooks)
- [Operação em Alta Escala (Produção)](#operação-em-alta-escala-produção)
- [Licença e Propriedade](#licença-e-propriedade)

---

## Visão Geral e Diferenciais

Plataformas legadas de checkout cobram percentuais abusivos (8% a 12% sobre o faturamento total bruto) e realizam custódia de liquidez por 14 a 30 dias. O **Puma Bot** elimina intermediários financeiros:

1. **Sem Custódia de Capital:** O pagamento PIX cai diretamente na conta bancária do operador cadastrada no gateway emissor (PushinPay, Mercado Pago, Efí Bank ou Asaas).
2. **Taxa Fixa por Venda:** Custo operacional estrito de R$ 0,50 apenas quando a cobrança é efetivamente aprovada pelo Banco Central.
3. **Links de Convite de Uso Único:** Links descartáveis gerados via Telegram Bot API com `member_limit: 1` e autodestruição após a primeira entrada, impedindo o vazamento ou compartilhamento não autorizado de acessos VIP.
4. **Expulsão Automática (SLA Rigoroso):** Varredura periódica de assinaturas vencidas com expulsão imediata do chat e disparo de mensagem privada com oferta de renovação em 1 clique.
5. **Zero Dados Fictícios:** 100% dos painéis, métricas de conversão, gráficos e listas são alimentados dinamicamente via Prisma ORM e PostgreSQL (com fallback transparente para armazenamento local JSON).

---

## Arquitetura do Sistema

O sistema combina renderização no lado do servidor (SSR) de alta precisão com filas de processamento assíncrono não-bloqueante:

```text
[ Cliente Telegram ] ──> /start ──> [ BotFather Instance ]
                                             │ Webhook (<50ms)
                                             ▼
[ Gateway Bancário ] ──> PIX Webhook ──> [ Puma Bot Engine ]
(PushinPay / Efí / MP)        │               │
                              │ Idempotência   ├──> [ PostgreSQL / Prisma ]
                              │ (txid único)  ├──> Cria Link Único (member_limit=1)
                              ▼               └──> Envia Mensagem Privada no Telegram
                 [ Acesso VIP Liberado ]
```

---

## Funcionalidades Principais

### 1. Painel de Controle e Métricas em Tempo Real (`/dashboard`)
- Indicadores de faturamento aprovado, volume bruto, taxa de conversão de checkout e novos leads do dia.
- Tabela dinâmica com as transações mais recentes, status de liquidação e identificador PIX (`txid`).
- Seletor rápido de instâncias de robôs conectados.

### 2. Gestão Multi-Bot (`/robos`)
- Conexão e sincronização simultânea de múltiplos robôs criados no `@BotFather`.
- Validação automática de tokens e credenciais.
- Criptografia em repouso de tokens de acesso.

### 3. Editor de Funis e Planos (`/fluxos`)
- Personalização de mensagem de boas-vindas com suporte a tags HTML (`<b>`, `<i>`, `<code>`).
- Construtor dinâmico de planos com botões inline no Telegram (Título, Valor em R$ e Duração em dias).
- Simulador visual em tempo real espelhando a interface nativa do Telegram Desktop/Mobile.

### 4. Gestão de Comunidades e Canais VIP (`/grupos`)
- Monitoramento contínuo de membros ativos por comunidade conectada.
- Gerador manual de links de uso único para atendimento e concessões especiais.
- Registro de data de entrada e prazo de expiração por assinante.

### 5. Recuperação e Remarketing Ativo (`/remarketing`)
- Detecção em tempo real de abandonos de checkout PIX.
- Disparo automatizado de mensagem persuasiva e áudio após inatividade configurável (ex: 10 minutos).
- Oferta dinâmica de downsell com preço promocional exclusivo.

### 6. Configuração Multi-Gateway PIX (`/gateways`)
- Suporte nativo a credenciadoras: PushinPay, Mercado Pago, Efí Bank (BACEN Resolução nº 1) e Asaas.
- Mascaramento e proteção de chaves de API.
- Simulador de pagamentos integrado para homologação sem custos.

### 7. Extrato Financeiro Consolidado (`/financeiro`)
- Balanço discriminado entre volume bruto faturado, dedução de taxa Puma (R$ 0,50) e receita líquida.
- Registro completo de transações com nome do comprador, plano e data de liquidação.
- Exportação integral do extrato em formato CSV.

### 8. Painel Super Admin Root (`/admin`)
- Visão gerencial macro de todos os operadores, robôs conectados e volume transacionado globalmente.
- Gerenciamento de planos de operadores (Free Trial, PRO, Enterprise).
- Interrupção emergencial de instâncias e expurgo de transações.

---

## Padrões de Segurança (OWASP Hardened)

A plataforma adota defesas em profundidade alinhadas com as diretrizes internacionais OWASP:

- **Armazenamento de Senhas:** Derivação de chaves via PBKDF2-HMAC-SHA512 com 100.000 iterações e salt criptográfico individual de 16 bytes.
- **Prevenção de Timing Attacks:** Verificação de credenciais através de `crypto.timingSafeEqual` para comparação em tempo constante.
- **Cookies de Sessão:** Cookie `puma_session` com atributos `HttpOnly`, `SameSite=Lax` e `Secure` em ambiente de produção.
- **Headers HTTP Defensivos:**
  - `X-Content-Type-Options: nosniff`
  - `X-Frame-Options: DENY` (Prevenção contra Clickjacking)
  - `X-XSS-Protection: 1; mode=block`
  - `Strict-Transport-Security: max-age=31536000; includeSubDomains` (HSTS forçado)
  - `Referrer-Policy: strict-origin-when-cross-origin`
- **Idempotência de Webhook:** Bloqueio de cobranças duplicadas com validação atômica via chave única `pixTxid`.
- **Prevenção de Abuso:** Rate Limiting por endereço IP (300 requisições/minuto em rotas estáticas; 120 requisições/minuto em rotas de API).

---

## Estrutura do Projeto

```text
puma-bot/
├── prisma/
│   └── schema.prisma                  # Modelos do PostgreSQL (User, Bot, Flow, Sale, VipSub)
├── scripts/
│   └── check-syntax.js                # Validador automatizado de sintaxe Svelte/TS/JS
├── src/
│   ├── app.css                        # Tokens de estilo, tipografia Geist/Inter e tema dark
│   ├── app.html                       # Documento HTML raiz com meta tags de segurança
│   ├── lib/
│   │   ├── components/                # Componentes Svelte reutilizáveis
│   │   │   ├── Button.svelte          # Botão padronizado com estados e spinners
│   │   │   ├── FaqAccordion.svelte    # Accordion técnico de dúvidas frequentes
│   │   │   ├── Footer.svelte          # Rodapé institucional com modais ARIA e links
│   │   │   ├── KpiCard.svelte         # Cards de telemetria e métricas
│   │   │   ├── Modal.svelte           # Janelas modais com controle de foco e backdrop
│   │   │   ├── StatusBadge.svelte     # Badges visuais de status (PAID, PENDING, REFUNDED)
│   │   │   └── TransactionsTable.svelte # Tabela paginada de transações PIX
│   │   ├── domain/
│   │   │   └── models.ts              # Interfaces e tipos de domínio da aplicação
│   │   └── server/
│   │       ├── auth.ts                # Criptografia PBKDF2, verificação e tokens
│   │       ├── config.ts              # Carregamento e sanitização de variáveis de ambiente
│   │       ├── pix-gateway.ts         # Adaptador multi-gateway e gerador de payload EMV
│   │       ├── prisma.ts              # Cliente Prisma com fallback resiliente para JSON local
│   │       └── telegram.ts            # Wrapper nativo da API do Telegram (timeout estrito de 8s)
│   └── routes/                        # Árvore de rotas do SvelteKit
│       ├── +layout.server.ts          # Carregamento de dados de sessão do operador
│       ├── +layout.svelte             # App Shell com sidebar fixa e cabeçalho Linear/Stripe
│       ├── +page.svelte               # Landing page comercial oficial
│       ├── admin/                     # Painel geral de administração (Root)
│       ├── api/                       # Endpoints HTTP REST
│       │   ├── auth/                  # Rotas de login e cadastro com hash PBKDF2
│       │   ├── bots/                  # CRUD e vinculação de instâncias de robôs
│       │   ├── cron/                  # Cron de expulsão de inadimplentes
│       │   ├── flows/                 # Publicação de funis e planos de assinatura
│       │   ├── gateways/              # Gestão de credenciais bancárias
│       │   ├── sales/                 # Consulta e reenvio manual de links VIP
│       │   ├── stats/                 # Telemetria e métricas consolidadas
│       │   └── webhook/
│       │       ├── pix/               # Receptor ultra-rápido de pagamentos PIX
│       │       └── telegram/[botId]/  # Receptor de atualizações (/start e callbacks)
│       ├── cadastro/                  # Tela de cadastro (Zero Scroll)
│       ├── clientes/                  # Gestão de assinantes e histórico
│       ├── dashboard/                 # Console de operações principal
│       ├── financeiro/                # Balanço financeiro, taxas e exportação CSV
│       ├── fluxos/                    # Editor visual de funis e planos
│       ├── gateways/                  # Configuração de credenciais PIX
│       ├── grupos/                    # Monitoramento de grupos VIP e links descartáveis
│       ├── login/                     # Tela de autenticação de operadores (Zero Scroll)
│       └── remarketing/               # Motor de recuperação de vendas perdidas
├── database.json                      # Banco de dados local para desenvolvimento offline
├── package.json                       # Configuração de dependências e scripts npm
├── server.js                          # Servidor Node.js HTTP integrado com o motor SvelteKit SSR
├── svelte.config.js                   # Configuração do SvelteKit com adapter-auto
├── tsconfig.json                      # Configuração estrita do compilador TypeScript
└── vite.config.ts                     # Configuração do Vite com plugin oficial Svelte
```

---

## Requisitos de Ambiente

- **Node.js:** Versão 20.x ou superior (LTS recomendada).
- **Gerenciador de Pacotes:** `npm` (v10+), `pnpm` (v9+) ou `yarn`.
- **Banco de Dados (Produção):** PostgreSQL 14+ gerenciado (Supabase, Neon com PgBouncer, ou AWS RDS). Em ambiente local de desenvolvimento, a aplicação opera automaticamente com fallback para `database.json`.

---

## Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto a partir do modelo abaixo:

```env
# Ambiente de Execucao
NODE_ENV=production
PORT=3000
APP_URL=https://seu-dominio.com.br

# Banco de Dados (PostgreSQL / PgBouncer Pooler)
DATABASE_URL=postgresql://usuario:senha@pooler.neon.tech/pumabot?sslmode=require&pgbouncer=true
DIRECT_URL=postgresql://usuario:senha@ep-direct.neon.tech/pumabot?sslmode=require

# Seguranca e Criptografia
JWT_SECRET=puma_bot_jwt_super_secret_high_entropy_key_512bits
CRON_SECRET=chave_secreta_para_disparo_do_cron_check_expired

# Gateway PIX Padrao
PIX_GATEWAY_PROVIDER=PUSHINPAY
PIX_GATEWAY_TOKEN=seu_token_pushinpay_bearer
```

---

## Instalação e Execução

### 1. Clonar o Repositório
```bash
git clone https://github.com/jvsleal-dev/puma-bot.git
cd puma-bot
```

### 2. Instalar Dependências
```bash
npm install
```

### 3. Verificar Sintaxe e Integridade
```bash
node scripts/check-syntax.js
```

### 4. Compilar para Produção (Vite + SvelteKit)
```bash
npm run build
```

### 5. Iniciar o Servidor
```bash
node server.js
```

A aplicação estará disponível em `http://localhost:3000`.

---

## Endpoints de Integração e Webhooks

### 1. Webhook de Notificação PIX (`POST /api/webhook/pix`)
Processador universal multi-gateway com normalização automática de payloads:
- **Latência média:** inferior a 45ms.
- **Gateways compatíveis:** PushinPay, Efí Bank, Asaas, Mercado Pago e OpenPix.
- **Comportamento em aprovação:** Gera link de convite descartável (`member_limit: 1`) e entrega no chat do Telegram com marcação de expiração.
- **Comportamento em estorno:** Remove o membro imediatamente do canal VIP via `kickExpiredMember`.

### 2. Webhook do Telegram Bot API (`POST /api/webhook/telegram/[botId]`)
Recebe comandos `/start` e cliques em botões inline:
- Responde callbacks instantaneamente via `answerCallbackQuery` para eliminar o estado de carregamento no aplicativo.
- Gera cobrança PIX com código Copia e Cola dentro da tag `<code>` para cópia com um único toque.

### 3. Cron Job de Inadimplência (`GET /api/cron/check-expired`)
Varredura de segurança acionada a cada 5 minutos:
- **Proteção:** Cabeçalho `Authorization: Bearer <CRON_SECRET>`.
- **Ação:** Identifica registros onde `active = true` e `expiresAt < now()`, executa a desativação no banco de dados e expulsa o usuário do grupo VIP permitindo recompra futura.

---

## Operação em Alta Escala (Produção)

Para ambientes com volume superior a 10.000 transações diárias, recomenda-se a seguinte arquitetura:

| Componente | Configuração Recomendada |
| :--- | :--- |
| **Cluster Node.js** | Gerenciamento via PM2 com modo cluster em todas as CPUs (`pm2 start server.js -i max`). |
| **Banco de Dados** | PostgreSQL com pool de conexões ativo (PgBouncer) e índices em `pixTxid` e `[active, expiresAt]`. |
| **Proteção de Borda** | Cloudflare com SSL/TLS Strict, mitigação de DDoS e cache de assets estáticos (`/_app/immutable/*`). |
| **Disparo de Mensagens** | Fila distribuída (BullMQ + Redis) com controle de taxa estrito (máximo 30 msgs/s por robô). |

---

## Licença e Propriedade

Este projeto é de propriedade privada e confidencial. Todos os direitos reservados. Proibida a redistribuição ou comercialização não autorizada do código-fonte.
