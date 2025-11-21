import { Response, NextFunction } from 'express';
import { AuthRequest } from '../../middleware/auth';
import { customerService } from './customer.service';
import { orderSchema } from '../../utils/validators';
import { ValidationError } from '../../utils/errors';

class CustomerController {
  async getProducts(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const products = await customerService.getProducts();
      res.json({ products });
    } catch (error) {
      next(error);
    }
  }

  async getProduct(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const product = await customerService.getProduct(req.params.id!);
      res.json({ product });
    } catch (error) {
      next(error);
    }
  }

  async createOrder(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { error, value } = orderSchema.validate(req.body);
      if (error) throw new ValidationError(error.message);

      const order = await customerService.createOrder(req.user._id, value);
      res.status(201).json({ order });
    } catch (error) {
      next(error);
    }
  }

  async getOrders(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const orders = await customerService.getOrders(req.user._id);
      res.json({ orders });
    } catch (error) {
      next(error);
    }
  }

  async getOrderDetails(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const order = await customerService.getOrderDetails(req.params.id!, req.user._id);
      res.json({ order });
    } catch (error) {
      next(error);
    }
  }

  async trackOrder(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const tracking = await customerService.trackOrder(req.params.id!, req.user._id);
      res.json(tracking);
    } catch (error) {
      next(error);
    }
  }

  async createAddress(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const address = await customerService.createAddress(req.user._id, req.body);
      res.status(201).json({ address });
    } catch (error) {
      next(error);
    }
  }

  async getAddresses(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const addresses = await customerService.getAddresses(req.user._id);
      res.json({ addresses });
    } catch (error) {
      next(error);
    }
  }

  async updateAddress(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const address = await customerService.updateAddress(
        req.user._id,
        req.params.id!,
        req.body
      );
      res.json({ address });
    } catch (error) {
      next(error);
    }
  }

  async deleteAddress(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      await customerService.deleteAddress(req.user._id, req.params.id!);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}

export const customerController = new CustomerController();
