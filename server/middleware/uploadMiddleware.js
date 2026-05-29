import multer from "multer";

// We use memory storage because we want to upload to ImageKit directly from buffer
const storage = multer.memoryStorage();

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB limit (as per README.md)
  },
  fileFilter: (req, file, cb) => {
    // Basic filter for images and audio
    if (
      file.mimetype.startsWith("image/") ||
      file.mimetype.startsWith("audio/")
    ) {
      cb(null, true);
    } else {
      cb(new Error("Only image and audio files are supported"), false);
    }
  },
});

export default upload;
