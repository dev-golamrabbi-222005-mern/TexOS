import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IFactoryPermission extends Document {
  factoryRoleId: mongoose.Types.ObjectId;
  permissionId: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const FactoryPermissionSchema = new Schema<IFactoryPermission>(
  {
    factoryRoleId: { type: Schema.Types.ObjectId, ref: 'Role', required: true },
    permissionId: { type: Schema.Types.ObjectId, ref: 'Permission', required: true },
  },
  { timestamps: true }
);

const FactoryPermission: Model<IFactoryPermission> =
  mongoose.models.FactoryPermission || mongoose.model<IFactoryPermission>('FactoryPermission', FactoryPermissionSchema);

export default FactoryPermission;
