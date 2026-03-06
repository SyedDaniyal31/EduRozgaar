import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../constants';

export default function SubmitOpportunity() {
  return (
    <>
      <Helmet>
        <title>Submit Opportunity – EduRozgaar</title>
        <meta name="description" content="Submit a job, scholarship, or admission opportunity to EduRozgaar for review." />
      </Helmet>
      <div className="max-w-3xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Submit an Opportunity</h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
          Have a job, scholarship, or admission opportunity that would help Pakistani students? Submit it here and our team will review and consider adding it to EduRozgaar.
        </p>
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">What You Can Submit</h2>
          <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-300">
            <li>Job openings (government or private sector)</li>
            <li>Scholarship programs (local or international)</li>
            <li>University or college admission announcements</li>
            <li>Internship or training opportunities</li>
            <li>Webinars or workshops for students</li>
          </ul>
        </section>
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">What We Need</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-2">
            Please provide: title, organization name, location (if applicable), deadline or last date, official application link, and a short description. Submissions must be genuine and publicly verifiable.
          </p>
        </section>
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">How to Submit</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Send the details to us via our Contact page. Use the subject line “Submit Opportunity” and include all relevant links. We review submissions within a few business days and will add approved listings to the portal.
          </p>
          <Link to={ROUTES.CONTACT} className="inline-block px-4 py-2 rounded-lg bg-primary text-white font-medium hover:bg-primary-hover btn-theme">Go to Contact</Link>
        </section>
      </div>
    </>
  );
}
