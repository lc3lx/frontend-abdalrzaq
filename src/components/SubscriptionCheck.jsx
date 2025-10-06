import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaLock, FaShoppingBag, FaExclamationTriangle } from "react-icons/fa";
import axios from "axios";

const SubscriptionCheck = ({ serviceType, children, fallback = null }) => {
  const [hasAccess, setHasAccess] = useState(null);
  const [loading, setLoading] = useState(true);
  const [subscription, setSubscription] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    checkSubscription();
  }, [serviceType]);

  const checkSubscription = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setHasAccess(false);
        setLoading(false);
        return;
      }

      // Get user's subscription
      const response = await axios.get(
        "http://localhost:5000/api/packages/my-subscription",
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );

      const userSubscription = response.data.subscription;
      setSubscription(userSubscription);

      if (!userSubscription) {
        setHasAccess(false);
        setLoading(false);
        return;
      }

      // Check if subscription is active
      if (!userSubscription.isActive) {
        setHasAccess(false);
        setLoading(false);
        return;
      }

      // Check if package includes the required service
      const packageServices = userSubscription.packageId.services;
      const hasServiceAccess = packageServices.some(
        (service) =>
          service.type === serviceType || service.type === "all_services"
      );

      setHasAccess(hasServiceAccess);
    } catch (error) {
      console.error("Error checking subscription:", error);
      setHasAccess(false);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!hasAccess) {
    if (fallback) {
      return fallback;
    }

    return (
      <div className="bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 rounded-xl p-6 text-center">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-4">
            <FaLock className="text-2xl text-orange-600" />
          </div>

          <h3 className="text-xl font-bold text-gray-800 mb-2">
            هذه الخدمة تتطلب اشتراك
          </h3>

          <p className="text-gray-600 mb-4 max-w-md">
            {serviceType === "facebook" &&
              "لربط حساب فيسبوك، تحتاج للاشتراك في باقة تحتوي على خدمة فيسبوك"}
            {serviceType === "instagram" &&
              "لربط حساب إنستغرام، تحتاج للاشتراك في باقة تحتوي على خدمة إنستغرام"}
            {serviceType === "twitter" &&
              "لربط حساب تويتر، تحتاج للاشتراك في باقة تحتوي على خدمة تويتر"}
            {serviceType === "linkedin" &&
              "لربط حساب لينكد إن، تحتاج للاشتراك في باقة تحتوي على خدمة لينكد إن"}
            {serviceType === "tiktok" &&
              "لربط حساب تيك توك، تحتاج للاشتراك في باقة تحتوي على خدمة تيك توك"}
            {serviceType === "youtube" &&
              "لربط حساب يوتيوب، تحتاج للاشتراك في باقة تحتوي على خدمة يوتيوب"}
            {serviceType === "auto_reply" &&
              "لاستخدام الرد الآلي، تحتاج للاشتراك في باقة تحتوي على خدمة الرد الآلي"}
            {serviceType === "analytics" &&
              "لعرض التحليلات، تحتاج للاشتراك في باقة تحتوي على خدمة التحليلات"}
            {serviceType === "scheduling" &&
              "لجدولة المنشورات، تحتاج للاشتراك في باقة تحتوي على خدمة الجدولة"}
            {![
              "facebook",
              "instagram",
              "twitter",
              "linkedin",
              "tiktok",
              "youtube",
              "auto_reply",
              "analytics",
              "scheduling",
            ].includes(serviceType) &&
              "لهذه الخدمة، تحتاج للاشتراك في باقة تحتوي على هذه الخدمة"}
          </p>

          <div className="flex gap-3">
            <button
              onClick={() => navigate("/packages")}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              <FaShoppingBag />
              عرض الباقات
            </button>

            {subscription && !subscription.isActive && (
              <button
                onClick={() => navigate("/wallet")}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                تجديد الاشتراك
              </button>
            )}
          </div>

          {subscription && (
            <div className="mt-4 p-4 bg-white rounded-lg border border-orange-200">
              <div className="flex items-center gap-2 text-orange-600 mb-2">
                <FaExclamationTriangle />
                <span className="font-semibold">اشتراكك الحالي</span>
              </div>
              <p className="text-sm text-gray-600">
                {subscription.packageId.nameAr} - ينتهي في{" "}
                {subscription.remainingDays} يوم
              </p>
              <p className="text-xs text-orange-600 mt-1">
                هذه الباقة لا تحتوي على {getServiceName(serviceType)}
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }

  return children;
};

const getServiceName = (serviceType) => {
  const names = {
    facebook: "خدمة فيسبوك",
    instagram: "خدمة إنستغرام",
    twitter: "خدمة تويتر",
    linkedin: "خدمة لينكد إن",
    tiktok: "خدمة تيك توك",
    youtube: "خدمة يوتيوب",
    auto_reply: "خدمة الرد الآلي",
    analytics: "خدمة التحليلات",
    scheduling: "خدمة الجدولة",
  };
  return names[serviceType] || "هذه الخدمة";
};

export default SubscriptionCheck;








