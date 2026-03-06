import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useParams } from 'react-router-dom';
import { ROUTES } from '../../constants';
import { seoApi } from '../../services/listingsService';
import { HomeScholarshipCard } from '../../components/listings/HomeListingCard';
import { ListingCardSkeleton } from '../../components/listings/ListingCardSkeleton';
import { useAuth } from '../../context/AuthContext';
import { scholarshipsApi, savedApi } from '../../services/listingsService';

const SITE_URL = import.meta.env.VITE_APP_URL || 'https://edurozgaar.pk';

export default function SEOScholarshipsPage() {
  const { country } = useParams();
  const { isAuthenticated } = useAuth();
  const [meta, setMeta] = useState(null);
  const [scholarships, setScholarships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savedIds, setSavedIds] = useState(new Set());

  useEffect(() => {
    if (!country) return;
    seoApi.scholarshipsIn(country)
      .then(({ data }) => {
        setMeta(data.meta);
        setScholarships(data.data || []);
      })
      .catch(() => setMeta({ title: 'Scholarships – EduRozgaar', description: 'Find scholarships.' }))
      .finally(() => setLoading(false));
  }, [country]);

  useEffect(() => {
    if (!isAuthenticated) return;
    savedApi.get().then(({ data }) => setSavedIds(new Set((data.savedScholarships || []).map((s) => s._id)))).catch(() => {});
  }, [isAuthenticated]);

  const handleSave = async (id, save) => {
    if (save) await scholarshipsApi.save(id);
    else await scholarshipsApi.unsave(id);
    setSavedIds((prev) => {
      const next = new Set(prev);
      if (save) next.add(id);
      else next.delete(id);
      return next;
    });
  };

  const canonical = meta?.canonical || `${SITE_URL}/scholarships-in-${country}`;

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
            {meta?.title?.split('|')[0]?.trim() || `Scholarships in ${country}`}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">{meta?.description}</p>
          <Link to={ROUTES.SCHOLARSHIPS} className="text-primary dark:text-mint hover:underline text-sm mt-2 inline-block">← All scholarships</Link>
        </div>
        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => <ListingCardSkeleton key={i} />)}
          </div>
        ) : scholarships.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {scholarships.map((item) => (
              <HomeScholarshipCard key={item._id} item={item} saved={savedIds.has(item._id)} onSaveToggle={handleSave} />
            ))}
          </div>
        ) : (
          <p className="text-gray-500 dark:text-gray-400">No scholarships found. <Link to={ROUTES.SCHOLARSHIPS} className="text-primary dark:text-mint">Browse all scholarships</Link></p>
        )}
      </div>
    </>
  );
}
