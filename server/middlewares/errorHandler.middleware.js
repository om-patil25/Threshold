import multer from "multer";
import { FileTypeError } from "./fileUpload.middleware.js";
/**
 *
 * @param {import("express").Request} err
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 */

export const errorHandler = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({ error: "file it too large" });
    }
    return res.status(400).json({ error: "file upload failed" });
  } else if (err instanceof FileTypeError) {
    return res.status(400).json({ error: err.message });
  }

  res.status(500).json({ error: "something went wrong" });
};
