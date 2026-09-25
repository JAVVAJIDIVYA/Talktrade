import User from "../models/user.model.js";
import Gig from "../models/gig.model.js";
import Order from "../models/order.model.js";
import bcrypt from "bcryptjs";
import { createError } from "../utils/createError.js";

export const getStats = async (req, res, next) => {
  try {
    const [totalUsers, totalSellers, totalGigs, totalOrders, pendingSellerRequests] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ isSeller: true }),
      Gig.countDocuments(),
      Order.countDocuments(),
      User.countDocuments({ sellerRequestStatus: "pending" }),
    ]);
    const completedOrders = await Order.countDocuments({ isCompleted: true });
    res.status(200).json({
      totalUsers,
      totalSellers,
      totalGigs,
      totalOrders,
      completedOrders,
      pendingSellerRequests,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllUsers = async (req, res, next) => {
  try {
    const { sellersOnly } = req.query;
    const filter = sellersOnly === "true" ? { isSeller: true } : {};
    const users = await User.find(filter)
      .select("-password")
      .sort({ createdAt: -1 })
      .limit(500);
    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
};

export const getAllGigs = async (req, res, next) => {
  try {
    const gigs = await Gig.find()
      .populate("userId", "username img email country")
      .sort({ createdAt: -1 })
      .limit(500);
    res.status(200).json(gigs);
  } catch (error) {
    next(error);
  }
};

export const getSellerRequests = async (req, res, next) => {
  try {
    const users = await User.find({ sellerRequestStatus: "pending" })
      .select("-password")
      .sort({ updatedAt: -1 });
    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
};

export const approveSeller = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) return next(createError(404, "User not found!"));
    if (user.sellerRequestStatus !== "pending") return next(createError(400, "No pending request for this user."));

    user.isSeller = true;
    user.sellerRequestStatus = "approved";
    await user.save();

    const { password: _, ...info } = user._doc;
    res.status(200).json({ message: "Seller approved.", user: info });
  } catch (error) {
    next(error);
  }
};

export const rejectSeller = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) return next(createError(404, "User not found!"));
    if (user.sellerRequestStatus !== "pending") return next(createError(400, "No pending request for this user."));

    user.sellerRequestStatus = "rejected";
    await user.save();

    const { password: _, ...info } = user._doc;
    res.status(200).json({ message: "Seller request rejected.", user: info });
  } catch (error) {
    next(error);
  }
};

export const createEmployee = async (req, res, next) => {
  try {
    const { username, email, password, country, phone, desc, skills, hourlyRate } = req.body;
    if (!username || !email || !password || !country) {
      return next(createError(400, "Username, email, password and country are required."));
    }

    const existing = await User.findOne({ $or: [{ email }, { username }] });
    if (existing) return next(createError(400, "User with this email or username already exists."));

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      username,
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      country,
      isSeller: true,
      sellerRequestStatus: "approved",
      phone: phone || "",
      desc: desc || "",
      skills: Array.isArray(skills) ? skills : skills ? [skills] : [],
      hourlyRate: hourlyRate ? Number(hourlyRate) : 0,
    });

    const { password: _, ...info } = newUser._doc;
    res.status(201).json({ message: "Employee added.", user: info });
  } catch (error) {
    next(error);
  }
};

export const createGigAdmin = async (req, res, next) => {
  try {
    const { userId, title, desc, shortTitle, shortDesc, category, price, cover, deliveryTime, revisionNumber, features } = req.body;
    if (!userId || !title || !desc || !category || !price) {
      return next(createError(400, "userId, title, desc, category and price are required."));
    }

    const seller = await User.findById(userId);
    if (!seller) return next(createError(404, "Seller not found!"));
    if (!seller.isSeller) return next(createError(400, "User is not a seller."));

    const priceInr = Number(price);
    if (priceInr < 100) return next(createError(400, "Minimum price is ₹100."));

    const gigData = {
      userId,
      title,
      desc,
      shortTitle: shortTitle || title.slice(0, 30),
      shortDesc: shortDesc || desc.slice(0, 50),
      category,
      price: priceInr,
      priceInr,
      cover: cover || "https://picsum.photos/seed/gig/400/300",
      images: [],
      deliveryTime: deliveryTime || 5,
      revisionNumber: revisionNumber ?? 2,
      features: Array.isArray(features) ? features : features ? [features] : [],
    };

    const newGig = await Gig.create(gigData);
    const populated = await Gig.findById(newGig._id).populate("userId", "username img country");
    res.status(201).json(populated);
  } catch (error) {
    next(error);
  }
};

export const deleteGigAdmin = async (req, res, next) => {
  try {
    const gig = await Gig.findById(req.params.id);
    if (!gig) return next(createError(404, "Gig not found!"));
    await Gig.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Gig deleted." });
  } catch (error) {
    next(error);
  }
};
