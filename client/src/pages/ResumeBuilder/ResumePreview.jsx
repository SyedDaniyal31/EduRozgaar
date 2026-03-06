import { forwardRef } from 'react';

function Section({ title, children }) {
  if (!children) return null;
  return (
    <div className="mb-3">
      <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">{title}</h3>
      {children}
    </div>
  );
}

function ModernProfessional({ data }) {
  const p = data.personalInfo || {};
  const edu = data.education || [];
  const tech = data.skills?.technical || [];
  const soft = data.skills?.soft || [];
  const exp = data.experience || [];
  const proj = data.projects || [];
  const certs = data.certifications || [];
  const langs = data.languages || [];

  return (
    <div className="resume-preview bg-white text-gray-900 p-6 text-sm font-sans" style={{ maxWidth: '210mm', minHeight: '297mm' }}>
      <div className="border-b-2 border-slate-700 pb-3 mb-3">
        <h1 className="text-xl font-bold text-slate-800">{p.fullName || 'Your Name'}</h1>
        <p className="text-slate-600 text-xs">
          {[p.email, p.phone, p.city && p.province ? `${p.city}, ${p.province}` : p.city || p.province].filter(Boolean).join(' · ')}
        </p>
        {(p.linkedInUrl || p.githubUrl || p.portfolioUrl) && (
          <p className="text-slate-500 text-xs mt-0.5">
            {p.linkedInUrl && <a href={p.linkedInUrl} className="text-slate-600 underline">LinkedIn</a>}
            {p.linkedInUrl && (p.githubUrl || p.portfolioUrl) && ' · '}
            {p.githubUrl && <a href={p.githubUrl} className="text-slate-600 underline">GitHub</a>}
            {(p.linkedInUrl || p.githubUrl) && p.portfolioUrl && ' · '}
            {p.portfolioUrl && <a href={p.portfolioUrl} className="text-slate-600 underline">Portfolio</a>}
          </p>
        )}
      </div>
      {data.careerObjective && (
        <Section title="Career Objective">
          <p className="text-gray-700 leading-snug">{data.careerObjective}</p>
        </Section>
      )}
      {edu.length > 0 && (
        <Section title="Education">
          {edu.map((e, i) => (
            <div key={i} className="mb-2">
              <p className="font-semibold text-slate-800">{e.degree}{e.fieldOfStudy && ` in ${e.fieldOfStudy}`}</p>
              <p className="text-slate-600">{e.university}{e.graduationYear && ` · ${e.graduationYear}`}{e.gpa && ` · GPA ${e.gpa}`}</p>
            </div>
          ))}
        </Section>
      )}
      {(tech.length > 0 || soft.length > 0) && (
        <Section title="Skills">
          <p className="text-gray-700">{tech.join(', ')}{tech.length && soft.length ? ' · ' : ''}{soft.join(', ')}</p>
        </Section>
      )}
      {exp.length > 0 && (
        <Section title="Experience">
          {exp.map((e, i) => (
            <div key={i} className="mb-2">
              <p className="font-semibold text-slate-800">{e.role} at {e.company}</p>
              {e.duration && <p className="text-xs text-slate-500">{e.duration}</p>}
              {e.description && <p className="text-gray-700 text-xs mt-0.5">{e.description}</p>}
            </div>
          ))}
        </Section>
      )}
      {proj.length > 0 && (
        <Section title="Projects">
          {proj.map((p, i) => (
            <div key={i} className="mb-2">
              <p className="font-semibold text-slate-800">{p.title}</p>
              {p.technologies && <p className="text-xs text-slate-500">{p.technologies}</p>}
              {p.description && <p className="text-gray-700 text-xs mt-0.5">{p.description}</p>}
            </div>
          ))}
        </Section>
      )}
      {certs.length > 0 && (
        <Section title="Certifications">
          <p className="text-gray-700">{certs.filter(Boolean).join(', ')}</p>
        </Section>
      )}
      {langs.filter(Boolean).length > 0 && (
        <Section title="Languages">
          <p className="text-gray-700">{langs.filter(Boolean).join(', ')}</p>
        </Section>
      )}
    </div>
  );
}

