import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 3,
      maxlength: 30,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    img: {
      type: String,
      default: "",
    },
    country: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      default: "",
    },
    desc: {
      type: String,
      default: "",
    },
    isSeller: {
      type: Boolean,
      default: false,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    sellerRequestStatus: {
      type: String,
      enum: ["none", "pending", "approved", "rejected"],
      default: "none",
    },
    // Employee/Seller Profile Details
    skills: {
      type: [String],
      default: [],
    },
    experience: {
      type: String,
      default: "",
    },
    // Details provided when requesting seller approval
    sellerActivities: {
      type: String,
      default: "",
    },
    education: {
      type: String,
      default: "",
    },
    languages: {
      type: [String],
      default: [],
    },
    hourlyRate: {
      type: Number,
      default: 0,
    },
    availability: {
      type: String,
      enum: ["Full-time", "Part-time", "Freelance", "Not Available"],
      default: "Freelance",
    },
    portfolioLinks: {
      type: [String],
      default: [],
    },
    certifications: {
      type: [String],
      default: [],
    },
    totalEarnings: {
      type: Number,
      default: 0,
    },
    completedJobs: {
      type: Number,
      default: 0,
    },
    responseTime: {
      type: String,
      default: "Within 24 hours",
    },
    // Favourite gigs for the user
    favourites: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Gig",
      },
    ],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("User", userSchema);
