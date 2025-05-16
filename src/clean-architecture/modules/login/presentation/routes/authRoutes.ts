import { Router } from 'express';
import { AuthController } from '../controllers/authController';
import { loginSchema, registerSchema } from '../validation/authValidation';
import { validate } from '../middleware/validationMiddleware';

const router = Router();

// Authentication routes
router.post('/login', validate(loginSchema), AuthController.login);
router.post('/register', validate(registerSchema), AuthController.register);

export { router as authRoutes }; 