function MinimalAts({ data }) {
  const p = data.personalInfo || {};
  return (
    <div className="resume-preview bg-white text-gray-900 p-6 text-sm font-sans" style={{ maxWidth: '210mm', minHeight: '297mm' }}>
      <h1 className="text-lg font-bold text-gray-900 mb-1">{p.fullName || 'Your Name'}</h1>
      <p className="text-gray-600 text-xs mb-3">{p.email} {p.phone} {p.city} {p.province}</p>
      {data.careerObjective && <p className="mb-3 text-gray-700">{data.careerObjective}</p>}
      {(data.education || []).length > 0 && (
        <Section title="Education">
          {(data.education || []).map((e, i) => (
            <p key={i} className="text-gray-700">{e.degree} — {e.university} {e.graduationYear}</p>
          ))}
        </Section>
      )}
      {((data.skills?.technical || []).length > 0 || (data.skills?.soft || []).length > 0) && (
        <Section title="Skills">
          <p className="text-gray-700">{(data.skills?.technical || []).concat(data.skills?.soft || []).join(', ')}</p>
        </Section>
      )}
      {(data.experience || []).length > 0 && (
        <Section title="Experience">
          {(data.experience || []).map((e, i) => (
            <div key={i} className="mb-1">
              <p className="font-medium text-gray-900">{e.role}, {e.company} — {e.duration}</p>
              {e.description && <p className="text-gray-700 text-xs">{e.description}</p>}
            </div>
          ))}
        </Section>
      )}
      {(data.projects || []).length > 0 && (
        <Section title="Projects">
          {(data.projects || []).map((p, i) => (
            <div key={i}>
              <p className="font-medium text-gray-900">{p.title} — {p.technologies}</p>
              {p.description && <p className="text-gray-700 text-xs">{p.description}</p>}
            </div>
          ))}
        </Section>
      )}
      {(data.certifications || []).filter(Boolean).length > 0 && (
        <Section title="Certifications">
          <p className="text-gray-700">{(data.certifications || []).filter(Boolean).join('; ')}</p>
        </Section>
      )}
      {(data.languages || []).filter(Boolean).length > 0 && (
        <Section title="Languages">
          <p className="text-gray-700">{(data.languages || []).filter(Boolean).join(', ')}</p>
        </Section>
      )}
    </div>
  );
}

function CreativePortfolio({ data }) {
  const p = data.personalInfo || {};
  return (
    <div className="resume-preview bg-gradient-to-b from-emerald-50 to-white text-gray-900 p-6 text-sm font-sans" style={{ maxWidth: '210mm', minHeight: '297mm' }}>
      <div className="flex items-start gap-4 mb-4">
        {p.profilePhotoUrl ? (
          <img src={p.profilePhotoUrl} alt="" className="w-16 h-16 rounded-full object-cover border-2 border-emerald-200" />
        ) : (
          <div className="w-16 h-16 rounded-full bg-emerald-200 flex items-center justify-center text-emerald-700 text-xl font-bold">{(p.fullName || 'Y')[0]}</div>
        )}
        <div>
          <h1 className="text-xl font-bold text-emerald-900">{p.fullName || 'Your Name'}</h1>
          <p className="text-emerald-700 text-xs">{p.email} · {p.phone}</p>
          <p className="text-gray-600 text-xs">{p.city}{p.province && `, ${p.province}`}</p>
        </div>
      </div>
      {data.careerObjective && <p className="text-gray-700 mb-3 italic border-l-4 border-emerald-400 pl-3">{data.careerObjective}</p>}
      {(data.education || []).length > 0 && (
        <Section title="Education">
          {(data.education || []).map((e, i) => (
            <p key={i}>{e.degree} — {e.university} {e.graduationYear}</p>
          ))}
        </Section>
      )}
      <Section title="Skills">
        <p className="text-gray-700">{(data.skills?.technical || []).concat(data.skills?.soft || []).join(' · ')}</p>
      </Section>
      {(data.experience || []).length > 0 && (
        <Section title="Experience">
          {(data.experience || []).map((e, i) => (
            <div key={i} className="mb-2">
              <p className="font-semibold text-emerald-800">{e.role} @ {e.company}</p>
              <p className="text-xs text-gray-500">{e.duration}</p>
              <p className="text-gray-700 text-xs">{e.description}</p>
            </div>
          ))}
        </Section>
      )}
      {(data.projects || []).length > 0 && (
        <Section title="Projects">
          {(data.projects || []).map((p, i) => (
            <div key={i}>
              <p className="font-semibold text-emerald-800">{p.title}</p>
              <p className="text-xs text-gray-600">{p.technologies}</p>
              <p className="text-gray-700 text-xs">{p.description}</p>
            </div>
          ))}
        </Section>
      )}
      {(data.certifications || []).filter(Boolean).length > 0 && (
        <Section title="Certifications">
          <p>{(data.certifications || []).filter(Boolean).join(', ')}</p>
        </Section>
      )}
      {(data.languages || []).filter(Boolean).length > 0 && (
        <Section title="Languages">
          <p>{(data.languages || []).filter(Boolean).join(', ')}</p>
        </Section>
      )}
    </div>
  );
}

