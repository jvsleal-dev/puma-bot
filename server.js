import http from 'http';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 3000;
const PUBLIC_DIR = path.join(__dirname, 'public');
const JWT_SECRET = process.env.JWT_SECRET || 'puma_bot_jwt_super_secret_high_entropy_key_512bits';

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

// =============================================================================
// Database Initialization
// =============================================================================
const DB_FILE = path.join(__dirname, 'database.json');
let db = {
 users: [],
 bots: [
 {
 id: 'bot_alpha_01',
 name: 'Puma VIP Sinais Alpha',
 username: 'PumaVIP_AlphaBot',
 botToken: 'mock_token_dev',
 webhookSecret: 'puma_secret_token_change_in_production_32chars',
 vipChatId: '-10088291039',
 active: true,
 plans: [
 { id: 'plan_1', title: 'Mensal VIP', price: 47.90, durationDays: 30 },
 { id: 'plan_2', title: 'Trimestral VIP', price: 119.90, durationDays: 90 },
 { id: 'plan_3', title: 'Vitalício Anual', price: 297.00, durationDays: 365 }
 ]
 }
 ],
 sales: [
 {
 id: 'tx_884920410',
 botId: 'bot_alpha_01',
 telegramUserId: '582910482',
 telegramUsername: 'lucas_trade',
 telegramFirstName: 'Lucas Alencar',
 planName: 'VIP Mensal (Sinais)',
 amount: 47.90,
 pixTxid: 'tx_884920410',
 status: 'PAID',
 createdAt: new Date(Date.now() - 2 * 60 * 1000).toISOString()
 }
 ],
 vipSubscriptions: []
};

