const express = require('express');
const Application = require('../models/application');
const Assistantship = require('../models/assistantship');
const auth = require('../middleware/auth');
const router = express.Router();
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/resumes/');
  },
  filename: function (req, file, cb) {
    const uniqueName = Date.now() + '-' + file.originalname;
    cb(null, uniqueName);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    if (ext !== '.pdf') return cb(new Error('Only PDFs allowed'));
    cb(null, true);
  }
});


// Student applies to assistantship
router.post('/', auth, upload.single('resume'), async (req, res) => {
  if (req.user.role !== 'student')
    return res.status(403).json({ msg: 'Only students can apply' });

  const { assistantshipId, motivation } = req.body;
  // Check if assistantship exists
  const assistantship = await Assistantship.findById(assistantshipId);
  if (!assistantship)
    return res.status(404).json({ msg: 'Assistantship not found' });

  // Check for duplicate application
  const existing = await Application.findOne({
    assistantship: assistantshipId,
    student: req.user.id
  });
  if (existing)
    return res.status(409).json({ msg: 'You have already applied to this assistantship' });

  // Create application
  const application = new Application({
    assistantship: assistantshipId,
    student: req.user.id,
    motivation,
    resumePath: `/uploads/resumes/${req.file.filename}`
  });

  await application.save();
  res.status(201).json(application);
});

// Professor views a specific application
router.get('/:id/professor', auth, async (req, res) => {
  if (req.user.role !== 'professor') {
    return res.status(403).json({ msg: 'Only professors can view applications' });
  }

  try {
    const application = await Application.findById(req.params.id)
      .populate('student', 'name email')
      .populate('assistantship');

    if (!application)
      return res.status(404).json({ msg: 'Application not found' });

    // Check ownership
    if (application.assistantship.professor.toString() !== req.user.id) {
      return res.status(403).json({ msg: 'You do not own this assistantship' });
    }

    res.json({
      student: {
        name: application.student.name,
        email: application.student.email
      },
      assistantship: {
        title: application.assistantship.title,
        domain: application.assistantship.domain
      },
      motivation: application.motivation,
      resumePath: application.resumePath,
      status: application.status,
      submittedAt: application.createdAt
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
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
