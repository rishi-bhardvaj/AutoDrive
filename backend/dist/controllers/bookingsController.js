"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookingsController = exports.updateBookingStatusSchema = exports.createBookingSchema = void 0;
const zod_1 = require("zod");
const client_1 = require("@prisma/client");
const prisma_1 = __importDefault(require("../prisma"));
const referenceGenerator_1 = require("../utils/referenceGenerator");
const notificationService_1 = require("../services/notificationService");
const phoneRegex = /^(\+91[\s-]?)?[6789]\d{9}$/;
exports.createBookingSchema = zod_1.z.object({
    body: zod_1.z.object({
        vehicleId: zod_1.z.string().min(1, 'Vehicle ID is required'),
        customerName: zod_1.z.string().min(2, 'Customer name is required'),
        customerPhone: zod_1.z.string().regex(phoneRegex, 'Please enter a valid 10-digit Indian mobile number'),
        customerEmail: zod_1.z.string().email('Please enter a valid email address').optional().or(zod_1.z.literal('')),
        pickupDate: zod_1.z.string().min(1, 'Pickup date is required'),
        returnDate: zod_1.z.string().min(1, 'Return date is required'),
        pickupLocation: zod_1.z.string().min(2, 'Pickup location is required'),
        totalDays: zod_1.z.number().int().positive().optional(),
        estimatedAmount: zod_1.z.number().positive().optional(),
        securityDeposit: zod_1.z.number().nonnegative().optional(),
        notes: zod_1.z.string().optional(),
    }),
});
exports.updateBookingStatusSchema = zod_1.z.object({
    body: zod_1.z.object({
        status: zod_1.z.nativeEnum(client_1.BookingStatus),
        adminNotes: zod_1.z.string().optional().nullable(),
    }),
});
class BookingsController {
    static async createBooking(req, res, next) {
        try {
            const data = req.body;
            const pickup = new Date(data.pickupDate);
            const drop = new Date(data.returnDate);
            if (drop <= pickup) {
                res.status(400).json({ success: false, message: 'Return date must be after pickup date' });
                return;
            }
            const vehicle = await prisma_1.default.vehicle.findUnique({ where: { id: data.vehicleId } });
            if (!vehicle) {
                res.status(404).json({ success: false, message: 'Vehicle not found' });
                return;
            }
            const totalDays = data.totalDays || (0, referenceGenerator_1.calculateRentalDays)(pickup, drop);
            const estimatedAmount = data.estimatedAmount || totalDays * vehicle.dailyRentalPrice;
            const securityDeposit = data.securityDeposit !== undefined ? data.securityDeposit : vehicle.securityDeposit;
            let bookingReference = (0, referenceGenerator_1.generateReference)('CR');
            while (await prisma_1.default.rentalBooking.findUnique({ where: { bookingReference } })) {
                bookingReference = (0, referenceGenerator_1.generateReference)('CR');
            }
            const booking = await prisma_1.default.rentalBooking.create({
                data: {
                    bookingReference,
                    vehicleId: vehicle.id,
                    customerName: data.customerName.trim(),
                    customerPhone: data.customerPhone.trim(),
                    customerEmail: data.customerEmail?.trim() || null,
                    pickupDate: pickup,
                    returnDate: drop,
                    pickupLocation: data.pickupLocation.trim(),
                    totalDays,
                    estimatedAmount,
                    securityDeposit,
                    notes: data.notes?.trim() || null,
                    status: client_1.BookingStatus.PENDING,
                },
            });
            notificationService_1.NotificationService.notifyAdmins({
                title: '🚗 New Rental Booking Request',
                body: `${data.customerName} requested ${vehicle.brand} ${vehicle.model} [${bookingReference}]`,
                data: { url: '/admin/bookings', type: 'booking', id: booking.id },
            });
            res.status(201).json({
                success: true,
                message: 'Booking request received. We will confirm availability and contact you shortly.',
                data: {
                    id: booking.id,
                    bookingReference: booking.bookingReference,
                    customerName: booking.customerName,
                    vehicle: `${vehicle.brand} ${vehicle.model}`,
                    pickupDate: booking.pickupDate,
                    returnDate: booking.returnDate,
                    totalDays: booking.totalDays,
                    estimatedAmount: booking.estimatedAmount,
                    securityDeposit: booking.securityDeposit,
                },
            });
        }
        catch (error) {
            next(error);
        }
    }
    static async checkAvailability(req, res, next) {
        try {
            const { vehicleId, pickupDate, returnDate } = req.query;
            if (!vehicleId || !pickupDate || !returnDate) {
                res.status(400).json({ success: false, message: 'Missing parameters' });
                return;
            }
            const pDate = new Date(pickupDate);
            const rDate = new Date(returnDate);
            const conflicts = await prisma_1.default.rentalBooking.findFirst({
                where: {
                    vehicleId: vehicleId,
                    status: client_1.BookingStatus.APPROVED,
                    AND: [
                        { pickupDate: { lte: rDate } },
                        { returnDate: { gte: pDate } },
                    ],
                },
            });
            res.status(200).json({
                success: true,
                available: !conflicts,
                message: conflicts ? 'Vehicle has an approved booking during these dates.' : 'Vehicle is available for selected dates.',
            });
        }
        catch (error) {
            next(error);
        }
    }
    static async getAdminBookings(req, res, next) {
        try {
            const { status, search } = req.query;
            const where = {};
            if (status && Object.values(client_1.BookingStatus).includes(status)) {
                where.status = status;
            }
            if (search) {
                const query = search.trim();
                where.OR = [
                    { bookingReference: { contains: query, mode: 'insensitive' } },
                    { customerName: { contains: query, mode: 'insensitive' } },
                    { customerPhone: { contains: query, mode: 'insensitive' } },
                ];
            }
            const bookings = await prisma_1.default.rentalBooking.findMany({
                where,
                include: { vehicle: true },
                orderBy: { createdAt: 'desc' },
            });
            res.status(200).json({ success: true, count: bookings.length, data: bookings });
        }
        catch (error) {
            next(error);
        }
    }
    static async updateStatus(req, res, next) {
        try {
            const { id } = req.params;
            const { status, adminNotes } = req.body;
            const booking = await prisma_1.default.rentalBooking.findUnique({
                where: { id },
                include: { vehicle: true },
            });
            if (!booking) {
                res.status(404).json({ success: false, message: 'Booking not found' });
                return;
            }
            if (status === client_1.BookingStatus.APPROVED) {
                const conflicting = await prisma_1.default.rentalBooking.findFirst({
                    where: {
                        id: { not: id },
                        vehicleId: booking.vehicleId,
                        status: client_1.BookingStatus.APPROVED,
                        AND: [
                            { pickupDate: { lte: booking.returnDate } },
                            { returnDate: { gte: booking.pickupDate } },
                        ],
                    },
                });
                if (conflicting) {
                    res.status(409).json({
                        success: false,
                        message: `Vehicle is already booked on approved dates between ${conflicting.pickupDate.toISOString().split('T')[0]} and ${conflicting.returnDate.toISOString().split('T')[0]} (Ref: ${conflicting.bookingReference})`,
                    });
                    return;
                }
                await prisma_1.default.vehicle.update({
                    where: { id: booking.vehicleId },
                    data: { status: client_1.VehicleStatus.BOOKED },
                });
            }
            if (status === client_1.BookingStatus.COMPLETED || status === client_1.BookingStatus.CANCELLED || status === client_1.BookingStatus.REJECTED) {
                const otherActive = await prisma_1.default.rentalBooking.findFirst({
                    where: {
                        id: { not: id },
                        vehicleId: booking.vehicleId,
                        status: client_1.BookingStatus.APPROVED,
                    },
                });
                if (!otherActive) {
                    await prisma_1.default.vehicle.update({
                        where: { id: booking.vehicleId },
                        data: { status: client_1.VehicleStatus.AVAILABLE },
                    });
                }
            }
            const updated = await prisma_1.default.rentalBooking.update({
                where: { id },
                data: {
                    status,
                    ...(adminNotes !== undefined && { adminNotes }),
                },
                include: { vehicle: true },
            });
            res.status(200).json({
                success: true,
                message: `Booking ${updated.bookingReference} status updated to ${updated.status}`,
                data: updated,
            });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.BookingsController = BookingsController;
