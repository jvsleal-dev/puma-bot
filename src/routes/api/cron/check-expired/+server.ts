// ============================================================================
// Cron Job: Expulsão de Membros Inadimplentes e Mensagem de Renovação
// URL: /api/cron/check-expired (Executado a cada 5 minutos)
// ============================================================================

import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { prisma } from '$lib/server/prisma';
import { kickExpiredMember, sendTelegramMessage } from '$lib/server/telegram';
import { env } from '$lib/server/config';

export const GET: RequestHandler = async ({ request }) => {
 const authHeader = request.headers.get('authorization');
 const expectedAuth = `Bearer ${env.CRON_SECRET}`;

 // 1. Proteção de Segurança via Token de Autorização
 if (authHeader !== expectedAuth && process.env.NODE_ENV === 'production') {
 return json({ error: 'Unauthorized cron trigger' }, { status: 401 });
 }

 const now = new Date();
 const results = {
 checked: 0,
 evicted: 0,
 errors: 0
 };

 try {
 // 2. Busca ultra-rápida indexada: active = true e expiresAt < now()
 const expiredSubscriptions = await prisma.vipSubscription.findMany({
 where: {
 active: true,
 expiresAt: {
 lt: now
 }
 },
 include: {
 bot: {
 include: {
 flow: true
 }
 }
 },
 take: 50 // Lote de segurança de 50 por ciclo de 5min
 });

 results.checked = expiredSubscriptions.length;

 // 3. Processamento em paralelo com Promise.allSettled
 const evictions = expiredSubscriptions.map(async (sub: any) => {
 const bot = sub.bot;
 if (!bot) return;

 try {
 // Expulsa o membro do canal/grupo VIP no Telegram
 await kickExpiredMember(bot.botToken, sub.chatId, sub.telegramUserId);

 // Desativa a assinatura no banco de dados
 await prisma.vipSubscription.update({
 where: { id: sub.id },
 data: { active: false }
 });

 results.evicted++;

 // Mensagem amigável de renovação no privado do usuário
 const renewalMessage =
 ` <b>SEU ACESSO VIP EXPIROU!</b>\n\n` +
 `Sua assinatura no grupo VIP chegou ao fim.\n` +
 `Para não perder as oportunidades e novos conteúdos, renove seu acesso agora com aprovação imediata via PIX:`;

 const keyboard = [
 [{ text: ' RENOVAR MEU ACESSO VIP AGORA', callback_data: 'buy:renewal' }]
 ];

 await sendTelegramMessage(bot.botToken, sub.telegramUserId, renewalMessage, {
 inline_keyboard: keyboard
 });
 } catch (subErr: any) {
 console.error(`[Cron Eviction Error] Sub ${sub.id}:`, subErr);
 results.errors++;
 }
 });

 await Promise.allSettled(evictions);

 return json({
 success: true,
 timestamp: now.toISOString(),
 results
 });
 } catch (error: any) {
 console.error('[Cron check-expired Fatal]:', error);
 return json({ error: error?.message }, { status: 500 });
 }
};

