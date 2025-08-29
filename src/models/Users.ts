import mongoose, { type Document } from "mongoose";

export interface IUser extends Document {
  username: string;
  mobile_no: string;
  password: string;
  role: "user" | "admin" | 'super_admin'; // RBAC roles
}

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true },
    mobile_no: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["user", "admin", "super_admin"], default: "user" },
  },
  { timestamps: true }
);

const User = mongoose.model<IUser>("User", userSchema);
export default User;
