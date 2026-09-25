"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const config_1 = require("./config");
const server = app_1.default.listen(config_1.config.port, () => {
    console.log(`🚀 Backend running on http://localhost:${config_1.config.port} [Environment: ${config_1.config.env}]`);
});
process.on('SIGTERM', () => {
    console.log('SIGTERM signal received. Closing HTTP server.');
    server.close(() => console.log('HTTP server closed.'));
});
exports.default = server;
