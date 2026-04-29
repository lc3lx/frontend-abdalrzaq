import { motion } from "framer-motion";
import { useState } from "react";

const GlassCard = ({
  children,
  className = "",
  hover = true,
  glow = false,
  tilt = false,
  delay = 0,
  ...props
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const cardVariants = {
    hidden: {
      opacity: 0,
      y: 50,
      scale: 0.95,
      rotateX: tilt ? -10 : 0,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      rotateX: 0,
      transition: {
        duration: 0.8,
        delay,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
    hover: {
      y: hover ? -10 : 0,
      scale: hover ? 1.03 : 1,
      rotateX: tilt && isHovered ? 5 : 0,
      rotateY: tilt && isHovered ? 5 : 0,
      transition: {
        duration: 0.3,
        ease: "easeOut",
      },
    },
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      whileHover={hover ? "hover" : undefined}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      viewport={{ once: true, threshold: 0.1 }}
      className={`
        relative group cursor-pointer
        bg-white/[0.08] backdrop-blur-2xl
        border border-white/10 rounded-2xl
        shadow-2xl hover:shadow-premium
        transition-all duration-500
        ${glow ? "hover:shadow-teal-500/20" : ""}
        ${className}
      `}
      style={{
        transformStyle: "preserve-3d",
      }}
      {...props}
    >
      {/* Animated Border */}
      <motion.div
        className="absolute inset-0 rounded-2xl"
        animate={{
          background: isHovered
            ? "linear-gradient(45deg, #18d5bd, #f5b84b, #f05776, #18d5bd)"
            : "linear-gradient(45deg, transparent, transparent, transparent, transparent)",
        }}
        transition={{ duration: 0.5 }}
        style={{
          padding: "2px",
          backgroundSize: "300% 300%",
        }}
      >
        <motion.div
          className="w-full h-full bg-white/5 backdrop-blur-xl rounded-2xl"
          animate={{
            backgroundPosition: isHovered ? ["0% 0%", "100% 100%"] : "0% 0%",
          }}
          transition={{ duration: 2, repeat: isHovered ? Infinity : 0 }}
        />
      </motion.div>

      {/* Shine Effect */}
      <motion.div
        className="absolute inset-0 rounded-2xl overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: isHovered ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      >
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12"
          animate={{ x: isHovered ? ["100%", "-100%"] : "100%" }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
        />
      </motion.div>

      {/* Content */}
      <div className="relative z-10 p-8">{children}</div>

      {/* Floating Particles */}
      {isHovered && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl">
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-teal-300 rounded-full"
              initial={{
                x: Math.random() * 100 + "%",
                y: "100%",
                opacity: 0,
                scale: 0,
              }}
              animate={{
                y: "-10%",
                opacity: [0, 1, 0],
                scale: [0, 1, 0],
              }}
              transition={{
                duration: 2,
                delay: i * 0.1,
                repeat: Infinity,
                ease: "easeOut",
              }}
            />
          ))}
        </div>
      )}

      {/* Glow Effect */}
      {glow && (
        <motion.div
          className="absolute inset-0 rounded-2xl -z-10"
          animate={{
            boxShadow: isHovered
              ? "0 0 50px rgba(24, 213, 189, 0.28), 0 0 100px rgba(245, 184, 75, 0.14)"
              : "0 0 0px rgba(24, 213, 189, 0)",
          }}
          transition={{ duration: 0.5 }}
        />
      )}
    </motion.div>
  );
};

export default GlassCard;
