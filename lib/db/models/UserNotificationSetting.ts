import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IUserNotificationSetting extends Document {
  userId: mongoose.Types.ObjectId;
  pushNotification: boolean;
  smsNotification: boolean;
  complaintUpdates: boolean;
  productionAlerts: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const UserNotificationSettingSchema = new Schema<IUserNotificationSetting>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    pushNotification: { type: Boolean, default: true },
    smsNotification: { type: Boolean, default: true },
    complaintUpdates: { type: Boolean, default: true },
    productionAlerts: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const UserNotificationSetting: Model<IUserNotificationSetting> =
  mongoose.models.UserNotificationSetting || mongoose.model<IUserNotificationSetting>('UserNotificationSetting', UserNotificationSettingSchema);

export default UserNotificationSetting;
