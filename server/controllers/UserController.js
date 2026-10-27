const User = require('../models/UserModel');
const ApiError = require('../utils/ApiError');
const generateToken = require('../utils/generateToken');

// Express 5 forwards errors thrown in async handlers to the error middleware,
// so the controllers can simply `throw new ApiError(...)`.

/**
 * @route   POST /api/users/register
 * @access  Public
 */
const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  const existingUser = await User.exists({ email });
  if (existingUser) {
    const message = 'An account with this email already exists';
    throw new ApiError(409, message, { email: message });
  }

  // The password is hashed by the pre-save hook in UserModel
  const user = await User.create({ name, email, password });

  res.status(201).json({
    success: true,
    message: 'Registration successful',
    token: generateToken(user._id),
    user,
  });
};

/**
 * @route   POST /api/users/login
 * @access  Public
 */
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select('+password');
  const passwordMatches = user && (await user.comparePassword(password));

  if (!passwordMatches) {
    throw new ApiError(401, 'Invalid email or password');
  }

  res.json({
    success: true,
    message: 'Login successful',
    token: generateToken(user._id),
    user,
  });
};

/**
 * @route   GET /api/users/profile
 * @access  Private (requires Bearer token)
 */
const getUserProfile = async (req, res) => {
  res.json({ success: true, user: req.user });
};

module.exports = { registerUser, loginUser, getUserProfile };
