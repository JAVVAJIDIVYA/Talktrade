import express from "express";
import {
  getStats,
  getAllUsers,
  getAllGigs,
  getSellerRequests,
  approveSeller,
  rejectSeller,
  createEmployee,
  createGigAdmin,
  deleteGigAdmin,
} from "../controllers/admin.controller.js";
import { verifyToken } from "../middleware/jwt.js";
import { verifyAdmin } from "../middleware/verifyAdmin.js";

const router = express.Router();

router.use(verifyToken, verifyAdmin);

router.get("/stats", getStats);
router.get("/users", getAllUsers);
router.get("/gigs", getAllGigs);
router.get("/seller-requests", getSellerRequests);
router.put("/seller-requests/:userId/approve", approveSeller);
router.put("/seller-requests/:userId/reject", rejectSeller);
router.post("/users", createEmployee);
router.post("/gigs", createGigAdmin);
router.delete("/gigs/:id", deleteGigAdmin);

export default router;
