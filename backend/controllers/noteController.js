const Note = require('../models/Note');
// Removed 'fs' and 'path' because we don't manage files on the server anymore!

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
        res.status(500).json({ message: "Error fetching user notes", error: error.message });
    }
};

// @desc    Create a new note (Uploaded to Cloudinary)
// @route   POST /api/notes
const createNote = async (req, res) => {
    try {
        const { title, subject, userId } = req.body;
        
        if (!req.file) {
            return res.status(400).json({ message: 'Please upload a PDF file' });
        }

        // --- CLOUDINARY UPGRADE ---
        // Instead of building a URL manually (http://localhost...), 
        // we just grab the secure, permanent URL that Cloudinary gave us.
        const fileUrl = req.file.path; 

        if (!title || !subject || !userId) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        const note = await Note.create({
            title,
            subject,
            link: fileUrl, // Saves the Cloudinary URL (e.g., https://res.cloudinary.com/...)
            user: userId 
        });

        res.status(201).json(note);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete a note
// @route   DELETE /api/notes/:id
const deleteNote = async (req, res) => {
    try {
        const note = await Note.findById(req.params.id);

        if (!note) {
            return res.status(404).json({ message: 'Note not found' });
        }

        // We delete the record from MongoDB.
        // The file stays on Cloudinary for safety (prevents broken links if backups exist).
        await note.deleteOne(); 
        
        res.status(200).json({ id: req.params.id, message: "Note deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Export ALL functions
module.exports = { getNotes, getUserNotes, createNote, deleteNote };