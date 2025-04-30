const express = require('express');
const Assistantship = require('../models/Assistantship');
const auth = require('../middleware/auth');
const User = require('../models/User');
const router = express.Router();

// Professor posts assistantship
router.post('/', auth, async (req, res) => {
  if (req.user.role !== 'professor')
    return res.status(403).json({ msg: 'Only professors can post assistantships' });

  const { title, description } = req.body;
  const assistantship = new Assistantship({
    title,
    description,
    professor: req.user.id
  });
  await assistantship.save();
  res.json(assistantship);
});

// Get all assistantships
router.get('/', async (req, res) => {
  const assistantships = await Assistantship.find().populate('professor', 'name email');
  res.json(assistantships);
});

module.exports = router;
