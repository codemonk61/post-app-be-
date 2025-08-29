import { Router, type Request, type Response } from "express";
import { upload } from "../middlewares/upload.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import Post from "../models/Post.js";

const router = Router();

// Create post with file upload
router.post("/", authMiddleware, upload.single("image"), async (req: Request & { file?: any }, res: Response) => {
  try {
    const { title, description } = req.body;
    const userId = (req as any).user.id;

    const newPost = new Post({
      title,
      description,
      image: req.file ? `/uploads/${req.file.filename}` : undefined,
      user: userId,
      likes: [],
      dislikes: [],
      comments: [],
    });

    await newPost.save();
    res.status(201).json(newPost);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err });
  }
});

export default router;