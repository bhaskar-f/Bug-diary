import User from "../models/user.js";
import jwt from "jsonwebtoken";

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

export async function registerUser(req, res) {
  try {
    const { username, email, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: "email already exist" });
    }

    const user = await User.create({ username, email, password });

    const token = generateToken(user._id);

    res.status(201).json({
      user: {
        id: user._id,
        name: user.username,
        email: user.email,
      },
      token,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
// GET /api/auth/me
export const getMe = async (req, res) => {
  // req.user is set by your auth middleware (from token)
  res.json({
    username: req.user.username,
    email: req.user.email,
  });
};

export async function loginUser(req, res) {
  try {
    const { email, password } = req.body;

    // 1. find user (explicitly select password)
    const user = await User.findOne({ email }).select("+password");

    console.log(user);

    //check if user exist
    if (!user) {
      console.log("user not found");
      return res.status(401).json({ message: "user not found" });
    }

    console.log("not checking password");

    //check userPassword
    const pass = await user.comparePassword(password);

    //if exist then login
    if (!pass) {
      return res.status(401).json({ message: "invalid password" });
    }

    // 3. generate token
    const token = generateToken(user._id);

    res.status(201).json({ message: "Login Succesfull", token });
  } catch (error) {
    console.log("not okay");
    res.status(401).send({ message: "invalid email or password" });
  }
}
