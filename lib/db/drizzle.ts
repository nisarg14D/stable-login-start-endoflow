import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import * as schema from './schema';
import path from 'path';

// Use SQLite for local development
const sqlite = new Database(path.join(process.cwd(), 'endoflow.db'));
export const db = drizzle(sqlite, { schema });