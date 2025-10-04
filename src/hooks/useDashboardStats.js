import { useState, useEffect } from "react";
import axios from "axios";

export const useDashboardStats = () => {
  const [stats, setStats] = useState({
    connectedAccounts: 0,
    totalPosts: 0,
    totalMessages: 0,
    unreadMessages: 0,
    totalFlows: 0,
    autoRepliesCount: 0,
    recentActivity: {
      posts: 0,
      messages: 0,
    },
    platformBreakdown: {},
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStats = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const token = localStorage.getItem("token");

      const response = await axios.get(
        "https://www.sushiluha.com/api/dashboard/stats",
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );

      setStats(response.data);
    } catch (err) {
      console.error("Error fetching dashboard stats:", err);
      setError(
        err.response?.data?.error || "Failed to fetch dashboard statistics"
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return {
    stats,
    isLoading,
    error,
    refetch: fetchStats,
  };
};

