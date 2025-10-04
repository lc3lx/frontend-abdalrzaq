import { useState } from "react";
import {
  FaWhatsapp,
  FaCheck,
  FaTimes,
  FaInfoCircle,
  FaCog,
  FaExternalLinkAlt,
} from "react-icons/fa";
import axios from "axios";

const WhatsAppQuickSetup = ({ onClose, onSuccess }) => {
  const [step, setStep] = useState(1);
  const [phoneNumberId, setPhoneNumberId] = useState("");
  const [accessToken, setAccessToken] = useState("");
  const [verifyToken, setVerifyToken] = useState("");
  const [webhookUrl, setWebhookUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [testPhoneNumber, setTestPhoneNumber] = useState("");
  const [testMessage, setTestMessage] = useState("");

  const handleSetup = async () => {
    if (!phoneNumberId || !accessToken || !verifyToken) {
      alert("يرجى إدخال جميع المعلومات المطلوبة");
      return;
    }

    try {
      setIsLoading(true);
      const token = localStorage.getItem("token");

      const response = await axios.post(
        "http://localhost:5000/api/whatsapp/quick-setup",
        {
          phoneNumberId,
          accessToken,
          verifyToken,
          webhookUrl:
            webhookUrl || `${window.location.origin}/api/whatsapp/webhook`,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );

      if (response.data.success) {
        setStep(2);
        setWebhookUrl(response.data.webhookUrl);
      }
    } catch (error) {
      alert(
        `خطأ في إعداد الواتساب: ${
          error.response?.data?.error || "خطأ غير معروف"
        }`
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleTestMessage = async () => {
    if (!testPhoneNumber || !testMessage) {
      alert("يرجى إدخال رقم الهاتف والرسالة");
      return;
    }

    try {
      setIsLoading(true);
      const token = localStorage.getItem("token");

      const response = await axios.post(
        "http://localhost:5000/api/whatsapp/test-message",
        { phoneNumber: testPhoneNumber, message: testMessage },
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );

      if (response.data.success) {
        alert("تم إرسال الرسالة التجريبية بنجاح!");
      }
    } catch (error) {
      alert(
        `خطأ في إرسال الرسالة: ${
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
      <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <FaWhatsapp className="text-green-500 text-2xl mr-3" />
              <h2 className="text-2xl font-bold text-gray-800">
                إعداد سريع للواتساب
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
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="flex items-start">
                  <FaInfoCircle className="text-green-500 text-lg mr-2 mt-1" />
                  <div>
                    <h4 className="font-semibold text-green-800 mb-2">
                      إعداد WhatsApp Business API
                    </h4>
                    <p className="text-green-700 text-sm">
                      ستحتاج إلى إعداد تطبيق Facebook وتفعيل WhatsApp Business
                      API
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number ID
                  </label>
                  <input
                    type="text"
                    value={phoneNumberId}
                    onChange={(e) => setPhoneNumberId(e.target.value)}
                    placeholder="123456789012345"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    من Facebook Developers Console
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Access Token
                  </label>
                  <input
                    type="password"
                    value={accessToken}
                    onChange={(e) => setAccessToken(e.target.value)}
                    placeholder="EAAxxxxxxxxxxxxx"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    من إعدادات التطبيق
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Verify Token
                  </label>
                  <input
                    type="text"
                    value={verifyToken}
                    onChange={(e) => setVerifyToken(e.target.value)}
                    placeholder="my_verify_token_123"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    أي نص تريده للتحقق
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Webhook URL (اختياري)
                  </label>
                  <input
                    type="url"
                    value={webhookUrl}
                    onChange={(e) => setWebhookUrl(e.target.value)}
                    placeholder="https://yourdomain.com/api/whatsapp/webhook"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    سيتم إنشاؤه تلقائياً إذا لم تدخله
                  </p>
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <h5 className="font-semibold text-blue-800 mb-2">
                  خطوات الحصول على المعلومات:
                </h5>
                <ol className="list-decimal list-inside space-y-1 text-sm text-blue-700">
                  <li>
                    اذهب إلى{" "}
                    <a
                      href="https://developers.facebook.com"
                      target="_blank"
                      className="text-blue-600 hover:underline"
                    >
                      Facebook Developers
                    </a>
                  </li>
                  <li>أنشئ تطبيق جديد أو استخدم تطبيق موجود</li>
                  <li>أضف WhatsApp Business API</li>
                  <li>احصل على Phone Number ID و Access Token</li>
                  <li>أنشئ Verify Token (أي نص تريده)</li>
                </ol>
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
                  disabled={
                    isLoading || !phoneNumberId || !accessToken || !verifyToken
                  }
                  className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  {isLoading ? (
                    <>
                      <FaCog className="mr-2 animate-spin" />
                      جاري الإعداد...
                    </>
                  ) : (
                    <>
                      <FaCheck className="mr-2" />
                      إعداد الواتساب
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
                    تم إعداد الواتساب بنجاح!
                  </h4>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Webhook URL
                  </label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={webhookUrl}
                      readOnly
                      className="flex-1 p-3 border border-gray-300 rounded-lg bg-gray-50"
                    />
                    <button
                      onClick={() => navigator.clipboard.writeText(webhookUrl)}
                      className="px-3 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                    >
                      نسخ
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    أضف هذا الرابط في إعدادات Webhook في Facebook Developers
                    Console
                  </p>
                </div>

                <div className="bg-yellow-50 p-4 rounded-lg">
                  <h5 className="font-semibold text-yellow-800 mb-2">
                    خطوات إكمال الإعداد:
                  </h5>
                  <ol className="list-decimal list-inside space-y-1 text-sm text-yellow-700">
                    <li>انسخ Webhook URL أعلاه</li>
                    <li>اذهب إلى Facebook Developers Console</li>
                    <li>أضف Webhook URL في إعدادات التطبيق</li>
                    <li>استخدم Verify Token الذي أدخلته</li>
                    <li>فعّل Webhook</li>
                  </ol>
                </div>

                <div className="border-t pt-4">
                  <h5 className="font-semibold text-gray-800 mb-3">
                    اختبار الإعداد:
                  </h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        رقم الهاتف للاختبار
                      </label>
                      <input
                        type="tel"
                        value={testPhoneNumber}
                        onChange={(e) => setTestPhoneNumber(e.target.value)}
                        placeholder="+1234567890"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        الرسالة التجريبية
                      </label>
                      <input
                        type="text"
                        value={testMessage}
                        onChange={(e) => setTestMessage(e.target.value)}
                        placeholder="مرحباً! هذا اختبار"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      />
                    </div>
                  </div>
                  <button
                    onClick={handleTestMessage}
                    disabled={isLoading || !testPhoneNumber || !testMessage}
                    className="mt-3 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                  >
                    {isLoading ? (
                      <>
                        <FaCog className="mr-2 animate-spin" />
                        جاري الإرسال...
                      </>
                    ) : (
                      <>
                        <FaExternalLinkAlt className="mr-2" />
                        إرسال رسالة تجريبية
                      </>
                    )}
                  </button>
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

export default WhatsAppQuickSetup;
