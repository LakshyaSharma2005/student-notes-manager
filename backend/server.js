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

// Routes
app.use('/api/users', require('./routes/authRoutes'));
app.use('/api/notes', require('./routes/noteRoutes'));
// Placeholder for new professional features
app.use('/api/social', require('./routes/socialRoutes')); 

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));