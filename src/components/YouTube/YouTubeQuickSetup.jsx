import { useState } from "react";
import {
  FaYoutube,
  FaCheck,
  FaTimes,
  FaInfoCircle,
  FaCog,
  FaExternalLinkAlt,
  FaVideo,
  FaUsers,
  FaEye,
} from "react-icons/fa";
import axios from "axios";

const YouTubeQuickSetup = ({ onClose, onSuccess }) => {
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [channelInfo, setChannelInfo] = useState(null);

  const handleConnect = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("token");

      const response = await axios.get(
        "http://localhost:5000/api/youtube/auth",
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );

      if (response.data.url) {
        // Open YouTube auth in popup
        const popup = window.open(
          response.data.url,
          "youtube-auth",
          "width=600,height=700,scrollbars=yes,resizable=yes"
        );

        // Listen for auth completion
        const messageListener = (event) => {
          if (event.data.type === "AUTH_COMPLETE") {
            popup.close();
            window.removeEventListener("message", messageListener);
            fetchChannelInfo();
            setStep(2);
          }
        };

        window.addEventListener("message", messageListener);

        // Check if popup was closed manually
        const checkClosed = setInterval(() => {
          if (popup.closed) {
            clearInterval(checkClosed);
            window.removeEventListener("message", messageListener);
            setIsLoading(false);
          }
        }, 1000);
      }
    } catch (error) {
      alert(
        `خطأ في الاتصال بـ YouTube: ${
          error.response?.data?.error || "خطأ غير معروف"
        }`
      );
    } finally {
      setIsLoading(false);
    }
  };

  const fetchChannelInfo = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        "http://localhost:5000/api/youtube/channel",
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );
      setChannelInfo(response.data);
    } catch (error) {
      console.error("Error fetching channel info:", error);
    }
  };

  const handleComplete = () => {
    onSuccess();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <FaYoutube className="text-red-600 text-2xl mr-3" />
              <h2 className="text-2xl font-bold text-gray-800">
                إعداد YouTube
              </h2>
            </div>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <FaTimes className="text-xl" />
            </button>
          </div>

          {step === 1 && (
            <div className="space-y-6">
              <div className="bg-red-50 p-4 rounded-lg">
                <div className="flex items-start">
                  <FaInfoCircle className="text-red-600 text-lg mr-2 mt-1" />
                  <div>
                    <h4 className="font-semibold text-red-800 mb-2">
                      إعداد YouTube Data API v3
                    </h4>
                    <p className="text-red-700 text-sm">
                      ستحتاج إلى إنشاء مشروع Google Cloud وتفعيل YouTube Data
                      API
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <h5 className="font-semibold text-blue-800 mb-2">
                  خطوات الحصول على YouTube API:
                </h5>
                <ol className="list-decimal list-inside space-y-1 text-sm text-blue-700">
                  <li>
                    اذهب إلى{" "}
                    <a
                      href="https://console.cloud.google.com"
                      target="_blank"
                      className="text-blue-600 hover:underline"
                    >
                      Google Cloud Console
                    </a>
                  </li>
                  <li>أنشئ مشروع جديد أو استخدم مشروع موجود</li>
                  <li>فعّل YouTube Data API v3</li>
                  <li>أنشئ OAuth 2.0 credentials</li>
                  <li>احصل على Client ID و Client Secret</li>
                  <li>
                    أضف Redirect URI: http://localhost:5000/api/youtube/callback
                  </li>
                </ol>
              </div>

              <div className="bg-yellow-50 p-4 rounded-lg">
                <h5 className="font-semibold text-yellow-800 mb-2">
                  متطلبات البيئة:
                </h5>
                <ul className="list-disc list-inside space-y-1 text-sm text-yellow-700">
                  <li>تأكد من إضافة متغيرات البيئة في ملف .env</li>
                  <li>YOUTUBE_CLIENT_ID: معرف العميل</li>
                  <li>YOUTUBE_CLIENT_SECRET: سر العميل</li>
                </ul>
              </div>

              <div className="bg-green-50 p-4 rounded-lg">
                <h5 className="font-semibold text-green-800 mb-2">
                  الميزات المتاحة:
                </h5>
                <ul className="list-disc list-inside space-y-1 text-sm text-green-700">
                  <li>رفع الفيديوهات مباشرة</li>
                  <li>إدارة معلومات الفيديو</li>
                  <li>جدولة النشر</li>
                  <li>متابعة الإحصائيات</li>
                </ul>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={onClose}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  إلغاء
                </button>
                <button
                  onClick={handleConnect}
                  disabled={isLoading}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  {isLoading ? (
                    <>
                      <FaCog className="mr-2 animate-spin" />
                      جاري الاتصال...
                    </>
                  ) : (
                    <>
                      <FaExternalLinkAlt className="mr-2" />
                      الاتصال بـ YouTube
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="flex items-center">
                  <FaCheck className="text-green-500 text-lg mr-2" />
                  <h4 className="font-semibold text-green-800">
                    تم الاتصال بـ YouTube بنجاح!
                  </h4>
                </div>
              </div>

              {channelInfo && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h5 className="font-semibold text-gray-800 mb-3">
                    معلومات القناة:
                  </h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center">
                      <FaVideo className="text-red-600 mr-2" />
                      <span className="text-sm text-gray-600">
                        {channelInfo.videoCount} فيديو
                      </span>
                    </div>
                    <div className="flex items-center">
                      <FaUsers className="text-red-600 mr-2" />
                      <span className="text-sm text-gray-600">
                        {parseInt(channelInfo.subscriberCount).toLocaleString()}{" "}
                        مشترك
                      </span>
                    </div>
                    <div className="flex items-center">
                      <FaEye className="text-red-600 mr-2" />
                      <span className="text-sm text-gray-600">
                        {parseInt(channelInfo.viewCount).toLocaleString()}{" "}
                        مشاهدة
                      </span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-sm text-gray-600">
                        {channelInfo.title}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              <div className="bg-blue-50 p-4 rounded-lg">
                <h5 className="font-semibold text-blue-800 mb-2">
                  الميزات المتاحة الآن:
                </h5>
                <ul className="list-disc list-inside space-y-1 text-sm text-blue-700">
                  <li>رفع الفيديوهات مباشرة من النظام</li>
                  <li>إدارة عنوان ووصف الفيديو</li>
                  <li>إضافة علامات (tags) للفيديو</li>
                  <li>تحديد حالة الخصوصية (عام/خاص/غير مدرج)</li>
                  <li>جدولة النشر</li>
                  <li>متابعة إحصائيات الفيديوهات</li>
                </ul>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setStep(1)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  رجوع
                </button>
                <button
                  onClick={handleComplete}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  تم الانتهاء
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default YouTubeQuickSetup;
