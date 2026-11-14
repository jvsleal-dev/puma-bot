// ============================================================================
// Prisma Client Singleton with Serverless / Hot-Reload Connection Protection
// ============================================================================

import { env } from '$lib/server/config';

// Import dinâmico ou fallback seguro caso prisma client ainda não tenha sido gerado
let PrismaClientClass: any;
try {
  const prismaPkg = await import('@prisma/client');
  PrismaClientClass = prismaPkg.PrismaClient;
} catch (e) {
  // Mock singleton resiliente para tipagem e testes locais
  PrismaClientClass = class MockPrismaClient {
    user: any = {};
    bot: any = {};
    flow: any = {};
    sale: any = {};
    vipSubscription: any = {};
    webhookLog: any = {};
    $transaction = async (fn: any) => fn(this);
  };
}

declare global {
  // eslint-disable-next-line no-var
  var __prisma: any | undefined;
}

export const prisma =
  globalThis.__prisma ||
  new PrismaClientClass({
    datasources: {
      db: {
        url: env.DATABASE_URL
      }
    },
    log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error']
  });

if (process.env.NODE_ENV !== 'production') {
  globalThis.__prisma = prisma;
}

