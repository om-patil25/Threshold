import e from "express";
import upload from "../middlewares/fileUpload.middleware.js";
import { requireAuthentication } from "../middlewares/auth.middleware.js";
import db from "../db/index.js";
import { eq, and } from "drizzle-orm";
import { showcaseItems } from "../models/showcase_items.model.js";
import {
  generateUniqueFilename,
  removeFile,
  uploadFile,
} from "../utils/filehandler.js";
import { validateData } from "../middlewares/validation.middleware.js";
import {
  showcaseitemPatchRequestSchema,
  showcaseitemPostRequestSchema,
} from "../validations/requests.validation.js";
import { storageBucket } from "../config/supabase.js";

const router = e.Router();

router.post(
  "/showcase-items",
  requireAuthentication,
  upload.single("file"),
  validateData(showcaseitemPostRequestSchema),
  async (req, res) => {
    try {
      if (!req.file)
        return res.status(400).json({ message: "you need to upload file!" });

      const user_id = req.user.user_id;
      const { originalname, mimetype, size, buffer } = req.file;
      const { filetype, file_title, description } = req.body;
      const fileName = generateUniqueFilename(user_id, originalname);
      const { url, newmimetype, newfileName } = await uploadFile(
        buffer,
        storageBucket,
        fileName,
        mimetype,
      );
      const [file] = await db
        .insert(showcaseItems)
        .values({
          user_id: user_id,
          fileName: newfileName,
          url,
          mimetype: newmimetype,
          filetype,
          size,
          file_title,
          description,
        })
        .returning();
      res
        .status(201)
        .json({ message: "File uploaded successfully!", file: file });
    } catch (err) {
      res.status(500).json({ message: "something went wrong " });
    }
  },
);

router.get("/showcase-items", requireAuthentication, async (req, res) => {
  try {
    const user_id = req.user.user_id;
    const files = await db
      .select()
      .from(showcaseItems)
      .where(eq(showcaseItems.user_id, user_id));

    res
      .status(200)
      .json({ message: "files fetched successfully", files: files });
  } catch (err) {
    res.status(500).json({ message: "something went wrong" });
  }
});

router.patch(
  "/showcase-items/:file_id",
  requireAuthentication,
  upload.single("file"),
  validateData(showcaseitemPatchRequestSchema),
  async (req, res) => {
    try {
      const user_id = req.user.user_id;
      const file_id = req.params.file_id;
      const [file] = await db
        .select()
        .from(showcaseItems)
        .where(
          and(
            eq(showcaseItems.user_id, user_id),
            eq(showcaseItems.id, file_id),
          ),
        );
      if (!file) return res.status(404).json({ message: "file not found!" });

      const { file_title, filetype, description } = req.body;
      let updateData = { file_title, filetype, description };

      if (req.file) {
        const { originalname, mimetype, size, buffer } = req.file;
        const fileName = generateUniqueFilename(user_id, originalname);
        const { url, newmimetype, newfileName } = await uploadFile(
          buffer,
          storageBucket,
          fileName,
          mimetype,
        );
        updateData = {
          ...updateData,
          mimetype: newmimetype,
          size,
          fileName: newfileName,
          url,
        };
      }
      const [updatedFile] = await db
        .update(showcaseItems)
        .set(updateData)
        .where(
          and(
            eq(showcaseItems.user_id, user_id),
            eq(showcaseItems.id, file_id),
          ),
        )
        .returning();

      if (req.file && file.fileName) {
        await removeFile(storageBucket, file.fileName);
      }
      res.status(200).json({
        message: "File updated successfully!",
        updatedFile: updatedFile,
      });
    } catch (err) {
      res.status(500).json({ message: "something went wrong " });
    }
  },
);

router.delete(
  "/showcase-items/:file_id",
  requireAuthentication,
  async (req, res) => {
    try {
      const user_id = req.user.user_id;
      const file_id = req.params.file_id;
      const [file] = await db
        .delete(showcaseItems)
        .where(
          and(
            eq(showcaseItems.user_id, user_id),
            eq(showcaseItems.id, file_id),
          ),
        )
        .returning({ fileName: showcaseItems.fileName });

      if (!file)
        return res.status(404).json({ message: "file does not exists!" });

      await removeFile(storageBucket, file.fileName);

      res.status(200).json({ message: "removed", file: file });
    } catch (err) {
      res.status(500).json({ message: "something went wrong" });
      console.log(err);
    }
  },
);

export default router;
