import { db } from "../db/client";
import { eq } from "drizzle-orm";
import jwt from "jsonwebtoken";
import { usersTable } from "../db/schema/users";
import bcrypt from "bcryptjs";
import { env } from "../env";
import type { StringValue } from "ms";

export async function register(name: string, email: string, password: string) {
  const existing = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.email, email));

  if (existing.length > 0) {
    throw new Error("Email já cadastrado");
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const [user] = await db
    .insert(usersTable)
    .values({ name, email, passwordHash })
    .returning({
      id: usersTable.id,
      name: usersTable.name,
      email: usersTable.email,
      createdAt: usersTable.createdAt,
    });

  return user;
}

export async function login(email: string, password: string) {
  const [user] = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.email, email));

  if (!user) {
    throw new Error("Email ou senha inválidos");
  }

  const valid = await bcrypt.compare(password, user.passwordHash);

  if (!valid) {
    throw new Error("Email ou senha inválidos");
  }

  const token = jwt.sign({ id: user.id, email: user.email }, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN as StringValue,
  });

  return {
    token,
  };
}
