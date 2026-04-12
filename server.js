/* import 'dotenv/config';  Forma simplificada de carregar o .env
import express from 'express';
import cors from 'cors';
import pg from 'pg';

const { Pool } = pg;

const app = express();

Configuração do Banco de Dados
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false } 
});

pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('❌ Erro ao conectar no Supabase:', err.message);
  } else {
    console.log('✅ Conectado ao Supabase com sucesso!');
  }
});

app.use(cors());
app.use(express.json());
 Rota de teste direto no server

Exporta o app para ser usado no api.js
export default app;
export { pool }; Exportamos o pool para você usar as queries em outros arquivos 
*/