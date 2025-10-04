import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaCheck,
  FaTimes,
  FaCrown,
  FaShoppingCart,
  FaClock,
  FaUsers,
  FaRocket,
  FaStar,
  FaArrowLeft,
  FaBolt,
  FaInfinity,
  FaShieldAlt,
  FaHeadset,
  FaMagic,
} from "react-icons/fa";
import axios from "axios";
import GlassCard from "../components/ui/GlassCard";
import MagicButton from "../components/ui/MagicButton";

const PackagesPageNew = () => {
  const [packages, setPackages] = useState([]);
  const [userSubscription, setUserSubscription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [purchasing, setPurchasing] = useState(null);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchPackages();
    fetchUserSubscription();
  }, []);

  const fetchPackages = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        "https://www.sushiluha.com/api/packages",
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );
      setPackages(response.data.packages);
    } catch (err) {
      console.error("Error fetching packages:", err);
      setError("فشل في تحميل الباقات");
    }
  };

  const fetchUserSubscription = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        "https://www.sushiluha.com/api/packages/my-subscription",
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );
      setUserSubscription(response.data.subscription);
    } catch (err) {
      console.error("Error fetching subscription:", err);
    } finally {
      setLoading(false);
    }
  };

  const purchasePackage = async (packageId) => {
    try {
      setPurchasing(packageId);
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `https://www.sushiluha.com/api/packages/purchase/${packageId}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );

      if (response.data.success) {
        alert("تم شراء الباقة بنجاح!");
        fetchUserSubscription();
      }
    } catch (err) {
      console.error("Error purchasing package:", err);
      if (err.response?.status === 400) {
        alert(err.response.data.message || "خطأ في الشراء");
      } else {
        alert("فشل في شراء الباقة");
      }
    } finally {
      setPurchasing(null);
    }
  };

  const getPackageIcon = (packageName) => {
    const name = packageName.toLowerCase();
    if (name.includes("مجاني") || name.includes("basic")) return FaUsers;
    if (name.includes("متقدم") || name.includes("pro")) return FaRocket;
    if (name.includes("مميز") || name.includes("premium")) return FaCrown;
    return FaStar;
  };

  const getPackageGradient = (index, packageName) => {
    const name = packageName.toLowerCase();
    if (name.includes("مجاني") || name.includes("basic"))
      return "from-blue-500 via-blue-600 to-blue-700";
    if (name.includes("متقدم") || name.includes("pro"))
      return "from-purple-500 via-purple-600 to-purple-700";
    if (name.includes("مميز") || name.includes("premium"))
      return "from-yellow-400 via-yellow-500 to-yellow-600";

    const gradients = [
      "from-blue-500 via-blue-600 to-blue-700",
      "from-purple-500 via-purple-600 to-purple-700",
      "from-pink-500 via-pink-600 to-pink-700",
      "from-green-500 via-green-600 to-green-700",
    ];
    return gradients[index % gradients.length];
  };

  const isCurrentPackage = (packageId) => {
    return userSubscription?.package?._id === packageId;
  };

  const isPackageExpired = () => {
    if (!userSubscription) return false;
    return new Date(userSubscription.endDate) < new Date();
  };

  const getRemainingDays = () => {
    if (!userSubscription) return 0;
    const endDate = new Date(userSubscription.endDate);
    const today = new Date();
    const diffTime = endDate - today;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-4 border-blue-500/30 border-t-blue-500 rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <motion.div
          animate={{
            background: [
              "radial-gradient(600px circle at 20% 30%, #3b82f6 0%, transparent 50%)",
              "radial-gradient(600px circle at 80% 70%, #8b5cf6 0%, transparent 50%)",
              "radial-gradient(600px circle at 40% 80%, #ec4899 0%, transparent 50%)",
              "radial-gradient(600px circle at 20% 30%, #3b82f6 0%, transparent 50%)",
            ],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0"
        />
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(30)].map((_, i) => (
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

      <div className="relative z-10 container mx-auto px-6 py-20">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl mb-8"
          >
            <FaCrown className="w-10 h-10 text-glow-white" />
          </motion.div>

          <h1 className="text-6xl lg:text-8xl font-black text-glow-white mb-6">
            <motion.span
              animate={{
                backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
              }}
              transition={{ duration: 3, repeat: Infinity }}
              className="bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent bg-300%"
            >
              اختر باقتك
            </motion.span>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-xl text-glow-white max-w-2xl mx-auto"
          >
            اختر الباقة المناسبة لك واستمتع بمميزات إدارة مواقع التواصل
            الاجتماعي
          </motion.p>
        </motion.div>

        {/* Current Subscription Status */}
        {userSubscription && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            <GlassCard className="p-6 text-center" glow>
              <div className="flex items-center justify-center gap-4 mb-4">
                <FaShieldAlt className="text-green-400 text-2xl" />
                <h3 className="text-2xl font-bold text-glow-white">
                  الاشتراك الحالي: {userSubscription.package?.name}
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-400">
                    {getRemainingDays()}
                  </div>
                  <div className="text-gray-400">يوم متبقي</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-400">
                    {userSubscription.package?.price} ر.س
                  </div>
                  <div className="text-gray-400">السعر الحالي</div>
                </div>
                <div className="text-center">
                  <div
                    className={`text-3xl font-bold ${
                      isPackageExpired() ? "text-red-400" : "text-green-400"
                    }`}
                  >
                    {isPackageExpired() ? "منتهي" : "نشط"}
                  </div>
                  <div className="text-gray-400">حالة الاشتراك</div>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        )}

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-8 p-4 bg-red-500/20 border border-red-500/50 rounded-2xl text-red-200 text-center backdrop-blur-xl"
          >
            {error}
          </motion.div>
        )}

        {/* Packages Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {packages.map((pkg, index) => {
            const Icon = getPackageIcon(pkg.name);
            const gradient = getPackageGradient(index, pkg.name);
            const isCurrent = isCurrentPackage(pkg._id);
            const isPurchasing = purchasing === pkg._id;

            return (
              <motion.div
                key={pkg._id}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.8 }}
                onHoverStart={() => setSelectedPackage(pkg._id)}
                onHoverEnd={() => setSelectedPackage(null)}
              >
                <GlassCard
                  className={`relative p-8 h-full ${
                    isCurrent ? "ring-2 ring-green-400" : ""
                  }`}
                  hover
                  glow={selectedPackage === pkg._id}
                  tilt
                  delay={index * 0.1}
                >
                  {/* Popular Badge */}
                  {pkg.name.includes("متقدم") && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.5 }}
                      className="absolute -top-4 left-1/2 transform -translate-x-1/2"
                    >
                      <div className="bg-gradient-to-r from-yellow-400 to-orange-500 px-4 py-2 rounded-full text-black font-bold text-sm shadow-xl">
                        الأكثر شعبية
                      </div>
                    </motion.div>
                  )}

                  {/* Current Package Badge */}
                  {isCurrent && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="absolute -top-4 right-4"
                    >
                      <div className="bg-gradient-to-r from-green-400 to-green-600 px-3 py-1 rounded-full text-white font-bold text-xs shadow-xl">
                        الحالي
                      </div>
                    </motion.div>
                  )}

                  {/* Package Icon */}
                  <motion.div
                    className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${gradient} flex items-center justify-center mb-6 mx-auto shadow-2xl`}
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <Icon className="text-white text-2xl" />
                  </motion.div>

                  {/* Package Name */}
                  <h3 className="text-2xl font-bold text-white text-center mb-2">
                    {pkg.name}
                  </h3>

                  {/* Package Description */}
                  <p className="text-gray-400 text-center mb-6 min-h-[3rem]">
                    {pkg.description}
                  </p>

                  {/* Price */}
                  <div className="text-center mb-8">
                    <motion.div
                      className="text-5xl font-black text-white mb-2"
                      animate={{ scale: selectedPackage === pkg._id ? 1.1 : 1 }}
                    >
                      {pkg.price}
                      <span className="text-lg text-gray-400 font-normal">
                        {" "}
                        ر.س
                      </span>
                    </motion.div>
                    <div className="text-gray-400">
                      / {pkg.duration} {pkg.duration === 1 ? "شهر" : "أشهر"}
                    </div>
                  </div>

                  {/* Features */}
                  <div className="space-y-4 mb-8">
                    {pkg.features?.map((feature, featureIndex) => (
                      <motion.div
                        key={featureIndex}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 + featureIndex * 0.05 }}
                        className="flex items-center gap-3"
                      >
                        <FaCheck className="text-green-400 flex-shrink-0" />
                        <span className="text-gray-300 text-sm">{feature}</span>
                      </motion.div>
                    ))}

                    {/* Services */}
                    {pkg.services?.map((service, serviceIndex) => (
                      <motion.div
                        key={serviceIndex}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 + serviceIndex * 0.05 }}
                        className="flex items-center gap-3"
                      >
                        <FaBolt className="text-blue-400 flex-shrink-0" />
                        <span className="text-gray-300 text-sm capitalize">
                          {service}
                        </span>
                      </motion.div>
                    ))}

                    {/* Limits */}
                    <div className="pt-4 border-t border-gray-700/50 space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-400">الحسابات المسموحة</span>
                        <span className="text-white font-bold">
                          {pkg.limits?.maxAccounts === -1 ? (
                            <FaInfinity className="inline" />
                          ) : (
                            pkg.limits?.maxAccounts || "غير محدد"
                          )}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-400">المنشورات اليومية</span>
                        <span className="text-white font-bold">
                          {pkg.limits?.maxPostsPerDay === -1 ? (
                            <FaInfinity className="inline" />
                          ) : (
                            pkg.limits?.maxPostsPerDay || "غير محدد"
                          )}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Action Button */}
                  <MagicButton
                    variant={isCurrent ? "success" : "primary"}
                    size="md"
                    className="w-full"
                    disabled={isCurrent || isPurchasing}
                    loading={isPurchasing}
                    onClick={() => purchasePackage(pkg._id)}
                    sparkles={!isCurrent}
                  >
                    {isCurrent ? (
                      <>
                        <FaCheck className="mr-2" />
                        الباقة الحالية
                      </>
                    ) : (
                      <>
                        <FaShoppingCart className="mr-2" />
                        اشترك الآن
                      </>
                    )}
                  </MagicButton>
                </GlassCard>
              </motion.div>
            );
          })}
        </div>

        {/* Features Comparison */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-20"
        >
          <GlassCard className="p-8">
            <h2 className="text-3xl font-bold text-white text-center mb-8">
              مقارنة المميزات
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center space-y-4">
                <FaHeadset className="text-4xl text-blue-400 mx-auto" />
                <h3 className="text-xl font-bold text-glow-white">
                  دعم فني 24/7
                </h3>
                <p className="text-glow-white">
                  فريق دعم متخصص لمساعدتك في أي وقت
                </p>
              </div>

              <div className="text-center space-y-4">
                <FaShieldAlt className="text-4xl text-green-400 mx-auto" />
                <h3 className="text-xl font-bold text-glow-white">
                  حماية البيانات
                </h3>
                <p className="text-glow-white">تشفير متقدم لحماية معلوماتك</p>
              </div>

              <div className="text-center space-y-4">
                <FaMagic className="text-4xl text-purple-400 mx-auto" />
                <h3 className="text-xl font-bold text-glow-white">
                  ذكاء اصطناعي
                </h3>
                <p className="text-glow-white">تحليلات ذكية لتحسين أدائك</p>
              </div>
            </div>
          </GlassCard>
        </motion.div>

        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-center mt-12"
        >
          <MagicButton
            variant="ghost"
            onClick={() => navigate(-1)}
            icon={FaArrowLeft}
            iconPosition="right"
          >
            العودة
          </MagicButton>
        </motion.div>
      </div>
    </div>
  );
};

export default PackagesPageNew;
