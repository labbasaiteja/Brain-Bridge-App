const express = require('express');
const Application = require('../models/Application');
const Assistantship = require('../models/Assistantship');
const auth = require('../middleware/auth');
const router = express.Router();

// Student applies to assistantship
router.post('/', auth, async (req, res) => {
  if (req.user.role !== 'student')
    return res.status(403).json({ msg: 'Only students can apply' });

  const { assistantshipId, motivation } = req.body;
  const application = new Application({
    assistantship: assistantshipId,
    student: req.user.id,
    motivation
  });
  await application.save();
  res.json(application);
});

// Professor views applications for their assistantships
router.get('/professor', auth, async (req, res) => {
  if (req.user.role !== 'professor')
    return res.status(403).json({ msg: 'Only professors can view this' });

  const assistantships = await Assistantship.find({ professor: req.user.id });
  const applications = await Application.find({ assistantship: { $in: assistantships.map(a => a._id) } })
    .populate('student', 'name email')
    .populate('assistantship', 'title');
  res.json(applications);
});

// Student views their applications
router.get('/student', auth, async (req, res) => {
  if (req.user.role !== 'student')
    return res.status(403).json({ msg: 'Only students can view this' });

  const applications = await Application.find({ student: req.user.id })
    .populate('assistantship', 'title');
  res.json(applications);
});

module.exports = router;
