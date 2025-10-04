import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaRocket, FaArrowRight, FaPlay } from "react-icons/fa";
import { Link } from "react-router-dom";

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated Background */}
      <motion.div
        className="absolute inset-0"
        animate={{
          background: [
            "radial-gradient(600px circle at 20% 30%, #3b82f6 0%, transparent 50%)",
            "radial-gradient(600px circle at 80% 70%, #8b5cf6 0%, transparent 50%)",
            "radial-gradient(600px circle at 40% 80%, #ec4899 0%, transparent 50%)",
            "radial-gradient(600px circle at 20% 30%, #3b82f6 0%, transparent 50%)",
          ],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      />

      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-blue-400/20 rounded-full"
            animate={{
              x: [
                Math.random() * window.innerWidth,
                Math.random() * window.innerWidth,
              ],
              y: [
                Math.random() * window.innerHeight,
                Math.random() * window.innerHeight,
              ],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: Math.random() * 20 + 10,
              repeat: Infinity,
              delay: Math.random() * 5,
              ease: "linear",
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-6 pt-20 pb-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center min-h-screen">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="space-y-8"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 backdrop-blur-lg rounded-full border border-white/20 text-white"
            >
              <FaRocket className="text-yellow-400" />
              <span className="text-sm font-medium text-glow-white">
                الأداة الأولى في المنطقة
              </span>
            </motion.div>

            {/* Main Heading */}
            <div className="space-y-4">
              <motion.h1
                className="text-6xl lg:text-8xl font-black text-visible leading-tight"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.6 }}
              >
                <motion.span
                  animate={{
                    backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                  }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent"
                  style={{ backgroundSize: "300% 300%" }}
                >
                  Smart
                </motion.span>
                <br />
                <motion.span
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 1, delay: 0.8 }}
                  className="text-glow-white"
                >
                  Social
                </motion.span>
              </motion.h1>

              <motion.p
                className="text-xl lg:text-2xl text-glow-white max-w-xl leading-relaxed"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 1 }}
              >
                أدر جميع حساباتك على مواقع التواصل الاجتماعي من مكان واحد مع
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 font-bold">
                  {" "}
                  ذكاء اصطناعي متقدم
                </span>
              </motion.p>
            </div>

            {/* CTA Buttons */}
            <motion.div
              className="flex flex-col sm:flex-row gap-4"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 1.4 }}
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  to="/register"
                  className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl text-white font-bold text-lg shadow-2xl overflow-hidden inline-flex items-center gap-3"
                >
                  ابدأ مجاناً الآن
                  <FaArrowRight />
                </Link>
              </motion.div>

              <motion.button
                className="group flex items-center gap-3 px-8 py-4 bg-white/10 backdrop-blur-lg rounded-2xl text-white font-bold text-lg border border-white/20 hover:bg-white/20 transition-all"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <FaPlay className="text-sm mr-1" />
                </div>
                شاهد العرض التوضيحي
              </motion.button>
            </motion.div>
          </motion.div>

          {/* Right Content - Simple Dashboard Mockup */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, delay: 0.8 }}
          >
            <div className="relative bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl">
              {/* Dashboard Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                </div>
                <FaRocket className="text-white/60" />
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                {[
                  {
                    label: "المتابعون",
                    value: "125K",
                    color: "from-blue-400 to-blue-600",
                  },
                  {
                    label: "المنشورات",
                    value: "1.2K",
                    color: "from-purple-400 to-purple-600",
                  },
                  {
                    label: "التفاعل",
                    value: "89%",
                    color: "from-pink-400 to-pink-600",
                  },
                  {
                    label: "الوصول",
                    value: "2.5M",
                    color: "from-green-400 to-green-600",
                  },
                ].map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    className={`bg-gradient-to-r ${stat.color} p-4 rounded-xl`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.2 + index * 0.1 }}
                    whileHover={{ scale: 1.05 }}
                  >
                    <div className="text-white/80 text-xs">{stat.label}</div>
                    <div className="text-white text-xl font-bold">
                      {stat.value}
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Simple Text */}
              <div className="text-center text-white/60">
                لوحة التحكم الذكية
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="w-6 h-10 border-2 border-white/40 rounded-full flex justify-center">
          <motion.div
            className="w-1 h-3 bg-white/60 rounded-full mt-2"
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </div>
      </motion.div>
    </div>
  );
};

export default Landing;
