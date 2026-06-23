import { getStore } from '@netlify/blobs';
import { handleApi, DEFAULT_DATA } from '../../server/apiCore.js';

const STORE = 'entellistore';

async function readDb() {
  try {
    const store = getStore(STORE);
    const data = await store.get('db', { type: 'json' });
    if (data && typeof data === 'object') return { ...DEFAULT_DATA, ...data };
  } catch (e) {
    console.warn('Blob read failed:', e.message);
  }
  return { ...DEFAULT_DATA };
}

async function writeDb(data) {
  try {
    const store = getStore(STORE);
    await store.setJSON('db', data);
  } catch (e) {
    console.warn('Blob write failed (data stored in-memory only):', e.message);
    // Don't throw — allow request to complete even if persistence fails
  }
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
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Allow-Methods': 'GET, POST, PATCH, DELETE, OPTIONS',
        'Access-Control-Max-Age': '86400',
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
    const headersObj = {};
    for (const [k, v] of request.headers.entries()) headersObj[k.toLowerCase()] = v;
    
    const result = await handleApi({ method, path, body, headers: headersObj, readDb, writeDb });
    return new Response(JSON.stringify(result.body), {
      status: result.status,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    });
  } catch (err) {
    console.error('API error:', err);
    return new Response(JSON.stringify({ error: 'Server xatosi' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  }
};
