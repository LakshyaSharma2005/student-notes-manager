const Note = require('../models/Note');

// @desc    Get all notes
// @route   GET /api/notes
const getNotes = async (req, res) => {
    try {
        const notes = await Note.find();
        res.status(200).json(notes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create a new note
// @route   POST /api/notes
// @desc    Create a new note (Now with File Upload!)
// @route   POST /api/notes
const createNote = async (req, res) => {
    try {
        const { title, subject, userId } = req.body;
        
        // Check if a file was actually uploaded
        if (!req.file) {
            return res.status(400).json({ message: 'Please upload a PDF file' });
        }

        // Create the URL. It will look like: http://localhost:5000/uploads/file-12345.pdf
        // This will automatically pick up the server's address (Localhost OR Render)
        const protocol = req.protocol;
        const host = req.get('host');
        const fileUrl = `${protocol}://${host}/${req.file.path.replace(/\\/g, "/")}`;

        if (!title || !subject) {
            return res.status(400).json({ message: 'Please add all fields' });
        }

        const note = await Note.create({
            title,
            subject,
            link: fileUrl, // <--- We save our local file URL instead of the Google Drive link
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

        await note.deleteOne(); // Deletes the note from MongoDB

        res.status(200).json({ id: req.params.id });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Don't forget to export the new function!
module.exports = { getNotes, createNote, deleteNote };