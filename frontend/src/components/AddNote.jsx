import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { designTokens } from "../themeConfig";

const AddNote = () => {
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const user = JSON.parse(localStorage.getItem("user")); //

    if (!user) {
      toast.error("You must be logged in!");
      navigate("/login"); //
      return;
    }

    const data = new FormData();
    data.append("title", title);
    data.append("subject", subject);
    data.append("file", file);
    data.append("userId", user._id); // This matches your backend controller

    try {
      // Connecting to your verified Live Render Backend
      const res = await axios.post("https://notes-backend-f2oj.onrender.com/api/notes", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log(res.data);
      toast.success("Note uploaded successfully! 📂");
      
      // FIXED: Redirect to Dashboard so user can see their updated stats
      navigate("/dashboard"); 
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to upload note.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      initial={designTokens.animations.pageTransition.initial}
      animate={designTokens.animations.pageTransition.animate}
      className="flex justify-center items-center min-h-[80vh]"
    >
      <div className="w-full max-w-lg bg-white p-8 rounded-3xl shadow-2xl border border-gray-100">
        <h2 className="text-3xl font-extrabold text-gray-900 mb-2 text-center">
          Upload New Note 📂
        </h2>
        <p className="text-gray-500 text-center mb-8 text-sm">Share your knowledge with the community</p>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-gray-700 font-semibold mb-2 ml-1">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Chapter 1: Calculus"
              className="w-full px-5 py-3 border-2 border-gray-100 rounded-2xl focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2 ml-1">Subject</label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="e.g. Mathematics"
              className="w-full px-5 py-3 border-2 border-gray-100 rounded-2xl focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2 ml-1">Select PDF File</label>
            <div className="relative group">
              <input
                type="file"
                accept="application/pdf"
                onChange={(e) => setFile(e.target.files[0])}
                className="w-full px-5 py-3 border-2 border-dashed border-gray-200 rounded-2xl focus:border-blue-500 outline-none bg-gray-50/50 group-hover:bg-gray-50 transition-all cursor-pointer"
                required
              />
            </div>
            <p className="mt-2 text-xs text-gray-400 ml-1">Maximum file size: 10MB (PDF only)</p>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading}
            style={{ backgroundColor: designTokens.colors.primary }}
            className={`w-full text-white font-bold py-4 rounded-2xl transition duration-300 shadow-lg shadow-blue-500/30 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {loading ? "Uploading..." : "Upload Note"}
          </motion.button>
        </form>
      </div>
    </motion.div>
  );
};

export default AddNote;