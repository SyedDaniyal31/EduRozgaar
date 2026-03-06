import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useParams, useLocation } from 'react-router-dom';
import { ROUTES } from '../../constants';
import { seoApi } from '../../services/listingsService';
import { HomeJobCard } from '../../components/listings/HomeListingCard';
import { ListingCardSkeleton } from '../../components/listings/ListingCardSkeleton';
import { useAuth } from '../../context/AuthContext';
import { jobsApi, savedApi } from '../../services/listingsService';

const SITE_URL = import.meta.env.VITE_APP_URL || 'https://edurozgaar.pk';

export default function SEOJobsPage() {
  const { slug: paramSlug } = useParams();
  const location = useLocation();
  const pathSlug = (location.pathname || '').replace(/^\//, '').split('?')[0];
  const slug = paramSlug || pathSlug;
  const { isAuthenticated } = useAuth();
  const [meta, setMeta] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savedIds, setSavedIds] = useState(new Set());

  const isCategory = ['government-jobs', 'private-jobs', 'internship-jobs'].includes(slug);

  useEffect(() => {
    if (!slug) return;
    const api = isCategory ? () => seoApi.jobsByCategory(slug) : () => seoApi.jobsIn(slug);
    api()
      .then(({ data }) => {
        setMeta(data.meta);
        setJobs(data.data || []);
      })
      .catch(() => setMeta({ title: 'Jobs – EduRozgaar', description: 'Find jobs in Pakistan.' }))
      .finally(() => setLoading(false));
  }, [slug, isCategory]);

  useEffect(() => {
    if (!isAuthenticated) return;
    savedApi.get().then(({ data }) => setSavedIds(new Set((data.savedJobs || []).map((j) => j._id)))).catch(() => {});
  }, [isAuthenticated]);

  const handleSave = async (id, save) => {
    if (save) await jobsApi.save(id);
    else await jobsApi.unsave(id);
    setSavedIds((prev) => {
      const next = new Set(prev);
      if (save) next.add(id);
      else next.delete(id);
      return next;
    });
  };

  const canonical = meta?.canonical || `${SITE_URL}/${isCategory ? slug : `jobs-in-${slug}`}`;

  return (
    <>
      {meta && (
        <Helmet>
          <title>{meta.title}</title>
          <meta name="description" content={meta.description} />
          <link rel="canonical" href={canonical} />
          <meta property="og:title" content={meta.title} />
          <meta property="og:description" content={meta.description} />
          <meta property="og:url" content={canonical} />
          <meta property="og:type" content="website" />
        </Helmet>
      )}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
            {meta?.title?.split('|')[0]?.trim() || (isCategory ? slug.replace(/-/g, ' ') : `Jobs in ${slug}`)}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">{meta?.description}</p>
          <Link to={ROUTES.JOBS} className="text-primary dark:text-mint hover:underline text-sm mt-2 inline-block">← All jobs</Link>
        </div>
        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => <ListingCardSkeleton key={i} />)}
          </div>
        ) : jobs.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {jobs.map((job) => (
              <HomeJobCard key={job._id} job={job} saved={savedIds.has(job._id)} onSaveToggle={handleSave} showBadge />
            ))}
          </div>
        ) : (
          <p className="text-gray-500 dark:text-gray-400">No jobs found. <Link to={ROUTES.JOBS} className="text-primary dark:text-mint">Browse all jobs</Link></p>
        )}
      </div>
    </>
  );
}
