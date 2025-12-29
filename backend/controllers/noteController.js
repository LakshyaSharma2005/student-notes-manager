const Note = require('../models/Note');

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
        const { userId } = req.params; //
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

        // Professional URL construction for Render/Production
        const protocol = req.protocol;
        const host = req.get('host');
        const fileUrl = `${protocol}://${host}/${req.file.path.replace(/\\/g, "/")}`;

        if (!title || !subject || !userId) {
            return res.status(400).json({ message: 'Missing required fields (Title, Subject, or User ID)' });
        }

        // FIXED: Explicitly mapping 'userId' from frontend to 'user' field in MongoDB
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

// @desc    Delete a note
// @route   DELETE /api/notes/:id
const deleteNote = async (req, res) => {
    try {
        const note = await Note.findById(req.params.id);

        if (!note) {
            return res.status(404).json({ message: 'Note not found' });
        }

        await note.deleteOne(); 
        res.status(200).json({ id: req.params.id, message: "Note deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getNotes, getUserNotes, createNote, deleteNote };