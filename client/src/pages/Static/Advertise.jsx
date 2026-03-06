import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../constants';

export default function Advertise() {
  return (
    <>
      <Helmet>
        <title>Advertise With Us – EduRozgaar</title>
        <meta name="description" content="Reach students and job seekers across Pakistan. Advertise jobs, courses, or services on EduRozgaar." />
      </Helmet>
      <div className="max-w-3xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Advertise With Us</h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
          EduRozgaar reaches thousands of students and job seekers across Pakistan. Partner with us to promote your vacancies, courses, or services to an engaged audience.
        </p>
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Why Advertise on EduRozgaar?</h2>
          <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-300">
            <li>Targeted audience: students, graduates, and young professionals</li>
            <li>Nationwide reach with strong traffic from major cities</li>
            <li>Featured job and scholarship listings for higher visibility</li>
            <li>Flexible packages for employers, universities, and training providers</li>
          </ul>
        </section>
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">What You Can Promote</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-2">
            Job openings, internship programs, scholarship programs, university admissions, short courses, webinars, and education-related services.
          </p>
        </section>
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Get in Touch</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            For advertising inquiries, partnership opportunities, or to post a job, please contact us. We’ll respond within 1–2 business days.
          </p>
          <Link to={ROUTES.CONTACT} className="inline-block px-4 py-2 rounded-lg bg-primary text-white font-medium hover:bg-primary-hover btn-theme">Contact Us</Link>
        </section>
      </div>
    </>
  );
}
