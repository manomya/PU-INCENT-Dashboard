import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IStartupSnapshot extends Document {
  sheetName: string;
  data: string; // Serialized JSON string of the sheet data
  timestamp: Date;
}

const StartupSnapshotSchema = new Schema<IStartupSnapshot>({
  sheetName: {
    type: String,
    required: true,
    unique: true,
  },
  data: {
    type: String, // Storing as a string to handle varied sheet structures without schema issues
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  }
});

export const StartupSnapshot: Model<IStartupSnapshot> = mongoose.models.StartupSnapshot || mongoose.model<IStartupSnapshot>('StartupSnapshot', StartupSnapshotSchema);
