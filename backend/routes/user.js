const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const asyncHandler = require('../middleware/asyncHandler');
const { getProfile, updateProfile } = require('../controllers/userController');

// Get current user's profile
router.get('/', auth, asyncHandler(getProfile));

// Update current user's profile
router.put('/', auth, asyncHandler(updateProfile));

module.exports = router;
