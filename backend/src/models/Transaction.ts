import mongoose, { Schema, Document } from 'mongoose';

export interface ITransaction extends Document {
  orderId: mongoose.Types.ObjectId;
  amount: number;
  paymentMethod: string;
  paymentStatus: string;
  transactionDate: Date;
}

const TransactionSchema = new Schema<ITransaction>({
  orderId: { type: Schema.Types.ObjectId, ref: 'Order', required: true },
  amount: { type: Number, required: true },
  paymentMethod: { type: String, required: true },
  paymentStatus: { type: String, required: true },
  transactionDate: { type: Date, default: Date.now },
});

export const Transaction = mongoose.model<ITransaction>('Transaction', TransactionSchema);
