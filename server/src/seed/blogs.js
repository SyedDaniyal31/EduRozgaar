import { Blog } from '../models/Blog.js';
import { slugify } from '../utils/slugify.js';

function addDays(d, days) {
  const out = new Date(d);
  out.setDate(out.getDate() + days);
  return out;
}

export const blogSeedData = [
  { title: 'How to Prepare for FPSC Exams', excerpt: 'A complete guide to FPSC competitive exams, syllabus, and preparation strategy.', content: 'Federal Public Service Commission (FPSC) conducts exams for civil services. Focus on current affairs, Pakistan studies, and your subject. Practice past papers and time management.', tags: ['FPSC', 'exams', 'government jobs'], category: 'Exam Prep', publishedAt: addDays(new Date(), -5) },
  { title: 'Best CV Format for Fresh Graduates', excerpt: 'Template and tips for a winning resume when you have little experience.', content: 'Use a clean one-page format. Lead with education and relevant projects or internships. Use action verbs and quantify achievements where possible.', tags: ['CV', 'resume', 'career'], category: 'Career', publishedAt: addDays(new Date(), -3) },
  { title: 'Top Scholarships for Pakistani Students', excerpt: 'HEC, international, and university-specific scholarships you can apply for.', content: 'Explore HEC need-based, Turkiye Burslari, Chinese CSC, DAAD, and Commonwealth scholarships. Check deadlines and eligibility early.', tags: ['scholarships', 'HEC', 'abroad'], category: 'Scholarships', publishedAt: addDays(new Date(), -10) },
  { title: 'PPSC Exam Preparation Tips', excerpt: 'How to crack Punjab Public Service Commission exams.', content: 'PPSC tests general knowledge, English, and subject expertise. Revise past papers and stay updated with Punjab current affairs.', tags: ['PPSC', 'exams', 'Punjab'], category: 'Exam Prep', publishedAt: addDays(new Date(), -7) },
  { title: 'NTS Test Strategy and Syllabus', excerpt: 'Prepare for NTS GAT, NAT, and other tests effectively.', content: 'NTS tests analytical and quantitative skills. Practice sample papers and manage time per section. Focus on vocabulary and basic math.', tags: ['NTS', 'GAT', 'NAT'], category: 'Exam Prep', publishedAt: addDays(new Date(), -4) },
  { title: 'CSS Exam: Complete Guide', excerpt: 'Eligibility, subjects, and preparation plan for Central Superior Services.', content: 'CSS is conducted by FPSC. Choose optional subjects wisely, build a reading habit, and practice essay writing. Join a good academy or self-study with discipline.', tags: ['CSS', 'FPSC', 'civil services'], category: 'Exam Prep', publishedAt: addDays(new Date(), -12) },
  { title: 'How to Write a Cover Letter That Gets Shortlisted', excerpt: 'Structure and examples for job and internship applications.', content: 'Address the hiring manager, match your skills to the JD, and keep it concise. One page is enough. Proofread before sending.', tags: ['cover letter', 'jobs', 'applications'], category: 'Career', publishedAt: addDays(new Date(), -2) },
  { title: 'Internship vs Job: What to Choose as a Student', excerpt: 'When to intern and when to go for a full-time role.', content: 'Internships build experience and networks. For final-year students, a good internship can lead to a job offer. Weigh learning vs earning.', tags: ['internship', 'jobs', 'students'], category: 'Career', publishedAt: addDays(new Date(), -6) },
  { title: 'Study Abroad on Scholarship: Turkey, China, Germany', excerpt: 'Popular fully funded options for Pakistani students.', content: 'Turkiye Burslari, CSC China, and DAAD Germany are top choices. Apply early, prepare documents, and check language requirements.', tags: ['study abroad', 'scholarships'], category: 'Scholarships', publishedAt: addDays(new Date(), -8) },
  { title: 'Government Jobs in Pakistan: Where to Apply', excerpt: 'FPSC, PPSC, NTS, and department-specific portals.', content: 'Federal jobs: FPSC. Punjab: PPSC. NTS is used by many organizations. Bookmark official sites and enable notifications for new posts.', tags: ['government jobs', 'FPSC', 'PPSC'], category: 'Jobs', publishedAt: addDays(new Date(), -1) },
  { title: 'LinkedIn for Students: Build Your Profile', excerpt: 'Get noticed by recruiters while still in university.', content: 'Add a clear photo, headline, and summary. List education, projects, and skills. Engage with posts and connect with alumni and companies.', tags: ['LinkedIn', 'career', 'students'], category: 'Career', publishedAt: addDays(new Date(), -9) },
  { title: 'Admission Deadlines: Pakistani Universities', excerpt: 'Important dates for undergraduate and graduate admissions.', content: 'LUMS, NUST, FAST, IBA, and PU have different cycles. Keep a calendar and prepare documents in advance.', tags: ['admissions', 'universities'], category: 'Admissions', publishedAt: addDays(new Date(), -11) },
  { title: 'Soft Skills That Get You Hired', excerpt: 'Communication, teamwork, and problem-solving for fresh graduates.', content: 'Employers value soft skills as much as grades. Practice presentations, work in groups, and show initiative in projects and clubs.', tags: ['soft skills', 'career'], category: 'Career', publishedAt: addDays(new Date(), -14) },
  { title: 'How to Prepare for University Entry Tests', excerpt: 'SAT, NUST NET, LUMS LCAT, and FAST entry test tips.', content: 'Understand the test format. Practice under time pressure. For NET/LCAT, focus on math, physics, and English. Use official sample papers.', tags: ['entry test', 'admissions'], category: 'Admissions', publishedAt: addDays(new Date(), -15) },
  { title: 'Part-Time Jobs for Students in Pakistan', excerpt: 'Freelancing, tutoring, and on-campus opportunities.', content: 'Freelance on Upwork or Fiverr, tutor school students, or work in libraries and labs on campus. Balance with studies and avoid burnout.', tags: ['part-time', 'students', 'jobs'], category: 'Jobs', publishedAt: addDays(new Date(), -13) },
];

export async function seedBlogs() {
  await Blog.deleteMany({});
  for (let i = 0; i < blogSeedData.length; i++) {
    const b = blogSeedData[i];
    const blog = new Blog({
      ...b,
      slug: `${slugify(b.title)}-${i}`,
      status: 'published',
    });
    await blog.save();
  }
  console.log(`Blogs: seeded ${blogSeedData.length} documents.`);
}
