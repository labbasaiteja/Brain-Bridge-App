const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const router = express.Router();
const asyncHandler = require('../middleware/asyncHandler');

// Register
router.post('/register', asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;
  if (!name || !email || !password || !role) {
    return res.status(400).json({ msg: 'Invalid or missing fields.' });
  }
  
  let user = await User.findOne({ email });
  if (user) return res.status(400).json({ msg: 'User already exists' });

  user = new User({ name, email, password: await bcrypt.hash(password, 10), role });
  await user.save();

  const payload = { user: { id: user._id, role: user.role } };
  jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' }, (err, token) => {
    if (err) throw err;
    res.json({ token });
  });
  
}));

// Login
router.post('/login', asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ msg: 'Invalid credentials' });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

  const payload = { user: { id: user._id, role: user.role } };
  jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' }, (err, token) => {
    if (err) throw err;
    res.json({ token });
  });
  
}));

module.exports = router;
