import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";

const AdminRoute = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAdminStatus();
  }, []);

  const checkAdminStatus = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setIsAdmin(false);
        setLoading(false);
        return;
      }

      // Try to access admin dashboard stats to check if user is admin
      const response = await axios.get(
        "http://localhost:5000/api/admin/dashboard/stats",
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );

      setIsAdmin(true);
    } catch (error) {
      console.error("Admin check failed:", error);
      setIsAdmin(false);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">جاري التحقق من الصلاحيات...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default AdminRoute;
