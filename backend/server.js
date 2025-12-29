const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const path = require('path');

dotenv.config();
connectDB();

const app = express();

// 1. Better CORS: Allows your specific live frontend to talk to this backend
app.use(cors({
  origin: ["https://notes-frontend-x6qe.onrender.com", "http://localhost:5173"],
  credentials: true
}));

app.use(express.json());

// 2. Make the 'uploads' folder public
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// 3. ROUTE FIX: Changed /api/auth to /api/users to match your Signup.jsx code
app.use('/api/users', require('./routes/authRoutes')); 
app.use('/api/notes', require('./routes/noteRoutes'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));