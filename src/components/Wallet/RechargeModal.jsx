import { useState } from "react";
import PropTypes from "prop-types";
import {
  FaTimes,
  FaCreditCard,
  FaWallet,
  FaCoins,
  FaCheck,
} from "react-icons/fa";
import axios from "axios";

const RechargeModal = ({ isOpen, onClose, onRechargeSuccess }) => {
  const [selectedMethod, setSelectedMethod] = useState("sham_cash");
  const [amount, setAmount] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [usdtAddress, setUsdtAddress] = useState("");

  const paymentMethods = [
    {
      id: "sham_cash",
      name: "شام كاش",
      description: "طلب شحن يدوي - يحتاج موافقة الإدارة",
      icon: FaWallet,
      color: "blue",
    },
    {
      id: "payeer",
      name: "Payeer",
      description: "شحن فوري عبر Payeer",
      icon: FaCreditCard,
      color: "green",
    },
    {
      id: "usdt",
      name: "USDT TRC20",
      description: "شحن فوري عبر USDT",
      icon: FaCoins,
      color: "purple",
    },
  ];

  const handleAmountChange = (value) => {
    const numericValue = value.replace(/[^0-9.]/g, "");
    setAmount(numericValue);
    setError("");
  };

  const validateAmount = () => {
    const numAmount = parseFloat(amount);

    if (!amount || isNaN(numAmount) || numAmount <= 0) {
      setError("يرجى إدخال مبلغ صحيح");
      return false;
    }

    return true;
  };

  const handleRecharge = async () => {
    if (!validateAmount()) return;

    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:5000/api/wallet/recharge",
        {
          method: selectedMethod,
          amount: parseFloat(amount),
        },
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );

      if (selectedMethod === "sham_cash") {
        setSuccess("تم إرسال طلب الشحن بنجاح. سيتم مراجعته من قبل الإدارة.");
        setTimeout(() => {
          onRechargeSuccess();
          onClose();
        }, 2000);
      } else if (selectedMethod === "payeer") {
        // توجيه إلى صفحة Payeer
        window.open(response.data.paymentUrl, "_blank");
        setSuccess("تم توجيهك إلى صفحة الدفع. يرجى إكمال العملية.");
      } else if (selectedMethod === "usdt") {
        setUsdtAddress(response.data.address);
        setSuccess(
          `يرجى إرسال $${response.data.amount} USDT إلى العنوان أدناه`
        );
      }
    } catch (err) {
      console.error("Error creating recharge:", err);
      setError(err.response?.data?.error || "فشل في إنشاء طلب الشحن");
    } finally {
      setIsLoading(false);
    }
  };

  const getMethodColor = (color) => {
    const colors = {
      blue: "border-blue-500 bg-blue-50 text-blue-700",
      green: "border-green-500 bg-green-50 text-green-700",
      purple: "border-purple-500 bg-purple-50 text-purple-700",
    };
    return colors[color] || colors.blue;
  };

  const resetForm = () => {
    setAmount("");
    setError("");
    setSuccess("");
    setUsdtAddress("");
    setSelectedMethod("sham_cash");
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
          <h2 className="text-xl font-bold text-gray-800">شحن المحفظة</h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <FaTimes className="text-xl" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Payment Methods */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              اختر طريقة الشحن
            </h3>
            <div className="space-y-3">
              {paymentMethods.map((method) => {
                const Icon = method.icon;
                return (
                  <button
                    key={method.id}
                    onClick={() => setSelectedMethod(method.id)}
                    className={`w-full p-4 rounded-lg border-2 transition-all ${
                      selectedMethod === method.id
                        ? getMethodColor(method.color)
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <Icon className="text-2xl" />
                      <div className="text-right">
                        <h4 className="font-semibold">{method.name}</h4>
                        <p className="text-sm text-gray-600">
                          {method.description}
                        </p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Amount Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              المبلغ (دولار أمريكي)
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500 sm:text-sm">$</span>
              </div>
              <input
                type="text"
                value={amount}
                onChange={(e) => handleAmountChange(e.target.value)}
                placeholder="0.00"
                className="w-full pl-7 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                dir="ltr"
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              لا يوجد حد أدنى أو أقصى للشحن
            </p>
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

          {/* USDT Address Display */}
          {selectedMethod === "usdt" && success && usdtAddress && (
            <div className="bg-gray-100 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">عنوان USDT:</h4>
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={usdtAddress}
                  readOnly
                  className="flex-1 px-3 py-2 bg-white border rounded text-sm font-mono"
                />
                <button
                  onClick={() => navigator.clipboard.writeText(usdtAddress)}
                  className="px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                >
                  نسخ
                </button>
              </div>
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
            onClick={handleRecharge}
            disabled={isLoading || !amount}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>جاري المعالجة...</span>
              </>
            ) : (
              <>
                <FaCheck />
                <span>شحن المحفظة</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

RechargeModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onRechargeSuccess: PropTypes.func.isRequired,
};

export default RechargeModal;
