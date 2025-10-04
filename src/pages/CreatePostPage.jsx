import { useState } from "react";
import { useSocialAccounts } from "../hooks/useSocialAccounts";
import { usePosting } from "../hooks/usePosting";
import useImageUpload from "../hooks/useImageUpload";
import SubscriptionCheck from "../components/SubscriptionCheck";
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
  const [imageFile, setImageFile] = useState(null);
  const [selectedPlatforms, setSelectedPlatforms] = useState([]);

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
    <section>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Create Post</h2>
      <div className="bg-white p-8 rounded-2xl shadow-2xl border-t-4 border-blue-600">
        <form onSubmit={handleSubmit}>
          {/* Post Content */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Post Content
            </label>
            <textarea
              className="w-full p-4 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
              rows="4"
              placeholder="Write your post content here..."
              value={postContent}
              onChange={(e) => setPostContent(e.target.value)}
              required
            />
          </div>

          {/* Image/Video Upload */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Image or Video (Optional)
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
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
                  className="w-12 h-12 text-gray-400 mb-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  />
                </svg>
                <p className="text-sm text-gray-600">
                  Click to upload image or video
                </p>
                <p className="text-xs text-gray-400">
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
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-4">
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
                      className={`flex items-center p-3 rounded-lg border-2 cursor-pointer transition-all ${
                        isSelected
                          ? "border-blue-500 bg-blue-50"
                          : isConnected
                          ? "border-gray-300 hover:border-gray-400"
                          : "border-gray-200 bg-gray-100 cursor-not-allowed"
                      }`}
                    >
                      <input
                        type="checkbox"
                        className="mr-3 h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        checked={isSelected}
                        onChange={() => handlePlatformToggle(name)}
                        disabled={!isConnected || isPosting}
                      />
                      <Icon className={`text-xl mr-2 ${color}`} />
                      <span
                        className={`font-medium ${
                          isConnected ? "text-gray-700" : "text-gray-400"
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
          <div className="flex gap-4 justify-center">
            <button
              type="submit"
              className="bg-blue-600 text-white px-8 py-3 rounded-full hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 disabled:bg-gray-400 text-lg font-medium"
              disabled={
                !postContent || selectedPlatforms.length === 0 || isPosting
              }
            >
              {isPosting
                ? postingProgress || "Posting..."
                : `Post to ${selectedPlatforms.length} Platform${
                    selectedPlatforms.length > 1 ? "s" : ""
                  }`}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default CreatePostPage;
