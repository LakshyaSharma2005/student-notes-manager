const Note = require('../models/Note');
const fs = require('fs');   // Added for deleting files
const path = require('path');

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
        // Query database for notes where the user field matches the ID
        const notes = await Note.find({ user: userId }); 
        res.status(200).json(notes);
    } catch (error) {
        res.status(500).json({ message: "Error fetching user notes", error: error.message });
    }
};

// @desc    Create a new note (With File Upload)
// @route   POST /api/notes
const createNote = async (req, res) => {
    try {
        const { title, subject, userId } = req.body;
        
        if (!req.file) {
            return res.status(400).json({ message: 'Please upload a PDF file' });
        }

        // --- URL CONSTRUCTION UPGRADE ---
        // We use req.file.filename instead of path to avoid "absolute path" bugs on Linux
        const protocol = req.protocol;
        const host = req.get('host');
        
        // This creates a clean URL like: https://your-site.com/uploads/17392...pdf
        const fileUrl = `${protocol}://${host}/uploads/${req.file.filename}`;

        if (!title || !subject || !userId) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        const note = await Note.create({
            title,
            subject,
            link: fileUrl,
            user: userId 
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
            return res.status(404).json({ message: 'Note not found' });
        }

        // --- FILE CLEANUP (PROFESSIONAL) ---
        // Extract filename from the link to delete it from disk
        const filename = note.link.split('/uploads/')[1];
        if (filename) {
            const filePath = path.join(__dirname, '../uploads', filename);
            // Check if file exists, then delete it
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
        }

        await note.deleteOne(); 
        res.status(200).json({ id: req.params.id, message: "Note and file deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Export ALL functions
module.exports = { getNotes, getUserNotes, createNote, deleteNote };