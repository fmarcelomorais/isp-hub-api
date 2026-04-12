import pg from 'pg';
const { Pool } = pg;

const poolConfig = {
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
  // Configurações para matar o 504:
  max: 1, 
  connectionTimeoutMillis: 2000, // Se não conectar em 2s, cancela (melhor dar erro que timeout)
  idleTimeoutMillis: 1000, 
};

if (!global.cachedPool) {
  global.cachedPool = new Pool(poolConfig);
}

export default global.cachedPool;