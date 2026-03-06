import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { examsApi } from '../../services/listingsService';
import { ROUTES } from '../../constants';

export default function ExamPrep() {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    examsApi.listExams()
      .then(({ data }) => setExams(data?.data || []))
      .catch(() => setExams([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <Helmet>
        <title>Exam Preparation – PPSC, FPSC, NTS, Punjab Police, WAPDA – EduRozgaar</title>
        <meta name="description" content="Government job exam preparation: syllabus, past papers, MCQs, and practice quizzes for PPSC, FPSC, NTS, Punjab Police, WAPDA." />
      </Helmet>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">Government Job Exam Preparation</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">Syllabus, past papers, model tests, and MCQs for PPSC, FPSC, NTS, Punjab Police, WAPDA and more.</p>

        {loading ? (
          <div className="grid sm:grid-cols-2 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : exams.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400">No exams added yet. Check back soon.</p>
        ) : (
          <div className="grid sm:grid-cols-2 gap-4">
            {exams.map((exam) => (
              <Link
                key={exam._id}
                to={ROUTES.EXAM_DETAIL.replace(':slug', exam.slug)}
                className="block p-6 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:shadow-md transition"
              >
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{exam.name}</h2>
                {exam.authority && <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{exam.authority}</p>}
                {exam.description && <p className="text-sm text-gray-600 dark:text-gray-300 mt-2 line-clamp-2">{exam.description}</p>}
              </Link>
            ))}
          </div>
        )}

        <div className="mt-8 flex gap-4">
          <Link to={ROUTES.DASHBOARD} className="text-sm text-emerald-600 dark:text-emerald-400 hover:underline">← Dashboard</Link>
        </div>
      </div>
    </>
  );
}
