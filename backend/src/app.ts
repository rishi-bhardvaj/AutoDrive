import express from 'express';
import cors from 'cors';
import apiRouter from './routes';
import { errorHandler } from './middleware/errorHandler';

const app = express();

app.use(cors({
  origin: '*',
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Root health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// Mount /api
app.use('/api', apiRouter);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` });
});

// Central Error handler
app.use(errorHandler);

export default app;