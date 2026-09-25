import { Router } from 'express';
import { AuthController, loginSchema, updatePasswordSchema } from '../controllers/authController';
import { validateRequest } from '../middleware/validate';
import { requireAuth } from '../middleware/authMiddleware';

const router = Router();
router.post('/login', validateRequest(loginSchema), AuthController.login);
router.get('/me', requireAuth, AuthController.getMe);
router.patch('/update-password', requireAuth, validateRequest(updatePasswordSchema), AuthController.updatePassword);
export default router;
