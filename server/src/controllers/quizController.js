import mongoose from 'mongoose';
import { Quiz } from '../models/Quiz.js';
import { Mcq } from '../models/Mcq.js';
import { QuizAttempt } from '../models/QuizAttempt.js';
import { UserBadge } from '../models/UserBadge.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const submitQuiz = asyncHandler(async (req, res) => {
  const { quizId, answers, durationSeconds } = req.body || {};
  const userId = req.user?.userId;
  if (!userId) return res.status(401).json({ error: 'Unauthorized' });
  if (!quizId || !Array.isArray(answers)) return res.status(400).json({ error: 'quizId and answers array required' });

  const quiz = await Quiz.findById(quizId).lean();
  if (!quiz) return res.status(404).json({ error: 'Quiz not found' });
  const mcqs = await Mcq.find({ quizId, status: 'active' }).sort({ createdAt: 1 }).lean();
  if (!mcqs.length) return res.status(400).json({ error: 'Quiz has no questions' });

  let correctCount = 0;
  const results = answers.map((selectedIndex, i) => {
    const q = mcqs[i];
    const correct = q && selectedIndex === q.correctIndex;
    if (correct) correctCount++;
    return { questionIndex: i, selectedIndex, correct: !!correct };
  });

  const totalQuestions = mcqs.length;
  const score = totalQuestions ? Math.round((correctCount / totalQuestions) * 100) : 0;

  await QuizAttempt.create({
    userId,
    quizId,
    examId: quiz.examId,
    score,
    totalQuestions,
    correctCount,
    durationSeconds: durationSeconds || null,
    answers: results,
  });

  if (score >= 80) {
    await UserBadge.findOneAndUpdate(
      { userId, badgeType: 'quiz_80' },
      { $setOnInsert: { userId, badgeType: 'quiz_80', name: 'High Scorer', description: 'Scored 80% or above on a quiz', earnedAt: new Date() } },
      { upsert: true }
    );
  }
  if (score === 100) {
    await UserBadge.findOneAndUpdate(
      { userId, badgeType: 'quiz_perfect' },
      { $setOnInsert: { userId, badgeType: 'quiz_perfect', name: 'Perfect Score', description: 'Scored 100% on a quiz', earnedAt: new Date() } },
      { upsert: true }
    );
  }

  res.json({
    score,
    correctCount,
    totalQuestions,
    percentage: score,
    results: results.map((r) => ({ questionIndex: r.questionIndex, correct: r.correct })),
  });
});

export const getLeaderboard = asyncHandler(async (req, res) => {
  const { quizId, examId, limit = 20 } = req.query;
  const match = {};
  if (quizId) match.quizId = new mongoose.Types.ObjectId(quizId);
  if (examId) match.examId = new mongoose.Types.ObjectId(examId);
  const leaderboard = await QuizAttempt.aggregate([
    { $match: Object.keys(match).length ? match : {} },
    { $sort: { score: -1, durationSeconds: 1 } },
    { $limit: Math.min(50, parseInt(limit, 10) || 20) },
    {
      $lookup: {
        from: 'users',
        localField: 'userId',
        foreignField: '_id',
        as: 'user',
        pipeline: [{ $project: { name: 1 } }],
      },
    },
    { $unwind: { path: '$user', preserveNullAndEmptyArrays: true } },
    { $project: { userId: 1, score: 1, totalQuestions: 1, correctCount: 1, completedAt: 1, name: '$user.name' } },
  ]);
  res.json({ data: leaderboard });
});

export const getMyProgress = asyncHandler(async (req, res) => {
  const userId = req.user?.userId;
  if (!userId) return res.status(401).json({ error: 'Unauthorized' });
  const [attempts, badges] = await Promise.all([
    QuizAttempt.find({ userId }).sort({ completedAt: -1 }).limit(50).populate('quizId', 'title').populate('examId', 'name').lean(),
    UserBadge.find({ userId }).sort({ earnedAt: -1 }).lean(),
  ]);
  res.json({ attempts, badges });
});
