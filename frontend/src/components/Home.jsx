import { useEffect, useState } from "react";
import axios from "axios";
import NoteCard from "./NoteCard";
import { Link } from "react-router-dom";
import { FaSearch } from "react-icons/fa";
import { toast } from "react-hot-toast"; // Import toast for notifications

const Home = () => {
  const [notes, setNotes] = useState([]);
  
  const [user] = useState(() => {
    return JSON.parse(localStorage.getItem("user")) || null;
  });

  const [query, setQuery] = useState(""); 

  // --- CONFIGURATION ---
  // We define the URL once here so we don't make typos later
  const API_URL = "https://notes-backend-f2oj.onrender.com";

  useEffect(() => {
    // UPDATED: Using the variable API_URL
    axios.get(`${API_URL}/api/notes`)
      .then((res) => {
        setNotes(res.data);
      })
      .catch((err) => console.log("Error fetching notes:", err));
  }, []);

  // --- FIX: ACTUAL BACKEND DELETION ---
  const handleDelete = async (id) => {
    // 1. Safety Check: Ask user before deleting
    if (!window.confirm("Are you sure you want to delete this note?")) return;

    try {
        // 2. Send DELETE command to the LIVE SERVER (not localhost)
        await axios.delete(`${API_URL}/api/notes/${id}`);
        
        // 3. Update the screen (UI) only if the server delete was successful
        setNotes(notes.filter((note) => note._id !== id));
        toast.success("Note deleted successfully");
        
    } catch (error) {
        console.error("Delete failed:", error);
        toast.error("Failed to delete note. Try again.");
    }
  };

  // SEARCH FILTER
  const filteredNotes = notes.filter((note) => 
    note.title.toLowerCase().includes(query.toLowerCase()) || 
    note.subject.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="min-h-screen py-8">
      
      {/* Search Bar */}
      <div className="max-w-2xl mx-auto mb-8 px-4">
        <div className="relative">
            <FaSearch className="absolute left-3 top-3 text-gray-400" />
            <input 
                type="text" 
                placeholder="Search by title or subject..." 
                className="w-full pl-10 pr-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
            />
        </div>
      </div>

      <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
        📚 Recent Notes
      </h1>

      {filteredNotes.length === 0 ? (
        <div className="text-center mt-10">
            <p className="text-gray-500 text-lg">
                {query ? "No matching notes found." : "No notes uploaded yet."}
            </p>
            {!query && (
                <Link to="/add-note" className="text-blue-600 underline font-medium block mt-2">
                    Upload one now!
                </Link>
            )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredNotes.map((note) => (
            <NoteCard key={note._id} note={note} onDelete={handleDelete} user={user} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;