import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL environment variable is not set!");
}

// Disable prefetch as it is not supported for "Transaction" pool mode
// Note: Supabase recommends using Transaction pool mode for serverless functions
const client = postgres(connectionString, { prepare: false });

export const db = drizzle(client, { schema });
