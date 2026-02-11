import { useState, useEffect } from "react";
import axios from "axios";
import { API_ENDPOINTS, API_BASE_URL } from "../../config";
import {
  FaTwitter,
  FaFacebook,
  FaInstagram,
  FaLinkedin,
  FaHeart,
  FaComment,
  FaShare,
  FaRetweet,
  FaSync,
} from "react-icons/fa";

const PublishedPosts = () => {
  const [publishedPosts, setPublishedPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPublishedPosts();
  }, []);

  const fetchPublishedPosts = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        API_ENDPOINTS.publishedPosts,
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );
      setPublishedPosts(response.data);
      setError(null);
    } catch (error) {
      console.error("Error fetching published posts:", error);
      setError("Failed to fetch published posts");
    } finally {
      setIsLoading(false);
    }
  };

  const syncEngagement = async () => {
    try {
      setIsSyncing(true);
      const token = localStorage.getItem("token");
      const response = await axios.post(
        API_ENDPOINTS.syncEngagement,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );

      const data = response.data;
      console.log("Engagement sync results:", data);

      await fetchPublishedPosts();

      const parts = [];
      if (data.Facebook) {
        const fb = data.Facebook;
        if (fb.error) parts.push(`فيسبوك: ${fb.error}`);
        else if (fb.updated !== undefined) parts.push(`فيسبوك: ${fb.updated} منشور محدث`);
        if (fb.errors?.length) parts.push(fb.errors.map((e) => e.message).join("؛ "));
        if (fb.permissionHint) parts.push("\n" + fb.permissionHint);
      }
      if (data.Twitter?.updated !== undefined) parts.push(`تويتر: ${data.Twitter.updated} منشور محدث`);
      if (data.LinkedIn?.updated !== undefined) parts.push(`لينكدإن: ${data.LinkedIn.updated} منشور محدث`);
      const msg = parts.length ? parts.join("\n") : "تم تحديث التفاعل.";
      alert(msg);
    } catch (error) {
      console.error("Error syncing engagement:", error);
      const errMsg = error.response?.data?.error || error.message || "فشل تحديث التفاعل";
      alert("خطأ: " + errMsg);
    } finally {
      setIsSyncing(false);
    }
  };

  const getPlatformIcon = (platform) => {
    switch (platform) {
      case "Twitter":
        return <FaTwitter className="text-blue-400" />;
      case "Facebook":
        return <FaFacebook className="text-blue-600" />;
      case "Instagram":
        return <FaInstagram className="text-pink-500" />;
      case "LinkedIn":
        return <FaLinkedin className="text-blue-700" />;
      default:
        return null;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("ar-SA", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const toFullMediaUrl = (url) => {
    if (!url) return null;
    if (typeof url !== "string") return null;
    if (url.startsWith("http://") || url.startsWith("https://")) return url;
    const base = API_BASE_URL.replace(/\/$/, "");
    return url.startsWith("/") ? base + url : base + "/" + url;
  };

  const getEngagement = (post) => {
    const e = post?.engagement;
    if (!e || typeof e !== "object") {
      return { likes: 0, comments: 0, shares: 0, retweets: 0, lastUpdated: post?.publishedAt || new Date() };
    }
    return {
      likes: Number(e.likes) || 0,
      comments: Number(e.comments) || 0,
      shares: Number(e.shares) || 0,
      retweets: Number(e.retweets) || 0,
      lastUpdated: e.lastUpdated || post?.publishedAt || new Date(),
    };
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-600">Loading published posts...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-600">{error}</p>
        <button
          onClick={fetchPublishedPosts}
          className="mt-2 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
        <h2 className="text-2xl font-bold text-gray-800">المنشورات المنشورة</h2>
        <div className="flex items-center gap-3">
          <p className="text-sm text-gray-500 hidden sm:block">
            اضغط لتحديث الإعجابات والتعليقات والمشاركات من المنصات
          </p>
          <button
            onClick={syncEngagement}
            disabled={isSyncing}
            className="bg-green-600 text-white px-4 py-2 rounded-full hover:bg-green-700 transition-transform duration-300 transform hover:scale-105 disabled:bg-gray-400 flex items-center gap-2"
          >
            <FaSync className={isSyncing ? "animate-spin" : ""} />
            {isSyncing ? "جاري التحديث..." : "تحديث التفاعل"}
          </button>
        </div>
      </div>

      {publishedPosts.length === 0 ? (
        <div className="bg-white p-8 rounded-2xl shadow-lg border-t-4 border-blue-600 text-center">
          <p className="text-gray-600 text-lg">No published posts yet.</p>
          <p className="text-gray-500 text-sm mt-2">
            Create and publish your first post to see it here!
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {publishedPosts.map((post) => (
            <div
              key={post._id}
              className="bg-white p-6 rounded-2xl shadow-lg border-t-4 border-blue-600"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  {getPlatformIcon(post.platform)}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">
                      {post.platform}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {formatDate(post.publishedAt)}
                    </p>
                  </div>
                </div>
                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                  {post.status}
                </span>
              </div>

              <div className="mb-4">
                <p className="text-gray-800 leading-relaxed">{post.content}</p>
                {post.videoUrl && (
                  <div className="mt-3">
                    <video
                      src={toFullMediaUrl(post.videoUrl)}
                      controls
                      className="max-w-md rounded-lg shadow-md"
                      playsInline
                    >
                      Your browser does not support the video tag.
                    </video>
                  </div>
                )}
                {post.imageUrl && !post.videoUrl && (
                  <div className="mt-3">
                    <img
                      src={toFullMediaUrl(post.imageUrl)}
                      alt="Post image"
                      className="max-w-sm rounded-lg shadow-md"
                    />
                  </div>
                )}
              </div>

              {/* Engagement Metrics - الاعجابات والتعليقات والمشاركات */}
              {(() => {
                const eng = getEngagement(post);
                return (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div className="bg-red-50 p-3 rounded-lg text-center border border-red-100">
                      <FaHeart className="text-red-500 mx-auto mb-1 text-xl" />
                      <p className="text-sm text-gray-600">إعجابات</p>
                      <p className="text-lg font-bold text-gray-800">{eng.likes}</p>
                    </div>
                    <div className="bg-blue-50 p-3 rounded-lg text-center border border-blue-100">
                      <FaComment className="text-blue-500 mx-auto mb-1 text-xl" />
                      <p className="text-sm text-gray-600">تعليقات</p>
                      <p className="text-lg font-bold text-gray-800">{eng.comments}</p>
                    </div>
                    <div className="bg-purple-50 p-3 rounded-lg text-center border border-purple-100">
                      <FaShare className="text-purple-500 mx-auto mb-1 text-xl" />
                      <p className="text-sm text-gray-600">مشاركات</p>
                      <p className="text-lg font-bold text-gray-800">{eng.shares}</p>
                    </div>
                    {post.platform === "Twitter" && (
                      <div className="bg-green-50 p-3 rounded-lg text-center border border-green-100">
                        <FaRetweet className="text-green-500 mx-auto mb-1 text-xl" />
                        <p className="text-sm text-gray-600">إعادات تغريد</p>
                        <p className="text-lg font-bold text-gray-800">{eng.retweets}</p>
                      </div>
                    )}
                  </div>
                );
              })()}

              {/* Comments Section */}
              {post.comments && post.comments.length > 0 && (
                <div className="border-t pt-4">
                  <h4 className="text-md font-semibold text-gray-800 mb-3">
                    Recent Comments
                  </h4>
                  <div className="space-y-3 max-h-60 overflow-y-auto">
                    {post.comments.map((comment) => (
                      <div
                        key={comment._id}
                        className="bg-gray-50 p-3 rounded-lg"
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-medium text-gray-800">
                            {comment.authorName}
                          </span>
                          <span className="text-xs text-gray-500">
                            {formatDate(comment.createdAt)}
                          </span>
                        </div>
                        <p className="text-gray-700 text-sm">
                          {comment.content}
                        </p>
                        {(comment.engagement?.likes ?? 0) > 0 && (
                          <div className="flex items-center gap-1 mt-2">
                            <FaHeart className="text-red-500 text-xs" />
                            <span className="text-xs text-gray-500">
                              {comment.engagement.likes}
                            </span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="text-xs text-gray-400 mt-3">
                آخر تحديث للتفاعل: {formatDate(getEngagement(post).lastUpdated)}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PublishedPosts;
