const express = require('express');
const Assistantship = require('../models/assistantship');
const Application = require('../models/application');
const auth = require('../middleware/auth');
const User = require('../models/user');
const router = express.Router();

// Professor posts assistantship
router.post('/', auth, async (req, res) => {
  if (req.user.role !== 'professor')
    return res.status(403).json({ msg: 'Only professors can post assistantships' });

  const { title, description, domain, endTime } = req.body;
  const assistantship = new Assistantship({
    title,
    description,
    domain,
    endTime,
    professor: req.user.id
  });

  await assistantship.save();
  res.status(201).json(assistantship);
});

// Professor views all their assistantships + application count
router.get('/all_professor', auth, async (req, res) => {
  if (req.user.role !== 'professor')
    return res.status(403).json({ msg: 'Only professors can view their assistantships' });

  const assistantships = await Assistantship.find({ professor: req.user.id })
    .select('title domain endTime createdAt')
    .lean(); // make documents plain JS objects for easier manipulation

  // Fetch counts in parallel
  const ids = assistantships.map(a => a._id);
  const counts = await Application.aggregate([
    { $match: { assistantship: { $in: ids } } },
    { $group: { _id: '$assistantship', count: { $sum: 1 } } }
  ]);

  const countMap = new Map(counts.map(c => [c._id.toString(), c.count]));

  const enriched = assistantships.map(a => ({
    ...a,
    applicantCount: countMap.get(a._id.toString()) || 0
  }));

  res.json(enriched);
});


//Professor view a single assistantship + applications
router.get('/:id/professor', auth, async (req, res) => {
  if (req.user.role !== 'professor') {
    return res.status(403).json({ msg: 'Only professors can view this data' });
  }

  try {
    // Find assistantship
    const assistantship = await Assistantship.findById(req.params.id);
    if (!assistantship)
      return res.status(404).json({ msg: 'Assistantship not found' });

    // Check ownership
    if (assistantship.professor.toString() !== req.user.id)
      return res.status(403).json({ msg: 'You do not own this assistantship' });

    // Find applications
    const applications = await Application.find({ assistantship: req.params.id })
      .populate('student', 'name email') // only populate basic student info
      .select('motivation status createdAt'); // optional: select what fields to show

    res.json({
      title: assistantship.title,
      description: assistantship.description,
      domain: assistantship.domain,
      endTime: assistantship.endTime,
      createdAt: assistantship.createdAt,
      applications: applications.map(app => ({
        studentName: app.student.name,
        studentEmail: app.student.email,
        motivation: app.motivation,
        status: app.status,
        submittedAt: app.createdAt,
        applicationId: app._id // optional: include application ID for further actions
      }))
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Get all assistantships
router.get('/', async (req, res) => {
  const assistantships = await Assistantship.find().populate('professor', 'name email');
  res.json(assistantships);
});

module.exports = router;
