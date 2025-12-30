const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const cloudinary = require('cloudinary').v2;
const connectDB = require('./config/db');

dotenv.config();
connectDB();

// Cloudinary Config - Crucial for persistent storage on Render
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const app = express();

// Professional CORS configuration
app.use(cors({
  origin: [process.env.FRONTEND_URL, "http://localhost:5173"],
  credentials: true
}));

app.use(express.json());
// ADDED: Necessary for handling URL encoded data (good for file uploads)
app.use(express.urlencoded({ extended: false }));

// --- VITAL FIX: SERVE STATIC FILES ---
// This tells the server to allow access to the 'uploads' folder for PDF viewing
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
// PRESERVED: Keeping '/api/users' because your Frontend uses this for Login
app.use('/api/users', require('./routes/authRoutes'));
app.use('/api/notes', require('./routes/noteRoutes'));
// Placeholder for new professional features
app.use('/api/social', require('./routes/socialRoutes')); 

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));