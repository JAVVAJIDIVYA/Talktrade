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

    if (!process.env.JWT_SECRET) {
      console.error("❌ JWT_SECRET environment variable is not set!");
      return next(createError(500, "Server configuration error: JWT_SECRET is missing."));
    }

    const user = await User.findOne({ username });
    if (!user) {
      return next(createError(404, "User not found!"));
    }

    const isCorrect = await bcrypt.compare(password, user.password);
    if (!isCorrect) {
      return next(createError(400, "Wrong password or username!"));
    }

    const token = jwt.sign(
      {
        id: user._id,
        isSeller: user.isSeller,
        isAdmin: user.isAdmin,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    const { password: pass, ...info } = user._doc;

    const isProd = process.env.NODE_ENV === "production" || process.env.VERCEL;

    res
      .cookie("accessToken", token, {
        httpOnly: true,
        secure: isProd,
        sameSite: isProd ? "none" : "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })
      .status(200)
      .json({ ...info, token });
  } catch (error) {
    next(error);
  }
};

export const logout = async (req, res) => {
  const isProd = process.env.NODE_ENV === "production" || process.env.VERCEL;
  res
    .clearCookie("accessToken", {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? "none" : "lax",
    })
    .status(200)
    .json({ message: "User has been logged out." });
};
