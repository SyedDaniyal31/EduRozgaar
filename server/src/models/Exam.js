import mongoose from 'mongoose';
import { examSlug } from '../utils/slugify.js';

const examSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    code: { type: String },
    description: { type: String },
    syllabus: { type: String },
    authority: { type: String },
    status: { type: String, enum: ['draft', 'active'], default: 'active' },
    isSponsored: { type: Boolean, default: false },
  },
  { timestamps: true }
);

examSchema.index({ slug: 1 });
examSchema.index({ status: 1 });

examSchema.pre('save', function (next) {
  if (!this.slug || this.isModified('name')) {
    this.slug = examSlug(this.name) || this.slug;
  }
  next();
});

export const Exam = mongoose.model('Exam', examSchema);
