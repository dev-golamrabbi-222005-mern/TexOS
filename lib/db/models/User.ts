import mongoose, { Schema, Document, Model } from 'mongoose';

export type UserType = 'Worker' | 'LineSupervisor' | 'QCInspector' | 'HRManager' | 'FactoryAdmin' | 'SuperAdmin';
export type UserStatus = 'Active' | 'Inactive' | 'Suspended';

export interface IUser extends Document {
  fullName: string;
  phone: string;
  email?: string;
  password?: string;
  userType: UserType;
  factoryId?: mongoose.Types.ObjectId;
  status: UserStatus;
  isVerified: boolean;
  profileImage?: string;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    fullName: { type: String, required: true, trim: true },
    phone: { type: String, required: true, unique: true, trim: true },
    email: { type: String, trim: true, lowercase: true },
    password: { type: String },
    userType: {
      type: String,
      enum: ['Worker', 'LineSupervisor', 'QCInspector', 'HRManager', 'FactoryAdmin', 'SuperAdmin'],
      required: true,
    },
    factoryId: { type: Schema.Types.ObjectId, ref: 'Factory' },
    status: { type: String, enum: ['Active', 'Inactive', 'Suspended'], default: 'Active' },
    isVerified: { type: Boolean, default: false },
    profileImage: { type: String },
    lastLogin: { type: Date },
  },
  { timestamps: true }
);

const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export default User;
