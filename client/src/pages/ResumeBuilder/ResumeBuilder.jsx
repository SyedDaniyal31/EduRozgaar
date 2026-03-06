import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../constants';
import { Button } from '../../components/common/Button';

const defaultResume = {
  name: '',
  email: '',
  phone: '',
  education: '',
  skills: '',
  experience: '',
  projects: '',
  links: '',
};

export default function ResumeBuilder() {
  const [form, setForm] = useState(defaultResume);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const buildHtml = () => {
    const lines = [];
    if (form.name) lines.push(`<h1>${form.name}</h1>`);
    if (form.email) lines.push(`<p>Email: ${form.email}</p>`);
    if (form.phone) lines.push(`<p>Phone: ${form.phone}</p>`);
    if (form.education) lines.push(`<h2>Education</h2><p>${form.education.replace(/\n/g, '<br>')}</p>`);
    if (form.skills) lines.push(`<h2>Skills</h2><p>${form.skills.replace(/\n/g, '<br>')}</p>`);
    if (form.experience) lines.push(`<h2>Experience</h2><p>${form.experience.replace(/\n/g, '<br>')}</p>`);
    if (form.projects) lines.push(`<h2>Projects</h2><p>${form.projects.replace(/\n/g, '<br>')}</p>`);
    if (form.links) lines.push(`<h2>Links</h2><p>${form.links.replace(/\n/g, '<br>')}</p>`);
    return lines.join('');
  };

  const handleDownloadPDF = () => {
    const html = buildHtml();
    if (!html) {
      window.alert('Add some content to generate your resume.');
      return;
    }
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head><title>Resume - ${form.name || 'My Resume'}</title>
        <style>
          body { font-family: system-ui, sans-serif; max-width: 800px; margin: 2rem auto; padding: 0 1rem; }
          h1 { font-size: 1.75rem; margin-bottom: 0.5rem; }
          h2 { font-size: 1.1rem; margin-top: 1rem; color: #026670; }
          p { margin: 0.25rem 0; line-height: 1.5; }
        </style>
        </head>
        <body>${html}</body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
    printWindow.close();
  };

  return (
    <>
      <Helmet>
        <title>Resume Builder – EduRozgaar</title>
        <meta name="description" content="Build your CV with our simple resume builder. Download as PDF." />
      </Helmet>
      <div className="max-w-3xl mx-auto px-4 py-8">
        <Link to={ROUTES.DASHBOARD} className="text-primary dark:text-mint hover:underline text-sm mb-6 inline-block">← Dashboard</Link>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Resume Builder</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">Fill in your details and download your resume as PDF.</p>

        <div className="space-y-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 shadow-sm">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Name</label>
            <input type="text" name="name" value={form.name} onChange={handleChange} placeholder="Full name" className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
            <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="email@example.com" className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Phone</label>
            <input type="tel" name="phone" value={form.phone} onChange={handleChange} placeholder="+92 300 1234567" className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Education</label>
            <textarea name="education" value={form.education} onChange={handleChange} rows={3} placeholder="Degree, institution, year" className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Skills</label>
            <textarea name="skills" value={form.skills} onChange={handleChange} rows={2} placeholder="e.g. React, Python, Communication" className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Experience</label>
            <textarea name="experience" value={form.experience} onChange={handleChange} rows={4} placeholder="Job title, company, duration, responsibilities" className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Projects</label>
            <textarea name="projects" value={form.projects} onChange={handleChange} rows={3} placeholder="Project name, tech, description" className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Links (LinkedIn, GitHub, portfolio)</label>
            <textarea name="links" value={form.links} onChange={handleChange} rows={2} placeholder="One per line" className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary outline-none" />
          </div>
          <div className="flex gap-3 pt-4">
            <Button onClick={handleDownloadPDF}>Download as PDF</Button>
            <Link to={ROUTES.RESUME_ANALYZER} className="px-4 py-2 rounded-lg border-2 border-primary text-primary dark:text-mint hover:bg-mint/20 btn-theme inline-block">Analyze Resume (AI)</Link>
          </div>
        </div>
      </div>
    </>
  );
}
