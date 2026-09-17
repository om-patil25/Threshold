import { pgEnum, pgTable, timestamp, uuid } from "drizzle-orm/pg-core";
import { usersTable } from "./user.model.js";
import { linksTable } from "./links.model.js";

export const eventTypeEnum = pgEnum("eventType", ["click", "profile_view"]);

export const analytics_eventTable = pgTable("analytics_events", {
  id: uuid().primaryKey().defaultRandom(),
  user_id: uuid()
    .references(() => usersTable.id)
    .notNull(),
  link_id: uuid().references(() => linksTable.id, { onDelete: "set null" }),
  event_type: eventTypeEnum("event_type").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});
