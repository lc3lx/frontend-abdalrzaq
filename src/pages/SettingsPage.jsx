import { useState } from "react";
import { useAuth } from "../hooks/useAuth";

const SettingsPage = () => {
  const { user, updateProfile } = useAuth();
  const [newUsername, setNewUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");

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
    <section>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Settings</h2>
      <div className="bg-white p-8 rounded-2xl shadow-2xl border-t-4 border-blue-600">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">
          Personal Information
        </h3>
        <div className="mb-6">
          <p>
            <strong>Username:</strong> {user.username}
          </p>
          <p>
            <strong>Email:</strong> {user.email}
          </p>
          <p>
            <strong>Password:</strong> {user.password}
          </p>
        </div>

        <h3 className="text-xl font-semibold text-gray-800 mb-4">
          Update Profile
        </h3>
        <form onSubmit={handleUpdateProfile}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              New Username
            </label>
            <input
              type="text"
              className="w-full p-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
              value={newUsername}
              onChange={(e) => setNewUsername(e.target.value)}
              placeholder="Enter new username"
            />
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              New Password
            </label>
            <input
              type="password"
              className="w-full p-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new password"
            />
          </div>
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-3 rounded-full hover:bg-blue-700 transition-transform duration-300 transform hover:scale-105"
          >
            Update Profile
          </button>
        </form>
      </div>
    </section>
  );
};

export default SettingsPage;
