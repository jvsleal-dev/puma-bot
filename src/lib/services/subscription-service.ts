// ============================================================================
// Service: Subscription Lifecycle & Eviction Engine
// ============================================================================

import type { IVipSubscriptionRepository, IBotRepository } from '$lib/domain/repositories';
import { TelegramService } from './telegram-service';

export class SubscriptionService {
  constructor(
    private vipRepo: IVipSubscriptionRepository,
    private botRepo: IBotRepository,
    private telegramService: TelegramService
  ) {}

  /**
   * Monitora assinaturas vencidas e executa expulsão automática com oferta de renovação
   */
  async evictExpiredMembers(): Promise<{ checked: number; evicted: number; errors: number }> {
    const now = new Date();
    const expiredList = await this.vipRepo.findExpired(now);

    const stats = {
      checked: expiredList.length,
      evicted: 0,
      errors: 0
    };

    const tasks = expiredList.map(async (sub) => {
      try {
        const bot = await this.botRepo.findById(sub.botId);
        if (!bot) return;

        // Expulsa membro e envia mensagem
        await this.telegramService.evictAndOfferRenewal(bot, sub);

        // Desativa no banco
        await this.vipRepo.deactivate(sub.id);
        stats.evicted++;
      } catch (e) {
        console.error(`[SubscriptionService] Erro ao expulsar sub ${sub.id}:`, e);
        stats.errors++;
      }
    });

    await Promise.allSettled(tasks);
    return stats;
  }
}
