import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../constants';

const faqs = [
  { q: 'Is EduRozgaar free to use?', a: 'Yes. Browsing jobs, scholarships, and admissions is free. Creating an account to save listings and apply is also free.' },
  { q: 'Do I need an account to apply for jobs?', a: 'For jobs that allow internal application on EduRozgaar, you need an account. For external links (e.g. PPSC, FPSC), you can follow the link without an account.' },
  { q: 'How often are listings updated?', a: 'We update listings regularly. Jobs from our automated scrapers run every 6 hours; manually added listings appear as soon as they are published.' },
  { q: 'How do I get scholarship or job alerts?', a: 'Subscribe to our email newsletter from the footer or homepage. You can choose daily or weekly digests. Telegram and WhatsApp alerts are also available.' },
  { q: 'Can I submit a job or scholarship opportunity?', a: 'Yes. Use our Submit Opportunity page to suggest a listing. Our team will review and add it if it meets our guidelines.' },
  { q: 'How do I report an error or inappropriate content?', a: 'Use the Report Issue link in the footer or contact us with the listing URL and description. We take reports seriously and will act accordingly.' },
];

export default function FAQ() {
  return (
    <>
      <Helmet>
        <title>FAQ – EduRozgaar</title>
        <meta name="description" content="Frequently asked questions about using EduRozgaar for jobs, scholarships, and admissions." />
      </Helmet>
      <div className="max-w-3xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Frequently Asked Questions</h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
          Quick answers to common questions about EduRozgaar and how to make the most of the platform.
        </p>
        <dl className="space-y-6">
          {faqs.map((item, i) => (
            <div key={i} className="p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50">
              <dt className="font-semibold text-gray-900 dark:text-white mb-2">{item.q}</dt>
              <dd className="text-gray-600 dark:text-gray-300 text-sm">{item.a}</dd>
            </div>
          ))}
        </dl>
        <p className="mt-8 text-gray-600 dark:text-gray-400">
          Still have questions? <Link to={ROUTES.CONTACT} className="text-primary dark:text-mint hover:underline">Contact us</Link>.
        </p>
      </div>
    </>
  );
}
