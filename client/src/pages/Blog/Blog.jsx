import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { blogsApi } from '../../services/listingsService';
import { ROUTES } from '../../constants';
import { SAMPLE_BLOGS } from '../../constants/seedData';
import { ListingCardSkeleton } from '../../components/listings/ListingCardSkeleton';

export default function Blog() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    blogsApi.list({ limit: 30, status: 'published' })
      .then(({ data }) => setPosts(data?.data || []))
      .catch(() => setPosts([]))
      .finally(() => setLoading(false));
  }, []);

  const list = posts.length > 0 ? posts : SAMPLE_BLOGS.map((p) => ({ _id: p.id, title: p.title, slug: p.slug, excerpt: p.excerpt, publishedAt: p.date, createdAt: p.date }));

  return (
    <>
      <Helmet>
        <title>Blog – EduRozgaar Pakistan</title>
        <meta name="description" content="EduRozgaar blog – career tips, admission guides, and education news for Pakistan." />
      </Helmet>
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Blog</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">Tips, guides, and updates for students and job seekers. Auto-generated SEO posts from latest opportunities.</p>

        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <ListingCardSkeleton key={i} />
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {list.map((post) => (
              <Link
                key={post._id || post.slug}
                to={`${ROUTES.BLOG}/${post.slug}`}
                className="block p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:shadow-md transition-shadow"
              >
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{post.title}</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">{post.excerpt}</p>
                <p className="text-xs text-gray-500 mt-2">
                  {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString() : post.createdAt ? new Date(post.createdAt).toLocaleDateString() : ''}
                </p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
