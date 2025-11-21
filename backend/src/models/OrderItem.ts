import mongoose, { Schema, Document } from 'mongoose';

export interface IOrderItemDocument extends Document {
  orderId: mongoose.Types.ObjectId;
  productId: mongoose.Types.ObjectId;
  name: string;
  quantity: number;
  price: number;
}

const OrderItemSchema = new Schema<IOrderItemDocument>({
  orderId: { type: Schema.Types.ObjectId, ref: 'Order', required: true },
  productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  name: { type: String, required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
});

export const OrderItem = mongoose.model<IOrderItemDocument>('OrderItem', OrderItemSchema);

