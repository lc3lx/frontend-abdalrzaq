import { useState } from "react";
import PropTypes from "prop-types";
import {
  FaTimes,
  FaGift,
  FaEnvelope,
  FaCheck,
  FaDollarSign,
} from "react-icons/fa";
import axios from "axios";

const GiftModal = ({ isOpen, onClose, onGiftSuccess, wallet }) => {
  const [recipientEmail, setRecipientEmail] = useState("");
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleAmountChange = (value) => {
    const numericValue = value.replace(/[^0-9.]/g, "");
    setAmount(numericValue);
    setError("");
  };

  const validateForm = () => {
    if (!recipientEmail) {
      setError("يرجى إدخال إيميل المستلم");
      return false;
    }

    if (!amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
      setError("يرجى إدخال مبلغ صحيح");
      return false;
    }

    if (parseFloat(amount) > (wallet?.balance || 0)) {
      setError("الرصيد غير كافي");
      return false;
    }

    return true;
  };

  const handleGift = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:5000/api/wallet/gift",
        {
          amount: parseFloat(amount),
          recipientEmail,
          message: message || "هدية من صديق",
        },
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );

      setSuccess(
        `تم إرسال $${amount} إلى ${response.data.recipientName} بنجاح!`
      );
      setTimeout(() => {
        onGiftSuccess();
        onClose();
      }, 2000);
    } catch (err) {
      console.error("Error sending gift:", err);
      setError(err.response?.data?.error || "فشل في إرسال الهدية");
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setRecipientEmail("");
    setAmount("");
    setMessage("");
    setError("");
    setSuccess("");
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <FaGift className="text-purple-600" />
            إهداء المال
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <FaTimes className="text-xl" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Recipient Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              إيميل المستلم
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaEnvelope className="text-gray-400" />
              </div>
              <input
                type="email"
                value={recipientEmail}
                onChange={(e) => setRecipientEmail(e.target.value)}
                placeholder="example@email.com"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                dir="ltr"
              />
            </div>
          </div>

          {/* Amount */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              المبلغ (دولار أمريكي)
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaDollarSign className="text-gray-400" />
              </div>
              <input
                type="text"
                value={amount}
                onChange={(e) => handleAmountChange(e.target.value)}
                placeholder="0.00"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                dir="ltr"
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              الرصيد المتاح: ${wallet?.balance?.toFixed(2) || "0.00"}
            </p>
          </div>

          {/* Message */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              رسالة (اختيارية)
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="اكتب رسالة لطيفة..."
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
              {success}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex space-x-3 p-6 border-t">
          <button
            onClick={handleClose}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            إلغاء
          </button>
          <button
            onClick={handleGift}
            disabled={isLoading || !amount || !recipientEmail}
            className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>جاري الإرسال...</span>
              </>
            ) : (
              <>
                <FaGift />
                <span>إرسال الهدية</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

GiftModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onGiftSuccess: PropTypes.func.isRequired,
  wallet: PropTypes.object,
};

export default GiftModal;
