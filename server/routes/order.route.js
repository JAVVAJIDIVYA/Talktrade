import express from "express";
import {
  createOrder,
  getOrders,
  confirmOrder,
} from "../controllers/order.controller.js";
import { verifyToken } from "../middleware/jwt.js";

const router = express.Router();

router.post("/", verifyToken, createOrder);
router.get("/", verifyToken, getOrders);
router.put("/:id", verifyToken, confirmOrder);

export default router;
