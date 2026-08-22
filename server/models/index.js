//this file gonna act like a common connection to all schemas and drizzle config
export { usersTable } from "./user.model.js";
export { linksTable } from "./links.model.js";
export { filetypeEnum, showcaseItems } from "./showcase_items.model.js"; // this thing exporting enum with schema was needed, because of this i had hard time decoding what was going wrong while pushing schema using enum
export { updatesTable } from "./updates.model.js";
export {
  eventTypeEnum,
  analytics_eventTable,
} from "./analytics_event.model.js";
