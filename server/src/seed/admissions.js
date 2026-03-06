import { Admission } from '../models/Admission.js';
import { slugify } from '../utils/slugify.js';

function addDays(d, days) {
  const out = new Date(d);
  out.setDate(out.getDate() + days);
  return out;
}

export const admissionSeedData = [
  { program: 'BS Computer Science', institution: 'University of Punjab', university: 'University of Punjab', city: 'Lahore', province: 'Punjab', deadline: addDays(new Date(), 45), lastDate: addDays(new Date(), 45), applyLink: 'https://pu.edu.pk', link: 'https://pu.edu.pk' },
  { program: 'MBA', institution: 'LUMS', university: 'LUMS', city: 'Lahore', province: 'Punjab', deadline: addDays(new Date(), 60), lastDate: addDays(new Date(), 60), applyLink: 'https://lums.edu.pk', link: 'https://lums.edu.pk' },
  { program: 'MBBS', institution: 'King Edward Medical University', university: 'KEMU', city: 'Lahore', province: 'Punjab', deadline: addDays(new Date(), 30), lastDate: addDays(new Date(), 30), applyLink: 'https://kemu.edu.pk', link: 'https://kemu.edu.pk' },
  { program: 'BBA', institution: 'IBA Karachi', university: 'IBA Karachi', city: 'Karachi', province: 'Sindh', deadline: addDays(new Date(), 50), lastDate: addDays(new Date(), 50), applyLink: 'https://iba.edu.pk', link: 'https://iba.edu.pk' },
  { program: 'BE Electrical', institution: 'NUST', university: 'NUST', city: 'Islamabad', province: 'Islamabad', deadline: addDays(new Date(), 40), lastDate: addDays(new Date(), 40), applyLink: 'https://nust.edu.pk', link: 'https://nust.edu.pk' },
  { program: 'LLB', institution: 'University of Karachi', university: 'UoK', city: 'Karachi', province: 'Sindh', deadline: addDays(new Date(), 35), lastDate: addDays(new Date(), 35), applyLink: 'https://uok.edu.pk', link: 'https://uok.edu.pk' },
  { program: 'BDS', institution: 'de\' Montmorency College of Dentistry', university: 'DMC', city: 'Lahore', province: 'Punjab', deadline: addDays(new Date(), 25), lastDate: addDays(new Date(), 25), applyLink: 'https://dmc.edu.pk', link: 'https://dmc.edu.pk' },
  { program: 'MS Data Science', institution: 'FAST University', university: 'FAST', city: 'Islamabad', province: 'Islamabad', deadline: addDays(new Date(), 55), lastDate: addDays(new Date(), 55), applyLink: 'https://nu.edu.pk', link: 'https://nu.edu.pk' },
  { program: 'BSc Civil Engineering', institution: 'UET Lahore', university: 'UET Lahore', city: 'Lahore', province: 'Punjab', deadline: addDays(new Date(), 38), lastDate: addDays(new Date(), 38), applyLink: 'https://uet.edu.pk', link: 'https://uet.edu.pk' },
  { program: 'Pharm-D', institution: 'University of Punjab', university: 'PU', city: 'Lahore', province: 'Punjab', deadline: addDays(new Date(), 42), lastDate: addDays(new Date(), 42), applyLink: 'https://pu.edu.pk', link: 'https://pu.edu.pk' },
  { program: 'BArch', institution: 'NCA Lahore', university: 'NCA', city: 'Lahore', province: 'Punjab', deadline: addDays(new Date(), 48), lastDate: addDays(new Date(), 48), applyLink: 'https://nca.edu.pk', link: 'https://nca.edu.pk' },
  { program: 'BS Software Engineering', institution: 'COMSATS Islamabad', university: 'COMSATS', city: 'Islamabad', province: 'Islamabad', deadline: addDays(new Date(), 52), lastDate: addDays(new Date(), 52), applyLink: 'https://comsats.edu.pk', link: 'https://comsats.edu.pk' },
  { program: 'MA Economics', institution: 'PIDE', university: 'PIDE', city: 'Islamabad', province: 'Islamabad', deadline: addDays(new Date(), 33), lastDate: addDays(new Date(), 33), applyLink: 'https://pide.org.pk', link: 'https://pide.org.pk' },
  { program: 'DVM', institution: 'University of Agriculture Faisalabad', university: 'UAF', city: 'Faisalabad', province: 'Punjab', deadline: addDays(new Date(), 28), lastDate: addDays(new Date(), 28), applyLink: 'https://uaf.edu.pk', link: 'https://uaf.edu.pk' },
  { program: 'BSc Nursing', institution: 'Aga Khan University', university: 'AKU', city: 'Karachi', province: 'Sindh', deadline: addDays(new Date(), 44), lastDate: addDays(new Date(), 44), applyLink: 'https://aku.edu', link: 'https://aku.edu' },
  { program: 'MPhil Education', institution: 'University of Education Lahore', university: 'UOE', city: 'Lahore', province: 'Punjab', deadline: addDays(new Date(), 65), lastDate: addDays(new Date(), 65), applyLink: 'https://ue.edu.pk', link: 'https://ue.edu.pk' },
  { program: 'BS Mathematics', institution: 'GCU Lahore', university: 'GCU', city: 'Lahore', province: 'Punjab', deadline: addDays(new Date(), 36), lastDate: addDays(new Date(), 36), applyLink: 'https://gcu.edu.pk', link: 'https://gcu.edu.pk' },
  { program: 'MBA Executive', institution: 'IBA Karachi', university: 'IBA Karachi', city: 'Karachi', province: 'Sindh', deadline: addDays(new Date(), 70), lastDate: addDays(new Date(), 70), applyLink: 'https://iba.edu.pk', link: 'https://iba.edu.pk' },
  { program: 'BE Mechanical', institution: 'GIKI', university: 'GIKI', city: 'Topi', province: 'Khyber Pakhtunkhwa', deadline: addDays(new Date(), 58), lastDate: addDays(new Date(), 58), applyLink: 'https://giki.edu.pk', link: 'https://giki.edu.pk' },
  { program: 'BS Psychology', institution: 'University of Karachi', university: 'UoK', city: 'Karachi', province: 'Sindh', deadline: addDays(new Date(), 47), lastDate: addDays(new Date(), 47), applyLink: 'https://uok.edu.pk', link: 'https://uok.edu.pk' },
];

export async function seedAdmissions() {
  await Admission.deleteMany({});
  for (let i = 0; i < admissionSeedData.length; i++) {
    const a = admissionSeedData[i];
    const adm = new Admission({
      ...a,
      slug: `${slugify(a.program)}-${slugify(a.institution)}-${i}`,
      status: 'active',
    });
    await adm.save();
  }
  console.log(`Admissions: seeded ${admissionSeedData.length} documents.`);
}
