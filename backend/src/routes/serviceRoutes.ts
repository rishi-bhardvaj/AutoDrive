import { Router } from 'express';
import { ServiceRequestsController, createServiceRequestSchema, updateServiceRequestSchema } from '../controllers/serviceRequestsController';
import { validateRequest } from '../middleware/validate';
import { requireAuth } from '../middleware/authMiddleware';

const router = Router();
router.post('/', validateRequest(createServiceRequestSchema), ServiceRequestsController.create);
router.get('/admin/all', requireAuth, ServiceRequestsController.getAllAdmin);
router.patch('/admin/:id', requireAuth, validateRequest(updateServiceRequestSchema), ServiceRequestsController.update);
export default router;
