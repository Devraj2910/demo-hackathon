import { Router } from 'express';
import { TeamController } from '../controllers/TeamController';

const router = Router();

// Get all teams route
router.get('/', TeamController.getAllTeams);

export { router as teamRoutes }; 