# Puma Bot - Telegram PIX SaaS

Plataforma SaaS desenvolvida a partir do projeto Stitch (`projects/17906719947643109974`), replicando todo o Design System oficial:
* Paleta dark mode com tema violeta (`#7c3aed`), esmeralda (`#10b981`) e superfícies escuras refinadas (`#09090b` / `#131315`).
* Tipografias Geist, Inter e JetBrains Mono.

---

## 🚀 Como Iniciar a Aplicação

Para iniciar o servidor local com a Landing Page, Cadastro, Login e Painel:

```bash
node server.js
```

Acesse no navegador:
* **Landing Page:** [http://localhost:3000/](http://localhost:3000/)
* **Cadastro:** [http://localhost:3000/cadastro.html](http://localhost:3000/cadastro.html)
* **Login:** [http://localhost:3000/login.html](http://localhost:3000/login.html)
* **Dashboard / Métricas:** [http://localhost:3000/dashboard.html](http://localhost:3000/dashboard.html)

---

## 📦 Estrutura de Arquivos

```text
puma-bot/
├── public/
│   ├── index.html        # Landing page oficial com simulação Telegram & Webhooks
│   ├── cadastro.html     # Formulário de criação de conta e bot
│   ├── login.html        # Autenticação com sessão
│   ├── dashboard.html    # Painel com gráficos, métricas e transações PIX
│   └── css/
│       └── style.css     # Tokens de design do Stitch
├── server.js             # Servidor HTTP nativo com API REST integrada
├── stitch_client.js      # Conector MCP para a API do Google Stitch
└── database.json         # Base de dados local com persistência de usuários
```

---

## ⚡ Integração Stitch & SvelteKit
O projeto foi estruturado para suportar transição direta para SvelteKit (`+page.svelte`), com componentes desacoplados e fluxo nativo de ponta a ponta.

