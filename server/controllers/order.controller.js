import Order from "../models/order.model.js";
import Gig from "../models/gig.model.js";
import { createError } from "../utils/createError.js";

export const createOrder = async (req, res, next) => {
  try {
    const gig = await Gig.findById(req.body.gigId);

    if (!gig) {
      return next(createError(404, "Gig not found!"));
    }

    if (gig.userId.toString() === req.userId) {
      return next(createError(403, "You cannot order your own gig!"));
    }

    // Convert price to INR (assuming price is already in INR)
    const priceInr = gig.priceInr || gig.price;

    const newOrder = new Order({
      gigId: gig._id,
      img: gig.cover,
      title: gig.title,
      price: gig.price,
      priceInr: priceInr,
      sellerId: gig.userId,
      buyerId: req.userId,
      payment_intent: "TXN_" + Date.now() + "_" + Math.random().toString(36).substr(2, 9).toUpperCase(),
      transactionId: "INR_" + Date.now(),
      paymentMethod: req.body.paymentMethod || "UPI",
      paymentStatus: "Pending",
    });

    const savedOrder = await newOrder.save();

    // Update gig sales
    await Gig.findByIdAndUpdate(gig._id, { $inc: { sales: 1 } });

    res.status(201).json(savedOrder);
  } catch (error) {
    next(error);
  }
};

export const getOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({
      $or: [{ sellerId: req.userId }, { buyerId: req.userId }],
    })
      .populate("buyerId", "username img")
      .populate("sellerId", "username img")
      .sort({ createdAt: -1 });

    res.status(200).json(orders);
  } catch (error) {
    next(error);
  }
};

export const confirmOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return next(createError(404, "Order not found!"));
    }

    if (order.sellerId.toString() !== req.userId) {
      return next(createError(403, "Only the seller can confirm the order!"));
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      { 
        isCompleted: true,
        paymentStatus: "Completed",
      },
      { new: true }
    );

    // Update seller's total earnings
    const User = (await import("../models/user.model.js")).default;
    await User.findByIdAndUpdate(order.sellerId, {
      $inc: { 
        totalEarnings: order.priceInr || order.price,
        completedJobs: 1,
      },
    });

    res.status(200).json(updatedOrder);
  } catch (error) {
    next(error);
  }
};
