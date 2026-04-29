import { useState, useEffect } from "react";
import { useSocialAccounts } from "../hooks/useSocialAccounts";
import { usePosting } from "../hooks/usePosting";
import useImageUpload from "../hooks/useImageUpload";
import SubscriptionCheck from "../components/SubscriptionCheck";
import { motion } from "framer-motion";
import { FaPlus, FaRocket } from "react-icons/fa";
import {
  FaTwitter,
  FaFacebook,
  FaInstagram,
  FaLinkedin,
  FaTiktok,
  FaYoutube,
  FaWhatsapp,
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
  const [imageFile, setImageFile] = useState(null);
  const [selectedPlatforms, setSelectedPlatforms] = useState([]);
  const [whatsappTo, setWhatsappTo] = useState("");
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
    {
      name: "WhatsApp",
      icon: FaWhatsapp,
      color: "text-green-500",
      serviceType: "whatsapp",
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

    if (selectedPlatforms.includes("WhatsApp") && !whatsappTo.trim()) {
      alert("Please enter the WhatsApp recipient phone number.");
      return;
    }

    try {
      const postData = {
        content: postContent,
        platforms: selectedPlatforms,
        imageUrl,
        whatsappTo: whatsappTo.trim() || undefined,
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
      setWhatsappTo("");
      setSelectedPlatforms([]);
    } catch (error) {
      const msg = error.response?.data?.message || error.response?.data?.error || error.message || "Unknown error";
      alert(`Error: ${msg}`);
    }
  };

  return (
    <div className="relative">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-4xl mx-auto"
      >
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-center mb-12"
          >
            <div className="w-20 h-20 bg-gradient-to-br from-teal-300 via-amber-300 to-rose-400 rounded-2xl flex items-center justify-center mx-auto mb-6 text-slate-950 shadow-glow">
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
            className="premium-panel rounded-2xl p-8 lg:p-12"
          >
            <form onSubmit={handleSubmit}>
              {/* Post Content */}
              <div className="mb-8">
                <label className="block text-lg font-semibold text-white mb-4">
                  Post Content
                </label>
                <textarea
                  className="premium-input min-h-40 resize-none p-6"
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
                <div className="rounded-xl border-2 border-dashed border-white/20 bg-white/[0.05] p-8 text-center transition-all duration-300 hover:border-teal-300/60">
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
                              ? "border-teal-300 bg-teal-400/15 shadow-lg"
                              : isConnected
                              ? "border-white/30 hover:border-teal-300/60 hover:bg-white/10"
                              : "border-white/20 bg-white/5 cursor-not-allowed opacity-50"
                          }`}
                        >
                          <input
                            type="checkbox"
                            className="mr-4 h-6 w-6 text-teal-300 focus:ring-teal-300 border-white/30 rounded bg-transparent"
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
                    className="rounded-lg px-4 py-2 text-sm font-bold text-teal-300 hover:bg-white/10"
                  >
                    {selectedPlatforms.length === connectedAccounts.length
                      ? "Unselect All"
                      : "Select All Connected"}
                  </button>
                </div>
              </div>

              {selectedPlatforms.includes("WhatsApp") && (
                <div className="mb-8">
                  <label className="block text-lg font-semibold text-white mb-4">
                    WhatsApp Recipient
                  </label>
                  <input
                    type="tel"
                    value={whatsappTo}
                    onChange={(e) => setWhatsappTo(e.target.value)}
                    placeholder="مثال: 9639xxxxxxxx أو +9639xxxxxxxx"
                    className="premium-input p-4"
                    required={selectedPlatforms.includes("WhatsApp")}
                  />
                </div>
              )}

              {/* Action Button */}
              <div className="flex gap-4 justify-center mt-12">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="premium-button px-12 py-4 text-xl disabled:cursor-not-allowed disabled:opacity-50"
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
  );
};

export default CreatePostPage;
