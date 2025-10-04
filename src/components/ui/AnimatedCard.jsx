import { useState, useRef, useEffect } from "react";
import { motion, useInView, useAnimation } from "framer-motion";

const AnimatedCard = ({
  children,
  className = "",
  variant = "default",
  delay = 0,
  hover = true,
  glow = false,
  ...props
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, threshold: 0.1 });
  const controls = useAnimation();
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (isInView) {
      controls.start("visible");
    }
  }, [isInView, controls]);

  const variants = {
    hidden: {
      opacity: 0,
      y: 50,
      scale: 0.95,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        delay: delay,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
  };

  const hoverVariants = {
    hover: {
      y: -8,
      scale: 1.02,
      transition: {
        duration: 0.3,
        ease: "easeOut",
      },
    },
    tap: {
      scale: 0.98,
    },
  };

  const cardVariants = {
    default: "bg-white border border-gray-200 shadow-lg hover:shadow-xl",
    glass: "bg-white/20 backdrop-blur-lg border border-white/30 shadow-xl",
    gradient:
      "bg-gradient-to-br from-blue-50 to-indigo-100 border border-blue-200 shadow-lg",
    dark: "bg-gray-800 border border-gray-700 shadow-xl text-white",
  };

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={hover ? { ...variants, ...hoverVariants } : variants}
      whileHover={hover ? "hover" : undefined}
      whileTap={hover ? "tap" : undefined}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className={`
        relative rounded-2xl overflow-hidden transition-all duration-300
        ${cardVariants[variant]}
        ${glow && isHovered ? "shadow-2xl shadow-blue-500/25" : ""}
        ${className}
      `}
      {...props}
    >
      {/* Animated Background Gradient */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-pink-600/10"
        initial={{ opacity: 0 }}
        animate={{
          opacity: isHovered ? 1 : 0,
          scale: isHovered ? 1.1 : 1,
        }}
        transition={{ duration: 0.3 }}
      />

      {/* Shimmer Effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12"
        initial={{ x: "-100%" }}
        animate={{ x: isHovered ? "200%" : "-100%" }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
      />

      {/* Content */}
      <div className="relative z-10">{children}</div>

      {/* Glow Effect */}
      {glow && (
        <motion.div
          className="absolute inset-0 rounded-2xl"
          animate={{
            boxShadow: isHovered
              ? "0 0 30px rgba(59, 130, 246, 0.3)"
              : "0 0 0px rgba(59, 130, 246, 0)",
          }}
          transition={{ duration: 0.3 }}
        />
      )}
    </motion.div>
  );
};

export default AnimatedCard;
