import multer from "multer";
import fs from "fs";
import path from "path";

const uploadDir = path.join(process.cwd(), "uploads");

if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, uploadDir);
    },
    filename(req, file, cb) {
        const ext = path.extname(file.originalname) || ".jpg";
        const name = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
        cb(null, name);
    }
});

const upload = multer({ storage });

export const uploadFotoMiddleware = upload.single("foto");

export const processUpload = (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: "No se envió ningún archivo" });
        }

        const publicUrl = `/uploads/${req.file.filename}`;
        res.json({ url: publicUrl });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error al procesar la imagen" });
    }
};
