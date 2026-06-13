import { getStore } from '@netlify/blobs';
import { handleApi, DEFAULT_DATA } from '../../server/apiCore.js';

const STORE = 'entellistore';

async function readDb() {
  try {
    const store = getStore(STORE);
    const data = await store.get('db', { type: 'json' });
    if (data) return data;
  } catch (e) {
    console.warn('Blob read failed:', e.message);
  }
  return { ...DEFAULT_DATA };
}

async function writeDb(data) {
  const store = getStore(STORE);
  await store.setJSON('db', data);
}

function parsePath(rawUrl) {
  const url = new URL(rawUrl);
  let path = url.pathname;
  path = path.replace(/^\/\.netlify\/functions\/api/, '');
  path = path.replace(/^\/api/, '');
  return path || '/';
}

export default async (request) => {
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, POST, PATCH, DELETE, OPTIONS',
      },
    });
  }

  const method = request.method;
  const path = parsePath(request.url);
  let body = {};
  if (method !== 'GET' && method !== 'HEAD') {
    try { body = await request.json(); } catch { body = {}; }
  }

  try {
    const result = await handleApi({ method, path, body, readDb, writeDb });
    return new Response(JSON.stringify(result.body), {
      status: result.status,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (err) {
    console.error('API error:', err);
    return new Response(JSON.stringify({ error: 'Server xatosi' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
