import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { FuelType, Transmission, SaleVehicleStatus, PurchaseEnquiryStatus } from '@prisma/client';
import prisma from '../prisma';
import { slugify } from '../utils/referenceGenerator';
import { NotificationService } from '../services/notificationService';

const phoneRegex = /^(\+91[\s-]?)?[6789]\d{9}$/;

export const createSaleVehicleSchema = z.object({
  body: z.object({
    brand: z.string().min(1, 'Brand is required'),
    model: z.string().min(1, 'Model is required'),
    year: z.number().int().min(2000).max(2030),
    registrationYear: z.number().int().min(2000).max(2030),
    kilometres: z.number().int().nonnegative(),
    fuelType: z.nativeEnum(FuelType),
    transmission: z.nativeEnum(Transmission),
    ownership: z.number().int().min(1).max(5).default(1),
    price: z.number().positive('Price must be positive'),
    location: z.string().default('Delhi NCR'),
    insuranceValidity: z.string().optional().nullable(),
    description: z.string().min(10, 'Description must be at least 10 characters'),
    features: z.array(z.string()).default([]),
    images: z.array(z.string().url()).min(1, 'At least one valid image is required'),
    status: z.nativeEnum(SaleVehicleStatus).default(SaleVehicleStatus.AVAILABLE),
  }),
});

export const purchaseEnquirySchema = z.object({
  body: z.object({
    saleVehicleId: z.string().min(1, 'Vehicle ID is required'),
    customerName: z.string().min(2, 'Name is required'),
    customerPhone: z.string().regex(phoneRegex, 'Please enter a valid 10-digit Indian mobile number'),
    customerEmail: z.string().email('Please enter a valid email').optional().or(z.literal('')),
    message: z.string().optional(),
    offeredPrice: z.number().positive().optional().nullable(),
  }),
});

export class SaleVehiclesController {
  static async getAllPublic(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { fuel, transmission, minPrice, maxPrice, search } = req.query;
      const where: any = { status: { in: [SaleVehicleStatus.AVAILABLE, SaleVehicleStatus.BOOKED] } };

      if (fuel && Object.values(FuelType).includes(fuel as FuelType)) where.fuelType = fuel as FuelType;
      if (transmission && Object.values(Transmission).includes(transmission as Transmission)) where.transmission = transmission as Transmission;

      if (minPrice || maxPrice) {
        where.price = {};
        if (minPrice) where.price.gte = parseFloat(minPrice as string);
        if (maxPrice) where.price.lte = parseFloat(maxPrice as string);
      }

      if (search) {
        const query = (search as string).trim();
        where.OR = [
          { brand: { contains: query, mode: 'insensitive' } },
          { model: { contains: query, mode: 'insensitive' } },
        ];
      }

      const cars = await prisma.saleVehicle.findMany({
        where,
        orderBy: { createdAt: 'desc' },
      });

      res.status(200).json({ success: true, count: cars.length, data: cars });
    } catch (error) {
      next(error);
    }
  }

  static async getBySlugOrId(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { identifier } = req.params;
      const car = await prisma.saleVehicle.findFirst({
        where: { OR: [{ id: identifier }, { slug: identifier }] },
      });

      if (!car) {
        res.status(404).json({ success: false, message: 'Vehicle for sale not found' });
        return;
      }

      res.status(200).json({ success: true, data: car });
    } catch (error) {
      next(error);
    }
  }

  static async submitPurchaseEnquiry(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { saleVehicleId, customerName, customerPhone, customerEmail, message, offeredPrice } = req.body;

      const saleVehicle = await prisma.saleVehicle.findUnique({ where: { id: saleVehicleId } });
      if (!saleVehicle) {
        res.status(404).json({ success: false, message: 'Vehicle not found' });
        return;
      }

      const enquiry = await prisma.purchaseEnquiry.create({
        data: {
          saleVehicleId,
          customerName: customerName.trim(),
          customerPhone: customerPhone.trim(),
          customerEmail: customerEmail?.trim() || null,
          message: message?.trim() || null,
          offeredPrice: offeredPrice || null,
          status: PurchaseEnquiryStatus.NEW,
        },
      });

      NotificationService.notifyAdmins({
        title: '💰 New Buy-Car Enquiry',
        body: customerName + ' enquired about ' + saleVehicle.brand + ' ' + saleVehicle.model,
        data: { url: '/admin/buy-sell', type: 'purchase_enquiry', id: enquiry.id },
      });

      res.status(201).json({ success: true, message: 'Enquiry submitted successfully.', data: enquiry });
    } catch (error) {
      next(error);
    }
  }

  static async getAllAdmin(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const cars = await prisma.saleVehicle.findMany({
        include: { _count: { select: { enquiries: true } } },
        orderBy: { createdAt: 'desc' },
      });

      res.status(200).json({ success: true, count: cars.length, data: cars });
    } catch (error) {
      next(error);
    }
  }

  static async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = req.body;
      let baseSlug = slugify(data.brand + '-' + data.model + '-' + data.year + '-sale');
      
      let slug = baseSlug;
      let count = 1;
      while (await prisma.saleVehicle.findUnique({ where: { slug } })) {
        slug = baseSlug + '-' + count;
        count++;
      }

      const car = await prisma.saleVehicle.create({
        data: { ...data, slug },
      });

      res.status(201).json({ success: true, message: 'Car listed successfully', data: car });
    } catch (error) {
      next(error);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const data = req.body;

      const updated = await prisma.saleVehicle.update({
        where: { id },
        data,
      });

      res.status(200).json({ success: true, message: 'Vehicle updated successfully', data: updated });
    } catch (error) {
      next(error);
    }
  }

  static async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      await prisma.purchaseEnquiry.deleteMany({ where: { saleVehicleId: id } });
      await prisma.saleVehicle.delete({ where: { id } });
      res.status(200).json({ success: true, message: 'Vehicle removed from sale listings' });
    } catch (error) {
      next(error);
    }
  }

  static async getEnquiries(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const enquiries = await prisma.purchaseEnquiry.findMany({
        include: { saleVehicle: true },
        orderBy: { createdAt: 'desc' },
      });

      res.status(200).json({ success: true, count: enquiries.length, data: enquiries });
    } catch (error) {
      next(error);
    }
  }

  static async updateEnquiryStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const { status, adminNotes } = req.body;

      const updated = await prisma.purchaseEnquiry.update({
        where: { id },
        data: { status, adminNotes },
      });

      res.status(200).json({ success: true, message: 'Enquiry updated successfully', data: updated });
    } catch (error) {
      next(error);
    }
  }
}
