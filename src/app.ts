import express, { type Request, type Response } from "express";
import path from "path";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import authRoutes from "./routes/authRoutes.js";
import {postRoutes, getUserPostsById }from "./routes/postRoutes.js";
import { fileURLToPath } from "url";


const app = express();


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// CORS for all requests, including static files
app.use(cors({
  origin: "http://localhost:5173", // your frontend
  credentials: true,
}));

app.use("/uploads", (req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:5173");
  next();
}, express.static(path.join(__dirname, "../uploads")));



app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(helmet());
app.use(morgan("dev"));
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

app.use("/api/auth", authRoutes);
app.use('/api/post', postRoutes);
app.use('/api/post/user', getUserPostsById);

app.get("/", (_req: Request, res: Response) => {
  res.send("API is running...");
});

export { app };
 