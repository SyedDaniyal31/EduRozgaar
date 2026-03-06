import mongoose from 'mongoose';

const scraperConfigSchema = new mongoose.Schema(
  {
    sourceKey: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    enabled: { type: Boolean, default: true },
    lastRunAt: { type: Date },
    lastJobCount: { type: Number, default: 0 },
    runIntervalHours: { type: Number, default: 6 },
  },
  { timestamps: true }
);

scraperConfigSchema.index({ enabled: 1 });

export const ScraperConfig = mongoose.model('ScraperConfig', scraperConfigSchema);
