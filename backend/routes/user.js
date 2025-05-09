const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const router = express.Router();
const auth = require('../middleware/auth');
const asyncHandler = require('../middleware/asyncHandler');


// Get current user's profile
router.get('/', auth, asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id).select('name email role');
  res.json(user);
}));

// Update current user's profile
router.put('/', auth, asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  if (!name && !email && !password) {
    return res.status(400).json({ msg: 'Invalid or missing fields.' });
  }

  const user = await User.findById(req.user.id);
  if (!user) return res.status(404).json({ msg: 'User not found' });

  if (name !== undefined) user.name = name;
  if (email !== undefined) user.email = email;
  if (password !== undefined) user.password = password;

  await user.save();
  res.json({ msg: 'Profile updated'});
}));


module.exports = router;
