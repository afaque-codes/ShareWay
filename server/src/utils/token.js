import jwt from 'jsonwebtoken';
import crypto from 'crypto';

/**
 * Generate a short-lived JWT Access Token (15 minutes by default)
 */
export const generateAccessToken = (user) => {
  const payload = {
    id: user._id.toString(),
    email: user.email,
    role: user.role,
  };

  return jwt.sign(payload, process.env.JWT_SECRET || 'fallback_jwt_secret', {
    expiresIn: process.env.JWT_EXPIRES_IN || '15m',
  });
};

/**
 * Generate a cryptographically secure random refresh token string
 */
export const generateRefreshTokenString = () => {
  return crypto.randomBytes(40).toString('hex');
};

/**
 * Hash a refresh token using SHA-256 before persisting in MongoDB
 */
export const hashToken = (token) => {
  return crypto.createHash('sha256').update(token).digest('hex');
};

/**
 * Verify a JWT Access Token
 */
export const verifyAccessToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET || 'fallback_jwt_secret');
};
