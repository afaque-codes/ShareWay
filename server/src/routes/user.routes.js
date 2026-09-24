import { Router } from 'express';
import {
  protect,
  requireDriver,
  requireAdmin,
} from '../middleware/auth.middleware.js';
import { User, Driver } from '../models/index.js';

const router = Router();

/**
 * GET /api/users/profile
 * Accessible by any authenticated user (PASSENGER, DRIVER, ADMIN)
 */
router.get('/profile', protect, async (req, res, next) => {
  try {
    let driverData = null;
    if (req.user.role === 'DRIVER') {
      driverData = await Driver.findOne({ userId: req.user._id });
    }

    res.status(200).json({
      success: true,
      data: {
        user: req.user,
        driver: driverData,
      },
    });
  } catch (err) {
    next(err);
  }
});

/**
 * PUT /api/users/profile
 * Update user's profile info
 */
router.put('/profile', protect, async (req, res, next) => {
  try {
    const { firstName, lastName, phone, avatarUrl } = req.body;

    const user = await User.findById(req.user._id);
    if (firstName) user.firstName = firstName.trim();
    if (lastName) user.lastName = lastName.trim();
    if (phone !== undefined) user.phone = phone.trim();
    if (avatarUrl !== undefined) user.avatarUrl = avatarUrl.trim();

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully.',
      data: { user },
    });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/users/driver-zone
 * Accessible ONLY by DRIVER and ADMIN
 */
router.get('/driver-zone', requireDriver, async (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Welcome to the Driver Workspace!',
    role: req.user.role,
  });
});

/**
 * GET /api/users/admin-zone
 * Accessible ONLY by ADMIN
 */
router.get('/admin-zone', requireAdmin, async (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Welcome to the Admin Control Panel!',
    role: req.user.role,
  });
});

export default router;
