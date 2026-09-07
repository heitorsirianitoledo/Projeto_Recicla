import pg from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const { Pool } = pg;

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

pool.on('connect', () => {
  console.log('Conectado ao banco de dados relacional com sucesso!');
});

pool.on('error', (err) => {
  console.error('Erro inesperado no cliente do pool:', err);
});