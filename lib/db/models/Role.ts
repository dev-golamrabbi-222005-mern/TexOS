import mongoose, { Schema, Document, Model } from 'mongoose';

export type RoleStatus = 'Active' | 'Inactive';

export interface IRole extends Document {
  name: string;
  displayName: string;
  roleType: string;
  status: RoleStatus;
  createdAt: Date;
  updatedAt: Date;
}

const RoleSchema = new Schema<IRole>(
  {
    name: { type: String, required: true, unique: true, trim: true },
    displayName: { type: String, required: true, trim: true },
    roleType: { type: String, default: 'Custom' },
    status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' },
  },
  { timestamps: true }
);

const Role: Model<IRole> = mongoose.models.Role || mongoose.model<IRole>('Role', RoleSchema);

export default Role;
