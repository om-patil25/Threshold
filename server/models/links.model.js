import { pgTable, uuid, varchar, text } from "drizzle-orm/pg-core";
import { usersTable } from "./user.model.js";

export const linksTable = pgTable("links", {
  id: uuid().primaryKey().defaultRandom(),
  user_id: uuid()
    .references(() => usersTable.id)
    .notNull(),
  label: varchar({ length: 145 }).notNull(),
  url: text("url").notNull(),
});
