import { drizzle } from 'drizzle-orm/better-sqlite3';
import { drizzle as drizzlePg } from 'drizzle-orm/postgres-js';
import Database from 'better-sqlite3';
import postgres from 'postgres';
import * as schema from './schema';
import path from 'path';

// Only check environment in browser/server context safely
const useSupabase = typeof window !== 'undefined' 
  ? process.env.NEXT_PUBLIC_USE_SUPABASE === 'true'
  : process.env.NEXT_PUBLIC_USE_SUPABASE === 'true' && process.env.POSTGRES_URL;

let db: any;

try {
  if (useSupabase && process.env.POSTGRES_URL) {
    // Use PostgreSQL for Supabase
    const client = postgres(process.env.POSTGRES_URL);
    db = drizzlePg(client, { schema });
  } else {
    // Use SQLite for local development
    const sqlite = new Database(path.join(process.cwd(), 'endoflow.db'));
    db = drizzle(sqlite, { schema });
  }
} catch (error) {
  console.warn('Database connection fallback to SQLite:', error);
  // Fallback to SQLite if connection fails
  const sqlite = new Database(path.join(process.cwd(), 'endoflow.db'));
  db = drizzle(sqlite, { schema });
}

export { db };