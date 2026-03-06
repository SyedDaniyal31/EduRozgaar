import mongoose from 'mongoose';

const userBadgeSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    badgeType: { type: String, required: true },
    name: { type: String },
    description: { type: String },
    points: { type: Number, default: 10 },
    earnedAt: { type: Date, default: Date.now },
    metadata: { type: mongoose.Schema.Types.Mixed },
  },
  { timestamps: true }
);

userBadgeSchema.index({ userId: 1 });
userBadgeSchema.index({ badgeType: 1 });

export const UserBadge = mongoose.model('UserBadge', userBadgeSchema);
