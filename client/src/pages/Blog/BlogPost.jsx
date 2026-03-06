import { useParams, Link } from 'react-router-dom';
import { SAMPLE_BLOGS } from '../../constants/seedData';
import { ROUTES } from '../../constants';

export default function BlogPost() {
  const { slug } = useParams();
  const post = SAMPLE_BLOGS.find((p) => p.slug === slug);

  if (!post) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Post not found</h1>
        <Link to={ROUTES.BLOG} className="text-emerald-600 dark:text-emerald-400 mt-4 inline-block">← Back to Blog</Link>
      </div>
    );
  }

  return (
    <>
      <meta name="description" content={post.excerpt} />
      <article className="max-w-3xl mx-auto px-4 py-8">
        <Link to={ROUTES.BLOG} className="text-sm text-emerald-600 dark:text-emerald-400 hover:underline mb-4 inline-block">← Back to Blog</Link>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{post.title}</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2">{post.date}</p>
        <div className="prose dark:prose-invert mt-6 text-gray-700 dark:text-gray-300">
          <p>{post.excerpt}</p>
          <p>Full article content will be loaded from API in the next phase.</p>
        </div>
      </article>
    </>
  );
}
