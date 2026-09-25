import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    gigId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Gig",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    star: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    desc: {
      type: String,
      required: true,
    },
    // Detailed ratings
    communication: {
      type: Number,
      min: 1,
      max: 5,
      default: 5,
    },
    serviceQuality: {
      type: Number,
      min: 1,
      max: 5,
      default: 5,
    },
    deliveryTime: {
      type: Number,
      min: 1,
      max: 5,
      default: 5,
    },
    valueForMoney: {
      type: Number,
      min: 1,
      max: 5,
      default: 5,
    },
    wouldRecommend: {
      type: Boolean,
      default: true,
    },
    projectType: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Review", reviewSchema);
