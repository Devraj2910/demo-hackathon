import { Router } from 'express';
import { AnalyticsController } from '../controllers/AnalyticsController';
import { validate } from '../../../../shared/middleware/validation';
import analyticsValidation from '../validation/analyticsValidation';
import { authenticate } from '../../../login/presentation/middleware/authMiddleware';

const router = Router();

// All analytics routes require authentication
router.use(authenticate);

// Single endpoint for the dashboard that contains all analytics
router.get(
  '/dashboard',
  validate(analyticsValidation.getDashboard, 'query'),
  AnalyticsController.getDashboard
);

export const analyticsRoutes = router; 