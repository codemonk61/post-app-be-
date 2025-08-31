
import { Router, type Request, type Response } from "express";
import { upload } from "../middlewares/upload.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import Post from "../models/Post.js";

const router = Router();



// Get all posts for a particular user (by user ID from token)
export const getUserPostsById = router.get("/user", authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id; // Extracted from JWT token by authMiddleware
    const posts = await Post.find({ user: userId })
      .populate("user", "name email")
      .populate("comments.user", "name email")
      .sort({ createdAt: -1 });
    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err });
  }
});

// GET /api/users -> get all users
export const getAllPosts = router.get("/", authMiddleware, async (req: Request, res: Response) => {
  try {
    const posts = await Post.find()
      .populate("user", "name email")
      .populate("comments.user", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err });
  }
});

// Get post by ID (only if it belongs to the logged-in user)
export const getRoute = router.get("/:id", authMiddleware, async (req: Request, res: Response) => {
  try {
    const postId = req.params.id;
    const userId = (req as any).user.id; // from JWT token

    console.log("Fetching post with ID:", postId, "for user ID:", userId);
    console.log("Req:",req);
    // Find the post by ID and make sure it belongs to this user
    const post = await Post.findOne({ _id: postId, user: userId })
      //.populate("user", "name email")
      //.populate("comments.user", "name email");

    if (!post) {
      return res.status(404).json({ message: "Post not found or not authorized" });
    }

    res.json(post);
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
