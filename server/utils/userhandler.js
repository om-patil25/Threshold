import db from "../db/index.js";
import { usersTable } from "../models/user.model.js";
import { eq } from "drizzle-orm";

export const isUsernameAvailable = async (username) => {
  const reserved_keywords = [
    "admin",
    "signup",
    "login",
    "features",
    "404",
    "about",
  ];

  if (reserved_keywords.includes(username.toLowerCase())) {
    return {
      available: false,
      message: "this username is reserved",
    };
  }

  const [user] = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.username, username));

  if (user) {
    return { available: false };
  }
  return { available: true };
};
