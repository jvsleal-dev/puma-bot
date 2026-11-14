import type { PageServerLoad } from './$types';
import { prisma } from '$lib/server/prisma';

export const load: PageServerLoad = async () => {
  try {
    const user = await prisma.user.findFirst();

    return {
      provider: user?.gatewayProvider || 'PUSHINPAY',
      maskedToken: user?.gatewayToken ? `${user.gatewayToken.slice(0, 8)}...${user.gatewayToken.slice(-4)}` : 'pushin_sec_9948...284',
      pixKey: user?.pixKey || 'financeiro@pumabot.com.br'
    };
  } catch (e) {
    return {
      provider: 'PUSHINPAY',
      maskedToken: 'pushin_sec_9948...284',
      pixKey: 'financeiro@pumabot.com.br'
    };
  }
};
