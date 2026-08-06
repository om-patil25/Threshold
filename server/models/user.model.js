import {
  integer,
  pgTable,
  varchar,
  uuid,
  timestamp,
  text,
} from "drizzle-orm/pg-core";

export const usersTable = pgTable("users", {
  id: uuid().primaryKey().defaultRandom(),
  name: varchar({ length: 255 }).notNull(),
  email: varchar({ length: 255 }).notNull().unique(),
  username: varchar({ length: 145 }).notNull().unique(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

export const linksTable = pgTable("links", {
  id: uuid().primaryKey().defaultRandom(),
  user_id: uuid().references(() => usersTable.id),
  label: varchar({ length: 145 }).notNull(),
  url: text("url").notNull(),
});

export const showcaseItems = pgTable("showcase_items", {
  id: uuid().primaryKey().defaultRandom(),
  user_id: uuid().references(() => usersTable.id),
  fileName: text("file_name").notNull(),
  url: text("url").notNull(),
  fileType: text("file_type"),
  size: text("size"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});
//work under progress
//main tables implemented
