import mongoose from 'mongoose';

const jobPlanSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true },
    durationDays: { type: Number, default: null }, // null = until filled
    price: { type: Number, required: true }, // in USD (or base currency)
    features: [{ type: String }],
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const JobPlan = mongoose.model('JobPlan', jobPlanSchema);
