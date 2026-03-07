import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const employerSchema = new mongoose.Schema(
  {
    companyName: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, trim: true, lowercase: true },
    phone: { type: String, trim: true, default: '' },
    website: { type: String, trim: true, default: '' },
    companyDescription: { type: String, trim: true, default: '' },
    password: { type: String, required: true, select: false },
    verified: { type: Boolean, default: false },
    totalJobsPosted: { type: Number, default: 0 },
  },
  { timestamps: true }
);

employerSchema.index({ email: 1 });

employerSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

employerSchema.methods.comparePassword = function (candidate) {
  return bcrypt.compare(candidate, this.password);
};

export const Employer = mongoose.model('Employer', employerSchema);
