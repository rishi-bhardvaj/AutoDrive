"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServiceRequestsController = exports.updateServiceRequestSchema = exports.createServiceRequestSchema = void 0;
const zod_1 = require("zod");
const client_1 = require("@prisma/client");
const prisma_1 = __importDefault(require("../prisma"));
const referenceGenerator_1 = require("../utils/referenceGenerator");
const notificationService_1 = require("../services/notificationService");
const phoneRegex = /^(\+91[\s-]?)?[6789]\d{9}$/;
exports.createServiceRequestSchema = zod_1.z.object({
    body: zod_1.z.object({
        customerName: zod_1.z.string().min(2, 'Name is required'),
        customerPhone: zod_1.z.string().regex(phoneRegex, 'Please enter a valid 10-digit Indian mobile number'),
        customerEmail: zod_1.z.string().email().optional().or(zod_1.z.literal('')),
        vehicleDetails: zod_1.z.string().min(2, 'Vehicle details are required'),
        serviceType: zod_1.z.string().min(2, 'Service type is required'),
        preferredDate: zod_1.z.string().optional().nullable(),
        pickupDropRequired: zod_1.z.boolean().default(false),
        pickupAddress: zod_1.z.string().optional().nullable(),
        description: zod_1.z.string().optional().nullable(),
    }),
});
exports.updateServiceRequestSchema = zod_1.z.object({
    body: zod_1.z.object({
        status: zod_1.z.nativeEnum(client_1.ServiceStatus).optional(),
        estimatedCost: zod_1.z.number().optional().nullable(),
        adminNotes: zod_1.z.string().optional().nullable(),
    }),
});
class ServiceRequestsController {
    static async create(req, res, next) {
        try {
            const data = req.body;
            let requestReference = (0, referenceGenerator_1.generateReference)('SR');
            while (await prisma_1.default.serviceRequest.findUnique({ where: { requestReference } })) {
                requestReference = (0, referenceGenerator_1.generateReference)('SR');
            }
            const serviceRequest = await prisma_1.default.serviceRequest.create({
                data: {
                    requestReference,
                    customerName: data.customerName.trim(),
                    customerPhone: data.customerPhone.trim(),
                    customerEmail: data.customerEmail?.trim() || null,
                    vehicleDetails: data.vehicleDetails.trim(),
                    serviceType: data.serviceType,
                    preferredDate: data.preferredDate ? new Date(data.preferredDate) : null,
                    pickupDropRequired: data.pickupDropRequired || false,
                    pickupAddress: data.pickupAddress?.trim() || null,
                    description: data.description?.trim() || null,
                    status: client_1.ServiceStatus.NEW,
                },
            });
            notificationService_1.NotificationService.notifyAdmins({
                title: '🔧 New Service Booking Request',
                body: `${data.customerName} booked ${data.serviceType} for ${data.vehicleDetails} [${requestReference}]`,
                data: { url: '/admin/services', type: 'service_request', id: serviceRequest.id },
            });
            res.status(201).json({
                success: true,
                message: 'Service appointment request received.',
                data: {
                    id: serviceRequest.id,
                    requestReference: serviceRequest.requestReference,
                    customerName: serviceRequest.customerName,
                    vehicleDetails: serviceRequest.vehicleDetails,
                    serviceType: serviceRequest.serviceType,
                },
            });
        }
        catch (error) {
            next(error);
        }
    }
    static async getAllAdmin(req, res, next) {
        try {
            const requests = await prisma_1.default.serviceRequest.findMany({
                orderBy: { createdAt: 'desc' },
            });
            res.status(200).json({ success: true, count: requests.length, data: requests });
        }
        catch (error) {
            next(error);
        }
    }
    static async update(req, res, next) {
        try {
            const { id } = req.params;
            const data = req.body;
            const updated = await prisma_1.default.serviceRequest.update({
                where: { id },
                data,
            });
            res.status(200).json({ success: true, data: updated });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.ServiceRequestsController = ServiceRequestsController;
