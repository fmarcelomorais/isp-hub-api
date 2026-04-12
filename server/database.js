import pg from 'pg';
const { Pool } = pg;

// Configurações otimizadas para ambiente Serverless
const poolConfig = {
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
  
  // 🚨 Adicione estas 3 linhas para matar os Timeouts:
  max: 1,                    // No plano Hobby, use apenas 1 conexão por instância
  idleTimeoutMillis: 1000,    // Fecha a conexão após 1 segundo de inatividade
  connectionTimeoutMillis: 5000, // Desiste de conectar após 5s (evita os 300s de espera)
};

let pool;

if (process.env.NODE_ENV === 'production') {
  // Em produção (Vercel), criamos um pool novo ou otimizado por execução
  pool = new Pool(poolConfig);
} else {
  // Em desenvolvimento, mantemos o global para o Hot Reload
  if (!global.pool) {
    global.pool = new Pool(poolConfig);
  }
  pool = global.pool;
}

export default pool;