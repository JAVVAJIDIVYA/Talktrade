import { createError } from "../utils/createError.js";

export const verifyAdmin = (req, res, next) => {
  if (!req.userId) {
    return next(createError(401, "You are not authenticated!"));
  }
  if (!req.isAdmin) {
    return next(createError(403, "Admin access only!"));
  }
  next();
};
