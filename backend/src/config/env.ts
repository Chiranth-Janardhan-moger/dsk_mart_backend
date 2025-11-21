const JWT_SECRET = process.env.JWT_SECRET;

if (process.env.NODE_ENV !== 'development' && !JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is required for security');
}

interface EnvConfig {
  PORT: string | number;
  MONGODB_URI: string;
  JWT_SECRET: string;
  JWT_EXPIRES_IN: '7d' | '1h' | '30d' | '24h';  // Use literal types
  NODE_ENV: string;
  CORS_ORIGIN: string;
}

export const ENV: EnvConfig = {
  PORT: process.env.PORT || 4000,
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/meetmart',
  JWT_SECRET: JWT_SECRET || 'your_jwt_secret_key',
  JWT_EXPIRES_IN: (process.env.JWT_EXPIRES_IN as '7d') || '7d',
  NODE_ENV: process.env.NODE_ENV || 'development',
  CORS_ORIGIN: process.env.CORS_ORIGIN || '*',
};