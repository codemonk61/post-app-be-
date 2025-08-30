import { Router } from "express";
import { upload } from "../middlewares/upload.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import Post from "../models/Post.js";
const router = Router();
// Get post by ID
export const getRoute = router.get("/:id", authMiddleware, async (req, res) => {
    try {
        const postId = req.params.id;
        const post = await Post.findById(postId)
            .populate("user", "name email") // optional: include user details
            .populate("comments.user", "name email"); // optional: include commenter details
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }
        res.json(post);
    }
    catch (err) {
        res.status(500).json({ message: "Server error", error: err });
    }
});
// Create post with file upload
export const postRoutes = router.post("/", authMiddleware, upload.single("image"), async (req, res) => {
    try {
        const { title, description } = req.body;
        const userId = req.user.id;
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
    }
    catch (err) {
        res.status(500).json({ message: "Server error", error: err });
    }
});
