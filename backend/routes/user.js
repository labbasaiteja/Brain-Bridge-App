const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const router = express.Router();
const auth = require('../middleware/auth');


// Get current user's profile
router.get('/', auth, async (req, res) => {
  const user = await User.findById(req.user.id).select('name email role');
  res.json(user);
});

// Update current user's profile
router.put('/', auth, async (req, res) => {
  const { name, email, password } = req.body;

  const user = await User.findById(req.user.id);
  if (!user) return res.status(404).json({ msg: 'User not found' });

  if (name !== undefined) user.name = name;
  if (email !== undefined) user.bio = email;
  if (password !== undefined) user.phone = password;

  await user.save();
  res.json({ msg: 'Profile updated'});
});


module.exports = router;
