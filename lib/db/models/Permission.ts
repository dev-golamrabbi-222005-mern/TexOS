import mongoose, { Schema, Document, Model } from 'mongoose';

export type PermissionModule = 'Complaint' | 'Bundle' | 'QC' | 'Factory' | 'Reports' | 'User' | 'Role';
export type PermissionAction = 'create' | 'read' | 'update' | 'delete' | 'manage';

export interface IPermission extends Document {
  module: PermissionModule;
  permissionName: string;
  action: PermissionAction;
  createdAt: Date;
  updatedAt: Date;
}

const PermissionSchema = new Schema<IPermission>(
  {
    module: {
      type: String,
      enum: ['Complaint', 'Bundle', 'QC', 'Factory', 'Reports', 'User', 'Role'],
      required: true,
    },
    permissionName: { type: String, required: true, trim: true },
    action: {
      type: String,
      enum: ['create', 'read', 'update', 'delete', 'manage'],
      required: true,
    },
  },
  { timestamps: true }
);

const Permission: Model<IPermission> =
  mongoose.models.Permission || mongoose.model<IPermission>('Permission', PermissionSchema);

export default Permission;
