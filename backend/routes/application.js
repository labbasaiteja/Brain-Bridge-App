const express = require('express');
const auth = require('../middleware/auth');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { applyToAssistantship, getStudentApplicationDetail, updateApplicationsStatus, getApplicationsForAssis,
  getApplicationsStu, getApplicationDetail, deleteApplication
 } = require('../controllers/applicationController');
const asyncHandler = require('../middleware/asyncHandler');

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
router.post('/', auth, upload.single('resume'), asyncHandler(applyToAssistantship));

// Professor views a specific application
router.get('/:id/professor', auth, asyncHandler(getStudentApplicationDetail));

// Professor updates application status
router.put('/:id/status', auth, asyncHandler(updateApplicationsStatus));


// Professor views applications for their assistantships
router.get('/professor', auth, asyncHandler(getApplicationsForAssis));

// Student views their applications
router.get('/student', auth, asyncHandler(getApplicationsStu));

// Student views a specific application
router.get('/:id/student', auth, asyncHandler(getApplicationDetail));

// Student deletes their application
router.delete('/:id', auth, asyncHandler(deleteApplication));

module.exports = router;
