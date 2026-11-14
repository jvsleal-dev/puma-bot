// ============================================================================
// Puma Bot SaaS - API Operator Registration
// URL: /api/auth/register
// ============================================================================

import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { prisma } from '$lib/server/prisma';
import { hashPassword, generateSessionToken } from '$lib/server/auth';

export const POST: RequestHandler = async ({ request, cookies }) => {
  try {
    const data = await request.json();
    const { name, email, password } = data;

    if (!name || !email || !password) {
      return json({ error: 'Todos os campos são obrigatórios' }, { status: 400 });
    }

    if (password.length < 6) {
      return json({ error: 'A senha deve conter pelo menos 6 caracteres' }, { status: 400 });
    }

    const emailClean = email.toLowerCase().trim();

    const existing = await prisma.user.findUnique({
      where: { email: emailClean }
    });

    if (existing) {
      return json({ error: 'E-mail já cadastrado na plataforma' }, { status: 400 });
    }

    const passwordHash = hashPassword(password);

    const newUser = await prisma.user.create({
      data: {
        name: name.trim(),
        email: emailClean,
        passwordHash,
        plan: 'PRO Trial (14 dias)',
        gatewayProvider: 'PUSHINPAY'
      }
    });

    const sessionToken = generateSessionToken(newUser.id);
    cookies.set('puma_session', sessionToken, {
      path: '/',
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 30 // 30 dias
    });

    return json({
      success: true,
      token: sessionToken,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        plan: (newUser as any).plan || 'PRO Trial (14 dias)'
      }
    }, { status: 201 });
  } catch (err: any) {
    console.error('[Register API error]:', err);
    return json({ error: err?.message || 'Falha ao registrar operador' }, { status: 500 });
  }
};
