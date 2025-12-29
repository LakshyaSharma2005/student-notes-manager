const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const path = require('path');

dotenv.config();
connectDB();

const app = express();

// 1. Improved CORS to allow your specific frontend
app.use(cors({
  origin: ["https://notes-frontend-x6qe.onrender.com", "http://localhost:5173"],
  credentials: true
}));

app.use(express.json());

// 2. Static uploads folder
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// 3. ROUTE FIX: Changed to /api/users to match your Frontend code
app.use('/api/users', require('./routes/authRoutes')); 
app.use('/api/notes', require('./routes/noteRoutes'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));