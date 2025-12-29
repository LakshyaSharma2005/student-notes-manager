import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const AddNote = () => {
  // We use separate states for easier file handling
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [file, setFile] = useState(null); // <--- New State for the actual file

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    // 1. Get User ID
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user) {
        toast.error("You must be logged in!");
        navigate("/login");
        return;
    }

    // 2. Create FormData (The "Envelope" for files)
    const data = new FormData();
    data.append("title", title);
    data.append("subject", subject);
    data.append("file", file); // <--- Attach the PDF file here
    data.append("userId", user._id);

    // 3. Send to Backend with the correct Header
    axios.post("http://localhost:5000/api/notes", data, {
      headers: {
        "Content-Type": "multipart/form-data", // <--- Important!
      },
    })
      .then((res) => {
        console.log(res.data);
        toast.success("Note uploaded successfully! 📂");
        navigate("/"); 
      })
      .catch((err) => {
        console.log(err);
        toast.error("Failed to upload note.");
      });
  };

  return (
    <div className="flex justify-center items-center min-h-[80vh]">
      <div className="w-full max-w-lg bg-white p-8 rounded-lg shadow-lg border border-gray-200">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          Upload New Note 📂
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Title Input */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Chapter 1: Calculus"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              required
            />
          </div>

          {/* Subject Input */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">Subject</label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="e.g. Mathematics"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              required
            />
          </div>

          {/* File Input (The Big Change) */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">Select PDF File</label>
            <input
              type="file"
              accept="application/pdf" // <--- Restrict to PDFs only
              onChange={(e) => setFile(e.target.files[0])} // <--- Capture the file object
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-gray-50"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 rounded-lg transition duration-300 shadow-md"
          >
            Upload Note
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddNote;