import { useState } from "react";
import { FaCreditCard } from "react-icons/fa";

const CreditCard = ({
  card,
  isFlipped = false,
  onClick,
  isSelected = false,
  showBack = false,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const getCardIcon = (cardType) => {
    return <FaCreditCard className="text-2xl text-white" />;
  };

  const getCardGradient = (cardType) => {
    switch (cardType) {
      case "visa":
        return "from-blue-600 via-blue-700 to-blue-800";
      case "mastercard":
        return "from-red-500 via-red-600 to-red-700";
      case "amex":
        return "from-green-500 via-green-600 to-green-700";
      case "discover":
        return "from-orange-500 via-orange-600 to-orange-700";
      default:
        return "from-gray-600 via-gray-700 to-gray-800";
    }
  };

  const formatCardNumber = (cardNumber) => {
    if (!cardNumber) return "**** **** **** ****";
    const cleaned = cardNumber.replace(/\s/g, "");
    const masked = cleaned.slice(0, -4).replace(/\d/g, "•") + cleaned.slice(-4);
    return masked.replace(/(.{4})/g, "$1 ").trim();
  };

  const formatExpiry = (month, year) => {
    if (!month || !year) return "MM/YY";
    return `${month.toString().padStart(2, "0")}/${year.toString().slice(-2)}`;
  };

  return (
    <div
      className={`relative w-80 h-48 cursor-pointer transition-all duration-500 transform ${
        isHovered ? "scale-105" : "scale-100"
      } ${isSelected ? "ring-4 ring-blue-300 ring-opacity-50" : ""}`}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ perspective: "1000px" }}
    >
      {/* Card Container */}
      <div
        className={`relative w-full h-full rounded-2xl shadow-2xl transition-transform duration-700 ${
          isFlipped ? "rotate-y-180" : ""
        }`}
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Front of Card */}
        <div
          className={`absolute inset-0 w-full h-full rounded-2xl bg-gradient-to-br ${getCardGradient(
            card?.cardType
          )} p-6 text-white overflow-hidden`}
          style={{ backfaceVisibility: "hidden" }}
        >
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-4 right-4 w-20 h-20 rounded-full bg-white opacity-20"></div>
            <div className="absolute bottom-4 left-4 w-16 h-16 rounded-full bg-white opacity-10"></div>
            <div className="absolute top-1/2 right-8 w-12 h-12 rounded-full bg-white opacity-15"></div>
          </div>

          {/* Card Content */}
          <div className="relative z-10 h-full flex flex-col justify-between">
            {/* Top Section */}
            <div className="flex justify-between items-start">
              <div className="text-2xl font-bold">Smart Social</div>
              <div className="text-right">{getCardIcon(card?.cardType)}</div>
            </div>

            {/* Middle Section */}
            <div className="space-y-4">
              {/* Card Number */}
              <div className="text-xl font-mono tracking-wider">
                {formatCardNumber(card?.cardNumber)}
              </div>

              {/* Card Holder Name */}
              <div className="text-sm font-medium opacity-90">
                {card?.holderName || "CARD HOLDER"}
              </div>
            </div>

            {/* Bottom Section */}
            <div className="flex justify-between items-end">
              <div className="text-sm opacity-90">
                {formatExpiry(card?.expiryMonth, card?.expiryYear)}
              </div>
              <div className="text-xs opacity-75">
                {card?.isDefault ? "DEFAULT" : ""}
              </div>
            </div>
          </div>

          {/* Shine Effect */}
          <div
            className={`absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 transition-opacity duration-500 ${
              isHovered ? "opacity-20" : ""
            }`}
            style={{
              transform: "translateX(-100%)",
              animation: isHovered ? "shine 1.5s ease-in-out" : "none",
            }}
          ></div>
        </div>

        {/* Back of Card */}
        {showBack && (
          <div
            className={`absolute inset-0 w-full h-full rounded-2xl bg-gradient-to-br ${getCardGradient(
              card?.cardType
            )} p-6 text-white`}
            style={{
              backfaceVisibility: "hidden",
              transform: "rotateY(180deg)",
            }}
          >
            {/* Magnetic Strip */}
            <div className="absolute top-6 left-0 right-0 h-8 bg-black"></div>

            {/* CVV Section */}
            <div className="absolute top-20 right-6 left-6">
              <div className="bg-white h-8 rounded flex items-center justify-end pr-2">
                <span className="text-black font-mono text-sm">
                  {card?.cvv ? "•".repeat(card.cvv.length) : "•••"}
                </span>
              </div>
            </div>

            {/* Signature Panel */}
            <div className="absolute top-32 right-6 left-6">
              <div className="bg-white h-12 rounded flex items-center justify-end pr-2">
                <span className="text-gray-400 text-xs">SIGNATURE</span>
              </div>
            </div>

            {/* Card Info */}
            <div className="absolute bottom-6 left-6 right-6">
              <div className="text-xs opacity-75 text-center">
                This card is property of Smart Social. If found, please return
                to the nearest branch.
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Selection Indicator */}
      {isSelected && (
        <div className="absolute -top-2 -right-2 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center shadow-lg">
          <div className="w-4 h-4 bg-white rounded-full"></div>
        </div>
      )}

      {/* CSS Animation */}
      <style jsx>{`
        @keyframes shine {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
      `}</style>
    </div>
  );
};

export default CreditCard;
