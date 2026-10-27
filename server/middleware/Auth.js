const jwt = require('jsonwebtoken');
const User = require('../models/UserModel');
const ApiError = require('../utils/ApiError');

/**
 * Protects routes: expects "Authorization: Bearer <token>", verifies the
 * JWT and attaches the logged-in user to req.user.
 */
const protect = async (req, res, next) => {
  const authHeader = req.headers.authorization || '';

  if (!authHeader.startsWith('Bearer ')) {
    throw new ApiError(401, 'Not authorized, no token provided');
  }

  const token = authHeader.split(' ')[1];

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    const message =
      error.name === 'TokenExpiredError'
        ? 'Session expired, please log in again'
        : 'Not authorized, invalid token';
    throw new ApiError(401, message);
  }

  const user = await User.findById(decoded.id);
  if (!user) {
    throw new ApiError(401, 'Not authorized, user no longer exists');
  }

  req.user = user;
  next();
};

module.exports = { protect };
