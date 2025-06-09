import { verifyToken } from "../utils/index.js";
import { getUser } from "../services/users.js";

// Middleware to authenticate the token
export async function authenticateToken(req, res, next) {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      return next({
        status: 401,
        message: "Access token is required",
      });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return next({
        status: 403,
        message: "Invalid or expired token",
      });
    }

    const user = await getUser(decoded.username);
    if (!user) {
      return next({
        status: 403,
        message: "User not found",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    next({
      status: 500,
      message: "Authentication error",
    });
  }
}

// Middleware to verify that the user is admin
export function requireAdmin(req, res, next) {
  if (!req.user) {
    return next({
      status: 401,
      message: "Authentication required",
    });
  }

  if (req.user.role !== "admin") {
    return next({
      status: 403,
      message: "Admin access required",
    });
  }

  next();
}

// Middleware mixed: autenticación + admin
export function adminAuth(req, res, next) {
  authenticateToken(req, res, (err) => {
    if (err) return next(err);
    requireAdmin(req, res, next);
  });
}
