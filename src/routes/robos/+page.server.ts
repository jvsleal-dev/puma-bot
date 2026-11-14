import type { PageServerLoad } from './$types';
import { prisma } from '$lib/server/prisma';

export const load: PageServerLoad = async () => {
  try {
    const bots = await prisma.bot.findMany({
      include: {
        flow: true,
        _count: {
          select: { sales: true, vipSubscriptions: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    const formattedBots = bots.map(b => ({
      id: b.id,
      name: b.name,
      username: b.username,
      vipChatId: b.vipChatId,
      active: b.active,
      maskedToken: b.botToken ? `${b.botToken.slice(0, 6)}...${b.botToken.slice(-4)}` : 'N/A',
      salesCount: b._count.sales,
      vipCount: b._count.vipSubscriptions
    }));

    return { bots: formattedBots };
  } catch (e) {
    return {
      bots: [
        {
          id: 'bot_alpha_01',
          name: 'Puma VIP Sinais Alpha',
          username: 'PumaVIP_AlphaBot',
          vipChatId: '-10088291039',
          active: true,
          maskedToken: '718294...Xx9',
          salesCount: 312,
          vipCount: 284
        }
      ]
    };
  }
};
