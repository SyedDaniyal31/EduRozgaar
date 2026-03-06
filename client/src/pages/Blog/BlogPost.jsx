import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { blogsApi } from '../../services/listingsService';
import { ROUTES } from '../../constants';
import { SAMPLE_BLOGS } from '../../constants/seedData';

function ShareButtons({ title, url }) {
  const encodedUrl = encodeURIComponent(url || window.location.href);
  const encodedTitle = encodeURIComponent(title || '');
  const text = encodeURIComponent(`${title} – EduRozgaar`);

  return (
    <div className="flex flex-wrap gap-2 mt-6">
      <a
        href={`https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1 px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 text-sm"
      >
        Share on X
      </a>
      <a
        href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1 px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 text-sm"
      >
        Facebook
      </a>
      <a
        href={`https://wa.me/?text=${text}%20${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1 px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 text-sm"
      >
        WhatsApp
      </a>
      <button
        type="button"
        onClick={() => {
          navigator.clipboard?.writeText(url || window.location.href);
        }}
        className="inline-flex items-center gap-1 px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 text-sm"
      >
        Copy link
      </button>
    </div>
  );
}

export default function BlogPost() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!slug) return;
    blogsApi.get(slug)
      .then(({ data }) => setPost(data))
      .catch(() => {
        const sample = SAMPLE_BLOGS.find((p) => p.slug === slug);
        setPost(sample ? { title: sample.title, excerpt: sample.excerpt, content: sample.excerpt, slug: sample.slug } : null);
        setError(sample ? null : 'Not found');
      })
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12">
        <div className="animate-pulse h-8 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4" />
        <div className="animate-pulse h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2" />
        <div className="animate-pulse h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3" />
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Post not found</h1>
        <Link to={ROUTES.BLOG} className="text-primary dark:text-mint mt-4 inline-block">← Back to Blog</Link>
      </div>
    );
  }

  const canonicalUrl = `${import.meta.env.VITE_APP_URL || 'https://edurozgaar.pk'}${ROUTES.BLOG}/${post.slug}`;

  return (
    <>
      <Helmet>
        <title>{post.title} – Blog – EduRozgaar</title>
        <meta name="description" content={post.excerpt || post.title} />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.excerpt || post.title} />
        <meta property="og:url" content={canonicalUrl} />
      </Helmet>
      <article className="max-w-3xl mx-auto px-4 py-8">
        <Link to={ROUTES.BLOG} className="text-sm text-primary dark:text-mint hover:underline mb-4 inline-block">← Back to Blog</Link>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{post.title}</h1>
        {post.publishedAt && (
          <p className="text-gray-500 dark:text-gray-400 mt-2">{new Date(post.publishedAt).toLocaleDateString()}</p>
        )}
        {post.tags?.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {post.tags.map((t) => (
              <span key={t} className="text-xs px-2 py-0.5 rounded bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300">{t}</span>
            ))}
          </div>
        )}
        <div className="prose dark:prose-invert mt-6 text-gray-700 dark:text-gray-300 whitespace-pre-wrap max-w-none">
          {post.content || post.excerpt}
        </div>
        <ShareButtons title={post.title} url={canonicalUrl} />
      </article>
    </>
  );
}
