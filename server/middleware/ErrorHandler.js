const ApiError = require('../utils/ApiError');

// 404 for any route that did not match
const notFound = (req, res, next) => {
  next(new ApiError(404, `Route not found: ${req.method} ${req.originalUrl}`));
};

/**
 * Central error handler: every error thrown in a route, controller or
 * middleware ends up here and is sent back as
 *   { success: false, message, errors? }
 * with an appropriate HTTP status code.
 */
// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  // Express / body-parser errors use `status`, ApiError uses `statusCode`
  let statusCode = err.statusCode || err.status || 500;
  if (statusCode < 400 || statusCode > 599) statusCode = 500;
  let message = err.message || 'Internal server error';
  let errors = err instanceof ApiError ? err.errors : undefined;

  if (err.name === 'ValidationError') {
    // Mongoose schema validation failed
    statusCode = 400;
    message = 'Validation failed';
    errors = Object.fromEntries(
      Object.values(err.errors).map((fieldError) => [fieldError.path, fieldError.message])
    );
  } else if (err.name === 'CastError') {
    // e.g. a malformed ObjectId
    statusCode = 400;
    message = `Invalid ${err.path}: ${JSON.stringify(err.value)}`;
  } else if (err.code === 11000) {
    // MongoDB duplicate key (unique index)
    statusCode = 409;
    const field = Object.keys(err.keyValue || {}).find((key) => key !== 'user') || 'field';
    message = `A record with this ${field} already exists`;
    errors = { [field]: message };
  } else if (err.type === 'entity.parse.failed') {
    statusCode = 400;
    message = 'Malformed JSON in request body';
  } else if (err.type === 'entity.too.large') {
    statusCode = 413;
    message = 'Request body is too large';
  } else if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Not authorized, invalid or expired token';
  }

  // Stack traces are only sent back when NODE_ENV=development
  const isDevelopment = process.env.NODE_ENV === 'development';

  if (statusCode >= 500) {
    console.error(err); // full details stay in the server log
    // Do not leak internal details to clients
    if (!isDevelopment) message = 'Internal server error';
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(errors && { errors }),
    ...(isDevelopment && statusCode >= 500 && { stack: err.stack }),
  });
};

module.exports = { notFound, errorHandler };
