/**
 * Ensure an admin user exists. Safe to run anytime (updates existing or creates).
 * Run from server dir: node src/scripts/ensureAdminUser.js
 *
 * Default admin: admin@edurozgaar.pk / Admin1234
 * To use another email: ADMIN_EMAIL=you@example.com ADMIN_PASSWORD=YourPass node src/scripts/ensureAdminUser.js
 */
import 'dotenv/config';
import mongoose from 'mongoose';
import { User } from '../models/User.js';

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/edurozgaar';
const ADMIN_EMAIL = (process.env.ADMIN_EMAIL || 'admin@edurozgaar.pk').trim().toLowerCase();
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'Admin1234';

async function ensureAdmin() {
  await mongoose.connect(MONGO_URI);
  let user = await User.findOne({ email: ADMIN_EMAIL }).select('+password');
  if (user) {
    user.role = 'Admin';
    if (ADMIN_PASSWORD && process.env.ADMIN_PASSWORD) {
      user.password = ADMIN_PASSWORD;
      await user.save();
    } else {
      await user.save({ validateBeforeSave: false });
    }
    console.log('Updated existing user to Admin:', ADMIN_EMAIL);
  } else {
    user = await User.create({
      name: 'Admin User',
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
      role: 'Admin',
    });
    console.log('Created admin user:', ADMIN_EMAIL);
  }
  console.log('Login at /auth/login then open /admin');
  await mongoose.disconnect();
  process.exit(0);
}

ensureAdmin().catch((err) => {
  console.error(err);
  process.exit(1);
});
