import { inArray, eq } from "drizzle-orm";
import db from "../db/index.js";
import { updatesTable } from "../models/updates.model.js";
import { storageBucket } from "../config/supabase.js";
import { getFileNameFromUrlFormulae, removeFile } from "./filehandler.js";

export const updateAfterFilteredExpired = async (afterDays, userid) => {
  const DAYS_MS = afterDays * 24 * 60 * 60 * 1000;
  const cutoff = new Date(Date.now() - DAYS_MS);
  const allUpdates = await db
    .select()
    .from(updatesTable)
    .where(eq(updatesTable.user_id, userid));
  const expired = allUpdates.filter((u) => new Date(u.createdAt) < cutoff);
  const active = allUpdates.filter((u) => new Date(u.createdAt) >= cutoff);

  if (expired.length > 0) {
    try {
      const expiredIds = expired.map((u) => u.id);
      const expiredUpdate = await db
        .delete(updatesTable)
        .where(inArray(updatesTable.id, expiredIds))
        .returning({ img_url: updatesTable.img_url });

      for (const expUpdate of expiredUpdate) {
        if (expUpdate.img_url) {
          const expiredUpdateImage = getFileNameFromUrlFormulae(
            expUpdate.img_url,
          );
          await removeFile(storageBucket, expiredUpdateImage);
        }
      }
    } catch (err) {
      console.error("auto deletion of expired updates failed " + err);
    }
  }

  return active;
};
