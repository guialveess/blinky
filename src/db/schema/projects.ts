import { pgTable, uuid, text, timestamp } from "drizzle-orm/pg-core";
import { usersTable } from "./users";

export const projectsTable = pgTable("projects", {
  id: uuid().primaryKey().defaultRandom(),
  name: text().notNull(),
  description: text(),
  userId: uuid("user_id")
    .notNull()
    .references(() => usersTable.id, { onDelete: "cascade" }),
  createdAt: timestamp().defaultNow().notNull(),
  updatedAt: timestamp()
    .defaultNow()
    .notNull()
    .$onUpdateFn(() => new Date()),
});
