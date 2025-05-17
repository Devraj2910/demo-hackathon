import { Router } from 'express';
import { AuthController } from '../controllers/authController';
import { loginSchema, registerSchema } from '../validation/authValidation';
import { validate } from '../middleware/validationMiddleware';
import { authenticate, authorize } from '../middleware/authMiddleware';

const router = Router();

// Authentication routes
router.post('/login', validate(loginSchema), AuthController.login);
router.post('/register', validate(registerSchema), AuthController.register);

// Protected routes
router.get('/profile', authenticate,authorize(['users']), (req, res) => {
  res.status(200).json({
    success: true,
    data: {
      user: req.user
    }
  });
});

// Admin routes
// router.get('/admin/users', authenticate, authorize(['admin']), (req, res) => {
//   // This route is accessible only to admins
//   res.status(200).json({
//     success: true,
//     message: 'Admin access granted',
//     data: {
//       requestedBy: req.user
//     }
//   });
// });

// Add this route to handle access grant
// router.get('/grant-access/:userId', AuthController.grantAccess);

export { router as authRoutes }; 