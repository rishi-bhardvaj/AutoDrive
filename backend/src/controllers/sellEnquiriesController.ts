import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { FuelType, SellEnquiryStatus } from '@prisma/client';
import prisma from '../prisma';
import { generateReference } from '../utils/referenceGenerator';
import { NotificationService } from '../services/notificationService';

const phoneRegex = /^(\+91[\s-]?)?[6789]\d{9}$/;

export const createSellEnquirySchema = z.object({
  body: z.object({
    customerName: z.string().min(2, 'Name is required'),
    customerPhone: z.string().regex(phoneRegex, 'Please enter a valid 10-digit Indian mobile number'),
    customerEmail: z.string().email('Please enter a valid email').optional().or(z.literal('')),
    carMakeModel: z.string().min(3, 'Car make & model is required'),
    registrationYear: z.number().int().min(2000).max(2030),
    registrationState: z.string().optional().nullable(),
    kilometres: z.number().int().nonnegative(),
    fuelType: z.nativeEnum(FuelType),
    expectedPrice: z.number().positive('Expected price must be positive'),
    description: z.string().optional().nullable(),
    photos: z.array(z.string().url()).optional().default([]),
  }),
});

export const updateSellEnquirySchema = z.object({
  body: z.object({
    status: z.nativeEnum(SellEnquiryStatus).optional(),
    adminNotes: z.string().optional().nullable(),
  }),
});

export class SellEnquiriesController {
  static async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = req.body;
      let enquiryReference = generateReference('SEL');
      while (await prisma.sellEnquiry.findUnique({ where: { enquiryReference } })) {
        enquiryReference = generateReference('SEL');
      }

      const enquiry = await prisma.sellEnquiry.create({
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
          status: SellEnquiryStatus.NEW,
        },
      });

      NotificationService.notifyAdmins({
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
    } catch (error) {
      next(error);
    }
  }

  static async getAllAdmin(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { status, search } = req.query;
      const where: any = {};

      if (status && Object.values(SellEnquiryStatus).includes(status as SellEnquiryStatus)) {
        where.status = status as SellEnquiryStatus;
      }

      if (search) {
        const query = (search as string).trim();
        where.OR = [
          { enquiryReference: { contains: query, mode: 'insensitive' } },
          { customerName: { contains: query, mode: 'insensitive' } },
          { carMakeModel: { contains: query, mode: 'insensitive' } },
        ];
      }

      const enquiries = await prisma.sellEnquiry.findMany({
        where,
        orderBy: { createdAt: 'desc' },
      });

      res.status(200).json({ success: true, count: enquiries.length, data: enquiries });
    } catch (error) {
      next(error);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const data = req.body;

      const updated = await prisma.sellEnquiry.update({
        where: { id },
        data,
      });

      res.status(200).json({
        success: true,
        message: 'Sell enquiry ' + updated.enquiryReference + ' updated successfully.',
        data: updated,
      });
    } catch (error) {
      next(error);
    }
  }
}
