import { FaFilePdf, FaTrash } from "react-icons/fa"; 
import axios from "axios";
import toast from "react-hot-toast";

const NoteCard = ({ note, onDelete, user }) => { // <--- Receive 'user' prop
  
  const deleteNote = () => {
    if(!window.confirm("Are you sure you want to delete this note?")) return;

    axios.delete(`http://localhost:5000/api/notes/${note._id}`)
      .then(() => {
        toast.success("Note deleted!");
        onDelete(note._id);
      })
      .catch((err) => {
        console.log(err);
        toast.error("Failed to delete note");
      });
  };

  // CHECK: Does the logged-in user own this note?
  // We check if 'user' exists AND if user._id matches note.user
  const isOwner = user && note.user === user._id;

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 hover:shadow-xl transition-shadow duration-300 relative">
      
      <p className="text-sm text-gray-500 mb-2 uppercase tracking-wide font-semibold">
        {note.subject}
      </p>

      <h3 className="text-xl font-bold text-gray-800 mb-4">{note.title}</h3>
      
      <div className="flex justify-between items-center mt-4">
        <a 
          href={note.link} 
          target="_blank" 
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium transition-colors"
        >
          <FaFilePdf className="text-xl" />
          <span>View PDF</span>
        </a>

        {/* Only show the delete button if isOwner is true */}
        {isOwner && (
          <button 
            onClick={deleteNote}
            className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-50 transition"
            title="Delete Note"
          >
            <FaTrash />
          </button>
        )}
      </div>
    </div>
  );
};

export default NoteCard;