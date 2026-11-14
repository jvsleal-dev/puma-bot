// ============================================================================
// Service: Telegram Bot Operations & Funnel Execution
// ============================================================================

import {
 sendTelegramMessage,
 sendTelegramMedia,
 answerCallbackQuery,
 createSingleUseInviteLink,
 kickExpiredMember
} from '$lib/server/telegram';
import type { IBotRepository, IFlowRepository, ISaleRepository } from '$lib/domain/repositories';
import { PixService } from './pix-service';

export class TelegramService {
 constructor(
 private botRepo: IBotRepository,
 private flowRepo: IFlowRepository,
 private saleRepo: ISaleRepository,
 private pixService: PixService
 ) {}

 /**
 * Processa comando /start enviando funil de boas-vindas com botões dos planos
 */
 async handleStartCommand(botId: string, chatId: number | string | bigint, from: any): Promise<void> {
 const bot = await this.botRepo.findById(botId);
 if (!bot || !bot.active) return;

 const flow = await this.flowRepo.findByBotId(botId);
 if (!flow) return;

 const inlineKeyboard = flow.plans.map(p => [
 {
 text: ` ${p.title} — R$ ${p.price.toFixed(2).replace('.', ',')}`,
 callback_data: `buy:${p.id}`
 }
 ]);

 inlineKeyboard.push([
 { text: ' Falar com Suporte', callback_data: 'support:help' }
 ]);

 const welcomeText = flow.welcomeMessage.replace('{name}', from?.first_name || 'Amigo');

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

 /**
 * Processa clique em plano de compra gerando cobrança PIX imediata
 */
 async handleBuyCallback(
 botId: string,
 callbackId: string,
 chatId: number | string | bigint,
 planId: string,
 from: any
 ): Promise<void> {
 const bot = await this.botRepo.findById(botId);
 if (!bot || !bot.active) return;

 // Responde callback imediatamente para tirar o loading do botão
 await answerCallbackQuery(bot.botToken, callbackId);

 const flow = await this.flowRepo.findByBotId(botId);
 const plan = flow?.plans.find(p => p.id === planId) || {
 id: planId,
 title: 'Plano VIP',
 price: 47.90,
 durationDays: 30
 };

 // Gera cobrança via PixService
 const charge = await this.pixService.createCharge({
 amount: plan.price,
 description: `${bot.name} - ${plan.title}`,
 payerName: from?.first_name
 });

 // Salva a venda no repositório
 await this.saleRepo.create({
 botId: bot.id,
 telegramUserId: BigInt(from.id),
 telegramUsername: from.username || null,
 telegramFirstName: from.first_name || null,
 planId: plan.id,
 planName: plan.title,
 durationDays: plan.durationDays,
 amount: plan.price,
 pixTxid: charge.txid,
 pixCopyPaste: charge.copyPaste,
 status: 'PENDING',
 expiresAt: charge.expiresAt
 });

 // Envia mensagem formatada com código PIX
 const message =
 ` <b>PEDIDO GERADO COM SUCESSO!</b>\n\n` +
 ` <b>Plano:</b> ${plan.title}\n` +
 ` <b>Valor:</b> R$ ${plan.price.toFixed(2).replace('.', ',')}\n\n` +
 ` <i>Toque abaixo para copiar o código PIX:</i>\n\n` +
 `<code>${charge.copyPaste}</code>\n\n` +
 ` <i>Vencimento em 30 minutos. O link VIP será enviado automaticamente aqui após a confirmação.</i>`;

 const keyboard = [
 [{ text: ' Verificar Status do Pagamento', callback_data: `check:${charge.txid}` }]
 ];

 await sendTelegramMessage(bot.botToken, chatId, message, {
 inline_keyboard: keyboard
 });
 }

 /**
 * Expulsa membro expirado e envia oferta de renovação
 */
 async evictAndOfferRenewal(bot: any, sub: any): Promise<void> {
 await kickExpiredMember(bot.botToken, sub.chatId, sub.telegramUserId);

 const text =
 ` <b>SEU ACESSO VIP EXPIROU!</b>\n\n` +
 `Sua assinatura no grupo VIP chegou ao fim.\n` +
 `Renove agora para continuar recebendo nossos conteúdos exclusivos:`;

 await sendTelegramMessage(bot.botToken, sub.telegramUserId, text, {
 inline_keyboard: [
 [{ text: ' RENOVAR MEU ACESSO VIP AGORA', callback_data: 'buy:renewal' }]
 ]
 });
 }
}
