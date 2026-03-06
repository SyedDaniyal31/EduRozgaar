import { useMemo } from 'react';

function computeScore(resume) {
  let score = 0;
  const personal = resume.personalInfo || {};
  if (personal.fullName?.trim()) score += 15;
  if (personal.email?.trim()) score += 10;
  if (personal.phone?.trim()) score += 5;
  if (personal.linkedInUrl?.trim()) score += 10;
  if (resume.careerObjective?.trim()) score += 10;
  const eduCount = (resume.education || []).length;
  if (eduCount > 0) score += 10;
  const tech = (resume.skills?.technical || []).length;
  const soft = (resume.skills?.soft || []).length;
  score += Math.min(15, tech * 2 + soft);
  const expCount = (resume.experience || []).length;
  score += Math.min(15, expCount * 5);
  const projCount = (resume.projects || []).length;
  score += Math.min(10, projCount * 3);
  return Math.min(100, score);
}

function getSuggestions(resume) {
  const suggestions = [];
  const personal = resume.personalInfo || {};
  if (!personal.fullName?.trim()) suggestions.push('Add your full name.');
  if (!personal.email?.trim()) suggestions.push('Add your email.');
  if (!personal.linkedInUrl?.trim()) suggestions.push('Add your LinkedIn profile.');
  if (!resume.careerObjective?.trim()) suggestions.push('Add a career objective.');
  const tech = (resume.skills?.technical || []).length;
  const soft = (resume.skills?.soft || []).length;
  if (tech + soft < 5) suggestions.push('Add more skills (technical and soft).');
  if ((resume.experience || []).length === 0) suggestions.push('Add at least one experience or internship.');
  if ((resume.projects || []).length === 0) suggestions.push('Add project descriptions.');
  return suggestions.slice(0, 5);
}

export function ResumeScore({ resume }) {
  const { score, suggestions } = useMemo(() => ({
    score: computeScore(resume),
    suggestions: getSuggestions(resume),
  }), [resume]);

  const color = score >= 70 ? 'text-emerald-600 dark:text-emerald-400' : score >= 40 ? 'text-amber-600 dark:text-amber-400' : 'text-gray-600 dark:text-gray-400';

  return (
    <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4">
      <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">Resume Score</h3>
      <p className={`text-2xl font-bold ${color}`}>{score} / 100</p>
      {suggestions.length > 0 && (
        <ul className="mt-3 space-y-1 text-sm text-gray-600 dark:text-gray-400">
          {suggestions.map((s, i) => (
            <li key={i}>• {s}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
