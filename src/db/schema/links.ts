import { pgTable, text, uuid, timestamp } from "drizzle-orm/pg-core";
import { projectsTable } from "./projects";

export const linksTable = pgTable("links", {
  id: uuid().primaryKey().defaultRandom(),
  name: text().notNull(),
  baseUrl: text().notNull(),
  projectId: uuid("project_id")
    .notNull()
    .references(() => projectsTable.id, { onDelete: "cascade" }),
  createdAt: timestamp().defaultNow().notNull(),
  updatedAt: timestamp()
    .defaultNow()
    .notNull()
    .$onUpdateFn(() => new Date()),
});
