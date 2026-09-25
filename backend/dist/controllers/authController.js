"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = exports.updatePasswordSchema = exports.loginSchema = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const zod_1 = require("zod");
const prisma_1 = __importDefault(require("../prisma"));
const config_1 = require("../config");
exports.loginSchema = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z.string().email('Please enter a valid email address'),
        password: zod_1.z.string().min(6, 'Password must be at least 6 characters'),
    }),
});
exports.updatePasswordSchema = zod_1.z.object({
    body: zod_1.z.object({
        currentPassword: zod_1.z.string().min(6),
        newPassword: zod_1.z.string().min(6),
    }),
});
class AuthController {
    static async login(req, res, next) {
        try {
            const { email, password } = req.body;
            const user = await prisma_1.default.adminUser.findUnique({ where: { email: email.toLowerCase() } });
            if (!user) {
                res.status(401).json({ success: false, message: 'Invalid email or password' });
                return;
            }
            const isMatch = await bcryptjs_1.default.compare(password, user.passwordHash);
            if (!isMatch) {
                res.status(401).json({ success: false, message: 'Invalid email or password' });
                return;
            }
            const token = jsonwebtoken_1.default.sign({ id: user.id, email: user.email, role: user.role }, config_1.config.jwtSecret, {
                expiresIn: '7d',
            });
            res.status(200).json({
                success: true,
                message: 'Login successful',
                data: {
                    token,
                    user: { id: user.id, email: user.email, name: user.name, role: user.role },
                },
            });
        }
        catch (error) {
            next(error);
        }
    }
    static async getMe(req, res, next) {
        try {
            const user = await prisma_1.default.adminUser.findUnique({
                where: { id: req.user.id },
                select: { id: true, email: true, name: true, role: true, createdAt: true },
            });
            if (!user) {
                res.status(404).json({ success: false, message: 'User not found' });
                return;
            }
            res.status(200).json({ success: true, data: { user } });
        }
        catch (error) {
            next(error);
        }
    }
    static async updatePassword(req, res, next) {
        try {
            const { currentPassword, newPassword } = req.body;
            const user = await prisma_1.default.adminUser.findUnique({ where: { id: req.user.id } });
            if (!user) {
                res.status(404).json({ success: false, message: 'User not found' });
                return;
            }
            const isMatch = await bcryptjs_1.default.compare(currentPassword, user.passwordHash);
            if (!isMatch) {
                res.status(400).json({ success: false, message: 'Current password is incorrect' });
                return;
            }
            const newPasswordHash = await bcryptjs_1.default.hash(newPassword, 10);
            await prisma_1.default.adminUser.update({
                where: { id: user.id },
                data: { passwordHash: newPasswordHash },
            });
            res.status(200).json({ success: true, message: 'Password updated successfully' });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.AuthController = AuthController;
