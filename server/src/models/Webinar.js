import mongoose from 'mongoose';

const webinarSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    slug: { type: String },
    description: { type: String },
    scheduledAt: { type: Date, required: true },
    durationMinutes: { type: Number, default: 60 },
    meetingUrl: { type: String },
    recordingUrl: { type: String },
    status: { type: String, enum: ['scheduled', 'live', 'recorded', 'cancelled'], default: 'scheduled' },
    isSponsored: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

webinarSchema.index({ scheduledAt: 1 });
webinarSchema.index({ status: 1 });

export const Webinar = mongoose.model('Webinar', webinarSchema);
