import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import pg from 'pg';
import serverless from 'serverless-http';
import router from '../routes/rotas';

const { Pool } = pg;

const app = express();

// ⚠️ conexão global (evita recriar a cada request)
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

// 🔥 Teste opcional (executa uma vez)
let isConnected = false;

async function testConnection() {
  if (!isConnected) {
    try {
      await pool.query('SELECT NOW()');
      console.log('✅ Conectado ao Supabase com sucesso!');
      isConnected = true;
    } catch (err) {
      console.error('❌ Erro ao conectar no Supabase:', err.message);
    }
  }
}

testConnection();

app.use(cors());
app.use(express.json());

// 👇 usa suas rotas
app.use('/api', router);

// rota teste
app.get('/test', async (req, res) => {
  const result = await pool.query('SELECT NOW()');
  res.json({ serverTime: result.rows[0] });
});

// 👇 ESSENCIAL PRA VERCEL
export default serverless(app);

// 👇 se quiser usar o pool em outros arquivos
export { pool };