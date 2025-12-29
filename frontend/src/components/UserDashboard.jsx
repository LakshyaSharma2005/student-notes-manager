import { motion, AnimatePresence } from 'framer-motion'; // Added AnimatePresence to force usage
import { useState, useEffect } from 'react';
import axios from 'axios';
// Add the /config/ folder to the path
import { designTokens } from '../config/themeConfig';
import { FaFileAlt, FaHeart, FaPlus, FaUserCircle } from 'react-icons/fa';

const UserDashboard = () => {
  const [stats, setStats] = useState({ uploads: 0, favorites: 0 });
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const fetchUserStats = async () => {
      try {
        // Pointing to your live backend
        const res = await axios.get(`https://notes-backend-f2oj.onrender.com/api/notes/user/${user?._id}`);
        setStats(prev => ({ ...prev, uploads: res.data.length }));
      } catch (err) {
        console.error("Dashboard Fetch Error:", err);
      }
    };
    if (user?._id) fetchUserStats();
  }, [user?._id]);

  return (
    <AnimatePresence> {/* Using AnimatePresence forces the compiler to acknowledge framer-motion */}
      <motion.div 
        key="dashboard-wrapper"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        transition={designTokens.animations.spring}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10"
      >
        {/* Header Section */}
        <div className="flex items-center justify-between mb-10">
          <motion.div initial={{ x: -20 }} animate={{ x: 0 }}>
            <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
              Dashboard
            </h1>
            <p className="mt-2 text-lg text-gray-600">
              Welcome back, <span className="font-semibold text-blue-600">{user?.name}</span>
            </p>
          </motion.div>
          <motion.div whileHover={{ rotate: 360 }} transition={{ duration: 0.5 }}>
            <FaUserCircle className="text-5xl text-gray-300 cursor-pointer" />
          </motion.div>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Main Action Card */}
          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="md:col-span-2 bg-linear-to-r from-blue-600 to-indigo-700 rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden"
          >
            <div className="relative z-10">
              <h2 className="text-3xl font-bold mb-4">Start Contributing</h2>
              <p className="text-blue-100 mb-8 max-w-md">
                Upload your high-quality notes and help the community grow. Your current impact: {stats.uploads} resources shared.
              </p>
              <motion.button 
                whileTap={{ scale: 0.95 }}
                whileHover={{ backgroundColor: "#f8fafc", color: "#1d4ed8" }}
                className="bg-white text-blue-700 font-bold py-3 px-8 rounded-2xl shadow-lg flex items-center gap-2 transition-colors"
              >
                <FaPlus /> Upload New Note
              </motion.button>
            </div>
            <motion.div 
              animate={{ rotate: [0, 10, 0] }} 
              transition={{ repeat: Infinity, duration: 5 }}
              className="absolute -bottom-10 -right-10 text-9xl text-white opacity-10"
            >
              <FaFileAlt />
            </motion.div>
          </motion.div>

          {/* Sidebar Stats */}
          <div className="flex flex-col gap-6">
            <motion.div 
              whileHover={{ y: -5, boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1)" }}
              className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex items-center justify-between"
            >
              <div>
                <p className="text-sm font-medium text-gray-400 uppercase tracking-widest">Total Uploads</p>
                <h3 className="text-4xl font-black text-gray-900 mt-1">{stats.uploads}</h3>
              </div>
              <div className="bg-blue-50 p-4 rounded-2xl text-blue-600 text-2xl">
                <FaFileAlt />
              </div>
            </motion.div>

            <motion.div 
              whileHover={{ y: -5, boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1)" }}
              className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex items-center justify-between"
            >
              <div>
                <p className="text-sm font-medium text-gray-400 uppercase tracking-widest">Favorites</p>
                <h3 className="text-4xl font-black text-gray-900 mt-1">{stats.favorites}</h3>
              </div>
              <div className="bg-pink-50 p-4 rounded-2xl text-pink-500 text-2xl">
                <FaHeart />
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default UserDashboard;