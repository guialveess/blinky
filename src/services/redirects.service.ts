import { db } from "../db/client";
import { eq } from "drizzle-orm";
import { redirectsTable } from "../db/schema/redirects";
import { redis } from "../lib/redis";
import { getLinkOwnedByUser } from "./links.service";

export async function createRedirect(linkId: string, userId: string, redirectUrl: string) {
  await getLinkOwnedByUser(linkId, userId);

  const [redirect] = await db
    .insert(redirectsTable)
    .values({ linkId, redirectUrl })
    .returning();

  await redis.del(`link:generate:${linkId}`);
  return redirect;
}

export async function updateRedirect(linkId: string, userId: string, redirectUrl: string) {
  await getLinkOwnedByUser(linkId, userId);

  const [redirect] = await db
    .update(redirectsTable)
    .set({ redirectUrl })
    .where(eq(redirectsTable.linkId, linkId))
    .returning();

  if (!redirect) throw new Error("Redirect não encontrado");

  await redis.del(`link:generate:${linkId}`);
  return redirect;
}

export async function deleteRedirect(linkId: string, userId: string) {
  await getLinkOwnedByUser(linkId, userId);

  const [redirect] = await db
    .delete(redirectsTable)
    .where(eq(redirectsTable.linkId, linkId))
    .returning();

  if (!redirect) throw new Error("Redirect não encontrado");

  await redis.del(`link:generate:${linkId}`);
  return redirect;
}
