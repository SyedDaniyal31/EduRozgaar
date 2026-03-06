import { Scholarship } from '../models/Scholarship.js';
import { slugify } from '../utils/slugify.js';

function addDays(d, days) {
  const out = new Date(d);
  out.setDate(out.getDate() + days);
  return out;
}

export const scholarshipSeedData = [
  { title: 'HEC Need-Based Scholarship', provider: 'HEC Pakistan', country: 'Pakistan', degreeLevel: 'Undergraduate', university: 'Multiple', fundingType: 'Fully Funded', deadline: addDays(new Date(), 90), level: 'Undergraduate' },
  { title: 'Prime Minister Laptop Scheme', provider: 'Government of Pakistan', country: 'Pakistan', degreeLevel: 'Undergraduate', university: 'N/A', fundingType: 'Partial', deadline: addDays(new Date(), 60), level: 'Undergraduate' },
  { title: 'Turkiye Burslari', provider: 'Government of Turkey', country: 'Turkey', degreeLevel: 'Graduate', university: 'Turkish Universities', fundingType: 'Fully Funded', deadline: addDays(new Date(), 45), level: 'Graduate' },
  { title: 'Chinese Government Scholarship (CSC)', provider: 'China Scholarship Council', country: 'China', degreeLevel: 'Graduate', university: 'Chinese Universities', fundingType: 'Fully Funded', deadline: addDays(new Date(), 75), level: 'Graduate' },
  { title: 'DAAD Scholarship Germany', provider: 'DAAD', country: 'Germany', degreeLevel: 'Graduate', university: 'German Universities', fundingType: 'Fully Funded', deadline: addDays(new Date(), 120), level: 'Graduate' },
  { title: 'British Chevening Scholarship', provider: 'UK Government', country: 'UK', degreeLevel: 'Graduate', university: 'UK Universities', fundingType: 'Fully Funded', deadline: addDays(new Date(), 200), level: 'Graduate' },
  { title: 'Commonwealth Scholarship', provider: 'Commonwealth Commission', country: 'UK', degreeLevel: 'Graduate', university: 'UK Universities', fundingType: 'Fully Funded', deadline: addDays(new Date(), 150), level: 'Graduate' },
  { title: 'Stipendium Hungaricum', provider: 'Hungarian Government', country: 'Hungary', degreeLevel: 'Undergraduate', university: 'Hungarian Universities', fundingType: 'Fully Funded', deadline: addDays(new Date(), 80), level: 'Undergraduate' },
  { title: 'Italian Government Scholarships', provider: 'MAECI Italy', country: 'Italy', degreeLevel: 'Graduate', university: 'Italian Universities', fundingType: 'Fully Funded', deadline: addDays(new Date(), 95), level: 'Graduate' },
  { title: 'Canadian Commonwealth Scholarship', provider: 'Government of Canada', country: 'Canada', degreeLevel: 'Graduate', university: 'Canadian Universities', fundingType: 'Fully Funded', deadline: addDays(new Date(), 100), level: 'Graduate' },
  { title: 'Fulbright Pakistan', provider: 'USEFP', country: 'USA', degreeLevel: 'Graduate', university: 'US Universities', fundingType: 'Fully Funded', deadline: addDays(new Date(), 180), level: 'Graduate' },
  { title: 'Erasmus Mundus Joint Master', provider: 'European Commission', country: 'Multiple', degreeLevel: 'Graduate', university: 'European Consortium', fundingType: 'Fully Funded', deadline: addDays(new Date(), 110), level: 'Graduate' },
  { title: 'Australian Awards Scholarship', provider: 'DFAT Australia', country: 'Australia', degreeLevel: 'Graduate', university: 'Australian Universities', fundingType: 'Fully Funded', deadline: addDays(new Date(), 130), level: 'Graduate' },
  { title: 'LUMS National Outreach Program', provider: 'LUMS', country: 'Pakistan', degreeLevel: 'Undergraduate', university: 'LUMS', fundingType: 'Partial', deadline: addDays(new Date(), 70), level: 'Undergraduate' },
  { title: 'IBA Need-Based Aid', provider: 'IBA Karachi', country: 'Pakistan', degreeLevel: 'Undergraduate', university: 'IBA Karachi', fundingType: 'Partial', deadline: addDays(new Date(), 85), level: 'Undergraduate' },
  { title: 'PEEF Scholarship', provider: 'Punjab Education Endowment Fund', country: 'Pakistan', degreeLevel: 'Undergraduate', university: 'Multiple Punjab', fundingType: 'Partial', deadline: addDays(new Date(), 55), level: 'Undergraduate' },
  { title: 'Sindh Endowment Fund', provider: 'Sindh Government', country: 'Pakistan', degreeLevel: 'Undergraduate', university: 'Multiple Sindh', fundingType: 'Partial', deadline: addDays(new Date(), 65), level: 'Undergraduate' },
  { title: 'KP Government Merit Scholarship', provider: 'KP Higher Education', country: 'Pakistan', degreeLevel: 'Undergraduate', university: 'Multiple KP', fundingType: 'Partial', deadline: addDays(new Date(), 50), level: 'Undergraduate' },
  { title: 'NUST Undergraduate Scholarship', provider: 'NUST', country: 'Pakistan', degreeLevel: 'Undergraduate', university: 'NUST', fundingType: 'Partial', deadline: addDays(new Date(), 40), level: 'Undergraduate' },
  { title: 'FAST Merit Scholarship', provider: 'FAST University', country: 'Pakistan', degreeLevel: 'Undergraduate', university: 'FAST', fundingType: 'Partial', deadline: addDays(new Date(), 35), level: 'Undergraduate' },
  { title: 'Japan MEXT Scholarship', provider: 'MEXT Japan', country: 'Japan', degreeLevel: 'Graduate', university: 'Japanese Universities', fundingType: 'Fully Funded', deadline: addDays(new Date(), 140), level: 'Graduate' },
  { title: 'Korean Government Scholarship (KGSP)', provider: 'NIIED Korea', country: 'South Korea', degreeLevel: 'Graduate', university: 'Korean Universities', fundingType: 'Fully Funded', deadline: addDays(new Date(), 125), level: 'Graduate' },
  { title: 'Swedish Institute Scholarship', provider: 'Swedish Institute', country: 'Sweden', degreeLevel: 'Graduate', university: 'Swedish Universities', fundingType: 'Fully Funded', deadline: addDays(new Date(), 115), level: 'Graduate' },
  { title: 'Netherlands Orange Knowledge', provider: 'Nuffic', country: 'Netherlands', degreeLevel: 'Graduate', university: 'Dutch Universities', fundingType: 'Fully Funded', deadline: addDays(new Date(), 105), level: 'Graduate' },
  { title: 'New Zealand Commonwealth Scholarship', provider: 'NZ Government', country: 'New Zealand', degreeLevel: 'Graduate', university: 'NZ Universities', fundingType: 'Fully Funded', deadline: addDays(new Date(), 160), level: 'Graduate' },
  { title: 'Malaysia International Scholarship (MIS)', provider: 'Malaysian Government', country: 'Malaysia', degreeLevel: 'Graduate', university: 'Malaysian Universities', fundingType: 'Fully Funded', deadline: addDays(new Date(), 98), level: 'Graduate' },
  { title: 'UET Lahore Merit Scholarship', provider: 'UET Lahore', country: 'Pakistan', degreeLevel: 'Undergraduate', university: 'UET Lahore', fundingType: 'Partial', deadline: addDays(new Date(), 42), level: 'Undergraduate' },
  { title: 'PU Vice Chancellor Fund', provider: 'University of Punjab', country: 'Pakistan', degreeLevel: 'Undergraduate', university: 'University of Punjab', fundingType: 'Partial', deadline: addDays(new Date(), 58), level: 'Undergraduate' },
  { title: 'AKU Financial Aid', provider: 'Aga Khan University', country: 'Pakistan', degreeLevel: 'Undergraduate', university: 'AKU', fundingType: 'Partial', deadline: addDays(new Date(), 72), level: 'Undergraduate' },
  { title: 'GIKI Need-Based Grant', provider: 'GIK Institute', country: 'Pakistan', degreeLevel: 'Undergraduate', university: 'GIKI', fundingType: 'Partial', deadline: addDays(new Date(), 48), level: 'Undergraduate' },
  { title: 'COMSATS Merit Scholarship', provider: 'COMSATS University', country: 'Pakistan', degreeLevel: 'Undergraduate', university: 'COMSATS', fundingType: 'Partial', deadline: addDays(new Date(), 62), level: 'Undergraduate' },
];

export async function seedScholarships() {
  await Scholarship.deleteMany({});
  for (let i = 0; i < scholarshipSeedData.length; i++) {
    const s = scholarshipSeedData[i];
    const sch = new Scholarship({
      ...s,
      slug: `${slugify(s.title)}-${slugify(s.country)}-${i}`,
      status: 'active',
    });
    await sch.save();
  }
  console.log(`Scholarships: seeded ${scholarshipSeedData.length} documents.`);
}
