const mongoose = require("mongoose");

export interface IUser extends Document {
  username: string;
  mobile_no: string;
  password: string;
  role: "user" | "admin" | 'super_admin'; // RBAC roles
}

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: false },
    mobile_no: { type: String, required: false, unique: true },
    password: { type: String, required: false },
    role: { type: String, enum: ["user", "admin", "super_admin"], default: "user" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
