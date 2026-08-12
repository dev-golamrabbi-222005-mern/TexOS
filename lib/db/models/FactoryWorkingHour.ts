import mongoose, { Schema, Document, Model } from 'mongoose';

export type DayOfWeek = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';

export interface IFactoryWorkingHour extends Document {
  factoryId: mongoose.Types.ObjectId;
  day: DayOfWeek;
  openingTime: string;
  closingTime: string;
  isOpen: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const FactoryWorkingHourSchema = new Schema<IFactoryWorkingHour>(
  {
    factoryId: { type: Schema.Types.ObjectId, ref: 'Factory', required: true },
    day: {
      type: String,
      enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      required: true,
    },
    openingTime: { type: String, required: true, trim: true },
    closingTime: { type: String, required: true, trim: true },
    isOpen: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const FactoryWorkingHour: Model<IFactoryWorkingHour> =
  mongoose.models.FactoryWorkingHour || mongoose.model<IFactoryWorkingHour>('FactoryWorkingHour', FactoryWorkingHourSchema);

export default FactoryWorkingHour;
