import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { createError } from "../utils/createError.js";

export const requestSeller = async (req, res, next) => {
  try {
    const { experience, activities } = req.body || {};

    if (!experience || !activities) {
      return next(createError(400, "Please provide your experience and activities for seller review."));
    }

    const user = await User.findById(req.userId);
    if (!user) return next(createError(404, "User not found!"));
    if (user.isSeller) return next(createError(400, "You are already a seller!"));
    if (user.sellerRequestStatus === "pending") return next(createError(400, "Seller request already pending."));
    if (user.sellerRequestStatus === "rejected") return next(createError(400, "Your seller request was rejected. Contact admin."));

    user.experience = experience;
    user.sellerActivities = activities;
    user.sellerRequestStatus = "pending";
    await user.save();

    const { password: _, ...info } = user._doc;
    res.status(200).json({ message: "Seller request submitted. Awaiting admin approval.", user: info });
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return next(createError(404, "User not found!"));
    }

    const isOwner = req.userId === user._id.toString();
    if (!req.isAdmin && !isOwner) {
      return next(createError(403, "You can delete only your account!"));
    }
    if (req.isAdmin && user.isAdmin) {
      return next(createError(403, "Cannot delete another admin!"));
    }

    await User.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: "User has been deleted." });
  } catch (error) {
    next(error);
  }
};

export const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select("-password");

    if (!user) {
      return next(createError(404, "User not found!"));
    }

    // Calculate additional stats for sellers
    if (user.isSeller) {
      const Gig = (await import("../models/gig.model.js")).default;
      const Order = (await import("../models/order.model.js")).default;
      const Review = (await import("../models/review.model.js")).default;

      const gigs = await Gig.find({ userId: user._id });
      const orders = await Order.find({ sellerId: user._id, isCompleted: true });
      
      // Calculate total earnings in INR
      const totalEarnings = orders.reduce((sum, order) => sum + (order.priceInr || order.price), 0);
      
      // Calculate average rating across all gigs
      let totalRating = 0;
      let totalReviews = 0;
      for (const gig of gigs) {
        if (gig.starNumber > 0) {
          totalRating += gig.totalStars;
          totalReviews += gig.starNumber;
        }
      }
      const avgRating = totalReviews > 0 ? (totalRating / totalReviews).toFixed(1) : 0;

      // Get detailed review stats
      const allGigIds = gigs.map(g => g._id);
      const reviews = await Review.find({ gigId: { $in: allGigIds } });
      
      const detailedStats = {
        communication: 0,
        serviceQuality: 0,
        deliveryTime: 0,
        valueForMoney: 0,
        totalRecommendations: 0,
      };

      if (reviews.length > 0) {
        reviews.forEach(review => {
          detailedStats.communication += review.communication || review.star;
          detailedStats.serviceQuality += review.serviceQuality || review.star;
          detailedStats.deliveryTime += review.deliveryTime || review.star;
          detailedStats.valueForMoney += review.valueForMoney || review.star;
          if (review.wouldRecommend) detailedStats.totalRecommendations++;
        });

        detailedStats.communication = (detailedStats.communication / reviews.length).toFixed(1);
        detailedStats.serviceQuality = (detailedStats.serviceQuality / reviews.length).toFixed(1);
        detailedStats.deliveryTime = (detailedStats.deliveryTime / reviews.length).toFixed(1);
        detailedStats.valueForMoney = (detailedStats.valueForMoney / reviews.length).toFixed(1);
      }

      const userWithStats = {
        ...user.toObject(),
        stats: {
          totalGigs: gigs.length,
          completedOrders: orders.length,
          totalEarnings: Math.round(totalEarnings),
          avgRating: parseFloat(avgRating),
          totalReviews,
          detailedRatings: detailedStats,
          recommendationRate: totalReviews > 0 
            ? Math.round((detailedStats.totalRecommendations / totalReviews) * 100) 
            : 0,
        },
      };

      return res.status(200).json(userWithStats);
    }

    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

export const updateUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return next(createError(404, "User not found!"));
    }

    const isOwner = req.userId === user._id.toString();
    if (!req.isAdmin && !isOwner) {
      return next(createError(403, "You can update only your account!"));
    }
    if (req.isAdmin && user.isAdmin && !isOwner) {
      return next(createError(403, "Cannot update another admin!"));
    }

    const updates = { ...req.body };
    if (updates.password !== undefined && updates.password !== "") {
      const hashedPassword = await bcrypt.hash(updates.password, 10);
      updates.password = hashedPassword;
    } else {
      delete updates.password;
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { $set: updates },
      { new: true }
    ).select("-password");

    res.status(200).json(updatedUser);
  } catch (error) {
    next(error);
  }
};

export const toggleFavouriteGig = async (req, res, next) => {
  try {
    const { gigId } = req.params;
    if (!gigId) {
      return next(createError(400, "Gig ID is required."));
    }

    const user = await User.findById(req.userId);
    if (!user) {
      return next(createError(404, "User not found!"));
    }

    const favIndex = user.favourites.findIndex(
      (id) => id.toString() === gigId.toString()
    );

    let action = "";
    if (favIndex >= 0) {
      user.favourites.splice(favIndex, 1);
      action = "removed";
    } else {
      user.favourites.push(gigId);
      action = "added";
    }

    await user.save();

    res.status(200).json({
      message: `Gig ${action} from favourites.`,
      favourites: user.favourites,
    });
  } catch (error) {
    next(error);
  }
};

export const getFavouriteGigs = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId).populate({
      path: "favourites",
      populate: {
        path: "userId",
        select: "username img country",
      },
    });

    if (!user) {
      return next(createError(404, "User not found!"));
    }

    res.status(200).json(user.favourites || []);
  } catch (error) {
    next(error);
  }
};
