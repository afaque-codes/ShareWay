import { verifyAccessToken } from '../utils/token.js';
import { User } from '../models/index.js';

/**
 * Protect routes: requires a valid JWT Access Token in the Authorization header
 */
export const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer ')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      error: { message: 'Authentication required. No access token provided.' },
    });
  }

  try {
    const decoded = verifyAccessToken(token);

    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({
        success: false,
        error: { message: 'User belonging to this token no longer exists.' },
      });
    }

    if (user.status === 'BLOCKED' || user.status === 'SUSPENDED') {
      return res.status(403).json({
        success: false,
        error: { message: 'Account is suspended. Access denied.' },
      });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      error: { message: 'Invalid or expired token. Please log in again.' },
    });
  }
};

/**
 * Role-Based Access Control Guard
 * Supports case-insensitive roles, e.g. roleGuard('driver', 'admin') or roleGuard('DRIVER')
 */
export const roleGuard = (...allowedRoles) => {
  const normalizedAllowed = allowedRoles.map((r) => r.toUpperCase());

  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: { message: 'Authentication required before checking roles.' },
      });
    }

    const userRole = (req.user.role || '').toUpperCase();

    if (!normalizedAllowed.includes(userRole)) {
      return res.status(403).json({
        success: false,
        error: {
          message: `Access denied. Requires one of [${normalizedAllowed.join(', ')}], but your role is [${userRole}].`,
        },
      });
    }

    next();
  };
};

// Aliases and composite guards
export const requireAuth = protect;
export const requireRole = roleGuard;
export const requireAdmin = [protect, roleGuard('ADMIN')];
export const requireDriver = [protect, roleGuard('DRIVER', 'ADMIN')];
export const requirePassenger = [protect, roleGuard('PASSENGER', 'ADMIN')];
