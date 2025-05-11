import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";

// Configure Neon database to work properly in Replit
neonConfig.webSocketConstructor = ws;

// Check if DATABASE_URL environment variable is set
if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

// Create connection pool
export const pool = new Pool({ connectionString: process.env.DATABASE_URL });

// Create database client with our schema
export const db = drizzle({ client: pool, schema });