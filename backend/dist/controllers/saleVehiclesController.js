"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SaleVehiclesController = exports.purchaseEnquirySchema = exports.createSaleVehicleSchema = void 0;
const zod_1 = require("zod");
const client_1 = require("@prisma/client");
const prisma_1 = __importDefault(require("../prisma"));
const referenceGenerator_1 = require("../utils/referenceGenerator");
const notificationService_1 = require("../services/notificationService");
const phoneRegex = /^(\+91[\s-]?)?[6789]\d{9}$/;
exports.createSaleVehicleSchema = zod_1.z.object({
    body: zod_1.z.object({
        brand: zod_1.z.string().min(1, 'Brand is required'),
        model: zod_1.z.string().min(1, 'Model is required'),
        year: zod_1.z.number().int().min(2000).max(2030),
        registrationYear: zod_1.z.number().int().min(2000).max(2030),
        kilometres: zod_1.z.number().int().nonnegative(),
        fuelType: zod_1.z.nativeEnum(client_1.FuelType),
        transmission: zod_1.z.nativeEnum(client_1.Transmission),
        ownership: zod_1.z.number().int().min(1).max(5).default(1),
        price: zod_1.z.number().positive('Price must be positive'),
        location: zod_1.z.string().default('Delhi NCR'),
        insuranceValidity: zod_1.z.string().optional().nullable(),
        description: zod_1.z.string().min(10, 'Description must be at least 10 characters'),
        features: zod_1.z.array(zod_1.z.string()).default([]),
        images: zod_1.z.array(zod_1.z.string().url()).min(1, 'At least one valid image is required'),
        status: zod_1.z.nativeEnum(client_1.SaleVehicleStatus).default(client_1.SaleVehicleStatus.AVAILABLE),
    }),
});
exports.purchaseEnquirySchema = zod_1.z.object({
    body: zod_1.z.object({
        saleVehicleId: zod_1.z.string().min(1, 'Vehicle ID is required'),
        customerName: zod_1.z.string().min(2, 'Name is required'),
        customerPhone: zod_1.z.string().regex(phoneRegex, 'Please enter a valid 10-digit Indian mobile number'),
        customerEmail: zod_1.z.string().email('Please enter a valid email').optional().or(zod_1.z.literal('')),
        message: zod_1.z.string().optional(),
        offeredPrice: zod_1.z.number().positive().optional().nullable(),
    }),
});
class SaleVehiclesController {
    static async getAllPublic(req, res, next) {
        try {
            const { fuel, transmission, minPrice, maxPrice, search } = req.query;
            const where = { status: { in: [client_1.SaleVehicleStatus.AVAILABLE, client_1.SaleVehicleStatus.BOOKED] } };
            if (fuel && Object.values(client_1.FuelType).includes(fuel))
                where.fuelType = fuel;
            if (transmission && Object.values(client_1.Transmission).includes(transmission))
                where.transmission = transmission;
            if (minPrice || maxPrice) {
                where.price = {};
                if (minPrice)
                    where.price.gte = parseFloat(minPrice);
                if (maxPrice)
                    where.price.lte = parseFloat(maxPrice);
            }
            if (search) {
                const query = search.trim();
                where.OR = [
                    { brand: { contains: query, mode: 'insensitive' } },
                    { model: { contains: query, mode: 'insensitive' } },
                ];
            }
            const cars = await prisma_1.default.saleVehicle.findMany({
                where,
                orderBy: { createdAt: 'desc' },
            });
            res.status(200).json({ success: true, count: cars.length, data: cars });
        }
        catch (error) {
            next(error);
        }
    }
    static async getBySlugOrId(req, res, next) {
        try {
            const { identifier } = req.params;
            const car = await prisma_1.default.saleVehicle.findFirst({
                where: { OR: [{ id: identifier }, { slug: identifier }] },
            });
            if (!car) {
                res.status(404).json({ success: false, message: 'Vehicle for sale not found' });
                return;
            }
            res.status(200).json({ success: true, data: car });
        }
        catch (error) {
            next(error);
        }
    }
    static async submitPurchaseEnquiry(req, res, next) {
        try {
            const { saleVehicleId, customerName, customerPhone, customerEmail, message, offeredPrice } = req.body;
            const saleVehicle = await prisma_1.default.saleVehicle.findUnique({ where: { id: saleVehicleId } });
            if (!saleVehicle) {
                res.status(404).json({ success: false, message: 'Vehicle not found' });
                return;
            }
            const enquiry = await prisma_1.default.purchaseEnquiry.create({
                data: {
                    saleVehicleId,
                    customerName: customerName.trim(),
                    customerPhone: customerPhone.trim(),
                    customerEmail: customerEmail?.trim() || null,
                    message: message?.trim() || null,
                    offeredPrice: offeredPrice || null,
                    status: client_1.PurchaseEnquiryStatus.NEW,
                },
            });
            notificationService_1.NotificationService.notifyAdmins({
                title: '💰 New Buy-Car Enquiry',
                body: customerName + ' enquired about ' + saleVehicle.brand + ' ' + saleVehicle.model,
                data: { url: '/admin/buy-sell', type: 'purchase_enquiry', id: enquiry.id },
            });
            res.status(201).json({ success: true, message: 'Enquiry submitted successfully.', data: enquiry });
        }
        catch (error) {
            next(error);
        }
    }
    static async getAllAdmin(req, res, next) {
        try {
            const cars = await prisma_1.default.saleVehicle.findMany({
                include: { _count: { select: { enquiries: true } } },
                orderBy: { createdAt: 'desc' },
            });
            res.status(200).json({ success: true, count: cars.length, data: cars });
        }
        catch (error) {
            next(error);
        }
    }
    static async create(req, res, next) {
        try {
            const data = req.body;
            let baseSlug = (0, referenceGenerator_1.slugify)(data.brand + '-' + data.model + '-' + data.year + '-sale');
            let slug = baseSlug;
            let count = 1;
            while (await prisma_1.default.saleVehicle.findUnique({ where: { slug } })) {
                slug = baseSlug + '-' + count;
                count++;
            }
            const car = await prisma_1.default.saleVehicle.create({
                data: { ...data, slug },
            });
            res.status(201).json({ success: true, message: 'Car listed successfully', data: car });
        }
        catch (error) {
            next(error);
        }
    }
    static async update(req, res, next) {
        try {
            const { id } = req.params;
            const data = req.body;
            const updated = await prisma_1.default.saleVehicle.update({
                where: { id },
                data,
            });
            res.status(200).json({ success: true, message: 'Vehicle updated successfully', data: updated });
        }
        catch (error) {
            next(error);
        }
    }
    static async delete(req, res, next) {
        try {
            const { id } = req.params;
            await prisma_1.default.purchaseEnquiry.deleteMany({ where: { saleVehicleId: id } });
            await prisma_1.default.saleVehicle.delete({ where: { id } });
            res.status(200).json({ success: true, message: 'Vehicle removed from sale listings' });
        }
        catch (error) {
            next(error);
        }
    }
    static async getEnquiries(req, res, next) {
        try {
            const enquiries = await prisma_1.default.purchaseEnquiry.findMany({
                include: { saleVehicle: true },
                orderBy: { createdAt: 'desc' },
            });
            res.status(200).json({ success: true, count: enquiries.length, data: enquiries });
        }
        catch (error) {
            next(error);
        }
    }
    static async updateEnquiryStatus(req, res, next) {
        try {
            const { id } = req.params;
            const { status, adminNotes } = req.body;
            const updated = await prisma_1.default.purchaseEnquiry.update({
                where: { id },
                data: { status, adminNotes },
            });
            res.status(200).json({ success: true, message: 'Enquiry updated successfully', data: updated });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.SaleVehiclesController = SaleVehiclesController;
