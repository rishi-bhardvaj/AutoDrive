"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardController = void 0;
const client_1 = require("@prisma/client");
const prisma_1 = __importDefault(require("../prisma"));
class DashboardController {
    static async getStats(req, res, next) {
        try {
            const totalRentalCars = await prisma_1.default.vehicle.count();
            const availableCars = await prisma_1.default.vehicle.count({ where: { status: client_1.VehicleStatus.AVAILABLE } });
            const bookedCars = await prisma_1.default.vehicle.count({ where: { status: client_1.VehicleStatus.BOOKED } });
            const rentedCars = await prisma_1.default.vehicle.count({ where: { status: client_1.VehicleStatus.RENTED } });
            const underRepairCars = await prisma_1.default.vehicle.count({ where: { status: client_1.VehicleStatus.UNDER_REPAIR } });
            const pendingBookings = await prisma_1.default.rentalBooking.count({ where: { status: client_1.BookingStatus.PENDING } });
            const approvedBookings = await prisma_1.default.rentalBooking.count({ where: { status: client_1.BookingStatus.APPROVED } });
            const completedBookings = await prisma_1.default.rentalBooking.count({ where: { status: client_1.BookingStatus.COMPLETED } });
            const newServiceRequests = await prisma_1.default.serviceRequest.count({ where: { status: client_1.ServiceStatus.NEW } });
            const inProgressServices = await prisma_1.default.serviceRequest.count({ where: { status: { in: [client_1.ServiceStatus.SCHEDULED, client_1.ServiceStatus.IN_PROGRESS] } } });
            const availableCarsForSale = await prisma_1.default.saleVehicle.count({ where: { status: client_1.SaleVehicleStatus.AVAILABLE } });
            const newBuyEnquiries = await prisma_1.default.purchaseEnquiry.count({ where: { status: client_1.PurchaseEnquiryStatus.NEW } });
            const newSellEnquiries = await prisma_1.default.sellEnquiry.count({ where: { status: client_1.SellEnquiryStatus.NEW } });
            const openRepairs = await prisma_1.default.repairRecord.count({ where: { status: { in: [client_1.RepairStatus.OPEN, client_1.RepairStatus.IN_PROGRESS] } } });
            const recentBookings = await prisma_1.default.rentalBooking.findMany({
                take: 6,
                orderBy: { createdAt: 'desc' },
                include: { vehicle: true },
            });
            const recentServices = await prisma_1.default.serviceRequest.findMany({
                take: 3,
                orderBy: { createdAt: 'desc' },
            });
            const recentSellEnquiries = await prisma_1.default.sellEnquiry.findMany({
                take: 3,
                orderBy: { createdAt: 'desc' },
            });
            const recentBuyEnquiries = await prisma_1.default.purchaseEnquiry.findMany({
                take: 3,
                orderBy: { createdAt: 'desc' },
                include: { saleVehicle: true },
            });
            const activeFleetRepairs = await prisma_1.default.repairRecord.findMany({
                where: { status: { in: [client_1.RepairStatus.OPEN, client_1.RepairStatus.IN_PROGRESS] } },
                take: 4,
                orderBy: { startDate: 'desc' },
            });
            res.status(200).json({
                success: true,
                data: {
                    overview: {
                        totalRentalCars,
                        availableCars,
                        currentlyRented: bookedCars + rentedCars,
                        underRepair: underRepairCars,
                        pendingBookings,
                        approvedBookings,
                        completedBookings,
                        newServiceRequests,
                        inProgressServices,
                        availableCarsForSale,
                        newBuyEnquiries,
                        newSellEnquiries,
                        openRepairs,
                    },
                    recentBookings,
                    recentServices,
                    recentSellEnquiries,
                    recentBuyEnquiries,
                    activeFleetRepairs,
                },
            });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.DashboardController = DashboardController;
