import { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { motion } from "framer-motion";
import { FaCog, FaUser, FaKey, FaSave } from "react-icons/fa";
import Navbar from "../components/Navbar";

const SettingsPage = () => {
  const { user, updateProfile } = useAuth();
  const [newUsername, setNewUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [windowSize, setWindowSize] = useState({ width: 1920, height: 1080 });

  useEffect(() => {
    const updateSize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();

    try {
      const updateData = {};
      if (newUsername) updateData.username = newUsername;
      if (newPassword) updateData.password = newPassword;

      if (Object.keys(updateData).length === 0) {
        alert("No changes to update.");
        return;
      }

      await updateProfile(updateData);
      setNewUsername("");
      setNewPassword("");
      alert("Profile updated successfully!");
    } catch (error) {
      alert(
        `Error updating profile: ${
          error.response?.data?.error || "Unknown error"
        }`
      );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      <Navbar />

      {/* Animated Background */}
      <motion.div
        className="absolute inset-0"
        animate={{
          background: [
            "radial-gradient(600px circle at 20% 30%, #3b82f6 0%, transparent 50%)",
            "radial-gradient(600px circle at 80% 70%, #8b5cf6 0%, transparent 50%)",
            "radial-gradient(600px circle at 40% 80%, #ec4899 0%, transparent 50%)",
            "radial-gradient(600px circle at 20% 30%, #3b82f6 0%, transparent 50%)",
          ],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      />

      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-blue-400/20 rounded-full"
            animate={{
              x: [
                Math.random() * windowSize.width,
                Math.random() * windowSize.width,
              ],
              y: [
                Math.random() * windowSize.height,
                Math.random() * windowSize.height,
              ],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: Math.random() * 20 + 10,
              repeat: Infinity,
              delay: Math.random() * 5,
              ease: "linear",
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-10 pt-20 px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="max-w-4xl mx-auto"
        >
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-center mb-12"
          >
            <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <FaCog className="text-3xl text-white" />
            </div>
            <h1 className="text-5xl lg:text-6xl font-black text-white mb-4">
              Settings
            </h1>
            <p className="text-xl text-white/80">
              Manage your account and preferences
            </p>
          </motion.div>

          {/* Settings Card */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 lg:p-12 border border-white/20 shadow-2xl"
          >
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-6">
                <FaUser className="text-2xl text-blue-400" />
                <h3 className="text-2xl font-bold text-white">
                  Personal Information
                </h3>
              </div>
              <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <span className="text-white/70 font-medium">Username:</span>
                    <span className="text-white ml-2">{user.username}</span>
                  </div>
                  <div>
                    <span className="text-white/70 font-medium">Email:</span>
                    <span className="text-white ml-2">{user.email}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Update Profile Form */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-6">
                <FaKey className="text-2xl text-purple-400" />
                <h3 className="text-2xl font-bold text-white">
                  Update Profile
                </h3>
              </div>
              <div className="space-y-6">
                <div>
                  <label className="block text-lg font-semibold text-white mb-3">
                    New Username
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-4 bg-white/10 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300 text-white placeholder-white/50 backdrop-blur-sm"
                    value={newUsername}
                    onChange={(e) => setNewUsername(e.target.value)}
                    placeholder="Enter new username"
                  />
                </div>
                <div>
                  <label className="block text-lg font-semibold text-white mb-3">
                    New Password
                  </label>
                  <input
                    type="password"
                    className="w-full px-4 py-4 bg-white/10 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300 text-white placeholder-white/50 backdrop-blur-sm"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password"
                  />
                </div>
                <div className="pt-4">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-2xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 flex items-center justify-center gap-3"
                  >
                    <FaSave />
                    Update Profile
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default SettingsPage;
