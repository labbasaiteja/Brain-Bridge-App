const User = require('../models/user');
const bcrypt = require('bcryptjs');

exports.getProfile = async (req, res) => {
  const user = await User.findById(req.user.id).select('name email role');
  res.json(user);
};

exports.updateProfile = async (req, res) => {
  const { name, email, password } = req.body;
  if (!name && !email && !password) {
    return res.status(400).json({ msg: 'Invalid or missing fields.' });
  }

  const user = await User.findById(req.user.id);
  if (!user) return res.status(404).json({ msg: 'User not found' });

  if (name !== undefined) user.name = name;
  if (email !== undefined) user.email = email;
  if (password !== undefined) user.password = await bcrypt.hash(password, 10);
  
  await user.save();
  res.json({ msg: 'Profile updated' });
};