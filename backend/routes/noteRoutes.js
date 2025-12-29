const express = require('express');
const router = express.Router();
const { getNotes, createNote, deleteNote } = require('../controllers/noteController');
const multer = require('multer');
const path = require('path');

// --- MULTER CONFIGURATION (The File Handler) ---
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Save files in 'uploads' folder
  },
  filename: (req, file, cb) => {
    // Rename file to: "file-fieldname-timestamp.pdf" to avoid duplicates
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });
// -----------------------------------------------

router.get('/', getNotes);

// NOTE: We added 'upload.single("file")' middleware here 👇
// This tells the route to expect a file named "file"
router.post('/', upload.single('file'), createNote);

router.delete('/:id', deleteNote);

module.exports = router;