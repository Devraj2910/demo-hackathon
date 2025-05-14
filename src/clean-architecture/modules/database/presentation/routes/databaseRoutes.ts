import { Router } from 'express';
import { DatabaseController } from '../controllers/databaseController';

const router = Router();

router.get('/databases', DatabaseController.listDatabases);

export { router as databaseRoutes }; 