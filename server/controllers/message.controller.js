import Message from "../models/message.model.js";
import Conversation from "../models/conversation.model.js";
import { createError } from "../utils/createError.js";

export const createMessage = async (req, res, next) => {
  try {
    const newMessage = new Message({
      conversationId: req.body.conversationId,
      userId: req.userId,
      desc: req.body.desc,
    });

    const savedMessage = await newMessage.save();

    // Update conversation
    await Conversation.findOneAndUpdate(
      { id: req.body.conversationId },
      {
        $set: {
          lastMessage: req.body.desc,
          ...(req.isSeller
            ? { readBySeller: true, readByBuyer: false }
            : { readByBuyer: true, readBySeller: false }),
        },
      }
    );

    res.status(201).json(savedMessage);
  } catch (error) {
    next(error);
  }
};

export const getMessages = async (req, res, next) => {
  try {
    const messages = await Message.find({
      conversationId: req.params.id,
    })
      .populate("userId", "username img")
      .sort({ createdAt: 1 });

    res.status(200).json(messages);
  } catch (error) {
    next(error);
  }
};
