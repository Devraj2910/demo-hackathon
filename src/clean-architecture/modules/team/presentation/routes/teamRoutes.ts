import { Router } from 'express';
import { TeamController } from '../controllers/TeamController';
import { validate } from '../../../../shared/middleware/validation';
import teamValidation from '../validation/teamValidation';
import { authenticate, authorize } from '../../../login/presentation/middleware/authMiddleware';

const router = Router();

// Get all teams route
router.get('/', TeamController.getAllTeams);

// Create a new team route
router.post('/', authenticate,authorize(['admin']), validate(teamValidation.createTeam), TeamController.createTeam);

// Delete a team route
router.delete('/:id', authenticate,authorize(['admin']), TeamController.deleteTeam);

// Update user team route
router.post('/update-user-team', authenticate,authorize(['admin']), TeamController.updateUserTeam);

export { router as teamRoutes }; 