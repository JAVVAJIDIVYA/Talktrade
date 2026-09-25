import mongoose from "mongoose";

const gigSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    desc: {
      type: String,
      required: true,
    },
    totalStars: {
      type: Number,
      default: 0,
    },
    starNumber: {
      type: Number,
      default: 0,
    },
    category: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 100, // Minimum price in INR
    },
    priceInr: {
      type: Number,
      required: true,
      min: 100,
    },
    cover: {
      type: String,
      required: true,
    },
    images: {
      type: [String],
      default: [],
    },
    shortTitle: {
      type: String,
      required: true,
    },
    shortDesc: {
      type: String,
      required: true,
    },
    deliveryTime: {
      type: Number,
      required: true,
    },
    revisionNumber: {
      type: Number,
      required: true,
    },
    features: {
      type: [String],
      default: [],
    },
    sales: {
      type: Number,
      default: 0,
    },
    serviceType: {
      type: String,
      enum: ["Fixed Price", "Hourly Rate", "Custom Quote"],
      default: "Fixed Price",
    },
    tags: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Gig", gigSchema);
