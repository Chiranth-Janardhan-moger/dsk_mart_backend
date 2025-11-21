import { Express } from 'express';
import authRoutes from './api/auth/auth.routes';
import adminRoutes from './api/admin/admin.routes';
import driverRoutes from './api/driver/driver.routes';
import customerRoutes from './api/customer/customer.routes';
import orderRoutes from './api/orders/orders.routes';
import productRoutes from './api/products/products.routes';

export const setupRoutes = (app: Express) => {
  app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  app.use('/api/auth', authRoutes);
  app.use('/api/admin', adminRoutes);
  app.use('/api/driver', driverRoutes);
  app.use('/api/customer', customerRoutes);
  app.use('/api/orders', orderRoutes);
  app.use('/api/products', productRoutes);
};