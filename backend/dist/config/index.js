"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.config = {
    env: process.env.NODE_ENV || 'development',
    port: parseInt(process.env.PORT || '5000', 10),
    jwtSecret: process.env.JWT_SECRET || 'carzz-super-secret-jwt-key-2026-production',
    jwtExpiresIn: '7d',
    vapid: {
        publicKey: process.env.VAPID_PUBLIC_KEY || 'BEl62iUYgUivxIkv69yViEuiBIa-Ib9-SkvMeAtA3LFgDzkrxZJjSgSnfckjBJuBkr3qBUYIHBQFLXYp5Nksh8U',
        privateKey: process.env.VAPID_PRIVATE_KEY || 'UUxI2qFj_Nf9vX-J_gZz3pQvY0MvE5XvB-Z7fX9z8sM',
        email: process.env.VAPID_EMAIL || 'admin@autodrivecars.in',
    },
    business: {
        name: 'AutoDrive Rentals & Services',
        ownerName: 'Rajinder Singh',
        phone: '+91 98112 34567',
        whatsappNumber: '919811234567',
        email: 'contact@autodrivecars.in',
        address: 'Plot 42, Auto Hub Complex, Sector 63, Noida, Uttar Pradesh 201301',
        googleMapsUrl: 'https://maps.google.com/?q=Sector+63+Noida+Uttar+Pradesh',
    },
};
