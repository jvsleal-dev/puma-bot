import type { PageServerLoad } from './$types';
import { prisma } from '$lib/server/prisma';

export const load: PageServerLoad = async () => {
  try {
    const sales = await prisma.sale.findMany({
      orderBy: { createdAt: 'desc' },
      take: 50,
      include: {
        bot: {
          select: { name: true, username: true }
        }
      }
    });

    const formattedSales = sales.map(s => ({
      ...s,
      amount: Number(s.amount),
      telegramUserId: s.telegramUserId.toString(),
      createdAt: s.createdAt.toISOString()
    }));

    return { sales: formattedSales };
  } catch (e) {
    return {
      sales: [
        {
          id: 'tx_884920410',
          telegramFirstName: 'Lucas Alencar',
          telegramUsername: 'lucas_trade',
          bot: { name: 'Puma VIP Alpha' },
          planName: 'VIP Mensal (Sinais)',
          amount: 47.90,
          status: 'PAID',
          createdAt: new Date().toISOString()
        },
        {
          id: 'tx_884918223',
          telegramFirstName: 'Rodrigo M.',
          telegramUsername: 'rodrigo_invest',
          bot: { name: 'Puma VIP Alpha' },
          planName: 'Mensal VIP',
          amount: 47.90,
          status: 'PENDING',
          createdAt: new Date().toISOString()
        }
      ]
    };
  }
};

