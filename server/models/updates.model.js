import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { usersTable } from "./user.model.js";

export const updatesTable = pgTable("updates", {
  id: uuid().primaryKey().defaultRandom(),
  user_id: uuid()
    .references(() => usersTable.id)
    .notNull(),
  content: text().notNull(),
  img_url: text(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at").$onUpdate(() => new Date()),
});
