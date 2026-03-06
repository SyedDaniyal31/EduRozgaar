import { University } from '../models/University.js';

export const universitySeedData = [
  { name: 'University of Punjab', country: 'Pakistan', website: 'https://pu.edu.pk', description: 'Largest public university in Punjab.' },
  { name: 'LUMS', country: 'Pakistan', website: 'https://lums.edu.pk', description: 'Lahore University of Management Sciences.' },
  { name: 'NUST', country: 'Pakistan', website: 'https://nust.edu.pk', description: 'National University of Sciences and Technology.' },
  { name: 'University of Karachi', country: 'Pakistan', website: 'https://uok.edu.pk', description: 'Premier university in Sindh.' },
  { name: 'IBA Karachi', country: 'Pakistan', website: 'https://iba.edu.pk', description: 'Institute of Business Administration.' },
  { name: 'FAST University', country: 'Pakistan', website: 'https://nu.edu.pk', description: 'National University of Computer and Emerging Sciences.' },
  { name: 'UET Lahore', country: 'Pakistan', website: 'https://uet.edu.pk', description: 'University of Engineering and Technology.' },
  { name: 'King Edward Medical University', country: 'Pakistan', website: 'https://kemu.edu.pk', description: 'Leading medical university in Punjab.' },
  { name: 'COMSATS University', country: 'Pakistan', website: 'https://comsats.edu.pk', description: 'Campuses across Pakistan.' },
  { name: 'Aga Khan University', country: 'Pakistan', website: 'https://aku.edu', description: 'Medical and nursing education.' },
  { name: 'GIK Institute', country: 'Pakistan', website: 'https://giki.edu.pk', description: 'Ghulam Ishaq Khan Institute of Engineering.' },
  { name: 'University of Agriculture Faisalabad', country: 'Pakistan', website: 'https://uaf.edu.pk', description: 'Agriculture and veterinary sciences.' },
  { name: 'PIDE', country: 'Pakistan', website: 'https://pide.org.pk', description: 'Pakistan Institute of Development Economics.' },
  { name: 'GCU Lahore', country: 'Pakistan', website: 'https://gcu.edu.pk', description: 'Government College University Lahore.' },
  { name: 'NCA Lahore', country: 'Pakistan', website: 'https://nca.edu.pk', description: 'National College of Arts.' },
  { name: 'University of Education Lahore', country: 'Pakistan', website: 'https://ue.edu.pk', description: 'Teacher education and research.' },
  { name: 'University of Peshawar', country: 'Pakistan', website: 'https://uop.edu.pk', description: 'Oldest university in KP.' },
  { name: 'University of Balochistan', country: 'Pakistan', website: 'https://uob.edu.pk', description: 'Premier university in Quetta.' },
  { name: 'Islamia University Bahawalpur', country: 'Pakistan', website: 'https://iub.edu.pk', description: 'Large public university in Punjab.' },
  { name: 'Bahria University', country: 'Pakistan', website: 'https://bahria.edu.pk', description: 'Campuses in Islamabad, Karachi, Lahore.' },
];

export async function seedUniversities() {
  await University.deleteMany({});
  await University.insertMany(universitySeedData.map((u) => ({ ...u, status: 'active' })));
  console.log(`Universities: seeded ${universitySeedData.length} documents.`);
}
