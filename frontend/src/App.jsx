import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Home from './components/Home';
import Navbar from "./components/Navbar";
import Login from "./components/Login";
import Signup from "./components/Signup";
import AddNote from './components/AddNote';
import UserDashboard from './components/UserDashboard'; // Restore the Dashboard
import { Toaster } from "react-hot-toast";

export default function App() {
  // Check if user is logged in to determine access
  const user = JSON.parse(localStorage.getItem("user")); //

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <Toaster position="top-center" reverseOrder={false} />

        <div className="container mx-auto p-4">
          <Routes>
            {/* PUBLIC ROUTE: Home is visible to everyone */}
            <Route path="/" element={<Home />} />
            
            {/* AUTH ROUTES: If logged in, kick user to Dashboard automatically */}
            <Route 
              path="/login" 
              element={!user ? <Login /> : <Navigate to="/dashboard" />} 
            />
            <Route 
              path="/signup" 
              element={!user ? <Signup /> : <Navigate to="/dashboard" />} 
            />

            {/* PROTECTED ROUTES: If NOT logged in, kick user to Login */}
            <Route 
              path="/dashboard" 
              element={user ? <UserDashboard /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/add-note" 
              element={user ? <AddNote /> : <Navigate to="/login" />} 
            />

            {/* 404 CATCH-ALL: Redirect unknown URLs to Home */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}