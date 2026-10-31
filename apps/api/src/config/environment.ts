import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || '4000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  webOrigin: process.env.WEB_ORIGIN || 'http://localhost:3000',
  databaseUrl: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/focusflow?schema=public',
  jwt: {
    accessSecret: process.env.JWT_ACCESS_SECRET || 'focusflow-access-secret-placeholder-min-32-chars',
    refreshSecret: process.env.JWT_REFRESH_SECRET || 'focusflow-refresh-secret-placeholder-min-32-chars',
    accessExpiry: process.env.JWT_ACCESS_EXPIRY || '15m',
    refreshExpiry: process.env.JWT_REFRESH_EXPIRY || '7d',
  },
  ai: {
    provider: process.env.AI_PROVIDER || 'gemini',
    apiKey: process.env.AI_API_KEY || process.env.GEMINI_API_KEY || '',
  },
};
