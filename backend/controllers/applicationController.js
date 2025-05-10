const Application = require('../models/application');
const Assistantship = require('../models/assistantship');
const path = require('path');
const fs = require('fs');



exports.applyToAssistantship = async (req, res) => {
  if (req.user.role !== 'student')
    return res.status(403).json({ msg: 'Only students can apply' });

  const { assistantshipId, motivation } = req.body;
  if (!assistantshipId || !motivation || !req.file) {
    if (req.file) {
      const filePath = path.join(__dirname, '..', req.file.path || `uploads/resumes/${req.file.filename}`);
      fs.unlink(filePath, err => {
        if (err) console.warn('Failed to delete unused resume:', filePath);
      });
    }
    return res.status(400).json({ msg: 'Invalid or missing fields' });  
  }
  // Check if assistantship exists
  const assistantship = await Assistantship.findById(assistantshipId);
  if (!assistantship){
    if (req.file) {
      const filePath = path.join(__dirname, '..', req.file.path || `uploads/resumes/${req.file.filename}`);
      fs.unlink(filePath, err => {
        if (err) console.warn('Failed to delete unused resume:', filePath);
      });
    }
    return res.status(404).json({ msg: 'Assistantship not found' });
  }
    

  // Check for duplicate application
  const existing = await Application.findOne({
    assistantship: assistantshipId,
    student: req.user.id
  });
  if (existing){
    if (req.file) {
      const filePath = path.join(__dirname, '..', req.file.path || `uploads/resumes/${req.file.filename}`);
      fs.unlink(filePath, err => {
        if (err) console.warn('Failed to delete unused resume:', filePath);
      });
    }
    return res.status(409).json({ msg: 'You have already applied to this assistantship' });
  }
    

  // Create application
  const application = new Application({
    assistantship: assistantshipId,
    student: req.user.id,
    motivation,
    resumePath: `/uploads/resumes/${req.file.filename}`
  });

  await application.save();
  res.status(201).json(application);
};


exports.getStudentApplicationDetail = async (req, res) => {
  if (req.user.role !== 'professor') {
    return res.status(403).json({ msg: 'Only professors can view applications' });
  }

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

};


exports.updateApplicationsStatus = async (req, res) => {
  if (req.user.role !== 'professor') {
    return res.status(403).json({ msg: 'Only professors can update application status' });
  }

  const { status } = req.body;
  if (!status) {
    return res.status(400).json({ msg: 'Status is required' });
  }

  if (!['accepted', 'rejected'].includes(status)) {
    return res.status(400).json({ msg: 'Invalid status value' });
  }

  const application = await Application.findById(req.params.id).populate('assistantship');
  if (!application) {
    return res.status(404).json({ msg: 'Application not found' });
  }

  // Check that the professor owns the assistantship
  if (application.assistantship.professor.toString() !== req.user.id) {
    return res.status(403).json({ msg: 'You do not own this assistantship' });
  }

  application.status = status;
  await application.save();

  res.json({ msg: `Application ${status}`, application });
};

exports.getApplicationsForAssis = async (req, res) => {
  if (req.user.role !== 'professor')
    return res.status(403).json({ msg: 'Only professors can view this' });

  const assistantships = await Assistantship.find({ professor: req.user.id });
  const applications = await Application.find({ assistantship: { $in: assistantships.map(a => a._id) } })
    .populate('student', 'name email')
    .populate('assistantship', 'title');
  res.json(applications);
};


exports.getApplicationsStu = async (req, res) => {
  if (req.user.role !== 'student')
    return res.status(403).json({ msg: 'Only students can view this' });

  const applications = await Application.find({ student: req.user.id })
    .populate('assistantship', 'title');
  res.json(applications);
};

exports.getApplicationDetail = async (req, res) => {
  if (req.user.role !== 'student') {
    return res.status(403).json({ msg: 'Only students can view this' });
  }

  const application = await Application.findById(req.params.id)
    .populate('assistantship', 'title domain endTime');

  if (!application) {
    return res.status(404).json({ msg: 'Application not found' });
  }

  if (application.student.toString() !== req.user.id) {
    return res.status(403).json({ msg: 'You do not own this application' });
  }

  res.json({
    assistantship: application.assistantship,
    motivation: application.motivation,
    resumePath: application.resumePath,
    status: application.status,
    submittedAt: application.createdAt
  });

};

exports.deleteApplication = async (req, res) => {
  if (req.user.role !== 'student') {
    return res.status(403).json({ msg: 'Only students can delete applications' });
  }

  const application = await Application.findById(req.params.id);

  if (!application) {
    return res.status(404).json({ msg: 'Application not found' });
  }

  if (application.student.toString() !== req.user.id) {
    return res.status(403).json({ msg: 'You do not own this application' });
  }

  const filePath = path.join(__dirname, '..', application.resumePath);
  fs.unlink(filePath, (err) => {
    if (err) console.warn('Error deleting file:',filePath);
  });

  await application.deleteOne();
  res.json({ msg: 'Application withdrawn successfully' });

};