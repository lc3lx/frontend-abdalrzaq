import { useState, useEffect } from "react";
import { useSocialAccounts } from "../hooks/useSocialAccounts";
import { usePosting } from "../hooks/usePosting";
import useImageUpload from "../hooks/useImageUpload";
import SubscriptionCheck from "../components/SubscriptionCheck";
import Navbar from "../components/Navbar";
import { motion } from "framer-motion";
import { FaPlus, FaRocket } from "react-icons/fa";
import {
  FaTwitter,
  FaFacebook,
  FaInstagram,
  FaLinkedin,
  FaTiktok,
  FaYoutube,
} from "react-icons/fa";

const CreatePostPage = () => {
  const { connectedAccounts } = useSocialAccounts();
  const { isPosting, postingProgress, postToPlatforms } = usePosting();
  const {
    uploadMedia,
    isUploading: isImageUploading,
    uploadProgress: imageUploadProgress,
  } = useImageUpload();

  const [postContent, setPostContent] = useState("");
  const [imageUrl, setImageUrl] = useState(null);
  const [selectedPlatforms, setSelectedPlatforms] = useState([]);
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

  const platforms = [
    {
      name: "Twitter",
      icon: FaTwitter,
      color: "text-blue-400",
      serviceType: "twitter",
    },
    {
      name: "Facebook",
      icon: FaFacebook,
      color: "text-blue-600",
      serviceType: "facebook",
    },
    {
      name: "Instagram",
      icon: FaInstagram,
      color: "text-pink-500",
      serviceType: "instagram",
    },
    {
      name: "LinkedIn",
      icon: FaLinkedin,
      color: "text-blue-700",
      serviceType: "linkedin",
    },
    {
      name: "TikTok",
      icon: FaTiktok,
      color: "text-black",
      serviceType: "tiktok",
    },
    {
      name: "YouTube",
      icon: FaYoutube,
      color: "text-red-600",
      serviceType: "youtube",
    },
  ];

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        // Show preview immediately
        const previewUrl = URL.createObjectURL(file);
        setImageUrl(previewUrl);
        setImageFile(file);

        // Upload to server
        const result = await uploadMedia(file);
        setImageUrl(result.mediaUrl); // Replace preview with server URL
      } catch (error) {
        console.error("Upload error:", error);
        alert(`خطأ في رفع الصورة: ${error.message}`);
        setImageUrl(null);
        setImageFile(null);
      }
    }
  };

  const handlePlatformToggle = (platform) => {
    setSelectedPlatforms((prev) =>
      prev.includes(platform)
        ? prev.filter((p) => p !== platform)
        : [...prev, platform]
    );
  };

  const handleSelectAll = () => {
    const connectedPlatforms = connectedAccounts.map((acc) => acc.platform);
    if (selectedPlatforms.length === connectedPlatforms.length) {
      setSelectedPlatforms([]);
    } else {
      setSelectedPlatforms(connectedPlatforms);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!postContent) {
      alert("Please write your post content.");
      return;
    }

    if (selectedPlatforms.length === 0) {
      alert("Please select at least one platform.");
      return;
    }

    try {
      const postData = {
        content: postContent,
        platforms: selectedPlatforms,
        imageUrl,
      };

      const result = await postToPlatforms(postData);

      if (result.success.length) {
        alert(
          `✅ Successfully posted to ${
            result.success.length
          } platform(s):\n\n${result.success.join("\n")}`
        );
      }

      if (result.errors.length) {
        alert(
          `❌ Failed to post to ${
            result.errors.length
          } platform(s):\n\n${result.errors.join("\n")}`
        );
      }

      // Reset form
      setPostContent("");
      setImageUrl(null);
      setSelectedPlatforms([]);
    } catch (error) {
      alert(`Error: ${error.response?.data?.error || "Unknown error"}`);
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
            <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <FaPlus className="text-3xl text-white" />
            </div>
            <h1 className="text-5xl lg:text-6xl font-black text-white mb-4">
              Create New Post
            </h1>
            <p className="text-xl text-white/80">
              Share your content across multiple platforms with one click
            </p>
          </motion.div>

          {/* Form Card */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 lg:p-12 border border-white/20 shadow-2xl"
          >
            <form onSubmit={handleSubmit}>
              {/* Post Content */}
              <div className="mb-8">
                <label className="block text-lg font-semibold text-white mb-4">
                  Post Content
                </label>
                <textarea
                  className="w-full p-6 bg-white/10 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-300 text-white placeholder-white/50 backdrop-blur-sm resize-none"
                  rows="5"
                  placeholder="Write your amazing post content here..."
                  value={postContent}
                  onChange={(e) => setPostContent(e.target.value)}
                  required
                />
              </div>

              {/* Image/Video Upload */}
              <div className="mb-8">
                <label className="block text-lg font-semibold text-white mb-4">
                  Media (Optional)
                </label>
                <div className="border-2 border-dashed border-white/30 rounded-xl p-8 text-center hover:border-purple-400 transition-all duration-300 bg-white/5">
                  <input
                    type="file"
                    accept="image/*,video/*"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="media-upload"
                  />
                  <label
                    htmlFor="media-upload"
                    className="cursor-pointer flex flex-col items-center"
                  >
                    <svg
                      className="w-16 h-16 text-white/60 mb-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                      />
                    </svg>
                    <p className="text-lg text-white/80 mb-2 font-medium">
                      Click to upload image or video
                    </p>
                    <p className="text-sm text-white/60">
                      PNG, JPG, MP4, MOV up to 50MB
                    </p>
                  </label>
                </div>
                {imageUrl && (
                  <div className="mt-4">
                    <div className="relative">
                      <img
                        src={imageUrl}
                        alt="Uploaded media"
                        className="max-w-sm rounded-lg shadow-md"
                      />
                      {isImageUploading && (
                        <div className="absolute inset-0 bg-black bg-opacity-50 rounded-lg flex items-center justify-center">
                          <div className="text-white text-center">
                            <div className="text-sm mb-2">جاري الرفع...</div>
                            <div className="w-32 bg-gray-300 rounded-full h-2">
                              <div
                                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${imageUploadProgress}%` }}
                              ></div>
                            </div>
                            <div className="text-xs mt-1">
                              {imageUploadProgress}%
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setImageUrl(null);
                        setImageFile(null);
                      }}
                      className="mt-2 text-red-600 text-sm hover:text-red-800"
                      disabled={isImageUploading}
                    >
                      Remove
                    </button>
                  </div>
                )}
              </div>

              {/* Platform Selection */}
              <div className="mb-8">
                <label className="block text-lg font-semibold text-white mb-6">
                  Select Platforms
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {platforms.map(({ name, icon: Icon, color, serviceType }) => {
                    const isConnected = connectedAccounts.some(
                      (acc) => acc.platform === name
                    );
                    const isSelected = selectedPlatforms.includes(name);

                    return (
                      <SubscriptionCheck key={name} serviceType={serviceType}>
                        <label
                          className={`flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
                            isSelected
                              ? "border-purple-400 bg-purple-500/20 shadow-lg"
                              : isConnected
                              ? "border-white/30 hover:border-purple-400 hover:bg-white/10"
                              : "border-white/20 bg-white/5 cursor-not-allowed opacity-50"
                          }`}
                        >
                          <input
                            type="checkbox"
                            className="mr-4 h-6 w-6 text-purple-400 focus:ring-purple-400 border-white/30 rounded bg-transparent"
                            checked={isSelected}
                            onChange={() => handlePlatformToggle(name)}
                            disabled={!isConnected || isPosting}
                          />
                          <Icon className={`text-2xl mr-3 ${color}`} />
                          <span
                            className={`font-semibold text-lg ${
                              isConnected ? "text-white" : "text-white/50"
                            }`}
                          >
                            {name}
                          </span>
                        </label>
                      </SubscriptionCheck>
                    );
                  })}
                </div>

                {/* Quick Select All Button */}
                <div className="mt-4 text-center">
                  <button
                    type="button"
                    onClick={handleSelectAll}
                    className="text-sm text-blue-600 hover:text-blue-800 font-medium px-4 py-2 rounded-lg hover:bg-blue-50"
                  >
                    {selectedPlatforms.length === connectedAccounts.length
                      ? "Unselect All"
                      : "Select All Connected"}
                  </button>
                </div>
              </div>

              {/* Action Button */}
              <div className="flex gap-4 justify-center mt-12">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-12 py-4 rounded-2xl hover:from-purple-700 hover:to-pink-700 transition-all duration-300 shadow-2xl text-xl font-bold flex items-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={
                    !postContent || selectedPlatforms.length === 0 || isPosting
                  }
                >
                  <FaRocket className="text-2xl" />
                  {isPosting
                    ? postingProgress || "Posting..."
                    : `Post to ${selectedPlatforms.length} Platform${
                        selectedPlatforms.length > 1 ? "s" : ""
                      }`}
                </motion.button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default CreatePostPage;
