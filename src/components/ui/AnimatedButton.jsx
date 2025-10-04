import { motion } from "framer-motion";
import { useState } from "react";

const AnimatedButton = ({
  children,
  variant = "primary",
  size = "md",
  icon: Icon,
  iconPosition = "left",
  loading = false,
  disabled = false,
  className = "",
  onClick,
  ...props
}) => {
  const [isPressed, setIsPressed] = useState(false);

  const variants = {
    primary:
      "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl",
    secondary:
      "bg-white hover:bg-gray-50 text-gray-900 border border-gray-300 shadow-sm hover:shadow-md",
    success:
      "bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white shadow-lg hover:shadow-xl",
    warning:
      "bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white shadow-lg hover:shadow-xl",
    danger:
      "bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white shadow-lg hover:shadow-xl",
    ghost:
      "bg-transparent hover:bg-gray-100 text-gray-700 border border-transparent hover:border-gray-300",
    social:
      "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg hover:shadow-xl",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base",
    xl: "px-8 py-4 text-lg",
  };

  const LoadingSpinner = () => (
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
    />
  );

  const buttonVariants = {
    initial: { scale: 1 },
    hover: {
      scale: 1.05,
      transition: { duration: 0.2, ease: "easeOut" },
    },
    tap: {
      scale: 0.95,
      transition: { duration: 0.1 },
    },
    loading: {
      scale: 1,
      transition: { duration: 0.2 },
    },
  };

  const rippleVariants = {
    initial: { scale: 0, opacity: 1 },
    animate: {
      scale: 4,
      opacity: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  const handleClick = (e) => {
    if (disabled || loading) return;

    setIsPressed(true);
    setTimeout(() => setIsPressed(false), 600);

    if (onClick) onClick(e);
  };

  return (
    <motion.button
      variants={buttonVariants}
      initial="initial"
      whileHover={!disabled && !loading ? "hover" : "initial"}
      whileTap={!disabled && !loading ? "tap" : "initial"}
      animate={loading ? "loading" : "initial"}
      disabled={disabled || loading}
      onClick={handleClick}
      className={`
        relative inline-flex items-center justify-center gap-2 
        rounded-xl font-semibold transition-all duration-300 
        focus:outline-none focus:ring-4 focus:ring-blue-500/20
        overflow-hidden
        ${variants[variant]}
        ${sizes[size]}
        ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
        ${className}
      `}
      {...props}
    >
      {/* Ripple Effect */}
      {isPressed && (
        <motion.span
          variants={rippleVariants}
          initial="initial"
          animate="animate"
          className="absolute inset-0 bg-white/30 rounded-full"
        />
      )}

      {/* Content */}
      <span className="relative flex items-center gap-2">
        {loading ? (
          <LoadingSpinner />
        ) : (
          <>
            {Icon && iconPosition === "left" && (
              <motion.span
                initial={{ x: -5, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
              >
                <Icon className="w-4 h-4" />
              </motion.span>
            )}

            <motion.span
              initial={{ y: 5, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.05 }}
            >
              {children}
            </motion.span>

            {Icon && iconPosition === "right" && (
              <motion.span
                initial={{ x: 5, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
              >
                <Icon className="w-4 h-4" />
              </motion.span>
            )}
          </>
        )}
      </span>

      {/* Shine Effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12"
        initial={{ x: "-100%" }}
        animate={{ x: "200%" }}
        transition={{
          repeat: Infinity,
          repeatDelay: 3,
          duration: 1,
          ease: "easeInOut",
        }}
      />
    </motion.button>
  );
};

export default AnimatedButton;
