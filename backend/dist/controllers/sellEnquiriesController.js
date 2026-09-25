"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SellEnquiriesController = exports.updateSellEnquirySchema = exports.createSellEnquirySchema = void 0;
const zod_1 = require("zod");
const client_1 = require("@prisma/client");
const prisma_1 = __importDefault(require("../prisma"));
const referenceGenerator_1 = require("../utils/referenceGenerator");
const notificationService_1 = require("../services/notificationService");
const phoneRegex = /^(\+91[\s-]?)?[6789]\d{9}$/;
exports.createSellEnquirySchema = zod_1.z.object({
    body: zod_1.z.object({
        customerName: zod_1.z.string().min(2, 'Name is required'),
        customerPhone: zod_1.z.string().regex(phoneRegex, 'Please enter a valid 10-digit Indian mobile number'),
        customerEmail: zod_1.z.string().email('Please enter a valid email').optional().or(zod_1.z.literal('')),
        carMakeModel: zod_1.z.string().min(3, 'Car make & model is required'),
        registrationYear: zod_1.z.number().int().min(2000).max(2030),
        registrationState: zod_1.z.string().optional().nullable(),
        kilometres: zod_1.z.number().int().nonnegative(),
        fuelType: zod_1.z.nativeEnum(client_1.FuelType),
        expectedPrice: zod_1.z.number().positive('Expected price must be positive'),
        description: zod_1.z.string().optional().nullable(),
        photos: zod_1.z.array(zod_1.z.string().url()).optional().default([]),
    }),
});
exports.updateSellEnquirySchema = zod_1.z.object({
    body: zod_1.z.object({
        status: zod_1.z.nativeEnum(client_1.SellEnquiryStatus).optional(),
        adminNotes: zod_1.z.string().optional().nullable(),
    }),
});
class SellEnquiriesController {
    static async create(req, res, next) {
        try {
            const data = req.body;
            let enquiryReference = (0, referenceGenerator_1.generateReference)('SEL');
            while (await prisma_1.default.sellEnquiry.findUnique({ where: { enquiryReference } })) {
                enquiryReference = (0, referenceGenerator_1.generateReference)('SEL');
            }
            const enquiry = await prisma_1.default.sellEnquiry.create({
                data: {
                    enquiryReference,
                    customerName: data.customerName.trim(),
                    customerPhone: data.customerPhone.trim(),
                    customerEmail: data.customerEmail?.trim() || null,
                    carMakeModel: data.carMakeModel.trim(),
                    registrationYear: data.registrationYear,
                    registrationState: data.registrationState?.trim() || null,
                    kilometres: data.kilometres,
                    fuelType: data.fuelType,
                    expectedPrice: data.expectedPrice,
                    description: data.description?.trim() || null,
                    photos: data.photos || [],
                    status: client_1.SellEnquiryStatus.NEW,
                },
            });
            notificationService_1.NotificationService.notifyAdmins({
                title: '🚘 New "Sell Your Car" Enquiry',
                body: data.customerName + ' wants to sell ' + data.carMakeModel + ' [' + enquiryReference + ']',
                data: { url: '/admin/buy-sell', type: 'sell_enquiry', id: enquiry.id },
            });
            res.status(201).json({
                success: true,
                message: 'Car valuation request received. Our inspection team will contact you shortly.',
                data: {
                    enquiryReference: enquiry.enquiryReference,
                    customerName: enquiry.customerName,
                    carMakeModel: enquiry.carMakeModel,
                    expectedPrice: enquiry.expectedPrice,
                },
            });
        }
        catch (error) {
            next(error);
        }
    }
    static async getAllAdmin(req, res, next) {
        try {
            const { status, search } = req.query;
            const where = {};
            if (status && Object.values(client_1.SellEnquiryStatus).includes(status)) {
                where.status = status;
            }
            if (search) {
                const query = search.trim();
                where.OR = [
                    { enquiryReference: { contains: query, mode: 'insensitive' } },
                    { customerName: { contains: query, mode: 'insensitive' } },
                    { carMakeModel: { contains: query, mode: 'insensitive' } },
                ];
            }
            const enquiries = await prisma_1.default.sellEnquiry.findMany({
                where,
                orderBy: { createdAt: 'desc' },
            });
            res.status(200).json({ success: true, count: enquiries.length, data: enquiries });
        }
        catch (error) {
            next(error);
        }
    }
    static async update(req, res, next) {
        try {
            const { id } = req.params;
            const data = req.body;
            const updated = await prisma_1.default.sellEnquiry.update({
                where: { id },
                data,
            });
            res.status(200).json({
                success: true,
                message: 'Sell enquiry ' + updated.enquiryReference + ' updated successfully.',
                data: updated,
            });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.SellEnquiriesController = SellEnquiriesController;
