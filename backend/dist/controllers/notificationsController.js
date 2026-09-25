"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationsController = exports.subscribeSchema = void 0;
const zod_1 = require("zod");
const prisma_1 = __importDefault(require("../prisma"));
const config_1 = require("../config");
const notificationService_1 = require("../services/notificationService");
exports.subscribeSchema = zod_1.z.object({
    body: zod_1.z.object({
        endpoint: zod_1.z.string().url('Invalid endpoint URL'),
        keys: zod_1.z.object({
            p256dh: zod_1.z.string().min(1, 'p256dh key is required'),
            auth: zod_1.z.string().min(1, 'auth key is required'),
        }),
        role: zod_1.z.string().default('admin'),
    }),
});
class NotificationsController {
    static async getPublicKey(req, res) {
        res.status(200).json({
            success: true,
            data: { publicKey: config_1.config.vapid.publicKey },
        });
    }
    static async subscribe(req, res, next) {
        try {
            const { endpoint, keys, role } = req.body;
            const userAgent = req.headers['user-agent'] || 'Unknown Browser';
            const subscription = await prisma_1.default.notificationSubscription.upsert({
                where: { endpoint },
                update: { p256dh: keys.p256dh, auth: keys.auth, userRole: role || 'admin' },
                create: { endpoint, p256dh: keys.p256dh, auth: keys.auth, userRole: role || 'admin' },
            });
            res.status(200).json({
                success: true,
                message: 'Push notification subscription registered successfully.',
                data: subscription,
            });
        }
        catch (error) {
            next(error);
        }
    }
    static async testBroadcast(req, res, next) {
        try {
            await notificationService_1.NotificationService.notifyAdmins({
                title: '🔔 Test Notification System',
                body: 'Web Push notifications are connected and working properly for your car business!',
                data: { url: '/admin' },
            });
            res.status(200).json({ success: true, message: 'Test notification triggered.' });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.NotificationsController = NotificationsController;
