import { drizzle } from "drizzle-orm/node-postgres";
import { env } from "../env/index";

export const db = drizzle(env.DATABASE_URL);
