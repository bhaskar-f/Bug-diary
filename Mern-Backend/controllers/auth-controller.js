import User from "../models/user.js";
import jwt from "jsonwebtoken";
import Bug from "../models/bug.js";

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

export async function updateProfile(req, res) {
  try {
    const user = await User.findById(req.user._id).select("+password");

    if (!user) {
      return res.status(404).json({ message: "user not found" });
    }

    const username = req.body.username?.trim();
    const email = req.body.email?.trim().toLowerCase();
    const password = req.body.password;
    const currentPassword = req.body.currentPassword;

    if (username) {
      if (username.length < 2) {
        return res
          .status(400)
          .json({ message: "username must be at least 2 characters" });
      }
      user.username = username;
    }

    if (email && email !== user.email) {
      const existingUser = await User.findOne({ email });
      if (existingUser && existingUser._id.toString() !== user._id.toString()) {
        return res.status(400).json({ message: "email already exist" });
      }
      user.email = email;
    }

    if (password) {
      if (!currentPassword) {
        return res.status(400).json({
          message: "current password is required to set a new password",
        });
      }

      const isCurrentPasswordValid = await user.comparePassword(currentPassword);
      if (!isCurrentPasswordValid) {
        return res.status(401).json({ message: "current password is incorrect" });
      }

      if (password.length < 8) {
        return res
          .status(400)
          .json({ message: "password must be at least 8 characters" });
      }
      user.password = password;
    }

    await user.save();

    res.json({
      message: "profile updated",
      username: user.username,
      email: user.email,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function deleteProfile(req, res) {
  try {
    const userId = req.user._id;

    await Bug.deleteMany({ createdBy: userId });
    await User.findByIdAndDelete(userId);

    res.json({ message: "profile deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function loginUser(req, res) {
  try {
    const { email, password } = req.body;

    // 1. find user (explicitly select password)
    const user = await User.findOne({ email }).select("+password");

    //check if user exist
    if (!user) {
      return res.status(401).json({ message: "user not found" });
    }

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
    res.status(401).send({ message: "invalid email or password" });
  }
}
