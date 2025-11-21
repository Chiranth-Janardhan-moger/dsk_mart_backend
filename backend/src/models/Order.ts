import mongoose, { Schema, Document } from 'mongoose';

export interface IOrderItem {
  productId: mongoose.Types.ObjectId;
  name: string;
  quantity: number;
  price: number;
}

export interface IOrder extends Document {
  orderNumber: string;
  customerId: mongoose.Types.ObjectId;
  deliveryBoyId?: mongoose.Types.ObjectId;
  items: IOrderItem[];
  totalAmount: number;
  status: string;
  paymentMethod?: string;
  paymentStatus: string;
  deliveryAddress: mongoose.Types.ObjectId;
  packageCode?: string;
  scannedAt?: Date;
  deliveredAt?: Date;
  createdAt: Date;
}

const OrderSchema = new Schema<IOrder>({
  orderNumber: { type: String, required: true, unique: true },
  customerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  deliveryBoyId: { type: Schema.Types.ObjectId, ref: 'User' },
  items: [{
    productId: { type: Schema.Types.ObjectId, ref: 'Product' },
    name: String,
    quantity: Number,
    price: Number,
  }],
  totalAmount: { type: Number, required: true },
  status: { 
    type: String, 
    enum: ['pending', 'assigned', 'picked_up', 'in_transit', 'delivered', 'cancelled'],
    default: 'pending' 
  },
  paymentMethod: { 
    type: String, 
    enum: ['cash', 'upi', 'card', 'cod', 'other'] 
  },
  paymentStatus: { 
    type: String, 
    enum: ['pending', 'paid', 'unpaid'], 
    default: 'pending' 
  },
  deliveryAddress: { type: Schema.Types.ObjectId, ref: 'Address', required: true },
  packageCode: String,
  scannedAt: Date,
  deliveredAt: Date,
  createdAt: { type: Date, default: Date.now },
});

export const Order = mongoose.model<IOrder>('Order', OrderSchema);
