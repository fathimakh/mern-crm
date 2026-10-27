const jwt = require('jsonwebtoken');

// Sign a JWT that identifies the user; verified by middleware/Auth.js
const generateToken = (userId) =>
  jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '1d',
  });

module.exports = generateToken;
