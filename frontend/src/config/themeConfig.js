import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Home from './components/Home';
import Navbar from "./components/Navbar";
import Login from "./components/Login";
import Signup from "./components/Signup";
import AddNote from './components/AddNote';
import UserDashboard from './components/UserDashboard'; // New Professional Component
import { Toaster } from "react-hot-toast";

export default function App() {
  // Check if user is logged in by looking at localStorage
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <Toaster position="top-center" reverseOrder={false} />

        <div className="container mx-auto p-4">
          <Routes>
            {/* PUBLIC ROUTE: Home is the landing page */}
            <Route path="/" element={<Home />} />
            
            {/* AUTH ROUTES: Redirect to dashboard if already logged in */}
            <Route 
              path="/login" 
              element={!user ? <Login /> : <Navigate to="/dashboard" />} 
            />
            <Route 
              path="/signup" 
              element={!user ? <Signup /> : <Navigate to="/dashboard" />} 
            />

            {/* PROTECTED ROUTES: Only accessible if logged in */}
            <Route 
              path="/dashboard" 
              element={user ? <UserDashboard /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/add-note" 
              element={user ? <AddNote /> : <Navigate to="/login" />} 
            />

            {/* 404 CATCH-ALL: Redirect any unknown routes to Home */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}