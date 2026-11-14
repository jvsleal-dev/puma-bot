// ============================================================================
// Remarketing Server Loader - Real Dynamic Data from Database
// URL: /remarketing
// ============================================================================

import type { PageServerLoad } from './$types';
import { prisma } from '$lib/server/prisma';

export const load: PageServerLoad = async () => {
  try {
    const [flow, pendingSales, paidSales] = await Promise.all([
      prisma.flow.findFirst(),
      prisma.sale.findMany({
        where: { status: 'PENDING' },
        orderBy: { createdAt: 'desc' },
        take: 30,
        include: {
          bot: { select: { name: true, username: true } }
        }
      }),
      prisma.sale.count({ where: { status: 'PAID' } })
    ]);

    const formattedPending = pendingSales.map((s: any) => ({
      id: s.id,
      name: s.telegramFirstName || s.telegramUsername || 'Lead Pendente',
      username: s.telegramUsername || 'anônimo',
      botName: s.bot?.name || 'Bot VIP',
      planName: s.planName,
      amount: Number(s.amount),
      createdAt: s.createdAt,
      pixTxid: s.pixTxid
    }));

    return {
      flow: {
        remarketingMsg: flow?.remarketingMsg || 'Ola! Notamos que seu PIX VIP ainda nao foi compensado. Garanta sua vaga com valor especial antes que expire!',
        downsellPrice: Number(flow?.downsellPrice) || 37.00
      },
      pendingSales: formattedPending,
      stats: {
        pendingCount: pendingSales.length,
        recoveredCount: paidSales
      }
    };
  } catch (err: any) {
    return {
      flow: {
        remarketingMsg: 'Ola! Garanta seu acesso antes que expire.',
        downsellPrice: 37.00
      },
      pendingSales: [],
      stats: { pendingCount: 0, recoveredCount: 0 }
    };
  }
};
