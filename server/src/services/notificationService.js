/**
 * Placeholder notification service (Phase-3).
 */
import { Notification } from '../models/Notification.js';

export async function createNotification(data) {
  return Notification.create(data);
}
