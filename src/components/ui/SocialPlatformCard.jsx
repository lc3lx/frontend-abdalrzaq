import { motion } from "framer-motion";
import { useState } from "react";
import { FaCheck, FaTimes, FaSpinner } from "react-icons/fa";
import AnimatedButton from "./AnimatedButton";

const SocialPlatformCard = ({
  platform,
  icon: Icon,
  color,
  bgColor,
  isConnected,
  displayName,
  onConnect,
  onDisconnect,
  loading = false,
  className = "",
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const cardVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.5, ease: "easeOut" },
    },
    hover: {
      y: -8,
      scale: 1.02,
      transition: { duration: 0.3, ease: "easeOut" },
    },
  };

  const iconVariants = {
    initial: { scale: 1, rotate: 0 },
    hover: {
      scale: 1.1,
      rotate: [0, -10, 10, 0],
      transition: { duration: 0.5, ease: "easeInOut" },
    },
    connected: {
      scale: [1, 1.2, 1],
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  const statusVariants = {
    hidden: { opacity: 0, scale: 0 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { delay: 0.2, duration: 0.3, ease: "easeOut" },
    },
  };

  const getPlatformGradient = () => {
    const gradients = {
      Twitter: "from-blue-400 to-blue-600",
      Facebook: "from-blue-600 to-blue-800",
      Instagram: "from-pink-500 via-red-500 to-yellow-500",
      LinkedIn: "from-blue-700 to-blue-900",
      YouTube: "from-red-500 to-red-700",
      TikTok: "from-gray-800 to-black",
      Telegram: "from-blue-400 to-blue-600",
      WhatsApp: "from-green-400 to-green-600",
    };
    return gradients[platform] || "from-gray-400 to-gray-600";
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className={`
        relative bg-white rounded-2xl p-6 border border-gray-200 
        shadow-lg hover:shadow-xl transition-all duration-300
        overflow-hidden group cursor-pointer
        ${className}
      `}
    >
      {/* Animated Background Gradient */}
      <motion.div
        className={`absolute inset-0 bg-gradient-to-br ${getPlatformGradient()} opacity-0 group-hover:opacity-5`}
        initial={{ opacity: 0 }}
        animate={{ opacity: isHovered ? 0.05 : 0 }}
        transition={{ duration: 0.3 }}
      />

      {/* Platform Icon */}
      <div className="flex items-center justify-between mb-4">
        <motion.div
          variants={iconVariants}
          initial="initial"
          animate={isHovered ? "hover" : "initial"}
          className={`
            w-12 h-12 rounded-xl flex items-center justify-center
            ${bgColor} ${color} shadow-lg
          `}
        >
          <Icon className="w-6 h-6" />
        </motion.div>

        {/* Connection Status */}
        <motion.div
          variants={statusVariants}
          initial="hidden"
          animate="visible"
          className="flex items-center"
        >
          {loading ? (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            >
              <FaSpinner className="w-5 h-5 text-blue-500" />
            </motion.div>
          ) : isConnected ? (
            <div className="flex items-center gap-2 text-green-600">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, type: "spring", stiffness: 500 }}
              >
                <FaCheck className="w-4 h-4" />
              </motion.div>
              <span className="text-sm font-medium">متصل</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-gray-400">
              <FaTimes className="w-4 h-4" />
              <span className="text-sm font-medium">غير متصل</span>
            </div>
          )}
        </motion.div>
      </div>

      {/* Platform Name */}
      <motion.h3
        className="text-xl font-bold text-gray-900 mb-2"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1, duration: 0.5 }}
      >
        {platform}
      </motion.h3>

      {/* Connected Account Info */}
      {isConnected && displayName && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-4 p-3 bg-green-50 rounded-lg border border-green-200"
        >
          <p className="text-sm text-green-800">
            <span className="font-medium">الحساب المتصل:</span> {displayName}
          </p>
        </motion.div>
      )}

      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="flex gap-3"
      >
        {isConnected ? (
          <AnimatedButton
            variant="danger"
            size="sm"
            onClick={onDisconnect}
            loading={loading}
            className="flex-1"
          >
            قطع الاتصال
          </AnimatedButton>
        ) : (
          <AnimatedButton
            variant="primary"
            size="sm"
            onClick={onConnect}
            loading={loading}
            className="flex-1"
          >
            ربط الحساب
          </AnimatedButton>
        )}
      </motion.div>

      {/* Animated Border */}
      <motion.div
        className="absolute inset-0 rounded-2xl border-2 border-transparent"
        animate={{
          borderColor: isHovered ? `rgb(59 130 246 / 0.3)` : "transparent",
        }}
        transition={{ duration: 0.3 }}
      />

      {/* Floating Particles Effect */}
      {isHovered && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className={`absolute w-2 h-2 ${bgColor} rounded-full opacity-30`}
              initial={{
                x: Math.random() * 100 + "%",
                y: Math.random() * 100 + "%",
                scale: 0,
              }}
              animate={{
                y: "-100%",
                scale: [0, 1, 0],
                opacity: [0, 0.6, 0],
              }}
              transition={{
                duration: 2,
                delay: i * 0.2,
                repeat: Infinity,
                ease: "easeOut",
              }}
            />
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default SocialPlatformCard;
