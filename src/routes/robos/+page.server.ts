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

    const formattedBots = bots.map((b: any) => ({
      id: b.id,
      name: b.name,
      username: b.username,
      vipChatId: b.vipChatId,
      active: b.active,
      maskedToken: b.botToken ? `${b.botToken.slice(0, 6)}...${b.botToken.slice(-4)}` : 'N/A',
      salesCount: b._count?.sales ?? 0,
      vipCount: b._count?.vipSubscriptions ?? 0
    }));

    return { bots: formattedBots };
  } catch (e) {
    return { bots: [] };
  }
};
