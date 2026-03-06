import mongoose from 'mongoose';

const scraperRunSchema = new mongoose.Schema(
  {
    runAt: { type: Date, default: Date.now },
    status: { type: String, enum: ['running', 'success', 'partial', 'failed'], default: 'running' },
    jobsAdded: { type: Number, default: 0 },
    admissionsAdded: { type: Number, default: 0 },
    jobsSkipped: { type: Number, default: 0 },
    admissionsSkipped: { type: Number, default: 0 },
    sources: [{ type: String }],
    errors: [{ type: String }],
    durationMs: { type: Number },
  },
  { timestamps: true }
);

scraperRunSchema.index({ runAt: -1 });

export const ScraperRun = mongoose.model('ScraperRun', scraperRunSchema);
