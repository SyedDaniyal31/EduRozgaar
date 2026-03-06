import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { v1Api } from '../../services/listingsService';
import { ROUTES } from '../../constants';

export default function JobsCategoryLanding() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [meta, setMeta] = useState(null);

  useEffect(() => {
    if (!slug) return;
    v1Api.landingPage('category', slug).then(({ data }) => {
      setMeta(data?.meta);
      navigate(`${ROUTES.JOBS}?category=${encodeURIComponent(slug)}`, { replace: true });
    }).catch(() => navigate(ROUTES.JOBS, { replace: true }));
  }, [slug, navigate]);

  if (!meta) return null;
  return (
    <>
      <Helmet>
        <title>{meta.title}</title>
        <meta name="description" content={meta.description} />
        <link rel="canonical" href={meta.canonical} />
      </Helmet>
      <div className="min-h-[40vh] flex items-center justify-center text-gray-500">Loading...</div>
    </>
  );
}