function AcademicCv({ data }) {
  const p = data.personalInfo || {};
  return (
    <div className="resume-preview bg-white text-gray-900 p-6 text-sm font-serif" style={{ maxWidth: '210mm', minHeight: '297mm' }}>
      <div className="text-center border-b border-indigo-200 pb-3 mb-3">
        <h1 className="text-xl font-bold text-indigo-900">{p.fullName || 'Your Name'}</h1>
        <p className="text-indigo-700 text-xs">{p.email} | {p.phone} | {p.city}{p.province && `, ${p.province}`}</p>
        {(p.linkedInUrl || p.githubUrl) && (
          <p className="text-xs text-indigo-600">{p.linkedInUrl && 'LinkedIn'} {p.githubUrl && '| GitHub'}</p>
        )}
      </div>
      {data.careerObjective && (
        <Section title="Objective">
          <p className="text-gray-700">{data.careerObjective}</p>
        </Section>
      )}
      {(data.education || []).length > 0 && (
        <Section title="Education">
          {(data.education || []).map((e, i) => (
            <div key={i} className="mb-2">
              <p className="font-semibold text-indigo-900">{e.degree}{e.fieldOfStudy && `, ${e.fieldOfStudy}`}</p>
              <p className="text-gray-700">{e.university} — {e.graduationYear}{e.gpa && ` (GPA: ${e.gpa})`}</p>
            </div>
          ))}
        </Section>
      )}
      {((data.skills?.technical || []).length > 0 || (data.skills?.soft || []).length > 0) && (
        <Section title="Skills">
          <p className="text-gray-700">Technical: {(data.skills?.technical || []).join(', ')}. Soft: {(data.skills?.soft || []).join(', ')}.</p>
        </Section>
      )}
      {(data.experience || []).length > 0 && (
        <Section title="Experience">
          {(data.experience || []).map((e, i) => (
            <div key={i} className="mb-2">
              <p className="font-semibold text-indigo-900">{e.role}, {e.company}</p>
              <p className="text-xs text-gray-500">{e.duration}</p>
              <p className="text-gray-700 text-xs">{e.description}</p>
            </div>
          ))}
        </Section>
      )}
      {(data.projects || []).length > 0 && (
        <Section title="Research / Projects">
          {(data.projects || []).map((p, i) => (
            <div key={i} className="mb-2">
              <p className="font-semibold text-indigo-900">{p.title}</p>
              <p className="text-gray-700 text-xs">{p.description}</p>
              {p.technologies && <p className="text-xs text-gray-500">{p.technologies}</p>}
            </div>
          ))}
        </Section>
      )}
      {(data.certifications || []).filter(Boolean).length > 0 && (
        <Section title="Certifications">
          <p className="text-gray-700">{(data.certifications || []).filter(Boolean).join('; ')}</p>
        </Section>
      )}
      {(data.languages || []).filter(Boolean).length > 0 && (
        <Section title="Languages">
          <p className="text-gray-700">{(data.languages || []).filter(Boolean).join(', ')}</p>
        </Section>
      )}
    </div>
  );
}

const TEMPLATE_MAP = {
  'modern-professional': ModernProfessional,
  'minimal-ats': MinimalAts,
  'creative-portfolio': CreativePortfolio,
  'academic-cv': AcademicCv,
};

export const ResumePreview = forwardRef(function ResumePreview({ resume, template }, ref) {
  const TemplateComponent = TEMPLATE_MAP[template] || ModernProfessional;
  return (
    <div ref={ref} className="resume-preview-wrapper overflow-auto rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 shadow-inner flex justify-center p-4 min-h-[400px]">
      <TemplateComponent data={resume} />
    </div>
  );
});
