import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import pg from 'pg';
import serverless from 'serverless-http';

import router from '../routes/rotas.js';

const { Pool } = pg;

const app = express();

// ✅ Pool GLOBAL (evita recriar conexão)
let pool;

if (!global.pool) {
  global.pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  });
}

pool = global.pool;

// Middlewares
app.use(cors());
app.use(express.json());

// ✅ Rota raiz (debug rápido)
app.get('/', (req, res) => {
  res.send('🚀 ISP HUB API online');
});

// ✅ Rota ping (teste sem banco)
app.get('/ping', (req, res) => {
  res.send('pong');
});

// ✅ Rota test com proteção (evita timeout)
app.get('/test', async (req, res) => {
  try {
    const result = await Promise.race([
      pool.query('SELECT NOW()'),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error('DB timeout')), 5000)
      )
    ]);

    res.json({ serverTime: result.rows[0] });
  } catch (err) {
    console.error('Erro /test:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// ✅ Suas rotas principais
app.use('/', router);

// ❌ NÃO usar app.listen na Vercel

// ✅ Export serverless
export default serverless(app);

// ✅ Export pool (uso nos repositories)
export { pool };