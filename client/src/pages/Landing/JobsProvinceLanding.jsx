import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { v1Api } from '../../services/listingsService';
import { ROUTES } from '../../constants';

export default function JobsProvinceLanding() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [seo, setSeo] = useState(null);

  useEffect(() => {
    if (!slug) return;
    v1Api.landingPage('province', slug).then(({ data }) => {
      setSeo(data);
      navigate(`${ROUTES.JOBS}?province=${encodeURIComponent(slug)}`, { replace: true });
    }).catch(() => navigate(ROUTES.JOBS, { replace: true }));
  }, [slug, navigate]);

  if (!seo?.meta) return <div className="min-h-[40vh] flex items-center justify-center text-gray-500">Loading...</div>;
  const { meta, schema } = seo;
  return (
    <>
      <Helmet>
        <title>{meta.title}</title>
        <meta name="description" content={meta.description} />
        <link rel="canonical" href={meta.canonical} />
        <meta property="og:title" content={meta.og?.title} />
        <meta property="og:description" content={meta.og?.description} />
        <meta property="og:url" content={meta.og?.url} />
      </Helmet>
      {schema && <script type="application/ld+json">{JSON.stringify(schema)}</script>}
      <div className="min-h-[40vh] flex items-center justify-center text-gray-500">Loading...</div>
    </>
  );
}
