///////////////////////////////// This is the updated section for cookies ////////////////////////////////
import jwt from "jsonwebtoken";
import RefreshToken from "../models/refreshToken.model.js";

/**
 * Generate Access Token (Short Lived)
 */
export const generateAccessToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || "15m",
  });
};

/**
 * Generate Refresh Token (Long Lived + DB Store)
 */
export const generateRefreshToken = async (id, role) => {
  const expiresIn = process.env.JWT_REFRESH_EXPIRE || "7d";

  const refreshToken = jwt.sign({ id, role }, process.env.JWT_REFRESH_SECRET, {
    expiresIn,
  });

  // Extract expiry date from JWT
  const decoded = jwt.decode(refreshToken);

  await RefreshToken.create({
    token: refreshToken,
    userId: id,
    userType: role,
    expiresAt: new Date(decoded.exp * 1000),
  });

  return refreshToken;
};

/**
 * Verify Refresh Token
 */
export const verifyRefreshToken = async (token) => {
  // 1️⃣ Verify JWT signature
  const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);

  // 2️⃣ Check in DB
  const storedToken = await RefreshToken.findOne({
    token,
    isRevoked: false,
  });

  if (!storedToken) {
    throw new Error("Invalid or revoked refresh token");
  }

  // 3️⃣ Check expiry from DB
  if (storedToken.expiresAt < new Date()) {
    throw new Error("Refresh token expired");
  }

  return decoded;
};
