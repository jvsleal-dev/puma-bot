// ============================================================================
// Service Container - Dependency Injection Composition Root
// ============================================================================

import { prisma } from '$lib/server/prisma';
import type {
  IUserRepository,
  IBotRepository,
  IFlowRepository,
  ISaleRepository,
  IVipSubscriptionRepository
} from '$lib/domain/repositories';
import { TelegramService } from '$lib/services/telegram-service';
import { PixService } from '$lib/services/pix-service';
import { SubscriptionService } from '$lib/services/subscription-service';

// -----------------------------------------------------------------------------
// Implementações dos Repositórios via Prisma ORM
// -----------------------------------------------------------------------------

class PrismaUserRepository implements IUserRepository {
  async findById(id: string) {
    return prisma.user.findUnique({ where: { id } });
  }
  async findByEmail(email: string) {
    return prisma.user.findUnique({ where: { email } });
  }
  async create(user: any) {
    return prisma.user.create({ data: user });
  }
}

class PrismaBotRepository implements IBotRepository {
  async findById(id: string) {
    return prisma.bot.findUnique({ where: { id } });
  }
  async findByToken(botToken: string) {
    return prisma.bot.findUnique({ where: { botToken } });
  }
  async listByUserId(userId: string) {
    return prisma.bot.findMany({ where: { userId, active: true } });
  }
  async create(bot: any) {
    return prisma.bot.create({ data: bot });
  }
}

class PrismaFlowRepository implements IFlowRepository {
  async findByBotId(botId: string) {
    const flow = await prisma.flow.findUnique({ where: { botId } });
    if (!flow) return null;
    return {
      ...flow,
      plans: typeof flow.plansJson === 'string' ? JSON.parse(flow.plansJson) : flow.plansJson
    };
  }
  async upsert(flow: any) {
    return prisma.flow.upsert({
      where: { botId: flow.botId },
      update: { ...flow, plansJson: flow.plans },
      create: { ...flow, plansJson: flow.plans }
    });
  }
}

class PrismaSaleRepository implements ISaleRepository {
  async findById(id: string) {
    return prisma.sale.findUnique({ where: { id } });
  }
  async findByTxid(pixTxid: string) {
    return prisma.sale.findUnique({ where: { pixTxid } });
  }
  async create(sale: any) {
    return prisma.sale.create({ data: sale });
  }
  async markAsPaid(id: string, paidAt: Date) {
    return prisma.sale.update({
      where: { id },
      data: { status: 'PAID', paidAt }
    });
  }
  async getMetrics() {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const [sum, total, paid, today] = await Promise.all([
      prisma.sale.aggregate({ _sum: { amount: true }, where: { status: 'PAID' } }),
      prisma.sale.count(),
      prisma.sale.count({ where: { status: 'PAID' } }),
      prisma.sale.count({ where: { createdAt: { gte: startOfDay } } })
    ]);

    return {
      totalRevenue: Number(sum._sum?.amount || 0),
      totalPix: total,
      paidPix: paid,
      todayLeads: today
    };
  }
}

class PrismaVipSubscriptionRepository implements IVipSubscriptionRepository {
  async findBySaleId(saleId: string) {
    return prisma.vipSubscription.findUnique({ where: { saleId } });
  }
  async create(sub: any) {
    return prisma.vipSubscription.create({ data: sub });
  }
  async findExpired(now: Date) {
    return prisma.vipSubscription.findMany({
      where: {
        active: true,
        expiresAt: { lt: now }
      },
      take: 50
    });
  }
  async deactivate(id: string) {
    await prisma.vipSubscription.update({
      where: { id },
      data: { active: false }
    });
  }
}

// -----------------------------------------------------------------------------
// Instâncias Singleton (Composition Root)
// -----------------------------------------------------------------------------

export const userRepository = new PrismaUserRepository();
export const botRepository = new PrismaBotRepository();
export const flowRepository = new PrismaFlowRepository();
export const saleRepository = new PrismaSaleRepository();
export const vipSubscriptionRepository = new PrismaVipSubscriptionRepository();

export const pixService = new PixService(saleRepository, vipSubscriptionRepository, botRepository);
export const telegramService = new TelegramService(botRepository, flowRepository, saleRepository, pixService);
export const subscriptionService = new SubscriptionService(vipSubscriptionRepository, botRepository, telegramService);
