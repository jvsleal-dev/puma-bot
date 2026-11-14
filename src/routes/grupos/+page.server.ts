// ============================================================================
// Grupos VIP Server Loader - Dynamic Data from Database
// URL: /grupos
// ============================================================================

import type { PageServerLoad } from './$types';
import { prisma } from '$lib/server/prisma';

export const load: PageServerLoad = async () => {
  try {
    const [bots, subscriptions] = await Promise.all([
      prisma.bot.findMany({
        include: {
          flow: true,
          _count: {
            select: { vipSubscriptions: true, sales: true }
          }
        }
      }),
      prisma.vipSubscription.findMany({
        where: { active: true },
        take: 50,
        orderBy: { createdAt: 'desc' },
        include: {
          bot: { select: { name: true, username: true } },
          sale: { select: { planName: true, telegramFirstName: true, telegramUsername: true } }
        }
      })
    ]);

    const groups = bots.map((bot: any) => ({
      id: bot.id,
      name: `Comunidade VIP - ${bot.name}`,
      botName: bot.name,
      botUsername: bot.username,
      chatId: bot.vipChatId,
      activeMembersCount: bot._count?.vipSubscriptions || 0,
      totalSalesCount: bot._count?.sales || 0,
      active: bot.active,
      createdAt: bot.createdAt
    }));

    return {
      groups,
      recentMembers: subscriptions.map((s: any) => ({
        id: s.id,
        telegramUserId: s.telegramUserId.toString(),
        name: s.sale?.telegramFirstName || s.sale?.telegramUsername || 'Membro VIP',
        botName: s.bot?.name || 'Bot VIP',
        planName: s.sale?.planName || 'Assinatura',
        expiresAt: s.expiresAt,
        inviteLink: s.inviteLink
      }))
    };
  } catch (err: any) {
    return {
      groups: [],
      recentMembers: []
    };
  }
};

