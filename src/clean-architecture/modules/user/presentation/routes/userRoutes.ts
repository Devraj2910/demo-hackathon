import { Router } from "express";
import { UserController } from "../controllers/UserController";
import * as userValidation from "../validation/userValidation";
import { validate } from "../../../../shared/middleware/validation";

const router = Router();

router.get(
  "/search",
  validate(userValidation.searchUsers, 'query'),
  UserController.searchUsers
);
export { router as userRoutes };
