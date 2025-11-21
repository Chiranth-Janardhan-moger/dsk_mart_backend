import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  name: string;
  email?: string;
  phone?: string;
  password: string;
  role: 'customer' | 'delivery_boy' | 'admin';
  isActive: boolean;
  createdAt: Date;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const UserSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, sparse: true, unique: true },
  phone: { type: String, sparse: true, unique: true },
  password: { type: String, required: true },
  role: { 
    type: String, 
    enum: ['customer', 'delivery_boy', 'admin'], 
    default: 'customer' 
  },
  isActive: { type: Boolean, default: true },
  resetPasswordToken: { type: String },
  resetPasswordExpires: { type: Date },
  createdAt: { type: Date, default: Date.now },
});

UserSchema.set('toJSON', {
  transform: (_doc, ret) => {
    // create a shallow copy and remove sensitive fields without using `delete`
    const { password, resetPasswordToken, resetPasswordExpires, ...sanitized } = ret as any;
    return sanitized;
  },
});

UserSchema.set('toObject', {
  transform: (_doc, ret) => {
    // create a shallow copy and remove sensitive fields without using `delete`
    const { password, resetPasswordToken, resetPasswordExpires, ...sanitized } = ret as any;
    return sanitized;
  },
});

UserSchema.pre<IUser>('save', async function (this: any, next: (err?: any) => void) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

UserSchema.methods.comparePassword = async function (this: any, candidatePassword: string) {
  return bcrypt.compare(candidatePassword, this.password);
};

export const User = mongoose.model<IUser>('User', UserSchema);