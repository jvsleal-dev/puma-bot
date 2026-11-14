import type { LayoutServerLoad } from './$types';
import { prisma } from '$lib/server/prisma';
import { parseUserIdFromSession } from '$lib/server/auth';

export const load: LayoutServerLoad = async ({ cookies }) => {
  try {
    const sessionCookie = cookies.get('puma_session');
    const userId = sessionCookie ? parseUserIdFromSession(sessionCookie) : null;

    let user = null;
    if (userId) {
      user = await prisma.user.findUnique({ where: { id: userId } }).catch(() => null);
    }
    if (!user) {
      user = await prisma.user.findFirst().catch(() => null);
    }

    const activeBotsCount = await prisma.bot.count({ where: { active: true } }).catch(() => 0);

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
