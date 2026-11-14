import { json } from '@sveltejs/kit';
import fs from 'fs';
import path from 'path';

const DB_FILE = path.resolve('database.json');

function getDB() {
  if (fs.existsSync(DB_FILE)) {
    try {
      return JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
    } catch (e) {
      return { users: [], bots: [], transactions: [] };
    }
  }
  return { users: [], bots: [], transactions: [] };
}

/** @type {import('./$types').RequestHandler} */
export async function POST({ request }) {
  const data = await request.json();
  const { email, password } = data;

  const db = getDB();
  const user = db.users.find(u => u.email.toLowerCase() === (email || '').toLowerCase() && u.password === password);

  if (!user) {
    return json({ error: 'Credenciais inválidas' }, { status: 401 });
  }

  return json({
    success: true,
    token: 'jwt_mock_token_' + user.id,
    user: { id: user.id, name: user.name, email: user.email, plan: user.plan, stats: user.stats }
  });
}

