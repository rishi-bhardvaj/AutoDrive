"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VehiclesController = exports.vehicleUpdateSchema = exports.vehicleCreateSchema = void 0;
const zod_1 = require("zod");
const client_1 = require("@prisma/client");
const prisma_1 = __importDefault(require("../prisma"));
const referenceGenerator_1 = require("../utils/referenceGenerator");
exports.vehicleCreateSchema = zod_1.z.object({
    body: zod_1.z.object({
        brand: zod_1.z.string().min(1, 'Brand is required'),
        model: zod_1.z.string().min(1, 'Model is required'),
        registrationNumber: zod_1.z.string().min(4, 'Registration number is required'),
        year: zod_1.z.number().int().min(2010).max(2030),
        fuelType: zod_1.z.nativeEnum(client_1.FuelType),
        transmission: zod_1.z.nativeEnum(client_1.Transmission),
        seats: zod_1.z.number().int().min(2).max(20),
        dailyRentalPrice: zod_1.z.number().positive('Daily rate must be positive'),
        securityDeposit: zod_1.z.number().nonnegative('Security deposit cannot be negative'),
        description: zod_1.z.string().optional().nullable(),
        features: zod_1.z.array(zod_1.z.string()).default([]),
        images: zod_1.z.array(zod_1.z.string()).default([]),
        status: zod_1.z.nativeEnum(client_1.VehicleStatus).default(client_1.VehicleStatus.AVAILABLE),
        isFeatured: zod_1.z.boolean().default(false),
    }),
});
exports.vehicleUpdateSchema = zod_1.z.object({
    body: exports.vehicleCreateSchema.shape.body.partial(),
});
class VehiclesController {
    static async getAllPublic(req, res, next) {
        try {
            const { fuel, transmission, seats, minPrice, maxPrice, search, isFeatured } = req.query;
            const where = {
                status: { in: [client_1.VehicleStatus.AVAILABLE, client_1.VehicleStatus.BOOKED] },
            };
            if (fuel && Object.values(client_1.FuelType).includes(fuel))
                where.fuelType = fuel;
            if (transmission && Object.values(client_1.Transmission).includes(transmission))
                where.transmission = transmission;
            if (seats)
                where.seats = parseInt(seats, 10);
            if (isFeatured === 'true')
                where.isFeatured = true;
            if (search) {
                const q = search.trim();
                where.OR = [
                    { brand: { contains: q, mode: 'insensitive' } },
                    { model: { contains: q, mode: 'insensitive' } },
                ];
            }
            const vehicles = await prisma_1.default.vehicle.findMany({
                where,
                orderBy: [{ isFeatured: 'desc' }, { dailyRentalPrice: 'asc' }],
            });
            res.status(200).json({ success: true, count: vehicles.length, data: vehicles });
        }
        catch (error) {
            next(error);
        }
    }
    static async getBySlugOrId(req, res, next) {
        try {
            const { identifier } = req.params;
            const vehicle = await prisma_1.default.vehicle.findFirst({
                where: {
                    OR: [{ id: identifier }, { slug: identifier }],
                },
            });
            if (!vehicle) {
                res.status(404).json({ success: false, message: 'Vehicle not found' });
                return;
            }
            res.status(200).json({ success: true, data: vehicle });
        }
        catch (error) {
            next(error);
        }
    }
    static async getAdminVehicles(req, res, next) {
        try {
            const vehicles = await prisma_1.default.vehicle.findMany({
                orderBy: { createdAt: 'desc' },
            });
            res.status(200).json({ success: true, count: vehicles.length, data: vehicles });
        }
        catch (error) {
            next(error);
        }
    }
    static async createVehicle(req, res, next) {
        try {
            const data = req.body;
            const slug = (0, referenceGenerator_1.slugify)(`${data.brand}-${data.model}-${data.year}-${Math.floor(100 + Math.random() * 900)}`);
            const vehicle = await prisma_1.default.vehicle.create({
                data: {
                    ...data,
                    slug,
                },
            });
            res.status(201).json({ success: true, data: vehicle });
        }
        catch (error) {
            next(error);
        }
    }
    static async updateVehicle(req, res, next) {
        try {
            const { id } = req.params;
            const data = req.body;
            const vehicle = await prisma_1.default.vehicle.update({
                where: { id },
                data,
            });
            res.status(200).json({ success: true, data: vehicle });
        }
        catch (error) {
            next(error);
        }
    }
    static async updateStatus(req, res, next) {
        try {
            const { id } = req.params;
            const { status } = req.body;
            const vehicle = await prisma_1.default.vehicle.update({
                where: { id },
                data: { status },
            });
            res.status(200).json({ success: true, data: vehicle });
        }
        catch (error) {
            next(error);
        }
    }
    static async deleteVehicle(req, res, next) {
        try {
            const { id } = req.params;
            await prisma_1.default.vehicle.delete({ where: { id } });
            res.status(200).json({ success: true, message: 'Vehicle removed from fleet' });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.VehiclesController = VehiclesController;
