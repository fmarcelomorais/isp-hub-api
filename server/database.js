import pg from 'pg';
const { Pool } = pg;

const poolConfig = {
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
  max: 1, 
  idleTimeoutMillis: 1000, 
  connectionTimeoutMillis: 5000,
};

// ✅ O segredo do Serverless: Usar o objeto 'global' SEMPRE para evitar vazamento de conexões
// No desenvolvimento (Next.js/Nodemon) evita duplicar no Hot Reload.
// Na Vercel, ajuda a manter a mesma conexão em funções "quentes" (Warm Starts).
if (!global.cachedPool) {
  global.cachedPool = new Pool(poolConfig);
}

const pool = global.cachedPool;

// ✅ Tratamento de erro global do Pool (Evita que o processo morra em silêncio)
pool.on('error', (err) => {
  console.error('Erro inesperado no Pool do Postgres:', err);
});

export default pool;