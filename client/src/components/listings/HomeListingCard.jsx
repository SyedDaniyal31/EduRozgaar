import { Link } from 'react-router-dom';
import { formatDate, daysUntil } from '../../utils/formatDate';
import { SaveButton } from './SaveButton';
import { ROUTES } from '../../constants';

function JobCard({ job, saved, onSaveToggle }) {
  return (
    <Link
      to={`${ROUTES.JOBS}/${job.slug || job._id}`}
      className="block p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-primary/50 dark:hover:border-mint/50 transition-all duration-200 ease-out card-hover"
    >
      <div className="flex justify-between gap-2">
        <div className="min-w-0 flex-1">
          <h3 className="font-semibold text-gray-900 dark:text-white truncate">{job.title}</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-0.5">{job.organization || job.company}</p>
          <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
            {[job.province || job.location, job.category].filter(Boolean).join(' · ')}
          </p>
          {job.deadline && (
            <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">Deadline: {formatDate(job.deadline)}</p>
          )}
        </div>
        <div onClick={(e) => e.preventDefault()} className="shrink-0">
          <SaveButton type="job" id={job._id} saved={saved} onToggle={onSaveToggle} />
        </div>
      </div>
    </Link>
  );
}

function ScholarshipCard({ item, saved, onSaveToggle }) {
  return (
    <Link
      to={`${ROUTES.SCHOLARSHIPS}/${item.slug || item._id}`}
      className="block p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-primary/50 dark:hover:border-mint/50 transition-all duration-200 ease-out card-hover"
    >
      <div className="flex justify-between gap-2">
        <div className="min-w-0 flex-1">
          <h3 className="font-semibold text-gray-900 dark:text-white truncate">{item.title}</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-0.5">{item.provider}</p>
          <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
            {[item.level, item.country].filter(Boolean).join(' · ')}
          </p>
          {item.deadline && (
            <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">Deadline: {formatDate(item.deadline)}</p>
          )}
        </div>
        <div onClick={(e) => e.preventDefault()} className="shrink-0">
          <SaveButton type="scholarship" id={item._id} saved={saved} onToggle={onSaveToggle} />
        </div>
      </div>
    </Link>
  );
}

function AdmissionCard({ item, saved, onSaveToggle }) {
  const days = daysUntil(item.deadline);
  return (
    <Link
      to={`${ROUTES.ADMISSIONS}/${item.slug || item._id}`}
      className="block p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-primary/50 dark:hover:border-mint/50 transition-all duration-200 ease-out card-hover"
    >
      <div className="flex justify-between gap-2">
        <div className="min-w-0 flex-1">
          <h3 className="font-semibold text-gray-900 dark:text-white truncate">{item.program}</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-0.5">{item.institution}</p>
          <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">{item.department || item.province}</p>
          {item.deadline && (
            <p className="text-xs mt-1">
              {days != null && days >= 0 ? (
                <span className="text-amber-600 dark:text-amber-400">{days} days left</span>
              ) : (
                <span className="text-gray-500">Deadline: {formatDate(item.deadline)}</span>
              )}
            </p>
          )}
        </div>
        <div onClick={(e) => e.preventDefault()} className="shrink-0">
          <SaveButton type="admission" id={item._id} saved={saved} onToggle={onSaveToggle} />
        </div>
      </div>
    </Link>
  );
}

export function HomeJobCard(props) {
  return <JobCard {...props} />;
}
export function HomeScholarshipCard(props) {
  return <ScholarshipCard {...props} />;
}
export function HomeAdmissionCard(props) {
  return <AdmissionCard {...props} />;
}
