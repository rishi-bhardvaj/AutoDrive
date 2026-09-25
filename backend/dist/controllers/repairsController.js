"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RepairsController = exports.updateRepairSchema = exports.createRepairSchema = void 0;
const zod_1 = require("zod");
const client_1 = require("@prisma/client");
const prisma_1 = __importDefault(require("../prisma"));
const referenceGenerator_1 = require("../utils/referenceGenerator");
exports.createRepairSchema = zod_1.z.object({
    body: zod_1.z.object({
        vehicleId: zod_1.z.string().min(1, 'Vehicle is required'),
        issueDescription: zod_1.z.string().min(5, 'Issue description must be at least 5 characters'),
        estimatedCost: zod_1.z.number().nonnegative().optional().nullable(),
        startDate: zod_1.z.string().optional(),
    }),
});
exports.updateRepairSchema = zod_1.z.object({
    body: zod_1.z.object({
        status: zod_1.z.nativeEnum(client_1.RepairStatus).optional(),
        actualCost: zod_1.z.number().nonnegative().optional().nullable(),
        endDate: zod_1.z.string().optional().nullable(),
        notes: zod_1.z.string().optional().nullable(),
    }),
});
class RepairsController {
    static async getAll(req, res, next) {
        try {
            const repairs = await prisma_1.default.repairRecord.findMany({
                include: { vehicle: true },
                orderBy: { startDate: 'desc' },
            });
            res.status(200).json({ success: true, count: repairs.length, data: repairs });
        }
        catch (error) {
            next(error);
        }
    }
    static async create(req, res, next) {
        try {
            const { vehicleId, issueDescription, estimatedCost, startDate } = req.body;
            const repairReference = (0, referenceGenerator_1.generateReference)('REP');
            const [repair] = await prisma_1.default.$transaction([
                prisma_1.default.repairRecord.create({
                    data: {
                        repairReference,
                        vehicleId,
                        issueDescription,
                        estimatedCost: estimatedCost ? parseFloat(estimatedCost) : null,
                        startDate: startDate ? new Date(startDate) : new Date(),
                        status: client_1.RepairStatus.IN_PROGRESS,
                    },
                    include: { vehicle: true },
                }),
                prisma_1.default.vehicle.update({
                    where: { id: vehicleId },
                    data: { status: client_1.VehicleStatus.UNDER_REPAIR },
                }),
            ]);
            res.status(201).json({ success: true, data: repair });
        }
        catch (error) {
            next(error);
        }
    }
    static async update(req, res, next) {
        try {
            const { id } = req.params;
            const { status, actualCost, endDate, notes } = req.body;
            const existing = await prisma_1.default.repairRecord.findUnique({ where: { id } });
            if (!existing) {
                res.status(404).json({ success: false, message: 'Repair record not found' });
                return;
            }
            const repair = await prisma_1.default.repairRecord.update({
                where: { id },
                data: {
                    ...(status && { status }),
                    ...(actualCost !== undefined && { actualCost }),
                    ...(endDate && { endDate: new Date(endDate) }),
                    ...(notes !== undefined && { notes }),
                },
                include: { vehicle: true },
            });
            if (status === client_1.RepairStatus.COMPLETED && existing.vehicleId) {
                await prisma_1.default.vehicle.update({
                    where: { id: existing.vehicleId },
                    data: { status: client_1.VehicleStatus.AVAILABLE },
                });
            }
            res.status(200).json({ success: true, data: repair });
        }
        catch (error) {
            next(error);
        }
    }
    static async delete(req, res, next) {
        try {
            const { id } = req.params;
            await prisma_1.default.repairRecord.delete({ where: { id } });
            res.status(200).json({ success: true, message: 'Repair record deleted' });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.RepairsController = RepairsController;
