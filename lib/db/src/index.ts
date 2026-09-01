import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "./schema";

const { Pool } = pg;

const connectionString =
  process.env.DATABASE_URL ||
  "postgresql://neondb_owner:npg_c7prHhSn5FsV@ep-divine-meadow-axnl1tvy-pooler.c-4.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require";

export const pool = new Pool({ connectionString });
export const db = drizzle(pool, { schema });

export * from "./schema";
