import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useParams } from 'react-router-dom';
import { jobsApi, savedApi, recentViewedApi, coverLetterApi } from '../../services/listingsService';
import { ROUTES } from '../../constants';
import { SaveButton } from '../../components/listings/SaveButton';
import { ListingCardSkeleton } from '../../components/listings/ListingCardSkeleton';
import { Alert } from '../../components/ui/Alerts';
import { formatDate } from '../../utils/formatDate';
import { useAuth } from '../../context/AuthContext';

export default function JobDetail() {
  const { slug } = useParams();
  const { isAuthenticated } = useAuth();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [savedIds, setSavedIds] = useState(new Set());
  const [coverLetter, setCoverLetter] = useState(null);
  const [coverLetterLoading, setCoverLetterLoading] = useState(false);

  useEffect(() => {
    jobsApi.get(slug).then(({ data }) => {
      setJob(data);
      if (isAuthenticated && data?._id) recentViewedApi.record('job', data._id).catch(() => {});
    }).catch((err) => setError(err.response?.data?.error || 'Failed to load')).finally(() => setLoading(false));
  }, [slug, isAuthenticated]);

  useEffect(() => {
    if (!isAuthenticated) return;
    savedApi.get().then(({ data: d }) => setSavedIds(new Set((d.savedJobs || []).map((j) => j._id)))).catch(() => {});
  }, [isAuthenticated]);

  const handleSaveToggle = async (id, save) => {
    if (save) await jobsApi.save(id);
    else await jobsApi.unsave(id);
    setSavedIds((prev) => {
      const next = new Set(prev);
      if (save) next.add(id);
      else next.delete(id);
      return next;
    });
  };

  if (loading) return <div className="max-w-3xl mx-auto px-4 py-8"><ListingCardSkeleton /></div>;
  if (error || !job) return <div className="max-w-3xl mx-auto px-4 py-8"><Alert variant="error">{error || 'Job not found'}</Alert><Link to={ROUTES.JOBS} className="text-emerald-600 dark:text-emerald-400 mt-4 inline-block">← Back to Jobs</Link></div>;

  const related = job.related || [];

  const canonicalUrl = `${import.meta.env.VITE_APP_URL || 'https://edurozgaar.pk'}${ROUTES.JOBS}/${job.slug || job._id}`;
  const jobSchema = {
    '@context': 'https://schema.org',
    '@type': 'JobPosting',
    title: job.title,
    description: job.description || `${job.title} at ${job.organization || job.company}`,
    datePosted: job.createdAt,
    validThrough: job.deadline,
    hiringOrganization: { '@type': 'Organization', name: job.organization || job.company },
    jobLocation: job.province || job.location ? { '@type': 'Place', address: { addressRegion: job.province || job.location } } : undefined,
    employmentType: job.type || 'FULL_TIME',
  };
  return (
    <>
      <Helmet>
        <title>{job.title} – Jobs – EduRozgaar</title>
        <meta name="description" content={job.description || `${job.title} at ${job.organization || job.company}`} />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:title" content={`${job.title} – EduRozgaar`} />
        <script type="application/ld+json">{JSON.stringify(jobSchema)}</script>
        <meta property="og:description" content={job.description || `${job.title} at ${job.organization || job.company}`} />
        <meta property="og:url" content={canonicalUrl} />
      </Helmet>
      <article className="max-w-3xl mx-auto px-4 py-6 md:py-8">
        <Link to={ROUTES.JOBS} className="text-sm text-emerald-600 dark:text-emerald-400 hover:underline mb-4 inline-block">← Back to Jobs</Link>
        <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 md:p-8">
          {job.logoUrl && <div className="h-12 w-12 rounded-lg bg-gray-100 dark:bg-gray-700 mb-4 flex items-center justify-center text-xs text-gray-400">Logo</div>}
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">{job.title}</h1>
              <p className="text-lg text-gray-600 dark:text-gray-400 mt-1">{job.organization || job.company}</p>
              <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
                {[job.province || job.location, job.category, job.type].filter(Boolean).join(' · ')}
              </p>
              {job.deadline && <p className="text-sm text-amber-600 dark:text-amber-400 mt-2">Deadline: {formatDate(job.deadline)}</p>}
            </div>
            <div className="flex flex-wrap gap-2">
              <SaveButton type="job" id={job._id} saved={savedIds.has(job._id)} onToggle={handleSaveToggle} />
              {isAuthenticated && (
                <button
                  type="button"
                  onClick={async () => {
                    setCoverLetterLoading(true);
                    setCoverLetter(null);
                    try {
                      const { data } = await coverLetterApi.generate(job._id);
                      setCoverLetter(data.coverLetter);
                    } catch (e) {
                      window.alert(e.response?.data?.error || 'Failed to generate');
                    } finally {
                      setCoverLetterLoading(false);
                    }
                  }}
                  disabled={coverLetterLoading}
                  className="inline-flex items-center px-4 py-2 rounded-lg border border-emerald-600 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 font-medium disabled:opacity-50"
                >
                  {coverLetterLoading ? 'Generating…' : 'Generate cover letter'}
                </button>
              )}
              <a href={job.applicationLink || '#'} className="inline-flex items-center px-4 py-2 rounded-lg bg-emerald-600 text-white font-medium hover:bg-emerald-700" target="_blank" rel="noopener noreferrer">Apply</a>
            </div>
            {coverLetter && (
              <section className="mt-6 p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Generated cover letter</h2>
                <pre className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap font-sans">{coverLetter}</pre>
              </section>
            )}
          </div>
          {job.description && (
            <section className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Description</h2>
              <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{job.description}</p>
            </section>
          )}
          {job.requirements && job.requirements.length > 0 && (
            <section className="mt-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Requirements</h2>
              <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-1">
                {job.requirements.map((r, i) => <li key={i}>{r}</li>)}
              </ul>
            </section>
          )}
          {job.applicationInstructions && (
            <section className="mt-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">How to Apply</h2>
              <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{job.applicationInstructions}</p>
            </section>
          )}
          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700 flex gap-2">
            <span className="text-sm text-gray-500 dark:text-gray-400">Share:</span>
            <button type="button" className="text-sm text-gray-600 dark:text-gray-400 hover:underline">Twitter</button>
            <button type="button" className="text-sm text-gray-600 dark:text-gray-400 hover:underline">LinkedIn</button>
            <button type="button" className="text-sm text-gray-600 dark:text-gray-400 hover:underline">WhatsApp</button>
          </div>
        </div>
        {related.length > 0 && (
          <section className="mt-10">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Related jobs</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {related.map((r) => (
                <Link key={r._id} to={`${ROUTES.JOBS}/${r.slug || r._id}`} className="block p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:shadow-md transition">
                  <h3 className="font-semibold text-gray-900 dark:text-white">{r.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{r.organization || r.company}</p>
                  <p className="text-xs text-gray-500 mt-1">{r.province || r.location} · {formatDate(r.deadline)}</p>
                </Link>
              ))}
            </div>
          </section>
        )}
      </article>
    </>
  );
}
