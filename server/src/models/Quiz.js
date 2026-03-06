import mongoose from 'mongoose';

const quizSchema = new mongoose.Schema(
  {
    examId: { type: mongoose.Schema.Types.ObjectId, ref: 'Exam', required: true },
    title: { type: String, required: true },
    slug: { type: String },
    description: { type: String },
    durationMinutes: { type: Number, default: 30 },
    totalQuestions: { type: Number, default: 0 },
    status: { type: String, enum: ['draft', 'active'], default: 'active' },
  },
  { timestamps: true }
);

quizSchema.index({ examId: 1 });
quizSchema.index({ status: 1 });

export const Quiz = mongoose.model('Quiz', quizSchema);
