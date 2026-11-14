import type { PageServerLoad } from './$types';
import { prisma } from '$lib/server/prisma';

export const load: PageServerLoad = async () => {
  try {
    const sales = await prisma.sale.findMany({
      orderBy: { createdAt: 'desc' },
      take: 100,
      include: {
        bot: {
          select: { name: true, username: true }
        }
      }
    });

    const formattedSales = sales.map((s: any) => ({
      id: s.id,
      botId: s.botId,
      bot: s.bot ? { name: s.bot.name, username: s.bot.username } : { name: 'Robô VIP' },
      planName: s.planName || 'Plano VIP',
      amount: Number(s.amount) || 0,
      status: s.status,
      telegramFirstName: s.telegramFirstName || '',
      telegramUsername: s.telegramUsername || '',
      telegramUserId: s.telegramUserId ? s.telegramUserId.toString() : '',
      createdAt: s.createdAt instanceof Date ? s.createdAt.toISOString() : (s.createdAt || new Date().toISOString())
    }));

    return { sales: formattedSales };
  } catch (e) {
    return { sales: [] };
  }
};
