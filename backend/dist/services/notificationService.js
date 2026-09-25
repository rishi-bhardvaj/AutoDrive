"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationService = void 0;
const web_push_1 = __importDefault(require("web-push"));
const prisma_1 = __importDefault(require("../prisma"));
const config_1 = require("../config");
if (config_1.config.vapid.publicKey && config_1.config.vapid.privateKey) {
    web_push_1.default.setVapidDetails(`mailto:${config_1.config.vapid.email}`, config_1.config.vapid.publicKey, config_1.config.vapid.privateKey);
}
class NotificationService {
    static async notifyAdmins(payload) {
        try {
            const subscriptions = await prisma_1.default.notificationSubscription.findMany({
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
                return web_push_1.default.sendNotification(pushConfig, messagePayload).catch(async (err) => {
                    if (err.statusCode === 404 || err.statusCode === 410) {
                        await prisma_1.default.notificationSubscription.delete({ where: { id: sub.id } }).catch(() => { });
                    }
                });
            });
            await Promise.all(pushPromises);
        }
        catch (err) {
            console.error('Push broadcast error:', err);
        }
    }
}
exports.NotificationService = NotificationService;
