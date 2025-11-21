import { Response, NextFunction } from 'express';
import { AuthRequest } from '../../middleware/auth';
import { adminService } from './admin.service';

class AdminController {
  async getDashboard(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { period } = req.query;
      const dashboard = await adminService.getDashboard(period as string);
      res.json(dashboard);
    } catch (error) {
      next(error);
    }
  }

  async getOrders(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { status, page, limit } = req.query;
      const orders = await adminService.getOrders(
        status as string,
        parseInt(page as string) || 1,
        parseInt(limit as string) || 20
      );
      res.json(orders);
    } catch (error) {
      next(error);
    }
  }

  async getOrderDetails(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const order = await adminService.getOrderDetails(req.params.id!);
      res.json({ order });
    } catch (error) {
      next(error);
    }
  }

  async assignOrder(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { deliveryBoyId } = req.body;
      const result = await adminService.assignOrder(req.params.id!, deliveryBoyId);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  async getDeliveryBoys(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const deliveryBoys = await adminService.getDeliveryBoys();
      res.json({ deliveryBoys });
    } catch (error) {
      next(error);
    }
  }

  async getLeaderboard(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const leaderboard = await adminService.getLeaderboard();
      res.json({ leaderboard });
    } catch (error) {
      next(error);
    }
  }

  async getRevenue(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { period } = req.query;
      const revenue = await adminService.getRevenue(period as string);
      res.json(revenue);
    } catch (error) {
      next(error);
    }
  }

  async getTransactions(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { page, limit } = req.query;
      const transactions = await adminService.getTransactions(
        parseInt(page as string) || 1,
        parseInt(limit as string) || 20
      );
      res.json(transactions);
    } catch (error) {
      next(error);
    }
  }

  async createDeliveryBoy(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const result = await adminService.createDeliveryBoy(req.body);
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }

  async updateDeliveryBoy(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const result = await adminService.updateDeliveryBoy(req.params.id!, req.body);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  async deleteDeliveryBoy(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const result = await adminService.deleteDeliveryBoy(req.params.id!);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }
}

export const adminController = new AdminController();
