import { motion } from "framer-motion";
import {
  FaRocket,
  FaArrowRight,
  FaPlay,
  FaFacebook,
  FaInstagram,
  FaTwitter,
  FaLinkedin,
  FaTiktok,
  FaYoutube,
  FaBolt,
  FaShieldAlt,
  FaClock,
  FaUsers,
  FaCheckCircle,
  FaStar,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useState, useEffect } from "react";

const Landing = () => {
  const [windowSize, setWindowSize] = useState({ width: 1920, height: 1080 });

  useEffect(() => {
    const updateSize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      <Navbar />
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
                Math.random() * windowSize.width,
                Math.random() * windowSize.width,
              ],
              y: [
                Math.random() * windowSize.height,
                Math.random() * windowSize.height,
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

      {/* How It Works Section */}
      <section className="relative z-10 py-32 bg-gradient-to-b from-slate-900 to-slate-800">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-5xl lg:text-6xl font-black text-white mb-6">
              كيف يعمل؟
            </h2>
            <p className="text-xl text-white/80 max-w-3xl mx-auto">
              بوست واحد، توزيع على جميع المنصات - بكل سهولة وبضغطة زر واحدة
            </p>
          </motion.div>

          {/* Animated Demo */}
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Left: Post Creation */}
              <motion.div
                initial={{ opacity: 0, x: -100 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 1, delay: 0.2 }}
                viewport={{ once: true }}
                className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20"
              >
                <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                  <FaBolt className="text-yellow-400" />
                  اكتب بوستك
                </h3>

                <div className="space-y-4">
                  <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-sm">أ</span>
                      </div>
                      <span className="text-white/80 text-sm">أنت</span>
                    </div>
                    <p className="text-white">
                      مرحباً بجميع عملائي! عرض خاص اليوم على منتجاتنا الجديدة 🎉
                    </p>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-4 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300"
                  >
                    <FaRocket className="inline mr-2" />
                    انشر على جميع المنصات
                  </motion.button>
                </div>
              </motion.div>

              {/* Right: Platform Distribution Animation */}
              <motion.div
                initial={{ opacity: 0, x: 100 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 1, delay: 0.4 }}
                viewport={{ once: true }}
                className="relative"
              >
                <div className="grid grid-cols-2 gap-6">
                  {[
                    {
                      icon: FaFacebook,
                      name: "Facebook",
                      color: "from-blue-600 to-blue-700",
                      delay: 0.6,
                    },
                    {
                      icon: FaInstagram,
                      name: "Instagram",
                      color: "from-pink-500 to-purple-600",
                      delay: 0.8,
                    },
                    {
                      icon: FaTwitter,
                      name: "Twitter",
                      color: "from-blue-400 to-blue-500",
                      delay: 1.0,
                    },
                    {
                      icon: FaLinkedin,
                      name: "LinkedIn",
                      color: "from-blue-700 to-blue-800",
                      delay: 1.2,
                    },
                    {
                      icon: FaTiktok,
                      name: "TikTok",
                      color: "from-black to-gray-800",
                      delay: 1.4,
                    },
                    {
                      icon: FaYoutube,
                      name: "YouTube",
                      color: "from-red-500 to-red-600",
                      delay: 1.6,
                    },
                  ].map(({ icon: Icon, name, color, delay }) => (
                    <motion.div
                      key={name}
                      initial={{ opacity: 0, scale: 0.8, y: 20 }}
                      whileInView={{ opacity: 1, scale: 1, y: 0 }}
                      transition={{
                        duration: 0.6,
                        delay: delay,
                        type: "spring",
                        stiffness: 200,
                      }}
                      viewport={{ once: true }}
                      whileHover={{ scale: 1.05, y: -5 }}
                      className={`bg-gradient-to-br ${color} p-6 rounded-2xl shadow-2xl relative overflow-hidden`}
                    >
                      {/* Animated particles */}
                      <div className="absolute inset-0">
                        {[...Array(5)].map((_, i) => (
                          <motion.div
                            key={i}
                            className="absolute w-1 h-1 bg-white/30 rounded-full"
                            animate={{
                              x: [0, Math.random() * 100, 0],
                              y: [0, Math.random() * 100, 0],
                              opacity: [0, 1, 0],
                            }}
                            transition={{
                              duration: 3,
                              repeat: Infinity,
                              delay: Math.random() * 2,
                            }}
                          />
                        ))}
                      </div>

                      <div className="relative z-10 text-center">
                        <Icon className="text-3xl text-white mx-auto mb-3" />
                        <h4 className="text-white font-semibold">{name}</h4>
                        <motion.div
                          initial={{ scaleX: 0 }}
                          animate={{ scaleX: 1 }}
                          transition={{ duration: 0.8, delay: delay + 0.3 }}
                          className="h-1 bg-white/50 rounded-full mt-3 origin-left"
                        />
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Connecting Lines Animation */}
                <svg
                  className="absolute inset-0 pointer-events-none"
                  viewBox="0 0 400 400"
                >
                  {[...Array(6)].map((_, i) => (
                    <motion.path
                      key={i}
                      d={`M 100 ${50 + i * 50} Q 200 200 300 ${50 + i * 50}`}
                      stroke="rgba(255,255,255,0.3)"
                      strokeWidth="2"
                      fill="none"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{
                        duration: 2,
                        delay: 0.8 + i * 0.2,
                        ease: "easeInOut",
                      }}
                    />
                  ))}
                </svg>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 py-32 bg-gradient-to-b from-slate-800 to-slate-900">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-5xl lg:text-6xl font-black text-white mb-6">
              مميزاتنا
            </h2>
            <p className="text-xl text-white/80 max-w-3xl mx-auto">
              كل ما تحتاجه لإدارة تواجدك على وسائل التواصل الاجتماعي بكفاءة
              واحترافية
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                icon: FaBolt,
                title: "نشر سريع",
                description: "انشر على جميع منصاتك بنقرة واحدة ووفر وقتك",
                color: "from-yellow-400 to-orange-500",
              },
              {
                icon: FaShieldAlt,
                title: "آمن وموثوق",
                description: "حماية كاملة لبياناتك مع تشفير متقدم",
                color: "from-green-400 to-blue-500",
              },
              {
                icon: FaClock,
                title: "جدولة ذكية",
                description: "حدد أوقات النشر المثالية لكل منصة تلقائياً",
                color: "from-purple-400 to-pink-500",
              },
              {
                icon: FaUsers,
                title: "إدارة متعددة",
                description: "أدر حسابات متعددة من لوحة تحكم واحدة",
                color: "from-blue-400 to-cyan-500",
              },
              {
                icon: FaCheckCircle,
                title: "ردود تلقائية",
                description: "أجب على تعليقات عملائك بذكاء اصطناعي",
                color: "from-emerald-400 to-teal-500",
              },
              {
                icon: FaStar,
                title: "تحليلات متقدمة",
                description: "تابع أداء منشوراتك واحصل على تقارير مفصلة",
                color: "from-rose-400 to-pink-500",
              },
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -10, scale: 1.02 }}
                className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 hover:border-white/30 transition-all duration-300 group"
              >
                <div
                  className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}
                >
                  <feature.icon className="text-2xl text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">
                  {feature.title}
                </h3>
                <p className="text-white/80 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative z-10 py-32 bg-gradient-to-b from-slate-900 to-slate-800">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-5xl lg:text-6xl font-black text-white mb-6">
              إحصائياتنا
            </h2>
            <p className="text-xl text-white/80 max-w-3xl mx-auto">
              انضم إلى آلاف المستخدمين الذين يثقون بنا
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-4xl mx-auto">
            {[
              {
                number: "10K+",
                label: "مستخدم نشط",
                color: "from-blue-400 to-blue-600",
              },
              {
                number: "500K+",
                label: "منشور تم نشره",
                color: "from-purple-400 to-purple-600",
              },
              {
                number: "50M+",
                label: "مستخدم تم الوصول إليهم",
                color: "from-pink-400 to-pink-600",
              },
              {
                number: "99.9%",
                label: "وقت تشغيل النظام",
                color: "from-green-400 to-green-600",
              },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                viewport={{ once: true }}
                className={`bg-gradient-to-br ${stat.color} p-8 rounded-3xl text-center shadow-2xl`}
              >
                <motion.div
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  transition={{
                    duration: 0.6,
                    delay: index * 0.2 + 0.3,
                    type: "spring",
                  }}
                  viewport={{ once: true }}
                  className="text-4xl lg:text-5xl font-black text-white mb-2"
                >
                  {stat.number}
                </motion.div>
                <div className="text-white/90 font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="relative z-10 py-32 bg-gradient-to-b from-slate-800 to-slate-900">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-5xl lg:text-6xl font-black text-white mb-6">
              آراء عملائنا
            </h2>
            <p className="text-xl text-white/80 max-w-3xl mx-auto">
              اكتشف كيف ساعدت منصتنا عملاءنا في نمو أعمالهم
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                name: "أحمد محمد",
                role: "صاحب متجر إلكتروني",
                content:
                  "وفرت لي المنصة ساعات من العمل اليومي. أستطيع الآن إدارة جميع حساباتي بكفاءة واحترافية.",
                rating: 5,
                avatar: "أ",
              },
              {
                name: "فاطمة علي",
                role: "مؤثرة اجتماعية",
                content:
                  "الأداة الأفضل التي استخدمتها! النشر التلقائي وجدولة المنشورات غيرت طريقة عملي تماماً.",
                rating: 5,
                avatar: "ف",
              },
              {
                name: "محمد حسن",
                role: "مدير تسويق",
                content:
                  "زيادة كبيرة في التفاعل مع الجمهور بعد استخدام النظام. التحليلات مفصلة ومفيدة جداً.",
                rating: 5,
                avatar: "م",
              },
            ].map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                viewport={{ once: true }}
                whileHover={{ y: -10, scale: 1.02 }}
                className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 hover:border-white/30 transition-all duration-300"
              >
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <FaStar key={i} className="text-yellow-400" />
                  ))}
                </div>

                <blockquote className="text-white/90 mb-6 leading-relaxed">
                  &ldquo;{testimonial.content}&rdquo;
                </blockquote>

                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold">
                      {testimonial.avatar}
                    </span>
                  </div>
                  <div>
                    <div className="text-white font-semibold">
                      {testimonial.name}
                    </div>
                    <div className="text-white/60 text-sm">
                      {testimonial.role}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="relative z-10 py-32 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600">
        <div className="container mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto"
          >
            <h2 className="text-5xl lg:text-7xl font-black text-white mb-8">
              ابدأ رحلتك اليوم
            </h2>
            <p className="text-xl lg:text-2xl text-white/90 mb-12 leading-relaxed">
              انضم إلى آلاف المستخدمين الذين يديرون تواجدهم على وسائل التواصل
              الاجتماعي بسهولة واحترافية
            </p>

            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-block"
            >
              <Link
                to="/register"
                className="bg-white text-purple-600 px-12 py-6 rounded-3xl font-bold text-2xl shadow-2xl hover:bg-gray-50 transition-all duration-300 inline-flex items-center gap-4"
              >
                <FaRocket className="text-2xl" />
                سجل مجاناً الآن
                <FaArrowRight />
              </Link>
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.5 }}
              viewport={{ once: true }}
              className="text-white/80 mt-8 text-lg"
            >
              لا تحتاج بطاقة ائتمان • جرب جميع المميزات مجاناً • إلغاء في أي وقت
            </motion.p>
          </motion.div>
        </div>

        {/* Background Animation */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(15)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-white/20 rounded-full"
              animate={{
                x: [
                  Math.random() * windowSize.width,
                  Math.random() * windowSize.width,
                ],
                y: [
                  Math.random() * windowSize.height,
                  Math.random() * windowSize.height,
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
      </section>
    </div>
  );
};

export default Landing;
