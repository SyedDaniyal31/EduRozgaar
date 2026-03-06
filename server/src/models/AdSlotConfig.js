import mongoose from 'mongoose';

const adSlotSchema = new mongoose.Schema(
  {
    slotId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    placement: { type: String, enum: ['banner_top', 'sidebar', 'in_feed', 'banner_bottom', 'header'], default: 'sidebar' },
    dimensions: { type: String },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

adSlotSchema.index({ slotId: 1 });
adSlotSchema.index({ placement: 1 });

export const AdSlotConfig = mongoose.model('AdSlotConfig', adSlotSchema);
