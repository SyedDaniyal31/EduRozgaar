export const TEMPLATE_IDS = ['modern-professional', 'minimal-ats', 'creative-portfolio', 'academic-cv'];

export const TEMPLATE_NAMES = {
  'modern-professional': 'Modern Professional',
  'minimal-ats': 'Minimal ATS Friendly',
  'creative-portfolio': 'Creative Portfolio',
  'academic-cv': 'Academic CV (Scholarships & Universities)',
};

export const WIZARD_STEPS = [
  { id: 'personal', label: 'Personal Info' },
  { id: 'objective', label: 'Career Objective' },
  { id: 'education', label: 'Education' },
  { id: 'skills', label: 'Skills' },
  { id: 'experience', label: 'Experience' },
  { id: 'projects', label: 'Projects' },
  { id: 'certifications', label: 'Certifications' },
  { id: 'languages', label: 'Languages' },
];

export const defaultPersonalInfo = () => ({
  fullName: '',
  email: '',
  phone: '',
  city: '',
  province: '',
  linkedInUrl: '',
  githubUrl: '',
  portfolioUrl: '',
  profilePhotoUrl: '',
});

export const defaultEducationEntry = () => ({
  degree: '',
  university: '',
  fieldOfStudy: '',
  graduationYear: '',
  gpa: '',
});

export const defaultExperienceEntry = () => ({
  company: '',
  role: '',
  duration: '',
  description: '',
});

export const defaultProjectEntry = () => ({
  title: '',
  description: '',
  technologies: '',
});

export const defaultResume = () => ({
  title: 'My Resume',
  template: 'modern-professional',
  personalInfo: defaultPersonalInfo(),
  careerObjective: '',
  education: [],
  skills: { technical: [], soft: [] },
  experience: [],
  projects: [],
  certifications: [],
  languages: [],
});

export const CAREER_OBJECTIVE_SUGGESTION =
  'Motivated Software Engineering student seeking opportunities to apply programming skills and contribute to innovative projects.';

export const SKILL_SUGGESTIONS = {
  technical: ['JavaScript', 'Python', 'React', 'Node.js', 'Git', 'SQL', 'REST APIs', 'HTML/CSS'],
  soft: ['Communication', 'Leadership', 'Problem Solving', 'Teamwork', 'Time Management'],
};

export const RESUME_TIPS = [
  'Keep resume under 1 page when possible.',
  'Use bullet points for experience and projects.',
  'Highlight measurable achievements (e.g. "Increased X by 20%").',
  'Avoid spelling and grammar mistakes—proofread carefully.',
];
