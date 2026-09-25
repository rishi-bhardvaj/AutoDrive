import { Router } from 'express';
import { RepairsController, createRepairSchema, updateRepairSchema } from '../controllers/repairsController';
import { validateRequest } from '../middleware/validate';
import { requireAuth } from '../middleware/authMiddleware';

const router = Router();
router.use(requireAuth);
router.get('/all', RepairsController.getAll);
router.post('/', validateRequest(createRepairSchema), RepairsController.create);
router.patch('/:id', validateRequest(updateRepairSchema), RepairsController.update);
router.delete('/:id', RepairsController.delete);
export default router;
