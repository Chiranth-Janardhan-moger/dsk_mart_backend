import mongoose from 'mongoose';
import { logger } from '../utils/logger';
import dotenv from "dotenv";
dotenv.config();

export const connectDatabase = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/meetmart';
    
    await mongoose.connect(mongoUri);
    
    logger.info('✅ MongoDB connected successfully');
  } catch (error) {
    logger.error('❌ MongoDB connection failed:', error);
    process.exit(1);
  }
};