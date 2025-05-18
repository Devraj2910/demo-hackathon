import { Router } from 'express';
import { CardController } from '../controllers/cardController';
import { 
  addCardSchema, 
  getCardsSchema, 
  getLatestCardsSchema,
  deleteCardSchema
} from '../validation/cardValidation';
import { 
  validate, 
  validateQuery, 
  validateParams 
} from '../middleware/validationMiddleware';
import { 
  authenticate, 
  authorize 
} from '../../../../modules/login/presentation/middleware/authMiddleware';

const router = Router();

// All routes require authentication
router.use(authenticate);

// Get all cards (with optional filters)
router.get('/', validateQuery(getCardsSchema), CardController.getCards);

// Get latest 10 cards
router.get('/latest', validateQuery(getLatestCardsSchema), CardController.getLatestCards);

// Add new card
router.post('/', authenticate,authorize(['team-leader','admin']), validate(addCardSchema), CardController.addCard);

// Delete card (admin only)
router.delete('/:id', validateParams(deleteCardSchema), CardController.deleteCard);

export { router as cardRoutes }; ``