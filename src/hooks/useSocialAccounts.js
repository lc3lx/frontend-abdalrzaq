import { useState, useEffect } from "react";
import axios from "axios";

export const useSocialAccounts = () => {
  const [connectedAccounts, setConnectedAccounts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchAccounts = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        "https://www.sushiluha.com/api/accounts",
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );
      setConnectedAccounts(response.data);
    } catch (error) {
      console.error("Error fetching accounts:", error);
      throw error;
    }
  };

  const connectAccount = async (platform) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found");

      const endpoint = `/api/${platform.toLowerCase()}/auth`;
      setIsLoading(true);

      const response = await axios.get(`https://www.sushiluha.com${endpoint}`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });

      const authUrl = response.data.url;
      if (response.data.redirectUri) {
        const domain = new URL(response.data.redirectUri).hostname;
        console.log(
          "[فيسبوك] إذا ظهر خطأ النطاق، أضف في تطبيق فيسبوك → نطاقات التطبيق:",
          domain
        );
      }
      const width = 600;
      const height = 700;
      const left = window.screenX + (window.outerWidth - width) / 2;
      const top = window.screenY + (window.outerHeight - height) / 2;

      const popup = window.open(
        authUrl,
        "SmartSocialAuth",
        `width=${width},height=${height},top=${top},left=${left},resizable=yes,scrollbars=yes`
      );

      const checkPopup = setInterval(() => {
        if (popup.closed) {
          clearInterval(checkPopup);
          setIsLoading(false);
        }
      }, 500);

      return popup;
    } catch (error) {
      console.error(`Error connecting ${platform}:`, error);
      setIsLoading(false);
      throw error;
    }
  };

  const disconnectAccount = async (platform) => {
    try {
      const token = localStorage.getItem("token");
      setIsLoading(true);

      await axios.delete(`https://www.sushiluha.com/api/accounts/${platform}`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });

      setConnectedAccounts((prev) =>
        prev.filter((acc) => acc.platform !== platform)
      );
    } catch (error) {
      console.error(`Error disconnecting ${platform}:`, error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAccounts();

    // Listen for auth completion
    const handleMessage = (event) => {
      if (event.data.type === "AUTH_COMPLETE") {
        fetchAccounts();
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  return {
    connectedAccounts,
    isLoading,
    connectAccount,
    disconnectAccount,
    fetchAccounts,
  };
};
