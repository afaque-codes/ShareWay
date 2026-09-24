import bcrypt from 'bcrypt';
import { User, Driver, Session } from '../models/index.js';
import {
  generateAccessToken,
  generateRefreshTokenString,
  hashToken,
} from '../utils/token.js';

const SALT_ROUNDS = 12;
const REFRESH_TOKEN_DAYS = 7;

/**
 * Register a new User (Passenger or Driver)
 */
export const registerUser = async ({
  email,
  password,
  firstName,
  lastName,
  role = 'PASSENGER',
  phone,
  licenseNumber,
  ip,
  userAgent,
}) => {
  // 1. Check if email already registered
  const existingUser = await User.findOne({ email: email.toLowerCase() });
  if (existingUser) {
    const error = new Error('An account with this email address already exists.');
    error.statusCode = 409;
    throw error;
  }

  // 2. Hash password with bcrypt
  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

  // 3. Create User in MongoDB
  const user = await User.create({
    email: email.toLowerCase(),
    passwordHash,
    firstName,
    lastName,
    role,
    phone,
  });

  // 4. If DRIVER, create initial Driver profile record
  if (role === 'DRIVER') {
    await Driver.create({
      userId: user._id,
      licenseNumber: licenseNumber || `PENDING-${Date.now()}`,
      isVerified: false,
    });
  }

  // 5. Generate Tokens & Create Session
  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshTokenString();
  const refreshTokenHash = hashToken(refreshToken);

  const expiresAt = new Date(Date.now() + REFRESH_TOKEN_DAYS * 24 * 60 * 60 * 1000);

  await Session.create({
    userId: user._id,
    refreshTokenHash,
    ipAddress: ip,
    userAgent,
    expiresAt,
  });

  return {
    user,
    accessToken,
    refreshToken,
    expiresAt,
  };
};

/**
 * Log in an existing user
 */
export const loginUser = async ({ email, password, expectedRole, ip, userAgent }) => {
  // 1. Find user by email
  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user) {
    const error = new Error('Invalid email or password.');
    error.statusCode = 401;
    throw error;
  }

  // 2. Check if user is blocked or suspended
  if (user.status === 'BLOCKED' || user.status === 'SUSPENDED') {
    const error = new Error('Your account has been suspended. Please contact support.');
    error.statusCode = 403;
    throw error;
  }

  // 3. Verify password
  const isMatch = await bcrypt.compare(password, user.passwordHash);
  if (!isMatch) {
    const error = new Error('Invalid email or password.');
    error.statusCode = 401;
    throw error;
  }

  // 4. Validate expected role (e.g. logging into Passenger portal with Driver account)
  if (expectedRole && user.role !== expectedRole && user.role !== 'ADMIN') {
    const roleTarget = expectedRole === 'DRIVER' ? 'driver' : 'passenger';
    const actualRole = user.role === 'DRIVER' ? 'driver' : 'passenger';
    const error = new Error(
      `No ${roleTarget} account found with these credentials. This email is registered as a ${actualRole}.`
    );
    error.statusCode = 403;
    throw error;
  }

  // 4. Generate Tokens & Create Session
  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshTokenString();
  const refreshTokenHash = hashToken(refreshToken);

  const expiresAt = new Date(Date.now() + REFRESH_TOKEN_DAYS * 24 * 60 * 60 * 1000);

  await Session.create({
    userId: user._id,
    refreshTokenHash,
    ipAddress: ip,
    userAgent,
    expiresAt,
  });

  return {
    user,
    accessToken,
    refreshToken,
    expiresAt,
  };
};

/**
 * Refresh an Access Token using a valid Refresh Token
 */
export const refreshSession = async (refreshToken, ip, userAgent) => {
  if (!refreshToken) {
    const error = new Error('Refresh token is required.');
    error.statusCode = 401;
    throw error;
  }

  // Hash the incoming token to match database
  const refreshTokenHash = hashToken(refreshToken);

  // Find active session
  const session = await Session.findOne({
    refreshTokenHash,
    revokedAt: null,
    expiresAt: { $gt: new Date() },
  });

  if (!session) {
    const error = new Error('Session has expired or was revoked. Please log in again.');
    error.statusCode = 401;
    throw error;
  }

  // Get user
  const user = await User.findById(session.userId);
  if (!user || user.status === 'BLOCKED') {
    const error = new Error('User account is no longer active.');
    error.statusCode = 403;
    throw error;
  }

  // Issue fresh access token
  const accessToken = generateAccessToken(user);

  return {
    user,
    accessToken,
  };
};

/**
 * Invalidate a session on Logout
 */
export const logoutSession = async (refreshToken) => {
  if (!refreshToken) return;

  const refreshTokenHash = hashToken(refreshToken);

  await Session.findOneAndUpdate(
    { refreshTokenHash, revokedAt: null },
    { revokedAt: new Date() }
  );
};

/**
 * Fetch current user profile
 */
export const getUserProfile = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    const error = new Error('User not found.');
    error.statusCode = 404;
    throw error;
  }

  let driverProfile = null;
  if (user.role === 'DRIVER') {
    driverProfile = await Driver.findOne({ userId: user._id }).populate('userId');
  }

  return {
    user,
    driver: driverProfile,
  };
};
