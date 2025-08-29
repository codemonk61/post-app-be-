import mongoose from 'mongoose';
import type { Document, Types } from 'mongoose';

interface IComment {
  user: Types.ObjectId;
  text: string;
}

export interface IPost extends Document {
  title: string;
  description: string;
  image?: string;   // will hold file path
  user: Types.ObjectId;
  likes: Types.ObjectId[];
  dislikes: Types.ObjectId[];
  comments: IComment[];
}

const PostSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String }, // file path
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    dislikes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    comments: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        text: { type: String, required: true },
      },
    ],
  },
  { timestamps: true }
);
const Post = mongoose.model<IPost>('Post', PostSchema);
export default Post