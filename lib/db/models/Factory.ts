import mongoose, { Schema, Document, Model } from 'mongoose';

export type FactoryStatus = 'Active' | 'Inactive';

export interface IFactory extends Document {
  factoryCode: string;
  factoryName: string;
  address: string;
  division?: string;
  district?: string;
  adminId?: mongoose.Types.ObjectId;
  status: FactoryStatus;
  createdAt: Date;
  updatedAt: Date;
}

const FactorySchema = new Schema<IFactory>(
  {
    factoryCode: { type: String, required: true, unique: true, trim: true },
    factoryName: { type: String, required: true, trim: true },
    address: { type: String, required: true, trim: true },
    division: { type: String, trim: true },
    district: { type: String, trim: true },
    adminId: { type: Schema.Types.ObjectId, ref: 'User' },
    status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' },
  },
  { timestamps: true }
);

const Factory: Model<IFactory> = mongoose.models.Factory || mongoose.model<IFactory>('Factory', FactorySchema);

export default Factory;
