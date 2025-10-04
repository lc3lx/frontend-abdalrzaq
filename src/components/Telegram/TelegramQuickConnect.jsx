import { useState } from "react";
import { FaTelegram, FaPlus, FaCheck } from "react-icons/fa";
import QuickTelegramSetup from "./QuickTelegramSetup";

const TelegramQuickConnect = ({ onTelegramConnected }) => {
  const [showQuickSetup, setShowQuickSetup] = useState(false);

  return (
    <>
      <div className="bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-6 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <FaTelegram className="text-blue-500 text-3xl mr-4" />
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-1">
                إعداد سريع للتلغرام
              </h3>
              <p className="text-gray-600 text-sm">
                يمكنك إعداد الرد التلقائي للتلغرام مباشرة دون الحاجة لربط الحساب مسبقاً
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowQuickSetup(true)}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 flex items-center transition-colors"
          >
            <FaPlus className="mr-2" />
            إعداد سريع
          </button>
        </div>
        
        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="flex items-center text-gray-600">
            <FaCheck className="text-green-500 mr-2" />
            <span>إعداد البوت مباشرة</span>
          </div>
          <div className="flex items-center text-gray-600">
            <FaCheck className="text-green-500 mr-2" />
            <span>ربط تلقائي</span>
          </div>
          <div className="flex items-center text-gray-600">
            <FaCheck className="text-green-500 mr-2" />
            <span>بدء الرد التلقائي فوراً</span>
          </div>
        </div>
      </div>

      {showQuickSetup && (
        <QuickTelegramSetup
          onClose={() => setShowQuickSetup(false)}
          onSuccess={() => {
            setShowQuickSetup(false);
            onTelegramConnected();
          }}
        />
      )}
    </>
  );
};

export default TelegramQuickConnect;
