import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { BookingStatus, VehicleStatus } from '@prisma/client';
import prisma from '../prisma';
import { generateReference, calculateRentalDays } from '../utils/referenceGenerator';
import { NotificationService } from '../services/notificationService';

const phoneRegex = /^(\+91[\s-]?)?[6789]\d{9}$/;

export const createBookingSchema = z.object({
  body: z.object({
    vehicleId: z.string().min(1, 'Vehicle ID is required'),
    customerName: z.string().min(2, 'Customer name is required'),
    customerPhone: z.string().regex(phoneRegex, 'Please enter a valid 10-digit Indian mobile number'),
    customerEmail: z.string().email('Please enter a valid email address').optional().or(z.literal('')),
    pickupDate: z.string().min(1, 'Pickup date is required'),
    returnDate: z.string().min(1, 'Return date is required'),
    pickupLocation: z.string().min(2, 'Pickup location is required'),
    totalDays: z.number().int().positive().optional(),
    estimatedAmount: z.number().positive().optional(),
    securityDeposit: z.number().nonnegative().optional(),
    notes: z.string().optional(),
  }),
});

export const updateBookingStatusSchema = z.object({
  body: z.object({
    status: z.nativeEnum(BookingStatus),
    adminNotes: z.string().optional().nullable(),
  }),
});

export class BookingsController {
  static async createBooking(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = req.body;
      const pickup = new Date(data.pickupDate);
      const drop = new Date(data.returnDate);

      if (drop <= pickup) {
        res.status(400).json({ success: false, message: 'Return date must be after pickup date' });
        return;
      }

      const vehicle = await prisma.vehicle.findUnique({ where: { id: data.vehicleId } });
      if (!vehicle) {
        res.status(404).json({ success: false, message: 'Vehicle not found' });
        return;
      }

      const totalDays = data.totalDays || calculateRentalDays(pickup, drop);
      const estimatedAmount = data.estimatedAmount || totalDays * vehicle.dailyRentalPrice;
      const securityDeposit = data.securityDeposit !== undefined ? data.securityDeposit : vehicle.securityDeposit;

      let bookingReference = generateReference('CR');
      while (await prisma.rentalBooking.findUnique({ where: { bookingReference } })) {
        bookingReference = generateReference('CR');
      }

      const booking = await prisma.rentalBooking.create({
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
          status: BookingStatus.PENDING,
        },
      });

      NotificationService.notifyAdmins({
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
    } catch (error) {
      next(error);
    }
  }

  static async checkAvailability(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { vehicleId, pickupDate, returnDate } = req.query;
      if (!vehicleId || !pickupDate || !returnDate) {
        res.status(400).json({ success: false, message: 'Missing parameters' });
        return;
      }

      const pDate = new Date(pickupDate as string);
      const rDate = new Date(returnDate as string);

      const conflicts = await prisma.rentalBooking.findFirst({
        where: {
          vehicleId: vehicleId as string,
          status: BookingStatus.APPROVED,
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
    } catch (error) {
      next(error);
    }
  }

  static async getAdminBookings(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { status, search } = req.query;
      const where: any = {};

      if (status && Object.values(BookingStatus).includes(status as BookingStatus)) {
        where.status = status as BookingStatus;
      }

      if (search) {
        const query = (search as string).trim();
        where.OR = [
          { bookingReference: { contains: query, mode: 'insensitive' } },
          { customerName: { contains: query, mode: 'insensitive' } },
          { customerPhone: { contains: query, mode: 'insensitive' } },
        ];
      }

      const bookings = await prisma.rentalBooking.findMany({
        where,
        include: { vehicle: true },
        orderBy: { createdAt: 'desc' },
      });

      res.status(200).json({ success: true, count: bookings.length, data: bookings });
    } catch (error) {
      next(error);
    }
  }

  static async updateStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const { status, adminNotes } = req.body;

      const booking = await prisma.rentalBooking.findUnique({
        where: { id },
        include: { vehicle: true },
      });

      if (!booking) {
        res.status(404).json({ success: false, message: 'Booking not found' });
        return;
      }

      if (status === BookingStatus.APPROVED) {
        const conflicting = await prisma.rentalBooking.findFirst({
          where: {
            id: { not: id },
            vehicleId: booking.vehicleId,
            status: BookingStatus.APPROVED,
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

        await prisma.vehicle.update({
          where: { id: booking.vehicleId },
          data: { status: VehicleStatus.BOOKED },
        });
      }

      if (status === BookingStatus.COMPLETED || status === BookingStatus.CANCELLED || status === BookingStatus.REJECTED) {
        const otherActive = await prisma.rentalBooking.findFirst({
          where: {
            id: { not: id },
            vehicleId: booking.vehicleId,
            status: BookingStatus.APPROVED,
          },
        });

        if (!otherActive) {
          await prisma.vehicle.update({
            where: { id: booking.vehicleId },
            data: { status: VehicleStatus.AVAILABLE },
          });
        }
      }

      const updated = await prisma.rentalBooking.update({
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
    } catch (error) {
      next(error);
    }
  }
}