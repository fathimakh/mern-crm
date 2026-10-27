const express = require('express');
const { registerUser, loginUser, getUserProfile } = require('../controllers/UserController');
const { protect } = require('../middleware/Auth');

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/profile', protect, getUserProfile);

module.exports = router;
