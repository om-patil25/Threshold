import supabase from "../config/supabase.js";

export const uploadFile = (buffer, bucketName, fileName, contentType) => {
  const { data, error } = supabase.storage
    .from(bucketName)
    .upload(fileName, buffer, { contentType });

  if (error) {
    throw { error: "file upload error!" + error };
  }

  const { data: url } = supabase.storage
    .from(bucketName)
    .getPublicUrl(fileName);

  return url.publicUrl;
};

export const removeFile = (bucketName, fileName) => {
  const { data, error } = supabase.storage.from(bucketName).remove([fileName]);

  if (error) {
    throw { error: "file deletion error!" + error };
  }

  return "sucessfully deleted file";
};

export const generateUniqueFilename = (userid, OriginalName) => {
  const processedName = OriginalName.replaceAll(" ", "_").toLowerCase();
  const uniqueFileName = userid + "/" + Date.now() + "-" + processedName;
  return uniqueFileName;
};
