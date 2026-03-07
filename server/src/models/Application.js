import mongoose from 'mongoose';

const applicationSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
    resumeURL: { type: String },
    coverLetter: { type: String },
    status: {
      type: String,
      enum: ['submitted', 'applied', 'viewed', 'shortlisted', 'rejected', 'interview', 'hired'],
      default: 'submitted',
    },
    appliedDate: { type: Date, default: Date.now },
    note: { type: String },
  },
  { timestamps: true }
);

applicationSchema.index({ userId: 1, jobId: 1 }, { unique: true });
applicationSchema.index({ jobId: 1, status: 1 });

export const Application = mongoose.model('Application', applicationSchema);
