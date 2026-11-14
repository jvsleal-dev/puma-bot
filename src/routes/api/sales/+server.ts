// ============================================================================
// Puma Bot SaaS - API Sales & Leads Management
// URL: /api/sales
// ============================================================================

import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { prisma } from '$lib/server/prisma';
import type { SaleStatus } from '$lib/domain/models';

export const GET: RequestHandler = async ({ url }) => {
  try {
    const statusParam = url.searchParams.get('status');
    const whereClause: any = {};

    if (statusParam && statusParam !== 'ALL') {
      whereClause.status = statusParam.toUpperCase() as SaleStatus;
    }

    const sales = await prisma.sale.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' },
      take: 50
    });

    const formattedSales = sales.map(s => ({
      ...s,
      amount: Number(s.amount),
      telegramUserId: s.telegramUserId.toString()
    }));

    return json({ success: true, sales: formattedSales });
  } catch (err: any) {
    return json({ success: true, sales: [] });
  }
};
