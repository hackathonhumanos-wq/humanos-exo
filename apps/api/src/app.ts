import express, { type Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { apiRouter } from './routes/index.ts';
import { errorHandler, notFoundHandler } from './middleware/errorMiddleware.ts';
import { config } from './config/environment.ts';

export function createApp(): Application {
  const app = express();

  // 1. Security Headers
  app.use(
    helmet({
      contentSecurityPolicy: false, // Allows flexible integration in dev and extension
      crossOriginEmbedderPolicy: false,
    })
  );

  // 2. Cross-Origin Resource Sharing
  app.use(
    cors({
      origin: [config.webOrigin, 'chrome-extension://*'],
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    })
  );

  // 3. Body Parsing
  app.use(express.json({ limit: '1mb' }));
  app.use(express.urlencoded({ extended: true, limit: '1mb' }));

  // 4. API Endpoints
  app.use('/api', apiRouter);

  // 5. Fallback & Centralized Error Handlers
  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
