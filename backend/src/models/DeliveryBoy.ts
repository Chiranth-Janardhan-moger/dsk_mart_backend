import mongoose, { Schema, Document } from 'mongoose';

export interface IDeliveryBoy extends Document {
  userId: mongoose.Types.ObjectId;
  vehicleType: string;
  vehicleNumber: string;
  licenseNumber: string;
  totalDeliveries: number;
  totalEarnings: number;
  rating: number;
  isAvailable: boolean;
  currentLocation?: {
    latitude: number;
    longitude: number;
  };
}

const DeliveryBoySchema = new Schema<IDeliveryBoy>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  vehicleType: { type: String, required: true },
  vehicleNumber: { type: String, required: true },
  licenseNumber: { type: String, required: true },
  totalDeliveries: { type: Number, default: 0 },
  totalEarnings: { type: Number, default: 0 },
  rating: { type: Number, default: 5, min: 0, max: 5 },
  isAvailable: { type: Boolean, default: true },
  currentLocation: {
    latitude: Number,
    longitude: Number,
  },
});

export const DeliveryBoy = mongoose.model<IDeliveryBoy>('DeliveryBoy', DeliveryBoySchema);
