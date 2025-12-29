import { useEffect, useState } from "react";
import axios from "axios";
import NoteCard from "./NoteCard";
import { Link } from "react-router-dom";
import { FaSearch } from "react-icons/fa"; 

const Home = () => {
  const [notes, setNotes] = useState([]);
  
  // FIXED: We removed 'setUser' because we don't need it here
  const [user] = useState(() => {
    return JSON.parse(localStorage.getItem("user")) || null;
  });

  const [query, setQuery] = useState(""); 

  useEffect(() => {
    axios.get("http://localhost:5000/api/notes")
      .then((res) => {
        setNotes(res.data);
      })
      .catch((err) => console.log(err));
  }, []);

  const handleDelete = (id) => {
    setNotes(notes.filter((note) => note._id !== id));
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