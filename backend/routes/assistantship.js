const express = require('express');
const Assistantship = require('../models/assistantship');
const auth = require('../middleware/auth');
const asyncHandler = require('../middleware/asyncHandler');
const { createAssistantship, getProfessorAssistantships,getAssistantshipDetailsProf, updateAssistantship,
  deleteAssistantship,searchAssistantships,searchAssistantshipsStu,getAssistantshipDetailsStu,getAllAssistantships} = require('../controllers/assistantshipController');
const router = express.Router();


// Professor posts assistantship
router.post('/', auth, asyncHandler(createAssistantship));

// Professor views all their assistantships + application count
router.get('/all_professor', auth, asyncHandler(getProfessorAssistantships));

//Professor view a single assistantship + applications
router.get('/:id/professor', auth, asyncHandler(getAssistantshipDetailsProf));

// Professor edits an assistantship
router.put('/:id', auth, asyncHandler(updateAssistantship));

// Professor deletes an assistantship
router.delete('/:id', auth, asyncHandler(deleteAssistantship));

// Professor searches for assistantships
router.get('/search', auth, asyncHandler(searchAssistantships));

// Get all assistantships
router.get('/', async (req, res) => {
  const assistantships = await Assistantship.find().populate('professor', 'name email');
  res.json(assistantships);
});

// Student searches for assistantships by title or domain
router.get('/search/student', auth, asyncHandler(searchAssistantshipsStu));

// Student views a single assistantship
router.get('/:id/student', auth, asyncHandler(getAssistantshipDetailsStu));

// Student views all assistantships
router.get('/student', auth, asyncHandler(getAllAssistantships));

module.exports = router;
