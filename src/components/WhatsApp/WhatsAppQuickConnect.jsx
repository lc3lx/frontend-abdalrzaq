import { useState } from "react";
import { FaWhatsapp, FaPlus, FaCheck, FaInfoCircle } from "react-icons/fa";
import WhatsAppQuickSetup from "./WhatsAppQuickSetup";

const WhatsAppQuickConnect = ({ onWhatsAppConnected }) => {
  const [showQuickSetup, setShowQuickSetup] = useState(false);

  return (
    <>
      <div className="bg-gradient-to-r from-green-50 to-green-100 border border-green-200 rounded-lg p-6 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <FaWhatsapp className="text-green-500 text-3xl mr-4" />
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-1">
                إعداد سريع للواتساب
              </h3>
              <p className="text-gray-600 text-sm">
                يمكنك إعداد الرد التلقائي للواتساب باستخدام WhatsApp Business
                API
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowQuickSetup(true)}
            className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 flex items-center transition-colors"
          >
            <FaPlus className="mr-2" />
            إعداد سريع
          </button>
        </div>

        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="flex items-center text-gray-600">
            <FaCheck className="text-green-500 mr-2" />
            <span>WhatsApp Business API</span>
          </div>
          <div className="flex items-center text-gray-600">
            <FaCheck className="text-green-500 mr-2" />
            <span>ردود تلقائية ذكية</span>
          </div>
          <div className="flex items-center text-gray-600">
            <FaCheck className="text-green-500 mr-2" />
            <span>دعم الصور والملفات</span>
          </div>
        </div>

        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
          <div className="flex items-start">
            <FaInfoCircle className="text-blue-500 text-sm mr-2 mt-1" />
            <div className="text-xs text-blue-700">
              <strong>ملاحظة:</strong> ستحتاج إلى إعداد تطبيق Facebook وتفعيل
              WhatsApp Business API. يمكنك الحصول على هذه المعلومات من Facebook
              Developers Console.
            </div>
          </div>
        </div>
      </div>

      {showQuickSetup && (
        <WhatsAppQuickSetup
          onClose={() => setShowQuickSetup(false)}
          onSuccess={() => {
            setShowQuickSetup(false);
            onWhatsAppConnected();
          }}
        />
      )}
    </>
  );
};

export default WhatsAppQuickConnect;
