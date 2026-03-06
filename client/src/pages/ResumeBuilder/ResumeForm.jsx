import { useState } from 'react';
import {
  WIZARD_STEPS,
  defaultEducationEntry,
  defaultExperienceEntry,
  defaultProjectEntry,
  CAREER_OBJECTIVE_SUGGESTION,
  SKILL_SUGGESTIONS,
  RESUME_TIPS,
} from './resumeDefaults';
import { resumesApi } from '../../services/listingsService';
import { useToast } from '../../context/ToastContext';

const inputClass =
  'w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary dark:focus:ring-mint outline-none text-sm';
const labelClass = 'block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1';

export function ResumeForm({ stepIndex, resume, onChange, onAiSuggest }) {
  const step = WIZARD_STEPS[stepIndex];
  const { toast } = useToast();
  const [aiLoading, setAiLoading] = useState(false);

  const update = (path, value) => {
    const keys = path.split('.');
    const next = JSON.parse(JSON.stringify(resume));
    let target = next;
    for (let i = 0; i < keys.length - 1; i++) {
      const k = keys[i];
      if (!target[k]) target[k] = {};
      target = target[k];
    }
    target[keys[keys.length - 1]] = value;
    onChange(next);
  };

  const addEntry = (arrayKey, defaultEntry) => {
    const arr = resume[arrayKey] || [];
    onChange({ ...resume, [arrayKey]: [...arr, defaultEntry()] });
  };

  const updateEntry = (arrayKey, index, field, value) => {
    const arr = [...(resume[arrayKey] || [])];
    if (!arr[index]) arr[index] = {};
    arr[index] = { ...arr[index], [field]: value };
    onChange({ ...resume, [arrayKey]: arr });
  };

  const removeEntry = (arrayKey, index) => {
    const arr = (resume[arrayKey] || []).filter((_, i) => i !== index);
    onChange({ ...resume, [arrayKey]: arr });
  };

  const handleAiCareerObjective = async () => {
    if (!resume.careerObjective?.trim()) {
      update('careerObjective', CAREER_OBJECTIVE_SUGGESTION);
      return;
    }
    setAiLoading(true);
    try {
      const { data } = await resumesApi.aiSuggest({ careerObjective: resume.careerObjective });
      if (data.careerObjective?.improved) {
        update('careerObjective', data.careerObjective.improved);
        toast.success('Objective updated with AI suggestion.');
      }
    } catch {
      toast.error('Could not get suggestion. Using default.');
      update('careerObjective', CAREER_OBJECTIVE_SUGGESTION);
    } finally {
      setAiLoading(false);
    }
  };

  const addSkill = (type, skill) => {
    const skills = { ...resume.skills };
    if (!skills[type]) skills[type] = [];
    if (skill.trim() && !skills[type].includes(skill.trim())) {
      skills[type] = [...skills[type], skill.trim()];
      onChange({ ...resume, skills });
    }
  };

  const removeSkill = (type, index) => {
    const skills = { ...resume.skills };
    skills[type] = (skills[type] || []).filter((_, i) => i !== index);
    onChange({ ...resume, skills });
  };

  const p = resume.personalInfo || {};

  if (step.id === 'personal') {
    return (
      <div className="space-y-4">
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Full name</label>
            <input type="text" className={inputClass} value={p.fullName || ''} onChange={(e) => update('personalInfo.fullName', e.target.value)} placeholder="Full name" />
          </div>
          <div>
            <label className={labelClass}>Email</label>
            <input type="email" className={inputClass} value={p.email || ''} onChange={(e) => update('personalInfo.email', e.target.value)} placeholder="email@example.com" />
          </div>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Phone</label>
            <input type="tel" className={inputClass} value={p.phone || ''} onChange={(e) => update('personalInfo.phone', e.target.value)} placeholder="+92 300 1234567" />
          </div>
          <div>
            <label className={labelClass}>City / Province</label>
            <div className="flex gap-2">
              <input type="text" className={inputClass} value={p.city || ''} onChange={(e) => update('personalInfo.city', e.target.value)} placeholder="City" />
              <input type="text" className={inputClass} value={p.province || ''} onChange={(e) => update('personalInfo.province', e.target.value)} placeholder="Province" />
            </div>
          </div>
        </div>
        <div>
          <label className={labelClass}>LinkedIn URL</label>
          <input type="url" className={inputClass} value={p.linkedInUrl || ''} onChange={(e) => update('personalInfo.linkedInUrl', e.target.value)} placeholder="https://linkedin.com/in/username" />
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>GitHub / Portfolio</label>
            <input type="url" className={inputClass} value={p.githubUrl || ''} onChange={(e) => update('personalInfo.githubUrl', e.target.value)} placeholder="https://github.com/username" />
          </div>
          <div>
            <label className={labelClass}>Portfolio URL</label>
            <input type="url" className={inputClass} value={p.portfolioUrl || ''} onChange={(e) => update('personalInfo.portfolioUrl', e.target.value)} placeholder="https://yourportfolio.com" />
          </div>
        </div>
        <div>
          <label className={labelClass}>Profile photo URL (optional)</label>
          <input type="url" className={inputClass} value={p.profilePhotoUrl || ''} onChange={(e) => update('personalInfo.profilePhotoUrl', e.target.value)} placeholder="https://..." />
        </div>
      </div>
    );
  }

  if (step.id === 'objective') {
    return (
      <div className="space-y-4">
        <p className="text-sm text-gray-600 dark:text-gray-400">Write a short career objective. Use the button below for an AI-improved version.</p>
        <textarea
          className={`${inputClass} min-h-[120px]`}
          value={resume.careerObjective || ''}
          onChange={(e) => update('careerObjective', e.target.value)}
          placeholder="e.g. Motivated Software Engineering student seeking..."
          rows={4}
        />
        <button type="button" onClick={handleAiCareerObjective} disabled={aiLoading} className="px-4 py-2 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary-hover disabled:opacity-50">
          {aiLoading ? '…' : resume.careerObjective?.trim() ? 'Improve with AI' : 'Use suggested objective'}
        </button>
      </div>
    );
  }

  if (step.id === 'education') {
    const entries = resume.education || [];
    return (
      <div className="space-y-4">
        {entries.map((entry, i) => (
          <div key={i} className="p-4 rounded-xl border border-gray-200 dark:border-gray-700 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Entry {i + 1}</span>
              <button type="button" onClick={() => removeEntry('education', i)} className="text-sm text-red-600 dark:text-red-400 hover:underline">Remove</button>
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              <div>
                <label className={labelClass}>Degree</label>
                <input type="text" className={inputClass} value={entry.degree || ''} onChange={(e) => updateEntry('education', i, 'degree', e.target.value)} placeholder="e.g. BSc Computer Science" />
              </div>
              <div>
                <label className={labelClass}>University</label>
                <input type="text" className={inputClass} value={entry.university || ''} onChange={(e) => updateEntry('education', i, 'university', e.target.value)} placeholder="University name" />
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              <div>
                <label className={labelClass}>Field of study</label>
                <input type="text" className={inputClass} value={entry.fieldOfStudy || ''} onChange={(e) => updateEntry('education', i, 'fieldOfStudy', e.target.value)} placeholder="e.g. Computer Science" />
              </div>
              <div>
                <label className={labelClass}>Graduation year</label>
                <input type="text" className={inputClass} value={entry.graduationYear || ''} onChange={(e) => updateEntry('education', i, 'graduationYear', e.target.value)} placeholder="2025" />
              </div>
            </div>
            <div>
              <label className={labelClass}>GPA (optional)</label>
              <input type="text" className={inputClass} value={entry.gpa || ''} onChange={(e) => updateEntry('education', i, 'gpa', e.target.value)} placeholder="e.g. 3.8/4.0" />
            </div>
          </div>
        ))}
        <button type="button" onClick={() => addEntry('education', defaultEducationEntry)} className="px-4 py-2 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:border-primary dark:hover:border-mint text-sm font-medium">
          + Add education
        </button>
      </div>
    );
  }

  if (step.id === 'skills') {
    const tech = resume.skills?.technical || [];
    const soft = resume.skills?.soft || [];
    return (
      <div className="space-y-6">
        <div>
          <label className={labelClass}>Technical skills</label>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Click to add: {SKILL_SUGGESTIONS.technical.join(', ')}</p>
          <div className="flex flex-wrap gap-2 mb-2">
            {tech.map((s, i) => (
              <span key={i} className="inline-flex items-center gap-1 px-2 py-1 rounded bg-gray-200 dark:bg-gray-700 text-sm">
                {s}
                <button type="button" onClick={() => removeSkill('technical', i)} className="text-gray-500 hover:text-red-600" aria-label="Remove">×</button>
              </span>
            ))}
            <input
              type="text"
              className="w-32 px-2 py-1 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm"
              placeholder="Add skill"
              onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addSkill('technical', e.target.value); e.target.value = ''; } }}
            />
          </div>
        </div>
        <div>
          <label className={labelClass}>Soft skills</label>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Suggestions: {SKILL_SUGGESTIONS.soft.join(', ')}</p>
          <div className="flex flex-wrap gap-2">
            {soft.map((s, i) => (
              <span key={i} className="inline-flex items-center gap-1 px-2 py-1 rounded bg-gray-200 dark:bg-gray-700 text-sm">
                {s}
                <button type="button" onClick={() => removeSkill('soft', i)} className="text-gray-500 hover:text-red-600" aria-label="Remove">×</button>
              </span>
            ))}
            <input
              type="text"
              className="w-32 px-2 py-1 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm"
              placeholder="Add skill"
              onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addSkill('soft', e.target.value); e.target.value = ''; } }}
            />
          </div>
        </div>
      </div>
    );
  }

  if (step.id === 'experience') {
    const entries = resume.experience || [];
    return (
      <div className="space-y-4">
        {entries.map((entry, i) => (
          <div key={i} className="p-4 rounded-xl border border-gray-200 dark:border-gray-700 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Entry {i + 1}</span>
              <button type="button" onClick={() => removeEntry('experience', i)} className="text-sm text-red-600 dark:text-red-400 hover:underline">Remove</button>
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              <div>
                <label className={labelClass}>Company</label>
                <input type="text" className={inputClass} value={entry.company || ''} onChange={(e) => updateEntry('experience', i, 'company', e.target.value)} placeholder="Company name" />
              </div>
              <div>
                <label className={labelClass}>Role</label>
                <input type="text" className={inputClass} value={entry.role || ''} onChange={(e) => updateEntry('experience', i, 'role', e.target.value)} placeholder="Job title" />
              </div>
            </div>
            <div>
              <label className={labelClass}>Duration</label>
              <input type="text" className={inputClass} value={entry.duration || ''} onChange={(e) => updateEntry('experience', i, 'duration', e.target.value)} placeholder="e.g. Jan 2024 – Present" />
            </div>
            <div>
              <label className={labelClass}>Description</label>
              <textarea className={`${inputClass} min-h-[80px]`} value={entry.description || ''} onChange={(e) => updateEntry('experience', i, 'description', e.target.value)} placeholder="Key responsibilities and achievements" rows={3} />
            </div>
          </div>
        ))}
        <button type="button" onClick={() => addEntry('experience', defaultExperienceEntry)} className="px-4 py-2 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:border-primary dark:hover:border-mint text-sm font-medium">
          + Add experience / internship
        </button>
      </div>
    );
  }

  if (step.id === 'projects') {
    const entries = resume.projects || [];
    return (
      <div className="space-y-4">
        {entries.map((entry, i) => (
          <div key={i} className="p-4 rounded-xl border border-gray-200 dark:border-gray-700 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Project {i + 1}</span>
              <button type="button" onClick={() => removeEntry('projects', i)} className="text-sm text-red-600 dark:text-red-400 hover:underline">Remove</button>
            </div>
            <div>
              <label className={labelClass}>Project title</label>
              <input type="text" className={inputClass} value={entry.title || ''} onChange={(e) => updateEntry('projects', i, 'title', e.target.value)} placeholder="e.g. E-Commerce Dashboard" />
            </div>
            <div>
              <label className={labelClass}>Description</label>
              <textarea className={`${inputClass} min-h-[80px]`} value={entry.description || ''} onChange={(e) => updateEntry('projects', i, 'description', e.target.value)} placeholder="What you built and the impact" rows={3} />
            </div>
            <div>
              <label className={labelClass}>Technologies used</label>
              <input type="text" className={inputClass} value={entry.technologies || ''} onChange={(e) => updateEntry('projects', i, 'technologies', e.target.value)} placeholder="e.g. React, Node.js, MongoDB" />
            </div>
          </div>
        ))}
        <button type="button" onClick={() => addEntry('projects', defaultProjectEntry)} className="px-4 py-2 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:border-primary dark:hover:border-mint text-sm font-medium">
          + Add project
        </button>
      </div>
    );
  }

  if (step.id === 'certifications') {
    const certs = resume.certifications || [];
    return (
      <div className="space-y-4">
        <p className="text-sm text-gray-600 dark:text-gray-400">Add certifications (e.g. Google Data Analytics, Meta Frontend Developer).</p>
        {certs.map((c, i) => (
          <div key={i} className="flex gap-2">
            <input type="text" className={inputClass} value={c} onChange={(e) => {
              const next = [...certs];
              next[i] = e.target.value;
              onChange({ ...resume, certifications: next });
            }} placeholder="Certification name" />
            <button type="button" onClick={() => onChange({ ...resume, certifications: certs.filter((_, j) => j !== i) })} className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-sm text-red-600 dark:text-red-400">Remove</button>
          </div>
        ))}
        <button type="button" onClick={() => onChange({ ...resume, certifications: [...certs, ''] })} className="px-4 py-2 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:border-primary dark:hover:border-mint text-sm font-medium">
          + Add certification
        </button>
      </div>
    );
  }

  if (step.id === 'languages') {
    const langs = resume.languages || [];
    return (
      <div className="space-y-4">
        <p className="text-sm text-gray-600 dark:text-gray-400">Add languages (e.g. English, Urdu, Punjabi).</p>
        {langs.map((l, i) => (
          <div key={i} className="flex gap-2">
            <input type="text" className={inputClass} value={l} onChange={(e) => {
              const next = [...langs];
              next[i] = e.target.value;
              onChange({ ...resume, languages: next });
            }} placeholder="Language" />
            <button type="button" onClick={() => onChange({ ...resume, languages: langs.filter((_, j) => j !== i) })} className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-sm text-red-600 dark:text-red-400">Remove</button>
          </div>
        ))}
        <button type="button" onClick={() => onChange({ ...resume, languages: [...langs, ''] })} className="px-4 py-2 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:border-primary dark:hover:border-mint text-sm font-medium">
          + Add language
        </button>
      </div>
    );
  }

  return null;
}

export function ResumeTips() {
  return (
    <div className="rounded-xl border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20 p-4">
      <h3 className="text-sm font-semibold text-amber-800 dark:text-amber-200 mb-2">Resume tips</h3>
      <ul className="space-y-1 text-sm text-amber-700 dark:text-amber-300">
        {RESUME_TIPS.map((tip, i) => (
          <li key={i}>• {tip}</li>
        ))}
      </ul>
    </div>
  );
}
