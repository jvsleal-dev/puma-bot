// ============================================================================
// High-Speed Telegram Webhook Endpoint - Fail-Fast (< 50ms Response Time)
// URL: /api/webhook/telegram/[botId]
// ============================================================================

import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { prisma } from '$lib/server/prisma';
import {
 sendTelegramMessage,
 sendTelegramMedia,
 answerCallbackQuery
} from '$lib/server/telegram';
import { createPixCharge } from '$lib/server/pix-gateway';

export const POST: RequestHandler = async ({ params, request, platform }) => {
 const startTime = Date.now();
 const botId = params.botId;

 // 1. Validação rápida do Secret Token do Telegram
 const secretHeader = request.headers.get('x-telegram-bot-api-secret-token');

 let payload: any;
 try {
 payload = await request.json();
 } catch (e) {
 return json({ ok: false, error: 'Invalid JSON payload' }, { status: 400 });
 }

 // 2. Tarefa em Segundo Plano Não-Bloqueante (Background Processing)
 const backgroundTask = async () => {
 try {
 // Busca otimizada do Bot e do Funil de Vendas associado
 const bot = await prisma.bot.findUnique({
 where: { id: botId },
 include: { flow: true }
 });

 if (!bot || !bot.active) {
 console.warn(`[Webhook Telegram] Bot ${botId} inativo ou inexistente.`);
 return;
 }

 // Validação de Secret Token se configurado
 if (bot.webhookSecret && secretHeader && bot.webhookSecret !== secretHeader) {
 console.warn(`[Webhook Telegram] Secret token mismatch para o bot ${botId}`);
 return;
 }

 // -----------------------------------------------------------------------
 // A) Mensagem de Texto ou Comando /start
 // -----------------------------------------------------------------------
 if (payload.message) {
 const msg = payload.message;
 const chatId = msg.chat?.id;
 const text = (msg.text || '').trim();
 const from = msg.from;

 if (text.startsWith('/start') && bot.flow) {
 const flow = bot.flow;
 let plans: any[] = [];
 try {
 plans = typeof flow.plansJson === 'string' ? JSON.parse(flow.plansJson) : flow.plansJson;
 } catch (e) {
 plans = [];
 }

 // Montagem dos botões inline dos planos
 const inlineKeyboard = plans.map((plan: any) => [
 {
 text: ` ${plan.title || plan.name} — R$ ${Number(plan.price).toFixed(2).replace('.', ',')}`,
 callback_data: `buy:${plan.id || 'default'}`
 }
 ]);

 // Adicionar botão de suporte
 inlineKeyboard.push([
 { text: ' Falar com Suporte', callback_data: 'support:help' }
 ]);

 const welcomeText = flow.welcomeMessage ||
 `Olá, <b>${from?.first_name || 'Amigo'}</b>!\n\nBem-vindo à nossa comunidade VIP exclusiva.\nSelecione seu plano abaixo para liberar o acesso imediato via PIX:`;

 if (flow.mediaUrl) {
 await sendTelegramMedia(
 bot.botToken,
 chatId,
 flow.mediaUrl,
 flow.mediaType === 'VIDEO' ? 'video' : 'photo',
 welcomeText,
 { inline_keyboard: inlineKeyboard }
 );
 } else {
 await sendTelegramMessage(bot.botToken, chatId, welcomeText, {
 inline_keyboard: inlineKeyboard
 });
 }
 }
 }

 // -----------------------------------------------------------------------
 // B) Callback Query (Clique nos Botões Inline)
 // -----------------------------------------------------------------------
 if (payload.callback_query) {
 const cb = payload.callback_query;
 const callbackId = cb.id;
 const data = cb.data || '';
 const chatId = cb.message?.chat?.id;
 const from = cb.from;

 // Responde o Telegram IMEDIATAMENTE para tirar o loading do botão
 await answerCallbackQuery(bot.botToken, callbackId);

 if (data.startsWith('buy:')) {
 const planId = data.split(':')[1];
 const flow = bot.flow;

 let plans: any[] = [];
 try {
 plans = typeof flow?.plansJson === 'string' ? JSON.parse(flow?.plansJson) : flow?.plansJson || [];
 } catch (e) {
 plans = [];
 }

 const selectedPlan = plans.find((p: any) => p.id === planId) || {
 id: planId,
 title: 'Assinatura VIP Mensal',
 price: 47.90,
 durationDays: 30
 };

 const amount = Number(selectedPlan.price) || 47.90;

 // Gera cobrança PIX dinamicamente
 const pixCharge = await createPixCharge({
 amount,
 description: `Acesso VIP - ${bot.name} - ${selectedPlan.title}`,
 payerName: from?.first_name
 });

 // Grava a Sale como PENDING no banco
 await prisma.sale.create({
 data: {
 botId: bot.id,
 telegramUserId: BigInt(from.id),
 telegramUsername: from.username || null,
 telegramFirstName: from.first_name || null,
 planId: selectedPlan.id,
 planName: selectedPlan.title,
 durationDays: selectedPlan.durationDays || 30,
 amount: amount,
 pixTxid: pixCharge.txid,
 pixCopyPaste: pixCharge.copyPaste,
 status: 'PENDING',
 expiresAt: pixCharge.expiresAt
 }
 });

 // Envia a mensagem do PIX Copia e Cola dentro de <code> para copiar com 1 toque
 const pixMessage =
 ` <b>PEDIDO GERADO COM SUCESSO!</b>\n\n` +
 ` <b>Plano:</b> ${selectedPlan.title}\n` +
 ` <b>Valor:</b> R$ ${amount.toFixed(2).replace('.', ',')}\n\n` +
 ` <i>Toque no código abaixo para copiar:</i>\n\n` +
 `<code>${pixCharge.copyPaste}</code>\n\n` +
 ` <i>O PIX vence em 30 minutos. Assim que pagar, seu link VIP exclusivo de uso único será entregue aqui automaticamente!</i>`;

 const pixKeyboard = [
 [{ text: ' Já realizei o pagamento / Verificar', callback_data: `check:${pixCharge.txid}` }],
 [{ text: ' Cancelar Pedido', callback_data: 'cancel:order' }]
 ];

 await sendTelegramMessage(bot.botToken, chatId, pixMessage, {
 inline_keyboard: pixKeyboard
 });
 }
 }
 } catch (bgError: any) {
 console.error('[Background Telegram Webhook Error]:', bgError);
 }
 };

 // 3. Execução Serverless não-bloqueante
 if (platform?.context?.waitUntil) {
 platform.context.waitUntil(backgroundTask());
 } else {
 // Em Node.js runtime, dispara promessa desacoplada imediatamente
 setImmediate(backgroundTask);
 }

 // 4. Retorno Fail-Fast < 50ms para o Telegram
 const latency = Date.now() - startTime;
 return json({ ok: true, latencyMs: latency });
};

