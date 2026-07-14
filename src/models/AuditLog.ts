import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IAuditLog extends Document {
  action: 'CREATE' | 'UPDATE' | 'DELETE';
  startupId: string;
  startupName: string;
  user: string;
  timestamp: Date;
  changes: Array<{
    field: string;
    oldValue: any;
    newValue: any;
  }>;
}

const AuditLogSchema = new Schema<IAuditLog>({
  action: {
    type: String,
    enum: ['CREATE', 'UPDATE', 'DELETE'],
    required: true,
  },
  startupId: {
    type: String,
    required: true,
  },
  startupName: {
    type: String,
    required: true,
  },
  user: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  changes: [{
    field: String,
    oldValue: Schema.Types.Mixed,
    newValue: Schema.Types.Mixed,
  }],
}, { timestamps: true });

// Check if the model exists before compiling it to prevent OverwriteModelError in Next.js development
export const AuditLog: Model<IAuditLog> = mongoose.models.AuditLog || mongoose.model<IAuditLog>('AuditLog', AuditLogSchema);
