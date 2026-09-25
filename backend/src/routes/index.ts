import { Router } from 'express';
import authRoutes from './authRoutes';
import vehiclesRoutes from './vehiclesRoutes';
import bookingsRoutes from './bookingsRoutes';
import serviceRoutes from './serviceRoutes';
import repairsRoutes from './repairsRoutes';
import saleVehiclesRoutes from './saleVehiclesRoutes';
import sellEnquiriesRoutes from './sellEnquiriesRoutes';
import dashboardRoutes from './dashboardRoutes';
import notificationsRoutes from './notificationsRoutes';
import { config } from '../config';

const apiRouter = Router();

apiRouter.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    business: config.business.name,
    version: '1.0.0',
  });
});

apiRouter.get('/business-info', (req, res) => {
  res.status(200).json({ success: true, data: config.business });
});

apiRouter.use('/auth', authRoutes);
apiRouter.use('/cars', vehiclesRoutes);
apiRouter.use('/bookings', bookingsRoutes);
apiRouter.use('/service-requests', serviceRoutes);
apiRouter.use('/repairs', repairsRoutes);
apiRouter.use('/sale-cars', saleVehiclesRoutes);
apiRouter.use('/sell-enquiries', sellEnquiriesRoutes);
apiRouter.use('/dashboard', dashboardRoutes);
apiRouter.use('/notifications', notificationsRoutes);

export default apiRouter;
