import { Router } from 'express';
import { BookingsController, createBookingSchema, updateBookingStatusSchema } from '../controllers/bookingsController';
import { validateRequest } from '../middleware/validate';
import { requireAuth } from '../middleware/authMiddleware';

const router = Router();
router.post('/', validateRequest(createBookingSchema), BookingsController.createBooking);
router.get('/check-availability', BookingsController.checkAvailability);
router.get('/admin/all', requireAuth, BookingsController.getAdminBookings);
router.patch('/admin/:id/status', requireAuth, validateRequest(updateBookingStatusSchema), BookingsController.updateStatus);
export default router;
