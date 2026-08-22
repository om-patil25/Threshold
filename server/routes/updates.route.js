import e from "express";
import db from "../db/index.js";
import { eq, and } from "drizzle-orm";
import { updatesTable } from "../models/updates.model.js";
import { requireAuthentication } from "../middlewares/auth.middleware.js";
import upload from "../middlewares/fileUpload.middleware.js";
import {
  generateUniqueFilename,
  getFileNameFromUrlFormulae,
  removeFile,
  uploadFile,
} from "../utils/filehandler.js";
import { storageBucket } from "../config/supabase.js";

const router = e.Router();

router.post(
  "/updates",
  requireAuthentication,
  upload.single("image"),
  async (req, res) => {
    try {
      const user_id = req.user.user_id;

      const content = req.body.content;

      let img_url = null;
      if (req.file) {
        const { mimetype, buffer, originalname } = req.file;
        const updateFilename = "updates-" + originalname;
        const fileName = generateUniqueFilename(user_id, updateFilename);
        const { url } = await uploadFile(
          buffer,
          storageBucket,
          fileName,
          mimetype,
        );
        img_url = url;
      }

      const [update] = await db
        .insert(updatesTable)
        .values({
          user_id,
          content,
          img_url,
        })
        .returning();

      res
        .status(201)
        .json({ success: "update created successfully", update: update });
    } catch (err) {
      res.status(500).json({ error: "something went wrong" });
    }
  },
);

router.get("/updates", requireAuthentication, async (req, res) => {
  try {
    const user_id = req.user.user_id;

    const updates = await db
      .select()
      .from(updatesTable)
      .where(eq(updatesTable.user_id, user_id));

    res
      .status(200)
      .json({ success: "updates fetched successfully!", updates: updates });
  } catch (err) {
    res.status(500).json({ error: "something went wrong" });
  }
});

router.patch(
  "/updates/:id",
  requireAuthentication,
  upload.single("image"),
  async (req, res) => {
    try {
      const user_id = req.user.user_id;
      const updates_id = req.params.id;

      const [update] = await db
        .select()
        .from(updatesTable)
        .where(
          and(
            eq(updatesTable.user_id, user_id),
            eq(updatesTable.id, updates_id),
          ),
        );

      if (!update) return res.status(404).json({ error: "update not found!" });

      const content = req.body.content;
      let img_url = update.img_url;

      if (req.file) {
        const { originalname, mimetype, buffer } = req.file;
        const updateFilename = "updates-" + originalname;
        const fileName = generateUniqueFilename(user_id, updateFilename);
        const { url } = await uploadFile(
          buffer,
          storageBucket,
          fileName,
          mimetype,
        );
        img_url = url;
      }

      const [patchedUpdate] = await db
        .update(updatesTable)
        .set({ content, img_url })
        .where(
          and(
            eq(updatesTable.user_id, user_id),
            eq(updatesTable.id, updates_id),
          ),
        )
        .returning();

      if (req.file && update.img_url) {
        const oldUpdateImage = getFileNameFromUrlFormulae(update.img_url);
        await removeFile(storageBucket, oldUpdateImage);
      }
      res.status(200).json({
        success: "update patched successfully!",
        patchedUpdate: patchedUpdate,
      });
    } catch (err) {
      res.status(500).json({ error: "something went wrong " });
    }
  },
);

router.delete("/updates/:id", requireAuthentication, async (req, res) => {
  try {
    const user_id = req.user.user_id;
    const update_id = req.params.id;

    const [updateImage] = await db
      .delete(updatesTable)
      .where(
        and(eq(updatesTable.user_id, user_id), eq(updatesTable.id, update_id)),
      )
      .returning({ img_url: updatesTable.img_url });

    if (!updateImage)
      return res.status(404).json({ error: "update does not exists!" });

    if (updateImage.img_url) {
      const UpdateImage = getFileNameFromUrlFormulae(updateImage.img_url);
      await removeFile(storageBucket, UpdateImage);
    }

    res.status(200).json({ success: "update deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "something went wrong" });
  }
});

export default router;
