import mongoose from 'mongoose';

const webinarRegistrationSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    webinarId: { type: mongoose.Schema.Types.ObjectId, ref: 'Webinar', required: true },
    attended: { type: Boolean, default: false },
    registeredAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

webinarRegistrationSchema.index({ userId: 1, webinarId: 1 }, { unique: true });
webinarRegistrationSchema.index({ webinarId: 1 });

export const WebinarRegistration = mongoose.model('WebinarRegistration', webinarRegistrationSchema);
