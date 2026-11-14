// ============================================================================
// Puma Bot SaaS - High-Speed Multi-Gateway PIX Webhook Processor
// Supports: PushinPay, Efí Bank (BACEN Pix Resolução nº 1), Asaas, Mercado Pago
// Fail-Safe (< 50ms Response), Idempotent, Atomic Transactions, Zero Emojis
// URL: /api/webhook/pix
// ============================================================================

import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { prisma } from '$lib/server/prisma';
import {
  sendTelegramMessage,
  createSingleUseInviteLink,
  kickExpiredMember
} from '$lib/server/telegram';

interface NormalizedPixWebhook {
  provider: 'PUSHINPAY' | 'MERCADOPAGO' | 'ASAAS' | 'EFI' | 'OPENPIX' | 'GENERIC';
  txid: string;
  isPaid: boolean;
  isRefund: boolean;
  amount?: number;
  rawStatus: string;
  externalEventId: string;
}

/**
 * Normalizador Universal Multi-Gateway para Notificações PIX
 */
function normalizePixWebhook(
  body: any,
  searchParams?: URLSearchParams
): NormalizedPixWebhook | null {
  if (!body && !searchParams) return null;

  // ---------------------------------------------------------------------------
  // 1. Efí Bank / Gerencianet (Padrão BACEN Resolução nº 1)
  // Payload: { pix: [ { endToEndId: "...", txid: "...", valor: "47.90", horario: "..." } ] }
  // ---------------------------------------------------------------------------
  if (Array.isArray(body?.pix) && body.pix.length > 0) {
    const item = body.pix[0];
    const txid = item.txid || item.endToEndId || '';
    const hasRefund = Array.isArray(item.devolucoes) && item.devolucoes.length > 0;
    return {
      provider: 'EFI',
      txid: String(txid),
      isPaid: !hasRefund,
      isRefund: hasRefund,
      amount: Number(item.valor) || undefined,
      rawStatus: hasRefund ? 'REFUNDED' : 'PAID',
      externalEventId: String(item.endToEndId || item.txid || `efi_${Date.now()}`)
    };
  }

  // ---------------------------------------------------------------------------
  // 2. Asaas API v3
  // Payload: { event: "PAYMENT_RECEIVED", payment: { id: "pay_...", value: 47.90, pixTransaction: "...", externalReference: "..." } }
  // ---------------------------------------------------------------------------
  if (body?.payment || (typeof body?.event === 'string' && body.event.startsWith('PAYMENT_'))) {
    const payment = body.payment || {};
    const event = String(body.event || '').toUpperCase();
    const txid = payment.externalReference || payment.pixTransaction || payment.id || body.id || '';
    const isPaid = event === 'PAYMENT_RECEIVED' || event === 'PAYMENT_CONFIRMED';
    const isRefund =
      event === 'PAYMENT_REFUNDED' ||
      event === 'PAYMENT_CHARGED_BACK' ||
      event === 'PAYMENT_REFUND_IN_PROGRESS';
    return {
      provider: 'ASAAS',
      txid: String(txid),
      isPaid,
      isRefund,
      amount: Number(payment.value) || undefined,
      rawStatus: event,
      externalEventId: String(body.id || payment.id || `asaas_${Date.now()}`)
    };
  }

  // ---------------------------------------------------------------------------
  // 3. Mercado Pago (Webhook JSON e Notificação IPN)
  // Webhook: { action: "payment.created"|"payment.updated", data: { id: "12345" } }
  // IPN: query string ?id=12345&topic=payment ou body { id: "12345", topic: "payment" }
  // ---------------------------------------------------------------------------
  const mpDataId =
    body?.data?.id ||
    (searchParams?.get('topic') === 'payment' ? searchParams.get('id') : null) ||
    (body?.topic === 'payment' ? body.id : null);

  if (mpDataId || body?.action?.startsWith('payment.') || body?.type === 'payment') {
    const txid = String(mpDataId || body?.data?.id || body?.id || '');
    const action = String(body?.action || body?.type || '').toLowerCase();
    const status = String(body?.data?.status || body?.status || '').toLowerCase();
    const isRefund = status === 'refunded' || status === 'charged_back';
    const isPaid = status === 'approved' || action === 'payment.created' || action === 'payment.updated';
    return {
      provider: 'MERCADOPAGO',
      txid,
      isPaid: !isRefund && isPaid,
      isRefund,
      amount: Number(body?.data?.transaction_amount || body?.transaction_amount) || undefined,
      rawStatus: status || action,
      externalEventId: String(body?.id || mpDataId || `mp_${Date.now()}`)
    };
  }

  // ---------------------------------------------------------------------------
  // 4. OpenPIX / Woovi
  // ---------------------------------------------------------------------------
  if (body?.charge?.correlationID || (typeof body?.event === 'string' && body.event.startsWith('OPENPIX:'))) {
    const correlationID = body.charge?.correlationID || body.correlationID || '';
    const event = String(body.event || '').toUpperCase();
    const isRefund = event.includes('REFUND');
    const isPaid = event === 'OPENPIX:CHARGE_COMPLETED' || event === 'OPENPIX:TRANSACTION_RECEIVED';
    const rawVal = body.charge?.value || body.pix?.value;
    return {
      provider: 'OPENPIX',
      txid: String(correlationID),
      isPaid: !isRefund && isPaid,
      isRefund,
      amount: rawVal ? Number(rawVal) / 100 : undefined,
      rawStatus: event,
      externalEventId: String(body.charge?.id || correlationID || `openpix_${Date.now()}`)
    };
  }

  // ---------------------------------------------------------------------------
  // 5. PushinPay e Gateway Padrão / Simulador de Pagamento
  // PushinPay: { id: "01J...", value: 4790, status: "paid" }
  // Generic: { txid: "...", status: "PAID", amount: 47.90 }
  // ---------------------------------------------------------------------------
  const txid = body?.id || body?.txid || body?.pixTxid || body?.pix?.txid || searchParams?.get('txid');
  if (txid) {
    const rawStatus = String(body?.status || body?.event || '').toUpperCase();
    const isPaid =
      ['PAID', 'COMPLETED', 'CONFIRMED', 'RECEIVED', 'APPROVED', 'SUCCESS'].includes(rawStatus) ||
      rawStatus === '';
    const isRefund = ['REFUNDED', 'CHARGED_BACK', 'CANCELED', 'CANCELLED'].includes(rawStatus);

    let amount = Number(body?.value !== undefined ? body.value : body?.amount);
    if (!isNaN(amount) && amount > 500 && Number.isInteger(amount)) {
      amount = amount / 100;
    }

    return {
      provider: 'PUSHINPAY',
      txid: String(txid),
      isPaid: !isRefund && isPaid,
      isRefund,
      amount: isNaN(amount) ? undefined : amount,
      rawStatus: rawStatus || 'PAID',
      externalEventId: String(body?.id || txid)
    };
  }

  return null;
}

