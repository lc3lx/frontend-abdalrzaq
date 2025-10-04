import { useState } from "react";
import { FaTimes, FaCreditCard, FaLock, FaCheck } from "react-icons/fa";
import axios from "axios";

const AddCardModal = ({ isOpen, onClose, onCardAdded }) => {
  const [formData, setFormData] = useState({
    cardNumber: "",
    cardType: "",
    holderName: "",
    expiryMonth: "",
    expiryYear: "",
    cvv: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [step, setStep] = useState(1); // 1: Card Details, 2: Security, 3: Confirmation

  const detectCardType = (cardNumber) => {
    const cleaned = cardNumber.replace(/\s/g, "");

    if (/^4/.test(cleaned)) return "visa";
    if (/^5[1-5]/.test(cleaned)) return "mastercard";
    if (/^3[47]/.test(cleaned)) return "amex";
    if (/^6(?:011|5)/.test(cleaned)) return "discover";

    return "";
  };

  const formatCardNumber = (value) => {
    const cleaned = value.replace(/\s/g, "");
    const formatted = cleaned.replace(/(.{4})/g, "$1 ").trim();
    return formatted.slice(0, 19); // Max 16 digits + 3 spaces
  };

  const handleInputChange = (field, value) => {
    if (field === "cardNumber") {
      const formatted = formatCardNumber(value);
      const cardType = detectCardType(value);
      setFormData((prev) => ({
        ...prev,
        [field]: formatted,
        cardType: cardType,
      }));
    } else if (field === "expiryMonth" || field === "expiryYear") {
      setFormData((prev) => ({
        ...prev,
        [field]: value
          .replace(/\D/g, "")
          .slice(0, field === "expiryMonth" ? 2 : 4),
      }));
    } else if (field === "cvv") {
      setFormData((prev) => ({
        ...prev,
        [field]: value.replace(/\D/g, "").slice(0, 4),
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }));
    }
  };

  const validateForm = () => {
    const { cardNumber, holderName, expiryMonth, expiryYear, cvv } = formData;

    if (!cardNumber || cardNumber.replace(/\s/g, "").length < 13) {
      setError("Please enter a valid card number");
      return false;
    }

    if (!holderName.trim()) {
      setError("Please enter cardholder name");
      return false;
    }

    if (!expiryMonth || !expiryYear) {
      setError("Please enter expiry date");
      return false;
    }

    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1;

    if (
      parseInt(expiryYear) < currentYear ||
      (parseInt(expiryYear) === currentYear &&
        parseInt(expiryMonth) < currentMonth)
    ) {
      setError("Card has expired");
      return false;
    }

    if (!cvv || cvv.length < 3) {
      setError("Please enter a valid CVV");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:5000/api/wallet/cards",
        {
          ...formData,
          cardNumber: formData.cardNumber.replace(/\s/g, ""),
          expiryMonth: parseInt(formData.expiryMonth),
          expiryYear: parseInt(formData.expiryYear),
        },
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );

      onCardAdded(response.data.card);
      onClose();
      resetForm();
    } catch (err) {
      console.error("Error adding card:", err);
      setError(err.response?.data?.error || "Failed to add card");
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      cardNumber: "",
      cardType: "",
      holderName: "",
      expiryMonth: "",
      expiryYear: "",
      cvv: "",
    });
    setError("");
    setStep(1);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <FaCreditCard className="text-blue-600" />
            Add New Card
          </h3>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <FaTimes />
          </button>
        </div>

        {/* Progress Steps */}
        <div className="px-6 py-4">
          <div className="flex items-center justify-center space-x-4">
            {[1, 2, 3].map((stepNumber) => (
              <div key={stepNumber} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    step >= stepNumber
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-500"
                  }`}
                >
                  {step > stepNumber ? <FaCheck /> : stepNumber}
                </div>
                {stepNumber < 3 && (
                  <div
                    className={`w-8 h-0.5 mx-2 ${
                      step > stepNumber ? "bg-blue-600" : "bg-gray-200"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="text-center mt-2">
            <span className="text-sm text-gray-600">
              {step === 1 && "Card Details"}
              {step === 2 && "Security Info"}
              {step === 3 && "Confirmation"}
            </span>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          {error && (
            <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-4 flex items-center gap-2">
              <FaTimes />
              {error}
            </div>
          )}

          {/* Step 1: Card Details */}
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Card Number
                </label>
                <div className="relative">
                  <input
                    type="text"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="1234 5678 9012 3456"
                    value={formData.cardNumber}
                    onChange={(e) =>
                      handleInputChange("cardNumber", e.target.value)
                    }
                    maxLength={19}
                  />
                  {formData.cardType && (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <div className="text-2xl">
                        {formData.cardType === "visa" && "💳"}
                        {formData.cardType === "mastercard" && "💳"}
                        {formData.cardType === "amex" && "💳"}
                        {formData.cardType === "discover" && "💳"}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cardholder Name
                </label>
                <input
                  type="text"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="John Doe"
                  value={formData.holderName}
                  onChange={(e) =>
                    handleInputChange("holderName", e.target.value)
                  }
                />
              </div>

              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Expiry Month
                  </label>
                  <select
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={formData.expiryMonth}
                    onChange={(e) =>
                      handleInputChange("expiryMonth", e.target.value)
                    }
                  >
                    <option value="">MM</option>
                    {Array.from({ length: 12 }, (_, i) => (
                      <option key={i + 1} value={i + 1}>
                        {(i + 1).toString().padStart(2, "0")}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Expiry Year
                  </label>
                  <select
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={formData.expiryYear}
                    onChange={(e) =>
                      handleInputChange("expiryYear", e.target.value)
                    }
                  >
                    <option value="">YYYY</option>
                    {Array.from({ length: 10 }, (_, i) => {
                      const year = new Date().getFullYear() + i;
                      return (
                        <option key={year} value={year}>
                          {year}
                        </option>
                      );
                    })}
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Security Info */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 text-blue-800">
                  <FaLock />
                  <span className="font-medium">Security Information</span>
                </div>
                <p className="text-sm text-blue-700 mt-1">
                  Your card information is encrypted and secure.
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  CVV/CVC
                </label>
                <input
                  type="text"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="123"
                  value={formData.cvv}
                  onChange={(e) => handleInputChange("cvv", e.target.value)}
                  maxLength={4}
                />
                <p className="text-xs text-gray-500 mt-1">
                  3-4 digit security code on the back of your card
                </p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-800 mb-2">Card Preview</h4>
                <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-4 rounded-lg text-white">
                  <div className="flex justify-between items-center mb-4">
                    <span className="font-bold">Smart Social</span>
                    <span className="text-2xl">💳</span>
                  </div>
                  <div className="text-lg font-mono mb-2">
                    {formData.cardNumber || "•••• •••• •••• ••••"}
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>{formData.holderName || "CARD HOLDER"}</span>
                    <span>
                      {formData.expiryMonth && formData.expiryYear
                        ? `${formData.expiryMonth.padStart(
                            2,
                            "0"
                          )}/${formData.expiryYear.slice(-2)}`
                        : "MM/YY"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Confirmation */}
          {step === 3 && (
            <div className="space-y-4">
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaCheck className="text-2xl text-green-600" />
                </div>
                <h4 className="text-lg font-semibold text-gray-800 mb-2">
                  Ready to Add Card
                </h4>
                <p className="text-gray-600">
                  Please review your card information before adding it to your
                  wallet.
                </p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Card Type:</span>
                    <span className="font-medium capitalize">
                      {formData.cardType}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Card Number:</span>
                    <span className="font-mono">
                      {formData.cardNumber.replace(/\d(?=\d{4})/g, "•")}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Cardholder:</span>
                    <span className="font-medium">{formData.holderName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Expiry:</span>
                    <span className="font-medium">
                      {formData.expiryMonth.padStart(2, "0")}/
                      {formData.expiryYear}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-6">
            {step > 1 ? (
              <button
                type="button"
                onClick={() => setStep(step - 1)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Back
              </button>
            ) : (
              <div></div>
            )}

            {step < 3 ? (
              <button
                type="button"
                onClick={() => setStep(step + 1)}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Next
              </button>
            ) : (
              <button
                type="submit"
                disabled={isLoading}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Adding...
                  </>
                ) : (
                  <>
                    <FaCheck />
                    Add Card
                  </>
                )}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCardModal;
