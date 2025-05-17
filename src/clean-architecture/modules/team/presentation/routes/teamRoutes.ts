import { Router } from 'express';
import { TeamController } from '../controllers/TeamController';

const router = Router();

// Get all teams route
router.get('/', TeamController.getAllTeams);

// Update user team route
router.post('/update-user-team', TeamController.updateUserTeam);

export { router as teamRoutes }; 