import { Router } from 'express';
import { WeeklyCrownController } from '../controllers/WeeklyCrownController';
import { authenticate } from '../../../login/presentation/middleware/authMiddleware';
import { authorize } from '../../../login/presentation/middleware/authMiddleware';

const router = Router();

// All routes require authentication and admin privileges
router.use(authenticate);
router.use(authorize(['admin']));

// Manually generate and send a weekly report
router.post('/generate', WeeklyCrownController.generateReport);

// Start the weekly report scheduler
router.post('/scheduler/start', WeeklyCrownController.startScheduler);

// Stop the weekly report scheduler
router.post('/scheduler/stop', WeeklyCrownController.stopScheduler);

export default router; 