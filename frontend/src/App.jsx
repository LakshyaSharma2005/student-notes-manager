import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from './components/Home';
import Navbar from "./components/Navbar";
import Login from "./components/Login";
import Signup from "./components/Signup";
import AddNote from './components/AddNote';
import { Toaster } from "react-hot-toast";

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <Toaster position="top-center" reverseOrder={false} />

        <div className="container mx-auto p-4">
          <Routes>
            {/* I fixed this line below 👇 */}
            <Route path="/" element={<Home />} />
            
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/add-note" element={<AddNote />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}