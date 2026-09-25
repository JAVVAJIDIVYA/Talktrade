import Conversation from "../models/conversation.model.js";
import { createError } from "../utils/createError.js";

export const createConversation = async (req, res, next) => {
  try {
    const { to } = req.body;

    if (req.userId === to) {
      return next(createError(400, "You cannot create a conversation with yourself."));
    }

    // Create unique conversation ID
    const conversationId = [req.userId, to].sort().join("-");

    // Check if conversation exists
    const existingConversation = await Conversation.findOne({ id: conversationId });

    if (existingConversation) {
      return res.status(200).json(existingConversation);
    }

    const newConversation = new Conversation({
      id: conversationId,
      sellerId: req.isSeller ? req.userId : to,
      buyerId: req.isSeller ? to : req.userId,
    });

    const savedConversation = await newConversation.save();

    res.status(201).json(savedConversation);
  } catch (error) {
    next(error);
  }
};

export const getConversations = async (req, res, next) => {
  try {
    const conversations = await Conversation.find(
      req.isSeller ? { sellerId: req.userId } : { buyerId: req.userId }
    )
      .populate("sellerId", "username img")
      .populate("buyerId", "username img")
      .sort({ updatedAt: -1 });

    res.status(200).json(conversations);
  } catch (error) {
    next(error);
  }
};

export const getSingleConversation = async (req, res, next) => {
  try {
    const conversation = await Conversation.findOne({ id: req.params.id })
      .populate("sellerId", "username img")
      .populate("buyerId", "username img");

    if (!conversation) {
      return next(createError(404, "Conversation not found!"));
    }

    res.status(200).json(conversation);
  } catch (error) {
    next(error);
  }
};

export const updateConversation = async (req, res, next) => {
  try {
    const updatedConversation = await Conversation.findOneAndUpdate(
      { id: req.params.id },
      {
        $set: {
          ...(req.isSeller ? { readBySeller: true } : { readByBuyer: true }),
        },
      },
      { new: true }
    );

    res.status(200).json(updatedConversation);
  } catch (error) {
    next(error);
  }
};
