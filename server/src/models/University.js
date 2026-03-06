import mongoose from 'mongoose';

const universitySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    country: { type: String, required: true },
    website: { type: String },
    description: { type: String },
    status: { type: String, enum: ['draft', 'active'], default: 'active' },
  },
  { timestamps: true }
);

universitySchema.index({ country: 1 });

export const University = mongoose.model('University', universitySchema);
