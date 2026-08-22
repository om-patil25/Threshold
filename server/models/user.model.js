import { pgTable, varchar, uuid, timestamp, text } from "drizzle-orm/pg-core";

export const usersTable = pgTable("users", {
  id: uuid().primaryKey().defaultRandom(),
  name: varchar({ length: 255 }).notNull(),
  email: varchar({ length: 255 }).notNull().unique(),
  username: varchar({ length: 145 }).notNull().unique(),
  password: text(),
  bio: text(),
  worktitle: text(),
  profileimage: text(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at").$onUpdate(() => new Date()),
});
