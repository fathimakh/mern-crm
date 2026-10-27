const ApiError = require('../utils/ApiError');
const {
  CUSTOMER_STATUSES,
  isValidEmail,
  isValidPhone,
  isStrongPassword,
} = require('../utils/validators');

/**
 * Request validation middleware.
 *
 * Each validator checks req.body (or req.params / req.query) BEFORE the
 * controller runs. Invalid requests are rejected with
 *   400 { success: false, message: 'Validation failed', errors: { field: 'message' } }
 */

// Starts with a letter; then letters / combining marks (any language), spaces, . ' -
const NAME_REGEX = /^[\p{L}\p{M}][\p{L}\p{M} .'-]*$/u;
const OBJECT_ID_REGEX = /^[a-f\d]{24}$/i;

const isMissing = (value) =>
  value === undefined || value === null || (typeof value === 'string' && value.trim() === '');

// Passwords are kept exactly as typed (spaces are valid password characters)
const UNTRIMMED_FIELDS = ['password'];

// Trim every string in the body, turn null into an empty value and lowercase the email
const normalizeBody = (body) => {
  const source = body && typeof body === 'object' && !Array.isArray(body) ? body : {};
  const normalized = {};
  for (const [key, value] of Object.entries(source)) {
    if (value === null) normalized[key] = '';
    else if (typeof value === 'string' && !UNTRIMMED_FIELDS.includes(key)) normalized[key] = value.trim();
    else normalized[key] = value;
  }
  if (typeof normalized.email === 'string') normalized.email = normalized.email.toLowerCase();
  return normalized;
};

/**
 * Validates a single text field and returns an error message (or undefined).
 * options: { required, min, max, pattern, patternMessage, check, checkMessage }
 */
const checkText = (value, label, options = {}) => {
  if (isMissing(value)) return options.required ? `${label} is required` : undefined;
  if (typeof value !== 'string') return `${label} must be a text value`;
  if (options.min && value.length < options.min) return `${label} must be at least ${options.min} characters`;
  if (options.max && value.length > options.max) return `${label} cannot exceed ${options.max} characters`;
  if (options.pattern && !options.pattern.test(value)) return options.patternMessage;
  if (options.check && !options.check(value)) return options.checkMessage;
  return undefined;
};

// Builds { field: message } keeping only the fields that failed
const collectErrors = (checks) =>
  Object.fromEntries(Object.entries(checks).filter(([, message]) => Boolean(message)));

// bcrypt only uses the first 72 bytes of a password
const MAX_PASSWORD_BYTES = 72;

// Turns a rules function into Express middleware
const validateBody = (rules) => (req, res, next) => {
  // A body was sent but no parser understood it (e.g. text/plain)
  if (req.body === undefined && req.is('*/*')) {
    return next(new ApiError(415, 'Unsupported content type: send JSON with Content-Type: application/json'));
  }

  const body = normalizeBody(req.body);
  const errors = rules(body);

  if (Object.keys(errors).length > 0) {
    return next(new ApiError(400, 'Validation failed', errors));
  }

  req.body = body;
  next();
};

// ---------- Auth ----------

const registerRules = (body) =>
  collectErrors({
    name: checkText(body.name, 'Name', {
      required: true,
      min: 2,
      max: 50,
      pattern: NAME_REGEX,
      patternMessage: 'Name can only contain letters, spaces, dots, apostrophes and hyphens',
    }),
    email: checkText(body.email, 'Email', {
      required: true,
      max: 254,
      check: isValidEmail,
      checkMessage: 'Please provide a valid email address',
    }),
    password:
      checkText(body.password, 'Password', {
        required: true,
        min: 6,
        max: 64,
        check: isStrongPassword,
        checkMessage: 'Password must contain at least one letter and one number',
      }) ||
      (Buffer.byteLength(body.password, 'utf8') > MAX_PASSWORD_BYTES ? 'Password is too long' : undefined),
  });

const loginRules = (body) =>
  collectErrors({
    email: checkText(body.email, 'Email', {
      required: true,
      max: 254,
      check: isValidEmail,
      checkMessage: 'Please provide a valid email address',
    }),
    password: checkText(body.password, 'Password', { required: true, max: 64 }),
  });

// ---------- Customers ----------

const CUSTOMER_FIELDS = ['name', 'email', 'phone', 'company', 'status', 'notes'];

// partial = true for updates: fields are optional but must be valid when sent
const customerRules = (body, { partial = false } = {}) => {
  const required = !partial;

  if (partial && !CUSTOMER_FIELDS.some((field) => body[field] !== undefined)) {
    return { fields: `Provide at least one field to update: ${CUSTOMER_FIELDS.join(', ')}` };
  }

  const errors = collectErrors({
    name: checkText(body.name, 'Name', {
      required,
      min: 2,
      max: 60,
      pattern: NAME_REGEX,
      patternMessage: 'Name can only contain letters, spaces, dots, apostrophes and hyphens',
    }),
    email: checkText(body.email, 'Email', {
      required,
      max: 254,
      check: isValidEmail,
      checkMessage: 'Please provide a valid email address',
    }),
    phone: checkText(body.phone, 'Phone', {
      required,
      check: isValidPhone,
      checkMessage: 'Please provide a valid phone number (7-15 digits)',
    }),
    company: checkText(body.company, 'Company', { max: 100 }),
    // Optional (defaults to "Lead"), but when sent it must be one of the allowed values
    status:
      body.status !== undefined && !CUSTOMER_STATUSES.includes(body.status)
        ? `Status must be one of: ${CUSTOMER_STATUSES.join(', ')}`
        : undefined,
    notes: checkText(body.notes, 'Notes', { max: 500 }),
  });

  // Fields that are required on create must not be blanked out on update
  if (partial) {
    ['name', 'email', 'phone'].forEach((field) => {
      if (body[field] !== undefined && isMissing(body[field])) {
        errors[field] = `${field[0].toUpperCase()}${field.slice(1)} cannot be empty`;
      }
    });
  }

  return errors;
};

// ---------- Params & query ----------

const validateObjectId = (req, res, next) => {
  if (!OBJECT_ID_REGEX.test(req.params.id)) {
    return next(new ApiError(400, 'Invalid customer id', { id: 'Invalid customer id' }));
  }
  next();
};

const validateCustomerQuery = (req, res, next) => {
  const { search, status } = req.query;
  const errors = collectErrors({
    search: checkText(search, 'Search', { max: 100 }),
    status: checkText(status, 'Status', {
      check: (value) => CUSTOMER_STATUSES.includes(value),
      checkMessage: `Status must be one of: ${CUSTOMER_STATUSES.join(', ')}`,
    }),
  });

  if (Object.keys(errors).length > 0) {
    return next(new ApiError(400, 'Invalid query parameters', errors));
  }
  next();
};

module.exports = {
  validateRegister: validateBody(registerRules),
  validateLogin: validateBody(loginRules),
  validateCustomer: validateBody((body) => customerRules(body)),
  validateCustomerUpdate: validateBody((body) => customerRules(body, { partial: true })),
  validateObjectId,
  validateCustomerQuery,
};
