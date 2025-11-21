import mongoose, { Schema, Document } from 'mongoose';

export interface IAddress extends Document {
  userId: mongoose.Types.ObjectId;
  apartment: string;
  addressLine: string;
  city: string;
  pincode: string;
  latitude?: number;
  longitude?: number;
  isDefault: boolean;
}

const AddressSchema = new Schema<IAddress>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  apartment: { type: String, required: true },
  addressLine: { type: String, required: true },
  city: { type: String, required: true },
  pincode: { type: String, required: true },
  latitude: Number,
  longitude: Number,
  isDefault: { type: Boolean, default: false },
});

export const Address = mongoose.model<IAddress>('Address', AddressSchema);