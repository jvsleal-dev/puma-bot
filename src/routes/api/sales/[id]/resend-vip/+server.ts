// ============================================================================
// Puma Bot SaaS - API Resend VIP Invite Link
// URL: /api/sales/[id]/resend-vip
// ============================================================================

import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { prisma } from '$lib/server/prisma';
import { createSingleUseInviteLink, sendTelegramMessage } from '$lib/server/telegram';

export const POST: RequestHandler = async ({ params }) => {
  const saleId = params.id;

  try {
    const sale = await prisma.sale.findUnique({
      where: { id: saleId },
      include: { bot: true }
    });

    if (!sale) {
      return json({ error: 'Venda nao encontrada.' }, { status: 404 });
    }

    const bot = sale.bot;
    if (!bot) {
      return json({ error: 'Robo associado nao encontrado.' }, { status: 404 });
    }

    const inviteLink = await createSingleUseInviteLink(
      bot.botToken,
      bot.vipChatId,
      `VIP Resend - ${sale.telegramFirstName || 'Lead'}`
    );

    const message =
      `<b>SEU LINK DE ACESSO VIP EXCLUSIVO</b>\n\n` +
      `Ola, <b>${sale.telegramFirstName || 'Amigo'}</b>!\n` +
      `Aqui esta seu link de uso unico para entrar na comunidade VIP:\n\n` +
      `<i>O link se autodestroi apos o primeiro clique.</i>`;

    await sendTelegramMessage(bot.botToken, sale.telegramUserId, message, {
      inline_keyboard: [
        [{ text: 'ENTRAR NO GRUPO VIP AGORA', url: inviteLink || `https://t.me/c/${bot.vipChatId.replace('-100', '')}` }]
      ]
    });

    return json({
      success: true,
      message: `Link VIP reenviado com sucesso para @${sale.telegramUsername || sale.telegramUserId}`,
      inviteLink
    });
  } catch (err: any) {
    console.error('[Resend VIP error]:', err);
    return json({ error: err?.message || 'Falha ao reenviar link VIP' }, { status: 500 });
  }
};
