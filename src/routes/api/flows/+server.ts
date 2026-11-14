// ============================================================================
// Puma Bot SaaS - API Funnel & Flow Configuration
// URL: /api/flows
// ============================================================================

import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { prisma } from '$lib/server/prisma';

export const GET: RequestHandler = async () => {
  try {
    const flows = await prisma.flow.findMany();
    return json({ success: true, flows });
  } catch (err: any) {
    return json({ success: true, flows: [] });
  }
};

export const POST: RequestHandler = async ({ request }) => {
  try {
    const body = await request.json();
    const { botId, welcomeMessage, remarketingMsg, downsellPrice, plans } = body;

    let targetBotId = botId;
    if (!targetBotId) {
      const firstBot = await prisma.bot.findFirst();
      if (!firstBot) {
        return json({ error: 'Nenhum robo cadastrado.' }, { status: 400 });
      }
      targetBotId = firstBot.id;
    }

    const flow = await prisma.flow.upsert({
      where: { botId: targetBotId },
      update: {
        welcomeMessage,
        remarketingMsg,
        downsellPrice: downsellPrice !== undefined ? Number(downsellPrice) : undefined,
        plansJson: plans !== undefined ? plans : undefined
      },
      create: {
        botId: targetBotId,
        welcomeMessage: welcomeMessage || 'Bem-vindo ao canal VIP!',
        mediaType: 'PHOTO',
        plansJson: plans || [
          { id: 'plan_1', title: 'Mensal VIP', price: 47.90, durationDays: 30 }
        ],
        remarketingMsg: remarketingMsg || '',
        downsellPrice: Number(downsellPrice) || 37.00
      }
    });

    return json({
      success: true,
      message: 'Fluxo de vendas atualizado com sucesso.',
      flow
    });
  } catch (err: any) {
    console.error('[API flows update error]:', err);
    return json({ error: err?.message || 'Falha ao atualizar fluxo' }, { status: 500 });
  }
};
