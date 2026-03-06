import mongoose from 'mongoose';

const analyticsSchema = new mongoose.Schema(
  {
    eventType: { type: String, required: true }, // search, view, click, bookmark, notification_sent, notification_opened
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    listingType: { type: String, enum: ['job', 'scholarship', 'admission', 'blog', 'foreign_study'], default: null },
    listingId: { type: mongoose.Schema.Types.ObjectId },
    metadata: { type: mongoose.Schema.Types.Mixed },
  },
  { timestamps: true }
);

analyticsSchema.index({ eventType: 1, createdAt: -1 });
analyticsSchema.index({ userId: 1, createdAt: -1 });
analyticsSchema.index({ createdAt: -1 });

export const AnalyticsEvent = mongoose.model('AnalyticsEvent', analyticsSchema);
