/**
 * Placeholder email service for notifications (Phase-3).
 * Replace with real SMTP (e.g. nodemailer) when MAIL_* env vars are set.
 */
export async function sendEmail({ to, subject, body, text }) {
  console.log('[Email placeholder]', { to, subject });
  return { sent: true };
}

const RESET_SUBJECT = 'EduRozgaar – Reset your password';
const RESET_TEXT = (url) =>
  `You requested a password reset. Click the link below to set a new password (valid for 1 hour):\n\n${url}\n\nIf you didn't request this, you can ignore this email.`;

export async function sendPasswordResetEmail(to, resetUrl) {
  return sendEmail({
    to,
    subject: RESET_SUBJECT,
    text: RESET_TEXT(resetUrl),
    body: `<p>You requested a password reset. <a href="${resetUrl}">Click here to set a new password</a> (valid for 1 hour).</p><p>If you didn't request this, you can ignore this email.</p>`,
  });
}
