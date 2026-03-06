import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../constants';
import { SearchBar } from '../../components/ui/SearchBar';
import { trendingApi, jobsApi, scholarshipsApi, admissionsApi, savedApi, recommendationsApi } from '../../services/listingsService';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { HomeJobCard, HomeScholarshipCard, HomeAdmissionCard } from '../../components/listings/HomeListingCard';
import { ListingCardSkeleton } from '../../components/listings/ListingCardSkeleton';
import { AdBanner, AdInFeed } from '../../components/ads';

const SECTION_LIMIT = 6;
const SKELETON_COUNT = 3;

const SITE_URL = import.meta.env.VITE_APP_URL || 'https://edurozgaar.pk';
const DEFAULT_DESCRIPTION = "EduRozgaar – Pakistan's job and education portal. Find jobs, scholarships, admissions, and study abroad opportunities.";

export default function Home() {
  const { isAuthenticated } = useAuth();
  const { t } = useLanguage();
  const [trendingJobs, setTrendingJobs] = useState([]);
  const [trendingScholarships, setTrendingScholarships] = useState([]);
  const [trendingAdmissions, setTrendingAdmissions] = useState([]);
  const [featuredJobs, setFeaturedJobs] = useState([]);
  const [latestScholarships, setLatestScholarships] = useState([]);
  const [admissionDeadlines, setAdmissionDeadlines] = useState([]);
  const [recommended, setRecommended] = useState({ jobs: [], scholarships: [], admissions: [] });
  const [loadingTrending, setLoadingTrending] = useState(true);
  const [loadingFeatured, setLoadingFeatured] = useState(true);
  const [loadingRecommended, setLoadingRecommended] = useState(false);
  const [savedIds, setSavedIds] = useState({ jobs: new Set(), scholarships: new Set(), admissions: new Set() });

  useEffect(() => {
    Promise.all([
      trendingApi.jobs().then((r) => setTrendingJobs((r.data?.data || r.data || []).slice(0, SECTION_LIMIT))).catch(() => setTrendingJobs([])),
      trendingApi.scholarships().then((r) => setTrendingScholarships((r.data?.data || r.data || []).slice(0, SECTION_LIMIT))).catch(() => setTrendingScholarships([])),
      trendingApi.admissions().then((r) => setTrendingAdmissions((r.data?.data || r.data || []).slice(0, SECTION_LIMIT))).catch(() => setTrendingAdmissions([])),
    ]).finally(() => setLoadingTrending(false));
  }, []);

  useEffect(() => {
    Promise.all([
      jobsApi.list({ limit: SECTION_LIMIT, sort: 'newest' }).then((r) => setFeaturedJobs(r.data?.data || r.data || [])).catch(() => setFeaturedJobs([])),
      scholarshipsApi.list({ limit: SECTION_LIMIT }).then((r) => setLatestScholarships(r.data?.data || r.data || [])).catch(() => setLatestScholarships([])),
      admissionsApi.list({ limit: SECTION_LIMIT, sort: 'deadline' }).then((r) => setAdmissionDeadlines(r.data?.data || r.data || [])).catch(() => setAdmissionDeadlines([])),
    ]).finally(() => setLoadingFeatured(false));
  }, []);

  useEffect(() => {
    if (!isAuthenticated) return;
    savedApi.get().then(({ data }) => {
      setSavedIds({
        jobs: new Set((data.savedJobs || []).map((j) => j._id)),
        scholarships: new Set((data.savedScholarships || []).map((s) => s._id)),
        admissions: new Set((data.savedAdmissions || []).map((a) => a._id)),
      });
    }).catch(() => {});
  }, [isAuthenticated]);

  useEffect(() => {
    if (!isAuthenticated) return;
    setLoadingRecommended(true);
    recommendationsApi.get().then(({ data }) => {
      setRecommended({
        jobs: data.jobs || [],
        scholarships: data.scholarships || [],
        admissions: data.admissions || [],
      });
    }).catch(() => setRecommended({ jobs: [], scholarships: [], admissions: [] })).finally(() => setLoadingRecommended(false));
  }, [isAuthenticated]);

  const handleSaveJob = async (id, save) => {
    if (save) await jobsApi.save(id);
    else await jobsApi.unsave(id);
    setSavedIds((prev) => {
      const next = new Set(prev.jobs);
      if (save) next.add(id);
      else next.delete(id);
      return { ...prev, jobs: next };
    });
  };
  const handleSaveScholarship = async (id, save) => {
    if (save) await scholarshipsApi.save(id);
    else await scholarshipsApi.unsave(id);
    setSavedIds((prev) => {
      const next = new Set(prev.scholarships);
      if (save) next.add(id);
      else next.delete(id);
      return { ...prev, scholarships: next };
    });
  };
  const handleSaveAdmission = async (id, save) => {
    if (save) await admissionsApi.save(id);
    else await admissionsApi.unsave(id);
    setSavedIds((prev) => {
      const next = new Set(prev.admissions);
      if (save) next.add(id);
      else next.delete(id);
      return { ...prev, admissions: next };
    });
  };

  return (
    <>
      <Helmet>
        <title>EduRozgaar – Jobs & Education Portal Pakistan</title>
        <meta name="description" content={DEFAULT_DESCRIPTION} />
        <link rel="canonical" href={SITE_URL} />
        <meta property="og:title" content="EduRozgaar – Jobs & Education Portal Pakistan" />
        <meta property="og:description" content={DEFAULT_DESCRIPTION} />
        <meta property="og:url" content={SITE_URL} />
        <meta property="og:type" content="website" />
      </Helmet>

      <section className="bg-gradient-to-b from-emerald-50 to-white dark:from-gray-800 dark:to-gray-900 py-12 md:py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            {t('home.heroTitle')}
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            {t('home.heroSub')}
          </p>
          <SearchBar placeholder="Search jobs, scholarships, or programs..." className="max-w-xl mx-auto" />
        </div>
      </section>

      {isAuthenticated && (
        <section className="max-w-6xl mx-auto px-4 py-10 border-t border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">{t('home.recommendedForYou')}</h2>
          {loadingRecommended ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(3)].map((_, i) => (
                <ListingCardSkeleton key={i} />
              ))}
            </div>
          ) : (recommended.jobs.length + recommended.scholarships.length + recommended.admissions.length) > 0 ? (
            <div className="space-y-6">
              {recommended.jobs.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3">Jobs</h3>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {recommended.jobs.slice(0, 3).map((job) => (
                      <HomeJobCard key={job._id} job={job} saved={savedIds.jobs.has(job._id)} onSaveToggle={handleSaveJob} />
                    ))}
                  </div>
                  <Link to={ROUTES.JOBS} className="text-sm text-emerald-600 dark:text-emerald-400 mt-2 inline-block">{t('home.viewAll')} jobs →</Link>
                </div>
              )}
              {recommended.scholarships.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3">Scholarships</h3>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {recommended.scholarships.slice(0, 3).map((item) => (
                      <HomeScholarshipCard key={item._id} item={item} saved={savedIds.scholarships.has(item._id)} onSaveToggle={handleSaveScholarship} />
                    ))}
                  </div>
                  <Link to={ROUTES.SCHOLARSHIPS} className="text-sm text-emerald-600 dark:text-emerald-400 mt-2 inline-block">{t('home.viewAll')} scholarships →</Link>
                </div>
              )}
              {recommended.admissions.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3">Admissions</h3>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {recommended.admissions.slice(0, 3).map((item) => (
                      <HomeAdmissionCard key={item._id} item={item} saved={savedIds.admissions.has(item._id)} onSaveToggle={handleSaveAdmission} />
                    ))}
                  </div>
                  <Link to={ROUTES.ADMISSIONS} className="text-sm text-emerald-600 dark:text-emerald-400 mt-2 inline-block">{t('home.viewAll')} admissions →</Link>
                </div>
              )}
            </div>
          ) : null}
        </section>
      )}

      <section className="max-w-6xl mx-auto px-4 py-6">
        <AdBanner slotId="home-top" className="mb-6" />
      </section>
      <section className="max-w-6xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">{t('home.quickLinks')}</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { to: ROUTES.JOBS, label: 'Jobs' },
            { to: ROUTES.SCHOLARSHIPS, label: 'Scholarships' },
            { to: ROUTES.ADMISSIONS, label: 'Admissions' },
            { to: ROUTES.BLOG, label: 'Blog' },
          ].map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              className="p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:shadow-md transition-shadow"
            >
              <span className="font-semibold text-gray-900 dark:text-white">{label}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 py-10 border-t border-gray-200 dark:border-gray-700">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Trending Jobs</h2>
        {loadingTrending ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
              <ListingCardSkeleton key={i} />
            ))}
          </div>
        ) : trendingJobs.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {trendingJobs.map((job) => (
              <HomeJobCard key={job._id} job={job} saved={savedIds.jobs.has(job._id)} onSaveToggle={handleSaveJob} />
            ))}
          </div>
        ) : (
          <p className="text-gray-500 dark:text-gray-400">No trending jobs right now.</p>
        )}
        <div className="mt-6 text-center">
          <Link to={ROUTES.JOBS} className="text-emerald-600 dark:text-emerald-400 font-medium hover:underline">
            View all jobs →
          </Link>
        </div>
      </section>

      <AdInFeed slotId="home-mid" index={1} />

      <section className="max-w-6xl mx-auto px-4 py-10 border-t border-gray-200 dark:border-gray-700">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Featured Jobs</h2>
        {loadingFeatured ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
              <ListingCardSkeleton key={i} />
            ))}
          </div>
        ) : featuredJobs.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {featuredJobs.map((job) => (
              <HomeJobCard key={job._id} job={job} saved={savedIds.jobs.has(job._id)} onSaveToggle={handleSaveJob} />
            ))}
          </div>
        ) : (
          <p className="text-gray-500 dark:text-gray-400">No featured jobs.</p>
        )}
        <div className="mt-6 text-center">
          <Link to={ROUTES.JOBS} className="text-emerald-600 dark:text-emerald-400 font-medium hover:underline">
            View all jobs →
          </Link>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 py-10 border-t border-gray-200 dark:border-gray-700">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Latest Scholarships</h2>
        {loadingFeatured ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
              <ListingCardSkeleton key={i} />
            ))}
          </div>
        ) : latestScholarships.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {latestScholarships.map((item) => (
              <HomeScholarshipCard key={item._id} item={item} saved={savedIds.scholarships.has(item._id)} onSaveToggle={handleSaveScholarship} />
            ))}
          </div>
        ) : (
          <p className="text-gray-500 dark:text-gray-400">No scholarships.</p>
        )}
        <div className="mt-6 text-center">
          <Link to={ROUTES.SCHOLARSHIPS} className="text-emerald-600 dark:text-emerald-400 font-medium hover:underline">
            View all scholarships →
          </Link>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 py-10 border-t border-gray-200 dark:border-gray-700">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Admission Deadlines</h2>
        {loadingFeatured ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
              <ListingCardSkeleton key={i} />
            ))}
          </div>
        ) : admissionDeadlines.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {admissionDeadlines.map((item) => (
              <HomeAdmissionCard key={item._id} item={item} saved={savedIds.admissions.has(item._id)} onSaveToggle={handleSaveAdmission} />
            ))}
          </div>
        ) : (
          <p className="text-gray-500 dark:text-gray-400">No admissions.</p>
        )}
        <div className="mt-6 text-center">
          <Link to={ROUTES.ADMISSIONS} className="text-emerald-600 dark:text-emerald-400 font-medium hover:underline">
            View all admissions →
          </Link>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 py-10 border-t border-gray-200 dark:border-gray-700">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Trending Scholarships</h2>
        {loadingTrending ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
              <ListingCardSkeleton key={i} />
            ))}
          </div>
        ) : trendingScholarships.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {trendingScholarships.map((item) => (
              <HomeScholarshipCard key={item._id} item={item} saved={savedIds.scholarships.has(item._id)} onSaveToggle={handleSaveScholarship} />
            ))}
          </div>
        ) : (
          <p className="text-gray-500 dark:text-gray-400">No trending scholarships.</p>
        )}
        <div className="mt-6 text-center">
          <Link to={ROUTES.SCHOLARSHIPS} className="text-emerald-600 dark:text-emerald-400 font-medium hover:underline">
            View all scholarships →
          </Link>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 py-10 border-t border-gray-200 dark:border-gray-700">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Upcoming Admissions</h2>
        {loadingTrending ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
              <ListingCardSkeleton key={i} />
            ))}
          </div>
        ) : trendingAdmissions.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {trendingAdmissions.map((item) => (
              <HomeAdmissionCard key={item._id} item={item} saved={savedIds.admissions.has(item._id)} onSaveToggle={handleSaveAdmission} />
            ))}
          </div>
        ) : (
          <p className="text-gray-500 dark:text-gray-400">No upcoming admissions.</p>
        )}
        <div className="mt-6 text-center">
          <Link to={ROUTES.ADMISSIONS} className="text-emerald-600 dark:text-emerald-400 font-medium hover:underline">
            View all admissions →
          </Link>
        </div>
      </section>
    </>
  );
}
