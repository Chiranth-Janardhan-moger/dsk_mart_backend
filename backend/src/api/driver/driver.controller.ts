import { Response, NextFunction } from 'express';
import { AuthRequest } from '../../middleware/auth';
import { driverService } from './driver.service';

class DriverController {
  async getAssignedOrders(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const orders = await driverService.getAssignedOrders(req.user._id);
      res.json({ orders });
    } catch (error) {
      next(error);
    }
  }

  async getOrderDetails(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const order = await driverService.getOrderDetails(req.params.id!, req.user._id);
      res.json({ order });
    } catch (error) {
      next(error);
    }
  }

  async confirmDelivery(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { paymentMethod, scanned } = req.body;
      const result = await driverService.confirmDelivery(
        req.params.id!,
        req.user._id,
        paymentMethod,
        scanned
      );
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  async validateScan(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { scannedCode } = req.body;
      const result = await driverService.validateScan(req.params.id!, scannedCode);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  async getHistory(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const history = await driverService.getHistory(req.user._id, page, limit);
      res.json(history);
    } catch (error) {
      next(error);
    }
  }

  async getProfile(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const profile = await driverService.getProfile(req.user._id);
      res.json({ profile });
    } catch (error) {
      next(error);
    }
  }

  async updateProfile(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const profile = await driverService.updateProfile(req.user._id, req.body);
      res.json({ profile });
    } catch (error) {
      next(error);
    }
  }

  async getEarnings(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const earnings = await driverService.getEarnings(req.user._id);
      res.json({ earnings });
    } catch (error) {
      next(error);
    }
  }
}

export const driverController = new DriverController();