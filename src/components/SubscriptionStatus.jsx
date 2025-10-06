import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaCrown,
  FaClock,
  FaShoppingBag,
  FaCheck,
  FaExclamationTriangle,
} from "react-icons/fa";
import axios from "axios";

const SubscriptionStatus = () => {
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchSubscription();
  }, []);

  const fetchSubscription = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setLoading(false);
        return;
      }

      const response = await axios.get(
        "http://localhost:5000/api/packages/my-subscription",
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );

      setSubscription(response.data.subscription);
    } catch (error) {
      console.error("Error fetching subscription:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white p-4 rounded-xl shadow-lg border-t-4 border-blue-600 animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
      </div>
    );
  }

  if (!subscription) {
    return (
      <div className="bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 rounded-xl p-6 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
              <FaShoppingBag className="text-xl text-orange-600" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-800">
                لا يوجد اشتراك نشط
              </h3>
              <p className="text-sm text-gray-600">
                اشترك الآن للوصول لجميع الميزات
              </p>
            </div>
          </div>
          <button
            onClick={() => navigate("/packages")}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-lg hover:from-orange-700 hover:to-red-700 transition-all duration-300 transform hover:scale-105"
          >
            <FaShoppingBag />
            عرض الباقات
          </button>
        </div>
      </div>
    );
  }

  const isActive = subscription.isActive;
  const remainingDays = subscription.remainingDays;

  return (
    <div
      className={`bg-white p-6 rounded-xl shadow-lg border-t-4 ${
        isActive ? "border-green-600" : "border-red-600"
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className={`w-12 h-12 rounded-full flex items-center justify-center ${
              isActive ? "bg-green-100" : "bg-red-100"
            }`}
          >
            {isActive ? (
              <FaCheck className="text-xl text-green-600" />
            ) : (
              <FaExclamationTriangle className="text-xl text-red-600" />
            )}
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-800">
              {subscription.packageId.nameAr}
            </h3>
            <p
              className={`text-sm ${
                isActive ? "text-green-600" : "text-red-600"
              }`}
            >
              {isActive ? (
                <>
                  <FaClock className="inline mr-1" />
                  ينتهي في {remainingDays} يوم
                </>
              ) : (
                "انتهى الاشتراك"
              )}
            </p>
          </div>
        </div>

        <div className="text-right">
          <div className="text-2xl font-bold text-gray-800">
            ${subscription.packageId.price}
          </div>
          <div className="text-sm text-gray-600">
            لمدة {subscription.packageId.duration} يوم
          </div>

          {isActive && remainingDays <= 7 && (
            <button
              onClick={() => navigate("/packages")}
              className="mt-2 flex items-center gap-1 px-3 py-1 bg-orange-600 text-white text-sm rounded-lg hover:bg-orange-700 transition-colors"
            >
              <FaShoppingBag className="text-xs" />
              تجديد
            </button>
          )}

          {!isActive && (
            <button
              onClick={() => navigate("/packages")}
              className="mt-2 flex items-center gap-1 px-3 py-1 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-colors"
            >
              <FaShoppingBag className="text-xs" />
              تجديد
            </button>
          )}
        </div>
      </div>

      {/* Services List */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <h4 className="text-sm font-semibold text-gray-700 mb-2">
          الخدمات المتاحة:
        </h4>
        <div className="flex flex-wrap gap-2">
          {subscription.packageId.services.slice(0, 5).map((service, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
            >
              {service.nameAr}
            </span>
          ))}
          {subscription.packageId.services.length > 5 && (
            <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
              +{subscription.packageId.services.length - 5} أخرى
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default SubscriptionStatus;








