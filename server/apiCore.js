import crypto from 'crypto';
import { DEFAULT_DATA } from '../shared/defaults.js';

export { DEFAULT_DATA } from '../shared/defaults.js';

export function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.scryptSync(password, salt, 64).toString('hex');
  return `${salt}:${hash}`;
}

export function verifyPassword(password, stored) {
  const [salt, hash] = stored.split(':');
  const verify = crypto.scryptSync(password, salt, 64).toString('hex');
  return hash === verify;
}

export function createToken(user) {
  const data = Buffer.from(JSON.stringify({ id: user.id, role: user.role, exp: Date.now() + 86400000 * 7 })).toString('base64');
  const signature = crypto.createHmac('sha256', process.env.JWT_SECRET || 'entelli-secret-123').update(data).digest('base64');
  return `${data}.${signature}`;
}

export function verifyToken(token) {
  if (!token) return null;
  try {
    const [data, sig] = token.split('.');
    if (crypto.createHmac('sha256', process.env.JWT_SECRET || 'entelli-secret-123').update(data).digest('base64') !== sig) return null;
    const parsed = JSON.parse(Buffer.from(data, 'base64').toString('utf8'));
    if (parsed.exp < Date.now()) return null;
    return parsed;
  } catch { return null; }
}

export function sanitizeUser(user, includeToken = false) {
  const { passwordHash, ...safe } = user;
  if (includeToken) safe.token = createToken(user);
  return safe;
}

export async function ensureAdmin(db, writeDb) {
  const adminExists = db.users.some(u => u.username === 'entelli');
  if (!adminExists) {
    db.users.push({
      id: 'ADMIN_001',
      username: 'entelli',
      passwordHash: hashPassword('cookiepass'),
      role: 'admin',
      balance: 0,
      purchases: 0,
      region: 'uzb',
      status: 'Active',
      verified: true,
      createdAt: new Date().toISOString(),
    });
    await writeDb(db);
  }
}

