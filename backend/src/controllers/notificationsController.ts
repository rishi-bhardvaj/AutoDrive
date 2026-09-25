import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import prisma from '../prisma';
import { config } from '../config';
import { NotificationService } from '../services/notificationService';

export const subscribeSchema = z.object({
  body: z.object({
    endpoint: z.string().url('Invalid endpoint URL'),
    keys: z.object({
      p256dh: z.string().min(1, 'p256dh key is required'),
      auth: z.string().min(1, 'auth key is required'),
    }),
    role: z.string().default('admin'),
  }),
});

export class NotificationsController {
  static async getPublicKey(req: Request, res: Response): Promise<void> {
    res.status(200).json({
      success: true,
      data: { publicKey: config.vapid.publicKey },
    });
  }

  static async subscribe(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { endpoint, keys, role } = req.body;
      const userAgent = req.headers['user-agent'] || 'Unknown Browser';

      const subscription = await prisma.notificationSubscription.upsert({
        where: { endpoint },
        update: { p256dh: keys.p256dh, auth: keys.auth, role: role || 'admin', userAgent },
        create: { endpoint, p256dh: keys.p256dh, auth: keys.auth, role: role || 'admin', userAgent },
      });

      res.status(200).json({
        success: true,
        message: 'Push notification subscription registered successfully.',
        data: subscription,
      });
    } catch (error) {
      next(error);
    }
  }

  static async testBroadcast(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await NotificationService.notifyAdmins({
        title: '🔔 Test Notification System',
        body: 'Web Push notifications are connected and working properly for your car business!',
        data: { url: '/admin' },
      });

      res.status(200).json({ success: true, message: 'Test notification triggered.' });
    } catch (error) {
      next(error);
    }
  }
}
