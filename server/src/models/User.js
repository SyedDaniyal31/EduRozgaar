import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, trim: true, default: '' },
    email: { type: String, required: true, unique: true, trim: true, lowercase: true },
    password: { type: String, required: true, select: false },
    role: { type: String, enum: ['Admin', 'User'], default: 'User' },
    province: { type: String, trim: true, default: '' },
    interests: {
      type: [String],
      default: [],
      // Integration: job/scholarship/admission categories for AI recommendation engine & notification filters
    },
    notifications: {
      email: { type: Boolean, default: true },
      push: { type: Boolean, default: false },
      whatsapp: { type: Boolean, default: false },
      telegram: { type: Boolean, default: false },
    },
    refreshToken: { type: String, select: false },
    refreshTokenExpires: { type: Date, select: false },
    lastLoginAt: { type: Date },
    savedJobs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Job' }],
    savedScholarships: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Scholarship' }],
    savedAdmissions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Admission' }],
    recentlyViewedJobs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Job' }],
    recentlyViewedScholarships: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Scholarship' }],
    recentlyViewedAdmissions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Admission' }],
    fcmToken: { type: String, select: false },
    preferredLanguage: { type: String, enum: ['en', 'ur'], default: 'en' },
    // OAuth: googleId, avatar (future GOOGLE_CLIENT_ID integration)
  },
  { timestamps: true }
);

userSchema.index({ email: 1 });
userSchema.index({ role: 1 });

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = function (candidate) {
  return bcrypt.compare(candidate, this.password);
};

export const User = mongoose.model('User', userSchema);
