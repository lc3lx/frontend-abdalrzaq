import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
} from "react-icons/fa";
import axios from "axios";

const PackagesPage = () => {
  const [packages, setPackages] = useState([]);
  const [userSubscription, setUserSubscription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [purchasing, setPurchasing] = useState(null);
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

  const handlePurchase = async (packageId, packageName) => {
    if (!window.confirm(`هل تريد الاشتراك في باقة ${packageName}؟`)) {
      return;
    }

    try {
      setPurchasing(packageId);
      const token = localStorage.getItem("token");
      await axios.post(
        "https://www.sushiluha.com/api/packages/purchase",
        { packageId },
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );

      alert("تم الاشتراك بنجاح!");
      fetchPackages();
      fetchUserSubscription();
      navigate("/wallet");
    } catch (err) {
      console.error("Error purchasing package:", err);
      const errorMessage = err.response?.data?.error || "فشل في شراء الباقة";
      alert(errorMessage);
    } finally {
      setPurchasing(null);
    }
  };

  const getServiceIcon = (serviceType) => {
    switch (serviceType) {
      case "facebook":
        return "📘";
      case "instagram":
        return "📷";
      case "twitter":
        return "🐦";
      case "linkedin":
        return "💼";
      case "tiktok":
        return "🎵";
      case "youtube":
        return "📺";
      case "auto_reply":
        return "🤖";
      case "analytics":
        return "📊";
      case "scheduling":
        return "⏰";
      case "all_services":
        return "🌟";
      default:
        return "🔧";
    }
  };

  const getServiceName = (serviceType) => {
    const names = {
      facebook: "فيسبوك",
      instagram: "إنستغرام",
      twitter: "تويتر",
      linkedin: "لينكد إن",
      tiktok: "تيك توك",
      youtube: "يوتيوب",
      auto_reply: "الرد الآلي",
      analytics: "التحليلات",
      scheduling: "جدولة المنشورات",
      all_services: "جميع الخدمات",
    };
    return names[serviceType] || serviceType;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <button
                onClick={() => navigate("/dashboard")}
                className="flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-4"
              >
                <FaArrowLeft />
                العودة للوحة التحكم
              </button>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                باقات الخدمات
              </h1>
              <p className="text-gray-600">
                اختر الباقة المناسبة لك واستمتع بجميع ميزات المنصة
              </p>
            </div>
          </div>
        </div>

        {/* Current Subscription */}
        {userSubscription && (
          <div className="mb-8 bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold mb-2">اشتراكك الحالي</h2>
                <p className="text-green-100">
                  {userSubscription.packageId.nameAr}
                </p>
                <p className="text-sm text-green-100">
                  ينتهي في {userSubscription.remainingDays} يوم
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold">
                  ${userSubscription.packageId.price}
                </p>
                <p className="text-green-100 text-sm">
                  لمدة {userSubscription.packageId.duration} يوم
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Packages Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {packages.map((pkg) => (
            <div
              key={pkg._id}
              className={`bg-white rounded-xl shadow-lg overflow-hidden transform hover:scale-105 transition-all duration-300 ${
                pkg.isPopular ? "ring-2 ring-purple-500" : ""
              }`}
            >
              {/* Package Header */}
              <div
                className={`p-6 text-center ${
                  pkg.isPopular
                    ? "bg-gradient-to-r from-purple-500 to-purple-600 text-white"
                    : "bg-gradient-to-r from-blue-500 to-blue-600 text-white"
                }`}
              >
                {pkg.isPopular && (
                  <div className="flex items-center justify-center gap-1 mb-2">
                    <FaStar className="text-yellow-300" />
                    <span className="text-sm font-medium">الأكثر شعبية</span>
                  </div>
                )}
                <h3 className="text-xl font-bold">{pkg.nameAr}</h3>
                <p className="text-sm opacity-90 mt-1">{pkg.descriptionAr}</p>
              </div>

              {/* Price */}
              <div className="p-6 text-center border-b">
                <div className="text-3xl font-bold text-gray-800 mb-1">
                  ${pkg.price}
                </div>
                <p className="text-gray-600">لمدة {pkg.duration} يوم</p>
              </div>

              {/* Services */}
              <div className="p-6">
                <h4 className="font-semibold text-gray-800 mb-4">
                  الخدمات المتاحة:
                </h4>
                <div className="space-y-3">
                  {pkg.services.map((service, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <span className="text-lg">
                        {getServiceIcon(service.type)}
                      </span>
                      <span className="text-gray-700">{service.nameAr}</span>
                      <FaCheck className="text-green-500 ml-auto" />
                    </div>
                  ))}
                </div>

                {/* Features */}
                {pkg.features && pkg.features.length > 0 && (
                  <div className="mt-6">
                    <h4 className="font-semibold text-gray-800 mb-4">
                      الميزات:
                    </h4>
                    <ul className="space-y-2">
                      {pkg.features.map((feature, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <FaCheck className="text-green-500 mt-1 flex-shrink-0" />
                          <span className="text-gray-700 text-sm">
                            {feature.nameAr}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Limits */}
                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="text-center">
                      <FaUsers className="text-blue-500 mx-auto mb-1" />
                      <p className="text-gray-600">حسابات</p>
                      <p className="font-semibold">{pkg.maxAccounts}</p>
                    </div>
                    <div className="text-center">
                      <FaRocket className="text-green-500 mx-auto mb-1" />
                      <p className="text-gray-600">منشورات/يوم</p>
                      <p className="font-semibold">{pkg.maxPostsPerDay}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Purchase Button */}
              <div className="p-6 bg-gray-50">
                {userSubscription &&
                userSubscription.packageId._id === pkg._id ? (
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-2 text-green-600 mb-2">
                      <FaCheck />
                      <span className="font-semibold">مشترك حالياً</span>
                    </div>
                    <p className="text-sm text-gray-600">
                      ينتهي في {userSubscription.remainingDays} يوم
                    </p>
                  </div>
                ) : (
                  <button
                    onClick={() => handlePurchase(pkg._id, pkg.nameAr)}
                    disabled={purchasing === pkg._id}
                    className={`w-full py-3 px-4 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2 ${
                      pkg.isPopular
                        ? "bg-gradient-to-r from-purple-600 to-purple-700 text-white hover:from-purple-700 hover:to-purple-800"
                        : "bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800"
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    {purchasing === pkg._id ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        جاري المعالجة...
                      </>
                    ) : (
                      <>
                        <FaShoppingCart />
                        اشترك الآن
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Info Section */}
        <div className="mt-12 bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            لماذا تختار باقاتنا؟
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaRocket className="text-2xl text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">
                سهولة الاستخدام
              </h3>
              <p className="text-gray-600 text-sm">
                واجهة بسيطة وبديهية لجميع مستويات المستخدمين
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaClock className="text-2xl text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">متاح 24/7</h3>
              <p className="text-gray-600 text-sm">
                خدماتنا متاحة على مدار الساعة لضمان استمرارية عملك
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaCrown className="text-2xl text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">
                دعم فني متميز
              </h3>
              <p className="text-gray-600 text-sm">
                فريق دعم فني متخصص لمساعدتك في أي وقت
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PackagesPage;
