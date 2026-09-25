"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authRoutes_1 = __importDefault(require("./authRoutes"));
const vehiclesRoutes_1 = __importDefault(require("./vehiclesRoutes"));
const bookingsRoutes_1 = __importDefault(require("./bookingsRoutes"));
const serviceRoutes_1 = __importDefault(require("./serviceRoutes"));
const repairsRoutes_1 = __importDefault(require("./repairsRoutes"));
const saleVehiclesRoutes_1 = __importDefault(require("./saleVehiclesRoutes"));
const sellEnquiriesRoutes_1 = __importDefault(require("./sellEnquiriesRoutes"));
const dashboardRoutes_1 = __importDefault(require("./dashboardRoutes"));
const notificationsRoutes_1 = __importDefault(require("./notificationsRoutes"));
const config_1 = require("../config");
const apiRouter = (0, express_1.Router)();
apiRouter.get('/health', (req, res) => {
    res.status(200).json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        business: config_1.config.business.name,
        version: '1.0.0',
    });
});
apiRouter.get('/business-info', (req, res) => {
    res.status(200).json({ success: true, data: config_1.config.business });
});
apiRouter.use('/auth', authRoutes_1.default);
apiRouter.use('/cars', vehiclesRoutes_1.default);
apiRouter.use('/bookings', bookingsRoutes_1.default);
apiRouter.use('/service-requests', serviceRoutes_1.default);
apiRouter.use('/repairs', repairsRoutes_1.default);
apiRouter.use('/sale-cars', saleVehiclesRoutes_1.default);
apiRouter.use('/sell-enquiries', sellEnquiriesRoutes_1.default);
apiRouter.use('/dashboard', dashboardRoutes_1.default);
apiRouter.use('/notifications', notificationsRoutes_1.default);
exports.default = apiRouter;
