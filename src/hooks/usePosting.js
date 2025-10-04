import { useState } from "react";
import axios from "axios";

export const usePosting = () => {
  const [isPosting, setIsPosting] = useState(false);
  const [postingProgress, setPostingProgress] = useState("");

  const postToPlatforms = async (postData) => {
    try {
      setIsPosting(true);
      setPostingProgress(
        `Publishing to ${postData.platforms.length} platform(s)...`
      );

      const token = localStorage.getItem("token");
      const response = await axios.post(
        "https://www.sushiluha.com/api/post",
        postData,
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );

      const results = response.data;
      const successMessages = [];
      const errorMessages = [];

      for (const platform in results) {
        if (results[platform].message) {
          successMessages.push(`${platform}: ${results[platform].message}`);
        } else {
          errorMessages.push(`${platform}: ${results[platform].error}`);
        }
      }

      return {
        success: successMessages,
        errors: errorMessages,
        results,
      };
    } catch (error) {
      console.error("Post error:", error);
      throw error;
    } finally {
      setIsPosting(false);
      setPostingProgress("");
    }
  };

  const schedulePost = async (postData, scheduledAt) => {
    try {
      setIsPosting(true);
      setPostingProgress("Scheduling post...");

      const token = localStorage.getItem("token");
      const response = await axios.post(
        "https://www.sushiluha.com/api/schedule-post",
        { ...postData, scheduledAt },
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );

      return response.data;
    } catch (error) {
      console.error("Schedule error:", error);
      throw error;
    } finally {
      setIsPosting(false);
      setPostingProgress("");
    }
  };

  return {
    isPosting,
    postingProgress,
    postToPlatforms,
    schedulePost,
  };
};