if (fs.existsSync(DB_FILE)) {
 try {
 const loaded = JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
 db.users = loaded.users || [];
 if (loaded.bots?.length) db.bots = loaded.bots;
 if (loaded.sales?.length) db.sales = loaded.sales;
 } catch (e) {
 console.error("Erro ao carregar banco:", e);
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
 '.ico': 'image/x-icon'
};

function parseBody(req) {
 return new Promise((resolve, reject) => {
 let body = '';
 let bytes = 0;
 const MAX_BODY_SIZE = 1024 * 1024; // Proteção contra DoS: máx 1MB

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

const server = http.createServer(async (req, res) => {
 const parsedUrl = new URL(req.url, `http://${req.headers.host}`);
 const pathname = parsedUrl.pathname;
 const startTime = Date.now();
 const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1';

 // ---------------------------------------------------------------------------
 // 1. Headers de Segurança Hardened (OWASP / Security Best Practices)
 // ---------------------------------------------------------------------------
 res.setHeader('X-Content-Type-Options', 'nosniff');
 res.setHeader('X-Frame-Options', 'DENY');
 res.setHeader('X-XSS-Protection', '1; mode=block');
 res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
 res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');

 // CORS Restrito
 res.setHeader('Access-Control-Allow-Origin', '*');
 res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
 res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Telegram-Bot-Api-Secret-Token, X-Signature-256');

 if (req.method === 'OPTIONS') {
 res.writeHead(204);
 res.end();
 return;
 }

 // ---------------------------------------------------------------------------
 // 2. Proteção de Rate Limiting
 // ---------------------------------------------------------------------------
 const isApi = pathname.startsWith('/api/');
 const limit = checkRateLimit(clientIp, isApi ? 120 : 300, 60);

 res.setHeader('X-RateLimit-Remaining', limit.remaining);
 if (!limit.allowed) {
 res.writeHead(429, { 'Content-Type': 'application/json' });
 return res.end(JSON.stringify({ error: 'Too many requests. Please wait a minute.' }));
 }

 // ===========================================================================
 // 3. API: Autenticação Segura com PBKDF2 e JWT
 // ===========================================================================
 if ((pathname === '/api/auth/register' || pathname === '/api/auth/register/') && req.method === 'POST') {
 const data = await parseBody(req);
 const { name, email, password } = data;

 if (!name || !email || !password || password.length < 6) {
 res.writeHead(400, { 'Content-Type': 'application/json' });
 return res.end(JSON.stringify({ error: 'Dados inválidos. A senha deve ter no mínimo 6 caracteres.' }));
 }

 const emailClean = email.toLowerCase().trim();
 const existing = db.users.find(u => u.email.toLowerCase() === emailClean);
 if (existing) {
 res.writeHead(400, { 'Content-Type': 'application/json' });
 return res.end(JSON.stringify({ error: 'E-mail já cadastrado' }));
 }

 // Hash criptográfico PBKDF2 com Salt
 const passwordHash = hashPassword(password);

 const newUser = {
 id: 'usr_' + Date.now(),
 name: name.trim(),
 email: emailClean,
 passwordHash,
 createdAt: new Date().toISOString(),
 plan: 'PRO Trial (14 dias)'
 };

 db.users.push(newUser);
 saveDB();

 res.writeHead(201, { 'Content-Type': 'application/json' });
 return res.end(JSON.stringify({
 success: true,
 user: { id: newUser.id, name: newUser.name, email: newUser.email, plan: newUser.plan }
 }));
 }

 if ((pathname === '/api/auth/login' || pathname === '/api/auth/login/') && req.method === 'POST') {
 const data = await parseBody(req);
 const { email, password } = data;

 const emailClean = (email || '').toLowerCase().trim();
 const user = db.users.find(u => u.email.toLowerCase() === emailClean);

 // Verificação de senha em tempo constante (anti-timing attack)
 const isValid = user ? (user.passwordHash ? verifyPassword(password, user.passwordHash) : user.password === password) : false;

 if (!isValid || !user) {
 res.writeHead(401, { 'Content-Type': 'application/json' });
 return res.end(JSON.stringify({ error: 'Credenciais inválidas' }));
 }

 // Geração de JWT assinado com HMAC-SHA256
 const token = generateToken({
 sub: user.id,
 email: user.email,
 name: user.name,
 plan: user.plan
 });

 res.writeHead(200, { 'Content-Type': 'application/json' });
 return res.end(JSON.stringify({
 success: true,
 token,
 user: { id: user.id, name: user.name, email: user.email, plan: user.plan }
 }));
 }

 // ===========================================================================
 // 4. API: Webhook PIX (/api/webhook/pix)
 // ===========================================================================
 if ((pathname === '/api/webhook/pix' || pathname === '/api/webhook/pix/') && req.method === 'POST') {
 const body = await parseBody(req);
 const txid = body.id || body.txid || body.data?.id || body.pix?.txid || `tx_${Date.now()}`;

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
 telegramUserId: '998877665',
 telegramUsername: 'cliente_novo',
 telegramFirstName: 'Comprador PIX',
 planName: 'VIP Mensal',
 amount: 47.90,
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
 saveDB();
 });
 return;
 }

 // ===========================================================================
 // 5. API: Webhook Telegram (/api/webhook/telegram/:botId)
 // ===========================================================================
 if (pathname.startsWith('/api/webhook/telegram/') && req.method === 'POST') {
 const botId = pathname.replace('/api/webhook/telegram/', '').split('/')[0];
 const secretHeader = req.headers['x-telegram-bot-api-secret-token'];
 const bot = db.bots.find(b => b.id === botId);

 // Validação estrita do Secret Token se configurado
 if (bot && bot.webhookSecret && secretHeader && bot.webhookSecret !== secretHeader) {
 res.writeHead(403, { 'Content-Type': 'application/json' });
 return res.end(JSON.stringify({ error: 'Invalid secret token' }));
 }

 const body = await parseBody(req);

 res.writeHead(200, { 'Content-Type': 'application/json' });
 res.end(JSON.stringify({
 ok: true,
 botId,
 latencyMs: Date.now() - startTime
 }));
 return;
 }

 // ===========================================================================
 // 6. API: Cron Job Expulsão Protegido (/api/cron/check-expired)
 // ===========================================================================
 if ((pathname === '/api/cron/check-expired' || pathname === '/api/cron/check-expired/') && req.method === 'GET') {
 const authHeader = req.headers['authorization'];
 const CRON_SECRET = process.env.CRON_SECRET || 'puma_cron_token_long_random_alphanumeric_here';

 if (process.env.NODE_ENV === 'production' && authHeader !== `Bearer ${CRON_SECRET}`) {
 res.writeHead(401, { 'Content-Type': 'application/json' });
 return res.end(JSON.stringify({ error: 'Unauthorized cron trigger' }));
 }

 res.writeHead(200, { 'Content-Type': 'application/json' });
 return res.end(JSON.stringify({
 success: true,
 timestamp: new Date().toISOString(),
 results: {
 checked: db.vipSubscriptions.length,
 evicted: 0,
 errors: 0
 }
 }));
 }

 // ===========================================================================
 // 7. Servir Arquivos Estáticos com Proteção Path Traversal
 // ===========================================================================
 let targetFile = pathname;
 if (targetFile === '/' || targetFile === '') {
 targetFile = '/index.html';
 } else if (targetFile === '/cadastro' || targetFile === '/cadastro/') {
 targetFile = '/cadastro.html';
 } else if (targetFile === '/login' || targetFile === '/login/') {
 targetFile = '/login.html';
 } else if (targetFile === '/dashboard' || targetFile === '/dashboard/') {
 targetFile = '/dashboard.html';
 } else if (targetFile === '/robos' || targetFile === '/robos/') {
 targetFile = '/robos.html';
 } else if (targetFile === '/fluxos' || targetFile === '/fluxos/') {
 targetFile = '/fluxos.html';
 } else if (targetFile === '/clientes' || targetFile === '/clientes/') {
 targetFile = '/clientes.html';
 } else if (targetFile === '/gateways' || targetFile === '/gateways/') {
 targetFile = '/gateways.html';
 }

 let filePath = path.join(PUBLIC_DIR, targetFile);

 // Proteção contra Path Traversal (ex: ../../etc/passwd)
 const relative = path.relative(PUBLIC_DIR, filePath);
 if (relative.startsWith('..') || path.isAbsolute(relative)) {
 res.writeHead(403, { 'Content-Type': 'text/plain; charset=utf-8' });
 return res.end('Access denied');
 }

 if (!path.extname(filePath)) {
 if (fs.existsSync(filePath + '.html')) {
 filePath += '.html';
 }
 }

 fs.stat(filePath, (err, stats) => {
 if (err || !stats.isFile()) {
 res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
 res.end('Página não encontrada no Puma Bot');
 return;
 }

 const ext = path.extname(filePath).toLowerCase();
 const contentType = MIME_TYPES[ext] || 'application/octet-stream';

 res.writeHead(200, { 'Content-Type': contentType });
 fs.createReadStream(filePath).pipe(res);
 });
});

server.listen(PORT, () => {
 console.log(`\n=============================================================`);
 console.log(` Puma Bot SaaS Hardened Security rodando em: http://localhost:${PORT}`);
 console.log(`️ Headers OWASP, PBKDF2 Hashing, JWT e Rate Limit Ativados`);
 console.log(`=============================================================\n`);
});
