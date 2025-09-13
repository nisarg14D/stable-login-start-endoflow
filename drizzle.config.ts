import type { Config } from 'drizzle-kit';

const useSupabase = process.env.NEXT_PUBLIC_USE_SUPABASE === 'true' && process.env.POSTGRES_URL;

export default {
  schema: './lib/db/schema.ts',
  out: './drizzle',
  dialect: useSupabase ? 'postgresql' : 'sqlite',
  dbCredentials: useSupabase ? {
    url: process.env.POSTGRES_URL!,
  } : {
    url: './endoflow.db',
  },
} satisfies Config;