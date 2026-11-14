// ============================================================================
// Service: PIX Liquidation & Access Fulfillment
// ============================================================================

import { createPixCharge, type PixChargeRequest, type PixChargeResponse } from '$lib/server/pix-gateway';
import type { ISaleRepository, IVipSubscriptionRepository, IBotRepository } from '$lib/domain/repositories';
import { createSingleUseInviteLink, sendTelegramMessage } from '$lib/server/telegram';

export class PixService {
 constructor(
 private saleRepo: ISaleRepository,
 private vipRepo: IVipSubscriptionRepository,
 private botRepo: IBotRepository
 ) {}

 /**
 * Gera cobrança dinâmica
 */
 async createCharge(request: PixChargeRequest): Promise<PixChargeResponse> {
 return createPixCharge(request);
 }

 /**
 * Processa webhook bancário de confirmação PIX com garantia de idempotência
 */
 async fulfillPayment(txid: string): Promise<boolean> {
 const sale = await this.saleRepo.findByTxid(txid);
 if (!sale) {
 console.warn(`[PixService] Venda não encontrada para txid ${txid}`);
 return false;
 }

 // Idempotência estrita: se já pago, encerra sem duplicar link
 if (sale.status === 'PAID') {
 return true;
 }

 const bot = await this.botRepo.findById(sale.botId);
 if (!bot) return false;

 const now = new Date();
 const expiresAt = new Date(now.getTime() + sale.durationDays * 24 * 60 * 60 * 1000);

 // Gera convite de uso único (autodestrutível)
 let inviteLink = await createSingleUseInviteLink(
 bot.botToken,
 bot.vipChatId,
 `VIP - ${sale.telegramFirstName || 'Comprador'}`
 );

 if (!inviteLink) {
 inviteLink = `https://t.me/c/${bot.vipChatId.replace('-100', '')}`;
 }

 // Atualiza status da venda
 await this.saleRepo.markAsPaid(sale.id, now);

 // Registra a assinatura ativa
 await this.vipRepo.create({
 saleId: sale.id,
 botId: bot.id,
 telegramUserId: sale.telegramUserId,
 chatId: bot.vipChatId,
 inviteLink,
 expiresAt,
 active: true
 });

 // Envia confirmação com link único para o comprador no Telegram
 const text =
 ` <b>PAGAMENTO CONFIRMADO!</b>\n\n` +
 ` Seu acesso ao <b>Grupo VIP</b> foi liberado!\n\n` +
 ` <b>Duração:</b> ${sale.durationDays} dias\n` +
 `⏳ <b>Válido até:</b> ${expiresAt.toLocaleDateString('pt-BR')} às ${expiresAt.toLocaleTimeString('pt-BR')}\n\n` +
 `️ <i>O link abaixo é pessoal e de uso único (expira após o primeiro clique):</i>`;

 await sendTelegramMessage(bot.botToken, sale.telegramUserId, text, {
 inline_keyboard: [
 [{ text: ' ENTRAR NO GRUPO VIP AGORA', url: inviteLink }]
 ]
 });

 console.log(`[PixService] Acesso liberado para o usuário ${sale.telegramUserId}`);
 return true;
 }
}
