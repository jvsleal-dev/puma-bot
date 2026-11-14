// ============================================================================
// Puma Bot SaaS - API Operator Login
// URL: /api/auth/login
// ============================================================================

import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { prisma } from '$lib/server/prisma';
import { verifyPassword, generateSessionToken } from '$lib/server/auth';

export const POST: RequestHandler = async ({ request, cookies }) => {
  try {
    const data = await request.json();
    const { email, password } = data;

    if (!email || !password) {
      return json({ error: 'Informe e-mail e senha de operador' }, { status: 400 });
    }

    const emailClean = email.toLowerCase().trim();

    const user = await prisma.user.findUnique({
      where: { email: emailClean }
    });

    if (!user) {
      return json({ error: 'Credenciais inválidas' }, { status: 401 });
    }

    const storedSecret = user.passwordHash || (user as any).password;
    const isValid = verifyPassword(password, storedSecret);

    if (!isValid) {
      return json({ error: 'Credenciais inválidas' }, { status: 401 });
    }

    const sessionToken = generateSessionToken(user.id);
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
        id: user.id,
        name: user.name,
        email: user.email,
        plan: (user as any).plan || 'PRO Trial (14 dias)'
      }
    });
  } catch (err: any) {
    console.error('[Login API error]:', err);
    return json({ error: err?.message || 'Falha ao autenticar operador' }, { status: 500 });
  }
};
