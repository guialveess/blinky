import { z } from "zod";

export const createLinkSchema = z.object({
  projectId: z.uuid(),
  name: z.string().min(1),
  baseUrl: z.url(),
});

export const updateLinkSchema = z.object({
  name: z.string().min(1).optional(),
  baseUrl: z.url().optional(),
});

export const linkParamsSchema = z.object({ id: z.uuid() });

export const listLinksQuerySchema = z.object({ projectId: z.uuid() });

export const addParameterToLinkSchema = z.object({ parameterId: z.uuid() });

export const linkParameterParamsSchema = z.object({
  id: z.uuid(),
  parameterId: z.uuid(),
});
