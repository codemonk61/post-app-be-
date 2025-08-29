import multer from 'multer';
import path from 'path';
// store uploaded files in /uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // unique file name
    },
});
const upload = multer({ storage });
export { upload };
