import { Router } from 'express';
import { NotificationsController, subscribeSchema } from '../controllers/notificationsController';
import { validateRequest } from '../middleware/validate';
import { requireAuth } from '../middleware/authMiddleware';

const router = Router();
router.get('/vapid-public-key', NotificationsController.getPublicKey);
router.post('/subscribe', validateRequest(subscribeSchema), NotificationsController.subscribe);
router.post('/test-broadcast', requireAuth, NotificationsController.testBroadcast);
export default router;
