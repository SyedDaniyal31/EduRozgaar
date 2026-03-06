import crypto from 'crypto';

/**
 * Generate a short unique referral code (e.g. AB12XY).
 */
export function generateReferralCode() {
  return crypto.randomBytes(4).toString('base64url').toUpperCase().replace(/[-_]/g, 'X').slice(0, 8);
}

/**
 * Ensure user has a referral code; generate and save if missing.
 */
export async function ensureReferralCode(user) {
  if (user.referralCode) return user.referralCode;
  let code = generateReferralCode();
  let exists = await user.constructor.findOne({ referralCode: code });
  while (exists) {
    code = generateReferralCode();
    exists = await user.constructor.findOne({ referralCode: code });
  }
  user.referralCode = code;
  await user.save({ validateBeforeSave: false });
  return code;
}
