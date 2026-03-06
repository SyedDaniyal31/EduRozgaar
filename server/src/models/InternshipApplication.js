import mongoose from 'mongoose';

const internshipApplicationSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    internshipId: { type: mongoose.Schema.Types.ObjectId, ref: 'Internship', required: true },
    status: { type: String, enum: ['applied', 'viewed', 'shortlisted', 'rejected'], default: 'applied' },
    appliedAt: { type: Date, default: Date.now },
    note: { type: String },
  },
  { timestamps: true }
);

internshipApplicationSchema.index({ userId: 1, internshipId: 1 }, { unique: true });
internshipApplicationSchema.index({ internshipId: 1 });

export const InternshipApplication = mongoose.model('InternshipApplication', internshipApplicationSchema);
