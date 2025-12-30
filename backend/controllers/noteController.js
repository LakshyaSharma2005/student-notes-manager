const Note = require("../models/Note");
const fs = require("fs");
const path = require("path");

// @desc    Get all notes (Public Feed)
// @route   GET /api/notes
const getNotes = async (req, res) => {
  try {
    const notes = await Note.find();
    res.status(200).json(notes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get notes for a specific user (FOR DASHBOARD)
// @route   GET /api/notes/user/:userId
const getUserNotes = async (req, res) => {
  try {
    const { userId } = req.params;
    const notes = await Note.find({ user: userId });
    res.status(200).json(notes);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching user notes", error: error.message });
  }
};

// @desc    Create a new note (With File Upload)
// @route   POST /api/notes
const createNote = async (req, res) => {
  try {
    const { title, subject, userId } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "Please upload a PDF file" });
    }

    // --- URL CONSTRUCTION ---
    const protocol = req.protocol;
    const host = req.get("host");

    // Creates URL: https://your-site.com/uploads/filename.pdf
    const fileUrl = `${protocol}://${host}/uploads/${req.file.filename}`;

    if (!title || !subject || !userId) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const note = await Note.create({
      title,
      subject,
      link: fileUrl,
      user: userId,
    });

    res.status(201).json(note);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a note AND the file
// @route   DELETE /api/notes/:id
const deleteNote = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    // --- FILE CLEANUP LOGIC ---
    let filename = null;

    // Safely extract filename from the full URL
    if (note.link && note.link.includes("/uploads/")) {
      filename = note.link.split("/uploads/")[1];
    }

    if (filename) {
      const filePath = path.join(__dirname, "../uploads", filename);
      console.log(`Attempting to delete local file: ${filePath}`); // Debug Log

      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        console.log("File deleted from disk successfully.");
      } else {
        console.log("File not found on disk (skipping file deletion).");
      }
    }

    // --- DATABASE DELETION ---
    // findByIdAndDelete is often more robust than .deleteOne()
    await Note.findByIdAndDelete(req.params.id);

    res
      .status(200)
      .json({
        id: req.params.id,
        message: "Note and file deleted successfully",
      });
  } catch (error) {
    console.error("Delete Error:", error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getNotes, getUserNotes, createNote, deleteNote };
