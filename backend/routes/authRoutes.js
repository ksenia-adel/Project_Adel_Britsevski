const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/authController');

// route for user registration
router.post('/register', register);

// route for user login
router.post('/login', login);

module.exports = router;
