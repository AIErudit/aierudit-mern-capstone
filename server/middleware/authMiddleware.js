import jwt from "jsonwebtoken";
import { User } from "../models/User.js";

const COOKIE_NAME = process.env.COOKIE_NAME || "aerd_session";

export async function protect(req, res, next) {
  const token = req.cookies?.[COOKIE_NAME];
  if (!token) {
    return res.status(401).json({ error: "auth_required", message: "Sign in to continue." });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.sub).lean();
    if (!user) {
      return res.status(401).json({ error: "auth_invalid", message: "Session no longer valid." });
    }
    req.user = user;
    return next();
  } catch (err) {
    return res
      .status(401)
      .json({ error: "auth_invalid", message: "Session expired. Please sign in again." });
  }
}

export function requireAdmin(req, res, next) {
  if (!req.user) {
    return res.status(401).json({ error: "auth_required" });
  }
  if (!req.user.isAdmin) {
    return res
      .status(403)
      .json({ error: "forbidden", message: "Admin role required for this action." });
  }
  return next();
}
