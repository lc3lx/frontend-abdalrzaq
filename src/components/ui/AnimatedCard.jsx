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
    glass:
      "bg-white/[0.08] backdrop-blur-2xl border border-white/10 shadow-2xl",
    gradient:
      "bg-gradient-to-br from-teal-400/14 via-white/[0.08] to-rose-400/12 border border-white/10 shadow-2xl",
    dark: "bg-[#0b1718]/90 border border-white/10 shadow-2xl text-white",
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
        ${glow && isHovered ? "shadow-2xl shadow-teal-500/20" : ""}
        ${className}
      `}
      {...props}
    >
      {/* Animated Background Gradient */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-teal-400/10 via-amber-300/10 to-rose-400/10"
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
              ? "0 0 30px rgba(24, 213, 189, 0.25)"
              : "0 0 0px rgba(24, 213, 189, 0)",
          }}
          transition={{ duration: 0.3 }}
        />
      )}
    </motion.div>
  );
};

export default AnimatedCard;
