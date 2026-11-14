import type { PageServerLoad } from './$types';
import { prisma } from '$lib/server/prisma';

export const load: PageServerLoad = async () => {
  try {
    const user = await prisma.user.findFirst();

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
