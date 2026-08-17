import multer from "multer";

const filefilter = (req, file, cb) => {
  const allowedFileTypes = [
    "image/png",
    "image/jpg",
    "image/jpeg",
    "application/pdf",
  ];
  if (allowedFileTypes.includes(file.mimetype)) return cb(null, true);

  cb(new Error("file type should be one of .png/.jpg/.pdf"), false);
};

const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  fileFilter: filefilter,
  limits: { fileSize: 2 * 1024 * 1024 },
});

export default upload;
