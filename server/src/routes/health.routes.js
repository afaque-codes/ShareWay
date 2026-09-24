import { Router } from 'express';

const router = Router();

router.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    service: 'ShareWay API',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

export default router;
