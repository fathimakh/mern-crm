/**
 * Error with an HTTP status code (and optional field errors) that the
 * central error handler turns into a JSON response.
 *
 *   throw new ApiError(404, 'Customer not found');
 *   throw new ApiError(400, 'Validation failed', { email: 'Email is required' });
 */
class ApiError extends Error {
  constructor(statusCode, message, errors) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    if (errors) this.errors = errors;
  }
}

module.exports = ApiError;
