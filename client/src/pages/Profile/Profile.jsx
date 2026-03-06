import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { authApi } from '../../services/authService';
import { savedApi } from '../../services/listingsService';
import { PROVINCES, INTEREST_CATEGORIES } from '../../constants/profileOptions';
import { Button } from '../../components/common/Button';
import { FormField } from '../../components/common/FormField';
import { Alert } from '../../components/ui/Alerts';
import { ROUTES } from '../../constants';
import { formatDate } from '../../utils/formatDate';

export default function Profile() {
  const { user, updateUser } = useAuth();
  const [name, setName] = useState('');
  const [province, setProvince] = useState('');
  const [interests, setInterests] = useState([]);
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    whatsapp: false,
    telegram: false,
  });
  const [preferredLanguage, setPreferredLanguage] = useState('en');
  const [savedJobs, setSavedJobs] = useState([]);
  const { setLang } = useLanguage();
  const [savedScholarships, setSavedScholarships] = useState([]);
  const [savedAdmissions, setSavedAdmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    authApi
      .getProfile()
      .then(({ data }) => {
        const u = data.user;
        setName(u.name || '');
        setProvince(u.province || '');
        setInterests(Array.isArray(u.interests) ? [...u.interests] : []);
        if (u.notifications) {
          setNotifications((n) => ({
            ...n,
            email: u.notifications.email ?? true,
            push: u.notifications.push ?? false,
            whatsapp: u.notifications.whatsapp ?? false,
            telegram: u.notifications.telegram ?? false,
          }));
        }
        setPreferredLanguage(u.preferredLanguage || 'en');
      })
      .catch(() => setMessage('Could not load profile.'))
      .finally(() => setLoading(false));

    savedApi.get().then(({ data }) => {
      setSavedJobs(data.savedJobs || []);
      setSavedScholarships(data.savedScholarships || []);
      setSavedAdmissions(data.savedAdmissions || []);
    }).catch(() => {});
  }, []);

  const toggleInterest = (item) => {
    setInterests((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    try {
      const { data } = await authApi.updateProfile({
        name,
        province,
        interests,
        notifications,
        preferredLanguage,
      });
      updateUser(data.user);
      setLang(preferredLanguage);
      setMessage('Profile updated.');
    } catch {
      setMessage('Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12 flex justify-center">
        <div className="animate-pulse text-gray-500 dark:text-gray-400">Loading profile...</div>
      </div>
    );
  }

  return (
    <>
      <meta name="description" content="Your EduRozgaar profile and preferences." />
      <div className="max-w-2xl mx-auto px-4 py-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">Profile</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-6">Manage your preferences and saved items.</p>

        {message && (
          <Alert variant={message.includes('updated') ? 'success' : 'error'} className="mb-6">
            {message}
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <FormField label="Name" id="profile-name">
            <input
              id="profile-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none"
            />
          </FormField>

          <FormField label="Province" id="profile-province">
            <select
              id="profile-province"
              value={province}
              onChange={(e) => setProvince(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none"
            >
              <option value="">Select province</option>
              {PROVINCES.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </FormField>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Interests (jobs, scholarships, admissions)
            </label>
            <div className="flex flex-wrap gap-2">
              {INTEREST_CATEGORIES.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => toggleInterest(item)}
                  className={`px-3 py-1.5 rounded-full text-sm border transition ${
                    interests.includes(item)
                      ? 'bg-emerald-600 text-white border-emerald-600 dark:bg-emerald-500 dark:border-emerald-500'
                      : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-emerald-500'
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          <FormField label="Preferred language" id="profile-lang">
            <select
              id="profile-lang"
              value={preferredLanguage}
              onChange={(e) => setPreferredLanguage(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none"
            >
              <option value="en">English</option>
              <option value="ur">Urdu</option>
            </select>
          </FormField>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Notification preferences
            </label>
            <div className="space-y-2">
              {[
                { key: 'email', label: 'Email' },
                { key: 'push', label: 'Push (placeholder)' },
                { key: 'whatsapp', label: 'WhatsApp (placeholder)' },
                { key: 'telegram', label: 'Telegram (placeholder)' },
              ].map(({ key, label }) => (
                <label key={key} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={notifications[key]}
                    onChange={(e) =>
                      setNotifications((n) => ({ ...n, [key]: e.target.checked }))
                    }
                    className="rounded border-gray-300 dark:border-gray-600 text-emerald-600 focus:ring-emerald-500"
                  />
                  <span className="text-gray-700 dark:text-gray-300">{label}</span>
                </label>
              ))}
            </div>
          </div>

          <Button type="submit" disabled={saving}>
            {saving ? 'Saving...' : 'Save profile'}
          </Button>
        </form>

        <section className="mt-10 pt-8 border-t border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Saved jobs</h2>
          {savedJobs.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              No saved jobs. Save jobs from the <Link to={ROUTES.JOBS} className="text-emerald-600 dark:text-emerald-400 hover:underline">Jobs</Link> page.
            </p>
          ) : (
            <ul className="space-y-2">
              {savedJobs.map((j) => (
                <li key={j._id}>
                  <Link to={`${ROUTES.JOBS}/${j.slug || j._id}`} className="text-gray-700 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400">{j.title}</Link>
                  {j.deadline && <span className="text-xs text-gray-500 ml-2">({formatDate(j.deadline)})</span>}
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="mt-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Saved scholarships</h2>
          {savedScholarships.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              No saved scholarships. Save from the <Link to={ROUTES.SCHOLARSHIPS} className="text-emerald-600 dark:text-emerald-400 hover:underline">Scholarships</Link> page.
            </p>
          ) : (
            <ul className="space-y-2">
              {savedScholarships.map((s) => (
                <li key={s._id}>
                  <Link to={`${ROUTES.SCHOLARSHIPS}/${s.slug || s._id}`} className="text-gray-700 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400">{s.title}</Link>
                  {s.deadline && <span className="text-xs text-gray-500 ml-2">({formatDate(s.deadline)})</span>}
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="mt-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Saved admissions</h2>
          {savedAdmissions.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              No saved admissions. Save from the <Link to={ROUTES.ADMISSIONS} className="text-emerald-600 dark:text-emerald-400 hover:underline">Admissions</Link> page.
            </p>
          ) : (
            <ul className="space-y-2">
              {savedAdmissions.map((a) => (
                <li key={a._id}>
                  <Link to={`${ROUTES.ADMISSIONS}/${a.slug || a._id}`} className="text-gray-700 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400">{a.program} – {a.institution}</Link>
                  {a.deadline && <span className="text-xs text-gray-500 ml-2">({formatDate(a.deadline)})</span>}
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </>
  );
}
