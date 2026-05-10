import { db } from "../db/client";
import { eq, and } from "drizzle-orm";
import { parametersTable } from "../db/schema/parameters";

export async function createParameter(userId: string, key: string, value: string) {
  const [parameter] = await db
    .insert(parametersTable)
    .values({ userId, key, value })
    .returning();

  return parameter;
}

export async function listParameters(userId: string) {
  return db.select().from(parametersTable).where(eq(parametersTable.userId, userId));
}

export async function deleteParameter(id: string, userId: string) {
  const [parameter] = await db
    .delete(parametersTable)
    .where(and(eq(parametersTable.id, id), eq(parametersTable.userId, userId)))
    .returning();

  if (!parameter) {
    throw new Error("Parâmetro não encontrado");
  }

  return parameter;
}
