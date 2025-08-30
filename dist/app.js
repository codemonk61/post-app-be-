import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import authRoutes from "./routes/authRoutes.js";
import { postRoutes, getRoute } from "./routes/postRoutes.js";
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));
app.use("/api/auth", authRoutes);
app.use('/api/post', postRoutes);
app.use('/api/post/:id', getRoute);
app.get("/", (_req, res) => {
    res.send("API is running...");
});
export { app };
