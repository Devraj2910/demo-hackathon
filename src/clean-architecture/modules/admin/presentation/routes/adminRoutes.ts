import { Router } from 'express';
import { AdminController } from '../controllers/AdminController';
import { Pool } from 'pg';

// Check what middleware files exist to import authorization
import { authenticate } from '../../../login/presentation/middleware/authMiddleware';
import { authorize } from '../../../login/presentation/middleware/authMiddleware';

export const createAdminRouter = (dbPool: Pool): Router => {
  const router = Router();
  const adminController = new AdminController(dbPool);
  
  // All admin routes require authentication and admin role
  router.use(authenticate);
  router.use(authorize(['admin']));
  
  // Get pending users
  router.get('/users/pending', (req, res) => adminController.getPendingUsers(req, res));
  
  return router;
}; 