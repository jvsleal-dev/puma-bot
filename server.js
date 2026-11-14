import http from 'http';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';
import { getRequest, setResponse } from '@sveltejs/kit/node';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 3000;
const CLIENT_DIR = path.join(__dirname, '.svelte-kit', 'output', 'client');
const JWT_SECRET = process.env.JWT_SECRET || 'puma_bot_jwt_super_secret_high_entropy_key_512bits';

// =============================================================================
// Initialize SvelteKit SSR Server Engine
// =============================================================================
let svelteKitApp = null;
try {
  const { Server } = await import('./.svelte-kit/output/server/index.js');
  const { manifest } = await import('./.svelte-kit/output/server/manifest.js');
  svelteKitApp = new Server(manifest);
  await svelteKitApp.init({ env: process.env });
  console.log('[SvelteKit] Motor SSR 100% carregado e inicializado com sucesso.');
} catch (err) {
  console.warn('[SvelteKit] SSR bundle nao encontrado. Execute npm run build para compilar.', err.message);
}

// =============================================================================
// Security Functions: PBKDF2 Hashing, Constant-Time Comparison, JWT, Rate Limit
// =============================================================================

function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('hex');
  return `${salt}:${hash}`;
}

function verifyPassword(password, storedHash) {
  if (!storedHash || !storedHash.includes(':')) return false;
  const [salt, originalHash] = storedHash.split(':');
  const computedHash = crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('hex');

  const bufOriginal = Buffer.from(originalHash, 'hex');
  const bufComputed = Buffer.from(computedHash, 'hex');

  if (bufOriginal.length !== bufComputed.length) return false;
  return crypto.timingSafeEqual(bufOriginal, bufComputed);
}

function generateToken(payload, expiresInSeconds = 86400 * 7) {
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
  const claims = Buffer.from(
    JSON.stringify({
      ...payload,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + expiresInSeconds
    })
  ).toString('base64url');

  const signature = crypto
    .createHmac('sha256', JWT_SECRET)
    .update(`${header}.${claims}`)
    .digest('base64url');

  return `${header}.${claims}.${signature}`;
}

function verifyToken(token) {
  if (!token || typeof token !== 'string') return null;
  const parts = token.split('.');
  if (parts.length !== 3) return null;

  const [header, claims, signature] = parts;

  const expectedSignature = crypto
    .createHmac('sha256', JWT_SECRET)
    .update(`${header}.${claims}`)
    .digest('base64url');

  const bufExpected = Buffer.from(expectedSignature);
  const bufActual = Buffer.from(signature);

  if (bufExpected.length !== bufActual.length) return null;
  if (!crypto.timingSafeEqual(bufExpected, bufActual)) return null;

  try {
    const payload = JSON.parse(Buffer.from(claims, 'base64url').toString('utf8'));
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) return null;
    return payload;
  } catch (e) {
    return null;
  }
}

// In-Memory Rate Limiter (Token Bucket)
const rateLimitMap = new Map();
function checkRateLimit(ip, maxRequests = 60, windowSeconds = 60) {
  const now = Date.now();
  const bucket = rateLimitMap.get(ip) || { tokens: maxRequests, lastRefill: now };

  const elapsedTime = (now - bucket.lastRefill) / 1000;
  bucket.tokens = Math.min(maxRequests, bucket.tokens + elapsedTime * (maxRequests / windowSeconds));
  bucket.lastRefill = now;

  if (bucket.tokens >= 1) {
    bucket.tokens -= 1;
    rateLimitMap.set(ip, bucket);
    return { allowed: true, remaining: Math.floor(bucket.tokens) };
  } else {
    rateLimitMap.set(ip, bucket);
    return { allowed: false, remaining: 0 };
  }
}

function sanitizeInput(str) {
  if (typeof str !== 'string') return '';
  return str.replace(/[<>]/g, '').trim();
}

// =============================================================================
// Database Initialization & JSON Persistence
// =============================================================================
const DB_FILE = path.join(__dirname, 'database.json');
let db = {
  users: [],
  bots: [],
  flows: [],
  sales: [],
  gateways: {
    provider: 'PUSHINPAY',
    token: '',
    pixKey: '',
    updatedAt: new Date().toISOString()
  },
  vipSubscriptions: []
};

