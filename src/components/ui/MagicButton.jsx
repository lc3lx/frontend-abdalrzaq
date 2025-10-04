import { motion } from "framer-motion";
import { useState, useRef } from "react";

const MagicButton = ({
  children,
  variant = "primary",
  size = "md",
  icon: Icon,
  iconPosition = "left",
  loading = false,
  disabled = false,
  className = "",
  onClick,
  sparkles = true,
  ...props
}) => {
  const [isPressed, setIsPressed] = useState(false);
  const [ripples, setRipples] = useState([]);
  const buttonRef = useRef(null);

  const variants = {
    primary:
      "bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white shadow-2xl",
    secondary:
      "bg-white/10 backdrop-blur-xl text-white border border-white/20 shadow-xl",
    success:
      "bg-gradient-to-r from-green-500 via-emerald-600 to-teal-600 text-white shadow-2xl",
    warning:
      "bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500 text-white shadow-2xl",
    danger:
      "bg-gradient-to-r from-red-600 via-pink-600 to-rose-600 text-white shadow-2xl",
    ghost: "bg-transparent hover:bg-white/10 text-white border border-white/30",
    magic:
      "bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white shadow-2xl relative overflow-hidden",
  };

  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
    xl: "px-10 py-5 text-xl",
  };

  const createRipple = (event) => {
    if (disabled || loading) return;

    const button = buttonRef.current;
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;

    const newRipple = {
      x,
      y,
      size,
      id: Date.now(),
    };

    setRipples((prev) => [...prev, newRipple]);
    setTimeout(() => {
      setRipples((prev) => prev.filter((ripple) => ripple.id !== newRipple.id));
    }, 1000);
  };

  const handleClick = (e) => {
    if (disabled || loading) return;

    createRipple(e);
    setIsPressed(true);
    setTimeout(() => setIsPressed(false), 200);

    if (onClick) onClick(e);
  };

  const buttonVariants = {
    initial: { scale: 1 },
    hover: {
      scale: 1.05,
      boxShadow: "0 20px 40px rgba(0,0,0,0.3)",
      transition: { duration: 0.2, ease: "easeOut" },
    },
    tap: {
      scale: 0.95,
      transition: { duration: 0.1 },
    },
  };

  const LoadingSpinner = () => (
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
    />
  );

  return (
    <motion.button
      ref={buttonRef}
      variants={buttonVariants}
      initial="initial"
      whileHover={!disabled && !loading ? "hover" : "initial"}
      whileTap={!disabled && !loading ? "tap" : "initial"}
      disabled={disabled || loading}
      onClick={handleClick}
      className={`
        relative inline-flex items-center justify-center gap-3
        rounded-2xl font-bold transition-all duration-300 
        focus:outline-none focus:ring-4 focus:ring-blue-500/20
        overflow-hidden group
        ${variants[variant]}
        ${sizes[size]}
        ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
        ${className}
      `}
      {...props}
    >
      {/* Animated Background for Magic variant */}
      {variant === "magic" && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600"
          animate={{
            backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "linear",
          }}
          style={{ backgroundSize: "200% 200%" }}
        />
      )}

      {/* Ripple Effects */}
      {ripples.map((ripple) => (
        <motion.span
          key={ripple.id}
          className="absolute bg-white/30 rounded-full pointer-events-none"
          style={{
            left: ripple.x,
            top: ripple.y,
            width: ripple.size,
            height: ripple.size,
          }}
          initial={{ scale: 0, opacity: 1 }}
          animate={{ scale: 4, opacity: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
      ))}

      {/* Sparkles Effect */}
      {sparkles && !loading && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full"
              animate={{
                x: [Math.random() * 100 + "%", Math.random() * 100 + "%"],
                y: [Math.random() * 100 + "%", Math.random() * 100 + "%"],
                opacity: [0, 1, 0],
                scale: [0, 1, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.3,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>
      )}

      {/* Content */}
      <span className="relative flex items-center gap-3 z-10">
        {loading ? (
          <LoadingSpinner />
        ) : (
          <>
            {Icon && iconPosition === "left" && (
              <motion.span
                initial={{ x: -5, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="flex-shrink-0"
              >
                <Icon className="w-5 h-5" />
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
                className="flex-shrink-0"
              >
                <Icon className="w-5 h-5" />
              </motion.span>
            )}
          </>
        )}
      </span>

      {/* Shine Effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 group-hover:translate-x-full"
        initial={{ x: "-100%" }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
      />

      {/* Glow Effect */}
      <motion.div
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100"
        animate={{
          boxShadow: [
            "0 0 0px rgba(59, 130, 246, 0)",
            "0 0 20px rgba(59, 130, 246, 0.5)",
            "0 0 40px rgba(59, 130, 246, 0.3)",
            "0 0 20px rgba(59, 130, 246, 0.5)",
            "0 0 0px rgba(59, 130, 246, 0)",
          ],
        }}
        transition={{ duration: 2, repeat: Infinity }}
      />
    </motion.button>
  );
};

export default MagicButton;
