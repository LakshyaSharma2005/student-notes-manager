const express = require('express');
const router = express.Router();
const { getNotes, createNote, deleteNote, getUserNotes } = require('../controllers/noteController');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// --- PROFESSIONAL MULTER CONFIGURATION ---
// Ensure the uploads directory exists to prevent server crashes
const uploadDir = 'uploads/';
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir); 
  },
  filename: (req, file, cb) => {
    // Unique naming convention: timestamp-originalName
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

// File filter to ensure only PDFs or specific documents are uploaded
const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    cb(new Error('Only PDF files are allowed!'), false);
  }
};

const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

// --- ROUTES ---

// 1. Get ALL notes (Public/Home feed)
router.get('/', getNotes);

// 2. NEW: Get notes for a SPECIFIC user (For your UserDashboard)
router.get('/user/:userId', getUserNotes);

// 3. Create a note with file upload
router.post('/', upload.single('file'), createNote);

// 4. Delete a specific note
router.delete('/:id', deleteNote);

module.exports = router;