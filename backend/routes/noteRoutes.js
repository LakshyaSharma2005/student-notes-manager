const express = require("express");

const router = express.Router();

// Importing getUserNotes is crucial to prevent "undefined" crash

const {
  getNotes,
  createNote,
  deleteNote,
  getUserNotes,
} = require("../controllers/noteController");

const multer = require("multer");

const path = require("path");

const fs = require("fs");

// --- ROBUST PATH CONFIGURATION ---

// Use path.join to lock the folder location to backend/uploads

const uploadDir = path.join(__dirname, "../uploads");

// Create the folder if it doesn't exist (Prevent server startup crash)

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// --- MULTER STORAGE SETUP ---

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },

  filename: (req, file, cb) => {
    // Unique naming: timestamp-random-originalName

    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);

    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

// Filter to strictly allow only PDFs

const fileFilter = (req, file, cb) => {
  if (file.mimetype === "application/pdf") {
    cb(null, true);
  } else {
    cb(new Error("Only PDF files are allowed!"), false);
  }
};

const upload = multer({
  storage: storage,

  fileFilter: fileFilter,

  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB Limit
});

// --- ROUTES ---

// 1. Get ALL notes (Public Feed)

router.get("/", getNotes);

// 2. Get notes for a SPECIFIC user (Protected Dashboard Route)

// This route powers your UserDashboard "Total Uploads"

router.get("/user/:userId", getUserNotes);

// 3. Create a note with file upload (Middleware: upload.single)

router.post("/", upload.single("file"), createNote);

// 4. Delete a specific note

router.delete("/:id", deleteNote);

module.exports = router;
