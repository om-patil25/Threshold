import multer from "multer";

const filefilter = (req, file, cb) => {
  const allowedFileTypes = [
    "image/png",
    "image/jpg",
    "image/jpeg",
    "application/pdf",
    "image/webp",
  ];
  if (allowedFileTypes.includes(file.mimetype)) return cb(null, true);

  cb(new FileTypeError("file type should be one of .png/.jpg/.pdf"), false);
};

const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  fileFilter: filefilter,
  limits: { fileSize: 3 * 1024 * 1024 },
});

export class FileTypeError extends Error {
  constructor(message) {
    super(message); // sends this custom file message to Error's constructer to set as message
    this.name = "FileTypeError";
  }
}

export default upload;
