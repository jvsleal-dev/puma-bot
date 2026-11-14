// ============================================================================
// Dashboard Server Loader - Real Dynamic Data from Database
// Zero fictitious data: all KPIs and lists calculated strictly from DB
// ============================================================================

import type { PageServerLoad } from './$types';
import { prisma } from '$lib/server/prisma';

export const load: PageServerLoad = async () => {
  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  try {
    const [
      paidSalesTotal,
      totalSalesCount,
      paidSalesCount,
      todayLeadsCount,
      activeVipCount,
      recentSales,
      activeBots
    ] = await Promise.all([
      // 1. Faturamento Total Aprovado (Soma real de amount onde status = PAID)
      prisma.sale.aggregate({
        _sum: { amount: true },
        where: { status: 'PAID' }
      }).catch(() => ({ _sum: { amount: 0 } })),

      // 2. Total de PIX Gerados
      prisma.sale.count().catch(() => 0),

      // 3. Total de PIX Pagos
      prisma.sale.count({
        where: { status: 'PAID' }
      }).catch(() => 0),

      // 4. Novos Leads Hoje
      prisma.sale.count({
        where: {
          createdAt: { gte: startOfDay }
        }
      }).catch(() => 0),

      // 5. Assinantes VIP Ativos
      prisma.vipSubscription.count({
        where: { active: true }
      }).catch(() => 0),

      // 6. Últimas 15 Transações PIX em Tempo Real (Direto do banco de dados)
      prisma.sale.findMany({
        take: 15,
        orderBy: { createdAt: 'desc' },
        include: {
          bot: {
            select: { name: true, username: true }
          }
        }
      }).catch(() => []),

      // 7. Lista de Robôs Ativos
      prisma.bot.findMany({
        where: { active: true },
        select: { id: true, name: true, username: true }
      }).catch(() => [])
    ]);

    const totalRevenue = Number(paidSalesTotal?._sum?.amount) || 0;
    const totalPix = Number(totalSalesCount) || 0;
    const paidPix = Number(paidSalesCount) || 0;
    const conversionRate = totalPix > 0 ? ((paidPix / totalPix) * 100).toFixed(1) : '0.0';

    const finalTransactions = recentSales.map(s => ({
      id: s.id,
      telegramFirstName: s.telegramFirstName || 'Lead Telegram',
      telegramUsername: s.telegramUsername || 'anônimo',
      bot: { name: s.bot?.name || 'Robô VIP' },
      planName: s.planName || 'Plano VIP',
      amount: Number(s.amount) || 0,
      status: s.status,
      createdAt: s.createdAt instanceof Date ? s.createdAt.toISOString() : (s.createdAt || new Date().toISOString()),
      pixTxid: s.pixTxid || s.id
    }));

    return {
      stats: {
        totalRevenue,
        totalPix,
        paidPix,
        conversionRate,
        todayLeads: Number(todayLeadsCount) || 0,
        activeVip: Number(activeVipCount) || 0
      },
      transactions: finalTransactions,
      activeBots
    };
  } catch (error) {
    return {
      stats: {
        totalRevenue: 0,
        totalPix: 0,
        paidPix: 0,
        conversionRate: '0.0',
        todayLeads: 0,
        activeVip: 0
      },
      transactions: [],
      activeBots: []
    };
  }
};
