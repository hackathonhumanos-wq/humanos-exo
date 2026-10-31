import { createApp } from './app.ts';
import { config } from './config/environment.ts';

const app = createApp();

if (process.env.NODE_ENV !== 'test') {
  app.listen(config.port, '0.0.0.0', () => {
    console.log(`[FOCUSFLOW API] Backend running at http://0.0.0.0:${config.port}`);
    console.log(`[FOCUSFLOW API] Health endpoint available at http://localhost:${config.port}/api/v1/health`);
  });
}

export default app;
