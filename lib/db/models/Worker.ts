import mongoose, { Schema, Document, Model } from 'mongoose';

export type WorkerStatus = 'Active' | 'Inactive' | 'Terminated';

export interface IWorker extends Document {
  userId: mongoose.Types.ObjectId;
  workerCode: string;
  status: WorkerStatus;
  joiningDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

const WorkerSchema = new Schema<IWorker>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    workerCode: { type: String, required: true, unique: true, trim: true },
    status: { type: String, enum: ['Active', 'Inactive', 'Terminated'], default: 'Active' },
    joiningDate: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const Worker: Model<IWorker> = mongoose.models.Worker || mongoose.model<IWorker>('Worker', WorkerSchema);

export default Worker;
