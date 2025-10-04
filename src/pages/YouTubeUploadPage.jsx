import { useState, useEffect } from "react";
import { useSocialAccounts } from "../hooks/useSocialAccounts";
import YouTubeUpload from "../components/YouTube/YouTubeUpload";
import {
  FaYoutube,
  FaUpload,
  FaVideo,
  FaPlay,
  FaTrash,
  FaEye,
  FaEyeSlash,
  FaCalendar,
} from "react-icons/fa";
import axios from "axios";

const YouTubeUploadPage = () => {
  const { connectedAccounts } = useSocialAccounts();
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [videos, setVideos] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);

  const youtubeAccount = connectedAccounts.find(
    (acc) => acc.platform === "YouTube"
  );

  useEffect(() => {
    if (youtubeAccount) {
      fetchVideos();
    }
  }, [youtubeAccount]);

  const fetchVideos = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.get(
        "https://www.sushiluha.com/api/posts?platform=YouTube",
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );
      setVideos(response.data);
    } catch (error) {
      console.error("Error fetching videos:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVideoSelect = (video) => {
    setSelectedVideo(video);
  };

  const handleVideoUpdate = async (videoId, updates) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `https://www.sushiluha.com/api/youtube/update/${videoId}`,
        updates,
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );
      fetchVideos();
      setSelectedVideo(null);
    } catch (error) {
      console.error("Error updating video:", error);
      alert("خطأ في تحديث الفيديو");
    }
  };

  const handleVideoDelete = async (videoId) => {
    if (!window.confirm("هل أنت متأكد من حذف هذا الفيديو؟")) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      await axios.delete(
        `https://www.sushiluha.com/api/youtube/delete/${videoId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );
      fetchVideos();
      setSelectedVideo(null);
    } catch (error) {
      console.error("Error deleting video:", error);
      alert("خطأ في حذف الفيديو");
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("ar-SA", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getPrivacyIcon = (privacy) => {
    switch (privacy) {
      case "public":
        return <FaEye className="text-green-600" />;
      case "private":
        return <FaEyeSlash className="text-red-600" />;
      case "unlisted":
        return <FaEye className="text-yellow-600" />;
      default:
        return <FaEye className="text-gray-600" />;
    }
  };

  if (!youtubeAccount) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <FaYoutube className="text-6xl text-red-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            YouTube غير متصل
          </h2>
          <p className="text-gray-600 mb-6">
            يرجى الاتصال بحساب YouTube أولاً من صفحة التكاملات
          </p>
          <button
            onClick={() => (window.location.href = "/integrations")}
            className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            الذهاب إلى التكاملات
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <FaYoutube className="text-3xl text-red-600 mr-3" />
              <div>
                <h1 className="text-2xl font-bold text-gray-800">
                  إدارة فيديوهات YouTube
                </h1>
                <p className="text-gray-600">
                  متصل كـ: {youtubeAccount.displayName}
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowUploadModal(true)}
              className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center"
            >
              <FaUpload className="mr-2" />
              رفع فيديو جديد
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Videos List */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-800">
                  الفيديوهات ({videos.length})
                </h2>
              </div>
              <div className="p-6">
                {isLoading ? (
                  <div className="text-center py-8">
                    <FaVideo className="text-4xl text-gray-400 mx-auto mb-4 animate-pulse" />
                    <p className="text-gray-600">جاري تحميل الفيديوهات...</p>
                  </div>
                ) : videos.length === 0 ? (
                  <div className="text-center py-8">
                    <FaVideo className="text-4xl text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-4">لا توجد فيديوهات</p>
                    <button
                      onClick={() => setShowUploadModal(true)}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                    >
                      رفع أول فيديو
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {videos.map((video) => (
                      <div
                        key={video._id}
                        className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                          selectedVideo?._id === video._id
                            ? "border-red-500 bg-red-50"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                        onClick={() => handleVideoSelect(video)}
                      >
                        <div className="flex items-start space-x-4">
                          <div className="flex-shrink-0">
                            <img
                              src={video.imageUrl}
                              alt={video.content}
                              className="w-24 h-16 object-cover rounded"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="text-sm font-medium text-gray-900 truncate">
                              {video.content}
                            </h3>
                            <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                              {video.description}
                            </p>
                            <div className="flex items-center mt-2 space-x-4 text-xs text-gray-500">
                              <span className="flex items-center">
                                {getPrivacyIcon(video.privacyStatus)}
                                <span className="mr-1">
                                  {video.privacyStatus === "public"
                                    ? "عام"
                                    : video.privacyStatus === "private"
                                    ? "خاص"
                                    : "غير مدرج"}
                                </span>
                              </span>
                              <span className="flex items-center">
                                <FaCalendar className="mr-1" />
                                {formatDate(video.createdAt)}
                              </span>
                            </div>
                          </div>
                          <div className="flex-shrink-0">
                            <a
                              href={video.videoUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-red-600 hover:text-red-700"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <FaPlay className="text-lg" />
                            </a>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Video Details */}
          <div className="lg:col-span-1">
            {selectedVideo ? (
              <div className="bg-white rounded-lg shadow-sm">
                <div className="p-6 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-800">
                    تفاصيل الفيديو
                  </h3>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    <div>
                      <img
                        src={selectedVideo.imageUrl}
                        alt={selectedVideo.content}
                        className="w-full h-48 object-cover rounded-lg"
                      />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">
                        {selectedVideo.content}
                      </h4>
                      <p className="text-sm text-gray-600 mt-1">
                        {selectedVideo.description}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">الحالة:</span>
                        <span className="flex items-center">
                          {getPrivacyIcon(selectedVideo.privacyStatus)}
                          <span className="mr-1">
                            {selectedVideo.privacyStatus === "public"
                              ? "عام"
                              : selectedVideo.privacyStatus === "private"
                              ? "خاص"
                              : "غير مدرج"}
                          </span>
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">تاريخ النشر:</span>
                        <span>{formatDate(selectedVideo.createdAt)}</span>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <a
                        href={selectedVideo.videoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 px-3 py-2 bg-red-600 text-white text-center rounded-lg hover:bg-red-700 flex items-center justify-center"
                      >
                        <FaPlay className="mr-1" />
                        مشاهدة
                      </a>
                      <button
                        onClick={() =>
                          handleVideoDelete(selectedVideo.platformPostId)
                        }
                        className="px-3 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-sm p-6 text-center">
                <FaVideo className="text-4xl text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">اختر فيديو لعرض التفاصيل</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {showUploadModal && (
        <YouTubeUpload
          onClose={() => setShowUploadModal(false)}
          onSuccess={() => {
            setShowUploadModal(false);
            fetchVideos();
          }}
        />
      )}
    </div>
  );
};

export default YouTubeUploadPage;
