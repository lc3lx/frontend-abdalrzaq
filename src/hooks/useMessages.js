import { useState, useEffect } from "react";
import axios from "axios";

export const useMessages = () => {
  const [messages, setMessages] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    unread: 0,
    byPlatform: {},
  });
  const [isLoading, setIsLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pages: 1,
    total: 0,
    hasNext: false,
    hasPrev: false,
  });

  const fetchMessages = async (filters = {}) => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("token");
      const params = new URLSearchParams(filters);

      const response = await axios.get(
        `https://www.sushiluha.com/api/messages?${params}`,
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );

      setMessages(response.data.messages);
      setPagination(response.data.pagination);
    } catch (error) {
      console.error("Error fetching messages:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        "https://www.sushiluha.com/api/messages/stats",
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );
      setStats(response.data);
    } catch (error) {
      console.error("Error fetching message stats:", error);
      throw error;
    }
  };

  const markAsRead = async (messageId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.patch(
        `https://www.sushiluha.com/api/messages/${messageId}/read`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );

      // Update local state
      setMessages((prev) =>
        prev.map((msg) =>
          msg._id === messageId ? { ...msg, isRead: true } : msg
        )
      );

      // Update stats
      setStats((prev) => ({
        ...prev,
        unread: Math.max(0, prev.unread - 1),
      }));
    } catch (error) {
      console.error("Error marking message as read:", error);
      throw error;
    }
  };

  const archiveMessage = async (messageId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.patch(
        `https://www.sushiluha.com/api/messages/${messageId}/archive`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );

      // Remove from local state
      setMessages((prev) => prev.filter((msg) => msg._id !== messageId));

      // Update stats
      setStats((prev) => ({
        ...prev,
        total: prev.total - 1,
        unread:
          prev.unread -
          (messages.find((m) => m._id === messageId)?.isRead ? 0 : 1),
      }));
    } catch (error) {
      console.error("Error archiving message:", error);
      throw error;
    }
  };

  const syncMessages = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "https://www.sushiluha.com/api/messages/sync",
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );

      // Refresh messages and stats after sync
      await Promise.all([fetchMessages(), fetchStats()]);

      return response.data;
    } catch (error) {
      console.error("Error syncing messages:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const replyToMessage = async (messageId, content, imageUrl = null) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `https://www.sushiluha.com/api/messages/${messageId}/reply`,
        { content, imageUrl },
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );

      // Refresh messages after reply
      await fetchMessages();

      return response.data;
    } catch (error) {
      console.error("Error sending reply:", error);
      throw error;
    }
  };

  useEffect(() => {
    fetchMessages();
    fetchStats();
  }, []);

  return {
    messages,
    stats,
    isLoading,
    pagination,
    fetchMessages,
    fetchStats,
    markAsRead,
    archiveMessage,
    syncMessages,
    replyToMessage,
  };
};
