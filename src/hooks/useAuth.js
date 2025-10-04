import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export const useAuth = () => {
  const [user, setUser] = useState({
    username: "",
    email: "",
    password: "",
    role: "user",
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const fetchUser = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No token found");
      }

      setIsLoading(true);
      const response = await axios.get("https://www.sushiluha.com/api/user", {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });

      setUser({
        username: response.data.username,
        email: response.data.email,
        password: "********",
        role: response.data.role || "user",
      });
    } catch (error) {
      console.error("Error fetching user:", error);
      localStorage.removeItem("token");
      navigate("/login");
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (updateData) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        "https://www.sushiluha.com/api/user",
        updateData,
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );

      if (updateData.username)
        setUser((prev) => ({ ...prev, username: updateData.username }));
      if (updateData.password)
        setUser((prev) => ({ ...prev, password: "********" }));

      return response.data;
    } catch (error) {
      console.error("Profile update error:", error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return {
    user,
    isLoading,
    updateProfile,
    logout,
    fetchUser,
  };
};
