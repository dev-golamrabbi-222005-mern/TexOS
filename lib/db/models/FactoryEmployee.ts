import mongoose, { Schema, Document, Model } from 'mongoose';

export type FactoryEmployeeStatus = 'Active' | 'Inactive';

export interface IFactoryEmployee extends Document {
  factoryId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  designation?: string;
  departmentId?: mongoose.Types.ObjectId;
  joiningDate: Date;
  status: FactoryEmployeeStatus;
  createdAt: Date;
  updatedAt: Date;
}

const FactoryEmployeeSchema = new Schema<IFactoryEmployee>(
  {
    factoryId: { type: Schema.Types.ObjectId, ref: 'Factory', required: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    designation: { type: String, trim: true },
    departmentId: { type: Schema.Types.ObjectId },
    joiningDate: { type: Date, default: Date.now },
    status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' },
  },
  { timestamps: true }
);

const FactoryEmployee: Model<IFactoryEmployee> =
  mongoose.models.FactoryEmployee || mongoose.model<IFactoryEmployee>('FactoryEmployee', FactoryEmployeeSchema);

export default FactoryEmployee;
