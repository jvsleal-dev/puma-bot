// ============================================================================
// Puma Bot SaaS - High-Speed Telegram Webhook Endpoint
// Fail-Fast (< 50ms Response), Resilient Callbacks, Zero Emojis
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

  // 1. Validação rápida do Secret Token do Telegram (se enviado)
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

      // Validação de Secret Token se configurado no bot
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

          // Montagem dos botões inline dos planos (Zero Emojis)
          const inlineKeyboard = plans.map((plan: any) => [
            {
              text: `${plan.title || plan.name} — R$ ${Number(plan.price).toFixed(2).replace('.', ',')}`,
              callback_data: `buy:${plan.id || 'default'}`
            }
          ]);

          // Botão de suporte e consulta de assinatura
          inlineKeyboard.push([
            { text: 'Falar com Suporte', callback_data: 'support:help' },
            { text: 'Minha Assinatura', callback_data: 'my:subscription' }
          ]);

          const welcomeText =
            flow.welcomeMessage ||
            `Ola, <b>${from?.first_name || 'Amigo'}</b>!\n\nBem-vindo a nossa comunidade VIP exclusiva.\nSelecione seu plano abaixo para liberar o acesso imediato via PIX:`;

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
      // B) Callback Query (Cliques nos Botões Inline)
      // -----------------------------------------------------------------------
      if (payload.callback_query) {
        const cb = payload.callback_query;
        const callbackId = cb.id;
        const data = cb.data || '';
        const chatId = cb.message?.chat?.id;
        const from = cb.from;

        // Responde imediatamente para tirar o spinner do botão no app do cliente
        await answerCallbackQuery(bot.botToken, callbackId);

        // 1. Ação de Compra de Plano
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

          // Mensagem com PIX Copia e Cola dentro de <code> para copiar com 1 toque
          const pixMessage =
            `<b>PEDIDO GERADO COM SUCESSO!</b>\n\n` +
            `<b>Plano:</b> ${selectedPlan.title}\n` +
            `<b>Valor:</b> R$ ${amount.toFixed(2).replace('.', ',')}\n\n` +
            `<i>Toque no código abaixo para copiar:</i>\n\n` +
            `<code>${pixCharge.copyPaste}</code>\n\n` +
            `<i>O PIX vence em 30 minutos. Assim que pagar, seu link VIP exclusivo de uso único sera entregue aqui automaticamente.</i>`;

          const pixKeyboard = [
            [{ text: 'Ja realizei o pagamento / Verificar', callback_data: `check:${pixCharge.txid}` }],
            [{ text: 'Cancelar Pedido', callback_data: 'cancel:order' }]
          ];

          await sendTelegramMessage(bot.botToken, chatId, pixMessage, {
            inline_keyboard: pixKeyboard
          });
        }

        // 2. Ação de Verificação Manual do PIX
        else if (data.startsWith('check:')) {
          const checkTxid = data.split(':')[1];
          const sale = await prisma.sale.findFirst({
            where: {
              OR: [
                { pixTxid: checkTxid },
                { id: checkTxid }
              ]
            }
          });

          if (sale && sale.status === 'PAID') {
            const sub = await prisma.vipSubscription.findFirst({
              where: { saleId: sale.id }
            });

            const link = sub?.inviteLink || `https://t.me/c/${bot.vipChatId.replace('-100', '')}`;
            await answerCallbackQuery(bot.botToken, callbackId, 'Pagamento confirmado com sucesso!', false);
            await sendTelegramMessage(
              bot.botToken,
              chatId,
              `<b>PAGAMENTO CONFIRMADO!</b>\n\nSeu acesso ja esta liberado. Toque abaixo para entrar:`,
              {
                inline_keyboard: [[{ text: 'ENTRAR NO GRUPO VIP', url: link }]]
              }
            );
          } else {
            // Popup nativo do Telegram sem poluir o chat
            await answerCallbackQuery(
              bot.botToken,
              callbackId,
              'Aguardando compensacao bancaria do PIX. Se voce ja realizou o pagamento, aguarde alguns instantes que a liberacao e automatica.',
              true
            );
          }
        }

        // 3. Ação de Cancelamento
        else if (data === 'cancel:order') {
          await answerCallbackQuery(bot.botToken, callbackId, 'Pedido cancelado.', false);
          await sendTelegramMessage(
            bot.botToken,
            chatId,
            `Pedido cancelado. Caso queira escolher outro plano ou reiniciar, digite /start.`
          );
        }

        // 4. Ação de Consulta de Assinatura
        else if (data === 'my:subscription') {
          const sub = await prisma.vipSubscription.findFirst({
            where: {
              telegramUserId: BigInt(from.id),
              botId: bot.id,
              active: true
            }
          });

          if (sub) {
            const daysLeft = Math.max(0, Math.ceil((new Date(sub.expiresAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24)));
            const expFormatted = new Date(sub.expiresAt).toLocaleDateString('pt-BR');
            await answerCallbackQuery(bot.botToken, callbackId, `Assinatura Ativa: ${daysLeft} dias restantes`, false);
            await sendTelegramMessage(
              bot.botToken,
              chatId,
              `<b>SUA ASSINATURA VIP</b>\n\n` +
              `<b>Status:</b> Ativa\n` +
              `<b>Validade:</b> Ate ${expFormatted} (${daysLeft} dias restantes)\n\n` +
              `Link de Acesso:\n${sub.inviteLink}`
            );
          } else {
            await answerCallbackQuery(bot.botToken, callbackId, 'Nenhuma assinatura ativa encontrada.', true);
          }
        }

        // 5. Ação de Suporte
        else if (data === 'support:help') {
          await answerCallbackQuery(bot.botToken, callbackId, 'Suporte Puma Bot', false);
          await sendTelegramMessage(
            bot.botToken,
            chatId,
            `<b>CENTRAL DE SUPORTE</b>\n\n` +
            `Precisa de ajuda com seu pagamento ou acesso?\n` +
            `Envie uma mensagem diretamente para a equipe de administradores da comunidade ou digite sua duvida aqui.`
          );
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
    setImmediate(backgroundTask);
  }

  // 4. Retorno Fail-Fast < 50ms para o Telegram
  const latency = Date.now() - startTime;
  return json({ ok: true, latencyMs: latency });
};
