import { Order } from '../../models/Order';
import { DeliveryBoy } from '../../models/DeliveryBoy';
import { User } from '../../models/User';
import { NotFoundError, ValidationError } from '../../utils/errors';

class DriverService {
  async getAssignedOrders(driverId: string) {
    return Order.find({
      deliveryBoyId: driverId,
      status: { $in: ['assigned', 'picked_up', 'in_transit'] },
    })
      .populate('customerId', 'name phone')
      .populate('deliveryAddress')
      .sort({ createdAt: -1 });
  }

  async getOrderDetails(orderId: string, driverId: string) {
    const order = await Order.findOne({ _id: orderId, deliveryBoyId: driverId })
      .populate('customerId', 'name phone')
      .populate('deliveryAddress')
      .populate('items.productId', 'name');

    if (!order) throw new NotFoundError('Order not found');
    return order;
  }

  async confirmDelivery(
    orderId: string,
    driverId: string,
    paymentMethod: string,
    scanned: boolean
  ) {
    const order = await Order.findOne({ _id: orderId, deliveryBoyId: driverId });
    if (!order) throw new NotFoundError('Order not found');

    if (!scanned) {
      throw new ValidationError('Package must be scanned before delivery confirmation');
    }

    order.status = 'delivered';
    order.paymentMethod = paymentMethod;
    order.paymentStatus = paymentMethod === 'cod' ? 'unpaid' : 'paid';
    order.deliveredAt = new Date();
    await order.save();

    // Update delivery boy stats
    await DeliveryBoy.findOneAndUpdate(
      { userId: driverId },
      {
        $inc: { totalDeliveries: 1, totalEarnings: order.totalAmount * 0.1 },
      }
    );

    return { message: 'Delivery completed successfully', order };
  }

  async validateScan(orderId: string, scannedCode: string) {
    const order = await Order.findById(orderId);
    if (!order) throw new NotFoundError('Order not found');

    const isValid = order.packageCode === scannedCode || order.orderNumber === scannedCode;

    if (isValid) {
      order.scannedAt = new Date();
      await order.save();
    }

    return { valid: isValid, message: isValid ? 'Package verified' : 'Invalid package code' };
  }

  async getHistory(driverId: string, page: number, limit: number) {
    const skip = (page - 1) * limit;
    const orders = await Order.find({
      deliveryBoyId: driverId,
      status: 'delivered',
    })
      .populate('customerId', 'name phone')
      .populate('deliveryAddress')
      .sort({ deliveredAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Order.countDocuments({
      deliveryBoyId: driverId,
      status: 'delivered',
    });

    return { orders, total, page, pages: Math.ceil(total / limit) };
  }

  async getProfile(driverId: string) {
    const user = await User.findById(driverId);
    const deliveryBoy = await DeliveryBoy.findOne({ userId: driverId });

    return {
      ...user?.toObject(),
      ...deliveryBoy?.toObject(),
    };
  }

  async getEarnings(driverId: string) {
    const deliveryBoy = await DeliveryBoy.findOne({ userId: driverId });
    return {
      totalEarnings: deliveryBoy?.totalEarnings || 0,
      totalDeliveries: deliveryBoy?.totalDeliveries || 0,
    };
  }

  async updateProfile(driverId: string, data: any) {
    const { name, phone, vehicleType, vehicleNumber, licenseNumber, isAvailable } = data;

    const user = await User.findByIdAndUpdate(
      driverId,
      {
        ...(name && { name }),
        ...(phone && { phone }),
      },
      { new: true }
    );

    const deliveryBoy = await DeliveryBoy.findOneAndUpdate(
      { userId: driverId },
      {
        ...(vehicleType && { vehicleType }),
        ...(vehicleNumber && { vehicleNumber }),
        ...(licenseNumber && { licenseNumber }),
        ...(typeof isAvailable === 'boolean' && { isAvailable }),
      },
      { new: true }
    );

    return {
      ...user?.toObject(),
      ...deliveryBoy?.toObject(),
    };
  }
}

export const driverService = new DriverService();
