import Gig from "../models/gig.model.js";
import { createError } from "../utils/createError.js";

export const createGig = async (req, res, next) => {
  try {
    const isAdmin = req.isAdmin === true;
    if (!isAdmin && !req.isSeller) {
      return next(createError(403, "Only sellers or admins can create gigs!"));
    }

    const userId = isAdmin && req.body.userId ? req.body.userId : req.userId;

    const priceValue = req.body.price ?? req.body.priceInr;
    if (!priceValue) return next(createError(400, "Price is required"));

    const gigData = {
      userId,
      ...req.body,
      price: priceValue,
      priceInr: priceValue,
    };

    const newGig = new Gig(gigData);
    const savedGig = await newGig.save();

    res.status(201).json(savedGig);
  } catch (error) {
    next(error);
  }
};

export const deleteGig = async (req, res, next) => {
  try {
    const gig = await Gig.findById(req.params.id);

    if (!gig) {
      return next(createError(404, "Gig not found!"));
    }

    const isOwner = gig.userId.toString() === req.userId;
    if (!req.isAdmin && !isOwner) {
      return next(createError(403, "You can delete only your gig!"));
    }

    await Gig.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: "Gig has been deleted!" });
  } catch (error) {
    next(error);
  }
};

export const getGig = async (req, res, next) => {
  try {
    const gig = await Gig.findById(req.params.id).populate("userId", "username img country");

    if (!gig) {
      return next(createError(404, "Gig not found!"));
    }

    res.status(200).json(gig);
  } catch (error) {
    next(error);
  }
};

export const getGigs = async (req, res, next) => {
  try {
    const q = req.query;

    const filters = {
      ...(q.userId && { userId: q.userId }),
      ...(q.category && { category: q.category }),
      ...((q.min || q.max) && {
        price: {
          ...(q.min && { $gte: parseInt(q.min) }),
          ...(q.max && { $lte: parseInt(q.max) }),
        },
      }),
      ...(q.search && { title: { $regex: q.search, $options: "i" } }),
    };

    let sortOption = {};
    if (q.sort === "sales") {
      sortOption = { sales: -1 };
    } else if (q.sort === "createdAt") {
      sortOption = { createdAt: -1 };
    } else if (q.sort === "price_asc") {
      sortOption = { price: 1 };
    } else if (q.sort === "price_desc") {
      sortOption = { price: -1 };
    } else if (q.sort === "rating") {
      sortOption = { totalStars: -1 };
    } else {
      sortOption = { createdAt: -1 };
    }

    const gigs = await Gig.find(filters)
      .populate("userId", "username img country")
      .sort(sortOption)
      .limit(parseInt(q.limit) || 40);

    res.status(200).json(gigs);
  } catch (error) {
    next(error);
  }
};

export const getMyGigs = async (req, res, next) => {
  try {
    const gigs = await Gig.find({ userId: req.userId }).sort({ createdAt: -1 });

    res.status(200).json(gigs);
  } catch (error) {
    next(error);
  }
};
