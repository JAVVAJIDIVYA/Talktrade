import express from "express";
import {
  createGig,
  deleteGig,
  getGig,
  getGigs,
  getMyGigs,
} from "../controllers/gig.controller.js";
import { verifyToken } from "../middleware/jwt.js";

const router = express.Router();

router.post("/", verifyToken, createGig);
router.delete("/:id", verifyToken, deleteGig);
router.get("/single/:id", getGig);
router.get("/", getGigs);
router.get("/mygigs", verifyToken, getMyGigs);

export default router;
