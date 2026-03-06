import mongoose from 'mongoose';
import { scholarshipSlug } from '../utils/slugify.js';

const scholarshipSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    provider: { type: String, required: true },
    level: { type: String, enum: ['Undergraduate', 'Graduate', 'PhD', 'Other'], default: 'Other' },
    degreeLevel: { type: String }, // alias / display (e.g. Bachelor, Master, PhD)
    university: { type: String },
    country: { type: String },
    amount: { type: String },
    fundingType: { type: String, enum: ['Fully Funded', 'Partial', 'Other'], default: 'Other' },
    description: { type: String },
    eligibility: [{ type: String }],
    applicationInstructions: { type: String },
    deadline: { type: Date },
    link: { type: String },
    status: { type: String, enum: ['draft', 'active', 'closed'], default: 'active' },
    logoUrl: { type: String },
    views: { type: Number, default: 0 },
    isFeatured: { type: Boolean, default: false },
    isSponsored: { type: Boolean, default: false },
  },
  { timestamps: true }
);

scholarshipSchema.index({ slug: 1 });
scholarshipSchema.index({ deadline: 1, status: 1 });
scholarshipSchema.index({ level: 1, status: 1 });
scholarshipSchema.index({ country: 1, status: 1 });
scholarshipSchema.index({ title: 'text', provider: 'text', country: 'text' });

scholarshipSchema.pre('save', function (next) {
  if (!this.slug || this.isModified('title') || this.isModified('country')) {
    this.slug = scholarshipSlug(this.title, this.country || '');
  }
  next();
});

export const Scholarship = mongoose.model('Scholarship', scholarshipSchema);
