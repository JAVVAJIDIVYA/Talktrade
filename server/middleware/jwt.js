import jwt from "jsonwebtoken";
import { createError } from "../utils/createError.js";

export const verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = (authHeader && authHeader.startsWith("Bearer ")
    ? authHeader.slice(7)
    : null) || req.cookies?.accessToken;

  if (!token) {
    return next(createError(401, "You are not authenticated!"));
  }

  if (!process.env.JWT_SECRET) {
    console.error("❌ JWT_SECRET environment variable is not set!");
    return next(createError(500, "Server configuration error: JWT_SECRET is missing. Contact administrator."));
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
    if (err) {
      return next(createError(403, "Token is not valid!"));
    }
    req.userId = payload.id;
    req.isSeller = payload.isSeller;
    req.isAdmin = payload.isAdmin;
    next();
  });
};
