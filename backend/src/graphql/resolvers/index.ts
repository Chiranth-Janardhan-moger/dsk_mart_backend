import { GraphQLScalarType, Kind } from 'graphql';
import { authService } from '../../api/auth/auth.service';
import { Order } from '../../models/Order';
import { NotFoundError, UnauthorizedError } from '../../utils/errors';

const DateScalar = new GraphQLScalarType({
  name: 'Date',
  description: 'ISO-8601 date scalar',
  serialize(value) {
    if (value instanceof Date) {
      return value.toISOString();
    }
    return new Date(value as string).toISOString();
  },
  parseValue(value) {
    return new Date(value as string);
  },
  parseLiteral(ast) {
    if (ast.kind === Kind.STRING) {
      return new Date(ast.value);
    }
    return null;
  },
});

export const resolvers = {
  Date: DateScalar,
  Query: {
    me: async (_: unknown, __: unknown, context: any) => {
      if (!context.user) throw new UnauthorizedError('Not authenticated');
      return context.user;
    },
    orders: async (_: unknown, __: unknown, context: any) => {
      if (!context.user) throw new UnauthorizedError('Not authenticated');

      const user = context.user;
      const filter: any = {};

      if (user.role === 'customer') {
        filter.customerId = user._id;
      } else if (user.role === 'delivery_boy') {
        filter.deliveryBoyId = user._id;
      }

      const orders = await Order.find(filter)
        .sort({ createdAt: -1 })
        .populate('customerId', 'name email phone')
        .populate('deliveryBoyId', 'name phone');

      return orders;
    },
    order: async (_: unknown, args: { id: string }, context: any) => {
      if (!context.user) throw new UnauthorizedError('Not authenticated');

      const order = await Order.findById(args.id)
        .populate('customerId', 'name email phone')
        .populate('deliveryBoyId', 'name phone');

      if (!order) {
        throw new NotFoundError('Order not found');
      }

      const userId = context.user._id.toString();
      const customer: any = order.customerId;
      const deliveryBoy: any = order.deliveryBoyId;

      const isAuthorized =
        context.user.role === 'admin' ||
        (customer && customer._id?.toString() === userId) ||
        (deliveryBoy && deliveryBoy._id?.toString() === userId);

      if (!isAuthorized) {
        throw new UnauthorizedError('Access denied');
      }

      return order;
    },
  },
  Mutation: {
    login: async (
      _: unknown,
      { emailOrPhone, password }: { emailOrPhone: string; password: string }
    ) => {
      return authService.login(emailOrPhone, password);
    },
    register: async (_: unknown, args: any) => {
      return authService.register(args);
    },
  },
  User: {
    id: (user: any) => user._id.toString(),
  },
  Order: {
    id: (order: any) => order._id.toString(),
    customer: (order: any) => order.customerId,
    deliveryBoy: (order: any) => order.deliveryBoyId,
  },
};