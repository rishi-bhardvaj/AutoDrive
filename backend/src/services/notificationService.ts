import webpush from 'web-push';
import prisma from '../prisma';
import { config } from '../config';

if (config.vapid.publicKey && config.vapid.privateKey) {
  webpush.setVapidDetails(
    `mailto:${config.vapid.email}`,
    config.vapid.publicKey,
    config.vapid.privateKey
  );
}

export class NotificationService {
  static async notifyAdmins(payload: { title: string; body: string; data?: any }): Promise<void> {
    try {
      const subscriptions = await prisma.notificationSubscription.findMany({
        where: { userRole: 'admin' },
      });

      const messagePayload = JSON.stringify({
        title: payload.title,
        body: payload.body,
        data: payload.data || {},
        timestamp: new Date().toISOString(),
      });

      const pushPromises = subscriptions.map((sub) => {
        const pushConfig = {
          endpoint: sub.endpoint,
          keys: {
            p256dh: sub.p256dh,
            auth: sub.auth,
          },
        };

        return webpush.sendNotification(pushConfig, messagePayload).catch(async (err) => {
          if (err.statusCode === 404 || err.statusCode === 410) {
            await prisma.notificationSubscription.delete({ where: { id: sub.id } }).catch(() => {});
          }
        });
      });

      await Promise.all(pushPromises);
    } catch (err) {
      console.error('Push broadcast error:', err);
    }
  }
}