import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { handleApi, DEFAULT_DATA, ensureAdmin } from './apiCore.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_FILE = path.join(__dirname, 'data.json');
const PORT = process.env.PORT || 3001;

function readDbSync() {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const raw = fs.readFileSync(DATA_FILE, 'utf8');
      return { ...DEFAULT_DATA, ...JSON.parse(raw) };
    }
  } catch {
    // corrupt file
  }
  writeDbSync(DEFAULT_DATA);
  return { ...DEFAULT_DATA };
}

function writeDbSync(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf8');
}

const readDb = async () => readDbSync();
const writeDb = async (data) => writeDbSync(data);

const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' }));

async function route(req, res) {
  const apiPath = req.path.replace(/^\/api/, '') || '/';
  try {
    const result = await handleApi({
      method: req.method,
      path: apiPath,
      body: req.body,
      readDb,
      writeDb,
    });
    res.status(result.status).json(result.body);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server xatosi' });
  }
}

app.get('/api/health', route);
app.get('/api/data', route);
app.post('/api/auth/login', route);
app.post('/api/auth/register', route);
app.post('/api/auth/google', route);
app.post('/api/orders', route);
app.patch('/api/orders/:id', route);
app.delete('/api/orders/:id', route);
app.post('/api/products', route);
app.delete('/api/products/:id', route);
app.post('/api/support/messages', route);
app.patch('/api/users/:id', route);

app.listen(PORT, () => {
  const db = readDbSync();
  ensureAdmin(db, async (data) => writeDbSync(data));
  console.log(`EntelliStore API http://localhost:${PORT}`);
});
