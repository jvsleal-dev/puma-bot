// ============================================================================
// High-Speed PIX Gateway Webhook - Idempotent, Atomic Transaction
// URL: /api/webhook/pix
// ============================================================================

import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { prisma } from '$lib/server/prisma';
import { sendTelegramMessage, createSingleUseInviteLink } from '$lib/server/telegram';

export const POST: RequestHandler = async ({ request, platform }) => {
 const startTime = Date.now();

 let body: any;
 try {
 body = await request.json();
 } catch (e) {
 return json({ ok: false, error: 'Invalid JSON' }, { status: 400 });
 }

 // Extração do txid (compatível com PushinPay, Mercado Pago ou payload genérico)
 const txid = body.id || body.txid || body.data?.id || body.pix?.txid;
 const status = (body.status || body.event || '').toUpperCase();

 if (!txid) {
 return json({ ok: false, error: 'Missing transaction id (txid)' }, { status: 400 });
 }

 // ---------------------------------------------------------------------------
 // Background Worker: Idempotência, Transação Atômica & Entrega do Convite VIP
 // ---------------------------------------------------------------------------
 const processPixPayment = async () => {
 try {
 // 1. Busca a venda associada com include do Bot
 const sale = await prisma.sale.findUnique({
 where: { pixTxid: txid },
 include: { bot: true }
 });

 if (!sale) {
 console.warn(`[Webhook PIX] Venda não encontrada para o txid: ${txid}`);
 return;
 }

 // 2. Verificação estrita de Idempotência
 if (sale.status === 'PAID') {
 console.log(`[Webhook PIX] Txid ${txid} já processado anteriormente.`);
 return;
 }

 // 3. Validação do status de pagamento aprovado
 const isPaid = status === 'PAID' || status === 'COMPLETED' || status === 'CONFIRMED' || status === 'PAYMENT.CREATED';
 if (!isPaid) {
 return;
 }

 const bot = sale.bot;
 const now = new Date();
 const expiresAt = new Date(now.getTime() + sale.durationDays * 24 * 60 * 60 * 1000);

 // 4. Criação do Link Descartável de Uso Único no Telegram (member_limit: 1)
 let inviteLink = await createSingleUseInviteLink(
 bot.botToken,
 bot.vipChatId,
 `VIP - ${sale.telegramFirstName || sale.telegramUsername || 'Comprador'}`
 );

 if (!inviteLink) {
 // Fallback para link do grupo caso falhe a permissão de criar link temporário
 inviteLink = `https://t.me/c/${bot.vipChatId.replace('-100', '')}`;
 }

 // 5. Transação Atômica no Banco de Dados
 await prisma.$transaction(async (tx: any) => {
 // Atualiza a venda para PAID
 await tx.sale.update({
 where: { id: sale.id },
 data: {
 status: 'PAID',
 paidAt: now
 }
 });

 // Cria a assinatura VIP ativa com cálculo de expiração
 await tx.vipSubscription.create({
 data: {
 saleId: sale.id,
 botId: bot.id,
 telegramUserId: sale.telegramUserId,
 chatId: bot.vipChatId,
 inviteLink: inviteLink || '',
 expiresAt: expiresAt,
 active: true
 }
 });

 // Registro de Auditoria / Idempotência
 await tx.webhookLog.create({
 data: {
 provider: 'PIX',
 externalId: txid,
 payload: body,
 processed: true
 }
 });
 });

 // 6. Envio Instantâneo da Mensagem de Liberação no Telegram
 const deliveryMessage =
 ` <b>PAGAMENTO CONFIRMADO COM SUCESSO!</b>\n\n` +
 ` Seu acesso ao <b>Grupo VIP</b> foi liberado!\n\n` +
 ` <b>Duração:</b> ${sale.durationDays} dias\n` +
 `⏳ <b>Válido até:</b> ${expiresAt.toLocaleDateString('pt-BR')} às ${expiresAt.toLocaleTimeString('pt-BR')}\n\n` +
 `️ <b>ATENÇÃO:</b> <i>O link abaixo é de uso único e pessoal. Ele se autodestrói após o primeiro clique!</i>`;

 const keyboard = [
 [{ text: ' ENTRAR NO GRUPO VIP AGORA', url: inviteLink }],
 [{ text: ' Meus Dados / Minha Assinatura', callback_data: 'my:subscription' }]
 ];

 await sendTelegramMessage(bot.botToken, sale.telegramUserId, deliveryMessage, {
 inline_keyboard: keyboard
 });

 console.log(`[Webhook PIX] Sucesso: Venda ${sale.id} entregue ao lead ${sale.telegramUserId}`);
 } catch (err: any) {
 console.error('[Webhook PIX Background Error]:', err);
 }
 };

 // Disparo assíncrono não-bloqueante
 if (platform?.context?.waitUntil) {
 platform.context.waitUntil(processPixPayment());
 } else {
 setImmediate(processPixPayment);
 }

 // Retorno Imediato < 50ms para o Gateway bancário
 return json({
 received: true,
 txid,
 latencyMs: Date.now() - startTime
 });
};

