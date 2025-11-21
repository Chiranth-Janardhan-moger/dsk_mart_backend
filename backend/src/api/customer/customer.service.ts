import { Product } from '../../models/Product';
import { Order } from '../../models/Order';
import { Address } from '../../models/Address';
import { NotFoundError } from '../../utils/errors';

class CustomerService {
  async getProducts() {
    return Product.find({ inStock: true }).sort({ createdAt: -1 });
  }

  async getProduct(productId: string) {
    const product = await Product.findById(productId);
    if (!product) throw new NotFoundError('Product not found');
    return product;
  }

  async createOrder(customerId: string, data: any) {
    const { items, addressId } = data;

    const address = await Address.findOne({ _id: addressId, userId: customerId });
    if (!address) throw new NotFoundError('Address not found');

    const orderItems = await Promise.all(
      items.map(async (item: any) => {
        const product = await Product.findById(item.productId);
        if (!product) throw new NotFoundError(`Product ${item.productId} not found`);
        return {
          productId: product._id,
          name: product.name,
          quantity: item.quantity,
          price: product.price,
        };
      })
    );

    const totalAmount = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const orderNumber = `ORD${Date.now()}`;
    const packageCode = `PKG${Date.now()}`;

    const order = await Order.create({
      orderNumber,
      customerId,
      items: orderItems,
      totalAmount,
      deliveryAddress: addressId,
      packageCode,
      status: 'pending',
      paymentStatus: 'pending',
    });

    return order;
  }

  async getOrders(customerId: string) {
    return Order.find({ customerId })
      .populate('deliveryAddress')
      .populate('deliveryBoyId', 'name phone')
      .sort({ createdAt: -1 });
  }

  async getOrderDetails(orderId: string, customerId: string) {
    const order = await Order.findOne({ _id: orderId, customerId })
      .populate('deliveryAddress')
      .populate('deliveryBoyId', 'name phone')
      .populate('items.productId', 'name');

    if (!order) throw new NotFoundError('Order not found');
    return order;
  }

  async trackOrder(orderId: string, customerId: string) {
    const order = await Order.findOne({ _id: orderId, customerId }).populate(
      'deliveryBoyId',
      'name phone'
    );

    if (!order) throw new NotFoundError('Order not found');

    return {
      orderNumber: order.orderNumber,
      status: order.status,
      estimatedDelivery: null,
      deliveryBoy: order.deliveryBoyId,
    };
  }

  async createAddress(userId: string, data: any) {
    const address = await Address.create({ userId, ...data });
    return address;
  }

  async getAddresses(userId: string) {
    return Address.find({ userId });
  }

  async updateAddress(userId: string, addressId: string, data: any) {
    const address = await Address.findOneAndUpdate(
      { _id: addressId, userId },
      data,
      { new: true }
    );

    if (!address) throw new NotFoundError('Address not found');

    return address;
  }

  async deleteAddress(userId: string, addressId: string) {
    const address = await Address.findOneAndDelete({ _id: addressId, userId });
    if (!address) throw new NotFoundError('Address not found');
  }
}

export const customerService = new CustomerService();
