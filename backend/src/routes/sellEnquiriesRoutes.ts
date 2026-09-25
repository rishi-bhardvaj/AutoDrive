import { Router } from 'express';
import { SellEnquiriesController, createSellEnquirySchema, updateSellEnquirySchema } from '../controllers/sellEnquiriesController';
import { validateRequest } from '../middleware/validate';
import { requireAuth } from '../middleware/authMiddleware';

const router = Router();
router.post('/', validateRequest(createSellEnquirySchema), SellEnquiriesController.create);
router.get('/admin/all', requireAuth, SellEnquiriesController.getAllAdmin);
router.patch('/admin/:id', requireAuth, validateRequest(updateSellEnquirySchema), SellEnquiriesController.update);
export default router;
