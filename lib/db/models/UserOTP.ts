import mongoose, { Schema, Document, Model } from 'mongoose';

export type OTPStatus = 'Pending' | 'Verified' | 'Expired';

export interface IUserOTP extends Document {
  userId?: mongoose.Types.ObjectId;
  phone: string;
  otpCode: string;
  purpose: string;
  expiresAt: Date;
  verifiedAt?: Date;
  status: OTPStatus;
  createdAt: Date;
  updatedAt: Date;
}

const UserOTPSchema = new Schema<IUserOTP>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    phone: { type: String, required: true, trim: true },
    otpCode: { type: String, required: true, trim: true },
    purpose: { type: String, default: 'login' },
    expiresAt: { type: Date, required: true },
    verifiedAt: { type: Date },
    status: { type: String, enum: ['Pending', 'Verified', 'Expired'], default: 'Pending' },
  },
  { timestamps: true }
);

const UserOTP: Model<IUserOTP> = mongoose.models.UserOTP || mongoose.model<IUserOTP>('UserOTP', UserOTPSchema);

export default UserOTP;
