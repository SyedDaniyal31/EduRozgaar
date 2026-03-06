import mongoose from 'mongoose';

const badgeDefinitionSchema = new mongoose.Schema(
  {
    badgeType: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    description: { type: String },
    points: { type: Number, default: 10 },
    icon: { type: String },
  },
  { timestamps: true }
);

badgeDefinitionSchema.index({ badgeType: 1 });

export const BadgeDefinition = mongoose.model('BadgeDefinition', badgeDefinitionSchema);
