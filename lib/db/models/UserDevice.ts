import mongoose, { Schema, Document, Model } from 'mongoose';

export type DevicePlatform = 'Android' | 'iOS' | 'Web';

export interface IUserDevice extends Document {
  userId: mongoose.Types.ObjectId;
  deviceId: string;
  platform: DevicePlatform;
  pushToken?: string;
  lastActive: Date;
  createdAt: Date;
  updatedAt: Date;
}

const UserDeviceSchema = new Schema<IUserDevice>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    deviceId: { type: String, required: true },
    platform: { type: String, enum: ['Android', 'iOS', 'Web'], default: 'Web' },
    pushToken: { type: String },
    lastActive: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const UserDevice: Model<IUserDevice> = mongoose.models.UserDevice || mongoose.model<IUserDevice>('UserDevice', UserDeviceSchema);

export default UserDevice;
