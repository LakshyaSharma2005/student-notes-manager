const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const cloudinary = require('cloudinary').v2; // Kept for future use
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const app = express();

// Professional CORS configuration
app.use(cors({
  origin: [process.env.FRONTEND_URL, "http://localhost:5173"],
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// --- VITAL FIX: SERVE STATIC FILES ---
// This tells the server: "If someone asks for /uploads, show them the files in the folder"
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); //

// Routes
// FIXED: Changed '/api/users' to '/api/auth' to match your Frontend Login calls
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/notes', require('./routes/noteRoutes'));
app.use('/api/social', require('./routes/socialRoutes')); 

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));