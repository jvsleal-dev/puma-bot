// ============================================================================
// Puma Bot SaaS - API Telemetry & Stats (100% Dynamic from Database)
// URL: /api/stats
// ============================================================================

import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { prisma } from '$lib/server/prisma';

export const GET: RequestHandler = async () => {
  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  try {
    const [paidSales, totalSales, recentSales, activeVips, todayLeads] = await Promise.all([
      prisma.sale.aggregate({
        _sum: { amount: true },
        _count: { id: true },
        where: { status: 'PAID' }
      }),
      prisma.sale.count(),
      prisma.sale.findMany({
        take: 10,
        orderBy: { createdAt: 'desc' }
      }),
      prisma.vipSubscription.count({
        where: { active: true }
      }),
      prisma.sale.count({
        where: {
          createdAt: { gte: startOfDay }
        }
      })
    ]);

    const totalApprovedRevenue = Number(paidSales?._sum?.amount) || 0;
    const paidCount = Number(paidSales?._count?.id) || 0;
    const conversionRate = totalSales > 0 ? ((paidCount / totalSales) * 100).toFixed(1) : '0.0';

    return json({
      success: true,
      stats: {
        totalApprovedRevenue,
        totalSalesCount: totalSales,
        paidSalesCount: paidCount,
        conversionRate,
        todayLeads,
        activeVips
      },
      recentTransactions: recentSales.map((s: any) => ({
        ...s,
        amount: Number(s.amount) || 0,
        telegramUserId: s.telegramUserId ? s.telegramUserId.toString() : '0'
      }))
    });
  } catch (err: any) {
    console.error('[API stats error]:', err);
    return json({
      success: true,
      stats: {
        totalApprovedRevenue: 0,
        totalSalesCount: 0,
        paidSalesCount: 0,
        conversionRate: '0.0',
        todayLeads: 0,
        activeVips: 0
      },
      recentTransactions: []
    });
  }
};
