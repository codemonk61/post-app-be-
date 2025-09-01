
import { Router, type Request, type Response } from "express";
import { upload } from "../middlewares/upload.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import Post from "../models/Post.js";

const router = Router();



// Get all posts for a particular user (by user ID from token)
export const getUserPostsById = router.get("/", authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id; // Extracted from JWT token by authMiddleware
    const posts = await Post.find({ user: userId })
    console.log("User ID:", userId);
      // .populate("user", "name email")
      // .populate("comments.user", "name email")
      // .sort({ createdAt: -1 });
    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err });
  }
});

// Create post with file upload
export const postRoutes = router.post("/", authMiddleware, upload.single("image"), async (req: Request & { file?: any }, res: Response) => {
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
