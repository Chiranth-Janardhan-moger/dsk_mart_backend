import mongoose, { Schema, Document } from 'mongoose';

export interface IAdmin extends Document {
  userId: mongoose.Types.ObjectId;
  permissions: string[];
}

const AdminSchema = new Schema<IAdmin>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  permissions: [{ type: String }],
});

export const Admin = mongoose.model<IAdmin>('Admin', AdminSchema);

