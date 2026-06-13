import { Pool } from "pg";
import { CreateUserInput, UpdateUserInput, User, UserWithPassword } from "./users.types";

export interface IUserRepository {
  create(input: CreateUserInput): Promise<UserWithPassword>;
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<UserWithPassword | null>;
  update(id: string, input: UpdateUserInput): Promise<User | null>;
  delete(id: string): Promise<boolean>;
}

interface UserRow {
  id: number;
  name: string;
  email: string;
  password_hash: string;
  created_at: Date;
  updated_at: Date;
}

function toUser(row: UserRow): User {
  return {
    id: String(row.id),
    name: row.name,
    email: row.email,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

function toUserWithPassword(row: UserRow): UserWithPassword {
  return { ...toUser(row), passwordHash: row.password_hash };
}

export class PgUserRepository implements IUserRepository {
  constructor(private readonly pool: Pool) {}

  async create(input: CreateUserInput): Promise<UserWithPassword> {
    const result = await this.pool.query<UserRow>(
      `INSERT INTO users (name, email, password_hash)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [input.name, input.email, input.passwordHash]
    );

    return toUserWithPassword(result.rows[0]);
  }

  async findById(id: string): Promise<User | null> {
    const result = await this.pool.query<UserRow>("SELECT * FROM users WHERE id = $1", [id]);
    return result.rows[0] ? toUser(result.rows[0]) : null;
  }

  async findByEmail(email: string): Promise<UserWithPassword | null> {
    const result = await this.pool.query<UserRow>("SELECT * FROM users WHERE email = $1", [email]);
    return result.rows[0] ? toUserWithPassword(result.rows[0]) : null;
  }

  async update(id: string, input: UpdateUserInput): Promise<User | null> {
    const fields: string[] = [];
    const values: unknown[] = [];
    let index = 1;

    if (input.name !== undefined) {
      fields.push(`name = $${index++}`);
      values.push(input.name);
    }

    if (input.email !== undefined) {
      fields.push(`email = $${index++}`);
      values.push(input.email);
    }

    if (fields.length === 0) {
      return this.findById(id);
    }

    fields.push("updated_at = now()");
    values.push(id);

    const result = await this.pool.query<UserRow>(
      `UPDATE users SET ${fields.join(", ")} WHERE id = $${index} RETURNING *`,
      values
    );

    return result.rows[0] ? toUser(result.rows[0]) : null;
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.pool.query("DELETE FROM users WHERE id = $1", [id]);
    return result.rowCount !== null && result.rowCount > 0;
  }
}
