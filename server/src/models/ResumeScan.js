import mongoose from 'mongoose';

const resumeScanSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, enum: ['scan', 'cover_letter'], default: 'scan' },
    jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Job' },
    generatedCoverLetter: { type: String },
    extracted: {
      skills: [{ type: String }],
      education: [{ type: String }],
      experience: [{ type: String }],
    },
    jobIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Job' }],
    matchedSkills: [{ jobId: mongoose.Schema.Types.ObjectId, matched: [String] }],
    suggestions: [{ type: String }],
  },
  { timestamps: true }
);

resumeScanSchema.index({ userId: 1, createdAt: -1 });

export const ResumeScan = mongoose.model('ResumeScan', resumeScanSchema);
