import { Router } from 'express';
import { VehiclesController, vehicleCreateSchema, vehicleUpdateSchema } from '../controllers/vehiclesController';
import { validateRequest } from '../middleware/validate';
import { requireAuth } from '../middleware/authMiddleware';

const router = Router();
router.get('/', VehiclesController.getAllPublic);
router.get('/:identifier', VehiclesController.getBySlugOrId);
router.get('/admin/all', requireAuth, VehiclesController.getAdminVehicles);
router.post('/admin', requireAuth, validateRequest(vehicleCreateSchema), VehiclesController.createVehicle);
router.patch('/admin/:id', requireAuth, validateRequest(vehicleUpdateSchema), VehiclesController.updateVehicle);
router.patch('/admin/:id/status', requireAuth, VehiclesController.updateStatus);
router.delete('/admin/:id', requireAuth, VehiclesController.deleteVehicle);
export default router;
