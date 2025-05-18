import { Router } from 'express';
import { AdminController } from '../controllers/AdminController';
import { processUserRequestSchema, changeUserTeamSchema } from '../validation/AdminValidation';
import { validate } from '../../../login/presentation/middleware/validationMiddleware';
import { authenticate } from '../../../login/presentation/middleware/authMiddleware';
import { authorize } from '../../../login/presentation/middleware/authMiddleware';

const router = Router();

router.use(authenticate);
router.use(authorize(['admin']));

// Get pending users
router.get('/users/pending', AdminController.getPendingUsers);

// Process user request (approve/decline)
router.post('/users/process', validate(processUserRequestSchema), AdminController.processUserRequest);

// Get all teams with their effective users
router.get('/teams/with-effective-users', AdminController.getTeamsWithEffectiveUsers);

// Change a user's team
router.post('/users/change-team', validate(changeUserTeamSchema), AdminController.changeUserTeam);

export default router;