export const POST: RequestHandler = async ({ request, url, platform }) => {
  const startTime = Date.now();

  let body: any = {};
  try {
    const text = await request.text();
    if (text) {
      body = JSON.parse(text);
    }
  } catch (e) {
    return json({ ok: false, error: 'Invalid JSON payload' }, { status: 400 });
  }

  const parsed = normalizePixWebhook(body, url.searchParams);

  if (!parsed || !parsed.txid) {
    return json({ ok: false, error: 'Missing or unparseable transaction id (txid)' }, { status: 400 });
  }

  // ---------------------------------------------------------------------------
  // Worker em Segundo Plano Não-Bloqueante (<50ms para gateway)
  // ---------------------------------------------------------------------------
  const processPixEvent = async () => {
    try {
      // 1. Busca resiliente da venda (por pixTxid ou id primário)
      const sale = await prisma.sale.findFirst({
        where: {
          OR: [
            { pixTxid: parsed.txid },
            { id: parsed.txid }
          ]
        },
        include: { bot: true }
      });

      if (!sale) {
        console.warn(`[Webhook PIX] Venda nao encontrada para txid: ${parsed.txid} (${parsed.provider})`);
        return;
      }

      const bot = sale.bot;

      // -----------------------------------------------------------------------
      // A) CASO: Pagamento Confirmado / Aprovado
      // -----------------------------------------------------------------------
      if (parsed.isPaid) {
        // Verificação estrita de Idempotência
        if (sale.status === 'PAID') {
          console.log(`[Webhook PIX] Idempotencia: txid ${parsed.txid} ja liquidado.`);
          return;
        }

        const now = new Date();
        const durationDays = sale.durationDays || 30;
        const expiresAt = new Date(now.getTime() + durationDays * 24 * 60 * 60 * 1000);

        // Cria Link Descartável de Uso Único no Telegram (member_limit: 1)
        let inviteLink: string | null = null;
        try {
          inviteLink = await createSingleUseInviteLink(
            bot.botToken,
            bot.vipChatId,
            `VIP - ${sale.telegramFirstName || sale.telegramUsername || 'Membro'}`
          );
        } catch (linkErr) {
          console.warn('[Webhook PIX] Falha ao criar inviteLink descartavel:', linkErr);
        }

        if (!inviteLink) {
          inviteLink = bot.vipChatId.startsWith('-100')
            ? `https://t.me/c/${bot.vipChatId.replace('-100', '')}`
            : `https://t.me/${bot.username}`;
        }

        // Transação Atômica no Banco de Dados
        await prisma.$transaction(async (tx: any) => {
          // Atualiza status da venda
          await tx.sale.update({
            where: { id: sale.id },
            data: {
              status: 'PAID',
              paidAt: now
            }
          });

          // Cria ou atualiza assinatura VIP ativa
          const existingSub = await tx.vipSubscription.findFirst({
            where: { saleId: sale.id }
          });

          if (!existingSub) {
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
          } else {
            await tx.vipSubscription.update({
              where: { id: existingSub.id },
              data: {
                active: true,
                expiresAt: expiresAt,
                inviteLink: inviteLink || existingSub.inviteLink
              }
            });
          }

          // Registro de Idempotência e Auditoria
          await tx.webhookLog.upsert({
            where: { externalId: parsed.externalEventId },
            create: {
              provider: parsed.provider,
              externalId: parsed.externalEventId,
              payload: body,
              processed: true
            },
            update: {
              payload: body,
              processed: true
            }
          });
        });

        // Envio Instantâneo da Mensagem de Liberação no Telegram
        const deliveryMessage =
          `<b>PAGAMENTO CONFIRMADO COM SUCESSO!</b>\n\n` +
          `Seu acesso ao <b>Grupo VIP</b> foi liberado.\n\n` +
          `<b>Duração:</b> ${durationDays} dias\n` +
          `<b>Válido até:</b> ${expiresAt.toLocaleDateString('pt-BR')} às ${expiresAt.toLocaleTimeString('pt-BR')}\n\n` +
          `<b>AVISO:</b> <i>O link abaixo é pessoal e de uso único (1 clique). Ele se autodestrói após sua entrada!</i>`;

        const keyboard = [
          [{ text: 'ENTRAR NO GRUPO VIP AGORA', url: inviteLink }],
          [{ text: 'Minha Assinatura / Validade', callback_data: 'my:subscription' }]
        ];

        try {
          await sendTelegramMessage(bot.botToken, sale.telegramUserId, deliveryMessage, {
            inline_keyboard: keyboard
          });
        } catch (msgErr) {
          console.error('[Webhook PIX] Erro ao enviar mensagem de entrega no Telegram:', msgErr);
        }

        console.log(`[Webhook PIX] Sucesso: Venda ${sale.id} (${parsed.provider}) entregue ao lead ${sale.telegramUserId}`);
        return;
      }

      // -----------------------------------------------------------------------
      // B) CASO: Estorno / Reembolso / Chargeback
      // -----------------------------------------------------------------------
      if (parsed.isRefund) {
        if (sale.status === 'REFUNDED') {
          console.log(`[Webhook PIX] Idempotencia: txid ${parsed.txid} ja estornado.`);
          return;
        }

        await prisma.$transaction(async (tx: any) => {
          await tx.sale.update({
            where: { id: sale.id },
            data: { status: 'REFUNDED' }
          });

          const sub = await tx.vipSubscription.findFirst({
            where: { saleId: sale.id }
          });

          if (sub) {
            await tx.vipSubscription.update({
              where: { id: sub.id },
              data: { active: false }
            });
          }

          await tx.webhookLog.upsert({
            where: { externalId: parsed.externalEventId },
            create: {
              provider: parsed.provider,
              externalId: parsed.externalEventId,
              payload: body,
              processed: true
            },
            update: {
              payload: body,
              processed: true
            }
          });
        });

        // Expulsa membro imediatamente do Telegram
        try {
          await kickExpiredMember(bot.botToken, bot.vipChatId, sale.telegramUserId);
        } catch (kickErr) {
          console.warn('[Webhook PIX Refund] Falha ao expulsar membro estornado:', kickErr);
        }

        const refundMessage =
          `<b>ACESSO CANCELADO - REEMBOLSO PROCESSADO</b>\n\n` +
          `Identificamos a devolução/estorno do seu pagamento referente ao <b>${sale.planName}</b>.\n` +
          `Conforme as políticas da comunidade, seu acesso ao Grupo VIP foi revogado.\n\n` +
          `Caso deseje reingressar futuramente, envie /start para assinar novamente.`;

        try {
          await sendTelegramMessage(bot.botToken, sale.telegramUserId, refundMessage);
        } catch (e) {
          // Lead pode ter bloqueado bot
        }

        console.log(`[Webhook PIX] Estorno processado: Venda ${sale.id} revogada.`);
      }
    } catch (err: any) {
      console.error('[Webhook PIX Background Error]:', err);
    }
  };

  // Disparo assíncrono desacoplado (Serverless & Node.js)
  if (platform?.context?.waitUntil) {
    platform.context.waitUntil(processPixEvent());
  } else {
    setImmediate(processPixEvent);
  }

  // Retorno Imediato < 50ms para o Gateway
  return json({
    received: true,
    provider: parsed.provider,
    txid: parsed.txid,
    isPaid: parsed.isPaid,
    isRefund: parsed.isRefund,
    latencyMs: Date.now() - startTime
  });
};
