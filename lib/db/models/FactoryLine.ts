import mongoose, { Schema, Document, Model } from 'mongoose';

export type FactoryLineStatus = 'Active' | 'Inactive';

export interface IFactoryLine extends Document {
  factoryId: mongoose.Types.ObjectId;
  lineName: string;
  lineType?: string;
  status: FactoryLineStatus;
  createdAt: Date;
  updatedAt: Date;
}

const FactoryLineSchema = new Schema<IFactoryLine>(
  {
    factoryId: { type: Schema.Types.ObjectId, ref: 'Factory', required: true },
    lineName: { type: String, required: true, trim: true },
    lineType: { type: String, trim: true },
    status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' },
  },
  { timestamps: true }
);

const FactoryLine: Model<IFactoryLine> =
  mongoose.models.FactoryLine || mongoose.model<IFactoryLine>('FactoryLine', FactoryLineSchema);

export default FactoryLine;
