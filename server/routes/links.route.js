import e from "express";
import { Router } from "express";
import db from "../db/index.js";
import { linksTable } from "../models/links.model.js";
import { and, eq } from "drizzle-orm";
import { requireAuthentication } from "../middlewares/auth.middleware.js";
import {
  linksPatchRequestBodySchema,
  linksPostRequestBodySchema,
} from "../validations/requests.validation.js";
import { validateData } from "../middlewares/validation.middleware.js";

const router = e.Router();

router.post(
  "/links",
  requireAuthentication,
  validateData(linksPostRequestBodySchema),
  async (req, res) => {
    try {
      const user_id = req.user.user_id;
      const { label, url } = req.body;
      const [link] = await db
        .insert(linksTable)
        .values({
          user_id: user_id,
          label,
          url,
        })
        .returning();

      res
        .status(201)
        .json({ success: "link created successfully", link: link });
    } catch (err) {
      res.status(500).json({ error: "something went wrong" });
    }
  },
);

router.get("/links", requireAuthentication, async (req, res) => {
  try {
    const user_id = req.user.user_id;
    const links = await db
      .select()
      .from(linksTable)
      .where(eq(linksTable.user_id, user_id));

    res
      .status(200)
      .json({ success: "links fetched successfully", links: links });
  } catch (err) {
    res.status(500).json({ error: "something went wrong" });
  }
});

router.patch(
  "/links/:id",
  requireAuthentication,
  validateData(linksPatchRequestBodySchema),
  async (req, res) => {
    try {
      const link_id = req.params.id;
      const user_id = req.user.user_id;
      const { label, url } = req.body;
      const [link] = await db
        .update(linksTable)
        .set({
          label,
          url,
        })
        .where(and(eq(linksTable.id, link_id), eq(linksTable.user_id, user_id)))
        .returning();
      res
        .status(200)
        .json({ success: "link updated successfully", link: link });
    } catch (err) {
      res.status(500).json({ error: "something went wrong" });
    }
  },
);

router.delete("/links/:id", requireAuthentication, async (req, res) => {
  try {
    const link_id = req.params.id;
    const user_id = req.user.user_id;

    await db
      .delete(linksTable)
      .where(and(eq(linksTable.id, link_id), eq(linksTable.user_id, user_id)));

    res.status(200).json({ success: "link deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "something went wrong" });
  }
});

export default router;
