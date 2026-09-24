import { Router } from 'express';
import healthRoutes from './health.routes.js';
import authRoutes from './auth.routes.js';
import userRoutes from './user.routes.js';
import rideRoutes from './ride.routes.js';

const router = Router();

// Mount Health Check
router.use('/', healthRoutes);

// Mount Authentication
router.use('/auth', authRoutes);

// Mount User & RBAC endpoints
router.use('/users', userRoutes);

// Mount Ride endpoints
router.use('/rides', rideRoutes);

// Root endpoints catalog
router.get('/', (req, res) => {
  res.json({
    name: 'ShareWay API',
    version: '1.0.0',
    description: 'Web-Based Community Ridesharing Platform',
    endpoints: {
      health: '/api/health',
      auth: {
        register: 'POST /api/auth/register',
        login: 'POST /api/auth/login',
        refresh: 'POST /api/auth/refresh',
        logout: 'POST /api/auth/logout',
        me: 'GET /api/auth/me (Protected)',
      },
      users: {
        profile: 'GET /api/users/profile (Any Authenticated)',
        driverZone: 'GET /api/users/driver-zone (Driver & Admin only)',
        adminZone: 'GET /api/users/admin-zone (Admin only)',
      },
      rides: '/api/rides',
    },
  });
});

export default router;
