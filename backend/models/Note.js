const mongoose = require('mongoose');

const noteSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User', // This links the note to the user who created it
    },
    title: {
        type: String,
        required: [true, 'Please add a title'],
    },
    subject: {
        type: String,
        required: [true, 'Please add a subject'],
    },
    link: { 
        type: String, // This will be the Google Drive or PDF link
        required: [true, 'Please add a PDF link'],
    }
}, {
    timestamps: true,
});

module.exports = mongoose.model('Note', noteSchema);