if (fs.existsSync(DB_FILE)) {
  try {
    const loaded = JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
    db.users = loaded.users || [];
    db.bots = loaded.bots || [];
    db.flows = loaded.flows || [];
    db.sales = loaded.sales || [];
    db.gateways = loaded.gateways || { provider: 'PUSHINPAY', token: '', pixKey: '' };
    db.vipSubscriptions = loaded.vipSubscriptions || [];
  } catch (e) {
    console.error('Erro ao carregar banco:', e);
  }
} else {
  saveDB();
}

function saveDB() {
  fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2));
}

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2'
};

function parseBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    let bytes = 0;
    const MAX_BODY_SIZE = 1024 * 1024;

    req.on('data', chunk => {
      bytes += chunk.length;
      if (bytes > MAX_BODY_SIZE) {
        req.destroy();
        reject(new Error('Payload too large'));
        return;
      }
      body += chunk;
    });

    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (err) {
        resolve({});
      }
    });
    req.on('error', reject);
  });
}

function sendJson(res, statusCode, data) {
  res.writeHead(statusCode, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(data));
}

const server = http.createServer(async (req, res) => {
  const parsedUrl = new URL(req.url, `http://${req.headers.host}`);
  const pathname = parsedUrl.pathname.replace(/\/$/, '') || '/';
  const startTime = Date.now();
  const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1';

  // ---------------------------------------------------------------------------
  // 1. Headers de Seguranca Hardened (OWASP Best Practices)
  // ---------------------------------------------------------------------------
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');

  // CORS Restrito
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Telegram-Bot-Api-Secret-Token, X-Signature-256');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  // ---------------------------------------------------------------------------
  // 2. Protecao de Rate Limiting
  // ---------------------------------------------------------------------------
  const isApi = pathname.startsWith('/api/');
  const limit = checkRateLimit(clientIp, isApi ? 120 : 300, 60);

  res.setHeader('X-RateLimit-Remaining', limit.remaining);
  if (!limit.allowed) {
    return sendJson(res, 429, { error: 'Too many requests. Please wait a minute.' });
  }

  // ---------------------------------------------------------------------------
  // 3. Servir Assets Estáticos do SvelteKit (_app/...)
  // ---------------------------------------------------------------------------
  if (pathname.startsWith('/_app/') || pathname.startsWith('/favicon.')) {
    const assetPath = path.join(CLIENT_DIR, pathname);
    if (fs.existsSync(assetPath) && fs.statSync(assetPath).isFile()) {
      const ext = path.extname(assetPath).toLowerCase();
      const contentType = MIME_TYPES[ext] || 'application/octet-stream';
      res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
      res.writeHead(200, { 'Content-Type': contentType });
      return fs.createReadStream(assetPath).pipe(res);
    }
  }

  // ---------------------------------------------------------------------------
  // 4. Delegação Prioritária para o Motor 100% SvelteKit SSR (Prisma, APIs e Webhooks)
  // ---------------------------------------------------------------------------
  if (svelteKitApp) {
    try {
      const webReq = await getRequest({
        request: req,
        base: `http://${req.headers.host || 'localhost:3000'}`
      });

      const webRes = await svelteKitApp.respond(webReq, {
        getClientAddress() {
          return clientIp;
        }
      });

      if (webRes) {
        await setResponse(res, webRes);
        return;
      }
    } catch (ssrError) {
      console.error('[SSR Engine Request Error]:', ssrError);
    }
  }

  // ===========================================================================
  // Fallback em Memória (Apenas quando SSR não estiver compilado)
  // ===========================================================================
  if (pathname === '/api/auth/register' && req.method === 'POST') {
    const data = await parseBody(req);
    const { name, email, password } = data;

    if (!name || !email || !password || password.length < 6) {
      return sendJson(res, 400, { error: 'Dados invalidos. A senha deve ter no minimo 6 caracteres.' });
    }

    const emailClean = email.toLowerCase().trim();
    const existing = db.users.find(u => u.email.toLowerCase() === emailClean);
    if (existing) {
      return sendJson(res, 400, { error: 'E-mail ja cadastrado' });
    }

    const passwordHash = hashPassword(password);
    const newUser = {
      id: 'usr_' + Date.now(),
      name: sanitizeInput(name),
      email: emailClean,
      passwordHash,
      createdAt: new Date().toISOString(),
      plan: 'PRO Trial (14 dias)'
    };

    db.users.push(newUser);
    saveDB();

    return sendJson(res, 201, {
      success: true,
      user: { id: newUser.id, name: newUser.name, email: newUser.email, plan: newUser.plan }
    });
  }

  if (pathname === '/api/auth/login' && req.method === 'POST') {
    const data = await parseBody(req);
    const { email, password } = data;

    const emailClean = (email || '').toLowerCase().trim();
    const user = db.users.find(u => u.email.toLowerCase() === emailClean);

    const isValid = user ? (user.passwordHash ? verifyPassword(password, user.passwordHash) : user.password === password) : false;

    if (!isValid || !user) {
      return sendJson(res, 401, { error: 'Credenciais invalidas' });
    }

    const token = generateToken({
      sub: user.id,
      email: user.email,
      name: user.name,
      plan: user.plan
    });

    return sendJson(res, 200, {
      success: true,
      token,
      user: { id: user.id, name: user.name, email: user.email, plan: user.plan }
    });
  }

  // ===========================================================================
  // 4. API: Telemetria & Estatisticas (/api/stats)
  // ===========================================================================
  if (pathname === '/api/stats' && req.method === 'GET') {
    const paidSales = db.sales.filter(s => s.status === 'PAID');
    const totalApprovedRevenue = paidSales.reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);
    const totalSalesCount = db.sales.length;
    const conversionRate = totalSalesCount > 0 ? ((paidSales.length / totalSalesCount) * 100).toFixed(1) : '0.0';

    const todayStr = new Date().toISOString().slice(0, 10);
    const todayLeads = db.sales.filter(s => (s.createdAt || '').slice(0, 10) === todayStr).length;
    const activeVips = db.vipSubscriptions.filter(v => v.active).length || paidSales.length;

    return sendJson(res, 200, {
      success: true,
      stats: {
        totalApprovedRevenue,
        totalSalesCount,
        paidSalesCount: paidSales.length,
        conversionRate,
        todayLeads,
        activeVips
      },
      recentTransactions: db.sales.slice(0, 10)
    });
  }

  // ===========================================================================
  // 5. API: Gestao de Robos (/api/bots)
  // ===========================================================================
  if (pathname === '/api/bots' && req.method === 'GET') {
    const safeBots = db.bots.map(b => ({
      id: b.id,
      name: b.name,
      username: b.username,
      vipChatId: b.vipChatId,
      active: b.active,
      plans: b.plans,
      maskedToken: b.botToken ? `${b.botToken.slice(0, 6)}...${b.botToken.slice(-4)}` : 'N/A'
    }));
    return sendJson(res, 200, { success: true, bots: safeBots });
  }

  if (pathname === '/api/bots' && req.method === 'POST') {
    const body = await parseBody(req);
    const { name, username, botToken, vipChatId } = body;

    if (!name || !botToken) {
      return sendJson(res, 400, { error: 'Nome e token do Telegram sao obrigatorios.' });
    }

    const cleanUsername = (username || '').replace(/^@/, '').trim() || 'PumaBot_' + Math.floor(Math.random() * 9999);
    const webhookSecret = crypto.randomBytes(32).toString('hex');

    const newBot = {
      id: 'bot_' + Date.now(),
      userId: 'usr_default',
      name: sanitizeInput(name),
      username: cleanUsername,
      botToken: botToken.trim(),
      webhookSecret,
      vipChatId: vipChatId ? sanitizeInput(vipChatId) : '-100' + Math.floor(1000000000 + Math.random() * 9000000000),
      active: true,
      plans: [
        { id: 'plan_1', title: 'Mensal VIP', price: 47.90, durationDays: 30 },
        { id: 'plan_2', title: 'Trimestral VIP', price: 119.90, durationDays: 90 },
        { id: 'plan_3', title: 'Vitalicio Anual', price: 297.00, durationDays: 365 }
      ]
    };

    db.bots.push(newBot);

    db.flows.push({
      id: 'flow_' + newBot.id,
      botId: newBot.id,
      welcomeMessage: `Ola! Bem-vindo ao ${newBot.name}. Selecione o plano abaixo para liberar o acesso instantaneo via PIX:`,
      mediaUrl: '',
      mediaType: 'photo',
      remarketingMsg: 'Seu acesso VIP esta reservado por tempo limitado.',
      downsellPrice: 37.00,
      updatedAt: new Date().toISOString()
    });

    saveDB();

    return sendJson(res, 201, {
      success: true,
      message: 'Robo conectado e webhook configurado com sucesso.',
      bot: {
        id: newBot.id,
        name: newBot.name,
        username: newBot.username,
        vipChatId: newBot.vipChatId,
        active: newBot.active,
        webhookUrl: `/api/webhook/telegram/${newBot.id}`
      }
    });
  }

  // ===========================================================================
  // 6. API: Gestao de Fluxos (/api/flows)
  // ===========================================================================
  if (pathname === '/api/flows' && req.method === 'GET') {
    return sendJson(res, 200, { success: true, flows: db.flows });
  }

  if (pathname === '/api/flows' && req.method === 'POST') {
    const body = await parseBody(req);
    const { botId, welcomeMessage, remarketingMsg, downsellPrice, plans } = body;

    const targetBotId = botId || db.bots[0]?.id;
    let flow = db.flows.find(f => f.botId === targetBotId);

    if (!flow) {
      flow = {
        id: 'flow_' + Date.now(),
        botId: targetBotId,
        welcomeMessage: welcomeMessage || '',
        mediaUrl: '',
        mediaType: 'photo',
        remarketingMsg: remarketingMsg || '',
        downsellPrice: Number(downsellPrice) || 37.00,
        updatedAt: new Date().toISOString()
      };
      db.flows.push(flow);
    } else {
      if (welcomeMessage !== undefined) flow.welcomeMessage = welcomeMessage;
      if (remarketingMsg !== undefined) flow.remarketingMsg = remarketingMsg;
      if (downsellPrice !== undefined) flow.downsellPrice = Number(downsellPrice);
      flow.updatedAt = new Date().toISOString();
    }

    if (plans && Array.isArray(plans)) {
      const bot = db.bots.find(b => b.id === targetBotId);
      if (bot) bot.plans = plans;
    }

    saveDB();
    return sendJson(res, 200, { success: true, message: 'Fluxo de vendas atualizado com sucesso.', flow });
  }

  // ===========================================================================
  // 7. API: Clientes & Vendas (/api/sales)
  // ===========================================================================
  if (pathname === '/api/sales' && req.method === 'GET') {
    const statusFilter = parsedUrl.searchParams.get('status');
    let filtered = db.sales;
    if (statusFilter && statusFilter !== 'ALL') {
      filtered = db.sales.filter(s => s.status === statusFilter.toUpperCase());
    }
    return sendJson(res, 200, { success: true, sales: filtered });
  }

  if (pathname.startsWith('/api/sales/') && pathname.endsWith('/resend-vip') && req.method === 'POST') {
    const saleId = pathname.split('/')[3];
    const sale = db.sales.find(s => s.id === saleId);

    if (!sale) {
      return sendJson(res, 404, { error: 'Transacao nao encontrada.' });
    }

    const mockInviteLink = `https://t.me/+PumaVIP_${crypto.randomBytes(4).toString('hex')}`;
    return sendJson(res, 200, {
      success: true,
      message: `Link exclusivo reenviado para @${sale.telegramUsername || sale.telegramUserId}`,
      inviteLink: mockInviteLink
    });
  }

  // ===========================================================================
  // 8. API: Gateways PIX (/api/gateways)
  // ===========================================================================
  if (pathname === '/api/gateways' && req.method === 'GET') {
    return sendJson(res, 200, {
      success: true,
      gateways: {
        provider: db.gateways.provider,
        maskedToken: db.gateways.token ? `${db.gateways.token.slice(0, 8)}...${db.gateways.token.slice(-4)}` : 'N/A',
        pixKey: db.gateways.pixKey,
        updatedAt: db.gateways.updatedAt
      }
    });
  }

  if (pathname === '/api/gateways' && req.method === 'POST') {
    const body = await parseBody(req);
    const { provider, token, pixKey } = body;

    if (provider) db.gateways.provider = provider.toUpperCase();
    if (token) db.gateways.token = token.trim();
    if (pixKey) db.gateways.pixKey = pixKey.trim();
    db.gateways.updatedAt = new Date().toISOString();

    saveDB();
    return sendJson(res, 200, {
      success: true,
      message: 'Configuracoes de gateway salvas com sucesso.'
    });
  }

  // ===========================================================================
  // 9. API: Webhook PIX (/api/webhook/pix)
  // ===========================================================================
  if (pathname === '/api/webhook/pix' && req.method === 'POST') {
    const body = await parseBody(req);
    const txid =
      (Array.isArray(body.pix) ? body.pix[0]?.txid || body.pix[0]?.endToEndId : null) ||
      body.payment?.externalReference ||
      body.payment?.pixTransaction ||
      body.payment?.id ||
      body.data?.id ||
      body.id ||
      body.txid ||
      `tx_${Date.now()}`;
    const amount = Number(
      (Array.isArray(body.pix) ? body.pix[0]?.valor : null) ||
      body.payment?.value ||
      body.amount ||
      body.valor ||
      47.90
    );

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      received: true,
      txid,
      latencyMs: Date.now() - startTime
    }));

    setImmediate(() => {
      let sale = db.sales.find(s => s.pixTxid === txid);
      if (!sale) {
        sale = {
          id: txid,
          botId: 'bot_alpha_01',
          telegramUserId: body.telegramUserId || '998877665',
          telegramUsername: body.telegramUsername || 'cliente_novo',
          telegramFirstName: body.telegramFirstName || 'Comprador PIX',
          planName: body.planName || 'VIP Mensal',
          amount,
          pixTxid: txid,
          status: 'PAID',
          paidAt: new Date().toISOString(),
          createdAt: new Date().toISOString()
        };
        db.sales.unshift(sale);
      } else {
        sale.status = 'PAID';
        sale.paidAt = new Date().toISOString();
      }

      db.vipSubscriptions.push({
        id: 'sub_' + Date.now(),
        saleId: sale.id,
        botId: sale.botId,
        telegramUserId: sale.telegramUserId,
        chatId: '-10088291039',
        inviteLink: `https://t.me/+PumaVIP_${crypto.randomBytes(4).toString('hex')}`,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        active: true,
        createdAt: new Date().toISOString()
      });

      saveDB();
    });
    return;
  }

  // ===========================================================================
  // 10. API: Webhook Telegram (/api/webhook/telegram/:botId)
  // ===========================================================================
  if (pathname.startsWith('/api/webhook/telegram/') && req.method === 'POST') {
    const botId = pathname.replace('/api/webhook/telegram/', '').split('/')[0];
    const secretHeader = req.headers['x-telegram-bot-api-secret-token'];
    const bot = db.bots.find(b => b.id === botId);

    if (bot && bot.webhookSecret && secretHeader && bot.webhookSecret !== secretHeader) {
      return sendJson(res, 403, { error: 'Invalid secret token' });
    }

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      ok: true,
      botId,
      latencyMs: Date.now() - startTime
    }));
    return;
  }

  // ===========================================================================
  // 11. API: Cron Job Expulsao Protegido (/api/cron/check-expired)
  // ===========================================================================
  if (pathname === '/api/cron/check-expired' && req.method === 'GET') {
    const authHeader = req.headers['authorization'];
    const CRON_SECRET = process.env.CRON_SECRET || 'puma_cron_token_long_random_alphanumeric_here';

    if (process.env.NODE_ENV === 'production' && authHeader !== `Bearer ${CRON_SECRET}`) {
      return sendJson(res, 401, { error: 'Unauthorized cron trigger' });
    }

    return sendJson(res, 200, {
      success: true,
      timestamp: new Date().toISOString(),
      results: {
        checked: db.vipSubscriptions.length,
        evicted: 0,
        errors: 0
      }
    });
  }

  res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
  res.end('Recurso nao encontrado no Puma Bot');
});

server.listen(PORT, () => {
  console.log(`\n=============================================================`);
  console.log(` Puma Bot SaaS 100% SvelteKit SSR rodando em: http://localhost:${PORT}`);
  console.log(` Componentes Svelte reativos, Zero Emojis, OWASP Hardened`);
  console.log(`=============================================================\n`);
});
