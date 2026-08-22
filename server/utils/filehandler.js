import supabase, { storageBucket } from "../config/supabase.js";
import sharp from "sharp";
import path from "node:path";

export const uploadFile = async (buffer, bucketName, fileName, contentType) => {
  let compressedFilebuffer = buffer;
  let uploadContentType = contentType;
  let uploadFileName = fileName;

  if (contentType != "application/pdf") {
    compressedFilebuffer = await sharp(buffer)
      .resize({ width: 800, withoutEnlargement: true })
      .webp({ quality: 80 })
      .toBuffer();

    uploadContentType = "image/webp";
    uploadFileName = fileName + ".webp";
  } else {
    uploadFileName = fileName + ".pdf";
  }

  const { data, error } = await supabase.storage
    .from(bucketName)
    .upload(uploadFileName, compressedFilebuffer, {
      contentType: uploadContentType,
      upsert: false,
    });

  if (error) {
    throw { error: "file upload error!" + error };
  }

  const { data: url } = await supabase.storage
    .from(bucketName)
    .getPublicUrl(uploadFileName);

  return {
    url: url.publicUrl,
    newmimetype: uploadContentType,
    newfileName: uploadFileName,
  };
};

export const removeFile = async (bucketName, fileName) => {
  const { data, error } = await supabase.storage
    .from(bucketName)
    .remove([fileName]);

  if (error) {
    throw { error: "file deletion error!" + error };
  }

  return "sucessfully deleted file";
};

export const generateUniqueFilename = (userid, OriginalName) => {
  const name = path.parse(OriginalName).name;
  const processedName = name.replaceAll(" ", "_").toLowerCase();
  const uniqueFileName = userid + "/" + Date.now() + "-" + processedName;
  return uniqueFileName;
};

export const getFileNameFromUrlFormulae = (url) => {
  const fileName = url.split(`${storageBucket}/`).at(-1);
  return fileName;
};
