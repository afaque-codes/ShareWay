import { registerSchema, loginSchema } from '../validators/auth.validator.js';
import * as authService from '../services/auth.service.js';

// HTTP-only Cookie configuration for Refresh Token
const getCookieOptions = (expiresAt) => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
  expires: expiresAt,
  path: '/',
});

/**
 * POST /api/auth/register
 */
export const register = async (req, res, next) => {
  try {
    const validatedData = registerSchema.parse(req.body);

    const clientIp = req.ip || req.headers['x-forwarded-for'] || 'unknown';
    const userAgent = req.headers['user-agent'] || 'unknown';

    const { user, accessToken, refreshToken, expiresAt } = await authService.registerUser({
      ...validatedData,
      ip: clientIp,
      userAgent,
    });

    // Set refresh token in secure HTTP-only cookie
    res.cookie('refreshToken', refreshToken, getCookieOptions(expiresAt));

    return res.status(201).json({
      success: true,
      data: {
        user,
        accessToken,
      },
    });
  } catch (error) {
    if (error.name === 'ZodError') {
      return res.status(400).json({
        success: false,
        error: {
          message: error.errors[0]?.message || 'Validation failed',
          details: error.errors,
        },
      });
    }
    next(error);
  }
};

/**
 * POST /api/auth/login
 */
export const login = async (req, res, next) => {
  try {
    const validatedData = loginSchema.parse(req.body);

    const clientIp = req.ip || req.headers['x-forwarded-for'] || 'unknown';
    const userAgent = req.headers['user-agent'] || 'unknown';

    const { user, accessToken, refreshToken, expiresAt } = await authService.loginUser({
      ...validatedData,
      ip: clientIp,
      userAgent,
    });

    // Set refresh token in secure HTTP-only cookie
    res.cookie('refreshToken', refreshToken, getCookieOptions(expiresAt));

    return res.status(200).json({
      success: true,
      data: {
        user,
        accessToken,
      },
    });
  } catch (error) {
    if (error.name === 'ZodError') {
      return res.status(400).json({
        success: false,
        error: {
          message: error.errors[0]?.message || 'Validation failed',
          details: error.errors,
        },
      });
    }
    next(error);
  }
};

/**
 * POST /api/auth/refresh
 */
export const refresh = async (req, res, next) => {
  try {
    const refreshToken = req.cookies?.refreshToken;

    const clientIp = req.ip || req.headers['x-forwarded-for'] || 'unknown';
    const userAgent = req.headers['user-agent'] || 'unknown';

    const { user, accessToken } = await authService.refreshSession(
      refreshToken,
      clientIp,
      userAgent
    );

    return res.status(200).json({
      success: true,
      data: {
        user,
        accessToken,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/auth/logout
 */
export const logout = async (req, res, next) => {
  try {
    const refreshToken = req.cookies?.refreshToken;
    if (refreshToken) {
      await authService.logoutSession(refreshToken);
    }

    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      path: '/',
    });

    return res.status(200).json({
      success: true,
      message: 'Successfully logged out.',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/auth/me
 */
export const getMe = async (req, res, next) => {
  try {
    const profile = await authService.getUserProfile(req.user._id);

    return res.status(200).json({
      success: true,
      data: profile,
    });
  } catch (error) {
    next(error);
  }
};
