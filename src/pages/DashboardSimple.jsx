import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import useImageUpload from "../hooks/useImageUpload";
import {
  FaTwitter,
  FaFacebook,
  FaInstagram,
  FaLinkedin,
  FaCog,
  FaCalendar as FaCalendarIcon,
  FaPlus,
  FaPlug,
  FaChartBar,
} from "react-icons/fa";
import PublishedPosts from "../components/Dashboard/PublishedPosts.jsx";

const Dashboard = () => {
  const {
    uploadMedia,
    isUploading: isImageUploading,
    uploadProgress: imageUploadProgress,
  } = useImageUpload();
  const [connectedAccounts, setConnectedAccounts] = useState([]);
  const [postContent, setPostContent] = useState("");
  const [imageUrl, setImageUrl] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [selectedPlatforms, setSelectedPlatforms] = useState([]);
  const [isPosting, setIsPosting] = useState(false);
  const [postingProgress, setPostingProgress] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newUsername, setNewUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [activeSection, setActiveSection] = useState("generate");
  const [scheduledAt, setScheduledAt] = useState("");
  const [scheduledPosts, setScheduledPosts] = useState([]);
  const [calendarDate, setCalendarDate] = useState(new Date());
  const navigate = useNavigate();

  useEffect(() => {
    console.log("Dashboard component mounted");
    const fetchUserAndAccounts = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("No token found");
        }
        setIsLoading(true);

        const userResponse = await axios.get(
          "https://www.sushiluha.com/api/user",
          {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true,
          }
        );
        setUsername(userResponse.data.username);
        setEmail(userResponse.data.email);
        setPassword("********");

        const accountsResponse = await axios.get(
          "https://www.sushiluha.com/api/accounts",
          {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true,
          }
        );
        setConnectedAccounts(accountsResponse.data);

        const scheduledPostsResponse = await axios.get(
          "https://www.sushiluha.com/api/scheduled-posts",
          {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true,
          }
        );
        setScheduledPosts(scheduledPostsResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
        localStorage.removeItem("token");
        navigate("/login");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserAndAccounts();
  }, [navigate]);

  const connectSocialMedia = async (platform) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found");
      const endpoint =
        platform === "Twitter"
          ? "/api/twitter/auth"
          : platform === "Facebook"
          ? "/api/facebook/auth"
          : platform === "Instagram"
          ? "/api/instagram/auth"
          : "/api/linkedin/auth";
      setIsLoading(true);

      const response = await axios.get(`https://www.sushiluha.com${endpoint}`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });

      const authUrl = response.data.url;
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
    } catch (error) {
      console.error(`Error connecting ${platform}:`, error.message);
      alert(
        `Error connecting ${platform}: ${
          error.response?.data?.error || "Unknown error"
        }`
      );
      setIsLoading(false);
    }
  };

  const disconnectSocialMedia = async (platform) => {
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
      console.error(`Error disconnecting ${platform}:`, error.message);
      alert(
        `Error disconnecting ${platform}: ${
          error.response?.data?.error || "Unknown error"
        }`
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handlePost = async (e) => {
    e.preventDefault();
    if (!postContent) {
      alert("Please write your post content.");
      return;
    }
    if (selectedPlatforms.length === 0) {
      alert("Please select at least one platform.");
      return;
    }
    setIsPosting(true);
    setPostingProgress(
      `Publishing to ${selectedPlatforms.length} platform(s)...`
    );

    try {
      const token = localStorage.getItem("token");
      const postData = {
        content: postContent,
        platforms: selectedPlatforms,
        imageUrl,
      };

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

      if (successMessages.length) {
        alert(
          `✅ Successfully posted to ${
            successMessages.length
          } platform(s):\n\n${successMessages.join("\n")}`
        );
      }
      if (errorMessages.length) {
        alert(
          `❌ Failed to post to ${
            errorMessages.length
          } platform(s):\n\n${errorMessages.join("\n")}`
        );
      }

      setPostContent("");
      setImageUrl(null);
      setSelectedPlatforms([]);
    } catch (error) {
      console.error("Post error:", error.response?.data || error.message);
      alert(`Error: ${error.response?.data?.error || "Unknown error"}`);
    } finally {
      setIsPosting(false);
      setPostingProgress("");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="font-sans min-h-screen flex bg-blue-100">
      <div className="w-64 bg-white shadow-lg flex flex-col justify-between">
        <div>
          <div className="p-6 border-b">
            <h1 className="text-2xl font-bold text-blue-600">SmartSocial</h1>
          </div>
          <nav className="mt-4">
            <button
              onClick={() => setActiveSection("integrations")}
              className={`w-full text-left p-4 flex items-center ${
                activeSection === "integrations"
                  ? "bg-blue-100 text-blue-700"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <FaPlug className="mr-2" /> Integrations
            </button>
            <button
              onClick={() => setActiveSection("generate")}
              className={`w-full text-left p-4 flex items-center ${
                activeSection === "generate"
                  ? "bg-blue-100 text-blue-700"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <FaPlus className="mr-2" /> Create Post
            </button>
            <button
              onClick={() => setActiveSection("published")}
              className={`w-full text-left p-4 flex items-center ${
                activeSection === "published"
                  ? "bg-blue-100 text-blue-700"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <FaChartBar className="mr-2" /> Published Posts
            </button>
          </nav>
        </div>
        <div className="p-4 border-t">
          <button
            onClick={handleLogout}
            className="w-full bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 transition-transform duration-300 transform hover:scale-105"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="flex-1 p-6 overflow-auto">
        <div className="bg-white p-6 rounded-2xl shadow-2xl mb-6 border-t-4 border-blue-600">
          <h1 className="text-3xl font-extrabold text-gray-800 mb-2">
            Welcome back, {username}!
          </h1>
          <p className="text-gray-600">
            Create and manage your social media posts easily.
          </p>
        </div>

        {activeSection === "integrations" && (
          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Integrations
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {["Twitter", "Facebook", "Instagram", "LinkedIn"].map(
                (platform) => {
                  const isConnected = connectedAccounts.some(
                    (acc) => acc.platform === platform
                  );
                  const iconClass =
                    platform === "Twitter"
                      ? "text-blue-400"
                      : platform === "Facebook"
                      ? "text-blue-600"
                      : platform === "Instagram"
                      ? "text-pink-500"
                      : "text-blue-700";
                  const Icon =
                    platform === "Twitter"
                      ? FaTwitter
                      : platform === "Facebook"
                      ? FaFacebook
                      : platform === "Instagram"
                      ? FaInstagram
                      : FaLinkedin;

                  return (
                    <div
                      key={platform}
                      className="bg-white p-6 rounded-xl shadow-lg border-t-2 flex items-center justify-between"
                    >
                      <div className="flex items-center">
                        <Icon className={`${iconClass} text-3xl mr-4`} />
                        <div>
                          <h3 className="text-xl font-semibold text-gray-800">
                            {platform}
                          </h3>
                          {isConnected ? (
                            <p className="text-green-600 text-sm">
                              Connected as{" "}
                              {
                                connectedAccounts.find(
                                  (acc) => acc.platform === platform
                                ).displayName
                              }
                            </p>
                          ) : (
                            <p className="text-gray-600 text-sm">
                              Not connected
                            </p>
                          )}
                        </div>
                      </div>
                      {isConnected ? (
                        <button
                          onClick={() => disconnectSocialMedia(platform)}
                          className="bg-red-600 text-white px-4 py-2 rounded-full hover:bg-red-700 transition-transform duration-300 transform hover:scale-105"
                          disabled={isLoading}
                        >
                          Disconnect
                        </button>
                      ) : (
                        <button
                          onClick={() => connectSocialMedia(platform)}
                          className={`${iconClass.replace(
                            "text-",
                            "bg-"
                          )} text-white px-4 py-2 rounded-full hover:opacity-80 transition-transform duration-300 transform hover:scale-105`}
                          disabled={isLoading}
                        >
                          Connect
                        </button>
                      )}
                    </div>
                  );
                }
              )}
            </div>
          </section>
        )}

        {activeSection === "generate" && (
          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Create Post
            </h2>
            <div className="bg-white p-8 rounded-2xl shadow-2xl border-t-4 border-blue-600">
              <form onSubmit={handlePost}>
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
                  ></textarea>
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
                      onChange={async (e) => {
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
                      }}
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
                    {["Twitter", "Facebook", "Instagram", "LinkedIn"].map(
                      (platform) => {
                        const isConnected = connectedAccounts.some(
                          (acc) => acc.platform === platform
                        );
                        const isSelected = selectedPlatforms.includes(platform);
                        const iconClass =
                          platform === "Twitter"
                            ? "text-blue-400"
                            : platform === "Facebook"
                            ? "text-blue-600"
                            : platform === "Instagram"
                            ? "text-pink-500"
                            : "text-blue-700";
                        const Icon =
                          platform === "Twitter"
                            ? FaTwitter
                            : platform === "Facebook"
                            ? FaFacebook
                            : platform === "Instagram"
                            ? FaInstagram
                            : FaLinkedin;

                        return (
                          <label
                            key={platform}
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
                              onChange={() =>
                                setSelectedPlatforms((prev) =>
                                  prev.includes(platform)
                                    ? prev.filter((p) => p !== platform)
                                    : [...prev, platform]
                                )
                              }
                              disabled={!isConnected || isPosting}
                            />
                            <Icon className={`text-xl mr-2 ${iconClass}`} />
                            <span
                              className={`font-medium ${
                                isConnected ? "text-gray-700" : "text-gray-400"
                              }`}
                            >
                              {platform}
                            </span>
                          </label>
                        );
                      }
                    )}
                  </div>

                  {/* Quick Select All Button */}
                  <div className="mt-4 text-center">
                    <button
                      type="button"
                      onClick={() => {
                        const connectedPlatforms = connectedAccounts.map(
                          (acc) => acc.platform
                        );
                        if (
                          selectedPlatforms.length === connectedPlatforms.length
                        ) {
                          setSelectedPlatforms([]);
                        } else {
                          setSelectedPlatforms(connectedPlatforms);
                        }
                      }}
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
                      !postContent ||
                      selectedPlatforms.length === 0 ||
                      isPosting
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
        )}

        {activeSection === "published" && (
          <section>
            <PublishedPosts />
          </section>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
