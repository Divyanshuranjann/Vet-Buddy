import { Router } from "express";
import multer from "multer";
import { cloudinary } from "../config/cloudinary.js";
import { authAdmin } from "../middleware/auth.js";

const router = Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } });

router.post("/", authAdmin, upload.array("images", 8), async (req, res) => {
  try {
    if (!process.env.CLOUDINARY_CLOUD_NAME) {
      return res.status(503).json({
        message: "Cloudinary not configured. Set CLOUDINARY_* env variables.",
      });
    }
    if (!req.files?.length) {
      return res.status(400).json({ message: "No files uploaded" });
    }

    const uploads = await Promise.all(
      req.files.map(
        (file) =>
          new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
              { folder: "vetbuddy/products", resource_type: "image" },
              (err, result) => (err ? reject(err) : resolve(result.secure_url))
            );
            stream.end(file.buffer);
          })
      )
    );

    res.json({ urls: uploads });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
