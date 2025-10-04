import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSocialAccounts } from "../hooks/useSocialAccounts";
import SubscriptionCheck from "../components/SubscriptionCheck";
import TelegramSetup from "../components/Telegram/TelegramSetup";
import WhatsAppQuickSetup from "../components/WhatsApp/WhatsAppQuickSetup";
import TikTokQuickSetup from "../components/TikTok/TikTokQuickSetup";
import YouTubeQuickSetup from "../components/YouTube/YouTubeQuickSetup";
import AnimatedCard from "../components/ui/AnimatedCard";
import AnimatedButton from "../components/ui/AnimatedButton";
import SocialPlatformCard from "../components/ui/SocialPlatformCard";

import {
  FaTwitter,
  FaFacebook,
  FaInstagram,
  FaLinkedin,
  FaTelegram,
  FaWhatsapp,
  FaTiktok,
  FaYoutube,
  FaPlug,
  FaCheck,
  FaExclamationTriangle,
  FaRocket,
  FaStar,
  FaShieldAlt,
} from "react-icons/fa";

const IntegrationsPageNew = () => {
  const { connectedAccounts, isLoading, connectAccount, disconnectAccount } =
    useSocialAccounts();
  const [showTelegramSetup, setShowTelegramSetup] = useState(false);
  const [showWhatsAppSetup, setShowWhatsAppSetup] = useState(false);
  const [showTikTokSetup, setShowTikTokSetup] = useState(false);
  const [showYouTubeSetup, setShowYouTubeSetup] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");

  const platforms = [
    {
      name: "Twitter",
      icon: FaTwitter,
      color: "text-blue-400",
      bgColor: "bg-blue-400",
      serviceType: "twitter",
      category: "social",
      description: "منصة التواصل الاجتماعي الأشهر للأخبار والتحديثات",
      features: ["نشر التغريدات", "الرسائل المباشرة", "الرد التلقائي"],
      premium: false,
    },
    {
      name: "Facebook",
      icon: FaFacebook,
      color: "text-blue-600",
      bgColor: "bg-blue-600",
      serviceType: "facebook",
      category: "social",
      description: "أكبر شبكة اجتماعية في العالم",
      features: ["نشر المنشورات", "إدارة الصفحات", "الرسائل"],
      premium: false,
    },
    {
      name: "Instagram",
      icon: FaInstagram,
      color: "text-pink-500",
      bgColor: "bg-pink-500",
      serviceType: "instagram",
      category: "social",
      description: "منصة مشاركة الصور والفيديوهات",
      features: ["نشر الصور", "القصص", "الرسائل المباشرة"],
      premium: false,
    },
    {
      name: "LinkedIn",
      icon: FaLinkedin,
      color: "text-blue-700",
      bgColor: "bg-blue-700",
      serviceType: "linkedin",
      category: "professional",
      description: "الشبكة المهنية الرائدة",
      features: ["المنشورات المهنية", "التواصل", "الشركات"],
      premium: false,
    },
    {
      name: "Telegram",
      icon: FaTelegram,
      color: "text-blue-500",
      bgColor: "bg-blue-500",
      serviceType: "telegram",
      category: "messaging",
      description: "تطبيق المراسلة الآمن والسريع",
      features: ["البوت التلقائي", "القنوات", "المجموعات"],
      premium: false,
      quickSetup: true,
    },
    {
      name: "WhatsApp",
      icon: FaWhatsapp,
      color: "text-green-500",
      bgColor: "bg-green-500",
      serviceType: "whatsapp",
      category: "messaging",
      description: "تطبيق المراسلة الأكثر استخداماً",
      features: ["الرسائل التجارية", "الرد التلقائي", "القوالب"],
      premium: true,
      quickSetup: true,
    },
    {
      name: "TikTok",
      icon: FaTiktok,
      color: "text-gray-900",
      bgColor: "bg-gray-900",
      serviceType: "tiktok",
      category: "video",
      description: "منصة الفيديوهات القصيرة الأشهر",
      features: ["نشر الفيديوهات", "التحليلات", "الترندات"],
      premium: true,
      quickSetup: true,
    },
    {
      name: "YouTube",
      icon: FaYoutube,
      color: "text-red-600",
      bgColor: "bg-red-600",
      serviceType: "youtube",
      category: "video",
      description: "أكبر منصة لمشاركة الفيديوهات",
      features: ["رفع الفيديوهات", "إدارة القناة", "التحليلات"],
      premium: true,
      quickSetup: true,
    },
  ];

  const categories = [
    { id: "all", name: "جميع المنصات", icon: FaPlug },
    { id: "social", name: "التواصل الاجتماعي", icon: FaTwitter },
    { id: "messaging", name: "المراسلة", icon: FaTelegram },
    { id: "professional", name: "المهنية", icon: FaLinkedin },
    { id: "video", name: "الفيديو", icon: FaYoutube },
  ];

  const filteredPlatforms =
    selectedCategory === "all"
      ? platforms
      : platforms.filter((p) => p.category === selectedCategory);

  const connectedCount = connectedAccounts.length;
  const totalPlatforms = platforms.length;

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
      console.error("Connection error:", error);
    }
  };

  const handleDisconnect = async (platform) => {
    try {
      await disconnectAccount(platform);
    } catch (error) {
      console.error("Disconnection error:", error);
    }
  };

  const isConnected = (platformName) => {
    return connectedAccounts.some(
      (account) => account.platform === platformName
    );
  };

  const getConnectedAccount = (platformName) => {
    return connectedAccounts.find(
      (account) => account.platform === platformName
    );
  };

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl mb-6"
        >
          <FaPlug className="w-8 h-8 text-glow-white" />
        </motion.div>

        <h1 className="text-4xl font-bold text-glow-white mb-4">
          ربط منصات التواصل الاجتماعي
        </h1>
        <p className="text-xl text-glow-white max-w-2xl mx-auto">
          اربط جميع حساباتك على مواقع التواصل الاجتماعي وأدرها من مكان واحد
        </p>
      </motion.div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <AnimatedCard delay={0.1} className="p-6 text-center">
          <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
            <FaCheck className="w-6 h-6 text-blue-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            {connectedCount}
          </h3>
          <p className="text-gray-600">منصة مربوطة</p>
        </AnimatedCard>

        <AnimatedCard delay={0.2} className="p-6 text-center">
          <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-4">
            <FaRocket className="w-6 h-6 text-green-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            {totalPlatforms}
          </h3>
          <p className="text-gray-600">منصة متاحة</p>
        </AnimatedCard>

        <AnimatedCard delay={0.3} className="p-6 text-center">
          <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-4">
            <FaShieldAlt className="w-6 h-6 text-purple-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">100%</h3>
          <p className="text-gray-600">آمان وحماية</p>
        </AnimatedCard>
      </div>

      {/* Category Filter */}
      <AnimatedCard className="p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          تصفية حسب النوع
        </h2>
        <div className="flex flex-wrap gap-3">
          {categories.map((category, index) => (
            <motion.button
              key={category.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => setSelectedCategory(category.id)}
              className={`
                flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all duration-300
                ${
                  selectedCategory === category.id
                    ? "bg-gradient-to-r from-blue-600 to-purple-600 text-glow-white shadow-lg"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }
              `}
            >
              <category.icon className="w-4 h-4" />
              {category.name}
            </motion.button>
          ))}
        </div>
      </AnimatedCard>

      {/* Progress Bar */}
      <AnimatedCard className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">تقدم الربط</h2>
          <span className="text-sm text-gray-600">
            {connectedCount} من {totalPlatforms}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${(connectedCount / totalPlatforms) * 100}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="bg-gradient-to-r from-blue-600 to-purple-600 h-3 rounded-full"
          />
        </div>
      </AnimatedCard>

      {/* Platforms Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredPlatforms.map((platform, index) => {
          const connected = isConnected(platform.name);
          const account = getConnectedAccount(platform.name);

          return (
            <SubscriptionCheck
              key={platform.name}
              serviceType={platform.serviceType}
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <SocialPlatformCard
                  platform={platform.name}
                  icon={platform.icon}
                  color={platform.color}
                  bgColor={platform.bgColor}
                  isConnected={connected}
                  displayName={account?.displayName}
                  onConnect={() => handleConnect(platform.name)}
                  onDisconnect={() => handleDisconnect(platform.name)}
                  loading={isLoading}
                />

                {/* Platform Details */}
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="mt-4 p-4 bg-gray-50 rounded-xl"
                >
                  <p className="text-sm text-gray-600 mb-3">
                    {platform.description}
                  </p>

                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-gray-900">
                      المميزات:
                    </h4>
                    <ul className="space-y-1">
                      {platform.features.map((feature, idx) => (
                        <li
                          key={idx}
                          className="flex items-center gap-2 text-sm text-gray-600"
                        >
                          <FaCheck className="w-3 h-3 text-green-500" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {platform.premium && (
                    <div className="mt-3 flex items-center gap-2">
                      <FaStar className="w-4 h-4 text-yellow-500" />
                      <span className="text-sm font-medium text-yellow-600">
                        مميز
                      </span>
                    </div>
                  )}
                </motion.div>
              </motion.div>
            </SubscriptionCheck>
          );
        })}
      </div>

      {/* Quick Setup Info */}
      <AnimatedCard className="p-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
            <FaExclamationTriangle className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              ملاحظات مهمة
            </h3>
            <ul className="space-y-2 text-gray-600">
              <li className="flex items-center gap-2">
                <FaCheck className="w-4 h-4 text-green-500" />
                جميع البيانات محمية ومشفرة
              </li>
              <li className="flex items-center gap-2">
                <FaCheck className="w-4 h-4 text-green-500" />
                يمكنك قطع الاتصال في أي وقت
              </li>
              <li className="flex items-center gap-2">
                <FaCheck className="w-4 h-4 text-green-500" />
                لا نحتفظ بكلمات المرور
              </li>
              <li className="flex items-center gap-2">
                <FaCheck className="w-4 h-4 text-green-500" />
                ربط آمن عبر OAuth 2.0
              </li>
            </ul>
          </div>
        </div>
      </AnimatedCard>

      {/* Setup Modals */}
      <AnimatePresence>
        {showTelegramSetup && (
          <TelegramSetup
            onClose={() => setShowTelegramSetup(false)}
            onSuccess={() => {
              setShowTelegramSetup(false);
              window.location.reload();
            }}
          />
        )}

        {showWhatsAppSetup && (
          <WhatsAppQuickSetup
            onClose={() => setShowWhatsAppSetup(false)}
            onSuccess={() => {
              setShowWhatsAppSetup(false);
              window.location.reload();
            }}
          />
        )}

        {showTikTokSetup && (
          <TikTokQuickSetup
            onClose={() => setShowTikTokSetup(false)}
            onSuccess={() => {
              setShowTikTokSetup(false);
              window.location.reload();
            }}
          />
        )}

        {showYouTubeSetup && (
          <YouTubeQuickSetup
            onClose={() => setShowYouTubeSetup(false)}
            onSuccess={() => {
              setShowYouTubeSetup(false);
              window.location.reload();
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default IntegrationsPageNew;
