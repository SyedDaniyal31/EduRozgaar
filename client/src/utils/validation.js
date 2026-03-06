const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD = 8;

export function validateEmail(value) {
  if (!value?.trim()) return 'Email is required';
  if (!EMAIL_REGEX.test(value.trim())) return 'Enter a valid email address';
  return null;
}

export function validatePassword(value, isRegister = false) {
  if (!value) return 'Password is required';
  if (value.length < MIN_PASSWORD) return `Password must be at least ${MIN_PASSWORD} characters`;
  if (isRegister) {
    if (!/[A-Z]/.test(value)) return 'Include at least one uppercase letter';
    if (!/[a-z]/.test(value)) return 'Include at least one lowercase letter';
    if (!/[0-9]/.test(value)) return 'Include at least one number';
  }
  return null;
}

export function validateName(value) {
  if (!value?.trim()) return 'Name is required';
  return null;
}
