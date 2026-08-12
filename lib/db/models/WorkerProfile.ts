import mongoose, { Schema, Document, Model } from 'mongoose';

export type WorkerGender = 'Male' | 'Female' | 'Other';

export interface IWorkerProfile extends Document {
  workerId: mongoose.Types.ObjectId;
  fullName: string;
  phone: string;
  gender?: WorkerGender;
  dateOfBirth?: Date;
  emergencyContact?: string;
  createdAt: Date;
  updatedAt: Date;
}

const WorkerProfileSchema = new Schema<IWorkerProfile>(
  {
    workerId: { type: Schema.Types.ObjectId, ref: 'Worker', required: true, unique: true },
    fullName: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    gender: { type: String, enum: ['Male', 'Female', 'Other'] },
    dateOfBirth: { type: Date },
    emergencyContact: { type: String, trim: true },
  },
  { timestamps: true }
);

const WorkerProfile: Model<IWorkerProfile> =
  mongoose.models.WorkerProfile || mongoose.model<IWorkerProfile>('WorkerProfile', WorkerProfileSchema);

export default WorkerProfile;
