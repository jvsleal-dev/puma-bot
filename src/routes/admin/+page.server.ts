import type { PageServerLoad, Actions } from './$types';
import { prisma } from '$lib/server/prisma';
import { fail } from '@sveltejs/kit';

export const load: PageServerLoad = async () => {
  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  try {
    const [
      users,
      bots,
      allSales,
      paidSalesTotal,
      totalSalesCount,
      paidSalesCount,
      todaySalesCount,
      activeVipCount
    ] = await Promise.all([
      prisma.user.findMany({
        include: { bots: true }
      }),
      prisma.bot.findMany({
        include: { user: true }
      }),
      prisma.sale.findMany({
        take: 100,
        orderBy: { createdAt: 'desc' },
        include: { bot: true }
      }),
      prisma.sale.aggregate({
        _sum: { amount: true },
        where: { status: 'PAID' }
      }).catch(() => ({ _sum: { amount: 0 } })),
      prisma.sale.count().catch(() => 0),
      prisma.sale.count({ where: { status: 'PAID' } }).catch(() => 0),
      prisma.sale.count({ where: { createdAt: { gte: startOfDay } } }).catch(() => 0),
      prisma.vipSubscription.count({ where: { active: true } }).catch(() => 0)
    ]);

    const platformVolume = Number(paidSalesTotal?._sum?.amount) || 0;
    const pumaRevenue = paidSalesCount * 0.50;
    const approvalRate = totalSalesCount > 0 ? ((paidSalesCount / totalSalesCount) * 100).toFixed(1) : '0.0';
    const averageTicket = paidSalesCount > 0 ? (platformVolume / paidSalesCount).toFixed(2) : '0.00';

    // Formatação de usuários
    const formattedUsers = users.map((u: any) => ({
      id: u.id,
      name: u.name || 'Sem nome',
      email: u.email,
      plan: u.plan || 'PRO Trial (14 dias)',
      gatewayProvider: u.gatewayProvider || 'PUSHINPAY',
      pixKey: u.pixKey || '',
      botsCount: u._count?.bots || 0,
      salesCount: u._count?.sales || 0,
      totalRevenue: Number(u.totalRevenue) || 0,
      createdAt: u.createdAt || new Date().toISOString()
    }));

    // Formatação de robôs
    const formattedBots = bots.map((b: any) => ({
      id: b.id,
      name: b.name,
      username: b.username,
      vipChatId: b.vipChatId,
      active: b.active,
      ownerName: b.user?.name || 'Operador Admin',
      ownerEmail: b.user?.email || 'admin@pumabot.com',
      salesCount: b._count?.sales || 0,
      vipCount: b._count?.vipSubscriptions || 0,
      createdAt: b.createdAt || new Date().toISOString()
    }));

    // Formatação de vendas globais
    const formattedSales = allSales.map((s: any) => ({
      id: s.id,
      amount: Number(s.amount) || 0,
      status: s.status,
      planName: s.planName || 'VIP Mensal',
      telegramFirstName: s.telegramFirstName || 'Lead Telegram',
      telegramUsername: s.telegramUsername || '',
      telegramUserId: s.telegramUserId ? s.telegramUserId.toString() : '',
      pixTxid: s.pixTxid || s.id,
      botName: s.bot?.name || 'Robô VIP',
      botUsername: s.bot?.username || 'pumabot',
      ownerName: s.bot?.user?.name || 'Operador',
      createdAt: s.createdAt instanceof Date ? s.createdAt.toISOString() : (s.createdAt || new Date().toISOString()),
      paidAt: s.paidAt ? (s.paidAt instanceof Date ? s.paidAt.toISOString() : s.paidAt) : null
    }));

    return {
      kpi: {
        totalUsers: users.length,
        totalBots: bots.length,
        totalSales: totalSalesCount,
        paidSales: paidSalesCount,
        platformVolume,
        pumaRevenue,
        approvalRate,
        averageTicket,
        activeVips: activeVipCount,
        todaySales: todaySalesCount
      },
      users: formattedUsers,
      bots: formattedBots,
      sales: formattedSales
    };
  } catch (err: any) {
    console.error('[Admin Page Load Error]:', err);
    return {
      kpi: {
        totalUsers: 0,
        totalBots: 0,
        totalSales: 0,
        paidSales: 0,
        platformVolume: 0,
        pumaRevenue: 0,
        approvalRate: '0.0',
        averageTicket: '0.00',
        activeVips: 0,
        todaySales: 0
      },
      users: [],
      bots: [],
      sales: []
    };
  }
};

export const actions: Actions = {
  updateUserPlan: async ({ request }) => {
    const formData = await request.formData();
    const userId = formData.get('userId') as string;
    const plan = formData.get('plan') as string;

    if (!userId || !plan) {
      return fail(400, { error: 'ID do usuário e plano são obrigatórios.' });
    }

    try {
      await prisma.user.update({
        where: { id: userId },
        data: { plan }
      });
      return { success: true, message: 'Plano do usuário atualizado com sucesso.' };
    } catch (e: any) {
      return fail(500, { error: 'Erro ao atualizar plano do usuário.' });
    }
  },

  toggleBotStatus: async ({ request }) => {
    const formData = await request.formData();
    const botId = formData.get('botId') as string;
    const active = formData.get('active') === 'true';

    if (!botId) {
      return fail(400, { error: 'ID do robô obrigatório.' });
    }

    try {
      await prisma.bot.update({
        where: { id: botId },
        data: { active: !active }
      });
      return { success: true, message: `Status do robô atualizado para ${!active ? 'Ativo' : 'Pausado'}.` };
    } catch (e: any) {
      return fail(500, { error: 'Erro ao alternar status do robô.' });
    }
  },

  deleteSale: async ({ request }) => {
    const formData = await request.formData();
    const saleId = formData.get('saleId') as string;

    if (!saleId) {
      return fail(400, { error: 'ID da venda é obrigatório.' });
    }

    try {
      await prisma.sale.delete({
        where: { id: saleId }
      });
      return { success: true, message: 'Transação removida do banco de dados.' };
    } catch (e: any) {
      return fail(500, { error: 'Erro ao remover transação.' });
    }
  }
};
