import 'dotenv/config';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 20,
  idleTimeoutMillis: 60000,
  connectionTimeoutMillis: 3000,
  ssl: process.env.NODE_ENV === 'production' 
    ? { rejectUnauthorized: false, checkServerIdentity: () => undefined }
    : false,
});

pool.on('error', (err) => {
  console.error('DB Pool error:', err.message);
});

export const db = {
  query: (text: string, params?: unknown[]) => pool.query(text, params),
  getClient: () => pool.connect(),
};