import { pgTable, uuid, timestamp, text } from "drizzle-orm/pg-core";
import { usersTable } from "./users";

export const parametersTable = pgTable("parameters", {
  id: uuid().primaryKey().defaultRandom(),
  key: text().notNull(),
  value: text().notNull(),
  userId: uuid("user_id")
    .notNull()
    .references(() => usersTable.id, { onDelete: "cascade" }),
  createdAt: timestamp().defaultNow().notNull(),
  updatedAt: timestamp()
    .defaultNow()
    .notNull()
    .$onUpdateFn(() => new Date()),
});
