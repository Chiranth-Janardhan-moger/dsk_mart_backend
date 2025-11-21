import { Order } from '../../models/Order';
import { DeliveryBoy } from '../../models/DeliveryBoy';
import { User } from '../../models/User';
import { Transaction } from '../../models/Transaction';
import { NotFoundError } from '../../utils/errors';

class AdminService {
  async getDashboard(period: string = 'today') {
    const dateRange = this.getDateRange(period);

    const [totalDeliveries, totalRevenue, orders, deliveryBoys] = await Promise.all([
      Order.countDocuments({ createdAt: { $gte: dateRange.start }, status: 'delivered' }),
      Order.aggregate([
        { $match: { createdAt: { $gte: dateRange.start }, status: 'delivered' } },
        { $group: { _id: null, total: { $sum: '$totalAmount' } } },
      ]),
      Order.find({ createdAt: { $gte: dateRange.start } }),
      DeliveryBoy.countDocuments(),
    ]);

    const paymentBreakdown = await this.getPaymentBreakdown(dateRange.start);
    const unpaidCount = await Order.countDocuments({
      paymentStatus: 'unpaid',
      createdAt: { $gte: dateRange.start },
    });

    return {
      totalDeliveries,
      totalRevenue: totalRevenue[0]?.total || 0,
      paymentBreakdown,
      unpaidCount,
      totalDeliveryBoys: deliveryBoys,
    };
  }

  async getOrders(status?: string, page: number = 1, limit: number = 20) {
    const skip = (page - 1) * limit;
    const filter: any = {};
    if (status) filter.status = status;

    const orders = await Order.find(filter)
      .populate('customerId', 'name phone')
      .populate('deliveryBoyId', 'name phone')
      .populate('deliveryAddress')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Order.countDocuments(filter);

    return { orders, total, page, pages: Math.ceil(total / limit) };
  }

  async getOrderDetails(orderId: string) {
    const order = await Order.findById(orderId)
      .populate('customerId', 'name phone email')
      .populate('deliveryBoyId', 'name phone')
      .populate('deliveryAddress')
      .populate('items.productId', 'name');

    if (!order) throw new NotFoundError('Order not found');
    return order;
  }

  async assignOrder(orderId: string, deliveryBoyId: string) {
    const order = await Order.findById(orderId);
    if (!order) throw new NotFoundError('Order not found');

    const deliveryBoy = await User.findOne({ _id: deliveryBoyId, role: 'delivery_boy' });
    if (!deliveryBoy) throw new NotFoundError('Delivery boy not found');

    order.deliveryBoyId = deliveryBoyId as any;
    order.status = 'assigned';
    await order.save();

    return { message: 'Order assigned successfully', order };
  }

  async getDeliveryBoys() {
    const deliveryBoys = await User.find({ role: 'delivery_boy', isActive: true })
      .select('name phone email')
      .lean();

    const deliveryBoysWithStats = await Promise.all(
      deliveryBoys.map(async (boy: any) => {
        const stats = await DeliveryBoy.findOne({ userId: boy._id });
        return { ...boy, ...stats?.toObject() };
      })
    );

    return deliveryBoysWithStats;
  }

  async getLeaderboard() {
    const leaderboard = await DeliveryBoy.find()
      .populate('userId', 'name')
      .sort({ totalDeliveries: -1 })
      .limit(10);

    return leaderboard.map((item) => ({
      name: (item.userId as any).name,
      deliveries: item.totalDeliveries,
      earnings: item.totalEarnings,
      rating: item.rating,
    }));
  }

  async getRevenue(period: string = 'today') {
    const dateRange = this.getDateRange(period);

    const revenue = await Order.aggregate([
      { $match: { createdAt: { $gte: dateRange.start }, status: 'delivered' } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          total: { $sum: '$totalAmount' },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    return { revenue, period };
  }

  async getTransactions(page: number = 1, limit: number = 20) {
    const skip = (page - 1) * limit;

    const transactions = await Transaction.find()
      .populate('orderId')
      .sort({ transactionDate: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Transaction.countDocuments();

    return { transactions, total, page, pages: Math.ceil(total / limit) };
  }

  async createDeliveryBoy(data: any) {
    const { name, email, phone, password, vehicleType, vehicleNumber, licenseNumber } = data;

    const user = await User.create({
      name,
      email,
      phone,
      password,
      role: 'delivery_boy',
    });

    const deliveryBoy = await DeliveryBoy.create({
      userId: user._id,
      vehicleType,
      vehicleNumber,
      licenseNumber,
    });

    return { message: 'Delivery boy created successfully', user, deliveryBoy };
  }

  async updateDeliveryBoy(id: string, data: any) {
    const { name, email, phone, password, vehicleType, vehicleNumber, licenseNumber } = data;

    const user = await User.findOneAndUpdate(
      { _id: id, role: 'delivery_boy' },
      {
        ...(name && { name }),
        ...(email && { email }),
        ...(phone && { phone }),
        ...(password && { password }),
      },
      { new: true }
    );

    if (!user) throw new NotFoundError('Delivery boy not found');

    const deliveryBoy = await DeliveryBoy.findOneAndUpdate(
      { userId: id },
      {
        ...(vehicleType && { vehicleType }),
        ...(vehicleNumber && { vehicleNumber }),
        ...(licenseNumber && { licenseNumber }),
      },
      { new: true }
    );

    return { message: 'Delivery boy updated successfully', user, deliveryBoy };
  }

  async deleteDeliveryBoy(id: string) {
    const user = await User.findOneAndUpdate(
      { _id: id, role: 'delivery_boy' },
      { isActive: false },
      { new: true }
    );

    if (!user) throw new NotFoundError('Delivery boy not found');

    return { message: 'Delivery boy deleted successfully', user };
  }

  private getDateRange(period: string) {
    const now = new Date();
    let start: Date;

    switch (period) {
      case 'today':
        start = new Date(now.setHours(0, 0, 0, 0));
        break;
      case 'week':
        start = new Date(now.setDate(now.getDate() - 7));
        break;
      case 'month':
        start = new Date(now.setMonth(now.getMonth() - 1));
        break;
      default:
        start = new Date(now.setHours(0, 0, 0, 0));
    }

    return { start, end: new Date() };
  }

  private async getPaymentBreakdown(startDate: Date) {
    const breakdown = await Order.aggregate([
      { $match: { createdAt: { $gte: startDate }, status: 'delivered' } },
      {
        $group: {
          _id: '$paymentMethod',
          total: { $sum: '$totalAmount' },
          count: { $sum: 1 },
        },
      },
    ]);

    return breakdown.reduce((acc: any, item: any) => {
      acc[item._id || 'unknown'] = { total: item.total, count: item.count };
      return acc;
    }, {});
  }
}

export const adminService = new AdminService();
