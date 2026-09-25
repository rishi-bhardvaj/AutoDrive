import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { RepairStatus, VehicleStatus } from '@prisma/client';
import prisma from '../prisma';
import { generateReference } from '../utils/referenceGenerator';

export const createRepairSchema = z.object({
  body: z.object({
    vehicleId: z.string().min(1, 'Vehicle is required'),
    issueDescription: z.string().min(5, 'Issue description must be at least 5 characters'),
    estimatedCost: z.number().nonnegative().optional().nullable(),
    startDate: z.string().optional(),
  }),
});

export const updateRepairSchema = z.object({
  body: z.object({
    status: z.nativeEnum(RepairStatus).optional(),
    actualCost: z.number().nonnegative().optional().nullable(),
    endDate: z.string().optional().nullable(),
    notes: z.string().optional().nullable(),
  }),
});

export class RepairsController {
  static async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const repairs = await prisma.repairRecord.findMany({
        include: { vehicle: true },
        orderBy: { startDate: 'desc' },
      });
      res.status(200).json({ success: true, count: repairs.length, data: repairs });
    } catch (error) {
      next(error);
    }
  }

  static async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { vehicleId, issueDescription, estimatedCost, startDate } = req.body;
      const repairReference = generateReference('REP');

      const [repair] = await prisma.$transaction([
        prisma.repairRecord.create({
          data: {
            repairReference,
            vehicleId,
            issueDescription,
            estimatedCost: estimatedCost ? parseFloat(estimatedCost) : null,
            startDate: startDate ? new Date(startDate) : new Date(),
            status: RepairStatus.IN_PROGRESS,
          },
          include: { vehicle: true },
        }),
        prisma.vehicle.update({
          where: { id: vehicleId },
          data: { status: VehicleStatus.UNDER_REPAIR },
        }),
      ]);

      res.status(201).json({ success: true, data: repair });
    } catch (error) {
      next(error);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const { status, actualCost, endDate, notes } = req.body;

      const existing = await prisma.repairRecord.findUnique({ where: { id } });
      if (!existing) {
        res.status(404).json({ success: false, message: 'Repair record not found' });
        return;
      }

      const repair = await prisma.repairRecord.update({
        where: { id },
        data: {
          ...(status && { status }),
          ...(actualCost !== undefined && { actualCost }),
          ...(endDate && { endDate: new Date(endDate) }),
          ...(notes !== undefined && { notes }),
        },
        include: { vehicle: true },
      });

      if (status === RepairStatus.COMPLETED && existing.vehicleId) {
        await prisma.vehicle.update({
          where: { id: existing.vehicleId },
          data: { status: VehicleStatus.AVAILABLE },
        });
      }

      res.status(200).json({ success: true, data: repair });
    } catch (error) {
      next(error);
    }
  }

  static async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      await prisma.repairRecord.delete({ where: { id } });
      res.status(200).json({ success: true, message: 'Repair record deleted' });
    } catch (error) {
      next(error);
    }
  }
}