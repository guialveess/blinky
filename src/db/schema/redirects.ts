import { pgTable, uuid, text, timestamp } from "drizzle-orm/pg-core";
import { linksTable } from "./links";

export const redirectsTable = pgTable("redirects", {
  id: uuid().primaryKey().defaultRandom(),
  redirectUrl: text().notNull(),
  linkId: uuid("link_id")
    .notNull()
    .references(() => linksTable.id, { onDelete: "cascade" })
    .unique(),
  createdAt: timestamp().defaultNow().notNull(),
  updatedAt: timestamp()
    .defaultNow()
    .notNull()
    .$onUpdateFn(() => new Date()),
});
