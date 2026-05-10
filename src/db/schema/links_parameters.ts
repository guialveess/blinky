import { pgTable, uuid, primaryKey } from "drizzle-orm/pg-core";
import { linksTable } from "./links";
import { parametersTable } from "./parameters";

export const linksParametersTable = pgTable(
  "links_parameters",
  {
    linkId: uuid("link_id")
      .notNull()
      .references(() => linksTable.id, { onDelete: "cascade" }),
    parameterId: uuid("parameter_id")
      .notNull()
      .references(() => parametersTable.id, { onDelete: "cascade" }),
  },
  (table) => [primaryKey({ columns: [table.linkId, table.parameterId] })],
);
