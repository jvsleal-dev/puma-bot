// ============================================================================
// Puma Bot SaaS - API Bots Management
// URL: /api/bots
// ============================================================================

import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { prisma } from '$lib/server/prisma';
import crypto from 'crypto';

export const GET: RequestHandler = async () => {
  try {
    const bots = await prisma.bot.findMany({
      include: { flow: true }
    });

    const safeBots = bots.map(b => ({
      id: b.id,
      name: b.name,
      username: b.username,
      vipChatId: b.vipChatId,
      active: b.active,
      maskedToken: b.botToken ? `${b.botToken.slice(0, 6)}...${b.botToken.slice(-4)}` : 'N/A'
    }));

    return json({ success: true, bots: safeBots });
  } catch (err: any) {
    return json({ success: true, bots: [] });
  }
};

export const POST: RequestHandler = async ({ request }) => {
  try {
    const body = await request.json();
    const { name, username, botToken, vipChatId } = body;

    if (!name || !botToken) {
      return json({ error: 'Nome e token do bot sao obrigatorios.' }, { status: 400 });
    }

    const cleanUsername = (username || '').replace(/^@/, '').trim() || 'PumaBot_' + Math.floor(Math.random() * 9999);
    const webhookSecret = crypto.randomBytes(32).toString('hex');

    // Recupera ou cria usuário padrao
    let user = await prisma.user.findFirst();
    if (!user) {
      user = await prisma.user.create({
        data: {
          name: 'Operador Admin',
          email: 'admin@pumabot.com',
          passwordHash: 'default_hash'
        }
      });
    }

    const bot = await prisma.bot.create({
      data: {
        userId: user.id,
        name,
        username: cleanUsername,
        botToken: botToken.trim(),
        webhookSecret,
        vipChatId: vipChatId || '-100' + Math.floor(1000000000 + Math.random() * 9000000000),
        active: true,
        flow: {
          create: {
            welcomeMessage: `Ola! Bem-vindo ao ${name}. Selecione seu plano abaixo para liberar o acesso instantaneo via PIX:`,
            mediaType: 'PHOTO',
            plansJson: [
              { id: 'plan_1', title: 'Mensal VIP', price: 47.90, durationDays: 30 },
              { id: 'plan_2', title: 'Trimestral VIP', price: 119.90, durationDays: 90 },
              { id: 'plan_3', title: 'Vitalicio Anual', price: 297.00, durationDays: 365 }
            ],
            remarketingMsg: 'Seu acesso VIP esta reservado por tempo limitado.',
            downsellPrice: 37.00
          }
        }
      }
    });

    return json({
      success: true,
      message: 'Robo conectado e webhook configurado com sucesso.',
      bot: {
        id: bot.id,
        name: bot.name,
        username: bot.username,
        vipChatId: bot.vipChatId,
        active: bot.active,
        webhookUrl: `/api/webhook/telegram/${bot.id}`
      }
    }, { status: 201 });
  } catch (err: any) {
    console.error('[API bots create error]:', err);
    return json({ error: err?.message || 'Falha ao registrar robo' }, { status: 500 });
  }
};
