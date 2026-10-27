const express = require('express');
const { registerUser, loginUser, getUserProfile } = require('../controllers/UserController');
const { protect } = require('../middleware/Auth');
const { validateRegister, validateLogin } = require('../middleware/Validate');

const router = express.Router();

router.post('/register', validateRegister, registerUser);
router.post('/login', validateLogin, loginUser);
router.get('/profile', protect, getUserProfile);

module.exports = router;
