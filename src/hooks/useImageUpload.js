import { useState } from "react";
import axios from "axios";

const useImageUpload = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const uploadMedia = async (file) => {
    if (!file) {
      throw new Error("No file provided");
    }

    // Validate file type
    const allowedTypes = [
      // Images
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
      "image/webp",
      // Videos
      "video/mp4",
      "video/avi",
      "video/mov",
      "video/wmv",
      "video/flv",
      "video/webm",
      "video/quicktime",
    ];
    if (!allowedTypes.includes(file.type)) {
      throw new Error(
        "Invalid file type. Only image and video files are allowed."
      );
    }

    // Validate file size (50MB limit for media)
    const maxSize = 50 * 1024 * 1024; // 50MB
    if (file.size > maxSize) {
      throw new Error("File size too large. Maximum size is 50MB.");
    }

    try {
      setIsUploading(true);
      setUploadProgress(0);

      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("media", file);

      const response = await axios.post(
        "https://www.sushiluha.com/api/upload/media",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
          onUploadProgress: (progressEvent) => {
            const progress = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setUploadProgress(progress);
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error("Media upload error:", error);
      throw new Error(
        error.response?.data?.error || error.message || "Failed to upload media"
      );
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const uploadImage = async (file) => {
    if (!file) {
      throw new Error("No file provided");
    }

    // Validate file type for images only
    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
      "image/webp",
    ];
    if (!allowedTypes.includes(file.type)) {
      throw new Error("Invalid file type. Only image files are allowed.");
    }

    // Validate file size (10MB limit for images)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      throw new Error("File size too large. Maximum size is 10MB.");
    }

    try {
      setIsUploading(true);
      setUploadProgress(0);

      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("image", file);

      const response = await axios.post(
        "https://www.sushiluha.com/api/upload/image",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
          onUploadProgress: (progressEvent) => {
            const progress = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setUploadProgress(progress);
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error("Image upload error:", error);
      throw new Error(
        error.response?.data?.error || error.message || "Failed to upload image"
      );
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const uploadImages = async (files) => {
    if (!files || files.length === 0) {
      throw new Error("No files provided");
    }

    // Validate files
    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
      "image/webp",
    ];
    const maxSize = 10 * 1024 * 1024; // 10MB

    for (let file of files) {
      if (!allowedTypes.includes(file.type)) {
        throw new Error(
          `Invalid file type: ${file.name}. Only image files are allowed.`
        );
      }
      if (file.size > maxSize) {
        throw new Error(`File too large: ${file.name}. Maximum size is 10MB.`);
      }
    }

    try {
      setIsUploading(true);
      setUploadProgress(0);

      const token = localStorage.getItem("token");
      const formData = new FormData();

      files.forEach((file) => {
        formData.append("images", file);
      });

      const response = await axios.post(
        "https://www.sushiluha.com/api/upload/images",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
          onUploadProgress: (progressEvent) => {
            const progress = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setUploadProgress(progress);
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error("Images upload error:", error);
      throw new Error(
        error.response?.data?.error ||
          error.message ||
          "Failed to upload images"
      );
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const deleteImage = async (filename) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(
        `https://www.sushiluha.com/api/upload/image/${filename}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );
    } catch (error) {
      console.error("Image delete error:", error);
      throw new Error(
        error.response?.data?.error || error.message || "Failed to delete image"
      );
    }
  };

  const getImages = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        "https://www.sushiluha.com/api/upload/images",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );
      return response.data.images;
    } catch (error) {
      console.error("Get images error:", error);
      throw new Error(
        error.response?.data?.error || error.message || "Failed to get images"
      );
    }
  };

  return {
    uploadMedia,
    uploadImage,
    uploadImages,
    deleteImage,
    getImages,
    isUploading,
    uploadProgress,
  };
};

export default useImageUpload;
