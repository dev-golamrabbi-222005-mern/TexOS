import mongoose, { Schema, Document, Model } from 'mongoose';

export type UserRoleStatus = 'Active' | 'Inactive';

export interface IUserRole extends Document {
  userId: mongoose.Types.ObjectId;
  roleId: mongoose.Types.ObjectId;
  assignedBy?: mongoose.Types.ObjectId;
  assignedAt: Date;
  status: UserRoleStatus;
  createdAt: Date;
  updatedAt: Date;
}

const UserRoleSchema = new Schema<IUserRole>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    roleId: { type: Schema.Types.ObjectId, ref: 'Role', required: true },
    assignedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    assignedAt: { type: Date, default: Date.now },
    status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' },
  },
  { timestamps: true }
);

const UserRole: Model<IUserRole> =
  mongoose.models.UserRole || mongoose.model<IUserRole>('UserRole', UserRoleSchema);

export default UserRole;
