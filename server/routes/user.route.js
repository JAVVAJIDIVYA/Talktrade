import express from "express";
import { deleteUser, getUser, updateUser, requestSeller, toggleFavouriteGig, getFavouriteGigs } from "../controllers/user.controller.js";
import { verifyToken } from "../middleware/jwt.js";

const router = express.Router();

router.post("/request-seller", verifyToken, requestSeller);
router.put("/favourites/:gigId", verifyToken, toggleFavouriteGig);
router.get("/favourites", verifyToken, getFavouriteGigs);
router.delete("/:id", verifyToken, deleteUser);
router.get("/:id", getUser);
router.put("/:id", verifyToken, updateUser);

export default router;
