import { useState } from "react";
import {
  FaTelegram,
  FaCheck,
  FaTimes,
  FaInfoCircle,
  FaLink,
} from "react-icons/fa";
import { useSocialAccounts } from "../../hooks/useSocialAccounts";

const TelegramSetup = ({ onClose }) => {
  const [step, setStep] = useState(1);
  const { connectAccount } = useSocialAccounts();

  const handleConnect = async () => {
    try {
      await connectAccount("Telegram");
      onClose();
    } catch (error) {
      alert(
        `خطأ في ربط التلغرام: ${error.response?.data?.error || "خطأ غير معروف"}`
      );
    }
  };

  const steps = [
    {
      title: "إنشاء بوت التلغرام",
      description: "ستحتاج إلى إنشاء بوت تلغرام جديد",
      details: [
        "1. افتح تطبيق التلغرام وابحث عن @BotFather",
        "2. ابدأ محادثة مع BotFather",
        "3. أرسل الأمر /newbot",
        "4. اختر اسماً للبوت (مثل: MyAutoReplyBot)",
        "5. اختر username للبوت (مثل: my_auto_reply_bot)",
        "6. احفظ الـ Token الذي ستحصل عليه",
      ],
    },
    {
      title: "إعداد البوت في النظام",
      description: "أضف معلومات البوت إلى متغيرات البيئة",
      details: [
        "1. افتح ملف .env في مجلد backend",
        "2. أضف السطر التالي:",
        "TELEGRAM_BOT_TOKEN=your_bot_token_here",
        "3. أضف أيضاً:",
        "TELEGRAM_BOT_USERNAME=your_bot_username",
        "4. أعد تشغيل الخادم",
      ],
    },
    {
      title: "ربط البوت بحسابك",
      description: "الآن يمكنك ربط البوت بحسابك",
      details: [
        "1. تأكد من إعداد البوت في الخطوة السابقة",
        "2. اضغط على زر 'ربط التلغرام' أدناه",
        "3. ستفتح نافذة جديدة مع رابط البوت",
        "4. اضغط على الرابط وابدأ محادثة مع البوت",
        "5. أرسل /start للبوت",
        "6. سيتم ربط البوت تلقائياً بحسابك",
      ],
    },
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <FaTelegram className="text-blue-500 text-2xl mr-3" />
              <h2 className="text-2xl font-bold text-gray-800">
                إعداد التلغرام للرد التلقائي
              </h2>
            </div>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <FaTimes className="text-xl" />
            </button>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center justify-center mb-8">
            {steps.map((_, index) => (
              <div key={index} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                    step > index + 1
                      ? "bg-green-500 text-white"
                      : step === index + 1
                      ? "bg-blue-500 text-white"
                      : "bg-gray-300 text-gray-600"
                  }`}
                >
                  {step > index + 1 ? <FaCheck /> : index + 1}
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`w-16 h-1 mx-2 ${
                      step > index + 1 ? "bg-green-500" : "bg-gray-300"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>

          {/* Current Step Content */}
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              {steps[step - 1].title}
            </h3>
            <p className="text-gray-600 mb-4">{steps[step - 1].description}</p>
            <div className="bg-gray-50 p-4 rounded-lg">
              <ul className="space-y-2">
                {steps[step - 1].details.map((detail, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-blue-500 mr-2 mt-1">•</span>
                    <span className="text-gray-700 text-sm">{detail}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex justify-between">
            <button
              onClick={() => setStep(Math.max(1, step - 1))}
              disabled={step === 1}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              السابق
            </button>
            <div className="flex space-x-2">
              {step < steps.length ? (
                <button
                  onClick={() => setStep(step + 1)}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  التالي
                </button>
              ) : (
                <div className="flex space-x-2">
                  <button
                    onClick={handleConnect}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center"
                  >
                    <FaLink className="mr-2" />
                    ربط التلغرام
                  </button>
                  <button
                    onClick={onClose}
                    className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                  >
                    إلغاء
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Help Section */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <div className="flex items-start">
              <FaInfoCircle className="text-blue-500 text-lg mr-2 mt-1" />
              <div>
                <h4 className="font-semibold text-blue-800 mb-1">
                  ملاحظة مهمة
                </h4>
                <p className="text-blue-700 text-sm">
                  بعد إعداد البوت، ستحتاج إلى إعادة تشغيل الخادم (server) حتى
                  يتم تطبيق التغييرات. تأكد من حفظ الـ Token بشكل صحيح.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TelegramSetup;
