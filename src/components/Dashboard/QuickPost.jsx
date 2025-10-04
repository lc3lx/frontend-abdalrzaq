import { useState } from "react";
import { FaRocket, FaCheckCircle } from "react-icons/fa";

const QuickPost = ({
  connectedAccounts,
  selectedPlatforms,
  setSelectedPlatforms,
  isPosting,
}) => {
  const [showSuccess, setShowSuccess] = useState(false);

  const handleQuickSelect = () => {
    const connectedPlatforms = connectedAccounts.map((acc) => acc.platform);
    setSelectedPlatforms(connectedPlatforms);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 2000);
  };

  if (connectedAccounts.length === 0) {
    return (
      <div className="bg-gray-50 p-4 rounded-lg border-2 border-dashed border-gray-300">
        <div className="flex items-center justify-center text-gray-500">
          <FaRocket className="mr-2" />
          <span>Connect social media accounts to enable quick posting</span>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={handleQuickSelect}
        className="bg-green-600 text-white px-6 py-3 rounded-full hover:bg-green-700 transition-all duration-300 transform hover:scale-105 disabled:bg-gray-400 flex items-center gap-2 w-full justify-center"
        disabled={connectedAccounts.length === 0 || isPosting}
      >
        <FaRocket className="text-lg" />
        <span>Quick Post to All ({connectedAccounts.length} platforms)</span>
      </button>

      {showSuccess && (
        <div className="absolute top-0 left-0 right-0 bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded-lg flex items-center gap-2 animate-pulse">
          <FaCheckCircle />
          <span>Selected all {connectedAccounts.length} platforms!</span>
        </div>
      )}
    </div>
  );
};

export default QuickPost;
