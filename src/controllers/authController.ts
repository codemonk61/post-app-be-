import bcrypt from "bcrypt";
import User from "../models/Users.js";
import generateToken from "../utils/jwt.js";

// Signup
const signup = async (req:any, res:any) => {
    
  try {
    
    // let userData:any =  { username:"manauwar@123", mobile_no:'9091354813', password:'123', role:'user' } ;

    const {username, mobile_no, password, role} = req.body
    

    // Check if user exists
    const existingUser = await User.findOne({ mobile_no });
    if (existingUser) return res.status(400).json({ message: "User already exists" });

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      username,
      mobile_no,
      password: hashedPassword,
      role
    }) as typeof User.prototype;

    const token = generateToken(user._id.toString(), user.role);

    res.status(201).json({
      message: "User registered successfully",
      user: { id: user._id, username: user.username, mobile_no: user.mobile_no, role: user.role },
      token
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Login
const login = async (req:any, res:any) => {
  try {
    const { mobile_no, password } = req.body;

    // Find user
    const user = await User.findOne({ mobile_no }) as (typeof User.prototype & { _id: any, role: string, password: string, name?: string, email?: string });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = generateToken(user._id.toString(), user.role);

    res.json({
      message: "Login successful",
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
      token
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export { signup, login };
