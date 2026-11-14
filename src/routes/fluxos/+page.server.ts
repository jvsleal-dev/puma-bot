import type { PageServerLoad } from './$types';
import { prisma } from '$lib/server/prisma';

export const load: PageServerLoad = async () => {
  try {
    const [bot, flow] = await Promise.all([
      prisma.bot.findFirst({ where: { active: true } }),
      prisma.flow.findFirst()
    ]);

    let plans: any[] = [];
    if (flow?.plansJson) {
      plans = typeof flow.plansJson === 'string' ? JSON.parse(flow.plansJson) : flow.plansJson;
    }

    if (plans.length === 0) {
      plans = [
        { id: 'plan_1', title: 'Mensal VIP', price: 47.90, durationDays: 30 },
        { id: 'plan_2', title: 'Trimestral VIP', price: 119.90, durationDays: 90 },
        { id: 'plan_3', title: 'Vitalício Anual', price: 297.00, durationDays: 365 }
      ];
    }

    return {
      botName: bot?.name || 'Puma VIP Sinais Alpha',
      botId: bot?.id || 'bot_alpha_01',
      welcomeMessage: flow?.welcomeMessage || 'Olá! Bem-vindo à nossa comunidade VIP exclusiva. Escolha seu plano abaixo para liberar o acesso imediato via PIX:',
      remarketingMsg: flow?.remarketingMsg || 'Notamos que seu PIX ainda não foi liquidado. Restam apenas 10 minutos para garantir sua vaga.',
      downsellPrice: flow?.downsellPrice ? Number(flow.downsellPrice) : 37.00,
      plans
    };
  } catch (e) {
    return {
      botName: 'Puma VIP Sinais Alpha',
      botId: 'bot_alpha_01',
      welcomeMessage: 'Olá! Bem-vindo à nossa comunidade VIP exclusiva. Escolha seu plano abaixo para liberar o acesso imediato via PIX:',
      remarketingMsg: 'Notamos que seu PIX ainda não foi liquidado. Restam apenas 10 minutos para garantir sua vaga.',
      downsellPrice: 37.00,
      plans: [
        { id: 'plan_1', title: 'Mensal VIP', price: 47.90, durationDays: 30 },
        { id: 'plan_2', title: 'Trimestral VIP', price: 119.90, durationDays: 90 },
        { id: 'plan_3', title: 'Vitalício Anual', price: 297.00, durationDays: 365 }
      ]
    };
  }
};

