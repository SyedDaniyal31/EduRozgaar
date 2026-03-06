import mongoose from 'mongoose';

const pastPaperSchema = new mongoose.Schema(
  {
    examId: { type: mongoose.Schema.Types.ObjectId, ref: 'Exam', required: true },
    title: { type: String, required: true },
    year: { type: Number },
    subject: { type: String },
    fileUrl: { type: String },
    link: { type: String },
    status: { type: String, enum: ['draft', 'active'], default: 'active' },
  },
  { timestamps: true }
);

pastPaperSchema.index({ examId: 1 });
pastPaperSchema.index({ status: 1 });

export const PastPaper = mongoose.model('PastPaper', pastPaperSchema);
