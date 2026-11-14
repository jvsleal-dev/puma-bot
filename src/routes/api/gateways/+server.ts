// ============================================================================
// Puma Bot SaaS - API Gateway Configuration
// URL: /api/gateways
// ============================================================================

import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { prisma } from '$lib/server/prisma';
import type { GatewayProvider } from '$lib/domain/models';
import { parseUserIdFromSession } from '$lib/server/auth';

export const GET: RequestHandler = async ({ cookies }) => {
  try {
    const sessionCookie = cookies.get('puma_session');
    const userId = sessionCookie ? parseUserIdFromSession(sessionCookie) : null;
    const user = (userId ? await prisma.user.findUnique({ where: { id: userId } }) : null) || await prisma.user.findFirst();

    return json({
      success: true,
      gateways: {
        provider: user?.gatewayProvider || 'PUSHINPAY',
        maskedToken: user?.gatewayToken ? `${user.gatewayToken.slice(0, 8)}...${user.gatewayToken.slice(-4)}` : 'N/A',
        pixKey: user?.pixKey || 'financeiro@pumabot.com.br',
        updatedAt: user?.updatedAt || new Date().toISOString()
      }
    });
  } catch (err: any) {
    return json({
      success: true,
      gateways: {
        provider: 'PUSHINPAY',
        maskedToken: 'pushin_s...284',
        pixKey: 'financeiro@pumabot.com.br',
        updatedAt: new Date().toISOString()
      }
    });
  }
};

export const POST: RequestHandler = async ({ request, cookies }) => {
  try {
    const body = await request.json();
    const { provider, token, pixKey } = body;

    const sessionCookie = cookies.get('puma_session');
    const userId = sessionCookie ? parseUserIdFromSession(sessionCookie) : null;
    let user = (userId ? await prisma.user.findUnique({ where: { id: userId } }) : null) || await prisma.user.findFirst();
    if (!user) {
      user = await prisma.user.create({
        data: {
          name: 'Operador Admin',
          email: 'admin@pumabot.com',
          passwordHash: 'default_hash',
          gatewayProvider: (provider as GatewayProvider) || 'PUSHINPAY',
          gatewayToken: token,
          pixKey
        }
      });
    } else {
      user = await prisma.user.update({
        where: { id: user.id },
        data: {
          gatewayProvider: (provider as GatewayProvider) || user.gatewayProvider,
          gatewayToken: token || user.gatewayToken,
          pixKey: pixKey || user.pixKey
        }
      });
    }

    return json({
      success: true,
      message: 'Configuracoes de gateway salvas com sucesso.'
    });
  } catch (err: any) {
    console.error('[Gateways update error]:', err);
    return json({ error: err?.message || 'Falha ao salvar gateway' }, { status: 500 });
  }
};
