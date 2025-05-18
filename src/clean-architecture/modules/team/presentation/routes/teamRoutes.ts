import { Router } from 'express';
import { TeamController } from '../controllers/TeamController';
import { validate } from '../../../../shared/middleware/validation';
import teamValidation from '../validation/teamValidation';

const router = Router();

// Get all teams route
router.get('/', TeamController.getAllTeams);

// Create a new team route
router.post('/', validate(teamValidation.createTeam), TeamController.createTeam);

// Update user team route
router.post('/update-user-team', TeamController.updateUserTeam);

export { router as teamRoutes }; 