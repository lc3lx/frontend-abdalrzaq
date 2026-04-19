import { useState } from "react";
import { useSocialAccounts } from "../hooks/useSocialAccounts";
import SubscriptionCheck from "../components/SubscriptionCheck";
import TelegramSetup from "../components/Telegram/TelegramSetup";
import WhatsAppQuickSetup from "../components/WhatsApp/WhatsAppQuickSetup";
import TikTokQuickSetup from "../components/TikTok/TikTokQuickSetup";
import YouTubeQuickSetup from "../components/YouTube/YouTubeQuickSetup";
import {
  FaTwitter,
  FaFacebook,
  FaInstagram,
  FaLinkedin,
  FaTelegram,
  FaWhatsapp,
} from "react-icons/fa";
import { FaTiktok, FaYoutube } from "react-icons/fa";

const IntegrationsPage = () => {
  const { connectedAccounts, isLoading, connectAccount, disconnectAccount } =
    useSocialAccounts();
  const [showTelegramSetup, setShowTelegramSetup] = useState(false);
  const [showWhatsAppSetup, setShowWhatsAppSetup] = useState(false);
  const [showTikTokSetup, setShowTikTokSetup] = useState(false);
  const [showYouTubeSetup, setShowYouTubeSetup] = useState(false);

  const platforms = [
    {
      name: "Twitter",
      icon: FaTwitter,
      color: "text-blue-400",
      bgColor: "bg-blue-400",
      serviceType: "twitter",
    },
    {
      name: "Facebook",
      icon: FaFacebook,
      color: "text-blue-600",
      bgColor: "bg-blue-600",
      serviceType: "facebook",
    },
    {
      name: "Instagram",
      icon: FaInstagram,
      color: "text-pink-500",
      bgColor: "bg-pink-500",
      serviceType: "instagram",
    },
    {
      name: "LinkedIn",
      icon: FaLinkedin,
      color: "text-blue-700",
      bgColor: "bg-blue-700",
      serviceType: "linkedin",
    },
    {
      name: "Telegram",
      icon: FaTelegram,
      color: "text-blue-500",
      bgColor: "bg-blue-500",
      serviceType: "telegram",
    },
    {
      name: "WhatsApp",
      icon: FaWhatsapp,
      color: "text-green-500",
      bgColor: "bg-green-500",
      serviceType: "whatsapp",
    },
    {
      name: "TikTok",
      icon: FaTiktok,
      color: "text-black",
      bgColor: "bg-black",
      serviceType: "tiktok",
    },
    {
      name: "YouTube",
      icon: FaYoutube,
      color: "text-red-600",
      bgColor: "bg-red-600",
      serviceType: "youtube",
    },
  ];

  const handleConnect = async (platform) => {
    if (platform === "Telegram") {
      setShowTelegramSetup(true);
      return;
    }

    if (platform === "WhatsApp") {
      setShowWhatsAppSetup(true);
      return;
    }

    if (platform === "TikTok") {
      setShowTikTokSetup(true);
      return;
    }

    if (platform === "YouTube") {
      setShowYouTubeSetup(true);
      return;
    }

    try {
      await connectAccount(platform);
    } catch (error) {
      alert(
        `Error connecting ${platform}: ${
          error.response?.data?.error || "Unknown error"
        }`
      );
    }
  };

  const handleDisconnect = async (platform) => {
    try {
      await disconnectAccount(platform);
    } catch (error) {
      alert(
        `Error disconnecting ${platform}: ${
          error.response?.data?.error || "Unknown error"
        }`
      );
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-white">Integrations</h2>
      </div>
      {isLoading && <p className="text-white/60 text-center text-lg">Loading...</p>}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {platforms.map(({ name, icon: Icon, color, bgColor, serviceType }) => {
          const isConnected = connectedAccounts.some(
            (acc) => acc.platform === name
          );

          return (
            <SubscriptionCheck key={name} serviceType={serviceType}>
              <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-6 rounded-2xl shadow-xl flex items-center justify-between hover:bg-white/20 transition-all duration-300">
                <div className="flex items-center">
                  <div className="w-14 h-14 bg-white/5 rounded-xl border border-white/10 flex items-center justify-center mr-4">
                    <Icon className={`${color} text-3xl`} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">
                      {name}
                    </h3>
                    {isConnected ? (
                      <p className="text-green-400 text-sm font-medium mt-1">
                        Connected as{" "}
                        {
                          connectedAccounts.find((acc) => acc.platform === name)
                            .displayName
                        }
                      </p>
                    ) : (
                      <p className="text-white/50 text-sm font-medium mt-1">Not connected</p>
                    )}
                  </div>
                </div>
                {isConnected ? (
                  <button
                    onClick={() => handleDisconnect(name)}
                    className="bg-red-500/10 text-red-400 border border-red-500/30 px-5 py-2.5 rounded-xl font-bold hover:bg-red-500 hover:text-white transition-all shadow-lg"
                    disabled={isLoading}
                  >
                    Disconnect
                  </button>
                ) : (
                  <button
                    onClick={() => handleConnect(name)}
                    className={`${bgColor} text-white px-5 py-2.5 rounded-xl font-bold hover:opacity-80 transition-transform duration-300 transform hover:scale-105 shadow-lg`}
                    disabled={isLoading}
                  >
                    Connect
                  </button>
                )}
              </div>
            </SubscriptionCheck>
          );
        })}
      </div>

      {showTelegramSetup && (
        <TelegramSetup onClose={() => setShowTelegramSetup(false)} />
      )}

      {showWhatsAppSetup && (
        <WhatsAppQuickSetup
          onClose={() => setShowWhatsAppSetup(false)}
          onSuccess={() => {
            setShowWhatsAppSetup(false);
            // Refresh accounts list
            window.location.reload();
          }}
        />
      )}

      {showTikTokSetup && (
        <TikTokQuickSetup
          onClose={() => setShowTikTokSetup(false)}
          onSuccess={() => {
            setShowTikTokSetup(false);
            // Refresh accounts list
            window.location.reload();
          }}
        />
      )}

      {showYouTubeSetup && (
        <YouTubeQuickSetup
          onClose={() => setShowYouTubeSetup(false)}
          onSuccess={() => {
            setShowYouTubeSetup(false);
            // Refresh accounts list
            window.location.reload();
          }}
        />
      )}
    </div>
  );
};

export default IntegrationsPage;
