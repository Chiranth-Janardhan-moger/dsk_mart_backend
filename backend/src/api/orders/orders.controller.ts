import { Response, NextFunction } from 'express';
import { AuthRequest } from '../../middleware/auth';
import { Order } from '../../models/Order';
import { NotFoundError, UnauthorizedError } from '../../utils/errors';

class OrderController {
  async getOrder(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const order = await Order.findById(req.params.id)
        .populate('customerId', 'name phone')
        .populate('deliveryBoyId', 'name phone')
        .populate('deliveryAddress');

      if (!order) throw new NotFoundError('Order not found');

      const userId = req.user._id.toString();
      const isAuthorized =
        req.user.role === 'admin' ||
        order.customerId._id.toString() === userId ||
        order.deliveryBoyId?._id.toString() === userId;

      if (!isAuthorized) throw new UnauthorizedError('Access denied');

      res.json({ order });
    } catch (error) {
      next(error);
    }
  }

  async updateStatus(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { status } = req.body;
      const order = await Order.findById(req.params.id);

      if (!order) throw new NotFoundError('Order not found');

      if (req.user.role !== 'admin' && req.user.role !== 'delivery_boy') {
        throw new UnauthorizedError('Only admin or delivery boy can update status');
      }

      order.status = status;
      await order.save();

      res.json({ message: 'Status updated', order });
    } catch (error) {
      next(error);
    }
  }
}

export const orderController = new OrderController();
