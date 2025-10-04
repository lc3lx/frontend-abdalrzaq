import { useState } from "react";
import { FaTelegram, FaCheck, FaTimes, FaInfoCircle, FaCog } from "react-icons/fa";
import axios from "axios";

const QuickTelegramSetup = ({ onClose, onSuccess }) => {
  const [step, setStep] = useState(1);
  const [botToken, setBotToken] = useState("");
  const [botUsername, setBotUsername] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [connectionUrl, setConnectionUrl] = useState("");

  const handleSetup = async () => {
    if (!botToken || !botUsername) {
      alert("يرجى إدخال معلومات البوت");
      return;
    }

    try {
      setIsLoading(true);
      const token = localStorage.getItem("token");
      
      const response = await axios.post(
        "http://localhost:5000/api/telegram/quick-setup",
        { botToken, botUsername },
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );

      if (response.data.success) {
        setStep(2);
        // Get connection URL
        const urlResponse = await axios.get(
          "http://localhost:5000/api/telegram/connection-url",
          {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true,
          }
        );
        setConnectionUrl(urlResponse.data.connectionUrl);
      }
    } catch (error) {
      alert(`خطأ في إعداد البوت: ${error.response?.data?.error || "خطأ غير معروف"}`);
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
              <FaTelegram className="text-blue-500 text-2xl mr-3" />
              <h2 className="text-2xl font-bold text-gray-800">
                إعداد سريع للتلغرام
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
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-start">
                  <FaInfoCircle className="text-blue-500 text-lg mr-2 mt-1" />
                  <div>
                    <h4 className="font-semibold text-blue-800 mb-2">
                      إعداد سريع - 3 خطوات فقط!
                    </h4>
                    <p className="text-blue-700 text-sm">
                      يمكنك الآن إعداد الرد التلقائي للتلغرام مباشرة دون الحاجة لربط الحساب مسبقاً
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bot Token
                  </label>
                  <input
                    type="text"
                    value={botToken}
                    onChange={(e) => setBotToken(e.target.value)}
                    placeholder="123456789:ABCdefGHIjklMNOpqrsTUVwxyz"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    احصل على هذا من @BotFather في التلغرام
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bot Username
                  </label>
                  <input
                    type="text"
                    value={botUsername}
                    onChange={(e) => setBotUsername(e.target.value)}
                    placeholder="my_auto_reply_bot"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    اسم المستخدم للبوت (بدون @)
                  </p>
                </div>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={onClose}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  إلغاء
                </button>
                <button
                  onClick={handleSetup}
                  disabled={isLoading || !botToken || !botUsername}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  {isLoading ? (
                    <>
                      <FaCog className="mr-2 animate-spin" />
                      جاري الإعداد...
                    </>
                  ) : (
                    <>
                      <FaCheck className="mr-2" />
                      إعداد البوت
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
                    تم إعداد البوت بنجاح!
                  </h4>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    رابط البوت
                  </label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={connectionUrl}
                      readOnly
                      className="flex-1 p-3 border border-gray-300 rounded-lg bg-gray-50"
                    />
                    <button
                      onClick={() => navigator.clipboard.writeText(connectionUrl)}
                      className="px-3 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                    >
                      نسخ
                    </button>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h5 className="font-semibold text-gray-800 mb-2">
                    خطوات الربط:
                  </h5>
                  <ol className="list-decimal list-inside space-y-1 text-sm text-gray-700">
                    <li>اضغط على الرابط أعلاه</li>
                    <li>ابدأ محادثة مع البوت</li>
                    <li>أرسل /start</li>
                    <li>البوت سيربط نفسه تلقائياً بحسابك</li>
                  </ol>
                </div>
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
                  className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
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

export default QuickTelegramSetup;