export async function handleApi({ method, path, body, headers = {}, readDb, writeDb }) {
  const dbData = await readDb();
  const db = { ...DEFAULT_DATA, ...dbData };
  if (!Array.isArray(db.users)) db.users = [];
  if (!Array.isArray(db.products)) db.products = [];
  if (!Array.isArray(db.orders)) db.orders = [];
  if (!Array.isArray(db.supportChats)) db.supportChats = [];
  await ensureAdmin(db, writeDb);

  const authHeader = headers.authorization || headers.Authorization || '';
  const tokenStr = authHeader.split(' ')[1] || '';
  const session = verifyToken(tokenStr);

  const respond = (status, data) => ({ status, body: data });

  // Admin checks for modifying operations
  if (method !== 'GET' && method !== 'OPTIONS' && !path.startsWith('/auth') && path !== '/orders') {
    if (!session || session.role !== 'admin') {
      if (!(path === '/support/messages' && session)) {
         return respond(403, { error: 'Ruxsat etilmagan (Forbidden)' });
      }
    }
  }

  if (method === 'GET' && path === '/health') {
    return respond(200, { ok: true });
  }

  if (method === 'GET' && path === '/data') {
    return respond(200, {
      products: db.products,
      orders: db.orders,
      supportChats: db.supportChats,
      users: db.users.map(u => sanitizeUser(u, false)),
    });
  }

  if (method === 'POST' && path === '/auth/login') {
    const normalized = (body.username || '').trim().toLowerCase();
    const found = db.users.find(u => u.username.toLowerCase() === normalized);
    if (!found || !verifyPassword(body.password || '', found.passwordHash)) {
      return respond(401, { error: "Login yoki parol noto'g'ri" });
    }
    if (found.status === 'Banned') {
      return respond(403, { error: 'Hisobingiz bloklangan.' });
    }
    return respond(200, { user: sanitizeUser(found, true) });
  }

  if (method === 'POST' && path === '/auth/register') {
    const normalized = (body.username || '').trim().toLowerCase();
    if (!normalized || normalized.length < 3) {
      return respond(400, { error: "Login kamida 3 ta belgidan iborat bo'lishi kerak" });
    }
    if (!/^[a-z0-9_]+$/.test(normalized)) {
      return respond(400, { error: "Login faqat harf, raqam va _ dan iborat bo'lishi kerak" });
    }
    if (!body.password || body.password.length < 8) {
      return respond(400, { error: "Parol kamida 8 ta belgidan iborat bo'lishi kerak" });
    }
    if (db.users.some(u => u.username.toLowerCase() === normalized)) {
      return respond(409, { error: 'Bu login allaqachon band' });
    }
    const newUser = {
      id: 'USR_' + Date.now(),
      username: normalized,
      passwordHash: hashPassword(body.password),
      role: 'user',
      balance: 0,
      purchases: 0,
      region: body.region || 'uzb',
      email: (body.email || '').trim() || null,
      status: 'Active',
      verified: false,
      createdAt: new Date().toISOString(),
    };
    db.users.push(newUser);
    await writeDb(db);
    return respond(201, { user: sanitizeUser(newUser, true) });
  }

  if (method === 'POST' && path === '/auth/google') {
    const { googleId, email, name } = body || {};
    if (!googleId) return respond(400, { error: 'Google ma\'lumotlari topilmadi' });

    let found = db.users.find(u => u.googleId === googleId);
    if (!found && email) {
      found = db.users.find(u => u.email?.toLowerCase() === email.toLowerCase());
    }

    if (!found) {
      const baseName = (name || email?.split('@')[0] || 'user')
        .toLowerCase()
        .replace(/[^a-z0-9_]/g, '_')
        .slice(0, 20) || 'user';
      let username = baseName;
      let i = 1;
      while (db.users.some(u => u.username === username)) {
        username = `${baseName}_${i++}`;
      }

      found = {
        id: 'USR_' + Date.now(),
        username,
        googleId,
        email: email || null,
        role: 'user',
        balance: 0,
        purchases: 0,
        region: 'uzb',
        status: 'Active',
        verified: true,
        authProvider: 'google',
        createdAt: new Date().toISOString(),
      };
      db.users.push(found);
      await writeDb(db);
    }

    if (found.status === 'Banned') {
      return respond(403, { error: 'Hisobingiz bloklangan.' });
    }
    return respond(200, { user: sanitizeUser(found) });
  }

  if (method === 'POST' && path === '/orders') {
    const order = {
      id: 'ORD-' + Math.floor(10000 + Math.random() * 90000),
      ...body,
      status: body.status || 'Pending Payment',
      date: new Date().toISOString(),
    };
    db.orders.unshift(order);
    await writeDb(db);
    return respond(201, order);
  }

  const orderMatch = path.match(/^\/orders\/([^/]+)$/);
  if (orderMatch) {
    const orderId = orderMatch[1];
    if (method === 'PATCH') {
      const idx = db.orders.findIndex(o => o.id === orderId);
      if (idx === -1) return respond(404, { error: 'Buyurtma topilmadi' });
      db.orders[idx] = { ...db.orders[idx], ...body };
      await writeDb(db);
      return respond(200, db.orders[idx]);
    }
    if (method === 'DELETE') {
      db.orders = db.orders.filter(o => o.id !== orderId);
      await writeDb(db);
      return respond(200, { ok: true });
    }
  }

  if (method === 'POST' && path === '/products') {
    const product = {
      ...body,
      id: Math.floor(10000 + Math.random() * 90000).toString(),
      views: 0,
    };
    db.products.unshift(product);
    await writeDb(db);
    return respond(201, product);
  }

  const productMatch = path.match(/^\/products\/([^/]+)$/);
  if (productMatch && method === 'DELETE') {
    db.products = db.products.filter(p => p.id !== productMatch[1]);
    await writeDb(db);
    return respond(200, { ok: true });
  }

  if (method === 'POST' && path === '/support/messages') {
    const { userId, fromRole, text } = body || {};
    if (!userId || !text?.trim()) return respond(400, { error: 'Xabar yuborilmadi' });
    const newMessage = { from: fromRole, text: text.trim(), timestamp: new Date().toISOString() };
    const idx = db.supportChats.findIndex(c => c.userId === userId);
    if (idx >= 0) {
      db.supportChats[idx].messages.push(newMessage);
    } else {
      const label = db.users.find(u => u.id === userId)?.username || userId;
      db.supportChats.push({ userId, label, messages: [newMessage] });
    }
    await writeDb(db);
    return respond(200, db.supportChats);
  }

  const userMatch = path.match(/^\/users\/([^/]+)$/);
  if (userMatch && method === 'PATCH') {
    const idx = db.users.findIndex(u => u.id === userMatch[1]);
    if (idx === -1) return respond(404, { error: 'Foydalanuvchi topilmadi' });
    const allowed = ['status', 'verified', 'balance'];
    for (const key of allowed) {
      if (body[key] !== undefined) db.users[idx][key] = body[key];
    }
    await writeDb(db);
    return respond(200, sanitizeUser(db.users[idx], false));
  }

  return respond(404, { error: 'Topilmadi' });
}
