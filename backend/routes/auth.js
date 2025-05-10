const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/authController');
const asyncHandler = require('../middleware/asyncHandler');

// Register
router.post('/register', asyncHandler(register));

// Login
router.post('/login', asyncHandler(login));

module.exports = router;
