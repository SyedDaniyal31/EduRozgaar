import mongoose from 'mongoose';
import { jobSlug } from '../utils/slugify.js';

const jobSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    company: { type: String, required: true },
    organization: { type: String }, // alias / display name
    location: { type: String },
    province: { type: String },
    category: { type: String },
    type: { type: String, enum: ['full-time', 'part-time', 'contract', 'internship'], default: 'full-time' },
    description: { type: String },
    requirements: [{ type: String }],
    applicationInstructions: { type: String },
    postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    status: { type: String, enum: ['draft', 'active', 'closed'], default: 'active' },
    deadline: { type: Date },
    logoUrl: { type: String },
    views: { type: Number, default: 0 },
    isFeatured: { type: Boolean, default: false },
    isSponsored: { type: Boolean, default: false },
  },
  { timestamps: true }
);

jobSchema.index({ slug: 1 });
jobSchema.index({ status: 1, createdAt: -1 });
jobSchema.index({ status: 1, deadline: 1 });
jobSchema.index({ province: 1, status: 1 });
jobSchema.index({ category: 1, status: 1 });
jobSchema.index({ title: 'text', company: 'text', location: 'text', province: 'text' });

jobSchema.pre('save', function (next) {
  if (!this.slug || this.isModified('title') || this.isModified('location') || this.isModified('province')) {
    this.slug = jobSlug(this.title, this.province || this.location || '');
  }
  next();
});

export const Job = mongoose.model('Job', jobSchema);
