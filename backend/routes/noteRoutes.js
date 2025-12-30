const express = require('express');
const router = express.Router();
const { getNotes, createNote, deleteNote, getUserNotes } = require('../controllers/noteController');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// --- CLOUDINARY STORAGE CONFIGURATION ---
// This tells Multer to send files to Cloudinary instead of the 'uploads' folder
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'student_notes', // The folder name in your Cloudinary dashboard
    allowed_formats: ['pdf'], // Restrict to PDFs
    resource_type: 'raw'     // 'raw' is REQUIRED for non-image files like PDFs
  },
});

const upload = multer({ storage: storage });

// --- ROUTES ---

// 1. Get ALL notes (Public Feed)
router.get('/', getNotes);

// 2. Get notes for a SPECIFIC user (Protected Dashboard Route)
router.get('/user/:userId', getUserNotes);

// 3. Create a note (Files go to Cloudinary now)
// Middleware: upload.single handles the Cloudinary upload automatically
router.post('/', upload.single('file'), createNote);

// 4. Delete a specific note
router.delete('/:id', deleteNote);

module.exports = router;