import mongoose from 'mongoose';

const mcqSchema = new mongoose.Schema(
  {
    examId: { type: mongoose.Schema.Types.ObjectId, ref: 'Exam' },
    quizId: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz' },
    question: { type: String, required: true },
    options: [{ type: String, required: true }],
    correctIndex: { type: Number, required: true },
    subject: { type: String },
    status: { type: String, enum: ['draft', 'active'], default: 'active' },
  },
  { timestamps: true }
);

mcqSchema.index({ examId: 1 });
mcqSchema.index({ quizId: 1 });
mcqSchema.index({ status: 1 });

export const Mcq = mongoose.model('Mcq', mcqSchema);
