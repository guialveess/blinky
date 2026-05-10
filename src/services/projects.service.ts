import { db } from "../db/client";
import { eq, and } from "drizzle-orm";
import { projectsTable } from "../db/schema/projects";

export async function createProject(
  userId: string,
  name: string,
  description?: string,
) {
  const [project] = await db
    .insert(projectsTable)
    .values({ userId, name, description })
    .returning();

  return project;
}

export async function listProjects(userId: string) {
  const projects = await db
    .select()
    .from(projectsTable)
    .where(eq(projectsTable.userId, userId));

  return projects;
}

export async function getProject(id: string, userId: string) {
  const [project] = await db
    .select()
    .from(projectsTable)
    .where(and(eq(projectsTable.id, id), eq(projectsTable.userId, userId)));

  if (!project) {
    throw new Error("Projeto não encontrado");
  }

  return project;
}

export async function updateProject(
  id: string,
  userId: string,
  data: { name?: string; description?: string },
) {
  const [project] = await db
    .update(projectsTable)
    .set(data)
    .where(and(eq(projectsTable.id, id), eq(projectsTable.userId, userId)))
    .returning();

  if (!project) {
    throw new Error("Projeto não encontrado");
  }

  return project;
}

export async function deleteProject(id: string, userId: string) {
  const [project] = await db
    .delete(projectsTable)
    .where(and(eq(projectsTable.id, id), eq(projectsTable.userId, userId)))
    .returning();

  if (!project) {
    throw new Error("Projeto não encontrado");
  }

  return project;
}
