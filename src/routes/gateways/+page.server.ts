// ============================================================================
// Gateways PIX Server Loader - Operator Credentials from Database
// URL: /gateways
// ============================================================================

import type { PageServerLoad } from './$types';
import { prisma } from '$lib/server/prisma';
import { parseUserIdFromSession } from '$lib/server/auth';

export const load: PageServerLoad = async ({ cookies }) => {
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

    return {
      provider: user?.gatewayProvider || 'PUSHINPAY',
      maskedToken: user?.gatewayToken ? `${user.gatewayToken.slice(0, 6)}...${user.gatewayToken.slice(-4)}` : '',
      pixKey: user?.pixKey || ''
    };
  } catch (e) {
    return {
      provider: 'PUSHINPAY',
      maskedToken: '',
      pixKey: ''
    };
  }
};
