import {
  pgTable,
  uuid,
  text,
  integer,
  timestamp,
  pgEnum,
} from "drizzle-orm/pg-core";
import { usersTable } from "./user.model.js";

export const filetypeEnum = pgEnum("fileType", [
  "certification",
  "project",
  "achievement",
  "document",
]);

export const showcaseItems = pgTable("showcase_items", {
  id: uuid().primaryKey().defaultRandom(),
  user_id: uuid().references(() => usersTable.id),
  fileName: text("file_name").notNull(),
  file_title: text().notNull(),
  description: text(),
  url: text("url").notNull(),
  mimetype: text().notNull(),
  filetype: filetypeEnum("filetype").default("document").notNull(),
  size: integer("size").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at").$onUpdate(() => new Date()),
});
