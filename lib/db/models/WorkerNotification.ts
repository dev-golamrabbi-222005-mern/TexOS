import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IWorkerNotification extends Document {
  workerId: mongoose.Types.ObjectId;
  title: string;
  message: string;
  isRead: boolean;
  sentAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const WorkerNotificationSchema = new Schema<IWorkerNotification>(
  {
    workerId: { type: Schema.Types.ObjectId, ref: 'Worker', required: true },
    title: { type: String, required: true, trim: true },
    message: { type: String, required: true, trim: true },
    isRead: { type: Boolean, default: false },
    sentAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const WorkerNotification: Model<IWorkerNotification> =
  mongoose.models.WorkerNotification || mongoose.model<IWorkerNotification>('WorkerNotification', WorkerNotificationSchema);

export default WorkerNotification;
