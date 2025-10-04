import { useState } from "react";
import {
  FaTiktok,
  FaCheck,
  FaTimes,
  FaInfoCircle,
  FaCog,
  FaExternalLinkAlt,
} from "react-icons/fa";
import axios from "axios";

const TikTokQuickSetup = ({ onClose, onSuccess }) => {
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const handleConnect = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("token");

      const response = await axios.get(
        "http://localhost:5000/api/tiktok/auth",
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );

      if (response.data.url) {
        // Open TikTok auth in popup
        const popup = window.open(
          response.data.url,
          "tiktok-auth",
          "width=600,height=700,scrollbars=yes,resizable=yes"
        );

        // Listen for auth completion
        const messageListener = (event) => {
          if (event.data.type === "AUTH_COMPLETE") {
            popup.close();
            window.removeEventListener("message", messageListener);
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
        `خطأ في الاتصال بـ TikTok: ${
          error.response?.data?.error || "خطأ غير معروف"
        }`
      );
    } finally {
      setIsLoading(false);
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
              <FaTiktok className="text-black text-2xl mr-3" />
              <h2 className="text-2xl font-bold text-gray-800">إعداد TikTok</h2>
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
              <div className="bg-black bg-opacity-5 p-4 rounded-lg">
                <div className="flex items-start">
                  <FaInfoCircle className="text-black text-lg mr-2 mt-1" />
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">
                      إعداد TikTok Business API
                    </h4>
                    <p className="text-gray-700 text-sm">
                      ستحتاج إلى إنشاء تطبيق TikTok Business والحصول على إذن
                      النشر
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <h5 className="font-semibold text-blue-800 mb-2">
                  خطوات الحصول على TikTok Business API:
                </h5>
                <ol className="list-decimal list-inside space-y-1 text-sm text-blue-700">
                  <li>
                    اذهب إلى{" "}
                    <a
                      href="https://developers.tiktok.com"
                      target="_blank"
                      className="text-blue-600 hover:underline"
                    >
                      TikTok for Developers
                    </a>
                  </li>
                  <li>أنشئ حساب TikTok Business</li>
                  <li>أنشئ تطبيق جديد</li>
                  <li>أضف TikTok for Business API</li>
                  <li>احصل على Client Key و Client Secret</li>
                  <li>
                    أضف Redirect URI: http://localhost:5000/api/tiktok/callback
                  </li>
                </ol>
              </div>

              <div className="bg-yellow-50 p-4 rounded-lg">
                <h5 className="font-semibold text-yellow-800 mb-2">
                  متطلبات البيئة:
                </h5>
                <ul className="list-disc list-inside space-y-1 text-sm text-yellow-700">
                  <li>تأكد من إضافة متغيرات البيئة في ملف .env</li>
                  <li>TIKTOK_CLIENT_KEY: مفتاح التطبيق</li>
                  <li>TIKTOK_CLIENT_SECRET: سر التطبيق</li>
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
                  className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  {isLoading ? (
                    <>
                      <FaCog className="mr-2 animate-spin" />
                      جاري الاتصال...
                    </>
                  ) : (
                    <>
                      <FaExternalLinkAlt className="mr-2" />
                      الاتصال بـ TikTok
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
                    تم الاتصال بـ TikTok بنجاح!
                  </h4>
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <h5 className="font-semibold text-blue-800 mb-2">
                  الميزات المتاحة:
                </h5>
                <ul className="list-disc list-inside space-y-1 text-sm text-blue-700">
                  <li>نشر فيديوهات على TikTok</li>
                  <li>جدولة المنشورات</li>
                  <li>إدارة المحتوى</li>
                  <li>متابعة الإحصائيات</li>
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
                  className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800"
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

export default TikTokQuickSetup;
