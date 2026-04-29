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
      "bg-gradient-to-r from-teal-400 via-amber-300 to-rose-400 text-slate-950 shadow-2xl shadow-teal-500/15",
    secondary:
      "bg-white/[0.08] hover:bg-white/[0.14] text-white border border-white/10 shadow-xl backdrop-blur-xl",
    success:
      "bg-gradient-to-r from-emerald-400 to-teal-500 text-slate-950 shadow-2xl shadow-emerald-500/15",
    warning:
      "bg-gradient-to-r from-amber-300 to-orange-400 text-slate-950 shadow-2xl shadow-amber-500/15",
    danger:
      "bg-gradient-to-r from-rose-500 to-red-600 text-white shadow-2xl shadow-rose-500/15",
    ghost:
      "bg-transparent hover:bg-white/[0.1] text-white border border-white/10",
    social:
      "bg-gradient-to-r from-cyan-400 via-violet-400 to-fuchsia-400 text-slate-950 shadow-2xl shadow-cyan-500/15",
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
      scale: 1.025,
      y: -1,
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
        rounded-xl font-bold transition-all duration-300 
        focus:outline-none focus:ring-4 focus:ring-teal-300/25
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
