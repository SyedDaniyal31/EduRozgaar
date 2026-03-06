const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD_LENGTH = 8;
const MAX_PASSWORD_LENGTH = 128;

export function validateEmail(email) {
  if (!email || typeof email !== 'string') return 'Email is required';
  const trimmed = email.trim().toLowerCase();
  if (!EMAIL_REGEX.test(trimmed)) return 'Invalid email format';
  return null;
}

export function validatePassword(password, isRegister = false) {
  if (!password || typeof password !== 'string') return 'Password is required';
  if (password.length < MIN_PASSWORD_LENGTH)
    return `Password must be at least ${MIN_PASSWORD_LENGTH} characters`;
  if (password.length > MAX_PASSWORD_LENGTH)
    return `Password must be at most ${MAX_PASSWORD_LENGTH} characters`;
  if (isRegister) {
    if (!/[A-Z]/.test(password)) return 'Password must contain at least one uppercase letter';
    if (!/[a-z]/.test(password)) return 'Password must contain at least one lowercase letter';
    if (!/[0-9]/.test(password)) return 'Password must contain at least one number';
  }
  return null;
}

export function validateAuthRegister(body) {
  const emailError = validateEmail(body.email);
  const passwordError = validatePassword(body.password, true);
  const name = body.name != null ? String(body.name).trim() : '';
  return { emailError, passwordError, name };
}

export function validateAuthLogin(body) {
  const emailError = validateEmail(body.email);
  const passwordError = validatePassword(body.password, false);
  return { emailError, passwordError };
}
