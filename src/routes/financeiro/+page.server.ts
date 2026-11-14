// ============================================================================
// Financeiro Server Loader - Dynamic Financial Ledger from Database
// URL: /financeiro
// ============================================================================

import type { PageServerLoad } from './$types';
import { prisma } from '$lib/server/prisma';

export const load: PageServerLoad = async () => {
  try {
    const [paidSales, allPaidSales, user] = await Promise.all([
      prisma.sale.findMany({
        where: { status: 'PAID' },
        orderBy: { paidAt: 'desc' },
        take: 50,
        include: {
          bot: { select: { name: true, username: true } }
        }
      }),
      prisma.sale.findMany({
        where: { status: 'PAID' },
        select: { amount: true }
      }),
      prisma.user.findFirst()
    ]);

    const totalGrossRevenue = allPaidSales.reduce((acc: number, curr: any) => acc + Number(curr.amount || 0), 0);
    const totalTransactions = allPaidSales.length;
    const pumaFeesTotal = totalTransactions * 0.50; // R$ 0,50 por transação
    const netRevenue = totalGrossRevenue - pumaFeesTotal;
    const avgTicket = totalTransactions > 0 ? (totalGrossRevenue / totalTransactions) : 0;

    const formattedTransactions = paidSales.map((s: any) => ({
      id: s.id,
      buyerName: s.telegramFirstName || s.telegramUsername || 'Comprador PIX',
      botName: s.bot?.name || 'Robô VIP',
      planName: s.planName,
      grossAmount: Number(s.amount),
      pumaFee: 0.50,
      netAmount: Number(s.amount) - 0.50,
      paidAt: s.paidAt || s.createdAt,
      pixTxid: s.pixTxid
    }));

    return {
      financials: {
        totalGrossRevenue,
        pumaFeesTotal,
        netRevenue,
        totalTransactions,
        avgTicket,
        activePixKey: user?.pixKey || 'financeiro@pumabot.com.br',
        gatewayProvider: user?.gatewayProvider || 'PUSHINPAY'
      },
      transactions: formattedTransactions
    };
  } catch (err: any) {
    return {
      financials: {
        totalGrossRevenue: 0,
        pumaFeesTotal: 0,
        netRevenue: 0,
        totalTransactions: 0,
        avgTicket: 0,
        activePixKey: 'financeiro@pumabot.com.br',
        gatewayProvider: 'PUSHINPAY'
      },
      transactions: []
    };
  }
};

