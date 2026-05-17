import { db } from "../db/client";
import { eq, and } from "drizzle-orm";
import { linksTable } from "../db/schema/links";
import { projectsTable } from "../db/schema/projects";
import { parametersTable } from "../db/schema/parameters";
import { linksParametersTable } from "../db/schema/links_parameters";
import { redirectsTable } from "../db/schema/redirects";
import { redis } from "../lib/redis";

const GENERATE_CACHE_TTL = 300;

export async function getLinkOwnedByUser(id: string, userId: string) {
  const [result] = await db
    .select({ link: linksTable })
    .from(linksTable)
    .innerJoin(projectsTable, eq(linksTable.projectId, projectsTable.id))
    .where(and(eq(linksTable.id, id), eq(projectsTable.userId, userId)));

  if (!result) throw new Error("Link não encontrado");
  return result.link;
}

export async function createLink(
  userId: string,
  projectId: string,
  name: string,
  baseUrl: string,
) {
  const [project] = await db
    .select()
    .from(projectsTable)
    .where(
      and(eq(projectsTable.id, projectId), eq(projectsTable.userId, userId)),
    );

  if (!project) throw new Error("Projeto não encontrado");

  const [link] = await db
    .insert(linksTable)
    .values({ projectId, name, baseUrl })
    .returning();

  return link;
}

export async function listLinks(
  userId: string,
  projectId: string,
  page = 1,
  limit = 20,
) {
  const safeLimit = Math.min(limit, 100);
  const offset = (page - 1) * safeLimit;

  const [project] = await db
    .select()
    .from(projectsTable)
    .where(
      and(eq(projectsTable.id, projectId), eq(projectsTable.userId, userId)),
    );

  if (!project) {
    throw new Error("Projeto não encontrado");
  }

  const links = await db
    .select({
      id: linksTable.id,
      slug: linksTable.name,
      baseUrl: linksTable.baseUrl,
      createdAt: linksTable.createdAt,
    })
    .from(linksTable)
    .where(eq(linksTable.projectId, projectId))
    .limit(safeLimit)
    .offset(offset);

  return links;
}

export async function getLink(id: string, userId: string) {
  return getLinkOwnedByUser(id, userId);
}

export async function updateLink(
  id: string,
  userId: string,
  data: { name?: string; baseUrl?: string },
) {
  await getLinkOwnedByUser(id, userId);

  const [link] = await db
    .update(linksTable)
    .set(data)
    .where(eq(linksTable.id, id))
    .returning();

  await redis.del(`link:generate:${id}`);
  return link;
}

export async function deleteLink(id: string, userId: string) {
  await getLinkOwnedByUser(id, userId);

  const [link] = await db
    .delete(linksTable)
    .where(eq(linksTable.id, id))
    .returning();

  await redis.del(`link:generate:${id}`);
  return link;
}

export async function addParameterToLink(
  linkId: string,
  parameterId: string,
  userId: string,
) {
  await getLinkOwnedByUser(linkId, userId);

  const [parameter] = await db
    .select()
    .from(parametersTable)
    .where(
      and(
        eq(parametersTable.id, parameterId),
        eq(parametersTable.userId, userId),
      ),
    );

  if (!parameter) throw new Error("Parâmetro não encontrado");

  const [association] = await db
    .insert(linksParametersTable)
    .values({ linkId, parameterId })
    .onConflictDoNothing()
    .returning();

  if (!association) throw new Error("Parâmetro já associado a este link");

  await redis.del(`link:generate:${linkId}`);
  return association;
}

export async function removeParameterFromLink(
  linkId: string,
  parameterId: string,
  userId: string,
) {
  await getLinkOwnedByUser(linkId, userId);

  const [association] = await db
    .delete(linksParametersTable)
    .where(
      and(
        eq(linksParametersTable.linkId, linkId),
        eq(linksParametersTable.parameterId, parameterId),
      ),
    )
    .returning();

  if (!association) throw new Error("Associação não encontrada");

  await redis.del(`link:generate:${linkId}`);
  return association;
}

export async function generateLink(id: string, userId: string) {
  const cached = await redis.get(`link:generate:${id}`);
  if (cached) return JSON.parse(cached) as { url: string };

  const link = await getLinkOwnedByUser(id, userId);

  const params = await db
    .select({ parameter: parametersTable })
    .from(linksParametersTable)
    .innerJoin(
      parametersTable,
      eq(linksParametersTable.parameterId, parametersTable.id),
    )
    .where(eq(linksParametersTable.linkId, id));

  const [redirectRow] = await db
    .select()
    .from(redirectsTable)
    .where(eq(redirectsTable.linkId, id));

  const url = new URL(link.baseUrl);
  for (const { parameter } of params) {
    url.searchParams.set(parameter.key, parameter.value);
  }
  if (redirectRow) {
    url.searchParams.set("redirect", redirectRow.redirectUrl);
  }

  const result = { url: url.toString() };
  await redis.setex(
    `link:generate:${id}`,
    GENERATE_CACHE_TTL,
    JSON.stringify(result),
  );

  return result;
}
