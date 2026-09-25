import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { FuelType, Transmission, VehicleStatus } from '@prisma/client';
import prisma from '../prisma';
import { slugify } from '../utils/referenceGenerator';

export const vehicleCreateSchema = z.object({
  body: z.object({
    brand: z.string().min(1, 'Brand is required'),
    model: z.string().min(1, 'Model is required'),
    registrationNumber: z.string().min(4, 'Registration number is required'),
    year: z.number().int().min(2010).max(2030),
    fuelType: z.nativeEnum(FuelType),
    transmission: z.nativeEnum(Transmission),
    seats: z.number().int().min(2).max(20),
    dailyRentalPrice: z.number().positive('Daily rate must be positive'),
    securityDeposit: z.number().nonnegative('Security deposit cannot be negative'),
    description: z.string().optional().nullable(),
    features: z.array(z.string()).default([]),
    images: z.array(z.string()).default([]),
    status: z.nativeEnum(VehicleStatus).default(VehicleStatus.AVAILABLE),
    isFeatured: z.boolean().default(false),
  }),
});

export const vehicleUpdateSchema = z.object({
  body: vehicleCreateSchema.shape.body.partial(),
});

export class VehiclesController {
  static async getAllPublic(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { fuel, transmission, seats, minPrice, maxPrice, search, isFeatured } = req.query;
      const where: any = {
        status: { in: [VehicleStatus.AVAILABLE, VehicleStatus.BOOKED] },
      };

      if (fuel && Object.values(FuelType).includes(fuel as FuelType)) where.fuelType = fuel as FuelType;
      if (transmission && Object.values(Transmission).includes(transmission as Transmission)) where.transmission = transmission as Transmission;
      if (seats) where.seats = parseInt(seats as string, 10);
      if (isFeatured === 'true') where.isFeatured = true;

      if (search) {
        const q = (search as string).trim();
        where.OR = [
          { brand: { contains: q, mode: 'insensitive' } },
          { model: { contains: q, mode: 'insensitive' } },
        ];
      }

      const vehicles = await prisma.vehicle.findMany({
        where,
        orderBy: [{ isFeatured: 'desc' }, { dailyRentalPrice: 'asc' }],
      });

      res.status(200).json({ success: true, count: vehicles.length, data: vehicles });
    } catch (error) {
      next(error);
    }
  }

  static async getBySlugOrId(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { identifier } = req.params;
      const vehicle = await prisma.vehicle.findFirst({
        where: {
          OR: [{ id: identifier }, { slug: identifier }],
        },
      });

      if (!vehicle) {
        res.status(404).json({ success: false, message: 'Vehicle not found' });
        return;
      }

      res.status(200).json({ success: true, data: vehicle });
    } catch (error) {
      next(error);
    }
  }

  static async getAdminVehicles(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const vehicles = await prisma.vehicle.findMany({
        orderBy: { createdAt: 'desc' },
      });
      res.status(200).json({ success: true, count: vehicles.length, data: vehicles });
    } catch (error) {
      next(error);
    }
  }

  static async createVehicle(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = req.body;
      const slug = slugify(`${data.brand}-${data.model}-${data.year}-${Math.floor(100 + Math.random() * 900)}`);

      const vehicle = await prisma.vehicle.create({
        data: {
          ...data,
          slug,
        },
      });

      res.status(201).json({ success: true, data: vehicle });
    } catch (error) {
      next(error);
    }
  }

  static async updateVehicle(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const data = req.body;

      const vehicle = await prisma.vehicle.update({
        where: { id },
        data,
      });

      res.status(200).json({ success: true, data: vehicle });
    } catch (error) {
      next(error);
    }
  }

  static async updateStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const { status } = req.body;

      const vehicle = await prisma.vehicle.update({
        where: { id },
        data: { status },
      });

      res.status(200).json({ success: true, data: vehicle });
    } catch (error) {
      next(error);
    }
  }

  static async deleteVehicle(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      await prisma.vehicle.delete({ where: { id } });
      res.status(200).json({ success: true, message: 'Vehicle removed from fleet' });
    } catch (error) {
      next(error);
    }
  }
}