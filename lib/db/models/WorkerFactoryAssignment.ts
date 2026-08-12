import mongoose, { Schema, Document, Model } from 'mongoose';

export type WorkerAssignmentStatus = 'Active' | 'Inactive' | 'Transferred';

export interface IWorkerFactoryAssignment extends Document {
  workerId: mongoose.Types.ObjectId;
  factoryId: mongoose.Types.ObjectId;
  lineId?: mongoose.Types.ObjectId;
  designation?: string;
  assignedAt: Date;
  status: WorkerAssignmentStatus;
  createdAt: Date;
  updatedAt: Date;
}

const WorkerFactoryAssignmentSchema = new Schema<IWorkerFactoryAssignment>(
  {
    workerId: { type: Schema.Types.ObjectId, ref: 'Worker', required: true },
    factoryId: { type: Schema.Types.ObjectId, ref: 'Factory', required: true },
    lineId: { type: Schema.Types.ObjectId, ref: 'FactoryLine' },
    designation: { type: String, trim: true },
    assignedAt: { type: Date, default: Date.now },
    status: { type: String, enum: ['Active', 'Inactive', 'Transferred'], default: 'Active' },
  },
  { timestamps: true }
);

const WorkerFactoryAssignment: Model<IWorkerFactoryAssignment> =
  mongoose.models.WorkerFactoryAssignment ||
  mongoose.model<IWorkerFactoryAssignment>('WorkerFactoryAssignment', WorkerFactoryAssignmentSchema);

export default WorkerFactoryAssignment;
