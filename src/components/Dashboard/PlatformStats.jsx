import {
  FaTwitter,
  FaFacebook,
  FaInstagram,
  FaLinkedin,
  FaCheckCircle,
  FaCircle,
} from "react-icons/fa";

const PlatformStats = ({ connectedAccounts, selectedPlatforms }) => {
  const getPlatformIcon = (platform) => {
    switch (platform) {
      case "Twitter":
        return <FaTwitter className="text-blue-400" />;
      case "Facebook":
        return <FaFacebook className="text-blue-600" />;
      case "Instagram":
        return <FaInstagram className="text-pink-500" />;
      case "LinkedIn":
        return <FaLinkedin className="text-blue-700" />;
      default:
        return <FaCircle className="text-gray-400" />;
    }
  };

  return (
    <div className="bg-gradient-to-r from-blue-50 to-green-50 p-4 rounded-lg border border-blue-200">
      <div className="flex justify-between items-center mb-3">
        <h4 className="text-sm font-semibold text-gray-700">Platform Status</h4>
        <div className="text-xs text-gray-500">
          {selectedPlatforms.length} of {connectedAccounts.length} selected
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {connectedAccounts.map((account) => (
          <div
            key={account.platform}
            className={`flex items-center gap-2 p-2 rounded ${
              selectedPlatforms.includes(account.platform)
                ? "bg-green-100 border border-green-300"
                : "bg-gray-100 border border-gray-300"
            }`}
          >
            {getPlatformIcon(account.platform)}
            <span className="text-xs font-medium text-gray-700">
              {account.platform}
            </span>
            {selectedPlatforms.includes(account.platform) ? (
              <FaCheckCircle className="text-green-500 text-xs ml-auto" />
            ) : (
              <FaCircle className="text-gray-400 text-xs ml-auto" />
            )}
          </div>
        ))}
      </div>

      {connectedAccounts.length === 0 && (
        <div className="text-center py-4">
          <p className="text-sm text-gray-500">No platforms connected</p>
          <p className="text-xs text-gray-400 mt-1">
            Connect your social media accounts to start posting
          </p>
        </div>
      )}
    </div>
  );
};

export default PlatformStats;
