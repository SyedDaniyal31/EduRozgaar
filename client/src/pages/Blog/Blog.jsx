import { Link } from 'react-router-dom';
import { SAMPLE_BLOGS } from '../../constants/seedData';
import { ROUTES } from '../../constants';

export default function Blog() {
  return (
    <>
      <meta name="description" content="EduRozgaar blog – career tips, admission guides, and education news for Pakistan." />
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Blog</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">Tips, guides, and updates for students and job seekers.</p>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {SAMPLE_BLOGS.map((post) => (
            <Link
              key={post.id}
              to={`${ROUTES.BLOG}/${post.slug}`}
              className="block p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:shadow-md transition-shadow"
            >
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{post.title}</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{post.excerpt}</p>
              <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">{post.date}</p>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
