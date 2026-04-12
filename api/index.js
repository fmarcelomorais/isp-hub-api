import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import pg from 'pg';
import serverless from 'serverless-http';

import router from '../routes/rotas.js'

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


// ✅ Suas rotas principais
app.use('/', router);

// ❌ NÃO usar app.listen na Vercel

// ✅ Export serverless
export default serverless(app);

// ✅ Export pool (uso nos repositories)
export { pool };