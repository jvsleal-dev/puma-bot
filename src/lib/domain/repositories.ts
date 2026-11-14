// ============================================================================
// Repository Interfaces (Dependency Inversion Principle)
// ============================================================================

import type { UserEntity, BotEntity, FlowEntity, SaleEntity, VipSubscriptionEntity } from '$lib/domain/models';

export interface IUserRepository {
  findById(id: string): Promise<UserEntity | null>;
  findByEmail(email: string): Promise<UserEntity | null>;
  create(user: Omit<UserEntity, 'id' | 'createdAt' | 'updatedAt'>): Promise<UserEntity>;
}

export interface IBotRepository {
  findById(id: string): Promise<BotEntity | null>;
  findByToken(token: string): Promise<BotEntity | null>;
  listByUserId(userId: string): Promise<BotEntity[]>;
  create(bot: Omit<BotEntity, 'id' | 'createdAt' | 'updatedAt'>): Promise<BotEntity>;
}

export interface IFlowRepository {
  findByBotId(botId: string): Promise<FlowEntity | null>;
  upsert(flow: Omit<FlowEntity, 'id' | 'updatedAt'>): Promise<FlowEntity>;
}

export interface ISaleRepository {
  findById(id: string): Promise<SaleEntity | null>;
  findByTxid(txid: string): Promise<SaleEntity | null>;
  create(sale: Omit<SaleEntity, 'id' | 'createdAt'>): Promise<SaleEntity>;
  markAsPaid(id: string, paidAt: Date): Promise<SaleEntity>;
  getMetrics(): Promise<{
    totalRevenue: number;
    totalPix: number;
    paidPix: number;
    todayLeads: number;
  }>;
}

export interface IVipSubscriptionRepository {
  findBySaleId(saleId: string): Promise<VipSubscriptionEntity | null>;
  create(sub: Omit<VipSubscriptionEntity, 'id' | 'createdAt'>): Promise<VipSubscriptionEntity>;
  findExpired(now: Date): Promise<VipSubscriptionEntity[]>;
  deactivate(id: string): Promise<void>;
}
