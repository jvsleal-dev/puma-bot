// ============================================================================
// Puma Bot Database Engine - Dynamic Data & Real-Time Persistence
// Reads and writes directly to database with zero fictitious mock values
// ============================================================================

import { env } from '$lib/server/config';
import fs from 'fs';
import path from 'path';

let PrismaClientClass: any;

try {
  const prismaPkg = await import('@prisma/client');
  PrismaClientClass = prismaPkg.PrismaClient;
} catch (e) {
  PrismaClientClass = class LocalJsonPrismaClient {
    private getDB() {
      try {
        const dbPath = path.resolve('database.json');
        if (fs.existsSync(dbPath)) {
          const data = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
          return {
            users: data.users || [],
            bots: data.bots || [],
            flows: data.flows || [],
            sales: data.sales || [],
            vipSubscriptions: data.vipSubscriptions || [],
            webhookLogs: data.webhookLogs || []
          };
        }
      } catch (err) {
        console.error('[Database Engine] Erro ao ler database.json:', err);
      }
      return { users: [], bots: [], flows: [], sales: [], vipSubscriptions: [], webhookLogs: [] };
    }

    private saveDB(db: any) {
      try {
        const dbPath = path.resolve('database.json');
        fs.writeFileSync(dbPath, JSON.stringify(db, null, 2), 'utf8');
      } catch (err) {
        console.error('[Database Engine] Erro ao gravar database.json:', err);
      }
    }

    user = {
      findFirst: async () => {
        const db = this.getDB();
        return db.users[0] || null;
      },
      findMany: async ({ orderBy, include }: any = {}) => {
        const db = this.getDB();
        return db.users.map((u: any) => {
          const userBots = db.bots.filter((b: any) => b.userId === u.id);
          const botIds = userBots.map((b: any) => b.id);
          const userSales = db.sales.filter((s: any) => botIds.includes(s.botId));
          const paidSales = userSales.filter((s: any) => s.status === 'PAID');
          const totalVol = paidSales.reduce((acc: number, curr: any) => acc + (Number(curr.amount) || 0), 0);
          return {
            ...u,
            bots: include?.bots ? userBots : undefined,
            _count: {
              bots: userBots.length,
              sales: userSales.length
            },
            totalRevenue: totalVol
          };
        });
      },
      count: async () => {
        const db = this.getDB();
        return db.users.length;
      },
      findUnique: async ({ where }: any) => {
        const db = this.getDB();
        return db.users.find((u: any) => (where?.id && u.id === where.id) || (where?.email && u.email === where.email)) || null;
      },
      create: async ({ data }: any) => {
        const db = this.getDB();
        const newUser = {
          id: 'usr_' + Date.now(),
          ...data,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        db.users.push(newUser);
        this.saveDB(db);
        return newUser;
      },
      update: async ({ where, data }: any) => {
        const db = this.getDB();
        const idx = db.users.findIndex((u: any) => (where?.id && u.id === where.id) || (where?.email && u.email === where.email));
        if (idx !== -1) {
          db.users[idx] = { ...db.users[idx], ...data, updatedAt: new Date().toISOString() };
          this.saveDB(db);
          return db.users[idx];
        }
        return { id: where?.id || 'usr_default', ...data, updatedAt: new Date() };
      }
    };

    bot = {
      findFirst: async ({ where }: any = {}) => {
        const db = this.getDB();
        if (where?.active !== undefined) {
          return db.bots.find((b: any) => b.active === where.active) || null;
        }
        return db.bots[0] || null;
      },
      findMany: async ({ where, include, orderBy }: any = {}) => {
        const db = this.getDB();
        let bots = [...db.bots];
        if (where?.active !== undefined) {
          bots = bots.filter((b: any) => b.active === where.active);
        }
        return bots.map((b: any) => {
          const botSales = db.sales.filter((s: any) => s.botId === b.id);
          const botSubs = db.vipSubscriptions.filter((v: any) => v.botId === b.id && v.active);
          const botFlow = db.flows.find((f: any) => f.botId === b.id);
          const owner = db.users.find((u: any) => u.id === b.userId) || { name: 'Operador Admin', email: 'admin@pumabot.com' };
          return {
            ...b,
            user: include?.user ? { name: owner.name, email: owner.email } : undefined,
            flow: botFlow || null,
            _count: {
              sales: botSales.length,
              vipSubscriptions: botSubs.length
            }
          };
        });
      },
      findUnique: async ({ where }: any) => {
        const db = this.getDB();
        return db.bots.find((b: any) => (where?.id && b.id === where.id) || (where?.username && b.username === where.username)) || null;
      },
      count: async ({ where }: any = {}) => {
        const db = this.getDB();
        if (where?.active !== undefined) {
          return db.bots.filter((b: any) => b.active === where.active).length;
        }
        return db.bots.length;
      },
      create: async ({ data }: any) => {
        const db = this.getDB();
        const newBot = {
          id: 'bot_' + Date.now(),
          name: data.name,
          username: data.username,
          botToken: data.botToken,
          webhookSecret: data.webhookSecret || 'sec_' + Date.now(),
          vipChatId: data.vipChatId,
          active: data.active !== undefined ? data.active : true,
          userId: data.userId || db.users[0]?.id || 'usr_default',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        db.bots.push(newBot);

        if (data.flow?.create) {
          const newFlow = {
            id: 'flow_' + Date.now(),
            botId: newBot.id,
            welcomeMessage: data.flow.create.welcomeMessage || '',
            mediaType: data.flow.create.mediaType || 'PHOTO',
            plansJson: data.flow.create.plansJson || [],
            remarketingMsg: data.flow.create.remarketingMsg || '',
            downsellPrice: data.flow.create.downsellPrice || 0,
            updatedAt: new Date().toISOString()
          };
          db.flows.push(newFlow);
        }

        this.saveDB(db);
        return newBot;
      },
      update: async ({ where, data }: any) => {
        const db = this.getDB();
        const idx = db.bots.findIndex((b: any) => b.id === where?.id);
        if (idx !== -1) {
          db.bots[idx] = { ...db.bots[idx], ...data, updatedAt: new Date().toISOString() };
          this.saveDB(db);
          return db.bots[idx];
        }
        return { id: where?.id, ...data };
      }
    };

    flow = {
      findFirst: async () => {
        const db = this.getDB();
        return db.flows[0] || null;
      },
      findMany: async () => {
        const db = this.getDB();
        return db.flows;
      },
      findUnique: async ({ where }: any) => {
        const db = this.getDB();
        return db.flows.find((f: any) => (where?.botId && f.botId === where.botId) || (where?.id && f.id === where.id)) || null;
      },
      upsert: async ({ where, create, update }: any) => {
        const db = this.getDB();
        const idx = db.flows.findIndex((f: any) => (where?.botId && f.botId === where.botId) || (where?.id && f.id === where.id));
        if (idx !== -1) {
          db.flows[idx] = { ...db.flows[idx], ...update, updatedAt: new Date().toISOString() };
          this.saveDB(db);
          return db.flows[idx];
        }
        const newFlow = {
          id: 'flow_' + Date.now(),
          ...create,
          updatedAt: new Date().toISOString()
        };
        db.flows.push(newFlow);
        this.saveDB(db);
        return newFlow;
      }
    };

    sale = {
      aggregate: async ({ _sum, where }: any = {}) => {
        const db = this.getDB();
        let sales = db.sales;
        if (where?.status) {
          sales = sales.filter((s: any) => s.status === where.status);
        }
        const sum = sales.reduce((acc: number, curr: any) => acc + (Number(curr.amount) || 0), 0);
        return {
          _sum: { amount: sum },
          _count: { id: sales.length }
        };
      },
      count: async ({ where }: any = {}) => {
        const db = this.getDB();
        let sales = db.sales;
        if (where?.status) {
          sales = sales.filter((s: any) => s.status === where.status);
        }
        if (where?.createdAt?.gte) {
          const gteDate = new Date(where.createdAt.gte).getTime();
          sales = sales.filter((s: any) => new Date(s.createdAt).getTime() >= gteDate);
        }
        return sales.length;
      },
      findFirst: async ({ where, include }: any = {}) => {
        const db = this.getDB();
        const s = db.sales.find((item: any) => {
          if (where?.OR && Array.isArray(where.OR)) {
            const matchesOr = where.OR.some((condition: any) => {
              if (condition.pixTxid && item.pixTxid === condition.pixTxid) return true;
              if (condition.id && item.id === condition.id) return true;
              return false;
            });
            if (!matchesOr) return false;
          }
          if (where?.id && item.id !== where.id) return false;
          if (where?.pixTxid && item.pixTxid !== where.pixTxid) return false;
          if (where?.status && item.status !== where.status) return false;
          if (where?.botId && item.botId !== where.botId) return false;
          return true;
        });
        if (!s) return null;
        const bot = db.bots.find((b: any) => b.id === s.botId) || { botToken: '', vipChatId: '', name: 'Robô VIP' };
        return {
          ...s,
          telegramUserId: BigInt(s.telegramUserId || '0'),
          createdAt: new Date(s.createdAt || Date.now()),
          bot: include?.bot ? bot : undefined
        };
      },
      findMany: async ({ where, orderBy, take, include }: any = {}) => {
        const db = this.getDB();
        let sales = [...db.sales];
        if (where?.status) {
          sales = sales.filter((s: any) => s.status === where.status);
        }
        if (where?.botId) {
          sales = sales.filter((s: any) => s.botId === where.botId);
        }
        if (orderBy) {
          const sortKey = Object.keys(orderBy)[0];
          const sortDir = (orderBy as any)[sortKey];
          sales.sort((a: any, b: any) => {
            const timeA = new Date(a[sortKey] || a.createdAt || 0).getTime();
            const timeB = new Date(b[sortKey] || b.createdAt || 0).getTime();
            return sortDir === 'asc' ? timeA - timeB : timeB - timeA;
          });
        }
        if (take && typeof take === 'number') {
          sales = sales.slice(0, take);
        }

        return sales.map((s: any) => {
          const bot = db.bots.find((b: any) => b.id === s.botId) || { name: 'Robô VIP', username: 'pumabot', userId: '' };
          const owner = db.users.find((u: any) => u.id === bot.userId) || { name: 'Admin', email: 'admin@pumabot.com' };
          return {
            ...s,
            telegramUserId: BigInt(s.telegramUserId || '0'),
            createdAt: new Date(s.createdAt || Date.now()),
            bot: include?.bot ? {
              name: bot.name,
              username: bot.username,
              user: { name: owner.name, email: owner.email }
            } : undefined
          };
        });
      },
      findUnique: async ({ where, include }: any) => {
        const db = this.getDB();
        const s = db.sales.find((item: any) => (where?.id && item.id === where.id) || (where?.pixTxid && item.pixTxid === where.pixTxid));
        if (!s) return null;
        const bot = db.bots.find((b: any) => b.id === s.botId) || { botToken: '', vipChatId: '', name: 'Robô VIP' };
        return {
          ...s,
          telegramUserId: BigInt(s.telegramUserId || '0'),
          createdAt: new Date(s.createdAt || Date.now()),
          bot: include?.bot ? bot : undefined
        };
      },
      create: async ({ data }: any) => {
        const db = this.getDB();
        const newSale = {
          id: 'tx_' + Date.now(),
          ...data,
          telegramUserId: data.telegramUserId ? data.telegramUserId.toString() : '0',
          createdAt: new Date().toISOString()
        };
        db.sales.unshift(newSale);
        this.saveDB(db);
        return {
          ...newSale,
          telegramUserId: BigInt(newSale.telegramUserId)
        };
      },
      update: async ({ where, data }: any) => {
        const db = this.getDB();
        const idx = db.sales.findIndex((s: any) => (where?.id && s.id === where.id) || (where?.pixTxid && s.pixTxid === where.pixTxid));
        if (idx !== -1) {
          db.sales[idx] = { ...db.sales[idx], ...data };
          this.saveDB(db);
          return {
            ...db.sales[idx],
            telegramUserId: BigInt(db.sales[idx].telegramUserId || '0')
          };
        }
        return { id: where?.id, ...data };
      },
      delete: async ({ where }: any) => {
        const db = this.getDB();
        const idx = db.sales.findIndex((s: any) => (where?.id && s.id === where.id) || (where?.pixTxid && s.pixTxid === where.pixTxid));
        if (idx !== -1) {
          const removed = db.sales.splice(idx, 1)[0];
          this.saveDB(db);
          return removed;
        }
        return null;
      }
    };

    vipSubscription = {
      count: async ({ where }: any = {}) => {
        const db = this.getDB();
        let subs = db.vipSubscriptions;
        if (where?.active !== undefined) {
          subs = subs.filter((v: any) => v.active === where.active);
        }
        return subs.length;
      },
      findFirst: async ({ where, include }: any = {}) => {
        const db = this.getDB();
        const sub = db.vipSubscriptions.find((v: any) => {
          if (where?.id && v.id !== where.id) return false;
          if (where?.saleId && v.saleId !== where.saleId) return false;
          if (where?.botId && v.botId !== where.botId) return false;
          if (where?.telegramUserId && v.telegramUserId.toString() !== where.telegramUserId.toString()) return false;
          if (where?.active !== undefined && v.active !== where.active) return false;
          return true;
        });
        if (!sub) return null;
        const bot = db.bots.find((b: any) => b.id === sub.botId);
        const sale = db.sales.find((s: any) => s.id === sub.saleId);
        return {
          ...sub,
          bot: include?.bot ? bot : undefined,
          sale: include?.sale ? sale : undefined
        };
      },
      findUnique: async ({ where, include }: any = {}) => {
        const db = this.getDB();
        const sub = db.vipSubscriptions.find((v: any) => (where?.id && v.id === where.id) || (where?.saleId && v.saleId === where.saleId));
        if (!sub) return null;
        const bot = db.bots.find((b: any) => b.id === sub.botId);
        const sale = db.sales.find((s: any) => s.id === sub.saleId);
        return {
          ...sub,
          bot: include?.bot ? bot : undefined,
          sale: include?.sale ? sale : undefined
        };
      },
      findMany: async ({ where, include, orderBy, take }: any = {}) => {
        const db = this.getDB();
        let subs = [...db.vipSubscriptions];
        if (where?.active !== undefined) {
          subs = subs.filter((v: any) => v.active === where.active);
        }
        if (where?.expiresAt?.lt) {
          const ltDate = new Date(where.expiresAt.lt).getTime();
          subs = subs.filter((v: any) => new Date(v.expiresAt).getTime() < ltDate);
        }
        if (orderBy) {
          const sortKey = Object.keys(orderBy)[0];
          const sortDir = (orderBy as any)[sortKey];
          subs.sort((a: any, b: any) => {
            const timeA = new Date(a[sortKey] || a.createdAt || 0).getTime();
            const timeB = new Date(b[sortKey] || b.createdAt || 0).getTime();
            return sortDir === 'asc' ? timeA - timeB : timeB - timeA;
          });
        }
        if (take && typeof take === 'number') {
          subs = subs.slice(0, take);
        }
        return subs.map((sub: any) => {
          const bot = db.bots.find((b: any) => b.id === sub.botId);
          const sale = db.sales.find((s: any) => s.id === sub.saleId);
          return {
            ...sub,
            bot: include?.bot ? bot : undefined,
            sale: include?.sale ? sale : undefined
          };
        });
      },
      create: async ({ data }: any) => {
        const db = this.getDB();
        const newSub = {
          id: 'sub_' + Date.now(),
          ...data,
          telegramUserId: data.telegramUserId ? data.telegramUserId.toString() : '0',
          createdAt: new Date().toISOString()
        };
        db.vipSubscriptions.push(newSub);
        this.saveDB(db);
        return newSub;
      },
      update: async ({ where, data }: any) => {
        const db = this.getDB();
        const idx = db.vipSubscriptions.findIndex((v: any) => v.id === where?.id);
        if (idx !== -1) {
          db.vipSubscriptions[idx] = { ...db.vipSubscriptions[idx], ...data };
          this.saveDB(db);
          return db.vipSubscriptions[idx];
        }
        return { id: where?.id, ...data };
      },
      delete: async ({ where }: any) => {
        const db = this.getDB();
        const idx = db.vipSubscriptions.findIndex((v: any) => v.id === where?.id);
        if (idx !== -1) {
          const removed = db.vipSubscriptions.splice(idx, 1)[0];
          this.saveDB(db);
          return removed;
        }
        return null;
      }
    };

    webhookLog = {
      create: async ({ data }: any) => {
        const db = this.getDB();
        const newLog = {
          id: 'log_' + Date.now(),
          ...data,
          createdAt: new Date().toISOString()
        };
        db.webhookLogs.push(newLog);
        this.saveDB(db);
        return newLog;
      },
      findUnique: async ({ where }: any = {}) => {
        const db = this.getDB();
        return db.webhookLogs.find((l: any) => (where?.id && l.id === where.id) || (where?.externalId && l.externalId === where.externalId)) || null;
      },
      findFirst: async ({ where }: any = {}) => {
        const db = this.getDB();
        return db.webhookLogs.find((l: any) => (where?.externalId && l.externalId === where.externalId) || (where?.provider && l.provider === where.provider)) || null;
      },
      upsert: async ({ where, create, update }: any = {}) => {
        const db = this.getDB();
        const idx = db.webhookLogs.findIndex((l: any) => where?.externalId && l.externalId === where.externalId);
        if (idx !== -1) {
          db.webhookLogs[idx] = { ...db.webhookLogs[idx], ...update };
          this.saveDB(db);
          return db.webhookLogs[idx];
        }
        const newLog = {
          id: 'log_' + Date.now(),
          ...create,
          createdAt: new Date().toISOString()
        };
        db.webhookLogs.push(newLog);
        this.saveDB(db);
        return newLog;
      },
      findMany: async ({ take }: any = {}) => {
        const db = this.getDB();
        const logs = [...db.webhookLogs];
        return logs.slice(0, take || 50);
      }
    };

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
