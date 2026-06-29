import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IUser extends Document {
  email: string;
  passwordHash: string;
  role: 'admin' | 'user';
  permissions: {
    canView: boolean;
    canEdit: boolean;
    canAdd: boolean;
    accessibleStartups: 'ALL' | string[]; // Array of startup IDs
  };
  createdAt: Date;
}

const UserSchema = new Schema<IUser>({
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
    lowercase: true,
    trim: true,
  },
  passwordHash: {
    type: String,
    required: [true, 'Please provide a password'],
  },
  role: {
    type: String,
    enum: ['admin', 'user'],
    default: 'user',
  },
  permissions: {
    canView: { type: Boolean, default: true },
    canEdit: { type: Boolean, default: false },
    canAdd: { type: Boolean, default: false },
    accessibleStartups: { type: Schema.Types.Mixed, default: 'ALL' },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
