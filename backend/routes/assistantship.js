const express = require('express');
const Assistantship = require('../models/assistantship');
const Application = require('../models/application');
const auth = require('../middleware/auth');
const User = require('../models/user');
const asyncHandler = require('../middleware/asyncHandler');
const router = express.Router();
const path = require('path');
const fs = require('fs');

// Professor posts assistantship
router.post('/', auth, asyncHandler(async (req, res) => {
  if (req.user.role !== 'professor')
    return res.status(403).json({ msg: 'Only professors can post assistantships' });

  const { title, description, domain, endTime } = req.body;
  if (!title || !description || !domain || !endTime) {
    return res.status(400).json({ msg: 'Invalid or missing fields.' }); 
  }
  const assistantship = new Assistantship({
    title,
    description,
    domain,
    endTime,
    professor: req.user.id
  });

  await assistantship.save();
  res.status(201).json(assistantship);
}));

// Professor views all their assistantships + application count
router.get('/all_professor', auth, asyncHandler(async (req, res) => {
  if (req.user.role !== 'professor')
    return res.status(403).json({ msg: 'Only professors can view their assistantships' });

  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 5;
  const skip = (page - 1) * limit;
  // Count total first
  const total = await Assistantship.countDocuments({ professor: req.user.id });


  const assistantships = await Assistantship.find({ professor: req.user.id })
    .select('title domain endTime createdAt status')
    .skip(skip)
    .limit(limit)
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

  res.json({
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
    data: enriched
  });
}));


//Professor view a single assistantship + applications
router.get('/:id/professor', auth, asyncHandler(async (req, res) => {
  if (req.user.role !== 'professor') {
    return res.status(403).json({ msg: 'Only professors can view this data' });
  }


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
    status: assistantship.status,
    applications: applications.map(app => ({
      studentName: app.student.name,
      studentEmail: app.student.email,
      motivation: app.motivation,
      status: app.status,
      submittedAt: app.createdAt,
      applicationId: app._id // optional: include application ID for further actions
    }))
  });

}));

// Professor edits an assistantship
router.put('/:id', auth, asyncHandler(async (req, res) => {
  if (req.user.role !== 'professor') {
    return res.status(403).json({ msg: 'Only professors can edit assistantships' });
  }

  const { title, description, domain, endTime, status  } = req.body;

  const assistantship = await Assistantship.findById(req.params.id);
  if (!assistantship) {
    return res.status(404).json({ msg: 'Assistantship not found' });
  }

  if (assistantship.professor.toString() !== req.user.id) {
    return res.status(403).json({ msg: 'You do not own this assistantship' });
  }

  if (title !== undefined) assistantship.title = title;
  if (description !== undefined) assistantship.description = description;
  if (domain !== undefined) assistantship.domain = domain;
  if (endTime !== undefined) assistantship.endTime = endTime;
  if (status !== undefined) assistantship.status = status;

  await assistantship.save();
  res.json({ msg: 'Assistantship updated', assistantship });
}));

// Professor deletes an assistantship
router.delete('/:id', auth, asyncHandler(async (req, res) => {
  if (req.user.role !== 'professor') {
    return res.status(403).json({ msg: 'Only professors can delete assistantships' });
  }

  const assistantship = await Assistantship.findById(req.params.id);
  if (!assistantship) {
    return res.status(404).json({ msg: 'Assistantship not found' });
  }

  if (assistantship.professor.toString() !== req.user.id) {
    return res.status(403).json({ msg: 'You do not own this assistantship' });
  }


   // Delete all related applications and resumes
  const applications = await Application.find({ assistantship: assistantship._id });
  for (const app of applications) {
    if (app.resumePath) {
      const filePath = path.join(__dirname, '..', app.resumePath);
      fs.unlink(filePath, err => {
        if (err) console.warn(`Could not delete resume: ${filePath}`);
      });
    }
  }

  // Delete applications first
  await Application.deleteMany({ assistantship: assistantship._id });

  await Assistantship.deleteOne({ _id: assistantship._id });
  res.json({ msg: 'Assistantship deleted' });
}));

// Professor searches for assistantships
router.get('/search', auth, asyncHandler(async (req, res) => {
  if (req.user.role !== 'professor') {
    return res.status(403).json({ msg: 'Only professors can search their assistantships' });
  }

  const { query = '', page = 1, limit = 5 } = req.query;
  const skip = (page - 1) * limit;

  const searchRegex = new RegExp(query, 'i'); // case-insensitive

  const filter = {
    professor: req.user.id,
    $or: [
      { title: searchRegex },
      { domain: searchRegex }
    ]
  };

  const total = await Assistantship.countDocuments(filter);
  const results = await Assistantship.find(filter)
    .select('title domain endTime createdAt status')
    .skip(skip)
    .limit(parseInt(limit))
    .lean();

  res.json({
    total,
    page: parseInt(page),
    limit: parseInt(limit),
    totalPages: Math.ceil(total / limit),
    data: results
  });
}));

// Get all assistantships
router.get('/', async (req, res) => {
  const assistantships = await Assistantship.find().populate('professor', 'name email');
  res.json(assistantships);
});

// Student searches for assistantships by title or domain
router.get('/search/student', auth, asyncHandler(async (req, res) => {
  if (req.user.role !== 'student') {
    return res.status(403).json({ msg: 'Only students can search assistantships' });
  }

  const { query = '', page = 1, limit = 5 } = req.query;
  const skip = (page - 1) * limit;

  const searchRegex = new RegExp(query, 'i'); // case-insensitive

  const filter = {
    $or: [
      { title: searchRegex },
      { domain: searchRegex }
    ]
  };

  const total = await Assistantship.countDocuments(filter);
  const results = await Assistantship.find(filter)
    .select('title domain endTime createdAt status')
    .skip(skip)
    .limit(parseInt(limit))
    .populate('professor', 'name email')
    .lean();

  res.json({
    total,
    page: parseInt(page),
    limit: parseInt(limit),
    totalPages: Math.ceil(total / limit),
    data: results
  });
}));

// Student views a single assistantship
router.get('/:id/student', auth, asyncHandler(async (req, res) => {
  if (req.user.role !== 'student') {
    return res.status(403).json({ msg: 'Only students can view assistantship details' });
  }

  try {
    const assistantship = await Assistantship.findById(req.params.id).populate('professor', 'name email');
    if (!assistantship) return res.status(404).json({ msg: 'Assistantship not found' });

    res.json(assistantship);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
}));

// Student views all assistantships
router.get('/student', auth, asyncHandler(async (req, res) => {
  if (req.user.role !== 'student') {
    return res.status(403).json({ msg: 'Only students can view all assistantships' });
  }

  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 5;
  const skip = (page - 1) * limit;

  const total = await Assistantship.countDocuments();
  const data = await Assistantship.find()
    .select('title domain endTime createdAt status')
    .skip(skip)
    .limit(limit)
    .populate('professor', 'name email')
    .lean();

  res.json({
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
    data
  });
}));

module.exports = router;
