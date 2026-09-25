import Review from "../models/review.model.js";
import Gig from "../models/gig.model.js";
import Order from "../models/order.model.js";
import { createError } from "../utils/createError.js";

export const createReview = async (req, res, next) => {
  try {
    // Check if user has purchased the gig
    const order = await Order.findOne({
      gigId: req.body.gigId,
      buyerId: req.userId,
      isCompleted: true,
    });

    if (!order) {
      return next(
        createError(403, "You can only review gigs you have purchased!")
      );
    }

    // Check if already reviewed
    const existingReview = await Review.findOne({
      gigId: req.body.gigId,
      userId: req.userId,
    });

    if (existingReview) {
      return next(createError(403, "You have already created a review for this gig!"));
    }

    const newReview = new Review({
      userId: req.userId,
      gigId: req.body.gigId,
      desc: req.body.desc,
      star: req.body.star,
    });

    const savedReview = await newReview.save();

    // Update gig ratings
    await Gig.findByIdAndUpdate(req.body.gigId, {
      $inc: { totalStars: req.body.star, starNumber: 1 },
    });

    res.status(201).json(savedReview);
  } catch (error) {
    next(error);
  }
};

export const getReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find({ gigId: req.params.gigId })
      .populate("userId", "username img country")
      .sort({ createdAt: -1 });

    res.status(200).json(reviews);
  } catch (error) {
    next(error);
  }
};

export const deleteReview = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return next(createError(404, "Review not found!"));
    }

    if (review.userId.toString() !== req.userId) {
      return next(createError(403, "You can delete only your review!"));
    }

    // Update gig ratings
    await Gig.findByIdAndUpdate(review.gigId, {
      $inc: { totalStars: -review.star, starNumber: -1 },
    });

    await Review.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: "Review has been deleted!" });
  } catch (error) {
    next(error);
  }
};
