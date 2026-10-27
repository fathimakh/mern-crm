/**
 * Shared validation helpers used by both the Mongoose schemas and the
 * request validation middleware, so the rules are defined in one place.
 */

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

// Digits, spaces, dashes, dots, brackets and an optional leading "+"
const PHONE_REGEX = /^\+?[\d\s().-]+$/;

const CUSTOMER_STATUSES = ['Lead', 'Prospect', 'Active', 'Inactive'];

const isValidEmail = (value) => typeof value === 'string' && EMAIL_REGEX.test(value.trim());

const isValidPhone = (value) => {
  if (typeof value !== 'string' || !PHONE_REGEX.test(value.trim())) return false;
  const digits = value.replace(/\D/g, '').length;
  return digits >= 7 && digits <= 15;
};

// At least one letter and one number
const isStrongPassword = (value) =>
  typeof value === 'string' && /[A-Za-z]/.test(value) && /\d/.test(value);

module.exports = {
  EMAIL_REGEX,
  PHONE_REGEX,
  CUSTOMER_STATUSES,
  isValidEmail,
  isValidPhone,
  isStrongPassword,
};
