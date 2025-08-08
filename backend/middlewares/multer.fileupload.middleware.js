import path from "path";
import multer from "multer";

const upload = multer({
    limits: {
        fileSize: 50 * 1024 * 1024 // 50 MB limit
    },

    storage: multer.diskStorage({
        destination: "uploads",
        filename: (_req, file, cb) => {
            cb(null, file.originalname);
        },
    }),

    fileFilter: (_req, file, cb) => {
        // Get the file extension
        let ext = path.extname(file.originalname);

        if (
            ext !== ".jpg" &&
            ext !== ".jpeg" &&
            ext !== ".webp" &&
            ext !== ".png" &&
            // Video formats
            ext !== ".mp4" &&
            ext !== ".mkv" &&
            ext !== ".avi" &&
            ext !== ".mov" &&
            ext !== ".webm"
        ) {
            // If not allowed, reject the file with an error
            cb(new Error(`Unsupported file type! ${ext}`), false);
            return;
        }

        // If allowed, accept the file
        cb(null, true);
    },
});

export default upload;