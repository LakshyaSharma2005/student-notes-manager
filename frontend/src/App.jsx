import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Home from './components/Home';
import Navbar from "./components/Navbar";
import Login from "./components/Login";
import Signup from "./components/Signup";
import AddNote from './components/AddNote';
import UserDashboard from './components/UserDashboard';
import { Toaster } from "react-hot-toast";

// --- 1. GUARD: Only for Logged In Users (Protects Dashboard) ---
// Checks localStorage freshly every time this route is accessed
const RequireAuth = ({ children }) => {
  const user = JSON.parse(localStorage.getItem("user"));
  // If user exists, show the page. If not, go to Login.
  return user ? children : <Navigate to="/login" replace />;
};

// --- 2. GUARD: Only for Guests (Protects Login/Signup) ---
// If you are already logged in, you shouldn't see the Login page
const PublicOnly = ({ children }) => {
  const user = JSON.parse(localStorage.getItem("user"));
  // If user exists, go to Dashboard. If not, show the Login page.
  return !user ? children : <Navigate to="/dashboard" replace />;
};

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <Toaster position="top-center" reverseOrder={false} />

        <div className="container mx-auto p-4">
          <Routes>
            {/* PUBLIC: Visible to everyone */}
            <Route path="/" element={<Home />} />
            
            {/* GUEST ONLY: Wrapped in PublicOnly */}
            {/* If you are logged in, these will bounce you to Dashboard */}
            <Route 
              path="/login" 
              element={
                <PublicOnly>
                  <Login />
                </PublicOnly>
              } 
            />
            <Route 
              path="/signup" 
              element={
                <PublicOnly>
                  <Signup />
                </PublicOnly>
              } 
            />

            {/* USER ONLY: Wrapped in RequireAuth */}
            {/* If you are NOT logged in, these will bounce you to Login */}
            <Route 
              path="/dashboard" 
              element={
                <RequireAuth>
                  <UserDashboard />
                </RequireAuth>
              } 
            />
            <Route 
              path="/add-note" 
              element={
                <RequireAuth>
                  <AddNote />
                </RequireAuth>
              } 
            />

            {/* 404: Redirect unknown to Home */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}