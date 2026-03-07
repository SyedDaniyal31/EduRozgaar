import { JobPlan } from '../models/JobPlan.js';

export const defaultPlans = [
  {
    name: 'Starter',
    slug: 'starter',
    durationDays: 7,
    price: 1,
    features: ['Standard listing', '7 days visibility'],
  },
  {
    name: 'Standard',
    slug: 'standard',
    durationDays: 30,
    price: 2,
    features: ['Standard listing', 'Highlighted listing', '30 days visibility'],
  },
  {
    name: 'Premium',
    slug: 'premium',
    durationDays: null,
    price: 3,
    features: ['Standard listing', 'Highlighted listing', 'Featured badge', 'Until filled', 'Priority search ranking', 'Analytics access'],
  },
];

export async function seedJobPlans() {
  const existing = await JobPlan.countDocuments();
  if (existing > 0) return;
  await JobPlan.insertMany(defaultPlans);
}
