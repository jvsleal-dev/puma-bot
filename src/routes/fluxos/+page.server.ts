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

    return {
      botName: bot?.name || 'Nenhum bot conectado',
      botId: bot?.id || '',
      welcomeMessage: flow?.welcomeMessage || '',
      remarketingMsg: flow?.remarketingMsg || '',
      downsellPrice: flow?.downsellPrice ? Number(flow.downsellPrice) : 0,
      plans: Array.isArray(plans) ? plans : []
    };
  } catch (e) {
    return {
      botName: '',
      botId: '',
      welcomeMessage: '',
      remarketingMsg: '',
      downsellPrice: 0,
      plans: []
    };
  }
};
