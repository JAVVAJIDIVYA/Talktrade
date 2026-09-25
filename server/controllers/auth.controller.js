import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { createError } from "../utils/createError.js";

export const register = async (req, res, next) => {
  try {
    const { username, email, password, country, isSeller, phone, desc } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
    });

    if (existingUser) {
      return next(createError(400, "User already exists!"));
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Seller requires admin approval: request only, do not set isSeller yet
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      country,
      isSeller: false,
      sellerRequestStatus: isSeller ? "pending" : "none",
      phone: phone || "",
      desc: desc || "",
    });

    await newUser.save();

    res.status(201).json({ message: "User has been created successfully!" });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    // Find user
    const user = await User.findOne({ username });
    if (!user) {
      return next(createError(404, "User not found!"));
    }

    // Check password
    const isCorrect = await bcrypt.compare(password, user.password);
    if (!isCorrect) {
      return next(createError(400, "Wrong password or username!"));
    }

    // Create JWT token
    const token = jwt.sign(
      {
        id: user._id,
        isSeller: user.isSeller,
        isAdmin: user.isAdmin,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Remove password from response
    const { password: pass, ...info } = user._doc;

    res
      .cookie("accessToken", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      })
      .status(200)
      .json(info);
  } catch (error) {
    next(error);
  }
};

export const logout = async (req, res) => {
  res
    .clearCookie("accessToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    })
    .status(200)
    .json({ message: "User has been logged out." });
};
