/**
 * Multi-language (EN/UR) – Phase-8 placeholder.
 * Replace with expo-localization + JSON files for full i18n.
 */
const strings = {
  en: {
    nav: { home: 'Home', jobs: 'Jobs', scholarships: 'Scholarships', admissions: 'Admissions', saved: 'Saved', profile: 'Profile' },
    home: { title: 'Jobs & Education', sub: 'Find opportunities in Pakistan', trending: 'Trending', recommended: 'Recommended for You' },
    common: { loading: 'Loading...', error: 'Something went wrong', retry: 'Retry', save: 'Save', saved: 'Saved' },
  },
  ur: {
    nav: { home: 'ہوم', jobs: 'نوکریاں', scholarships: 'اسکالرشپس', admissions: 'داخلے', saved: 'محفوظ', profile: 'پروفائل' },
    home: { title: 'نوکریاں اور تعلیم', sub: 'پاکستان میں مواقع تلاش کریں', trending: 'مقبول', recommended: 'آپ کے لیے تجویز کردہ' },
    common: { loading: 'لوڈ ہو رہا ہے...', error: 'کچھ غلط ہو گیا', retry: 'دوبارہ کوشش کریں', save: 'محفوظ کریں', saved: 'محفوظ' },
  },
};

let locale = 'en';
export const setLocale = (l) => { locale = l === 'ur' ? 'ur' : 'en'; };
export const getLocale = () => locale;
export const t = (key) => {
  const parts = key.split('.');
  let o = strings[locale] || strings.en;
  for (const p of parts) {
    o = o?.[p];
    if (o == null) return key;
  }
  return typeof o === 'string' ? o : key;
};
