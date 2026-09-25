import { Request, Response, NextFunction } from 'express';
import { BookingStatus, ServiceStatus, RepairStatus, VehicleStatus, SaleVehicleStatus, PurchaseEnquiryStatus, SellEnquiryStatus } from '@prisma/client';
import prisma from '../prisma';

export class DashboardController {
  static async getStats(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const totalRentalCars = await prisma.vehicle.count();
      const availableCars = await prisma.vehicle.count({ where: { status: VehicleStatus.AVAILABLE } });
      const bookedCars = await prisma.vehicle.count({ where: { status: VehicleStatus.BOOKED } });
      const rentedCars = await prisma.vehicle.count({ where: { status: VehicleStatus.RENTED } });
      const underRepairCars = await prisma.vehicle.count({ where: { status: VehicleStatus.UNDER_REPAIR } });

      const pendingBookings = await prisma.rentalBooking.count({ where: { status: BookingStatus.PENDING } });
      const approvedBookings = await prisma.rentalBooking.count({ where: { status: BookingStatus.APPROVED } });
      const completedBookings = await prisma.rentalBooking.count({ where: { status: BookingStatus.COMPLETED } });

      const newServiceRequests = await prisma.serviceRequest.count({ where: { status: ServiceStatus.NEW } });
      const inProgressServices = await prisma.serviceRequest.count({ where: { status: { in: [ServiceStatus.SCHEDULED, ServiceStatus.IN_PROGRESS] } } });

      const availableCarsForSale = await prisma.saleVehicle.count({ where: { status: SaleVehicleStatus.AVAILABLE } });
      const newBuyEnquiries = await prisma.purchaseEnquiry.count({ where: { status: PurchaseEnquiryStatus.NEW } });
      const newSellEnquiries = await prisma.sellEnquiry.count({ where: { status: SellEnquiryStatus.NEW } });

      const openRepairs = await prisma.repairRecord.count({ where: { status: { in: [RepairStatus.OPEN, RepairStatus.IN_PROGRESS] } } });

      const recentBookings = await prisma.rentalBooking.findMany({
        take: 6,
        orderBy: { createdAt: 'desc' },
        include: { vehicle: true },
      });

      const recentServices = await prisma.serviceRequest.findMany({
        take: 3,
        orderBy: { createdAt: 'desc' },
      });

      const recentSellEnquiries = await prisma.sellEnquiry.findMany({
        take: 3,
        orderBy: { createdAt: 'desc' },
      });

      const recentBuyEnquiries = await prisma.purchaseEnquiry.findMany({
        take: 3,
        orderBy: { createdAt: 'desc' },
        include: { saleVehicle: true },
      });

      const activeFleetRepairs = await prisma.repairRecord.findMany({
        where: { status: { in: [RepairStatus.OPEN, RepairStatus.IN_PROGRESS] } },
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
    } catch (error) {
      next(error);
    }
  }
}