import { validateUserToken } from "../utils/token.js";
/**
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 */

export const authenticationMiddleWare = (req, res, next) => {
  const token = req.cookies.token;
  if (token) {
    try {
      const payload = validateUserToken(token);
      req.user = payload;
    } catch (err) {
      if (err.name === "TokenExpiredError") {
        req.tokenExpired = true;
      }
    }
  }

  next();
};

/**
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 */

export const requireAuthentication = (req, res, next) => {
  if (req.user) {
    return next();
  } else if (!req.user && req.tokenExpired) {
    return res.status(401).json({ message: "token expired! log in again" });
  } else {
    return res.status(401).json({ error: "Unauthorized access" });
  }
};
