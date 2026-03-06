import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../constants';
import { ScrollReveal } from '../../components/ui/ScrollReveal';

const CAREER_ARTICLES = [
  { title: 'Choosing the Right Career Path', description: 'Understand your interests, skills, and market demand to decide your field.', to: ROUTES.BLOG, tag: 'Career' },
  { title: 'Skills That Employers Look For', description: 'Technical and soft skills that increase your employability in Pakistan.', to: ROUTES.BLOG, tag: 'Skills' },
  { title: 'How to Prepare for Job Interviews', description: 'Common questions, body language, and follow-up tips.', to: ROUTES.BLOG, tag: 'Jobs' },
  { title: 'FPSC & PPSC Exam Preparation', description: 'Syllabus, past papers, and time management for government exams.', to: ROUTES.EXAM_PREP, tag: 'Exam Prep' },
  { title: 'Building a Professional Network', description: 'LinkedIn, alumni networks, and industry events.', to: ROUTES.BLOG, tag: 'Career' },
  { title: 'First Job: What to Expect', description: 'Transition from student to professional life.', to: ROUTES.BLOG, tag: 'Career' },
];

const JOB_PREP_TIPS = [
  'Tailor your CV to each job description.',
  'Research the company before the interview.',
  'Prepare STAR (Situation, Task, Action, Result) examples.',
  'Follow up with a thank-you email after the interview.',
  'Keep learning: short courses and certifications help.',
];

export default function CareerGuidance() {
  return (
    <>
      <Helmet>
        <title>Career Guidance – EduRozgaar</title>
        <meta name="description" content="Career path articles, skills suggestions, and job preparation tips for Pakistani students." />
      </Helmet>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Link to={ROUTES.DASHBOARD} className="text-primary dark:text-mint hover:underline text-sm mb-6 inline-block">← Dashboard</Link>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Career Guidance</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-10">Articles, skills suggestions, and job preparation tips to help you succeed.</p>

        <ScrollReveal as="section" className="mb-12">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Career Path Articles</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {CAREER_ARTICLES.map((article) => (
              <Link
                key={article.title}
                to={article.to}
                className="block p-5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:shadow-md hover:border-primary/50 card-hover"
              >
                <span className="text-xs font-medium text-primary dark:text-mint">{article.tag}</span>
                <h3 className="font-semibold text-gray-900 dark:text-white mt-1">{article.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{article.description}</p>
              </Link>
            ))}
          </div>
        </ScrollReveal>

        <ScrollReveal as="section" className="mb-12">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Job Preparation Tips</h2>
          <ul className="space-y-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 list-disc list-inside text-gray-700 dark:text-gray-300">
            {JOB_PREP_TIPS.map((tip) => (
              <li key={tip}>{tip}</li>
            ))}
          </ul>
        </ScrollReveal>

        <ScrollReveal as="section">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Quick Links</h2>
          <div className="flex flex-wrap gap-3">
            <Link to={ROUTES.RESUME_BUILDER} className="px-4 py-2 rounded-xl bg-primary text-white font-medium hover:bg-primary-hover btn-theme">Resume Builder</Link>
            <Link to={ROUTES.RESUME_ANALYZER} className="px-4 py-2 rounded-xl border-2 border-primary text-primary dark:text-mint hover:bg-mint/20 btn-theme">Resume Analyzer</Link>
            <Link to={ROUTES.EXAM_PREP} className="px-4 py-2 rounded-xl border-2 border-primary text-primary dark:text-mint hover:bg-mint/20 btn-theme">Exam Prep</Link>
            <Link to={ROUTES.JOBS} className="px-4 py-2 rounded-xl border-2 border-primary text-primary dark:text-mint hover:bg-mint/20 btn-theme">Browse Jobs</Link>
          </div>
        </ScrollReveal>
      </div>
    </>
  );
}
