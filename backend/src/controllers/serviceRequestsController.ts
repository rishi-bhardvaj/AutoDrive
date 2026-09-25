import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { ServiceStatus } from '@prisma/client';
import prisma from '../prisma';
import { generateReference } from '../utils/referenceGenerator';
import { NotificationService } from '../services/notificationService';

const phoneRegex = /^(\+91[\s-]?)?[6789]\d{9}$/;

export const createServiceRequestSchema = z.object({
  body: z.object({
    customerName: z.string().min(2, 'Name is required'),
    customerPhone: z.string().regex(phoneRegex, 'Please enter a valid 10-digit Indian mobile number'),
    customerEmail: z.string().email().optional().or(z.literal('')),
    vehicleDetails: z.string().min(2, 'Vehicle details are required'),
    serviceType: z.string().min(2, 'Service type is required'),
    preferredDate: z.string().optional().nullable(),
    pickupDropRequired: z.boolean().default(false),
    pickupAddress: z.string().optional().nullable(),
    description: z.string().optional().nullable(),
  }),
});

export const updateServiceRequestSchema = z.object({
  body: z.object({
    status: z.nativeEnum(ServiceStatus).optional(),
    estimatedCost: z.number().optional().nullable(),
    adminNotes: z.string().optional().nullable(),
  }),
});

export class ServiceRequestsController {
  static async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = req.body;
      let requestReference = generateReference('SR');
      while (await prisma.serviceRequest.findUnique({ where: { requestReference } })) {
        requestReference = generateReference('SR');
      }

      const serviceRequest = await prisma.serviceRequest.create({
        data: {
          requestReference,
          customerName: data.customerName.trim(),
          customerPhone: data.customerPhone.trim(),
          customerEmail: data.customerEmail?.trim() || null,
          vehicleDetails: data.vehicleDetails.trim(),
          serviceType: data.serviceType,
          preferredDate: data.preferredDate ? new Date(data.preferredDate) : null,
          pickupDropRequired: data.pickupDropRequired || false,
          pickupAddress: data.pickupAddress?.trim() || null,
          description: data.description?.trim() || null,
          status: ServiceStatus.NEW,
        },
      });

      NotificationService.notifyAdmins({
        title: '🔧 New Service Booking Request',
        body: `${data.customerName} booked ${data.serviceType} for ${data.vehicleDetails} [${requestReference}]`,
        data: { url: '/admin/services', type: 'service_request', id: serviceRequest.id },
      });

      res.status(201).json({
        success: true,
        message: 'Service appointment request received.',
        data: {
          id: serviceRequest.id,
          requestReference: serviceRequest.requestReference,
          customerName: serviceRequest.customerName,
          vehicleDetails: serviceRequest.vehicleDetails,
          serviceType: serviceRequest.serviceType,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  static async getAllAdmin(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const requests = await prisma.serviceRequest.findMany({
        orderBy: { createdAt: 'desc' },
      });
      res.status(200).json({ success: true, count: requests.length, data: requests });
    } catch (error) {
      next(error);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const data = req.body;

      const updated = await prisma.serviceRequest.update({
        where: { id },
        data,
      });

      res.status(200).json({ success: true, data: updated });
    } catch (error) {
      next(error);
    }
  }
}