import { Pool } from "pg";

const DATABASE_URL = process.env.DATABASE_URL ?? "postgres://postgres:postgres@localhost:5432/estudamais_users";

export const pool = new Pool({ connectionString: DATABASE_URL });

const CREATE_USERS_TABLE = `
  CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
  );
`;

export async function connectDatabase(): Promise<void> {
  await pool.query("SELECT 1");
  await pool.query(CREATE_USERS_TABLE);
  console.log("Conectado ao PostgreSQL");
}

export async function disconnectDatabase(): Promise<void> {
  await pool.end();
}
