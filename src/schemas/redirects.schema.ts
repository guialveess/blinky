import { z } from "zod";

export const createRedirectSchema = z.object({ redirectUrl: z.url() });

export const updateRedirectSchema = z.object({ redirectUrl: z.url() });
