import mongoose from 'mongoose';

const newsletterLogSchema = new mongoose.Schema(
  {
    sentAt: { type: Date, default: Date.now },
    subscriberCount: { type: Number, default: 0 },
    sentCount: { type: Number, default: 0 },
    openCount: { type: Number, default: 0 },
    clickCount: { type: Number, default: 0 },
    subject: { type: String },
    summary: { type: String },
    status: { type: String, enum: ['sent', 'failed', 'partial'], default: 'sent' },
    errors: [{ type: String }],
  },
  { timestamps: true }
);

newsletterLogSchema.index({ sentAt: -1 });

export const NewsletterLog = mongoose.model('NewsletterLog', newsletterLogSchema);
