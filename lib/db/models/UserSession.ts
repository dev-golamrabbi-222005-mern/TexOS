import mongoose, { Schema, Document, Model } from 'mongoose';

export type SessionStatus = 'Active' | 'Expired' | 'Revoked';

export interface IUserSession extends Document {
  userId: mongoose.Types.ObjectId;
  accessToken?: string;
  refreshToken?: string;
  loginTime: Date;
  ipAddress?: string;
  deviceId?: string;
  status: SessionStatus;
  expiresAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const UserSessionSchema = new Schema<IUserSession>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    accessToken: { type: String },
    refreshToken: { type: String },
    loginTime: { type: Date, default: Date.now },
    ipAddress: { type: String },
    deviceId: { type: String },
    status: { type: String, enum: ['Active', 'Expired', 'Revoked'], default: 'Active' },
    expiresAt: { type: Date },
  },
  { timestamps: true }
);

const UserSession: Model<IUserSession> = mongoose.models.UserSession || mongoose.model<IUserSession>('UserSession', UserSessionSchema);

export default UserSession;
