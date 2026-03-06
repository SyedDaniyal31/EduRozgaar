/**
 * Placeholder email service for notifications (Phase-3).
 */
export async function sendEmail({ to, subject, body }) {
  console.log('[Email placeholder]', { to, subject });
  return { sent: true };
}
