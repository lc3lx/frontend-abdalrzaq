import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import {
  FaShareAlt,
  FaCopy,
  FaUsers,
  FaDollarSign,
  FaTrophy,
  FaGift,
} from "react-icons/fa";
import axios from "axios";

const ReferralPanel = () => {
  const [referralData, setReferralData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetchReferralData();
  }, []);

  const fetchReferralData = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Please login to view referral data");
        setLoading(false);
        return;
      }

      const response = await axios.get(
        "http://localhost:5000/api/referral/my-referrals",
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );

      setReferralData(response.data);
    } catch (err) {
      console.error("Error fetching referral data:", err);
      if (err.response?.status === 401) {
        setError("Session expired. Please login again.");
      } else if (err.code === "ECONNREFUSED") {
        setError("Backend server is not running. Please start the server.");
      } else {
        setError("Failed to load referral data");
      }
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const shareReferralLink = () => {
    if (navigator.share) {
      navigator.share({
        title: "انضم إلى منصتنا",
        text: "استخدم رابط الإحالة الخاص بي واحصل على مكافآت رائعة!",
        url: referralData?.referralLink,
      });
    } else {
      copyToClipboard(referralData?.referralLink);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
          <div className="h-32 bg-gray-200 rounded-lg"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaUsers className="text-2xl text-red-500" />
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            خطأ في تحميل بيانات الإحالة
          </h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchReferralData}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            إعادة المحاولة
          </button>
        </div>
      </div>
    );
  }

  if (!referralData) {
    return null;
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">
          برنامج الإحالة
        </h2>
        <p className="text-gray-600">
          ادع أصدقاءك واحصل على عمولة 10% من شحنهم الأول
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-600 text-sm font-medium">
                إجمالي الإحالات
              </p>
              <p className="text-3xl font-bold text-blue-800">
                {referralData.stats.total}
              </p>
            </div>
            <FaUsers className="text-3xl text-blue-500" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-600 text-sm font-medium">المكتملة</p>
              <p className="text-3xl font-bold text-green-800">
                {referralData.stats.completed}
              </p>
            </div>
            <FaGift className="text-3xl text-green-500" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 border border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-600 text-sm font-medium">
                إجمالي العمولة
              </p>
              <p className="text-3xl font-bold text-purple-800">
                ${referralData.stats.totalCommissionEarned.toFixed(2)}
              </p>
            </div>
            <FaDollarSign className="text-3xl text-purple-500" />
          </div>
        </div>
      </div>

      {/* Referral Link Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white mb-8">
        <h3 className="text-xl font-bold mb-4">رابط الإحالة الخاص بك</h3>
        <div className="flex items-center gap-4">
          <div className="flex-1 bg-white/20 backdrop-blur-sm rounded-lg px-4 py-3">
            <p className="text-sm text-blue-100 mb-1">الرابط:</p>
            <p className="font-mono text-sm break-all">
              {referralData.referralLink}
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => copyToClipboard(referralData.referralLink)}
              className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-lg hover:bg-white/30 transition-colors flex items-center gap-2"
            >
              <FaCopy />
              {copied ? "تم النسخ!" : "نسخ"}
            </button>
            <button
              onClick={shareReferralLink}
              className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-lg hover:bg-white/30 transition-colors flex items-center gap-2"
            >
              <FaShareAlt />
              مشاركة
            </button>
          </div>
        </div>
      </div>

      {/* Referral Code */}
      <div className="bg-gray-50 rounded-xl p-6 mb-8">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">
          رمز الإحالة
        </h3>
        <div className="flex items-center gap-4">
          <div className="flex-1 bg-white rounded-lg px-4 py-3 border">
            <p className="font-mono text-lg font-bold text-gray-800">
              {referralData.referralCode}
            </p>
          </div>
          <button
            onClick={() => copyToClipboard(referralData.referralCode)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <FaCopy />
            {copied ? "تم النسخ!" : "نسخ الرمز"}
          </button>
        </div>
      </div>

      {/* Recent Referrals */}
      {referralData.referrals && referralData.referrals.length > 0 && (
        <div>
          <h3 className="text-xl font-bold text-gray-800 mb-4">
            الإحالات الأخيرة
          </h3>
          <div className="space-y-3">
            {referralData.referrals.slice(0, 5).map((referral) => (
              <div
                key={referral._id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center">
                    <FaUsers className="text-blue-500" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">
                      {referral.referredUserId?.username}
                    </p>
                    <p className="text-sm text-gray-600">
                      {new Date(referral.createdAt).toLocaleDateString("ar-SA")}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      referral.status === "completed"
                        ? "bg-green-100 text-green-800"
                        : referral.status === "paid"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {referral.status === "completed"
                      ? "مكتملة"
                      : referral.status === "paid"
                      ? "مدفوعة"
                      : "في الانتظار"}
                  </span>
                  {referral.commissionAmount > 0 && (
                    <p className="text-sm text-green-600 font-medium mt-1">
                      +${referral.commissionAmount.toFixed(2)}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

ReferralPanel.propTypes = {
  // No props needed
};

export default ReferralPanel;
