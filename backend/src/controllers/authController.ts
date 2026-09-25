import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import prisma from '../prisma';
import { config } from '../config';

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email('Please enter a valid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
  }),
});

export const updatePasswordSchema = z.object({
  body: z.object({
    currentPassword: z.string().min(6),
    newPassword: z.string().min(6),
  }),
});

export class AuthController {
  static async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email, password } = req.body;
      const user = await prisma.adminUser.findUnique({ where: { email: email.toLowerCase() } });

      if (!user) {
        res.status(401).json({ success: false, message: 'Invalid email or password' });
        return;
      }

      const isMatch = await bcrypt.compare(password, user.passwordHash);
      if (!isMatch) {
        res.status(401).json({ success: false, message: 'Invalid email or password' });
        return;
      }

      const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, config.jwtSecret, {
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
    } catch (error) {
      next(error);
    }
  }

  static async getMe(req: any, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = await prisma.adminUser.findUnique({
        where: { id: req.user.id },
        select: { id: true, email: true, name: true, role: true, createdAt: true },
      });

      if (!user) {
        res.status(404).json({ success: false, message: 'User not found' });
        return;
      }

      res.status(200).json({ success: true, data: { user } });
    } catch (error) {
      next(error);
    }
  }

  static async updatePassword(req: any, res: Response, next: NextFunction): Promise<void> {
    try {
      const { currentPassword, newPassword } = req.body;
      const user = await prisma.adminUser.findUnique({ where: { id: req.user.id } });

      if (!user) {
        res.status(404).json({ success: false, message: 'User not found' });
        return;
      }

      const isMatch = await bcrypt.compare(currentPassword, user.passwordHash);
      if (!isMatch) {
        res.status(400).json({ success: false, message: 'Current password is incorrect' });
        return;
      }

      const newPasswordHash = await bcrypt.hash(newPassword, 10);
      await prisma.adminUser.update({
        where: { id: user.id },
        data: { passwordHash: newPasswordHash },
      });

      res.status(200).json({ success: true, message: 'Password updated successfully' });
    } catch (error) {
      next(error);
    }
  }
}