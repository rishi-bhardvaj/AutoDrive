import { Router } from 'express';
import { SaleVehiclesController, createSaleVehicleSchema, purchaseEnquirySchema } from '../controllers/saleVehiclesController';
import { validateRequest } from '../middleware/validate';
import { requireAuth } from '../middleware/authMiddleware';

const router = Router();
router.get('/', SaleVehiclesController.getAllPublic);
router.get('/:identifier', SaleVehiclesController.getBySlugOrId);
router.post('/enquire', validateRequest(purchaseEnquirySchema), SaleVehiclesController.submitPurchaseEnquiry);
router.get('/admin/all', requireAuth, SaleVehiclesController.getAllAdmin);
router.post('/admin', requireAuth, validateRequest(createSaleVehicleSchema), SaleVehiclesController.create);
router.patch('/admin/:id', requireAuth, SaleVehiclesController.update);
router.delete('/admin/:id', requireAuth, SaleVehiclesController.delete);
router.get('/admin/enquiries/all', requireAuth, SaleVehiclesController.getEnquiries);
router.patch('/admin/enquiries/:id/status', requireAuth, SaleVehiclesController.updateEnquiryStatus);
export default router;
