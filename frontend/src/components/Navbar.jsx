import { Link, useNavigate, useLocation } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation(); // Now we use this variable below!
  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  // Function to check if a link is active (Uses the 'location' variable)
  const isActive = (path) => {
    return location.pathname === path 
      ? "text-blue-600 font-bold" 
      : "text-gray-600 hover:text-blue-500 font-medium";
  };

  return (
    <nav className="bg-white shadow-md py-4 px-6 flex justify-between items-center">
      <Link to="/" className="text-2xl font-bold text-blue-600">
        Student Notes
      </Link>

      <div className="space-x-4 flex items-center">
        {/* Use the isActive helper to highlight links */}
        <Link to="/" className={isActive("/")}>
          Home
        </Link>
        
        {user ? (
          <>
            {/* The Dashboard Link - Now visible and highlightable */}
            <Link to="/dashboard" className={isActive("/dashboard")}>
              Dashboard
            </Link>

            <Link to="/add-note" className={isActive("/add-note")}>
              Upload Note
            </Link>
            
            <button 
              onClick={handleLogout} 
              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="px-4 py-2 border border-blue-500 text-blue-500 rounded-lg hover:bg-blue-50 transition">
              Login
            </Link>
            <Link to="/signup" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
              Signup
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;