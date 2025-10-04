import { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, useSpring, useInView } from 'framer-motion';
import { 
  FaRocket, 
  FaTwitter, 
  FaFacebook, 
  FaInstagram, 
  FaLinkedin,
  FaTelegram,
  FaWhatsapp,
  FaYoutube,
  FaTiktok,
  FaStar,
  FaArrowRight,
  FaPlay,
  FaChartLine,
  FaUsers,
  FaBolt,
  FaMagic
} from 'react-icons/fa';
import { Link } from 'react-router-dom';

const SuperHero = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const heroRef = useRef(null);
  const isInView = useInView(heroRef, { once: false });
  
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.8]);

  const springConfig = { stiffness: 100, damping: 30, restDelta: 0.001 };
  const x = useSpring(0, springConfig);
  const rotateX = useSpring(0, springConfig);
  const rotateY = useSpring(0, springConfig);

  useEffect(() => {
    const handleMouseMove = (event) => {
      const { clientX, clientY } = event;
      const { left, top, width, height } = heroRef.current?.getBoundingClientRect() || {};
      
      if (left !== undefined) {
        const centerX = left + width / 2;
        const centerY = top + height / 2;
        const rotateXValue = (clientY - centerY) / height * -10;
        const rotateYValue = (clientX - centerX) / width * 10;
        
        setMousePosition({ x: clientX, y: clientY });
        rotateX.set(rotateXValue);
        rotateY.set(rotateYValue);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [rotateX, rotateY]);

  const socialIcons = [
    { icon: FaTwitter, color: '#1DA1F2', delay: 0.1 },
    { icon: FaFacebook, color: '#1877F2', delay: 0.2 },
    { icon: FaInstagram, color: '#E4405F', delay: 0.3 },
    { icon: FaLinkedin, color: '#0077B5', delay: 0.4 },
    { icon: FaTelegram, color: '#0088CC', delay: 0.5 },
    { icon: FaWhatsapp, color: '#25D366', delay: 0.6 },
    { icon: FaYoutube, color: '#FF0000', delay: 0.7 },
    { icon: FaTiktok, color: '#000000', delay: 0.8 },
  ];

  const features = [
    { icon: FaChartLine, text: 'تحليلات متقدمة', count: '50K+' },
    { icon: FaUsers, text: 'مستخدم نشط', count: '10K+' },
    { icon: FaBolt, text: 'منشور يومياً', count: '100K+' },
    { icon: FaMagic, text: 'رد تلقائي', count: '1M+' }
  ];

  const FloatingElement = ({ children, delay = 0, amplitude = 20, duration = 4 }) => (
    <motion.div
      animate={{
        y: [0, -amplitude, 0],
        rotate: [0, 5, -5, 0],
      }}
      transition={{
        duration,
        repeat: Infinity,
        delay,
        ease: "easeInOut"
      }}
    >
      {children}
    </motion.div>
  );

  const ParticleField = () => (
    <div className="absolute inset-0 overflow-hidden">
      {[...Array(50)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full opacity-20"
          animate={{
            x: [
              Math.random() * window.innerWidth,
              Math.random() * window.innerWidth,
            ],
            y: [
              Math.random() * window.innerHeight,
              Math.random() * window.innerHeight,
            ],
            scale: [0, 1, 0],
          }}
          transition={{
            duration: Math.random() * 10 + 10,
            repeat: Infinity,
            delay: Math.random() * 5,
            ease: "linear"
          }}
          style={{
            left: Math.random() * 100 + '%',
            top: Math.random() * 100 + '%',
          }}
        />
      ))}
    </div>
  );

  return (
    <section 
      ref={heroRef}
      className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900"
    >
      {/* Particle Field */}
      <ParticleField />
      
      {/* Animated Background Gradient */}
      <motion.div
        className="absolute inset-0"
        animate={{
          background: [
            'radial-gradient(600px circle at 20% 30%, #3b82f6 0%, transparent 50%)',
            'radial-gradient(600px circle at 80% 70%, #8b5cf6 0%, transparent 50%)',
            'radial-gradient(600px circle at 40% 80%, #ec4899 0%, transparent 50%)',
            'radial-gradient(600px circle at 20% 30%, #3b82f6 0%, transparent 50%)',
          ]
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      />

      {/* Main Content */}
      <motion.div 
        className="relative z-10 container mx-auto px-6 pt-20 pb-32"
        style={{ y, opacity, scale }}
      >
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
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              >
                <FaStar className="text-yellow-400" />
              </motion.div>
              <span className="text-sm font-medium">الأداة الأولى في المنطقة</span>
            </motion.div>

            {/* Main Heading */}
            <div className="space-y-4">
              <motion.h1 
                className="text-6xl lg:text-8xl font-black text-white leading-tight"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.6 }}
              >
                <motion.span
                  animate={{ 
                    backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                  }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent bg-300% animate-gradient"
                >
                  Smart
                </motion.span>
                <br />
                <motion.span
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 1, delay: 0.8 }}
                >
                  Social
                </motion.span>
              </motion.h1>

              <motion.p 
                className="text-xl lg:text-2xl text-gray-300 max-w-xl leading-relaxed"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 1 }}
              >
                أدر جميع حساباتك على مواقع التواصل الاجتماعي من مكان واحد مع 
                <motion.span 
                  className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 font-bold"
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  {' '}ذكاء اصطناعي متقدم
                </motion.span>
              </motion.p>
            </div>

            {/* Stats */}
            <motion.div 
              className="grid grid-cols-2 lg:grid-cols-4 gap-6"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 1.2 }}
            >
              {features.map((feature, index) => (
                <motion.div
                  key={feature.text}
                  className="text-center space-y-2"
                  whileHover={{ scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <motion.div
                    className="w-12 h-12 mx-auto bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center"
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 10, repeat: Infinity, delay: index * 0.5 }}
                  >
                    <feature.icon className="text-white text-xl" />
                  </motion.div>
                  <motion.div
                    className="text-2xl font-bold text-white"
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity, delay: index * 0.3 }}
                  >
                    {feature.count}
                  </motion.div>
                  <div className="text-sm text-gray-400">{feature.text}</div>
                </motion.div>
              ))}
            </motion.div>

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
                  className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl text-white font-bold text-lg shadow-2xl overflow-hidden"
                >
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-100"
                    transition={{ duration: 0.3 }}
                  />
                  <span className="relative flex items-center gap-3">
                    ابدأ مجاناً الآن
                    <motion.div
                      animate={{ x: [0, 5, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      <FaArrowRight />
                    </motion.div>
                  </span>
                </Link>
              </motion.div>

              <motion.button
                onClick={() => setIsVideoPlaying(true)}
                className="group flex items-center gap-3 px-8 py-4 bg-white/10 backdrop-blur-lg rounded-2xl text-white font-bold text-lg border border-white/20 hover:bg-white/20 transition-all"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center"
                >
                  <FaPlay className="text-sm mr-1" />
                </motion.div>
                شاهد العرض التوضيحي
              </motion.button>
            </motion.div>
          </motion.div>

          {/* Right Content - 3D Interactive Dashboard */}
          <motion.div
            className="relative"
            style={{ rotateX, rotateY }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, delay: 0.8 }}
          >
            {/* Main Dashboard Mockup */}
            <motion.div
              className="relative bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              {/* Dashboard Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                </div>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  className="text-white/60"
                >
                  <FaRocket />
                </motion.div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                {[
                  { label: 'المتابعون', value: '125K', color: 'from-blue-400 to-blue-600' },
                  { label: 'المنشورات', value: '1.2K', color: 'from-purple-400 to-purple-600' },
                  { label: 'التفاعل', value: '89%', color: 'from-pink-400 to-pink-600' },
                  { label: 'الوصول', value: '2.5M', color: 'from-green-400 to-green-600' },
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
                    <motion.div
                      className="text-white text-xl font-bold"
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: Infinity, delay: index * 0.5 }}
                    >
                      {stat.value}
                    </motion.div>
                  </motion.div>
                ))}
              </div>

              {/* Social Icons Grid */}
              <div className="grid grid-cols-4 gap-3">
                {socialIcons.map(({ icon: Icon, color, delay }, index) => (
                  <FloatingElement key={index} delay={delay} amplitude={10}>
                    <motion.div
                      className="w-12 h-12 rounded-xl flex items-center justify-center shadow-lg cursor-pointer"
                      style={{ backgroundColor: color + '20', border: `1px solid ${color}40` }}
                      whileHover={{ 
                        scale: 1.2, 
                        backgroundColor: color,
                        boxShadow: `0 0 20px ${color}60`
                      }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <Icon className="text-white" style={{ color }} />
                    </motion.div>
                  </FloatingElement>
                ))}
              </div>
            </motion.div>

            {/* Floating Elements */}
            <FloatingElement delay={0.5} amplitude={30}>
              <motion.div
                className="absolute -top-6 -right-6 w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center shadow-2xl"
                whileHover={{ rotate: 180, scale: 1.2 }}
              >
                <FaBolt className="text-white text-xl" />
              </motion.div>
            </FloatingElement>

            <FloatingElement delay={1} amplitude={25}>
              <motion.div
                className="absolute -bottom-4 -left-4 w-14 h-14 bg-gradient-to-r from-green-400 to-blue-500 rounded-xl flex items-center justify-center shadow-2xl"
                whileHover={{ rotate: -180, scale: 1.2 }}
              >
                <FaMagic className="text-white" />
              </motion.div>
            </FloatingElement>

            {/* Orbiting Elements */}
            <motion.div
              className="absolute inset-0 pointer-events-none"
              animate={{ rotate: 360 }}
              transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
            >
              <div className="relative w-full h-full">
                <motion.div
                  className="absolute top-1/4 right-0 w-4 h-4 bg-blue-400 rounded-full shadow-lg"
                  animate={{ scale: [1, 1.5, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <motion.div
                  className="absolute bottom-1/4 left-0 w-4 h-4 bg-purple-400 rounded-full shadow-lg"
                  animate={{ scale: [1, 1.5, 1] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                />
              </div>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>

      {/* Video Modal */}
      {isVideoPlaying && (
        <motion.div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => setIsVideoPlaying(false)}
        >
          <motion.div
            className="relative bg-white rounded-2xl overflow-hidden max-w-4xl w-full aspect-video"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-full h-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white">
              <div className="text-center">
                <FaPlay className="text-6xl mb-4 mx-auto" />
                <p className="text-xl">العرض التوضيحي قريباً</p>
              </div>
            </div>
            <button
              onClick={() => setIsVideoPlaying(false)}
              className="absolute top-4 right-4 w-10 h-10 bg-black/20 hover:bg-black/40 rounded-full flex items-center justify-center text-white transition-colors"
            >
              ✕
            </button>
          </motion.div>
        </motion.div>
      )}

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
    </section>
  );
};

export default SuperHero;
