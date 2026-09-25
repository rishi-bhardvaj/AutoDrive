import app from './app';
import { config } from './config';

const server = app.listen(config.port, () => {
  console.log(`🚀 Backend running on http://localhost:${config.port} [Environment: ${config.env}]`);
});

process.on('SIGTERM', () => {
  console.log('SIGTERM signal received. Closing HTTP server.');
  server.close(() => console.log('HTTP server closed.'));
});

export default server;