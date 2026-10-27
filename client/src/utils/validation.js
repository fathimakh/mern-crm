import { CUSTOMER_STATUSES } from './constants'

/**
 * Client-side validation rules. They mirror the API's validation
 * middleware so users get instant feedback before a request is sent.
 * Each validator returns an object: { fieldName: 'error message' }.
 */

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
const NAME_REGEX = /^[\p{L}\s.'-]+$/u
const PHONE_REGEX = /^\+?[\d\s().-]+$/

const isBlank = (value) => !value || !String(value).trim()

export const isValidEmail = (value) => EMAIL_REGEX.test(String(value).trim())

export const isValidPhone = (value) => {
  const text = String(value).trim()
  const digits = text.replace(/\D/g, '').length
  return PHONE_REGEX.test(text) && digits >= 7 && digits <= 15
}

const nameError = (value, label, max) => {
  const text = String(value ?? '').trim()
  if (!text) return `${label} is required`
  if (text.length < 2) return `${label} must be at least 2 characters`
  if (text.length > max) return `${label} cannot exceed ${max} characters`
  if (!NAME_REGEX.test(text)) return `${label} can only contain letters, spaces, dots, apostrophes and hyphens`
  return undefined
}

const emailError = (value) => {
  if (isBlank(value)) return 'Email is required'
  if (!isValidEmail(value)) return 'Please enter a valid email address'
  return undefined
}

const compact = (errors) => Object.fromEntries(Object.entries(errors).filter(([, message]) => Boolean(message)))

export const validateRegister = (values) => {
  let password
  if (!values.password) password = 'Password is required'
  else if (values.password.length < 6) password = 'Password must be at least 6 characters'
  else if (values.password.length > 64) password = 'Password cannot exceed 64 characters'
  else if (!/[A-Za-z]/.test(values.password) || !/\d/.test(values.password))
    password = 'Password must contain at least one letter and one number'

  let confirmPassword
  if (!values.confirmPassword) confirmPassword = 'Please confirm your password'
  else if (values.confirmPassword !== values.password) confirmPassword = 'Passwords do not match'

  return compact({
    name: nameError(values.name, 'Name', 50),
    email: emailError(values.email),
    password,
    confirmPassword,
  })
}

export const validateLogin = (values) =>
  compact({
    email: emailError(values.email),
    password: values.password ? undefined : 'Password is required',
  })

export const validateCustomer = (values) => {
  let phone
  if (isBlank(values.phone)) phone = 'Phone number is required'
  else if (!isValidPhone(values.phone)) phone = 'Enter a valid phone number (7-15 digits)'

  return compact({
    name: nameError(values.name, 'Name', 60),
    email: emailError(values.email),
    phone,
    company: values.company?.trim().length > 100 ? 'Company cannot exceed 100 characters' : undefined,
    status: CUSTOMER_STATUSES.includes(values.status) ? undefined : 'Please choose a valid status',
    notes: values.notes?.trim().length > 500 ? 'Notes cannot exceed 500 characters' : undefined,
  })
}

// Password strength meter used on the register page (0-4)
export const passwordStrength = (password = '') => {
  let score = 0
  if (password.length >= 6) score += 1
  if (password.length >= 10) score += 1
  if (/[A-Za-z]/.test(password) && /\d/.test(password)) score += 1
  if (/[^A-Za-z0-9]/.test(password) || (/[a-z]/.test(password) && /[A-Z]/.test(password))) score += 1
  return score
}
