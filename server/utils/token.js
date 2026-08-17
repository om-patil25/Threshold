import jwt from "jsonwebtoken";
import "dotenv/config";

export const createUserToken = (payload) => {
  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "7d" });

  return token;
};

export const storeUserToken = (res, token) => {
  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
};

export const validateUserToken = (token) => {
  const payload = jwt.verify(token, process.env.JWT_SECRET);
  return payload;
};
