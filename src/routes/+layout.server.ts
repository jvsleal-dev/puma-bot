import type { LayoutServerLoad } from './$types';
import { prisma } from '$lib/server/prisma';

export const load: LayoutServerLoad = async () => {
  try {
    const [user, activeBotsCount] = await Promise.all([
      prisma.user.findFirst(),
      prisma.bot.count({ where: { active: true } }).catch(() => 0)
    ]);

    return {
      user: {
        name: user?.name || 'Operador Admin',
        email: user?.email || '',
        plan: (user as any)?.plan || 'PRO Trial'
      },
      activeBotsCount: Number(activeBotsCount) || 0
    };
  } catch (e) {
    return {
      user: {
        name: 'Operador Admin',
        email: '',
        plan: 'PRO Trial'
      },
      activeBotsCount: 0
    };
  }
};
