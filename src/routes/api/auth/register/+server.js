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

function saveDB(db) {
  fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2));
}

/** @type {import('./$types').RequestHandler} */
export async function POST({ request }) {
  const data = await request.json();
  const { name, email, password } = data;

  if (!name || !email || !password) {
    return json({ error: 'Todos os campos são obrigatórios' }, { status: 400 });
  }

  const db = getDB();
  const existing = db.users.find(u => u.email.toLowerCase() === email.toLowerCase());

  if (existing) {
    return json({ error: 'E-mail já cadastrado' }, { status: 400 });
  }

  const newUser = {
    id: 'usr_' + Date.now(),
    name,
    email: email.toLowerCase(),
    password,
    createdAt: new Date().toISOString(),
    plan: 'PRO Trial (14 dias)',
    stats: {
      totalVendas: 0,
      pedidosPendentes: 0,
      botsAtivos: 1
    }
  };

  db.users.push(newUser);
  saveDB(db);

  return json({
    success: true,
    user: { id: newUser.id, name: newUser.name, email: newUser.email, plan: newUser.plan }
  }, { status: 201 });
}

